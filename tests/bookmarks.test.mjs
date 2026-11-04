import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,parseSave} from '../src/engine.mjs';
import bank from '../src/bank.mjs';

const first=bank[0].id,second=bank[1].id;
const envelope=state=>({app:'curiona',version:1,state});

test('les nouveaux carnets ont des fiches indépendantes et une musique douce à 35 %',()=>{
  const a=freshState(),b=freshState();
  assert.deepEqual(a.bookmarks,[]);
  assert.equal(a.musicVolume,35);
  a.bookmarks.push(first);
  assert.deepEqual(b.bookmarks,[]);
});

test('les anciens carnets gardent leur progression avec des valeurs de confort par défaut',()=>{
  const state=freshState();state.xp=125;state.points=450;state.music=false;
  delete state.bookmarks;delete state.musicVolume;
  const restored=parseSave(envelope(state),bank);
  assert.deepEqual(restored.bookmarks,[]);
  assert.equal(restored.musicVolume,35);
  assert.equal(restored.xp,125);
  assert.equal(restored.points,450);
  assert.equal(restored.music,false);
});

test('export et import conservent les fiches et dédupliquent sans réordonner',()=>{
  const state=freshState();state.bookmarks=[second,first,second];state.musicVolume=62;
  const restored=parseSave(JSON.parse(JSON.stringify(envelope(state))),bank);
  assert.deepEqual(restored.bookmarks,[second,first]);
  assert.equal(restored.musicVolume,62);
  assert.deepEqual(state.bookmarks,[second,first,second]);
});

test('les fiches étrangères à la banque sont ignorées pour la compatibilité',()=>{
  const state=freshState();state.bookmarks=['ancienne-fiche',first,'__proto__','autre-fiche'];
  assert.deepEqual(parseSave(envelope(state),bank).bookmarks,[first]);
});

test('une structure de fiches invalide est refusée sans modifier la sauvegarde source',()=>{
  for(const bookmarks of [null,{},first,[null],[42],[{id:first}],new Array(Math.max(2000,bank.length)+1).fill(first)]){
    const state=freshState();state.bookmarks=bookmarks;
    const before=structuredClone(state);
    assert.throws(()=>parseSave(envelope(state),bank),/Fiches sauvegardées invalides/);
    assert.deepEqual(state,before);
  }
});

test('les volumes de 0 à 100 sont conservés indépendamment du bouton musique',()=>{
  for(const musicVolume of [0,0.5,35,100]){
    const state=freshState();state.musicVolume=musicVolume;state.music=false;
    const restored=parseSave(envelope(state),bank);
    assert.equal(restored.musicVolume,musicVolume);
    assert.equal(restored.music,false);
  }
});

test('les volumes non numériques, non finis ou hors limites sont refusés',()=>{
  for(const musicVolume of [null,'35',NaN,Infinity,-1,100.01,[],{}]){
    const state=freshState();state.musicVolume=musicVolume;
    const before=structuredClone(state);
    assert.throws(()=>parseSave(envelope(state),bank),/Volume musical invalide/);
    assert.deepEqual(state,before);
  }
});
