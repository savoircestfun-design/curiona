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
async function nextButtonVisible(){return evaluate('(()=>{const b=document.querySelector(".game-next-fixed [data-action=next]");if(!b)return false;const r=b.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth&&document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest("[data-action=next]")===b;})()');}
async function clickVisibleNext(){const r=await evaluate('(()=>{const r=document.querySelector(".game-next-fixed [data-action=next]").getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};})()');await send('Input.dispatchMouseEvent',{type:'mousePressed',...r,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...r,button:'left',clickCount:1});}
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
  check((await evaluate('Curiona.info().questions'))===4500,'Chrome ouvre 4 500 questions en file:// avec réseau coupé');
  const expertCount=await evaluate('Curiona.bank().filter(q=>q.category==="animals"&&q.subtheme==="Insectes"&&q.difficulty===4).length');
  const programmingCount=await evaluate('Curiona.bank().filter(q=>q.category==="tech"&&q.subtheme==="Programmation"&&q.difficulty===3).length');
  check(await evaluate('Curiona.info().categories.length===11&&Curiona.info().categories.every(c=>c.count===(c.id==="prevention"?500:400))'), 'Dix univers contiennent 400 questions, Addictions et prévention en contient 500');
  check((await evaluate('Curiona.bank().filter(q=>q.variant).length'))===21,'Les 21 reformulations sont intégrées au jeu livré');
  check(await evaluate('document.querySelectorAll(".world-card").length===12'),'Accueil complet et onze univers');
  check(await evaluate('document.querySelectorAll(".subtheme-links button").length===47&&!document.querySelector("button button")'),'Les 47 sous-thèmes et continents sont accessibles directement avec un niveau, sans boutons imbriqués');
  check(await evaluate('!!document.querySelector(".discovery-card")'),'Une suggestion de découverte accueille le joueur');
  await click('[data-action="notebook"]');check(await evaluate('document.querySelector("#notebook-empty").textContent.includes("Garder cette fiche")'),'Le carnet vide explique comment garder une fiche');await click('[data-action="home"]');
  await evaluate('(()=>{const input=document.querySelector("#theme-search");input.value="geometrie";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  check(await evaluate('document.querySelectorAll(".theme-card:not([hidden])").length===1&&!document.querySelector("[data-skill-theme=math]").hidden'),'La recherche trouve les sous-thèmes même sans les accents');
  await evaluate('(()=>{const input=document.querySelector("#theme-search");input.value="introuvablexyz";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  check(await evaluate('!document.querySelector("#theme-search-empty").hidden'),'Une recherche vide explique comment continuer');
  await evaluate('(()=>{const input=document.querySelector("#theme-search");input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  check(await evaluate('document.querySelectorAll(".theme-card:not([hidden])").length===11'),'Effacer la recherche restaure les onze univers');
  check(!(await evaluate('Curiona.audio().playing')),'La musique attend le lancement volontaire d’une partie');
  await click('[data-action="music"]');await send('Page.reload');await delay(200);
  check((await snapshot()).state.music===false,'Le choix de couper la musique survit au rechargement');
  await click('.audio-settings summary');await evaluate('(()=>{const input=document.querySelector("#music-volume");input.value="20";input.dispatchEvent(new Event("input",{bubbles:true}));})()');await send('Page.reload');await delay(200);
  check((await snapshot()).state.musicVolume===20&&(await evaluate('Curiona.audio().volume'))===20,'Le volume choisi est mémorisé sans lancer la musique');await evaluate('(()=>{const input=document.querySelector("#music-volume");input.value="35";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  await click('[data-action="music"]');
  await click('[data-action="sound"]');check((await snapshot()).state.sound===true,'Activation des sons discrets');await click('[data-action="sound"]');check((await snapshot()).state.sound===false,'Désactivation des sons persistée');
  await screenshot('01-accueil-desktop');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Accueil ordinateur sans débordement');
  for(const category of ['language','daily','prevention','politics']){await click(`[data-category="${category}"]`);const count=await evaluate(`Curiona.info().categories.find(c=>c.id===${JSON.stringify(category)}).count`);check(await evaluate(`document.querySelector("#availability").textContent.includes("${count} questions disponibles")`),'Nouvel univers accessible avec sa banque complète : '+category);await click('[data-action="close-setup"]');}
  await click('[data-action="subtheme"][data-theme-key="prevention::Habitudes, jeux et alimentation"]');await select('#difficulty','adaptive');
  check(await evaluate('document.querySelector("#setup-title").textContent==="Habitudes, jeux et alimentation"&&document.querySelector("#availability").textContent.includes("100 questions disponibles")'),'Le nouveau sous-thème Habitudes, jeux et alimentation ouvre ses 100 questions');
  check(await evaluate('[1,2,3,4].every(level=>Curiona.bank().filter(q=>q.category==="prevention"&&q.difficulty===level).length===125&&Curiona.bank().filter(q=>q.category==="prevention"&&q.subtheme==="Habitudes, jeux et alimentation"&&q.difficulty===level).length===25)'),'Addictions et prévention propose 125 questions par niveau, dont 25 dans le nouveau sous-thème');await click('[data-action="close-setup"]');
  await click('[data-category="politics"]');check(await evaluate('document.querySelector("[data-theme-key=politics]").textContent.includes("Général")'),'Politique propose explicitement le mélange général');
  await click('[data-action="choose-subtheme"][data-theme-key="politics::Océanie"]');await select('#difficulty',4);await select('#question-count',50);check(await evaluate('document.querySelector("#availability").textContent.includes("10 questions disponibles")&&document.querySelector("#availability").textContent.includes("plus courte")'),'Le continent et le niveau limitent la partie aux questions disponibles');await screenshot('16-politique-desktop');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});check(await evaluate('document.documentElement.scrollWidth<=innerWidth&&document.querySelectorAll(".subtheme-tabs button").length===7'),'Politique garde le choix général et les six continents sur mobile');await screenshot('17-politique-mobile');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});await click('[data-action="close-setup"]');
  await click('[data-category="nature"]');
  check(await evaluate('document.querySelector("#setup-title").textContent==="Nature & jardin"&&!document.querySelector("#setup-dialog").textContent.includes("Général")'),'Choisir Nature ouvre directement ses réglages, sans mode Général ambigu');
  for(const mode of ['challenge','relax','review','learn']){await click(`[data-action="switch-mode"][data-mode="${mode}"]`);check(await evaluate('document.querySelector("#setup-title").textContent==="Nature & jardin"&&document.querySelector("[data-theme-key=nature]").getAttribute("aria-pressed")==="true"'),'Changer la façon de jouer conserve Nature : '+mode);}
  await screenshot('09-reglages-nature-desktop');
  await click('[data-action="choose-subtheme"][data-theme-key="nature::Plantes"]');
  check(await evaluate('document.querySelector("#setup-title").textContent==="Plantes"&&document.querySelector("[data-setup-skill]").dataset.setupSkill==="nature::Plantes"'),'Sélection précise : titre et compétence Plantes cohérents');
  await click('[data-action="close-setup"]');await click('[data-action="subtheme"][data-theme-key="nature::Arbres"]');
  check(await evaluate('document.querySelector("#setup-title").textContent==="Arbres"'),'Un sous-thème de l’accueil ouvre directement la bonne sélection');await click('[data-action="close-setup"]');
  await click('[data-category="animals"]');await select('#difficulty',4);await click('[data-action="choose-subtheme"][data-theme-key="animals::Insectes"]');await select('#question-count',50);
  check(await evaluate(`document.querySelector("#availability").textContent.includes("${expertCount} questions disponibles")`),'Filtre sous-thème expert : banque élargie, avertissement de partie raccourcie');
  await click('[data-action="start"]');
  let s=await snapshot();check(s.session.limit===expertCount,'La longueur respecte le nombre de questions filtrées');
  check(await evaluate('!document.querySelector(".game-next-fixed")'),'Le bouton suivant reste absent avant la réponse');
  await delay(1100);
  const music=await evaluate('Curiona.audio()');
  check(music.playing&&music.contextState==='running'&&music.activeVoices>0,'La musique douce joue pendant les questions, même avec les effets coupés');
  check(music.outputRms>0.00001&&music.outputRms<0.15,'Signal musical présent à faible niveau, sans silence ni niveau excessif');
  await click('.audio-settings summary');await evaluate('(()=>{const input=document.querySelector("#music-volume");input.value="0";input.dispatchEvent(new Event("input",{bubbles:true}));})()');await delay(300);check(await evaluate('Curiona.audio().volume===0&&Curiona.audio().playing&&Curiona.audio().outputRms<0.00001'),'Le volume zéro rend la musique silencieuse sans arrêter la partition');await evaluate('(()=>{const input=document.querySelector("#music-volume");input.value="35";input.dispatchEvent(new Event("input",{bubbles:true}));})()');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape'});check(await evaluate('!document.querySelector(".audio-settings").open&&Curiona.snapshot().view==="game"'),'Échap ferme le volume sans mettre de côté la partie');
  const beforeMusicToggle=(await snapshot()).session.score;
  await click('[data-action="music"]');await delay(900);
  check(await evaluate('!Curiona.audio().playing&&Curiona.audio().activeVoices===0'),'Bouton musique : fondu et nettoyage des notes en cours');
  await click('[data-action="music"]');await delay(200);
  check((await evaluate('Curiona.audio().playing'))&&(await snapshot()).session.score===beforeMusicToggle,'Réactiver la musique conserve la question et le score');
  for(let i=0;i<6;i++)await click('[data-action="music"]');await delay(200);
  check(await evaluate('Curiona.audio().playing&&Curiona.audio().activeVoices<24'),'Coupures et reprises rapides sans accumulation de voix');
  const ids=[],bank=await evaluate('Curiona.bank()');
  for(let i=0;i<expertCount;i++){
    s=await snapshot();const q=bank.find(q=>q.id===s.session.current.id);ids.push(q.id);
    check(q.category==='animals'&&q.subtheme==='Insectes'&&q.difficulty===4,`Filtre strict conservé à la question ${i+1}`);
    const answerIndex=s.session.current.order.indexOf(q.correct);await send('Input.dispatchKeyEvent',{type:'keyDown',key:String(answerIndex+1),code:'Digit'+(answerIndex+1),windowsVirtualKeyCode:49+answerIndex});await send('Input.dispatchKeyEvent',{type:'keyUp',key:String(answerIndex+1)});
    s=await snapshot();check(s.session.answers.at(-1).correct,'Raccourci clavier et bonne correction après mélange');
    check(await evaluate('document.querySelector(".answer.correct").textContent.includes("Bonne réponse")'),'Correction explicite avec texte et symbole');
    if(i===0)check(await evaluate('Curiona.audio().playing'),'La musique continue pendant la lecture des explications');
    if(i===2)check(await evaluate('document.querySelector(".milestone-card").textContent.includes("niveau 2")'),'Le passage de niveau est célébré sans quitter la correction');
    if(i===0){await screenshot('02-correction-desktop');const before=s.state.xp;await click('.answer');check((await snapshot()).state.xp===before,'Double clic : aucun score supplémentaire');await click('[data-action="bookmark"]');check((await snapshot()).state.bookmarks.includes(q.id)&&(await snapshot()).state.xp===before,'Garder une fiche conserve le score et la correction en cours');}
    if(i===0){
      await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
      await evaluate('window.__originalExplanation=document.querySelector(".explain").textContent;document.querySelector(".explain").textContent=window.__originalExplanation.repeat(35);window.scrollTo({top:0,behavior:"instant"});');
      check(await nextButtonVisible(),'Écran 1366 × 768 : bouton suivant visible immédiatement malgré une très longue correction');
      await evaluate('window.scrollTo({top:document.documentElement.scrollHeight/2,behavior:"instant"})');check(await nextButtonVisible(),'Le bouton reste accessible au milieu de l’explication');
      await evaluate('window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');check(await nextButtonVisible(),'Le bouton reste accessible à la fin de l’explication');
      check(await evaluate('document.querySelector(".correction-footer").getBoundingClientRect().bottom<=document.querySelector(".game-next-fixed").getBoundingClientRect().top'),'La fin de la correction reste lisible au-dessus de la barre');
      await evaluate('document.querySelector(".explain").textContent=window.__originalExplanation;window.scrollTo({top:0,behavior:"instant"})');await delay(350);const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(root,'artifacts/14-suivante-fixe-desktop.png'),Buffer.from(shot.data,'base64'));
      await clickVisibleNext();check((await snapshot()).session.used.length===2,'Un vrai clic sur la barre passe à la question suivante sans défiler');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
    }else{
      if(i===expertCount-1)check((await nextButtonVisible())&&await evaluate('document.querySelector(".game-next-fixed").textContent.includes("Voir mon bilan")'),'La dernière correction affiche un bilan également accessible');
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter'});
    }
    check(await evaluate('!document.querySelector(".game-next-fixed")&&!document.body.classList.contains("has-fixed-next")'),'La barre se retire après avoir continué, sans cacher la prochaine question');
  }
  check(new Set(ids).size===expertCount,'Aucun doublon jusqu’à épuisement du filtre');s=await snapshot();check(s.view==='result'&&s.result.correct===expertCount&&s.result.total===expertCount,'Bilan après épuisement');
  check(s.result.score===Array.from({length:expertCount},(_,i)=>175+Math.min(i,5)*10).reduce((a,b)=>a+b,0)&&s.result.xp===expertCount*45,'Score expert et bonus de série exacts');
  check(s.state.subtopics['animals::Insectes'].xp===expertCount*45&&s.state.topics.animals.xp===expertCount*45&&!s.state.subtopics['animals::Faune'],'La compétence Insectes progresse avec son univers, sans modifier Faune');
  await click('[data-action="replay"]');check(await evaluate('document.querySelector("#setup-title").textContent==="Insectes"&&document.querySelector("#difficulty").value==="4"'),'Rejouer conserve le sous-thème et la difficulté');await click('[data-action="close-setup"]');
  await screenshot('03-bilan-desktop');
  await delay(900);check(await evaluate('!Curiona.audio().playing&&Curiona.audio().activeVoices===0'),'La musique s’arrête proprement en fin de partie');
  check(s.state.badges.includes('first'),'Badge de première partie attribué');
  await click('[data-action="notebook"]');check(await evaluate('document.querySelectorAll(".notebook-card").length===1'),'La fiche gardée se retrouve dans le carnet');const xpBeforeNotebook=(await snapshot()).state.xp;await click('.notebook-card summary');check((await snapshot()).state.xp===xpBeforeNotebook,'Relire une fiche ne change pas l’expérience');await screenshot('11-mes-fiches-desktop');
  await evaluate('(()=>{const input=document.querySelector("#notebook-search");input.value="introuvablexyz";input.dispatchEvent(new Event("input",{bubbles:true}));})()');check(await evaluate('!document.querySelector("#notebook-empty").hidden'),'La recherche des fiches gère une absence de résultat');await evaluate('(()=>{const input=document.querySelector("#notebook-search");input.value="";input.dispatchEvent(new Event("input",{bubbles:true}));})()');await click('[data-action="home"]');
  const savedXp=s.state.xp;await send('Page.reload');await delay(200);check((await snapshot()).state.xp===savedXp,'La progression survit au rechargement dans Chrome');
  await click('[data-action="setup"][data-mode="challenge"]');await select('#question-count',8);await select('#difficulty',1);await click('[data-action="start"]');await delay(550);s=await snapshot();check(s.session.remaining<30,'Chronomètre du Défi actif');
  const q=bank.find(q=>q.id===s.session.current.id);await click(`[data-answer="${q.correct}"]`);const paused=(await snapshot()).session.remaining;await delay(1100);check((await snapshot()).session.remaining===paused,'Chronomètre immobile pendant la correction');
  await click('[data-action="next"]');await delay(200);
  await evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});document.dispatchEvent(new Event("visibilitychange"));');const hiddenTime=(await snapshot()).session.remaining;await delay(900);check((await snapshot()).session.remaining===hiddenTime,'Chronomètre immobile lorsque le document est masqué');check(await evaluate('!Curiona.audio().playing&&Curiona.audio().activeVoices===0'),'Onglet masqué : la musique se met en pause et libère ses notes');await evaluate('delete document.hidden;document.dispatchEvent(new Event("visibilitychange"));');await delay(150);check(await evaluate('Curiona.audio().playing'),'La musique reprend au retour dans l’onglet');
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
  check(await evaluate('document.querySelector("[data-action=start]").disabled'),'Mélange vide : départ désactivé');
  await click('details[data-cat="tech"] summary');await click('[data-theme="tech::Programmation"]');await select('#difficulty',3);check(await evaluate(`document.querySelector("#availability").textContent.includes("${programmingCount} questions disponibles")`),'Mode personnalisé : sous-thème précis et difficulté cumulés');await click('[data-action="switch-mode"][data-mode="relax"]');check(await evaluate(`document.querySelector("#availability").textContent.includes("${programmingCount} questions disponibles")`),'Passer en Détente conserve le mélange personnalisé');await click('[data-action="close-setup"]');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await screenshot('04-accueil-mobile');
  check(await evaluate('document.querySelector(".resume-banner").getBoundingClientRect().top>=document.querySelector(".nav").getBoundingClientRect().bottom'),'Bannière de reprise mobile sous la navigation, sans chevauchement');
  await click('[data-action="subtheme"][data-theme-key="nature::Jardinage"]');await select('#difficulty','adaptive');
  check(await evaluate('document.querySelector("#setup-dialog").scrollWidth<=document.querySelector("#setup-dialog").clientWidth&&document.querySelector("#setup-title").textContent==="Jardinage"'),'Réglages mobiles du sous-thème lisibles sans débordement horizontal');
  check(await evaluate('(()=>{const r=document.querySelector("#setup-dialog [data-action=start]").getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;})()'),'Le bouton Commencer reste visible sur mobile sans faire défiler les réglages');await screenshot('10-reglages-jardinage-mobile');await click('[data-action="close-setup"]');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Accueil mobile 390 px sans débordement');await click('[data-action="resume"]');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Question mobile sans débordement');await screenshot('05-question-mobile');
  s=await snapshot();const mobileQ=bank.find(q=>q.id===s.session.current.id);await click(`[data-answer="${mobileQ.correct}"]`);await screenshot('06-correction-mobile');
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Correction mobile sans débordement');
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');check(await nextButtonVisible(),'Mobile : question suivante visible sans descendre dans la correction');await delay(350);const mobileShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(root,'artifacts/15-suivante-fixe-mobile.png'),Buffer.from(mobileShot.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:844,height:390,deviceScaleFactor:1,mobile:true});check(await nextButtonVisible(),'Mobile en paysage : la barre reste accessible');await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await click('[data-action="stats"]');await screenshot('07-statistiques-mobile');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Statistiques et historique mobiles sans débordement');
  await click('[data-action="help"]');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Carnet de route mobile sans débordement');
  await click('[data-action="notebook"]');check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Mes fiches reste lisible sur mobile');await click('.notebook-card summary');await screenshot('12-mes-fiches-mobile');await click('[data-action="bookmark"]');check((await snapshot()).state.bookmarks.length===0,'Une fiche se retire du carnet et de la sauvegarde');await click('.audio-settings summary');check(await evaluate('(()=>{const r=document.querySelector(".audio-settings-panel").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})()'),'Le réglage du volume reste dans l’écran mobile');await screenshot('13-volume-mobile');await click('.audio-settings summary');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});await click('[data-action="stats"]');await screenshot('08-statistiques-desktop');
  await click('[data-action="home"]');await click('[data-action="subtheme"][data-theme-key="nature::Jardinage"]');await click('[data-action="switch-mode"][data-mode="relax"]');await select('#difficulty',1);await click('[data-action="start"]');await click('#accept-confirm');
  s=await snapshot();check(s.session.config.mode==='relax'&&s.session.config.scope==='single'&&s.session.config.themes[0]==='nature::Jardinage'&&bank.find(q=>q.id===s.session.current.id).subtheme==='Jardinage','Détente joue réellement le sous-thème choisi, sans élargir aux autres univers');
  await click('[data-action="pause"]');await send('Page.reload');await delay(200);s=await snapshot();check(s.session.config.scope==='single'&&s.session.config.themes[0]==='nature::Jardinage','Le thème précis reste associé à la partie après rechargement');
  await click('[data-action="setup"][data-mode="challenge"]');await select('#difficulty',1);await click('[data-action="start"]');await click('#accept-confirm');
  s=await snapshot();check(s.session.config.themes[0]==='nature::Jardinage'&&bank.find(q=>q.id===s.session.current.id).subtheme==='Jardinage','Passer au Défi conserve Jardinage jusque dans les questions tirées');
  await send('Emulation.setVirtualTimePolicy',{policy:'advance',budget:31000,maxVirtualTimeTaskStarvationCount:10000});await delay(300);
  s=await snapshot();check(s.session.current.answered&&s.session.current.selected===-1&&s.session.answers.at(-1).correct===false,'Expiration réelle du chrono Chrome : correction ouverte, réponse incorrecte unique');
  await send('Emulation.setVirtualTimePolicy',{policy:'pause'});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const [category,subtheme] of [['language','Vocabulaire'],['daily','Cuisine'],['prevention','Substances et effets'],['politics','Europe'],['prevention','Habitudes, jeux et alimentation']]){
    await click('[data-action="home"]');await click(`[data-action="subtheme"][data-theme-key="${category}::${subtheme}"]`);await select('#difficulty',1);await click('[data-action="start"]');await click('#accept-confirm');
    s=await snapshot();const q=bank.find(q=>q.id===s.session.current.id);check(q.category===category&&q.subtheme===subtheme,'Une partie réelle utilise le nouvel univers : '+category);await click(`[data-answer="${q.correct}"]`);s=await snapshot();check(s.session.answers.at(-1).correct&&s.state.subtopics[category+'::'+subtheme].xp>0,'La correction et la compétence fonctionnent dans '+category);
  }
  check(errors.length===0,'Aucune exception JavaScript');
  await writeFile(path.join(root,'artifacts/browser-report.json'),JSON.stringify({browser:'Google Chrome',date:new Date().toISOString(),offline:true,checks,errors,mobile:'Émulation 390 × 844, pas un téléphone physique'},null,2));
  console.log(`${checks.length} contrôles Chrome réussis.`);
}finally{
  ws?.close();chrome.kill();await delay(500);
  // Le chemin supprimé est exclusivement le profil temporaire créé par ce script.
  if(path.dirname(profile)===tmpdir()&&path.basename(profile).startsWith('curiona-qa-'))await rm(profile,{recursive:true,force:true}).catch(()=>{});
}
