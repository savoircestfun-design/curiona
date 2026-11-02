// Une entrée commune pour le build, les audits éditoriaux et les tests.
// Les trois banques historiques restent intactes afin de préserver leurs IDs.
import nature from '../dist/data/nature.js';
import sciences from '../dist/data/sciences.js';
import culture from '../dist/data/culture.js';
import extras from '../dist/data/extras.js';
import natureExpansion from '../dist/data/expansion-nature.js';
import scienceExpansion from '../dist/data/expansion-science.js';
import cultureExpansion from '../dist/data/expansion-culture.js';
export const BASE_QUESTIONS=[...nature,...sciences,...culture];
export default [...BASE_QUESTIONS,...natureExpansion,...scienceExpansion,...cultureExpansion,...extras];
