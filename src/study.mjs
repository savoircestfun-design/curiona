import {CATEGORIES,DIFFICULTIES} from './engine.mjs';

export const STUDY_KINDS={
  errors:{label:'Mes erreurs',title:'Comprendre mes erreurs',description:'Les questions auxquelles tu as déjà répondu faux, avec leur correction.'},
  review:{label:'Réviser',title:'Mon carnet de révision',description:'Les notions déjà rencontrées, en commençant par celles à consolider.'},
  learn:{label:'Apprendre',title:'Une fiche pour apprendre',description:'Des questions et des explications à découvrir, même sans avoir joué.'}
};

function studyThemeLabel(theme){
  if(theme==='all')return 'Tous les univers';
  const [id,sub]=String(theme).split('::'),category=CATEGORIES.find(c=>c.id===id);
  return category?(sub&&category.subs.includes(sub)?`${sub} - ${category.name}`:category.name):'Thème inconnu';
}
function studyCompareTopics(a,b){
  const ac=CATEGORIES.findIndex(c=>c.id===a.category),bc=CATEGORIES.findIndex(c=>c.id===b.category);
  if(ac!==bc)return ac-bc;
  const category=CATEGORIES[ac];
  return (category?.subs.indexOf(a.subtheme)??0)-(category?.subs.indexOf(b.subtheme)??0)||a.difficulty-b.difficulty||a.id.localeCompare(b.id,'fr',{numeric:true});
}
function studyWrongChoice(question,state){
  const progress=state.questions?.[question.id]||{};
  let selected=progress.lastWrongSelected,date=progress.lastWrongAt;
  if(selected===undefined){
    for(const attempt of [state.active,...(state.history||[])]){
      const answer=attempt?.answers?.find(a=>a.id===question.id&&a.correct===false&&a.selected!==undefined);
      if(answer){selected=answer.selected;date=answer.answeredAt||attempt.date;break;}
    }
  }
  if(selected===-1)return {text:'Aucune réponse : temps écoulé.',recorded:true,date:date||0,selected};
  if(Number.isInteger(selected)&&selected>=0&&selected<question.options.length&&selected!==question.correct)return {text:question.options[selected],recorded:true,date:date||0,selected};
  return {text:'La réponse choisie n’a pas été enregistrée dans cet ancien carnet.',recorded:false,date:date||0,selected:null};
}

// Données de document uniquement : lire ou exporter ne modifie jamais le carnet.
export function studySelection(bank,state={},config={}){
  const kind=Object.hasOwn(STUDY_KINDS,config.kind)?config.kind:'errors';
  const theme=typeof config.theme==='string'?config.theme:'all';
  const difficulty=[1,2,3,4].includes(Number(config.difficulty))?Number(config.difficulty):'all';
  const batchSize=config.batchSize==='all'?'all':Number(config.batchSize)===50?50:20;
  const allowedThemes=new Set(['all',...CATEGORIES.flatMap(c=>[c.id,...c.subs.map(sub=>`${c.id}::${sub}`)])]);
  const subset=Array.isArray(config.questionIds)?new Set(config.questionIds):null;
  let questions=bank.filter(q=>{
    if(!allowedThemes.has(theme))return false;
    if(theme!=='all'&&q.category!==theme&&`${q.category}::${q.subtheme}`!==theme)return false;
    if(difficulty!=='all'&&q.difficulty!==difficulty)return false;
    if(subset&&!subset.has(q.id))return false;
    const s=state.questions?.[q.id];
    return kind==='learn'||(kind==='review'?s?.seen>0:s?.seen>s?.correct);
  });
  questions.sort((a,b)=>{
    const as=state.questions?.[a.id]||{},bs=state.questions?.[b.id]||{};
    if(kind==='errors')return (bs.lastWrongAt||bs.lastSeen||0)-(as.lastWrongAt||as.lastSeen||0)||((bs.seen||0)-(bs.correct||0))-((as.seen||0)-(as.correct||0))||studyCompareTopics(a,b);
    if(kind==='review')return (as.box||0)-(bs.box||0)||(as.nextDue||0)-(bs.nextDue||0)||studyCompareTopics(a,b);
    return studyCompareTopics(a,b);
  });
  // Une fiche globale de découverte présente chaque univers, même dans un lot court.
  if(kind==='learn'&&theme==='all'){
    const groups=CATEGORIES.map(c=>questions.filter(q=>q.category===c.id));
    questions=[];
    for(let row=0;groups.some(group=>row<group.length);row++)for(const group of groups)if(group[row])questions.push(group[row]);
  }
  const total=questions.length,pageSize=batchSize==='all'?Math.max(1,total):batchSize,parts=Math.max(1,Math.ceil(total/pageSize));
  const part=Math.min(parts,Math.max(1,Math.floor(Number(config.part)||1)));
  const start=total?(part-1)*pageSize+1:0,end=Math.min(part*pageSize,total);
  const items=questions.slice((part-1)*pageSize,part*pageSize).map(q=>({
    id:q.id,question:q,answer:q.options[q.correct],
    category:CATEGORIES.find(c=>c.id===q.category)?.name||q.category,
    difficulty:DIFFICULTIES[q.difficulty],
    errors:Math.max(0,(state.questions?.[q.id]?.seen||0)-(state.questions?.[q.id]?.correct||0)),
    wrong:kind==='errors'?studyWrongChoice(q,state):null
  }));
  return {kind,title:STUDY_KINDS[kind].title,description:STUDY_KINDS[kind].description,theme,themeLabel:studyThemeLabel(theme),difficulty,batchSize,part,parts,total,start,end,items,questionIds:subset?[...subset]:undefined};
}
