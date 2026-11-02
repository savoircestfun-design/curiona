import {mkdir,writeFile} from 'node:fs/promises';
import {CATEGORIES,validateBank} from '../src/engine.mjs';
let bank;
if(process.argv.includes('--partial')){
  bank=[];for(const name of ['nature','sciences','culture','expansion-nature','expansion-science','expansion-culture','extras']){
    try{bank.push(...(await import(`../dist/data/${name}.js`)).default);}catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;}
  }
}else bank=(await import('../src/bank.mjs')).default;
validateBank(bank);
const normalize=t=>String(t).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').replace(/[^a-z0-9]+/g,' ').trim();
const stop=new Set('a au aux avec ce ces cet cette comme comment dans de des du elle en est et etre il ils la le les leur lui ne on ou par pas plus pour pourquoi qu que quel quelle quelles quels qui sa se ses son sont sur un une vrai faux'.split(' '));
const tokens=q=>new Set(normalize(q.question).split(' ').filter(w=>w.length>2&&!stop.has(w)).map(w=>/^\d+$/.test(w)?'#':w.length>5?w.replace(/s$/,''):w));
const tokenSets=new Map(bank.map(q=>[q.id,tokens(q)])),df=new Map();for(const set of tokenSets.values())for(const word of set)df.set(word,(df.get(word)||0)+1);
const weight=w=>1+Math.log((bank.length+1)/(1+df.get(w)));
const similar=[];
for(const c of CATEGORIES){
  const list=bank.filter(q=>q.category===c.id);
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
    const a=tokenSets.get(list[i].id),b=tokenSets.get(list[j].id);if(a.size<3||b.size<3)continue;
    let shared=0,count=0;for(const word of a)if(b.has(word)){shared+=weight(word);count++;}if(count<3)continue;
    const total=[...a,...b].reduce((sum,w)=>sum+weight(w),0),score=2*shared/total;
    if(score>=0.68)similar.push({score:Math.round(score*1000)/1000,category:c.id,a:list[i].id,b:list[j].id,questionA:list[i].question,questionB:list[j].question});
  }
}
similar.sort((a,b)=>b.score-a.score);
const explanations=new Map();for(const q of bank){const key=normalize(q.explanation);if(!explanations.has(key))explanations.set(key,[]);explanations.get(key).push(q.id);}
const duplicateExplanations=[...explanations.values()].filter(ids=>ids.length>1);
const categories=CATEGORIES.map(c=>{const list=bank.filter(q=>q.category===c.id);return{id:c.id,name:c.name,total:list.length,boolean:list.filter(q=>q.options.length===2).length,difficulties:[1,2,3,4].map(d=>list.filter(q=>q.difficulty===d).length),subthemes:c.subs.map(s=>({name:s,total:list.filter(q=>q.subtheme===s).length,levels:[1,2,3,4].map(d=>list.filter(q=>q.subtheme===s&&q.difficulty===d).length)}))};});
const report={questions:bank.length,categories,sourceLinks:bank.filter(q=>q.source).length,uniqueSources:new Set(bank.map(q=>q.source).filter(Boolean)).size,duplicateExplanations,similarQuestionCandidates:similar};
await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
await writeFile(new URL('../artifacts/content-audit.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({questions:report.questions,categories:categories.map(c=>({name:c.name,total:c.total,levels:c.difficulties,boolean:c.boolean})),duplicateExplanations,similarCandidates:similar.length,topCandidates:similar.slice(0,25),sourceLinks:report.sourceLinks},null,2));
// La proximité lexicale est une invitation à relire, pas un verdict factuel.
