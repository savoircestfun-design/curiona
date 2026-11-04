import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateBank,CATEGORIES} from '../src/engine.mjs';
import variants from '../src/variants.mjs';
import bank from '../src/bank.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const [id,variant] of Object.entries(variants)){const q=bank.find(q=>q.id===id);if(!q)throw Error('Variante inconnue : '+id);q.variant=variant;}
validateBank(bank);for(const c of CATEGORIES){const count=bank.filter(q=>q.category===c.id).length;if(count!==400)throw Error(`${c.name} : ${count} questions, 400 nécessaires.`);}
const engine=(await readFile(path.join(root,'src/engine.mjs'),'utf8')).replace(/^export /gm,'');
const battleConfig=await readFile(path.join(root,'src/battle-config.js'),'utf8');
const battleUi=await readFile(path.join(root,'src/battle-ui.js'),'utf8');
const socialUi=await readFile(path.join(root,'src/social-ui.js'),'utf8');
const battleAttention=await readFile(path.join(root,'src/battle-attention.js'),'utf8');
const app=await readFile(path.join(root,'src/app.js'),'utf8');
const music=await readFile(path.join(root,'src/music.js'),'utf8');
const themeUi=await readFile(path.join(root,'src/theme-ui.js'),'utf8');
const discovery=await readFile(path.join(root,'src/discovery-ui.js'),'utf8');
const notebook=await readFile(path.join(root,'src/notebook-ui.js'),'utf8');
const comfort=await readFile(path.join(root,'src/comfort-ui.js'),'utf8');
const study=(await readFile(path.join(root,'src/study.mjs'),'utf8')).replace(/^import[^\n]*\r?\n/gm,'').replace(/^export /gm,'');
const studyUi=await readFile(path.join(root,'src/study-ui.js'),'utf8');
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/.nojekyll'),'');
await writeFile(path.join(root,'dist/game.bundle.js'),`/* Curiona 3.0 — généré par npm run build. */\n(()=>{\n'use strict';\n${engine}\nconst QUESTIONS=${JSON.stringify(bank)};\n${music}\n${themeUi}\n${discovery}\n${notebook}\n${comfort}\n${study}\n${studyUi}\n${battleConfig}\n${battleUi}\n${socialUi}\n${battleAttention}\n${app}\n})();\n`);
console.log(`${bank.length} questions intégrées. Distribution : ${CATEGORIES.map(c=>c.name+' '+bank.filter(q=>q.category===c.id).length).join(' · ')}`);
