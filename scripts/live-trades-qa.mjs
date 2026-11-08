// Après publication : node scripts/live-trades-qa.mjs --confirm-production
// Un seul salon privé et deux participants QA, sans profil social ni message.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import bank from '../src/bank.mjs';
import {CATEGORIES} from '../src/engine.mjs';

if(!process.argv.includes('--confirm-production'))throw Error('Exécuter uniquement après publication avec --confirm-production.');
const endpoint='https://curiona-battles.biensur68.chatgpt.site/api';
const checks=[],actors=[],cleanupFailures=[];
const check=(value,label)=>{assert.ok(value,label);checks.push(label);console.log('✓ '+label);};
async function api(action,data={},token){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://savoircestfun-design.github.io',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify({action,...data}),signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,'HTTP '+action);
  return response.json();
}
const remember=result=>{const actor={code:result.room.code,token:result.token,playerId:result.playerId};actors.push(actor);return actor;};
let failure=null;
try{
  for(const file of ['index.html','game.bundle.js']){
    const response=await fetch('https://savoircestfun-design.github.io/curiona/'+file+'?qa='+Date.now(),{signal:AbortSignal.timeout(30000)});
    assert.equal(response.status,200,file);
    const live=Buffer.from(await response.arrayBuffer()),local=await readFile(new URL('../dist/'+file,import.meta.url));
    const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
    check(hash(live)===hash(local),'Le fichier publié correspond à la version vérifiée : '+file);
  }
  const created=await api('create',{name:'QA Métiers hôte',title:'QA Métiers privée',themes:['trades'],difficulty:'all',count:50,maxPlayers:2,visibility:'private'});
  const host=remember(created);
  check(created.room.status==='waiting'&&created.room.questionCount===50&&created.room.visibility==='private','La battle Métiers est créée en privé et attend son hôte');
  for(const subtheme of CATEGORIES.find(c=>c.id==='trades').subs){
    const {room}=await api('room-configure',{code:host.code,roundId:1,themes:['trades::'+subtheme],difficulty:4,count:50},host.token);
    check(room.questionCount===10&&room.themes[0]==='trades::'+subtheme,'Le serveur accepte le métier en Expert : '+subtheme);
  }
  await api('room-configure',{code:host.code,roundId:1,themes:['trades::Carreleur'],difficulty:3,count:8},host.token);
  const joined=await api('join',{code:host.code,name:'QA Métiers invité'}),guest=remember(joined);
  check(joined.room.status==='waiting'&&joined.room.players.length===2,'Deux joueurs restent en attente avant le lancement');
  const {room}=await api('start',{code:host.code,roundId:1},host.token);
  const other=await api('status',{code:host.code},guest.token);
  assert.deepEqual(room.question,other.room.question);
  const question=bank.find(q=>q.id===room.question.id);
  check(question?.category==='trades'&&question.subtheme==='Carreleur'&&question.difficulty===3,'Les deux joueurs reçoivent la même question de carreleur');
  const selected=room.question.options.indexOf(question.options[question.correct]);
  await api('answer',{code:host.code,roundId:1,questionIndex:0,selected},host.token);
  const corrected=await api('answer',{code:guest.code,roundId:1,questionIndex:0,selected},guest.token);
  check(corrected.room.reveal?.correct===selected&&corrected.room.players.every(p=>p.correct===1&&p.score>0),'Les réponses correctes donnent des points aux deux joueurs');
}catch(error){failure=error.message;}
finally{
  for(const actor of actors.reverse())try{await api('leave',{code:actor.code},actor.token);}catch{cleanupFailures.push('Sortie QA non confirmée');}
  await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
  await writeFile(new URL('../artifacts/live-trades-qa-report.json',import.meta.url),JSON.stringify({date:new Date().toISOString(),checks,failure,cleanupFailures},null,2));
}
if(failure||cleanupFailures.length)throw Error(failure||cleanupFailures.join(', '));
console.log(checks.length+' contrôles publiés réussis ; les deux participants QA ont quitté.');
