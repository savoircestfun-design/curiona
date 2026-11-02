import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../src/bank.mjs';
import {freshState,recordAnswer,parseSave,parseSavedAnswer} from '../src/engine.mjs';
const q=bank.find(q=>q.options.length===4),wrong=(q.correct+1)%4;
const envelope=state=>({app:'curiona',version:1,state:structuredClone(state)});
test('le dernier choix faux reste disponible après une réussite et un transfert du carnet',()=>{
 const state=freshState();recordAnswer(state,q,false,0,'specific',1000,wrong);recordAnswer(state,q,true,1,'specific',2000,q.correct);
 const restored=parseSave(envelope(state),bank);assert.equal(restored.questions[q.id].lastWrongSelected,wrong);assert.equal(restored.questions[q.id].lastWrongAt,1000);assert.equal(restored.questions[q.id].correct,1);
});
test('le dépassement de temps est distinct d’une erreur ancienne dont le choix est inconnu',()=>{
 const state=freshState();recordAnswer(state,q,false,0,'challenge',1000,-1);assert.equal(parseSave(envelope(state),bank).questions[q.id].lastWrongSelected,-1);
 const legacy=envelope(state);delete legacy.state.questions[q.id].lastWrongAt;delete legacy.state.questions[q.id].lastWrongSelected;
 assert.equal(parseSave(legacy,bank).questions[q.id].lastWrongSelected,undefined);
});
test('les choix incohérents ou hors limites ne sont pas restaurés dans une fiche personnelle',()=>{
 const state=freshState();recordAnswer(state,q,false,0,'specific',1000,wrong);
 for(const bad of [q.correct,5,-2,'1']){const save=envelope(state);save.state.questions[q.id].lastWrongSelected=bad;assert.throws(()=>parseSave(save,bank),/erreur invalide/);}
 assert.throws(()=>parseSavedAnswer({id:q.id,correct:false,selected:q.correct},q),/Choix/);
 assert.deepEqual(parseSavedAnswer({id:q.id,correct:false,selected:wrong,answeredAt:1000},q),{id:q.id,correct:false,selected:wrong,answeredAt:1000});
});
