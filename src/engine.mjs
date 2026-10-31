export const CATEGORIES = [
  {id:'animals',name:'Monde animal',icon:'butterfly',color:'#466956',bg:'#e7eee0',description:'Des ailes, des pattes et mille façons de vivre.',subs:['Insectes','Faune','Biodiversité']},
  {id:'nature',name:'Nature & jardin',icon:'leaf',color:'#62713a',bg:'#edf0dc',description:'Prendre le temps de comprendre ce qui pousse.',subs:['Plantes','Arbres','Jardinage']},
  {id:'math',name:'Maths & logique',icon:'shapes',color:'#9a572f',bg:'#f8e8d8',description:'Le plaisir du déclic et des idées qui s’assemblent.',subs:['Calcul','Logique','Géométrie']},
  {id:'mind',name:'Esprit humain',icon:'mind',color:'#805772',bg:'#f0e5ed',description:'Mémoire, attention et petits mystères du quotidien.',subs:['Mémoire','Cognition','Vie sociale']},
  {id:'science',name:'Sciences & espace',icon:'planet',color:'#446b83',bg:'#e2edf3',description:'Du plus petit atome aux grandes galaxies.',subs:['Corps humain','Physique et chimie','Astronomie']},
  {id:'world',name:'Culture & monde',icon:'globe',color:'#aa523f',bg:'#f7e5de',description:'Voyager à travers les lieux, les arts et le temps.',subs:['Histoire','Géographie','Arts et culture']},
  {id:'tech',name:'Informatique',icon:'chip',color:'#58628a',bg:'#e8e9f3',description:'Comprendre les outils qui relient nos idées.',subs:['Numérique','Programmation','Réseaux']}
];
export const DIFFICULTIES = ['','Débutant','Intermédiaire','Avancé','Expert'];
export const MODES = [
  {id:'general',name:'Grand mélange',label:'Général',icon:'spark',description:'Un peu de tout, beaucoup de découvertes.'},
  {id:'specific',name:'À la carte',label:'Spécifique',icon:'compass',description:'Un univers ou un sous-thème à explorer.'},
  {id:'custom',name:'Sur mesure',label:'Personnalisé',icon:'sliders',description:'Compose ton mélange de thèmes.'},
  {id:'review',name:'Le bon rappel',label:'Révision',icon:'repeat',description:'Retrouve les notions au bon moment.'},
  {id:'challenge',name:'Cap sur le défi',label:'Défi',icon:'flag',description:'Un objectif de points, 30 secondes par question.'},
  {id:'relax',name:'À ton rythme',label:'Détente',icon:'cup',description:'Sans chrono. Juste le plaisir d’apprendre.'}
];
export const BADGES = [
  {id:'first',name:'Premier pas',description:'Terminer une première exploration.',icon:'compass'},
  {id:'streak',name:'Sur ta lancée',description:'Réussir 5 réponses de suite.',icon:'spark'},
  {id:'curious',name:'Esprit curieux',description:'Découvrir les 7 univers.',icon:'globe'},
  {id:'fifty',name:'Belle récolte',description:'Trouver 50 bonnes réponses.',icon:'leaf'},
  {id:'review',name:'Le déclic',description:'Réussir 5 rappels en mode Révision.',icon:'repeat'},
  {id:'challenge',name:'Cap atteint',description:'Atteindre l’objectif d’un défi terminé.',icon:'flag'},
  {id:'hundred',name:'Cent découvertes',description:'Rencontrer 100 questions différentes.',icon:'planet'},
  {id:'expert',name:'En profondeur',description:'Réussir 10 questions de niveau expert.',icon:'shapes'}
];
export function freshState() {
  return {version:1,xp:0,points:0,total:0,correct:0,bestStreak:0,reviewCorrect:0,expertCorrect:0,questions:{},topics:{},history:[],badges:[],sound:false,active:null};
}
export function shuffle(items,rng=Math.random) {
  const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result;
}
export function shuffledOptions(question,rng=Math.random){return shuffle(question.options.map((text,id)=>({text,id})),rng);}
export function isCorrect(question,optionId){return optionId===question.correct;}
export function filterQuestions(bank,config,state,now=Date.now()) {
  return bank.filter(q=>{
    if(config.difficulty!=='adaptive' && q.difficulty!==Number(config.difficulty)) return false;
    if(['specific','custom'].includes(config.mode) && !config.themes.some(t=>t===q.category || t===`${q.category}::${q.subtheme}`)) return false;
    if(config.mode==='review') {const s=state.questions[q.id]; if(!s || s.nextDue>now) return false;}
    return true;
  });
}
export function pickQuestion(bank,state,config,used=[],rng=Math.random,now=Date.now()) {
  let eligible=filterQuestions(bank,config,state,now).filter(q=>!used.includes(q.id));
  if(!eligible.length) return null;
  // Écarter la dernière rencontre entre deux parties si un autre choix existe.
  const latest=Object.entries(state.questions).reduce((best,[id,s])=>s.lastSeen>(best.time||0)?{id,time:s.lastSeen}:best,{});
  if(eligible.length>1&&now-latest.time<600000)eligible=eligible.filter(q=>q.id!==latest.id);
  const counts={}; used.forEach(id=>{const c=bank.find(q=>q.id===id)?.category;if(c)counts[c]=(counts[c]||0)+1;});
  const weights=eligible.map(q=>{
    const s=state.questions[q.id],level=state.topics[q.category]?.level||1;
    let w=1/Math.pow(1+(s?.seen||0),1.4);
    if(config.difficulty==='adaptive') w*=Math.pow(0.16,Math.abs(q.difficulty-level));
    if(s && s.nextDue<=now) w*=s.box===0?4:2;
    if(s && now-s.lastSeen<600000) w*=0.03;
    w/=1+(counts[q.category]||0)*1.4;
    return w;
  });
  let n=rng()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<eligible.length;i++){n-=weights[i];if(n<=0)return eligible[i];}return eligible.at(-1);
}
export function reward(difficulty,correct,streak){return {points:correct?100+25*(difficulty-1)+Math.min(Math.max(0,streak-1),5)*10:0,xp:correct?25+difficulty*5:8};}
export function recordAnswer(state,q,correct,streak,mode,now=Date.now()) {
  const r=reward(q.difficulty,correct,streak); state.xp+=r.xp;state.points+=r.points;state.total++;if(correct)state.correct++;
  state.bestStreak=Math.max(state.bestStreak,streak);
  const s=state.questions[q.id]||{seen:0,correct:0,box:0,lastSeen:0,nextDue:0};
  s.seen++;if(correct)s.correct++;s.box=correct?Math.min(5,s.box+1):0;s.lastSeen=now;
  s.nextDue=now+(correct?[0,1,3,7,14,30][s.box]*86400000:600000);state.questions[q.id]=s;
  const t=state.topics[q.category]||{level:1,momentum:0,total:0,correct:0};t.total++;if(correct)t.correct++;
  t.momentum=correct?Math.max(0,t.momentum)+1:Math.min(0,t.momentum)-1;
  if(t.momentum>=3){t.level=Math.min(4,t.level+1);t.momentum=0;}if(t.momentum<=-2){t.level=Math.max(1,t.level-1);t.momentum=0;}state.topics[q.category]=t;
  if(mode==='review'&&correct)state.reviewCorrect++;if(q.difficulty===4&&correct)state.expertCorrect++;
  return r;
}
export function earnedBadges(state) {
  const conditions={first:state.history.some(h=>!h.abandoned),streak:state.bestStreak>=5,curious:CATEGORIES.every(c=>state.topics[c.id]?.total>0),fifty:state.correct>=50,review:state.reviewCorrect>=5,challenge:state.history.some(h=>h.mode==='challenge'&&!h.abandoned&&h.score>=h.target),hundred:Object.keys(state.questions).length>=100,expert:state.expertCorrect>=10};
  return BADGES.filter(b=>conditions[b.id]&&!state.badges.includes(b.id)).map(b=>b.id);
}
export function playerLevel(xp){return 1+Math.floor(Math.sqrt(xp/100));}
export function validateBank(bank) {
  const ids=new Set(),texts=new Set();for(const q of bank){
    if(ids.has(q.id))throw Error('Identifiant dupliqué : '+q.id);ids.add(q.id);
    const normalized=q.question.toLocaleLowerCase('fr').replace(/[\s’'?.!,;:]/g,'');if(texts.has(normalized))throw Error('Question dupliquée : '+q.id);texts.add(normalized);
    if(!CATEGORIES.some(c=>c.id===q.category&&c.subs.includes(q.subtheme)))throw Error('Thème inconnu : '+q.id);
    if(!Number.isInteger(q.difficulty)||q.difficulty<1||q.difficulty>4)throw Error('Difficulté invalide : '+q.id);
    if(![2,4].includes(q.options.length)||new Set(q.options).size!==q.options.length||!q.options.every(o=>typeof o==='string'&&o.trim()))throw Error('Propositions invalides : '+q.id);
    if(!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length||typeof q.explanation!=='string'||q.explanation.length<70)throw Error('Correction invalide : '+q.id);
    if(q.source&&!/^https:\/\//.test(q.source))throw Error('Source invalide : '+q.id);
  }return true;
}
export function parseSave(input,bank) {
  if(!input||input.app!=='curiona'||input.version!==1||!input.state||typeof input.state!=='object')throw Error('Ce fichier n’est pas une sauvegarde Curiona compatible.');
  const raw=input.state,result=freshState();
  const number=(n,max=1e9)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
  for(const key of ['xp','points','total','correct','bestStreak','reviewCorrect','expertCorrect']){if(!number(raw[key]))throw Error('La sauvegarde contient des statistiques invalides.');result[key]=Math.floor(raw[key]);}
  if(result.correct>result.total)throw Error('Statistiques incohérentes.');
  const ids=new Set(bank.map(q=>q.id));if(!raw.questions||typeof raw.questions!=='object'||Array.isArray(raw.questions))throw Error('Questions sauvegardées invalides.');
  for(const [id,s] of Object.entries(raw.questions)){
    if(!ids.has(id))continue;if(!s||!['seen','correct','box','lastSeen','nextDue'].every(k=>number(s[k],k.includes('Seen')||k==='nextDue'?1e14:1e9))||s.correct>s.seen||s.box>5)throw Error('Progression invalide.');
    result.questions[id]={seen:Math.floor(s.seen),correct:Math.floor(s.correct),box:Math.floor(s.box),lastSeen:s.lastSeen,nextDue:s.nextDue};
  }
  for(const c of CATEGORIES){const t=raw.topics?.[c.id];if(!t)continue;if(!number(t.level,4)||t.level<1||!number(t.total)||!number(t.correct)||t.correct>t.total||!Number.isInteger(t.momentum)||Math.abs(t.momentum)>3)throw Error('Niveau de thème invalide.');result.topics[c.id]={level:Math.floor(t.level),total:Math.floor(t.total),correct:Math.floor(t.correct),momentum:t.momentum};}
  if(!Array.isArray(raw.history)||raw.history.length>100)throw Error('Historique invalide.');
  result.history=raw.history.map(h=>{
    if(!h||!MODES.some(m=>m.id===h.mode)||!['score','correct','total','xp','date','target'].every(k=>number(h[k],k==='date'?1e14:1e9))||h.correct>h.total||!Array.isArray(h.answers)||h.answers.length>50)throw Error('Partie invalide.');
    const answers=h.answers.map(a=>{if(!a||!ids.has(a.id)||typeof a.correct!=='boolean')throw Error('Réponse invalide.');return{id:a.id,correct:a.correct};});
    if(answers.length!==h.total||answers.filter(a=>a.correct).length!==h.correct||new Set(answers.map(a=>a.id)).size!==answers.length)throw Error('Historique incohérent.');
    return {mode:h.mode,score:h.score,correct:h.correct,total:h.total,xp:h.xp,date:h.date,target:h.target,abandoned:!!h.abandoned,answers};
  });
  result.sound=raw.sound===true;result.badges=BADGES.filter(b=>Array.isArray(raw.badges)&&raw.badges.includes(b.id)).map(b=>b.id);
  // Une sauvegarde importée reprend le carnet, jamais un script ou une session arbitraire.
  result.active=null;return result;
}
