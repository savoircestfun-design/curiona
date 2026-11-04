// Run only after publication: node scripts/live-groups-qa.mjs --confirm-production
// Creates clearly named QA participants and two QA social profiles. Private
// credentials remain in memory; only check labels and counts enter the report.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import bank from '../src/bank.mjs';

if(!process.argv.includes('--confirm-production'))throw Error('Production QA requires the explicit --confirm-production flag after publication.');
const endpoint='https://curiona-battles.biensur68.chatgpt.site/api';
const root=fileURLToPath(new URL('../',import.meta.url));
const stamp=Date.now().toString(36).slice(-6),checks=[],cleanupFailures=[];
const participants=[],profiles=[];
const byId=new Map(bank.map(q=>[q.id,q]));
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function check(condition,label){if(!condition)throw Error(label);checks.push(label);console.log('✓ '+label);}
async function api(action,data={},token,expected=200){
  await delay(90);
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://savoircestfun-design.github.io',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify({action,...data}),signal:AbortSignal.timeout(15000),cache:'no-store'});
  let result;try{result=await response.json();}catch{throw Error(action+' : réponse JSON illisible.');}
  if(response.status!==expected)throw Error(action+' : statut HTTP '+response.status+' au lieu de '+expected+'.');
  return result;
}
function remember(data){
  if(!data?.room?.code||!data.token||!data.playerId)throw Error('Entrée QA non confirmée par le serveur.');
  const actor={code:data.room.code,token:data.token,playerId:data.playerId};participants.push(actor);return actor;
}
function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),value=>value.toString(16).padStart(2,'0')).join('');}
async function cleanup(){
  for(const actor of [...participants].reverse()){
    try{await api('leave',{code:actor.code},actor.token);}catch{cleanupFailures.push('Sortie non confirmée pour un participant QA.');}
  }
  if(profiles.length===2){
    try{await api('friend-remove',{friendId:profiles[1].profile.id},profiles[0].token);}catch{cleanupFailures.push('Suppression de l’amitié QA non confirmée.');}
  }
}

let failure=null;
try{
  check(bank.length===4400&&bank.some(q=>q.category==='politics'),'La QA utilise la banque finale de 4 400 questions.');
  const title='QA Curiona mondial '+stamp;
  const created=await api('create',{name:'QA Monde '+stamp+' 1',title,themes:['nature','politics'],difficulty:'all',count:8,maxPlayers:8,visibility:'public',listed:true,password:''});
  const host=remember(created),actors=[host];
  check(created.room.status==='waiting'&&created.room.visibility==='public'&&!created.room.locked&&same(created.room.themes,['nature','politics']),'Création d’un groupe mondial ouvert Nature + Politique, en attente.');
  const directory=await api('list',{search:stamp}),card=directory.rooms.find(room=>room.code===host.code);
  check(!!card&&same(card.themes,['nature','politics'])&&card.difficulty==='all'&&card.count===8&&card.questionCount===8&&card.players===1&&card.maxPlayers===8&&card.freePlaces===7&&card.connectedPlayers===1&&card.status==='waiting'&&card.joinable===true,'La liste mondiale présente le mélange, le niveau, huit questions et les places disponibles.');
  check(!JSON.stringify(directory).includes(host.token)&&!Object.hasOwn(card,'deck'),'La découverte du groupe ne divulgue ni accès privé ni paquet de questions.');
  const direct=await api('join',{code:card.code,name:'QA Monde '+stamp+' 2'});actors.push(remember(direct));
  check(direct.room.status==='waiting'&&direct.room.players.length===2,'Le bouton de salon peut rejoindre directement sans mot de passe et sans lancer la partie.');
  let latest=direct.room;
  for(let index=3;index<=8;index++){
    const joined=await api('join',{code:card.code,name:'QA Monde '+stamp+' '+index});actors.push(remember(joined));latest=joined.room;
  }
  check(latest.status==='waiting'&&latest.players.length===8&&latest.players.every(player=>actors.some(actor=>actor.playerId===player.id)),'Les huit participants QA partagent le salon d’attente jusqu’au lancement de l’hôte.');
  check(!(await api('list',{search:stamp})).rooms.some(room=>room.code===host.code),'Le salon mondial complet disparaît des groupes joignables.');
  await api('start',{code:host.code,roundId:1},actors[1].token,403);
  check(true,'Un invité ne peut pas lancer la partie.');
  const chatText='QA : même groupe, même conversation après la manche.';
  await api('chat-send',{code:host.code,text:chatText,clientId:crypto.randomUUID()},host.token);
  let {room}=await api('start',{code:host.code,roundId:1},host.token);
  check(room.status==='playing'&&room.players.length===8,'L’hôte lance manuellement la manche mondiale à huit joueurs.');
  for(const actor of actors.slice(1)){
    const snapshot=await api('status',{code:host.code},actor.token);
    if(!same(snapshot.room.question,room.question))throw Error('Les huit joueurs doivent recevoir la même question et les mêmes choix.');
  }
  check(true,'Les huit accès reçoivent la même question et le même ordre des réponses.');
  const played=[],categories=new Map(),totals=new Map(actors.map(actor=>[actor.playerId,0]));
  for(let index=0;index<8;index++){
    const source=byId.get(room.question?.id);
    if(!source)throw Error('Une question du serveur ne figure pas dans la banque publiée attendue.');
    const selected=room.question.options.indexOf(source.options[source.correct]);
    if(selected<0)throw Error('La bonne réponse ne figure pas dans les choix transmis.');
    played.push(source.id);categories.set(source.category,(categories.get(source.category)||0)+1);
    for(const actor of actors)({room}=await api('answer',{code:host.code,roundId:1,questionIndex:index,selected},actor.token));
    if(!room.reveal||room.reveal.answers.length!==8||!room.reveal.answers.every(answer=>answer.correct&&answer.points>0))throw Error('La correction commune des huit réponses correctes est incomplète.');
    for(const answer of room.reveal.answers){
      if(answer.points!==answer.basePoints+answer.streakBonus+answer.speedBonus||answer.speedBonus<0||answer.speedBonus>100)throw Error('Le détail du score serveur est incohérent.');
      totals.set(answer.playerId,(totals.get(answer.playerId)||0)+answer.points);
    }
    ({room}=await api('next',{code:host.code,roundId:1},host.token));
  }
  check(new Set(played).size===8&&categories.get('nature')===4&&categories.get('politics')===4,'La manche propose quatre questions Nature et quatre Politique, sans répétition.');
  check(room.status==='finished'&&room.players.every(player=>player.correct===8&&player.score===totals.get(player.id)),'Le bilan cumule correctement les points serveur des huit joueurs.');
  const maxScore=Math.max(...room.players.map(player=>player.score));
  check(same([...room.winners].sort(),room.players.filter(player=>player.score===maxScore).map(player=>player.id).sort()),'Le classement désigne le ou les gagnants selon les totaux réels.');
  ({room}=await api('round-next',{code:host.code,roundId:1,themes:['politics::Océanie'],difficulty:4,count:50,maxPlayers:8,visibility:'public'},host.token));
  const expectedOceania=bank.filter(q=>q.category==='politics'&&q.subtheme==='Océanie'&&q.difficulty===4).length;
  check(expectedOceania===10&&room.code===host.code&&room.roundId===2&&room.status==='waiting'&&room.count===50&&room.questionCount===10&&same(room.themes,['politics::Océanie'])&&room.difficulty===4,'Partie suivante garde le code et prépare Politique · Océanie Expert, raccourcie à dix questions.');
  for(const actor of actors){
    const snapshot=await api('status',{code:host.code},actor.token);
    if(snapshot.room.roundId!==2||!snapshot.room.players.some(player=>player.id===actor.playerId))throw Error('Un accès existant a été perdu entre les manches.');
  }
  check(room.players.every(player=>player.score===0&&player.correct===0&&player.departures===0)&&room.previousResult?.roundId===1,'Les scores et sorties sont réinitialisés et le bilan précédent est conservé.');
  check(true,'Les huit joueurs retrouvent la manche suivante avec leurs accès existants.');
  const chat=await api('chat-list',{code:host.code},actors[1].token);
  check(chat.messages.some(message=>message.text===chatText),'La conversation du groupe est conservée entre les manches.');
  await api('answer',{code:host.code,roundId:1,questionIndex:0,selected:0},host.token,409);
  check(true,'Une réponse tardive de l’ancienne manche est refusée.');

  for(const suffix of ['H','I']){
    const profile=await api('profile-create',{name:'QA Amis '+stamp+' '+suffix});
    if(!profile.profile?.id||!profile.token)throw Error('Le profil QA n’a pas été confirmé.');
    profiles.push(profile);
  }
  await api('friend-request',{friendCode:profiles[1].profile.friendCode},profiles[0].token);
  await api('friend-respond',{friendId:profiles[0].profile.id,accept:true},profiles[1].token);
  const privateCreated=await api('create',{name:profiles[0].profile.name,title:'QA Curiona privé '+stamp,themes:['nature','politics'],difficulty:1,count:12,maxPlayers:3,visibility:'private',listed:false,password:'QA-'+crypto.randomUUID()});
  const privateHost=remember(privateCreated);
  check(privateCreated.room.locked&&privateCreated.room.visibility==='private'&&!(await api('list',{search:stamp})).rooms.some(item=>item.code===privateHost.code),'Le groupe privé protégé reste absent de la liste mondiale.');
  const sent=await api('invite-send',{code:privateHost.code,roomToken:privateHost.token,friendId:profiles[1].profile.id},profiles[0].token);
  const inbox=await api('social-status',{},profiles[1].token),invitation=inbox.invitations.find(item=>item.id===sent.inviteId);
  check(!!invitation&&same(invitation.themes,['nature','politics'])&&invitation.questionCount===12&&invitation.maxPlayers===3&&invitation.visibility==='private','L’ami reçoit une invitation privée présentant les options du groupe.');
  const joinToken=randomToken(),accepted=await api('invite-accept',{inviteId:invitation.id,joinToken},profiles[1].token);
  const privateGuest=remember(accepted);
  check(accepted.token===joinToken&&accepted.room.code===privateHost.code&&accepted.room.status==='waiting'&&accepted.room.players.length===2&&accepted.room.players.some(player=>player.id===privateGuest.playerId&&player.profileId===profiles[1].profile.id),'L’invitation rejoint le salon protégé sans transmettre de code ni de mot de passe dans l’acceptation.');
  const retry=await api('invite-accept',{inviteId:invitation.id,joinToken},profiles[1].token);
  check(retry.playerId===privateGuest.playerId&&retry.token===joinToken&&retry.room.players.length===2,'Une nouvelle tentative d’acceptation retrouve le même participant sans doublon.');
  const privateStarted=await api('start',{code:privateHost.code,roundId:1},privateHost.token);
  check(privateStarted.room.status==='playing'&&privateStarted.room.players.length===2,'Le groupe privé se lance également par une action de son hôte.');
}catch(error){
  failure=error instanceof Error?error.message:'Échec de QA production.';
}finally{
  await cleanup();
  await mkdir(path.join(root,'artifacts'),{recursive:true});
  const report={date:new Date().toISOString(),endpoint,checks,passed:checks.length,failure,cleanupFailures,testParticipantsCreated:participants.length,testProfilesCreated:profiles.length,note:'Les participants QA ont une demande de sortie et l’amitié QA une demande de suppression. Les profils QA persistent : aucun endpoint de suppression de profil n’est disponible. Aucun jeton ni mot de passe n’est enregistré dans ce rapport.'};
  await writeFile(path.join(root,'artifacts/live-groups-qa-report.json'),JSON.stringify(report,null,2));
}
if(failure||cleanupFailures.length){console.error(failure||'Un nettoyage QA reste à vérifier.');for(const message of cleanupFailures)console.error(message);process.exitCode=1;}
else console.log(checks.length+' contrôles API publiés réussis ; participants QA sortis et amitié QA retirée.');
