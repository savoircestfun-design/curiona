// Une entrée commune pour le build, les audits éditoriaux et les tests.
// Les trois banques historiques restent intactes afin de préserver leurs IDs.
import nature from '../dist/data/nature.js';
import sciences from '../dist/data/sciences.js';
import culture from '../dist/data/culture.js';
import extras from '../dist/data/extras.js';
import natureExpansion from '../dist/data/expansion-nature.js';
import scienceExpansion from '../dist/data/expansion-science.js';
import cultureExpansion from '../dist/data/expansion-culture.js';
import additions from './content-v3/index.mjs';
export const BASE_QUESTIONS=[...nature,...sciences,...culture];
export const LEGACY_QUESTIONS=[...BASE_QUESTIONS,...natureExpansion,...scienceExpansion,...cultureExpansion,...extras];
// Les questions précédentes occupent désormais les niveaux intermédiaires.
// Leurs IDs, réponses et explications restent stables pour les anciens carnets.
// Les nouveaux extrêmes proposent des notions plus accessibles ou plus poussées.
export default [...LEGACY_QUESTIONS.map(q=>({...q,difficulty:q.difficulty<=2?2:3})),...additions];
