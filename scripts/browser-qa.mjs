import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const profile=await mkdtemp(path.join(tmpdir(),'curiona-qa-'));
const chromePath=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const chrome=spawn(chromePath,['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'],{stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let ws,seq=0;const pending=new Map(),errors=[],checks=[];
const check=(condition,label)=>{assert.ok(condition,label);checks.push(label);console.log('✓ '+label);};
async function send(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+': '+r.exceptionDetails.exception?.description);return r.result.value;}
async function click(selector){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing element');el.click();return true;})()`);}
async function select(selector,value){return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event('change',{bubbles:true}));})()`);}
const snapshot=()=>evaluate('Curiona.snapshot()');
async function screenshot(name){await delay(350);const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});await writeFile(path.join(root,'artifacts',name+'.png'),Buffer.from(data,'base64'));}
async function importState(state,accept=true){
  await evaluate(`(()=>{const file=new File([JSON.stringify({app:'curiona',version:1,state:${JSON.stringify(state)}})],'qa-save.json',{type:'application/json'});const dt=new DataTransfer();dt.items.add(file);const input=document.querySelector('#import-file');input.files=dt.files;input.dispatchEvent(new Event('change'));})()`);
  await delay(100);if(accept)await click('#accept-confirm');
}
try{
  let port;for(let i=0;i<100;i++){try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await delay(100);}}if(!port)throw Error('Chrome did not start.');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();const target=targets.find(t=>t.type==='page');ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);});
  await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
  await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  const url=pathToFileURL(path.join(root,'dist/index.html')).href;await send('Page.navigate',{url});
  for(let i=0;i<80;i++){if(await evaluate('!!window.Curiona'))break;await delay(100);}
  check((await evaluate('Curiona.info().questions'))===336,'Chrome ouvre 336 questions en file:// avec réseau coupé');
  check((await evaluate('Curiona.bank().filter(q=>q.variant).length'))===21,'Les 21 reformulations sont intégrées au jeu livré');
  check(await evaluate('document.querySelectorAll(".world-card").length===8'),'Accueil complet et sept univers');
  await click('[data-action="sound"]');check((await snapshot()).state.sound===true,'Activation des sons discrets');await click('[data-action="sound"]');check((await snapshot()).state.sound===false,'Désactivation des sons persistée');
  await screenshot('01-accueil-desktop');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Accueil ordinateur sans débordement');
  await click('[data-category="animals"]');await select('#difficulty',4);await select('#subtheme-select','Insectes');await select('#question-count',20);
  check(await evaluate('document.querySelector("#availability").textContent.includes("4 questions disponibles")'),'Filtre sous-thème expert : quatre questions, avertissement de partie raccourcie');
  await click('[data-action="start"]');
  let s=await snapshot();check(s.session.limit===4,'La longueur respecte le nombre de questions filtrées');
  const ids=[],bank=await evaluate('Curiona.bank()');
  for(let i=0;i<4;i++){
    s=await snapshot();const q=bank.find(q=>q.id===s.session.current.id);ids.push(q.id);
    check(q.category==='animals'&&q.subtheme==='Insectes'&&q.difficulty===4,`Filtre strict conservé à la question ${i+1}`);
    const answerIndex=s.session.current.order.indexOf(q.correct);await send('Input.dispatchKeyEvent',{type:'keyDown',key:String(answerIndex+1),code:'Digit'+(answerIndex+1),windowsVirtualKeyCode:49+answerIndex});await send('Input.dispatchKeyEvent',{type:'keyUp',key:String(answerIndex+1)});
    s=await snapshot();check(s.session.answers.at(-1).correct,'Raccourci clavier et bonne correction après mélange');
    check(await evaluate('document.querySelector(".answer.correct").textContent.includes("Bonne réponse")'),'Correction explicite avec texte et symbole');
    if(i===0){await screenshot('02-correction-desktop');const before=s.state.xp;await click('.answer');check((await snapshot()).state.xp===before,'Double clic : aucun score supplémentaire');}
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter'});
  }
  check(new Set(ids).size===4,'Aucun doublon jusqu’à épuisement du filtre');s=await snapshot();check(s.view==='result'&&s.result.correct===4&&s.result.total===4,'Bilan après épuisement');
  check(s.result.score===175+185+195+205&&s.result.xp===180,'Score expert et bonus de série exacts');
  await screenshot('03-bilan-desktop');
  check(s.state.badges.includes('first'),'Badge de première partie attribué');
  const savedXp=s.state.xp;await send('Page.reload');await delay(200);check((await snapshot()).state.xp===savedXp,'La progression survit au rechargement dans Chrome');
  await click('[data-action="setup"][data-mode="challenge"]');await select('#question-count',8);await select('#difficulty',1);await click('[data-action="start"]');await delay(550);s=await snapshot();check(s.session.remaining<30,'Chronomètre du Défi actif');
  const q=bank.find(q=>q.id===s.session.current.id);await click(`[data-answer="${q.correct}"]`);const paused=(await snapshot()).session.remaining;await delay(1100);check((await snapshot()).session.remaining===paused,'Chronomètre immobile pendant la correction');
  await click('[data-action="next"]');await delay(200);
  await evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"));');const hiddenTime=(await snapshot()).session.remaining;await delay(450);check((await snapshot()).session.remaining===hiddenTime,'Chronomètre immobile lorsque le document est masqué');await evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"));');
  await click('[data-action="pause"]');const time=(await snapshot()).session.remaining;await delay(400);check((await snapshot()).session.remaining===time,'Chronomètre immobile à l’accueil');
  await send('Page.reload');await delay(200);s=await snapshot();check(s.session&&s.session.answers.length===1,'Exploration en cours restaurée après rechargement');await click('[data-action="resume"]');
  const wrongQ=bank.find(q=>q.id===(s.session.current.id));await click(`[data-answer="${(wrongQ.correct+1)%wrongQ.options.length}"]`);s=await snapshot();check(s.session.answers.at(-1).correct===false&&s.session.current.reward.xp===8,'Erreur : explication et 8 XP');
  const imported=structuredClone(s.state);imported.active=null;Object.values(imported.questions).forEach(q=>q.nextDue=Date.now()-1);
  await importState(imported);check((await snapshot()).session===null&&(await snapshot()).state.xp===imported.xp,'Import réel par fichier et confirmation restaure le carnet');
  await click('[data-action="home"]');await click('[data-action="setup"][data-mode="review"]');await select('#difficulty','adaptive');await click('[data-action="start"]');s=await snapshot();check(!!imported.questions[s.session.current.id],'Révision sélectionne une question déjà rencontrée et arrivée à échéance');
  await click('[data-action="pause"]');
  const previous=(await snapshot()).state.xp;await importState({...imported,xp:-20},false);check(!(await evaluate('document.querySelector("#confirm-dialog").open'))&&(await snapshot()).state.xp===previous,'Import corrompu refusé sans écraser la progression');
  await evaluate('window.__exportBlob=null;window.__oldCreate=URL.createObjectURL;URL.createObjectURL=b=>{window.__exportBlob=b;return window.__oldCreate(b);};');await click('[data-action="export"]');
  check(await evaluate('(async()=>{const save=JSON.parse(await window.__exportBlob.text());return save.app==="curiona"&&save.state.xp===Curiona.snapshot().state.xp;})()'),'Export JSON contient la progression exacte');
  await click('[data-action="setup"][data-mode="custom"]');
  for(const cat of ['animals','nature','math','mind','science','world','tech'])await click(`[data-theme="${cat}"]`);
  check(await evaluate('document.querySelector("[data-action=start]").disabled'),'Mélange vide : départ désactivé');
  await click('[data-theme="tech::Programmation"]');await select('#difficulty',3);check(await evaluate('document.querySelector("#availability").textContent.includes("4 questions disponibles")'),'Mode personnalisé : sous-thème précis et difficulté cumulés');await click('[data-action="close-setup"]');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await screenshot('04-accueil-mobile');
  check(await evaluate('document.querySelector(".resume-banner").getBoundingClientRect().top>=document.querySelector(".nav").getBoundingClientRect().bottom'),'Bannière de reprise mobile sous la navigation, sans chevauchement');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Accueil mobile 390 px sans débordement');await click('[data-action="resume"]');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Question mobile sans débordement');await screenshot('05-question-mobile');
  s=await snapshot();const mobileQ=bank.find(q=>q.id===s.session.current.id);await click(`[data-answer="${mobileQ.correct}"]`);await screenshot('06-correction-mobile');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Correction mobile sans débordement');
  await click('[data-action="stats"]');await screenshot('07-statistiques-mobile');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Statistiques et historique mobiles sans débordement');
  await click('[data-action="help"]');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Carnet de route mobile sans débordement');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});await click('[data-action="stats"]');await screenshot('08-statistiques-desktop');
  await click('[data-action="home"]');await click('[data-action="setup"][data-mode="challenge"]');await select('#difficulty',1);await click('[data-action="start"]');await click('#accept-confirm');
  await send('Emulation.setVirtualTimePolicy',{policy:'advance',budget:31000,maxVirtualTimeTaskStarvationCount:10000});await delay(300);
  s=await snapshot();check(s.session.current.answered&&s.session.current.selected===-1&&s.session.answers.at(-1).correct===false,'Expiration réelle du chrono Chrome : correction ouverte, réponse incorrecte unique');
  await send('Emulation.setVirtualTimePolicy',{policy:'pause'});
  check(errors.length===0,'Aucune exception JavaScript');
  await writeFile(path.join(root,'artifacts/browser-report.json'),JSON.stringify({browser:'Google Chrome',date:new Date().toISOString(),offline:true,checks,errors,mobile:'Émulation 390 × 844, pas un téléphone physique'},null,2));
  console.log(`${checks.length} contrôles Chrome réussis.`);
}finally{
  ws?.close();chrome.kill();await delay(500);
  // Le chemin supprimé est exclusivement le profil temporaire créé par ce script.
  if(path.dirname(profile)===tmpdir()&&path.basename(profile).startsWith('curiona-qa-'))await rm(profile,{recursive:true,force:true}).catch(()=>{});
}
