import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import bank,{LEGACY_QUESTIONS} from '../src/bank.mjs';
import {validateBank} from '../src/engine.mjs';

// Le service publié reste autonome : il embarque sa propre copie versionnée.
const destination=process.argv[2];
if(!destination||!path.isAbsolute(destination))throw Error('Indiquer le chemin absolu du fichier worker/questions.mjs du service.');
validateBank(bank);
const previous=new Map(LEGACY_QUESTIONS.map(q=>[q.id,q.difficulty]));
const snapshot=bank.map(q=>({...q,...(previous.has(q.id)?{legacyDifficulty:previous.get(q.id)}:{})}));
await writeFile(destination,'// Banque Curiona 3.2 ; les anciennes manches conservent legacyDifficulty.\nexport default '+JSON.stringify(snapshot)+';\n');
console.log(snapshot.length+' questions exportées dans le service de battles.');
