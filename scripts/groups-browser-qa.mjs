import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=process.cwd(),profile=await mkdtemp(path.join(tmpdir(),'curiona-groups-qa-')),delay=ms=>new Promise(r=>setTimeout(r,ms)),checks=[],errors=[],calls=[];
await mkdir(path.join(root,'artifacts'),{recursive:true});
const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore',windowsHide:true});
let ws,seq=0,holdStatus=false,heldStatus=null,failAcceptOnce=true,failJoinOnce=true,acceptedToken=null;const pending=new Map();
const profileData={id:'PROFILEABCDEF234',name:'Camille',friendCode:'CAML2345'},profileToken='b'.repeat(64),roomToken='a'.repeat(64);
const friend={id:'FRIENDABCDEF2345',name:'Léa',friendCode:'LEAA2345',online:false,lastSeen:Date.now()-100000,unread:0};
const player=(id,name)=>({id,name,profileId:id==='host'?profileData.id:null,score:300,correct:3,answered:true,connected:true,left:false,rank:1,strengths:[],weaknesses:[],departures:1,away:false,penalizedQuestions:1,focusPenalty:null});
let room={code:'GROUPA23',title:'Groupe des curieux',revision:0,roundId:1,status:'finished',hostId:'host',theme:'math',difficulty:'all',count:8,questionCount:8,maxPlayers:8,listed:false,locked:true,matchmaking:false,rules:{version:2,speedBonusMax:100,awayGraceMs:1000},players:[player('host','Camille'),player('guest','Ami')],questionIndex:7,question:null,reveal:null,deadline:null,winners:['host']};
let invitations=[{id:'INVITEABCDEF2345',code:'GROUPB23',title:'Les amis <img src=x>',theme:'nature',difficulty:1,count:12,from:{id:friend.id,name:'Léa'},expiresAt:Date.now()+1800000,roomStatus:'waiting'}];
const publicRooms=[
  {code:'WORLD234',title:'Nature et politique <img src=x>',hostName:'Léa',theme:'mixed',themes:['nature','politics'],visibility:'public',status:'waiting',difficulty:2,count:20,questionCount:12,players:3,connectedPlayers:3,maxPlayers:8,locked:false,joinable:true},
  {code:'SPACE234',title:'Cap sur les sciences',hostName:'Noé',theme:'science',themes:['science'],visibility:'public',status:'waiting',difficulty:4,count:8,questionCount:8,players:1,connectedPlayers:1,maxPlayers:4,locked:false,joinable:true}
];
const copyRoom=()=>({...structuredClone(room),serverNow:Date.now()});
function question(){return {id:'qa',question:'Quelle étoile éclaire la Terre ?',options:['Le Soleil','Sirius','Véga','Polaris'],category:'science',subtheme:'Astronomie',difficulty:1};}
async function handle(body,authorization){
  calls.push({body,authorization});
  if(body.action==='social-status')return {profile:profileData,friends:[friend],incoming:[],outgoing:[],blocked:[],invitations};
  if(body.action==='chat-list')return {messages:[{id:1,playerId:'guest',name:'Ami',text:'Même chat, nouvelle manche.',createdAt:Date.now()}]};
  if(body.action==='dm-list')return {messages:[]};
  if(body.action==='list')return {rooms:publicRooms};
  if(body.action==='create'){
    room={...room,code:'CREATE23',title:body.title,revision:0,roundId:1,status:'waiting',hostId:'host',themes:body.themes,theme:body.theme,visibility:body.visibility,listed:body.listed,locked:!!body.password,difficulty:body.difficulty,count:body.count,questionCount:body.count,maxPlayers:body.maxPlayers,players:[{...player('host','Camille'),score:0,correct:0,answered:false}],questionIndex:0,question:null,reveal:null,deadline:null,winners:[]};
    return {room:copyRoom(),token:roomToken,playerId:'host'};
  }
  if(body.action==='join'){
    const selected=publicRooms.find(r=>r.code===body.code);assert.ok(selected);assert.equal(body.password,'');
    if(failJoinOnce){failJoinOnce=false;return {__status:409,error:'Le groupe vient de changer. Réessaie.'};}
    room={...room,...selected,revision:1,roundId:1,hostId:'friend',players:[{...player('friend','Léa'),score:0,answered:false},{...player('guest',body.name),score:0,answered:false}],questionIndex:0,question:null,reveal:null,deadline:null,winners:[]};
    return {room:copyRoom(),token:roomToken,playerId:'guest'};
  }
  if(body.action==='status'){const snapshot=copyRoom();if(holdStatus){holdStatus=false;return new Promise(resolve=>heldStatus=()=>resolve({room:snapshot}));}return {room:snapshot};}
  if(['round-next','room-configure','start','answer','next','attention'].includes(body.action)&&body.roundId!==room.roundId)return {__status:409,error:'Ancienne manche.'};
  if(body.action==='room-configure'||body.action==='round-next'){
    room.revision++;
    if(body.action==='round-next'){room.roundId++;room.status='waiting';room.questionIndex=0;room.question=null;room.reveal=null;room.winners=[];for(const p of room.players)Object.assign(p,{score:0,correct:0,answered:false,departures:0,penalizedQuestions:0,away:false,focusPenalty:null});}
    Object.assign(room,{theme:body.theme,themes:body.themes,visibility:body.visibility,difficulty:body.difficulty,count:body.count,questionCount:body.count,maxPlayers:body.maxPlayers,listed:body.listed,locked:body.visibility==='public'?false:room.locked});return {room:copyRoom()};
  }
  if(body.action==='start'){room.revision++;room.status='playing';room.question=question();room.deadline=Date.now()+30000;return {room:copyRoom()};}
  if(body.action==='attention'){room.revision++;return {room:copyRoom()};}
  if(body.action==='answer'){room.revision++;for(const p of room.players)p.answered=true;room.reveal={correct:0,explanation:'Le Soleil est notre étoile.',answers:room.players.map(p=>({playerId:p.id,selected:0,correct:true,basePoints:100,streakBonus:0,speedBonus:80,responseMs:6000,focusPenalty:null,points:180}))};return {room:copyRoom()};}
  if(body.action==='invite-send')return {ok:true,inviteId:'SENTINVITEABC234',expiresAt:Date.now()+1800000};
  if(body.action==='invite-accept'){
    acceptedToken=acceptedToken||body.joinToken;assert.equal(body.joinToken,acceptedToken);
    invitations=[];
    if(failAcceptOnce){failAcceptOnce=false;return {__networkFailure:true};}
    return {room:{...copyRoom(),code:'GROUPB23',title:'Les amis <img src=x>',roundId:1,status:'waiting',question:null,reveal:null,questionIndex:0,hostId:'friend',players:[player('friend','Léa'),{...player('invited','Camille'),profileId:profileData.id}]},token:body.joinToken,playerId:'invited'};
  }
  if(body.action==='invite-decline'){invitations=invitations.filter(i=>i.id!==body.inviteId);return {ok:true};}
  if(body.action==='leave'){room.revision++;return {room:{...copyRoom(),status:'closed'}};}
  if(body.action==='chat-send')return {message:{id:2,playerId:'host',name:'Camille',text:body.text,createdAt:Date.now()}};
  return {ok:true};
}
async function send(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function until(expression,label){const deadline=Date.now()+9000;while(Date.now()<deadline){if(await ev(expression))return;await delay(80);}throw Error('Timeout '+label);}
async function waitNode(predicate,label){const deadline=Date.now()+9000;while(Date.now()<deadline){if(predicate())return;await delay(80);}throw Error('Timeout '+label);}
async function click(selector){await ev(`document.querySelector(${JSON.stringify(selector)}).click()`);await delay(100);}
async function input(selector,value){await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('input',{bubbles:true}));})()`);}
async function check(expression,label){assert.ok(await ev(expression),label);checks.push(label);console.log('✓ '+label);}
function nodeCheck(value,label){assert.ok(value,label);checks.push(label);console.log('✓ '+label);}
try{
  let port;for(let i=0;i<100;i++){try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await delay(100);}}
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener('open',resolve));
  ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);else if(m.method==='Fetch.requestPaused'){(async()=>{const r=m.params;if(r.request.method==='OPTIONS'){await send('Fetch.fulfillRequest',{requestId:r.requestId,responseCode:204,responseHeaders:[{name:'Access-Control-Allow-Origin',value:'*'},{name:'Access-Control-Allow-Headers',value:'authorization,content-type'},{name:'Access-Control-Allow-Methods',value:'POST, OPTIONS'}]});return;}const authorization=Object.entries(r.request.headers).find(([key])=>key.toLowerCase()==='authorization')?.[1];const data=await handle(JSON.parse(r.request.postData),authorization);if(data.__networkFailure){await send('Fetch.failRequest',{requestId:r.requestId,errorReason:'ConnectionReset'});return;}const status=data.__status||200;delete data.__status;await send('Fetch.fulfillRequest',{requestId:r.requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:'application/json'},{name:'Access-Control-Allow-Origin',value:'*'}],body:Buffer.from(JSON.stringify(data)).toString('base64')});})().catch(error=>errors.push(error.message));}});
  await send('Runtime.enable');await send('Page.enable');await send('Fetch.enable',{patterns:[{urlPattern:'*curiona-battles.biensur68.chatgpt.site/*',requestStage:'Request'}]});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`document.hasFocus=()=>true;window.__hidden=false;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__hidden});const original=window.setInterval;window.setInterval=(fn,ms,...args)=>original(fn,[1500,20000,3000].includes(ms)?180:ms,...args);localStorage.setItem('curiona.social.profile.v1',${JSON.stringify(JSON.stringify({profile:profileData,token:profileToken}))});sessionStorage.setItem('curiona.battle.session.v1',${JSON.stringify(JSON.stringify({code:room.code,token:roomToken,playerId:'host'}))});`});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:pathToFileURL(path.join(root,'dist/index.html')).href+'#battles'});
  await until('!!document.querySelector("[data-battle-form=round-next]")','finished round form');
  await check('document.querySelectorAll("[data-battle-form=round-next]").length===1','Un seul formulaire de partie suivante au bilan');
  await check('document.querySelector("#battle-round-count option[value=\\"50\\"]")&&document.querySelector("#battle-round-maxPlayers").value==="8"','Bilan propose la partie suivante, 50 questions et huit places');
  await delay(450);nodeCheck(calls.filter(c=>c.body.action==='status').length>=2,'Le polling continue au bilan pour retrouver la manche suivante');
  await input('#room-chat-text','Brouillon du même groupe');await input('#battle-round-theme','science');await click('[data-battle-theme-scope=round][data-battle-theme-choice=politics]');await input('#battle-round-difficulty','2');await input('#battle-round-count','20');await ev('document.querySelector("#battle-round-count").focus()');room.players[1].connected=false;await delay(400);
  await check('document.activeElement.id==="battle-round-count"&&document.querySelector("#battle-round-count").value==="20"','Le polling préserve les options et le focus du formulaire hôte');
  room.players.push(player('third','Noé'));await delay(350);await check('[...document.querySelector("#battle-round-maxPlayers").options].find(option=>option.value==="2").disabled','Une arrivée actualise les capacités interdites sans remplacer le formulaire');room.players.pop();await delay(350);
  room.players[1].connected=true;holdStatus=true;await waitNode(()=>!!heldStatus,'held old round');await ev('document.querySelector("[data-battle-form=round-next]").requestSubmit()');await until('!!document.querySelector("[data-battle-form=room-configure]")','round2 waiting');heldStatus();heldStatus=null;await delay(350);
  await check('document.querySelector(".battle-room-toolbar").textContent.includes("manche 2")&&document.querySelector("#room-chat-text").value==="Brouillon du même groupe"','Même code et même chat à la manche2, réponse tardive de manche1 ignorée');
  nodeCheck(calls.some(c=>c.body.action==='round-next'&&JSON.stringify(c.body.themes)==='["politics","science"]'),'Partie suivante transmet le mélange d’univers');
  await check('document.querySelectorAll("[data-battle-form=room-configure]").length===1&&document.querySelector(".battle-lobby-head").textContent.includes("Politique")&&document.querySelector(".battle-lobby-head").textContent.includes("Sciences")','Le lobby affiche le mélange et un seul formulaire d’options');
  nodeCheck(room.status==='waiting'&&calls.filter(c=>c.body.action==='start').length===0,'Préparer ne démarre pas automatiquement la partie');
  holdStatus=true;await waitNode(()=>!!heldStatus,'held same-round status');
  await input('#battle-round-count','50');await input('#battle-round-maxPlayers','3');await click('[data-battle-round-field=visibility][value=public]');await ev('document.querySelector("#battle-round-count").focus()');await ev('document.querySelector("[data-battle-form=room-configure]").requestSubmit()');await delay(200);nodeCheck(calls.some(c=>c.body.action==='room-configure'&&c.body.roundId===2&&c.body.count===50&&c.body.maxPlayers===3),'Reconfiguration du lobby transmet la manche et les options choisies');
  heldStatus();heldStatus=null;await delay(350);
  await check('document.querySelector(".battle-lobby-head").textContent.includes("50 questions")&&document.querySelector(".battle-lobby-head").textContent.includes("Groupe mondial ouvert")','Une réponse de statut plus ancienne de la même manche ne rétablit pas les anciennes options ou la visibilité privée');
  await check('document.activeElement.id==="battle-round-count"&&document.querySelector("#battle-round-count").value==="50"&&document.querySelector("[data-battle-round-field=visibility][value=public]").checked','Le garde de révision conserve le focus et le brouillon du formulaire');
  await click('[data-battle-action=start]');await until('!!document.querySelector("#battle-question-title")','round2 playing');await ev('window.dispatchEvent(new Event("blur"));window.__hidden=true;document.dispatchEvent(new Event("visibilitychange"))');await delay(100);await ev('window.__hidden=false;document.dispatchEvent(new Event("visibilitychange"));window.dispatchEvent(new Event("focus"))');await delay(250);await click('[data-battle-action=answer][data-selected="0"]');await until('!!document.querySelector(".correction")','answer');
  nodeCheck(calls.filter(c=>['start','attention','answer'].includes(c.body.action)).every(c=>c.body.roundId===2),'Start, sorties et réponses portent tous le roundId capturé');
  await click('[data-social-action=invite-open]');await until('!!document.querySelector("#social-dock-friends [data-social-action=invite]")','friend invite');await click('#social-dock-friends [data-social-action=invite]');
  nodeCheck(calls.some(c=>c.body.action==='invite-send'&&c.authorization==='Bearer '+profileToken&&c.body.roomToken===roomToken),'Inviter utilise le profil en en-tête et le jeton du groupe séparément');
  await check('!!document.querySelector(".social-invitation")&&!document.querySelector(".social-invitation img")','Invitation reçue visible et titre HTML échappé');
  const beforeAccept=calls.filter(c=>c.body.action==='invite-accept').length;await click('[data-social-action=invite-accept]');await until('document.querySelector("#confirm-dialog").open','replace confirmation');nodeCheck(calls.filter(c=>c.body.action==='invite-accept').length===beforeAccept,'Changer de groupe demande confirmation avant toute entrée ou sortie');await click('#cancel-confirm');
  await click('[data-social-action=invite-accept]');await click('#accept-confirm');await delay(350);await click('[data-social-action=refresh]');await delay(250);
  await check('!!document.querySelector("[data-social-action=invite-accept]")&&document.querySelector("[data-social-action=invite-accept]").textContent.includes("Réessayer")','Un accusé perdu garde une entrée à réessayer même après disparition de l’inbox serveur');
  nodeCheck(calls.filter(c=>c.body.action==='leave').length===0,'La panne d’acceptation ne quitte pas le groupe en cours');
  await click('[data-social-action=invite-accept]');await click('#accept-confirm');await until('JSON.parse(sessionStorage.getItem("curiona.battle.session.v1")).code==="GROUPB23"','accepted retry');
  const accepts=calls.filter(c=>c.body.action==='invite-accept');nodeCheck(accepts.length===2&&accepts[0].body.joinToken===accepts[1].body.joinToken&&/^[a-f0-9]{64}$/.test(accepts[0].body.joinToken),'Réessayer conserve le même jeton64 et rejoint sans saisir le code');
  await check(`!document.body.innerHTML.includes(${JSON.stringify(roomToken)})&&!document.body.innerHTML.includes(${JSON.stringify(profileToken)})&&!document.body.innerHTML.includes(${JSON.stringify(acceptedToken)})`,'Aucun jeton privé n’est affiché dans le DOM');
  for(const [width,height] of [[1440,1080],[768,1024],[390,844]]){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});await check('document.documentElement.scrollWidth<=innerWidth','Groupe et invitations sans débordement à '+width+'px');}
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(root,'artifacts/groups-ui-mobile.png'),Buffer.from(screenshot.data,'base64'));
  await click('[data-battle-action=leave]');await until('document.querySelectorAll(".battle-world-card").length===2','public directory');
  await check('document.querySelector(".battle-world-card").textContent.includes("Nature")&&document.querySelector(".battle-world-card").textContent.includes("Politique")&&document.querySelector(".battle-world-card").textContent.includes("12 / 20 prévues")&&!document.querySelector(".battle-world-card img")','Les groupes mondiaux exposent leurs univers, la longueur réelle et un titre échappé');
  await check('document.querySelector(".battle-world-card").textContent.includes("3 / 8 joueurs")&&document.querySelector(".battle-world-card").textContent.includes("Léa")','Les places, l’hôte et les options sont visibles avant de rejoindre');
  const joinsBefore=calls.filter(c=>c.body.action==='join').length;await click('[data-battle-action=join-open][data-code=WORLD234]');
  nodeCheck(calls.filter(c=>c.body.action==='join').length===joinsBefore,'Sans pseudo, rejoindre demande seulement de renseigner le pseudo');
  await check('document.activeElement.id==="battle-name"','Le pseudo manquant reçoit le focus');await input('#battle-name','Camille');await check('document.querySelector("#battle-message").hidden','Renseigner le pseudo efface son avertissement devenu inutile');
  await input('#battle-filterTheme','politics');await check('document.querySelectorAll(".battle-world-card").length===1','Filtrer Politique trouve le groupe Nature + Politique');
  await input('#battle-search','lea');await check('document.querySelectorAll(".battle-world-card").length===1','La recherche de l’hôte fonctionne sans accent');
  await input('#battle-search','absentxyz');await check('!document.querySelector(".battle-world-card")&&!!document.querySelector("[data-battle-action=clear-filters]")','Une recherche vide propose d’effacer les filtres');await click('[data-battle-action=clear-filters]');
  for(const [width,height] of [[1440,1080],[768,1024],[390,844]]){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});await check('document.documentElement.scrollWidth<=innerWidth','Annuaire mondial et création sans débordement à '+width+'px');}
  let capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(root,'artifacts/world-groups-mobile.png'),Buffer.from(capture.data,'base64'));
  const startsBefore=calls.filter(c=>c.body.action==='start').length;await click('[data-battle-action=join-open][data-code=WORLD234]');await until('document.querySelector("#battle-message").textContent.includes("Le groupe vient de changer")','join conflict message');await delay(250);await check('document.querySelector("#battle-message").textContent.includes("Le groupe vient de changer")&&!document.querySelector(".battle-lobby")','Une entrée refusée garde son explication après l’actualisation des groupes');await click('[data-battle-action=join-open][data-code=WORLD234]');await until('!!document.querySelector(".battle-lobby")','direct public join');
  nodeCheck(calls.filter(c=>c.body.action==='join').length===joinsBefore+2&&calls.findLast(c=>c.body.action==='join').body.code==='WORLD234','Rejoindre un groupe mondial utilise directement sa carte, sans recopier de code');
  nodeCheck(calls.filter(c=>c.body.action==='start').length===startsBefore&&room.status==='waiting','Une entrée dans un groupe mondial ne lance jamais la partie');
  await check('!document.querySelector("[data-battle-action=start]")&&document.querySelector(".battle-lobby").textContent.includes("hôte")','Le joueur rejoint attend le lancement de l’hôte');
  await click('[data-battle-action=leave]');await until('!!document.querySelector("[data-battle-form=create]")','new public landing');
  await click('[data-battle-theme-scope=create][data-battle-theme-choice=nature]');await click('[data-battle-theme-scope=create][data-battle-theme-choice=politics]');
  await check('document.querySelector("[data-battle-theme-summary=create]").textContent.includes("Nature")&&document.querySelector("[data-battle-theme-summary=create]").textContent.includes("Politique")&&!document.querySelector("[data-battle-theme-scope=create][data-battle-theme-choice=all]").checked','Créer une partie permet de cocher Nature et Politique ensemble');
  await click('[data-battle-field=visibility][value=private]');await input('#battle-password','amis-seulement');await input('#battle-title','Notre mélange privé');await ev('document.querySelector("[data-battle-form=create]").requestSubmit()');await until('!!document.querySelector(".battle-lobby")','mixed private create');
  const created=calls.findLast(c=>c.body.action==='create').body;nodeCheck(created.visibility==='private'&&created.listed===false&&created.password==='amis-seulement'&&JSON.stringify(created.themes)==='["nature","politics"]','Créer privé transmet le mélange, masque le groupe et conserve son mot de passe');
  await check('document.querySelector("[data-battle-action=start]").disabled','L’hôte attend au moins deux joueurs connectés');
  await click('[data-battle-round-field=visibility][value=public]');await check('document.querySelector("[data-battle-access-hint=round]").textContent.includes("retires son mot de passe")','Ouvrir un ancien groupe protégé explique le retrait du mot de passe');
  await ev('document.querySelector("[data-battle-form=room-configure]").requestSubmit()');await delay(250);nodeCheck(room.visibility==='public'&&room.locked===false,'La préparation peut rendre le même groupe mondial et ouvert');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});await click('[data-battle-action=leave]');await until('document.querySelectorAll(".battle-world-card").length===2','final directory');capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(root,'artifacts/world-groups-desktop.png'),Buffer.from(capture.data,'base64'));
  assert.equal(errors.length,0,errors.join('\n'));await writeFile(path.join(root,'artifacts/groups-ui-qa-report.json'),JSON.stringify({checks,errors},null,2));console.log(checks.length+' contrôles manches/invitations réussis.');
}finally{
  if(heldStatus)heldStatus();try{ws?.close();}catch{}chrome.kill();await delay(250);
  const target=path.resolve(profile),base=path.resolve(tmpdir())+path.sep;if(target.startsWith(base)&&path.basename(target).startsWith('curiona-groups-qa-'))await rm(target,{recursive:true,force:true}).catch(()=>{});
}
