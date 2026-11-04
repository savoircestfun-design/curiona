import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import bank,{BASE_QUESTIONS,LEGACY_QUESTIONS} from '../src/bank.mjs';
import {CATEGORIES,parseSave,freshState,recordAnswer,filterQuestions,validateBank} from '../src/engine.mjs';

test('toutes les questions historiques conservent exactement leur identifiant et leur contenu',()=>{
  const hashes=JSON.parse(readFileSync(new URL('fixtures/legacy-question-hashes.json',import.meta.url),'utf8'));
  for(const file of ['nature','sciences','culture']){
    const current=readFileSync(new URL(`../dist/data/${file}.js`,import.meta.url),'utf8');
    assert.equal(createHash('sha256').update(current.replace(/\r\n/g,'\n')).digest('hex'),hashes[file]);
  }
  assert.equal(BASE_QUESTIONS.length,336);
  for(const q of LEGACY_QUESTIONS){
    const updated=bank.find(item=>item.id===q.id);
    assert.deepEqual(updated,{...q,difficulty:q.difficulty<=2?2:3},q.id);
  }
});
test('la banque est équilibrée et les nouveaux univers fonctionnent dans tous les modes',()=>{
  assert.equal(bank.length,4500);assert.equal(CATEGORIES.length,11);assert.equal(validateBank(bank),true);
  for(const category of ['language','daily','prevention','politics'])for(const mode of ['general','specific','custom','challenge','relax','review']){
    const state=freshState();if(mode==='review')for(const q of bank)state.questions[q.id]={nextDue:0};
    const selected=filterQuestions(bank,{scope:'single',mode,themes:[category],difficulty:'adaptive'},state,1);
    assert.equal(selected.length,category==='prevention'?500:400);assert.ok(selected.every(q=>q.category===category));
  }
});
test('la sauvegarde précédente se charge avec les nouveaux univers sans changer les acquis',()=>{
  const state=freshState(),q=BASE_QUESTIONS[0];recordAnswer(state,q,true,1,'specific',1000);state.bookmarks=[q.id];state.badges=['curious'];
  const before=JSON.parse(JSON.stringify(state));const restored=parseSave({app:'curiona',version:1,state:before},bank);
  assert.equal(restored.xp,state.xp);assert.deepEqual(restored.questions,state.questions);assert.deepEqual(restored.bookmarks,state.bookmarks);assert.deepEqual(restored.badges,['curious']);
  assert.equal(restored.topics.language,undefined);assert.equal(restored.topics.daily,undefined);
});
