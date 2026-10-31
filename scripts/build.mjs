import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateBank,CATEGORIES} from '../src/engine.mjs';
import variants from '../src/variants.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const bank=[];for(const name of ['nature','sciences','culture','extras']){const {default:part}=await import(`../dist/data/${name}.js?build=${Date.now()}`);bank.push(...part);}
for(const [id,variant] of Object.entries(variants)){const q=bank.find(q=>q.id===id);if(!q)throw Error('Variante inconnue : '+id);q.variant=variant;}
validateBank(bank);if(bank.length<300)throw Error('Au moins 300 questions sont nécessaires.');
const engine=(await readFile(path.join(root,'src/engine.mjs'),'utf8')).replace(/^export /gm,'');
const app=await readFile(path.join(root,'src/app.js'),'utf8');
const music=await readFile(path.join(root,'src/music.js'),'utf8');
const themeUi=await readFile(path.join(root,'src/theme-ui.js'),'utf8');
const discovery=await readFile(path.join(root,'src/discovery-ui.js'),'utf8');
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/game.bundle.js'),`/* Curiona 1.3 — généré par npm run build. */\n(()=>{\n'use strict';\n${engine}\nconst QUESTIONS=${JSON.stringify(bank)};\n${music}\n${themeUi}\n${discovery}\n${app}\n})();\n`);
console.log(`${bank.length} questions intégrées. Distribution : ${CATEGORIES.map(c=>c.name+' '+bank.filter(q=>q.category===c.id).length).join(' · ')}`);
