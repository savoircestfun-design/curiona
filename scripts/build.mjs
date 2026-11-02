import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateBank,CATEGORIES} from '../src/engine.mjs';
import variants from '../src/variants.mjs';
import bank from '../src/bank.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const [id,variant] of Object.entries(variants)){const q=bank.find(q=>q.id===id);if(!q)throw Error('Variante inconnue : '+id);q.variant=variant;}
validateBank(bank);for(const c of CATEGORIES){const count=bank.filter(q=>q.category===c.id).length;if(count<200)throw Error(`${c.name} : ${count} questions, au moins 200 nécessaires.`);}
const engine=(await readFile(path.join(root,'src/engine.mjs'),'utf8')).replace(/^export /gm,'');
const app=await readFile(path.join(root,'src/app.js'),'utf8');
const music=await readFile(path.join(root,'src/music.js'),'utf8');
const themeUi=await readFile(path.join(root,'src/theme-ui.js'),'utf8');
const discovery=await readFile(path.join(root,'src/discovery-ui.js'),'utf8');
const notebook=await readFile(path.join(root,'src/notebook-ui.js'),'utf8');
const comfort=await readFile(path.join(root,'src/comfort-ui.js'),'utf8');
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/game.bundle.js'),`/* Curiona 2.0 — généré par npm run build. */\n(()=>{\n'use strict';\n${engine}\nconst QUESTIONS=${JSON.stringify(bank)};\n${music}\n${themeUi}\n${discovery}\n${notebook}\n${comfort}\n${app}\n})();\n`);
console.log(`${bank.length} questions intégrées. Distribution : ${CATEGORIES.map(c=>c.name+' '+bank.filter(q=>q.category===c.id).length).join(' · ')}`);
