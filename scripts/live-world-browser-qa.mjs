// Smoke test de production : exécuter seulement après publication de Curiona 3.2.
// Deux profils Chrome jetables ; aucune interception réseau ni profil personnel.
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const site='https://savoircestfun-design.github.io/curiona/';
const endpoint='https://curiona-battles.biensur68.chatgpt.site/api';
const root=process.cwd(),clients=[],checks=[],errors=[],cleanupErrors=[];
const stamp=Date.now().toString(36),title='QA Mondial Addictions Politique '+stamp;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
await mkdir(path.join(root,'artifacts'),{recursive:true});
const record=label=>{checks.push(label);console.log('✓ '+label);};

async function client(role,width){
  const profile=await mkdtemp(path.join(tmpdir(),'curiona-world-live-qa-'));
  const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'],{stdio:'ignore',windowsHide:true});
  const c={role,profile,chrome,seq:0,pending:new Map(),actions:new Map(),api:[],identity:null,cleaning:false};clients.push(c);
  let port;for(let attempt=0;attempt<100;attempt++){try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await delay(100);}}
  if(!port)throw Error('Chrome ne démarre pas pour '+role);
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  c.ws=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{c.ws.addEventListener('open',resolve,{once:true});c.ws.addEventListener('error',reject,{once:true});});
  c.send=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++c.seq,timer=setTimeout(()=>{c.pending.delete(id);reject(Error('CDP timeout '+method));},20000);
    c.pending.set(id,{resolve,reject,timer});c.ws.send(JSON.stringify({id,method,params}));
  });
  c.ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id){const p=c.pending.get(message.id);if(!p)return;clearTimeout(p.timer);c.pending.delete(message.id);message.error?p.reject(Error(message.error.message)):p.resolve(message.result);return;}
    const data=message.params;
    if(message.method==='Runtime.exceptionThrown')errors.push(role+': '+(data.exceptionDetails.exception?.description||data.exceptionDetails.text));
    if(message.method==='Network.requestWillBeSent'&&data.request.url.startsWith(endpoint)){
      let action;try{action=JSON.parse(data.request.postData||'{}').action;}catch{}
      if(action)c.actions.set(data.requestId,action);
    }
    if(message.method==='Network.responseReceived'){
      const response=data.response,action=c.actions.get(data.requestId);
      if(action){
        const allowOrigin=Object.entries(response.headers).find(([key])=>key.toLowerCase()==='access-control-allow-origin')?.[1];
        c.api.push({action,status:response.status,allowOrigin});
        if(['create','join'].includes(action)&&response.status===200)c.entryResponseId=data.requestId;
      }
      if(response.status>=400&&!response.url.endsWith('/favicon.ico')&&!(c.cleaning&&['status','attention'].includes(action)&&[401,403,404,410].includes(response.status)))errors.push(role+': HTTP '+response.status+' '+new URL(response.url).pathname);
    }
    if(message.method==='Network.loadingFailed'&&!data.canceled&&data.errorText!=='net::ERR_ABORTED'&&!c.cleaning)errors.push(role+': réseau '+data.errorText);
    if(message.method==='Log.entryAdded'&&data.entry.level==='error'&&!c.cleaning&&!data.entry.text.includes('favicon.ico'))errors.push(role+': '+data.entry.text);
  });
  await c.send('Runtime.enable');await c.send('Page.enable');await c.send('Network.enable');await c.send('Log.enable');
  await c.send('Network.setCacheDisabled',{cacheDisabled:true});
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1080,deviceScaleFactor:1,mobile:width===390});
  return c;
}
async function ev(c,expression){const response=await c.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value;}
async function until(c,expression,label,timeout=20000){const deadline=Date.now()+timeout;while(Date.now()<deadline){if(await ev(c,expression))return;await delay(120);}throw Error('Timeout '+c.role+' : '+label);}
async function click(c,selector){await ev(c,`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el||el.disabled)throw Error('Commande absente ou désactivée');el.click();})()`);}
async function input(c,selector,value){await ev(c,`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Champ absent');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`);}
async function check(c,expression,label){assert.ok(await ev(c,expression),label);record(label);}
async function remember(c){c.identity=await ev(c,"JSON.parse(sessionStorage.getItem('curiona.battle.session.v1')||'null')");return c.identity;}
async function capture(c,name){const {data}=await c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(root,'artifacts',name+'.png'),Buffer.from(data,'base64'));}

async function cleanup(c){
  c.cleaning=true;
  try{c.identity=await ev(c,"JSON.parse(sessionStorage.getItem('curiona.battle.session.v1')||'null')")||c.identity;}catch{}
  if(!c.identity&&c.entryResponseId){
    try{const result=await c.send('Network.getResponseBody',{requestId:c.entryResponseId});const data=JSON.parse(result.base64Encoded?Buffer.from(result.body,'base64').toString('utf8'):result.body);if(data.room&&data.token)c.identity={code:data.room.code,token:data.token};}catch{}
  }
  if(!c.identity)return;
  const before=c.api.filter(item=>item.action==='leave'&&item.status===200).length;
  try{
    await click(c,'[data-battle-action=leave]');
    await until(c,"!sessionStorage.getItem('curiona.battle.session.v1')",'sortie du groupe',6000);
    if(c.api.filter(item=>item.action==='leave'&&item.status===200).length>before){c.cleaned=true;return;}
  }catch{}
  // Filet de secours si l'interface s'est interrompue après la création.
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:new URL(site).origin,Authorization:'Bearer '+c.identity.token},body:JSON.stringify({action:'leave',code:c.identity.code}),signal:AbortSignal.timeout(15000)});
  if(!response.ok&&response.status!==403&&response.status!==404&&response.status!==410)throw Error('Nettoyage impossible : HTTP '+response.status);
  c.cleaned=true;
}

let failure=null;
try{
  const [host,guest]=await Promise.all([client('hôte',1440),client('invité',390)]);
  for(const c of [host,guest]){
    await c.send('Page.navigate',{url:site+'?qa_world='+stamp+'#battles'});
    await until(c,'!!window.Curiona&&!!document.querySelector("#battle-world-groups")','version mondiale publiée');
    await check(c,'Curiona.info().categories.find(c=>c.id==="prevention").count===500&&Curiona.study({kind:"learn",theme:"prevention::Habitudes, jeux et alimentation",batchSize:"all"}).total===100','Les 500 questions Addictions et les 100 nouveaux repères sont publiés ('+c.role+')');
    await check(c,'Curiona.info().questions===4900','La version publiée charge 4 900 questions ('+c.role+')');
    await check(c,'!sessionStorage.getItem("curiona.battle.session.v1")&&!localStorage.getItem("curiona.social.profile.v1")','Session isolée sans profil ni groupe préexistant ('+c.role+')');
  }
  await input(host,'#battle-name','QA Mondial hôte');await input(host,'#battle-title',title);
  await click(host,'[data-battle-theme-scope=create][data-battle-theme-choice=prevention]');
  await click(host,'[data-battle-theme-scope=create][data-battle-theme-choice=politics]');
  await input(host,'#battle-count','8');await input(host,'#battle-difficulty','1');await input(host,'#battle-maxPlayers','2');
  await click(host,'[data-battle-field=visibility][value=public]');
  await ev(host,'document.querySelector("[data-battle-form=create]").requestSubmit()');
  await until(host,'!!document.querySelector(".battle-lobby")','création mondiale');await remember(host);
  await check(host,'document.querySelector(".battle-lobby-head").textContent.includes("Addictions")&&document.querySelector(".battle-lobby-head").textContent.includes("Politique")&&document.querySelector(".battle-lobby-head").textContent.includes("Groupe mondial ouvert")','L’hôte crée un groupe mondial Addictions + Politique');
  await check(host,'document.querySelector("[data-battle-action=start]").disabled','Un hôte seul ne démarre pas la partie');
  await input(guest,'#battle-name','QA Mondial invité');await input(guest,'#battle-search',title);
  await click(guest,'[data-battle-action=refresh]');
  await until(guest,`[...document.querySelectorAll('.battle-world-card')].some(card=>card.querySelector('h3').textContent===${JSON.stringify(title)})`,'carte publique réelle');
  await check(guest,'document.querySelector(".battle-world-card").textContent.includes("Addictions")&&document.querySelector(".battle-world-card").textContent.includes("Politique")&&document.querySelector(".battle-world-card").textContent.includes("Débutant")&&document.querySelector(".battle-world-card").textContent.includes("1 / 2 joueurs")','L’invité retrouve les univers, le niveau et les places dans l’annuaire public');
  await check(guest,'document.querySelector("#battle-code").value===""&&document.documentElement.scrollWidth<=innerWidth','Le mobile affiche le groupe sans débordement et sans code saisi');
  await capture(guest,'live-world-01-directory-mobile');
  await click(guest,'.battle-world-card [data-battle-action=join-open]');
  await until(guest,'!!document.querySelector(".battle-lobby")','entrée directe depuis la carte');await remember(guest);
  assert.equal(guest.identity.code,host.identity.code);assert.ok(guest.identity.token!==host.identity.token,'Les accès privés des participants sont distincts');record('Deux participants distincts rejoignent le même groupe sans saisie de code');
  await until(host,'document.querySelectorAll(".battle-player").length===2&&!document.querySelector("[data-battle-action=start]").disabled','deux joueurs prêts');
  await delay(1800);
  await check(host,'!!document.querySelector(".battle-lobby")&&!document.querySelector("#battle-question-title")','L’arrivée de l’invité ne déclenche aucun démarrage automatique');
  await check(guest,'!!document.querySelector(".battle-lobby")&&!document.querySelector("[data-battle-action=start]")','L’invité attend le lancement manuel de l’hôte');
  assert.ok(![host,guest].some(c=>c.api.some(item=>item.action==='start')));record('Aucune requête de lancement avant le clic de l’hôte');
  await capture(host,'live-world-02-lobby-desktop');
  await click(host,'[data-battle-action=start]');
  await Promise.all([until(host,'!!document.querySelector("#battle-question-title")','question hôte'),until(guest,'!!document.querySelector("#battle-question-title")','question invité')]);
  const question=c=>ev(c,'({question:document.querySelector("#battle-question-title").textContent,options:[...document.querySelectorAll("[data-battle-action=answer]")].map(button=>button.textContent.trim())})');
  assert.deepEqual(await question(host),await question(guest));record('Les deux navigateurs reçoivent la même question et les mêmes propositions');
  await check(guest,'document.documentElement.scrollWidth<=innerWidth&&innerWidth===390','La question réelle reste dans la largeur mobile de 390 px');
  await capture(guest,'live-world-03-question-mobile');
  for(const c of [host,guest]){
    assert.ok(c.api.some(item=>item.action==='status'&&item.status===200));
    assert.ok(c.api.filter(item=>item.status===200).every(item=>item.allowOrigin===new URL(site).origin||item.allowOrigin==='*'));
  }
  record('Les deux navigateurs communiquent réellement avec le service avec des réponses CORS valides');
}catch(error){failure=error;}

// Toujours retirer les participants, même si une assertion ou un clic échoue.
for(const c of [...clients].reverse())try{await cleanup(c);}catch(error){cleanupErrors.push(c.role+': '+error.message);}
for(const c of clients){try{c.ws?.close();}catch{}c.chrome.kill();for(const p of c.pending.values())clearTimeout(p.timer);}
await delay(300);
for(const c of clients){const target=path.resolve(c.profile),base=path.resolve(tmpdir())+path.sep;if(target.startsWith(base)&&path.basename(target).startsWith('curiona-world-live-qa-'))await rm(target,{recursive:true,force:true}).catch(()=>{});}
if(!failure&&cleanupErrors.length)failure=Error(cleanupErrors.join('\n'));
if(!failure&&errors.length)failure=Error(errors.join('\n'));
if(!failure&&!(clients.length===2&&clients.every(c=>c.cleaned)))failure=Error('Le départ des deux participants n’a pas été confirmé.');
if(!failure){record('Les deux participants de vérification ont quitté le groupe');record('Aucune erreur JavaScript, CORS ou réseau significative');}
await writeFile(path.join(root,'artifacts/live-world-browser-report.json'),JSON.stringify({verifiedAt:new Date().toISOString(),site,success:!failure,checks,errors,cleanupErrors,clients:clients.map(c=>({role:c.role,cleaned:!!c.cleaned,api:c.api})),failure:failure?.message||null},null,2));
if(failure)throw failure;
console.log(checks.length+' contrôles mondiaux réels réussis.');
