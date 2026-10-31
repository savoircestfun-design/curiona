import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES, BADGES, freshState, shuffle, shuffledOptions, isCorrect,
  filterQuestions, pickQuestion, reward, recordAnswer, earnedBadges,
  playerLevel, validateBank, parseSave
} from '../src/engine.mjs';
import nature from '../dist/data/nature.js';
import sciences from '../dist/data/sciences.js';
import culture from '../dist/data/culture.js';
import variants from '../src/variants.mjs';

const bank = [...nature, ...sciences, ...culture];
const DAY = 86_400_000;
const config = (overrides = {}) => ({ mode: 'general', difficulty: 'adaptive', themes: [], count: 12, ...overrides });
const saveEnvelope = (state) => JSON.parse(JSON.stringify({ app: 'curiona', version: 1, state }));
function rng(seed = 2026) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}
const question = bank.find(q => q.category === 'math' && q.difficulty === 1);

test('la banque complète contient 336 questions, sept catégories équilibrées et quatre difficultés', () => {
  assert.equal(bank.length, 336);
  assert.equal(validateBank(bank), true);
  assert.equal(new Set(bank.map(q => q.id)).size, bank.length);
  assert.ok(bank.some(q => q.type === 'boolean'));
  assert.ok(bank.filter(q => q.options.length === 4).length > 250);
  for (const category of CATEGORIES) {
    assert.equal(bank.filter(q => q.category === category.id).length, 48, category.id);
    for (const subtheme of category.subs) {
      for (let difficulty = 1; difficulty <= 4; difficulty++) {
        assert.equal(bank.filter(q => q.category === category.id && q.subtheme === subtheme && q.difficulty === difficulty).length, 4, `${category.id}/${subtheme}/${difficulty}`);
      }
    }
  }
});

test('la validation refuse les doublons et une correction détachée des propositions', () => {
  assert.throws(() => validateBank([question, structuredClone(question)]), /dupliqué/);
  assert.throws(() => validateBank([{ ...question, correct: question.options.length }]), /Correction invalide/);
  assert.throws(() => validateBank([{ ...question, options: ['copie', 'copie', 'trois', 'quatre'] }]), /Propositions invalides/);
  assert.throws(() => validateBank([{ ...question, difficulty: 5 }]), /Difficulté invalide/);
});

test('les 21 formulations alternatives référencent des questions connues et couvrent les 21 sous-thèmes', () => {
  assert.equal(Object.keys(variants).length, 21);
  const covered = new Set();
  for (const [id, alternate] of Object.entries(variants)) {
    const q = bank.find(q => q.id === id);
    assert.ok(q, `Identifiant connu : ${id}`);
    assert.equal(typeof alternate, 'string');
    assert.ok(alternate.trim().length > 25, id);
    assert.notEqual(alternate, q.question, id);
    covered.add(`${q.category}::${q.subtheme}`);
  }
  assert.deepEqual(covered, new Set(CATEGORIES.flatMap(c => c.subs.map(sub => `${c.id}::${sub}`))));
});

test('le mélange préserve le tableau initial et chaque identité de réponse', () => {
  const random = rng();
  for (const q of bank) {
    const original = [...q.options];
    const orders = new Set();
    for (let i = 0; i < 20; i++) {
      const options = shuffledOptions(q, random);
      orders.add(options.map(o => o.id).join(','));
      assert.equal(options.length, q.options.length);
      assert.equal(new Set(options.map(o => o.id)).size, q.options.length);
      assert.equal(options.filter(o => isCorrect(q, o.id)).length, 1);
      assert.equal(options.find(o => isCorrect(q, o.id)).text, q.options[q.correct]);
      for (const option of options) assert.equal(option.text, original[option.id]);
    }
    assert.ok(orders.size > 1, q.id);
    assert.deepEqual(q.options, original);
  }
  assert.deepEqual(shuffle([], random), []);
  assert.deepEqual(shuffle(['unique'], random), ['unique']);
});

test('la valeur 0 est une réponse valide et le dépassement de temps ne peut être correct', () => {
  const q = { ...question, correct: 0 };
  assert.equal(isCorrect(q, 0), true);
  assert.equal(isCorrect(q, -1), false);
  assert.equal(isCorrect(q, 1), false);
});

test('points et XP récompensent le niveau et plafonnent le bonus de série', () => {
  assert.deepEqual(reward(1, true, 1), { points: 100, xp: 30 });
  assert.deepEqual(reward(4, true, 1), { points: 175, xp: 45 });
  assert.deepEqual(reward(2, true, 5), { points: 165, xp: 35 });
  assert.deepEqual(reward(4, true, 999), { points: 225, xp: 45 });
  assert.deepEqual(reward(4, false, 0), { points: 0, xp: 8 });
});

test('une série, une erreur et une reprise donnent des totaux cohérents sans retrait de points', () => {
  const state = freshState();
  let streak = 0;
  let expectedPoints = 0, expectedXP = 0;
  for (const [index, correct] of [true, true, false, true].entries()) {
    streak = correct ? streak + 1 : 0;
    const gain = recordAnswer(state, question, correct, streak, 'relax', 1_000 + index);
    expectedPoints += gain.points;
    expectedXP += gain.xp;
  }
  assert.equal(state.points, expectedPoints);
  assert.equal(state.xp, expectedXP);
  assert.equal(state.points, 310);
  assert.equal(state.xp, 98);
  assert.equal(state.total, 4);
  assert.equal(state.correct, 3);
  assert.equal(state.bestStreak, 2);
  assert.equal(state.questions[question.id].seen, 4);
  assert.equal(state.questions[question.id].correct, 3);
});

test('le niveau de joueur est stable aux seuils et croît avec les XP', () => {
  assert.equal(playerLevel(0), 1);
  assert.equal(playerLevel(99), 1);
  assert.equal(playerLevel(100), 2);
  assert.equal(playerLevel(399), 2);
  assert.equal(playerLevel(400), 3);
  assert.equal(playerLevel(900), 4);
});

test('les filtres de difficulté restent stricts, y compris en révision', () => {
  const state = freshState();
  for (const q of bank) state.questions[q.id] = { nextDue: 0 };
  for (let difficulty = 1; difficulty <= 4; difficulty++) {
    const selected = filterQuestions(bank, config({ difficulty }), state, 1);
    assert.equal(selected.length, 84);
    assert.ok(selected.every(q => q.difficulty === difficulty));
    const reviewed = filterQuestions(bank, config({ mode: 'review', difficulty }), state, 1);
    assert.equal(reviewed.length, 84);
    assert.ok(reviewed.every(q => q.difficulty === difficulty));
  }
  assert.equal(filterQuestions(bank, config({ difficulty: 9 }), state).length, 0);
});

test('un univers complet et un sous-thème précis donnent les ensembles attendus', () => {
  const state = freshState();
  const allNature = filterQuestions(bank, config({ mode: 'specific', themes: ['nature'] }), state);
  assert.equal(allNature.length, 48);
  assert.ok(allNature.every(q => q.category === 'nature'));
  const insects = filterQuestions(bank, config({ mode: 'specific', themes: ['animals::Insectes'] }), state);
  assert.equal(insects.length, 16);
  assert.ok(insects.every(q => q.category === 'animals' && q.subtheme === 'Insectes'));
  const insectsExpert = filterQuestions(bank, config({ mode: 'specific', themes: ['animals::Insectes'], difficulty: 4 }), state);
  assert.equal(insectsExpert.length, 4);
});

test('le mélange personnalisé est une union sans doublons et accepte des sous-thèmes', () => {
  const state = freshState();
  const selected = filterQuestions(bank, config({ mode: 'custom', themes: ['math', 'math::Calcul', 'science::Astronomie'] }), state);
  assert.equal(selected.length, 64);
  assert.equal(new Set(selected.map(q => q.id)).size, selected.length);
  assert.ok(selected.every(q => q.category === 'math' || (q.category === 'science' && q.subtheme === 'Astronomie')));
  assert.deepEqual(filterQuestions(bank, config({ mode: 'custom', themes: [] }), state), []);
  assert.deepEqual(filterQuestions(bank, config({ mode: 'specific', themes: ['nature::Insectes'] }), state), []);
});

test('général et détente donnent accès au mélange complet indépendamment du dernier thème choisi', () => {
  const state = freshState();
  for (const mode of ['general', 'relax', 'challenge']) {
    assert.equal(filterQuestions(bank, config({ mode, themes: ['math'] }), state).length, 336);
  }
});

test('une partie épuise un filtre court sans aucune répétition puis s’arrête proprement', () => {
  const state = freshState();
  const cfg = config({ mode: 'specific', themes: ['animals::Insectes'], difficulty: 4 });
  const used = [], random = rng(12);
  for (let i = 0; i < 4; i++) {
    const next = pickQuestion(bank, state, cfg, used, random);
    assert.ok(next);
    assert.equal(next.difficulty, 4);
    assert.equal(next.subtheme, 'Insectes');
    assert.ok(!used.includes(next.id));
    used.push(next.id);
  }
  assert.equal(pickQuestion(bank, state, cfg, used, random), null);
  assert.equal(pickQuestion([], state, cfg, [], random), null);
});

test('la banque entière peut être parcourue une fois sans doublon dans une même partie', () => {
  const state = freshState(), used = [], random = rng(34);
  for (let i = 0; i < bank.length; i++) {
    const next = pickQuestion(bank, state, config(), used, random);
    assert.ok(next, `Question ${i + 1}`);
    assert.ok(!used.includes(next.id));
    used.push(next.id);
  }
  assert.equal(new Set(used).size, 336);
  assert.equal(pickQuestion(bank, state, config(), used, random), null);
});

test('l’adaptation monte après trois réussites et redescend après deux erreurs, séparément par univers', () => {
  const state = freshState();
  const math = bank.find(q => q.category === 'math');
  const animal = bank.find(q => q.category === 'animals');
  for (let i = 0; i < 3; i++) recordAnswer(state, math, true, i + 1, 'general', 100 + i);
  assert.equal(state.topics.math.level, 2);
  assert.equal(state.topics.math.momentum, 0);
  assert.equal(state.topics.animals, undefined);
  recordAnswer(state, animal, false, 0, 'general', 110);
  assert.equal(state.topics.animals.level, 1);
  assert.equal(state.topics.math.level, 2);
  recordAnswer(state, math, false, 0, 'general', 111);
  assert.equal(state.topics.math.level, 2);
  recordAnswer(state, math, false, 0, 'general', 112);
  assert.equal(state.topics.math.level, 1);
  for (let i = 0; i < 30; i++) recordAnswer(state, math, true, i + 1, 'general', 200 + i);
  assert.equal(state.topics.math.level, 4);
  for (let i = 0; i < 30; i++) recordAnswer(state, math, false, 0, 'general', 300 + i);
  assert.equal(state.topics.math.level, 1);
});

test('une erreur interrompt l’élan adaptatif sans baisser à elle seule un niveau acquis', () => {
  const state = freshState();
  state.topics.math = { level: 2, momentum: 2, total: 8, correct: 6 };
  recordAnswer(state, question, false, 0, 'relax', 100);
  assert.equal(state.topics.math.level, 2);
  assert.equal(state.topics.math.momentum, -1);
  recordAnswer(state, question, true, 1, 'relax', 200);
  assert.equal(state.topics.math.momentum, 1);
});

test('le tirage adaptatif favorise le niveau propre à chaque thème', () => {
  const state = freshState();
  const fixture = [1, 2, 3, 4].map(difficulty => ({ ...question, id: `fixture-${difficulty}`, difficulty }));
  state.topics.math = { level: 1 };
  assert.equal(pickQuestion(fixture, state, config(), [], () => 0.5, 1_000).difficulty, 1);
  state.topics.math.level = 4;
  assert.equal(pickQuestion(fixture, state, config(), [], () => 0.5, 1_000).difficulty, 4);
});

test('les questions très vues ou récentes sont défavorisées au prochain tirage', () => {
  const state = freshState();
  const old = { ...question, id: 'seen' }, unseen = { ...question, id: 'unseen' };
  state.questions.seen = { seen: 20, box: 2, nextDue: 20_000_000, lastSeen: 1_000_000 };
  const selected = pickQuestion([old, unseen], state, config({ difficulty: 1 }), [], () => 0.2, 1_000_001);
  assert.equal(selected.id, 'unseen');
});

test('une erreur revient en révision après dix minutes, jamais avant', () => {
  const state = freshState(), now = 1_000_000;
  recordAnswer(state, question, false, 0, 'general', now);
  assert.equal(state.questions[question.id].box, 0);
  assert.equal(state.questions[question.id].nextDue, now + 600_000);
  assert.deepEqual(filterQuestions(bank, config({ mode: 'review' }), state, now + 599_999), []);
  assert.deepEqual(filterQuestions(bank, config({ mode: 'review' }), state, now + 600_000).map(q => q.id), [question.id]);
});

test('les rappels réussis s’espacent de 1, 3, 7, 14 puis 30 jours ; une erreur réinitialise le délai', () => {
  const state = freshState();
  let now = 1_000_000;
  for (const [index, days] of [1, 3, 7, 14, 30, 30].entries()) {
    recordAnswer(state, question, true, index + 1, 'review', now);
    const saved = state.questions[question.id];
    assert.equal(saved.box, Math.min(index + 1, 5));
    assert.equal(saved.nextDue, now + days * DAY);
    assert.equal(filterQuestions(bank, config({ mode: 'review' }), state, saved.nextDue - 1).length, 0);
    now = saved.nextDue;
  }
  assert.equal(state.reviewCorrect, 6);
  recordAnswer(state, question, false, 0, 'review', now);
  assert.equal(state.questions[question.id].box, 0);
  assert.equal(state.questions[question.id].nextDue, now + 600_000);
  assert.equal(state.reviewCorrect, 6);
});

test('un carnet sans question apprise donne un mode Révision vide', () => {
  assert.deepEqual(filterQuestions(bank, config({ mode: 'review' }), freshState(), Date.now()), []);
  assert.equal(pickQuestion(bank, freshState(), config({ mode: 'review' })), null);
});

test('export JSON et import restaurent le carnet, les réponses, les badges et l’historique', () => {
  const state = freshState();
  recordAnswer(state, question, true, 1, 'general', 1_000_000);
  state.sound = true;
  state.badges = ['first'];
  state.history = [{ mode: 'general', score: 100, correct: 1, total: 1, xp: 30, date: 1_000_000, target: 0, abandoned: false, answers: [{ id: question.id, correct: true }] }];
  state.active = { arbitrary: 'une partie ne se réinjecte pas depuis un import' };
  const serialized = saveEnvelope(state), imported = parseSave(serialized, bank);
  assert.deepEqual(imported, { ...state, active: null });
  imported.questions[question.id].seen = 999;
  imported.history[0].answers[0].correct = false;
  assert.equal(serialized.state.questions[question.id].seen, 1);
  assert.equal(serialized.state.history[0].answers[0].correct, true);
});

test('une sauvegarde provenant d’une autre application ou version est refusée', () => {
  for (const input of [null, {}, { app: 'autre', version: 1, state: freshState() }, { app: 'curiona', version: 2, state: freshState() }]) {
    assert.throws(() => parseSave(input, bank), /sauvegarde Curiona compatible/);
  }
});

test('les statistiques et progressions corrompues sont refusées sans modifier le carnet source', () => {
  const cases = [
    state => { state.xp = -1; },
    state => { state.points = Infinity; },
    state => { state.total = '12'; },
    state => { state.correct = 1; },
    state => { state.questions = []; },
    state => { state.questions[question.id] = { seen: 1, correct: 2, box: 1, lastSeen: 1, nextDue: 2 }; },
    state => { state.questions[question.id] = { seen: 1, correct: 1, box: 6, lastSeen: 1, nextDue: 2 }; },
    state => { state.questions[question.id] = { seen: 1, correct: 1, box: 1, lastSeen: -1, nextDue: 2 }; },
    state => { state.topics.math = { level: 5, momentum: 0, total: 1, correct: 1 }; },
    state => { state.topics.math = { level: 1, momentum: 0, total: 1, correct: 2 }; },
    state => { state.history = {}; },
    state => { state.history = [{ mode: 'inventé', score: 0, correct: 0, total: 0, xp: 0, date: 0, target: 0, answers: [] }]; },
    state => { state.history = [{ mode: 'general', score: 100, correct: 1, total: 1, xp: 30, date: 0, target: 0, answers: [{ id: question.id, correct: 'oui' }] }]; }
  ];
  for (const corrupt of cases) {
    const state = freshState();
    corrupt(state);
    const before = structuredClone(state);
    assert.throws(() => parseSave({ app: 'curiona', version: 1, state }, bank));
    assert.deepEqual(state, before);
  }
});

test('les questions étrangères et badges inconnus sont ignorés, les propriétés arbitraires ne sont pas restaurées', () => {
  const state = freshState();
  state.questions.unknown = { seen: 1, correct: 0, box: 0, lastSeen: 0, nextDue: 0 };
  state.badges = ['first', 'intrus', 'first'];
  state.unsupported = '<script>indésirable</script>';
  const imported = parseSave(saveEnvelope(state), bank);
  assert.deepEqual(imported.questions, {});
  assert.deepEqual(imported.badges, ['first']);
  assert.equal(imported.unsupported, undefined);
});

test('un historique dont le total diffère du nombre de réponses est refusé', () => {
  const state = freshState();
  state.history = [{ mode: 'general', score: 100, correct: 1, total: 2, xp: 30, date: 1_000_000, target: 0, abandoned: false, answers: [{ id: question.id, correct: true }] }];
  assert.throws(() => parseSave(saveEnvelope(state), bank));
  state.history[0].total = 1;
  assert.equal(parseSave(saveEnvelope(state), bank).history[0].total, 1);
});

test('un historique dont le nombre de réussites contredit ses réponses est refusé', () => {
  const state = freshState();
  state.history = [{ mode: 'general', score: 100, correct: 1, total: 1, xp: 30, date: 1_000_000, target: 0, abandoned: false, answers: [{ id: question.id, correct: false }] }];
  assert.throws(() => parseSave(saveEnvelope(state), bank));
  state.history[0].answers[0].correct = true;
  assert.equal(parseSave(saveEnvelope(state), bank).history[0].correct, 1);
});

test('aucun badge gratuit au départ ; une partie interrompue ne débloque pas Premier pas', () => {
  const state = freshState();
  assert.deepEqual(earnedBadges(state), []);
  state.history = [{ mode: 'general', abandoned: true }];
  assert.deepEqual(earnedBadges(state), []);
  state.history[0].abandoned = false;
  assert.deepEqual(earnedBadges(state), ['first']);
});

test('les huit badges se débloquent selon leurs objectifs et ne se redonnent pas', () => {
  const state = freshState();
  state.bestStreak = 5;
  state.correct = 50;
  state.total = 100;
  state.reviewCorrect = 5;
  state.expertCorrect = 10;
  state.history = [{ mode: 'challenge', abandoned: false, score: 1200, target: 1200 }];
  for (const q of bank.slice(0, 100)) state.questions[q.id] = { seen: 1 };
  for (const c of CATEGORIES) state.topics[c.id] = { total: 1 };
  const earned = earnedBadges(state);
  assert.deepEqual(new Set(earned), new Set(BADGES.map(b => b.id)));
  state.badges.push(...earned);
  assert.deepEqual(earnedBadges(state), []);
});

test('un défi interrompu ou sous l’objectif ne débloque pas Cap atteint', () => {
  const state = freshState();
  state.history = [{ mode: 'challenge', abandoned: true, score: 1300, target: 1200 }];
  assert.ok(!earnedBadges(state).includes('challenge'));
  state.history = [{ mode: 'challenge', abandoned: false, score: 1199, target: 1200 }];
  assert.ok(!earnedBadges(state).includes('challenge'));
});

test('la dernière question ne revient pas immédiatement dans une nouvelle partie si un autre choix existe', () => {
  const state = freshState();
  const config = { mode: 'specific', difficulty: 4, count: 8, themes: ['animals::Insectes'] };
  const pool = filterQuestions(bank, config, state, 2_000_000);
  pool.forEach((q, i) => { state.questions[q.id] = { seen: 1, correct: 1, box: 1, lastSeen: 1_900_000 + i, nextDue: 90_000_000 }; });
  for (let i = 0; i < 100; i++) assert.notEqual(pickQuestion(bank, state, config, [], () => i / 100, 2_000_000).id, pool.at(-1).id);
  const used = pool.slice(0, -1).map(q => q.id);
  assert.equal(pickQuestion(bank, state, config, used, () => 0.5, 2_000_000).id, pool.at(-1).id);
});
