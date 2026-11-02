# Extension culture et langue — contrôles éditoriaux

Mise à jour : 2 novembre 2026.

Le fichier `dist/data/expansion-culture.js` contient 504 questions originales : 152 pour Esprit humain, 152 pour Culture & monde et 200 pour Langue française. Ajoutées aux banques historiques, les deux premiers univers atteignent chacun 200 questions. Chaque univers final compte 50 questions par sous-thème et 50 par niveau. L’extension contient 75 vrai/faux et 429 QCM.

## Principes de rédaction

Les explications sont originales, sans reproduction de passages des sources. La progression va de notions concrètes à des distinctions de vocabulaire, de méthode ou d’interprétation. La passe finale a revu prioritairement les distracteurs avancés et experts pour proposer des confusions du même domaine. Les niveaux restent un classement éditorial, sans étalonnage auprès de joueurs.

En psychologie, les effets sont décrits avec leurs conditions et limites : ni diagnostic à partir d’un comportement isolé, ni promesse de méthode universelle. Des items distinguent mesure, mécanisme, causalité et généralisation ; plusieurs items trop proches ont été remplacés par des tâches ou concepts distincts.

En langue, les mots polysémiques ont un contexte. Les accords indiquent les référents nécessaires ; les graphies admises en 1990 ne sont pas traitées comme fautives pour ce seul motif. La règle traditionnelle est explicitée pour après que. Les couleurs simples rose/orange et la nuance composée bleu clair font l’objet de cas distincts.

## Références consultées pour des contrôles ponctuels

Ces références ont servi à vérifier des notions précises ; elles ne constituent pas une vérification documentaire exhaustive des 504 questions.

- APA, pratique délibérée et feedback : https://www.apa.org/education-career/k12/practice-acquisition
- APS, protocole et examen préalable des Registered Reports : https://www.psychologicalscience.org/publications/clinical/registered-reports-at-cps
- Expérimentation sur les jugements se souvenir / savoir et leurs limites d’interprétation : https://pmc.ncbi.nlm.nih.gov/articles/PMC3637981/
- OQLF, synthèse de l’accord du participe passé avec avoir : https://vitrinelinguistique.oqlf.gouv.qc.ca/24221/la-grammaire/le-verbe/accord-du-participe-passe/avec-lauxiliaire-avoir/synthese-des-regles-daccord-du-participe-passe-employe-avec-avoir
- OQLF, présentation des rectifications de l’orthographe : https://vitrinelinguistique.oqlf.gouv.qc.ca/lorthographe/rectifications-de-lorthographe
- OQLF, modes après les subordonnants composés : https://vitrinelinguistique.oqlf.gouv.qc.ca/24238/la-grammaire/le-verbe/modes/subjonctif/subjonctif-ou-indicatif-apres-les-subordonnants-composes
- Bureau de la traduction du Canada, après que et la règle traditionnelle : https://nos-langues.canada.ca/fr/cles-de-la-redaction/apres-que-indicatif-ou-subjonctif
- Bureau de la traduction du Canada, adjectifs de couleur : https://nos-langues.canada.ca/fr/cles-de-la-redaction/adjectifs-de-couleur
- BnF, limite bibliographique des incunables : https://www.bnf.fr/fr/les-incunables
- CNRTL/TLFi, distinction du voûtain : https://www.cnrtl.fr/definition/vo%C3%BBtain
- UNESCO, critères du patrimoine mondial et valeur universelle exceptionnelle : https://whc.unesco.org/en/criteria.htm
- UNESCO, documentation du Grand Zimbabwe et de sa maçonnerie de pierre : https://whc.unesco.org/en/list/364
- ICOMOS, principes de conservation et anastylose (document repéré lors de la recherche) : https://publ.icomos.org/publicomos/jlbSai?base=technica&file=2222.pdf&html=Bur&path=K649-Monuments_and_Sites-v20-2009.pdf

## Vérification technique

Import Node et syntaxe JavaScript contrôlés. Les 504 identifiants et les 504 énoncés normalisés sont distincts. Les options sont distinctes, les indices de bonne réponse valides et toutes les explications dépassent 70 caractères. Les matrices sous-thème/niveau ont été contrôlées, puis confrontées aux 48 questions initiales de chaque univers existant.
