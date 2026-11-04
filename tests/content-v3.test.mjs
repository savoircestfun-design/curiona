import test from 'node:test';
import assert from 'node:assert/strict';
import bank,{LEGACY_QUESTIONS} from '../src/bank.mjs';
import additions from '../src/content-v3/index.mjs';
import {CATEGORIES,filterQuestions,freshState,parseSave,recordAnswer} from '../src/engine.mjs';

test('les nouveaux niveaux extrêmes remplacent le calibrage précédent sans retirer de notion',()=>{
  assert.equal(LEGACY_QUESTIONS.length,1800);
  assert.equal(additions.length,2700);
  const historicalIds=new Set(LEGACY_QUESTIONS.map(q=>q.id));
  assert.ok(additions.every(q=>!historicalIds.has(q.id)));
  for(const category of CATEGORIES.filter(c=>!['prevention','politics'].includes(c.id))){
    const added=additions.filter(q=>q.category===category.id);
    assert.equal(added.length,200);
    assert.equal(added.filter(q=>q.difficulty===1).length,100);
    assert.equal(added.filter(q=>q.difficulty===4).length,100);
    assert.ok(bank.filter(q=>q.category===category.id&&[1,4].includes(q.difficulty)).every(q=>!historicalIds.has(q.id)));
  }
  assert.ok(additions.every(q=>typeof q.source==='string'&&q.source.startsWith('https://')), 'Les ajouts donnent une référence de lecture');
});

test('Politique propose le mélange général et chaque continent dans tous les modes solo',()=>{
  const state=freshState();
  for(const q of bank)state.questions[q.id]={nextDue:0};
  const politics=CATEGORIES.find(c=>c.id==='politics');
  for(const mode of ['general','specific','custom','relax','challenge','review']){
    const config={mode,scope:'single',themes:['politics'],difficulty:'adaptive'};
    assert.equal(filterQuestions(bank,config,state,1).length,400);
    for(const continent of politics.subs){
      const selected=filterQuestions(bank,{...config,themes:['politics::'+continent],difficulty:4},state,1);
      assert.ok(selected.length>=10);
      assert.ok(selected.every(q=>q.category==='politics'&&q.subtheme===continent&&q.difficulty===4));
    }
  }
});

test('un ancien carnet couvrant les 1 800 notions conserve ses acquis et accepte toutes les nouvelles fiches',()=>{
  const previous=freshState();
  for(const [index,q] of LEGACY_QUESTIONS.entries()){
    const right=index%3!==0,selected=right?q.correct:(q.correct+1)%q.options.length;
    recordAnswer(previous,q,right,right?1:0,'specific',1000+index,selected);
  }
  previous.badges=['first','curious','expert'];
  previous.bookmarks=bank.map(q=>q.id);
  const untouched=structuredClone(previous);
  const restored=parseSave({app:'curiona',version:1,state:previous},bank);
  for(const key of ['xp','points','total','correct','expertCorrect','questions','topics','subtopics','badges','bookmarks'])assert.deepEqual(restored[key],previous[key],key);
  assert.deepEqual(previous,untouched);
  assert.equal(restored.bookmarks.length,4500);
});

test('les cas chiffrés Expert tiennent compte des étapes, pertes et unités indiquées',()=>{
  const expected={
    'v3-daily-126':'24 min','v3-daily-128':'12 paquets','v3-daily-130':'80 min',
    'v3-daily-131':'625','v3-daily-135':'10 %','v3-daily-141':'596 m',
    'v3-daily-147':'10','v3-daily-148':'40 °C','v3-daily-176':'7,5 kWh',
    'v3-daily-178':'3,6 h','v3-daily-184':'17,4 %','v3-daily-191':'2,4 m²·K/W',
    'v3-daily-192':'0,38 W/(m²·K)','v3-daily-198':'64,8 kJ','v3-daily-200':'260 Wh'
  };
  for(const [id,answer] of Object.entries(expected)){
    const q=bank.find(q=>q.id===id);assert.ok(q,id);assert.equal(q.options[q.correct],answer,id);
  }
});
