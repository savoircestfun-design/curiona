import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../src/bank.mjs';
import {CATEGORIES,freshState} from '../src/engine.mjs';
import {studySelection} from '../src/study.mjs';

test('une fiche pour apprendre fonctionne sans carnet et couvre tous les univers',()=>{
  const selected=studySelection(bank,freshState(),{kind:'learn'});
  assert.equal(selected.total,4500);assert.equal(selected.items.length,20);assert.equal(selected.parts,225);
  assert.deepEqual(new Set(selected.items.map(item=>item.question.category)),new Set(CATEGORIES.map(c=>c.id)));
});
test('les parties de découverte sont complètes, stables et sans doublons entre PDF',()=>{
  const ids=[];
  for(let part=1;part<=90;part++)ids.push(...studySelection(bank,freshState(),{kind:'learn',batchSize:50,part}).items.map(item=>item.id));
  assert.equal(ids.length,4500);assert.equal(new Set(ids).size,4500);
  assert.deepEqual(ids.slice(50,100),studySelection(bank,freshState(),{kind:'learn',batchSize:50,part:2}).items.map(item=>item.id));
});
test('une fiche précise respecte univers, sous-thème et difficulté simultanément',()=>{
  const selected=studySelection(bank,freshState(),{kind:'learn',theme:'language::Grammaire',difficulty:4,batchSize:'all'});
  assert.equal(selected.total,25);assert.equal(selected.parts,1);
  assert.ok(selected.items.every(item=>item.question.category==='language'&&item.question.subtheme==='Grammaire'&&item.question.difficulty===4));
  assert.equal(studySelection(bank,{}, {kind:'learn',theme:'inconnu'}).total,0);
});
test('mes erreurs conserve les questions déjà manquées et distingue le choix zéro du temps écoulé',()=>{
  const first=bank.find(q=>q.correct!==0&&q.options.length===4),second=bank.find(q=>q.id!==first.id);
  const state=freshState();
  state.questions[first.id]={seen:3,correct:2,box:2,lastSeen:300,lastWrongSelected:0,lastWrongAt:100};
  state.questions[second.id]={seen:1,correct:0,box:0,lastSeen:200,lastWrongSelected:-1,lastWrongAt:200};
  const selected=studySelection(bank,state,{kind:'errors'});
  assert.equal(selected.total,2);
  const firstItem=selected.items.find(item=>item.id===first.id),secondItem=selected.items.find(item=>item.id===second.id);
  assert.equal(firstItem.wrong.text,first.options[0]);assert.equal(firstItem.wrong.recorded,true);
  assert.match(secondItem.wrong.text,/temps écoulé/);assert.equal(secondItem.wrong.selected,-1);
  assert.equal(firstItem.answer,first.options[first.correct]);
});
test('les anciennes erreurs restent révisables sans inventer la réponse choisie',()=>{
  const q=bank[0],state=freshState();state.questions[q.id]={seen:1,correct:0,box:0,lastSeen:100};
  const item=studySelection(bank,state,{kind:'errors'}).items[0];
  assert.equal(item.wrong.recorded,false);assert.equal(item.wrong.selected,null);
  assert.match(item.wrong.text,/n’a pas été enregistrée/);
});
test('la révision inclut les notions déjà vues et place les moins consolidées en premier',()=>{
  const [first,second,third]=bank,state=freshState();
  state.questions[first.id]={seen:5,correct:5,box:5,nextDue:900};
  state.questions[second.id]={seen:2,correct:1,box:0,nextDue:100};
  state.questions[third.id]={seen:2,correct:2,box:2,nextDue:200};
  assert.deepEqual(studySelection(bank,state,{kind:'review'}).items.map(item=>item.id),[second.id,third.id,first.id]);
  assert.equal(studySelection(bank,freshState(),{kind:'review'}).total,0);
});
test('le PDF des erreurs d’une partie reste limité aux questions de cette partie',()=>{
  const [first,second,third]=bank,state=freshState();
  for(const q of [first,second,third])state.questions[q.id]={seen:1,correct:0,box:0,lastSeen:100};
  const selected=studySelection(bank,state,{kind:'errors',questionIds:[second.id,second.id,'étranger']});
  assert.deepEqual(selected.items.map(item=>item.id),[second.id]);
  assert.equal(studySelection(bank,state,{kind:'errors',questionIds:[]}).total,0);
});
test('la sélection entière est disponible explicitement sans modifier les données du joueur',()=>{
  const state=freshState(),before=JSON.stringify(state),beforeIds=bank.map(q=>q.id);
  const selected=studySelection(bank,state,{kind:'learn',theme:'science',batchSize:'all',part:999});
  assert.equal(selected.items.length,400);assert.equal(selected.part,1);assert.equal(selected.parts,1);
  assert.equal(selected.start,1);assert.equal(selected.end,400);
  assert.equal(JSON.stringify(state),before);assert.deepEqual(bank.map(q=>q.id),beforeIds);
});
