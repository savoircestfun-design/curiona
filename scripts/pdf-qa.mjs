// Integration QA for real browser downloads. Uses only a disposable Chrome profile.
// Before the first PDF generation in a task, run the PDF skill's artifact marker.
import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,rm,readFile,readdir,copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {freshState,recordAnswer} from '../src/engine.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'artifacts/pdf-qa');
await mkdir(output,{recursive:true});
const downloads=await mkdtemp(path.join(output,'downloads-'));
const profile=await mkdtemp(path.join(tmpdir(),'curiona-pdf-qa-'));
const urlFlag=process.argv.indexOf('--url');
const url=urlFlag>=0?process.argv[urlFlag+1]:pathToFileURL(path.join(root,'dist/index.html')).href;
if(!url)throw Error('--url requires an address.');
const chromePath=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const chrome=spawn(chromePath,['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'],{stdio:'ignore'});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const checks=[],errors=[],documents=[];
let ws,sequence=0;
const pending=new Map();
const check=(condition,label)=>{assert.ok(condition,label);checks.push(label);console.log('✓ '+label);};
async function send(method,params={}){
  const id=++sequence;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);
    pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression){
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
  if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
  return result.result.value;
}
const snapshot=()=>evaluate('Curiona.snapshot()');
async function click(selector){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing element '+${JSON.stringify(selector)});el.click();})()`);
}
async function select(selector,value){
  return evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing select '+${JSON.stringify(selector)});el.value=${JSON.stringify(String(value))};el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
}
async function screenshot(name){
  await delay(150);const {data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
  await writeFile(path.join(output,name+'.png'),Buffer.from(data,'base64'));
}
async function importState(state){
  await evaluate(`(()=>{const file=new File([JSON.stringify({app:'curiona',version:1,state:${JSON.stringify(state)}})],'pdf-qa-save.json',{type:'application/json'});const transfer=new DataTransfer();transfer.items.add(file);const input=document.querySelector('#import-file');input.files=transfer.files;input.dispatchEvent(new Event('change'));})()`);
  await delay(100);await click('#accept-confirm');
}
async function selection(config){return evaluate(`Curiona.study(${JSON.stringify(config)})`);}
async function configure(config){
  await click('[data-action="study"]');
  await select('#study-kind',config.kind);
  await select('#study-theme',config.theme||'all');
  await select('#study-difficulty',config.difficulty||'all');
  await select('#study-size',config.batchSize||20);
  if(config.part)await select('#study-part',config.part);
}
async function download(config,name){
  await configure(config);
  const selected=await selection(config),before=new Set(await readdir(downloads));
  check(selected.items.length>0,name+' : sélection non vide');
  await click('[data-action="study-pdf"]');
  let file;
  for(let attempt=0;attempt<150;attempt++){
    const candidates=(await readdir(downloads)).filter(item=>!before.has(item)&&item.toLowerCase().endsWith('.pdf'));
    if(candidates.length){
      const candidate=path.join(downloads,candidates[0]);
      try{const data=await readFile(candidate);if(data.subarray(0,5).toString()==='%PDF-'){file=candidate;break;}}catch{}
    }
    await delay(100);
  }
  check(!!file,name+' : vrai fichier PDF téléchargé par Chrome');
  const target=path.join(output,name+'.pdf');await copyFile(file,target);
  documents.push({name,file:target,selection:selected});
  return selected;
}
const normalize=text=>String(text).normalize('NFC').replace(/[‐‑‒–—−]/g,'-').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();

try{
  let port;
  for(let attempt=0;attempt<100;attempt++){
    try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{await delay(100);}
  }
  if(!port)throw Error('Chrome did not start.');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  ws=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
  await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}));
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id){const operation=pending.get(message.id);if(!operation)return;clearTimeout(operation.timer);pending.delete(message.id);message.error?operation.reject(Error(message.error.message)):operation.resolve(message.result);}
    else if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);
  });
  await send('Runtime.enable');await send('Page.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads,eventsEnabled:true});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
  if(url.startsWith('file:')){
    await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  }
  await send('Page.navigate',{url});
  for(let attempt=0;attempt<150;attempt++){
    if(await evaluate('typeof window.Curiona?.study==="function"&&typeof window.Curiona?.pdf==="function"'))break;
    await delay(100);
  }
  check(await evaluate('typeof window.Curiona?.study==="function"&&typeof window.Curiona?.pdf==="function"'),'Les fonctions de sélection et de PDF sont disponibles');
  const bank=await evaluate('Curiona.bank()'),seed=freshState();
  const legacy=bank.find(q=>q.category==='mind'&&q.options.length===4);
  const timeout=bank.find(q=>q.category==='science'&&q.options.length===4);
  const now=Date.now();
  recordAnswer(seed,legacy,false,0,'specific',now-200000);
  recordAnswer(seed,timeout,false,0,'challenge',now-100000);
  seed.questions[timeout.id].lastWrongSelected=-1;seed.questions[timeout.id].lastWrongAt=now-100000;
  for(const category of ['nature','daily'])recordAnswer(seed,bank.find(q=>q.category===category),true,1,'specific',now-300000);
  seed.music=false;await importState(seed);
  let errorsSelection=await selection({kind:'errors'});
  const unknown=errorsSelection.items.find(item=>item.id===legacy.id);
  check(unknown&&unknown.wrong?.recorded===false&&unknown.wrong?.selected===null,'Un ancien carnet ne fabrique pas la réponse fautive inconnue');
  check(errorsSelection.items.find(item=>item.id===timeout.id)?.wrong?.selected===-1,'Un temps écoulé se distingue d’une réponse choisie');

  await click('[data-action="home"]');await click('[data-category="language"]');
  await select('#difficulty',1);await select('#question-count',8);await click('[data-action="start"]');
  let current=await snapshot();const realQuestion=bank.find(q=>q.id===current.session.current.id);
  const wrong=(realQuestion.correct+1)%realQuestion.options.length;
  await click(`[data-answer="${wrong}"]`);
  current=await snapshot();
  check(current.state.questions[realQuestion.id]?.lastWrongSelected===wrong,'Une vraie erreur conserve le choix original malgré le mélange');
  await click('[data-action="pause"]');await send('Page.reload');await delay(200);
  errorsSelection=await selection({kind:'errors'});
  check(errorsSelection.items.find(item=>item.id===realQuestion.id)?.wrong?.text===realQuestion.options[wrong],'La réponse fautive subsiste après rechargement');
  const restored=(await snapshot()).state;
  await importState(restored);
  check((await selection({kind:'errors'})).items.find(item=>item.id===realQuestion.id)?.wrong?.text===realQuestion.options[wrong],'Le transfert du carnet conserve les choix fautifs');
  const stateBefore=JSON.stringify((await snapshot()).state);

  await download({kind:'errors',theme:'all',batchSize:20},'01-mes-erreurs');
  await screenshot('01-pdf-erreurs-desktop');
  await download({kind:'review',theme:'all',batchSize:20},'02-revision-globale');
  const experts=await download({kind:'learn',theme:'math',difficulty:4,batchSize:'all'},'03-apprendre-maths-expert');
  check(experts.items.length===100&&experts.items.every(item=>item.question.category==='math'&&item.question.difficulty===4),'La fiche d’apprentissage respecte l’univers et la difficulté');
  const astronomy=await download({kind:'learn',theme:'science::Astronomie',difficulty:1,batchSize:20},'04-apprendre-astronomie');
  check(astronomy.items.length>0&&astronomy.items.every(item=>item.question.subtheme==='Astronomie'),'La fiche précise reste dans le sous-thème sélectionné');
  const politics=await download({kind:'learn',theme:'politics::Océanie',difficulty:4,batchSize:'all'},'05-politique-oceanie');
  check(politics.items.length===10&&politics.items.every(item=>item.question.subtheme==='Océanie'&&item.question.category==='politics'),'Le PDF Politique respecte le continent et le niveau');
  const prevention=await download({kind:'learn',theme:'prevention',difficulty:1,batchSize:20},'06-drogues-prevention');
  check(prevention.items.length===20&&prevention.items.every(item=>item.question.category==='prevention'),'Le PDF de sensibilisation utilise le nouvel univers');
  const xpAfter=JSON.stringify((await snapshot()).state);
  check(xpAfter===stateBefore,'Créer et télécharger les six fiches ne modifie pas la progression');
  const global=await selection({kind:'learn',theme:'all',batchSize:20});
  check(global.total===4400&&global.parts===220,'L’apprentissage global donne accès à toute la banque par parties');
  const next=await selection({kind:'learn',theme:'all',batchSize:20,part:2});
  check(!global.items.some(first=>next.items.some(second=>first.id===second.id)),'Deux parties successives ne répètent aucune question');

  await configure({kind:'errors',theme:'tech',batchSize:20});
  check(await evaluate('document.querySelector("[data-action=study-pdf]").disabled'),'Une sélection sans erreur désactive le téléchargement');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  check(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Les réglages de fiches restent lisibles sur mobile');
  await screenshot('02-pdf-reglages-mobile');
  check(errors.length===0,'Aucune exception JavaScript pendant les exports');

  const python=process.env.PYTHON_PATH||'python';
  const render=spawn(python,[path.join(root,'scripts/render-pdf-qa.py'),...documents.map(document=>document.file),'--output',path.join(output,'rendered')],{cwd:root,stdio:['ignore','pipe','pipe']});
  let rendererOutput='';for(const stream of [render.stdout,render.stderr])stream.on('data',data=>{rendererOutput+=data;});
  const rendererExit=await new Promise(resolve=>render.on('close',resolve));
  if(rendererExit!==0)throw Error('PDF extraction/render failed:\n'+rendererOutput);
  const rendered=JSON.parse(await readFile(path.join(output,'rendered/pdf-render-report.json'),'utf8'));
  for(const document of documents){
    const report=rendered.find(item=>item.file.toLowerCase()===document.file.toLowerCase());
    check(!!report&&report.pageCount>0,document.name+' : document PDF lisible');
    check(report.pages.every(page=>page.characters>=15),document.name+' : aucune page blanche');
    check(report.pages.every(page=>page.outOfPageGlyphs.length===0),document.name+' : aucun caractère hors page');
    const text=normalize(report.text);
    for(const item of document.selection.items){
      check(text.includes(normalize(item.question.question)),document.name+' : énoncé présent '+item.id);
      check(text.includes(normalize(item.answer)),document.name+' : bonne réponse présente '+item.id);
      check(text.includes(normalize(item.question.explanation)),document.name+' : explication présente '+item.id);
      if(item.wrong?.recorded)check(text.includes(normalize(item.wrong.text)),document.name+' : choix fautif explicite '+item.id);
    }
  }
  const mathReport=rendered.find(item=>item.file.endsWith('03-apprendre-maths-expert.pdf'));
  check(mathReport.pageCount>1,'Le document long est paginé sur plusieurs pages');
  const symbols=new Set(experts.items.flatMap(item=>Array.from(item.question.question+' '+item.answer+' '+item.question.explanation)).filter(char=>/[πλμ∞∈∑√αβ≤≥]/u.test(char)));
  check(symbols.size>0&&[...symbols].every(char=>mathReport.text.includes(char)),'Les symboles mathématiques et grecs restent lisibles dans le texte PDF');
  await writeFile(path.join(output,'browser-report.json'),JSON.stringify({date:new Date().toISOString(),url,checks,errors,documents:documents.map(({selection,...document})=>({...document,questions:selection.items.map(item=>item.id)}))},null,2));
  console.log(`${checks.length} contrôles PDF réussis. Rendus dans ${path.join(output,'rendered')}`);
}finally{
  ws?.close();chrome.kill();await delay(500);
  // Suppression exclusivement du profil temporaire créé par ce script.
  if(path.dirname(profile)===tmpdir()&&path.basename(profile).startsWith('curiona-pdf-qa-'))await rm(profile,{recursive:true,force:true}).catch(()=>{});
}
