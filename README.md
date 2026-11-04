# Curiona — La curiosité se cultive

Un jeu éducatif en français : **4 500 questions**, **11 univers** — dix de 400 questions et **Addictions et prévention de 500 questions** —, **47 sous-thèmes et continents**, **4 difficultés**, **4 façons de jouer en solo** et des **battles en ligne entre amis**. Gratuit et sans compte obligatoire. En solo, les questions, les explications et les ressources du jeu sont intégrées aux fichiers ; les réponses sont corrigées directement dans le navigateur.

## Jouer

Accès public : **[Jouer à Curiona](https://savoircestfun-design.github.io/curiona/)**. Le site ne demande aucun compte joueur. Le code est disponible dans [le dépôt GitHub](https://github.com/savoircestfun-design/curiona).

**En ligne**, ouvrir le lien du jeu dans un navigateur. Aucune installation ni inscription n’est nécessaire. Le chargement du site demande une connexion Internet ; la version en ligne ne garantit pas un accès hors connexion.

**Depuis les fichiers**, ouvrir `dist/index.html` dans Chrome en conservant le dossier complet. Le mode solo fonctionne sans réseau ; les battles demandent Internet. Sur Windows, le raccourci **« Jouer à Curiona - Google Chrome »**, s’il est installé, ouvre ce même fichier. Garder le dossier à son emplacement pour conserver l’adresse associée à la sauvegarde locale.

Chaque profil de navigateur conserve son propre carnet. Deux personnes qui utilisent le même profil partagent le même carnet ; les appareils et profils différents ont des progressions séparées. Il n’y a pas de synchronisation automatique entre appareils.

Pour recréer le raccourci après avoir déplacé le projet : clic droit sur `Installer-Raccourci.ps1` → **Exécuter avec PowerShell**, ou depuis PowerShell dans ce dossier :

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Installer-Raccourci.ps1
```

Cette option d’exécution ne s’applique qu’à ce processus et ne change pas la configuration permanente du système. Le script cherche Chrome, crée uniquement le raccourci Curiona et ne touche pas aux autres jeux.

## Battles entre amis

Ouvrir **Battles** dans la navigation, ou [accéder directement aux battles](https://savoircestfun-design.github.io/curiona/#battles). Un pseudo suffit pour jouer depuis des ordinateurs ou des maisons différents.

- **Trouver un adversaire** recherche un autre joueur sur le même thème. Le duel de 8 questions reste en attente après l'arrivée de l'adversaire : l'hôte le lance avec **Lancer la battle**. Il faut qu'une autre personne recherche effectivement ce thème.
- **Devenir hôte** crée un salon de **2 à 8 joueurs simultanés**, avec 8 places proposées par défaut. L'hôte choisit un univers, un sous-thème ou un continent, la difficulté et 8, 12, 20 ou 50 questions. Chaque arrivée reste dans la salle d'attente ; **seul l'hôte lance la battle**, lorsqu'au moins deux joueurs sont connectés. Il peut commencer avant que toutes les places soient occupées. Si le filtre contient moins de questions, la manche est raccourcie sans répétition.
- **Rejoindre mes amis** accepte le code du salon ou son lien d'invitation. Un mot de passe facultatif protège un groupe privé, qui reste masqué dans la liste mondiale.

L'écran en ligne présente d'abord les **groupes mondiaux ouverts**. Chaque carte montre l'hôte, les univers sélectionnés, la difficulté, le nombre réel de questions et les places disponibles. **Rejoindre ce groupe** entre directement, avec un pseudo, sans saisir de code. Les recherches par nom, hôte ou univers et le filtre d'univers aident à choisir. Les salons pleins, commencés, expirés ou sans joueur connecté ne sont pas proposés comme ouverts.

À la création, choisir **Mondial · ouvert** pour figurer dans cette liste, ou **Privé · entre amis** pour un accès par code ou invitation. Un groupe mondial n'a pas de mot de passe. Ouvrir au monde un ancien salon protégé retire explicitement sa protection ; l'interface l'indique avant l'application des options.

Cocher **plusieurs univers** compose un mélange, par exemple Nature + Politique. Le serveur répartit les questions entre les univers sélectionnés et respecte le niveau choisi, sans doublon. Un sous-thème ou continent précis reste sélectionnable. Le mélange peut être changé dans le salon d'attente ou à **Partie suivante**.

Après le bilan, **Partie suivante** prépare une nouvelle manche dans **le même groupe**, avec le même code, les mêmes accès et le même chat. L'hôte peut changer les thèmes, la difficulté, la longueur, la capacité et la visibilité, puis lancer la manche séparément. Les membres hors ligne gardent leur place. Scores, séries, sorties de page et pénalités repartent à zéro pour chaque manche ; les requêtes tardives d'une ancienne manche sont refusées.

Tous les joueurs reçoivent les mêmes questions et les mêmes propositions. Chaque question laisse **30 secondes** ; la correction apparaît quand tout le monde a répondu ou que le délai est écoulé. L'hôte continue après lecture. Les points sont calculés par le serveur selon la difficulté et la série de bonnes réponses. Dans les nouvelles battles de la version 2.4, une bonne réponse reçoit aussi jusqu'à **100 points de rapidité**, qui diminuent progressivement pendant les 30 secondes. La correction présente le détail des points. Le classement final indique le gagnant ou les ex æquo, le total de points, les bonnes réponses et les points forts et notions à retravailler de chacun sur cette battle.

Pendant une question à laquelle on n'a pas encore répondu, quitter la page du jeu, changer d'onglet ou placer une autre fenêtre au premier plan peut être signalé. Une tolérance d'une seconde limite les alertes pour les interruptions très brèves. **Première sortie de la battle : avertissement et perte du bonus de rapidité de la question. À partir de la deuxième sortie : 0 point pour la question concernée**, même si la réponse est juste. Les corrections et les réponses déjà envoyées ne sont pas pénalisées. Le nombre de sorties et l'absence en cours apparaissent dans le classement et le bilan pour les autres participants. Les discussions intégrées au jeu restent utilisables.

Cette détection indique seulement que le jeu a été quitté ou masqué : elle ne connaît pas le site ou l'application consultés et ne peut pas empêcher l'usage d'un autre appareil. Aucun historique de navigation ni adresse de page extérieure n'est recueilli. Le solo conserve son barème et son fonctionnement habituels. Les salons commencés avant cette mise à jour conservent leurs règles antérieures jusqu'à leur fin.

Les battles demandent une connexion Internet. Le chronomètre continue lorsque l'onglet est masqué. Recharger le même onglet permet de retrouver son salon ; quitter volontairement la battle termine sa participation. Si l'hôte se déconnecte, un joueur encore présent reprend le rôle après environ 45 secondes. Les salons expirent après 24 heures.

Les pseudos et les réponses de battle sont partagés avec les participants et conservés temporairement sur le serveur des battles. Les mots de passe et jetons d'accès sont hachés ; ils ne figurent pas dans les liens d'invitation. Le carnet solo et ses PDF restent propres au navigateur. Les résultats de battle ne modifient pas l'XP ni les sauvegardes solo.

Le site conserve son adresse GitHub Pages. Son serveur compagnon est hébergé avec Sites et Cloudflare D1 ; les sources sont dans le dossier voisin `curiona-battle-service/`. Aucun ordinateur personnel n'a besoin de rester allumé pour héberger une battle.

## Amis et discussions texte

Le **chat du salon** permet de discuter avant le lancement et pendant les questions, avec les participants de la battle. Aucun profil amis n'est nécessaire pour ce chat. Les messages sont uniquement du texte, sans image, pièce jointe, microphone ni caméra.

L'onglet **Amis** propose un profil facultatif avec un pseudo et un **code ami** à partager. Pour ajouter quelqu'un, saisir son code puis lui envoyer une demande ; il doit l'accepter avant que les messages privés deviennent disponibles. Les amis apparaissent en ligne ou hors ligne. Un message privé envoyé à un ami hors ligne lui sera présenté lorsqu'il reviendra.

L'hôte peut utiliser **Inviter mes amis** dans le groupe ou le bouton **Inviter** auprès d'un ami accepté. L'ami reçoit une invitation privée, également visible à son retour s'il est hors ligne. **Rejoindre** donne accès sans recopier le code ni le mot de passe : l'invitation constitue l'autorisation de l'hôte. Elle expire après 30 minutes, ne réserve pas de place et permet l'entrée lorsque le groupe attend. Une invitation reçue pendant une manche reste utilisable au salon d'attente suivant. Refuser, retirer l'amitié, bloquer ou quitter en tant qu'hôte révoque les invitations correspondantes.

Le panneau de conversation reste accessible pendant le jeu. Les messages privés sont conservés pendant 30 jours ; les messages du salon suivent sa durée de 24 heures. Le statut en ligne est actualisé automatiquement, avec un délai possible d'environ 90 secondes après une déconnexion.

Le profil amis est retrouvé automatiquement dans le même navigateur. **Exporter mon profil amis** permet d'en conserver une copie privée pour le restaurer avec **Importer** dans un autre navigateur. Ce fichier contient la clé d'accès au profil : le conserver pour soi. Le code ami public, lui, peut être partagé avec ses amis. Le carnet solo se sauvegarde et se transfère séparément.

On peut refuser une demande, retirer un ami ou bloquer une personne depuis Amis. Le blocage empêche les messages privés et les nouvelles demandes entre ces profils.

## Jouer à son rythme

Choisir d’abord **les thèmes** : un univers complet, un sous-thème précis, tous les univers ou un mélange personnalisé. Les cartes de l’accueil donnent accès directement aux 47 sous-thèmes et continents et à leur niveau. Le bouton **Modifier** dans les réglages permet de changer cette sélection.

La version **3.1** conserve les **1 800 questions historiques** et ajoute **2 700 questions** : 200 dans chacun des neuf univers d’origine, 500 dans **Addictions et prévention** et 400 dans **Politique**. Les dix univers de 400 questions contiennent chacun 100 questions de chaque difficulté ; Addictions et prévention en contient 125 par difficulté. Les anciens niveaux 1/2 sont regroupés au niveau Intermédiaire, les anciens niveaux 3/4 au niveau Avancé ; les nouveaux Débutant et Expert proposent respectivement des repères plus accessibles et des raisonnements ou connaissances plus poussés. Les textes, réponses et identifiants précédents restent stables pour conserver les carnets. Les sources originales ne sont pas réécrites : le recalibrage est appliqué dans la banque commune.

| Univers | Sous-thèmes ou continents |
| --- | --- |
| Monde animal | Insectes · Faune · Biodiversité · Milieux et écosystèmes |
| Nature & jardin | Plantes · Arbres · Jardinage · Sols et champignons |
| Maths & logique | Calcul · Logique · Géométrie · Probabilités et données |
| Esprit humain | Mémoire · Cognition · Vie sociale · Apprendre et raisonner |
| Sciences & espace | Corps humain · Physique et chimie · Astronomie · Terre et univers |
| Culture & monde | Histoire · Géographie · Arts et culture · Civilisations et patrimoine |
| Informatique | Numérique · Programmation · Réseaux · Données et cybersécurité |
| Langue française | Vocabulaire · Grammaire · Orthographe · Expression et littérature |
| Vie quotidienne | Cuisine · Objets et matériaux · Mesures pratiques · Énergie au quotidien |
| Addictions et prévention | Substances et effets · Risques et dépendance · Prévention et entraide · Idées reçues et repères · Habitudes, jeux et alimentation |
| Politique | Afrique · Amérique du Nord · Amérique du Sud · Asie · Europe · Océanie |

Les neuf univers d’origine comptent quatre sous-thèmes de 100 questions. **Addictions et prévention** en propose cinq de 100 questions : les quatre premiers sont conservés, et **Habitudes, jeux et alimentation** ajoute 100 questions réparties en 25 questions de chaque niveau. Politique propose **Général · tous les continents** ou un filtre continental : Afrique, Asie et Europe 80 questions chacune ; Amérique du Nord et Amérique du Sud 60 chacune ; Océanie 40. Les niveaux sont répartis également dans chaque continent. Le filtre est disponible en solo, en battle et dans les fiches PDF. Les questions politiques portent sur les institutions et l'histoire, sans prise de position partisane.

L’univers **Addictions et prévention** aborde l’alcool, le tabac et les autres drogues, les jeux d’argent, les jeux vidéo, les écrans et les habitudes alimentaires. Les questions visent la sensibilisation, les risques et l’entraide ; elles distinguent habitudes, usages et troubles reconnus, sans étiqueter une personne ni poser un diagnostic. Pour l’alimentation, elles abordent aussi les troubles du comportement alimentaire avec ces mêmes précautions. Les questions ne donnent ni doses, ni recettes, ni conseils de consommation. Le nom et le nouveau sous-thème conservent l’identifiant technique `prevention` et tous les identifiants de questions déjà présents pour retrouver les acquis des carnets.

La version **1.3** ajoute une recherche rapide dans les univers et sous-thèmes (accents facultatifs, raccourci **/**), une suggestion de découverte selon le carnet et le délai du prochain rappel. Les passages de niveau global et de compétence sont signalés doucement dans la correction, sans interrompre la partie.

La version **1.4** ajoute **Mes fiches** : après une réponse, cliquer sur **Garder cette fiche** pour conserver son explication. L’onglet Mes fiches permet de relire, chercher, filtrer par univers et retirer ces fiches, sans chrono ni modification des scores ou de l’expérience. Elles restent dans ce navigateur et sont incluses dans l’export/import. Les anciennes sauvegardes restent compatibles.

Choisir ensuite **la façon de jouer**, qui conserve toujours les thèmes sélectionnés :

- **Apprendre** : questions et explications, sans chrono.
- **Défi** : 30 secondes par question ; objectif de 100 points par question prévue.
- **Détente** : une exploration tranquille, sans chrono.
- **Révision** : les questions déjà rencontrées dont le rappel est arrivé, parmi les thèmes choisis.

Par exemple, cliquer **Nature & jardin → Jardinage → Défi** propose un défi de jardinage. Le titre, les questions, la reprise de partie et **Rejouer** gardent cette sélection. Les anciens intitulés Général / Spécifique / Personnalisé ne sont plus présentés comme des façons de jouer concurrentes du thème choisi.

Une partie compte 8, 12, 20 ou 50 questions. Un filtre trop petit réduit sa longueur, avec un message avant le départ. Il n’y a jamais de doublon au cours d’une même partie. Les questions peu vues et les notions à revoir sont favorisées lors du tirage.

Toutes les réponses sont mélangées avec leurs identifiants d’origine. Les questions Vrai ou faux sont aussi mélangées ; lire les propositions avant de choisir. Une correction donne la bonne réponse et son explication. Le bouton suivant reste manuel. Le chrono du Défi s’arrête en correction, quand l’onglet est masqué et à l’accueil. Aucun autre mode n’a de chrono. Aucun point ne dépend de la vitesse.

Depuis la version **1.4.1**, après chaque réponse, **Question suivante** reste fixé en bas de l’écran sur ordinateur et mobile. Il reste accessible quelle que soit la longueur de l’explication et devient **Voir mon bilan** à la dernière question. Les explications sont conservées en entier ; une marge permet de lire leur fin sans qu’elle soit masquée par la barre. La touche **Entrée** permet aussi de continuer.

Clavier : **1–4** ou **A–D** pour répondre ; **Entrée** après correction ; **Échap** pour mettre la partie de côté. Tabulation parcourt les commandes. Le bouton de haut-parleur active ou désactive les petits effets sonores. Les animations suivent la préférence système de réduction des mouvements.

Depuis la version **1.1**, une **musique douce originale** accompagne les questions et la lecture des explications : accords lents et notes légères, à faible volume, sans percussion. Elle démarre au lancement volontaire d’une partie. Le bouton **♪**, en haut à droite, l’active ou la coupe indépendamment des effets sonores. Ce choix est enregistré dans ce navigateur. La musique se met en pause à l’accueil, en fin de partie et lorsque l’onglet est masqué ; elle reprend en revenant aux questions. Elle est synthétisée sur l’appareil, sans téléchargement audio ni service de musique.

Le petit bouton de **réglage à côté de la note de musique** ouvre son volume de 0 à 100 %. Le niveau initial de 35 % conserve l’ambiance douce de la version précédente. Les changements sont lissés, sans relancer la mélodie, et le réglage est sauvegardé. Échap ferme ce panneau sans quitter la partie. Les effets de réponse restent contrôlés séparément par le haut-parleur.

## Fiches PDF pour réviser ou apprendre

L’onglet **Fiches PDF** propose trois contenus : **Mes questions déjà manquées**, **Réviser les notions déjà vues** et **Apprendre de nouvelles notions**. Choisir tous les univers, un univers précis ou un sous-thème, puis éventuellement une difficulté. Les fiches couvrent 20 ou 50 notions par partie, ou toute la sélection sur demande. Un aperçu et les numéros des parties indiquent exactement ce qui sera téléchargé. Une fiche globale d’apprentissage présente les onze univers dès la première partie.

Chaque PDF contient les questions, les bonnes réponses, les explications et les sources lorsqu’elles sont disponibles. Les fiches d’erreurs ajoutent le dernier choix incorrect enregistré. Les anciens carnets n’ayant pas conservé ce choix restent utilisables : la fiche le signale sans inventer de réponse. Le temps écoulé est indiqué séparément. Après une partie, **Préparer mon PDF de révision** limite la fiche aux erreurs de cette partie.

Les PDF sont générés dans le navigateur, sans transmettre le carnet à un serveur ni modifier l’expérience. jsPDF et les polices sont intégrés aux fichiers du jeu avec leurs licences dans `dist/vendor/`.

## Progression et mémoire

Une bonne réponse rapporte 100 / 125 / 150 / 175 points selon la difficulté, plus un bonus de série allant jusqu’à 50 points. Elle donne 30 / 35 / 40 / 45 XP. Une erreur donne 8 XP et ne retire rien. Le niveau joueur vaut `1 + floor(sqrt(XP / 100))`.

Chaque univers et chacun des **47 sous-thèmes et continents** possède son propre niveau de compétence, sa jauge d’expérience, sa précision et ses notions consolidées. Une réponse en Jardinage fait progresser Jardinage et Nature & jardin, sans ajouter d’XP à Plantes ou à Arbres. Le niveau de compétence utilise les mêmes seuils d’XP que le niveau global. Il reflète la progression dans le jeu ; la précision et la consolidation complètent cet indicateur.

La **difficulté conseillée** est distincte du niveau de compétence : l’adaptatif suit chaque sous-thème séparément, à partir du niveau débutant. Trois réussites consécutives le font monter d’un cran ; deux erreurs consécutives le font redescendre. Le tirage favorise le niveau ciblé sans exclure totalement les autres niveaux. Le choix explicite d’une difficulté constitue, lui, un filtre strict.

Les carnets antérieurs sont migrés automatiquement : l’expérience par thème précis est reconstituée depuis les réponses déjà enregistrées. Le niveau global, les points, les badges, les historiques et les réglages audio sont conservés. L’ordre des anciennes réponses ne permettant pas de retrouver les séries par sous-thème, leur difficulté adaptative démarre prudemment au niveau débutant, puis évolue avec les nouvelles réponses.

Une erreur programme un rappel à **10 minutes** ; une réussite espace les rappels à **1, 3, 7, 14 puis 30 jours**, selon le nombre de réussites consécutives sur cette question. Deux réussites successives consolident une notion. Un oubli ramène ce compteur à zéro. La Révision n’inclut que les rappels arrivés à échéance. **21 questions proposent une formulation alternative** lors d’une nouvelle rencontre ; ce ne sont pas des questions supplémentaires.

Les progrès, les huit badges, les statistiques par univers et les cent dernières parties figurent dans **Mes progrès**. Le bilan présente le score, la précision, l’XP, les points forts et les explications des notions à revoir. Ces résultats sont des indicateurs de jeu et ne constituent pas un diagnostic de connaissances ou de santé.

## Sauvegarder et transférer

Chaque réponse est sauvegardée automatiquement dans `localStorage`, sous la clé propre au jeu `curiona.save.v1`. Une exploration mise de côté se reprend depuis l’accueil, même après fermeture du navigateur. Les sauvegardes des autres jeux restent intactes.

Revenir avec le même navigateur, le même profil et la même adresse du jeu pour retrouver son carnet. La navigation privée et l’effacement des données du site peuvent faire disparaître la sauvegarde. Les boutons **Exporter ma sauvegarde** et **Importer** permettent de conserver une copie du carnet en JSON ou de le transférer sur un autre appareil. L’import est validé puis confirmé avant remplacement ; la progression est restaurée, mais la session en cours du fichier importé est abandonnée.

La version locale et la version en ligne possèdent des espaces de sauvegarde distincts. Pour reprendre en ligne une progression commencée depuis les fichiers, l’exporter dans la version locale puis importer ce fichier dans la version en ligne. Un changement d’adresse du site peut aussi nécessiter ce transfert. Les sauvegardes personnelles ne sont pas envoyées au dépôt GitHub.

Pour les fichiers ouverts avec une adresse `file://`, le comportement du stockage dépend du navigateur : conserver une copie exportée avant de déplacer le dossier.

Les fichiers invalides ne remplacent pas la progression. Une sauvegarde locale illisible est conservée jusqu’à une action explicite et peut être exportée brute. Si le stockage est bloqué, un message recommande l’export.

## Développement

Le jeu est un site HTML/CSS/JavaScript statique. Le dossier `dist/` contient la version à jouer ou à publier ; `src/`, `scripts/`, `tests/` et `docs/` contiennent le code, les outils et les notes éditoriales. Une publication GitHub Pages sert les fichiers du jeu et conserve les sauvegardes dans le navigateur des joueurs.

**Node 22+** pour reconstruire le jeu et lancer les contrôles :

```text
npm run build     # valide et intègre la banque, le moteur et l’interface
npm test          # tests de logique et de contenu
npm run qa        # contrôles dans le véritable Chrome, profil temporaire isolé
npm run qa:social # amis, messages, chat et échanges simultanés dans Chrome
npm run qa:fairplay # salons à huit, lancement manuel, rapidité et sorties de page
npm run qa:groups # même groupe entre les manches, options et invitations
npm run qa:pdf    # téléchargements PDF réels, extraction et rendu
npm run audit:content # structure, répartition et candidats à la relecture éditoriale
npm start         # serveur facultatif sur http://127.0.0.1:4186
```

Le serveur est réservé au développement. Jouer sur son URL crée un espace de sauvegarde différent du lancement habituel par fichier. Le test Chrome utilise par défaut `C:/Program Files/Google/Chrome/Application/chrome.exe` ; la variable `CHROME_PATH` permet un autre emplacement. Ses captures et son rapport sont écrits dans `artifacts/` et exclus de Git. Les tests ne touchent pas au profil Chrome personnel.

La QA des PDF utilise Python avec `pypdf`, `pypdfium2` et `Pillow`. Ces outils servent uniquement aux vérifications, pas aux joueurs. Installation isolée facultative : `python -m pip install --target artifacts/pdf-qa-python pypdf pypdfium2 Pillow`.

- `src/engine.mjs` : tirage, scores, répétition espacée, progression, validation des sauvegardes.
- `src/bank.mjs` : banque commune et recalibrage des niveaux historiques.
- `src/content-v3/` : 2 700 questions supplémentaires et nouveaux univers.
- `scripts/export-battle-bank.mjs` : export autonome de la même banque vers `worker/questions.mjs` du service voisin ; les niveaux antérieurs restent disponibles pour les manches déjà commencées.
- `src/app.js` : interface et audio synthétisé localement.
- `src/theme-ui.js` : compétences, choix des thèmes et façons de jouer.
- `src/discovery-ui.js` : suggestions et indications des prochains rappels.
- `src/notebook-ui.js`, `src/comfort-ui.js` : fiches personnelles et réglage du volume.
- `src/music.js` : musique douce, enveloppes audio et gestion des pauses.
- `src/variants.mjs` : reformulations associées aux identifiants stables.
- `dist/data/` : banques de questions éditables.
- `dist/game.bundle.js` : fichier généré, à reconstruire après une modification du contenu ou du code.
- `dist/style.css`, `dist/themes.css`, `dist/icon.svg` : présentation et illustrations vectorielles locales.
- `docs/source-notes-*.md` : sources consultées et limites éditoriales.
- `docs/expansion-*-sources.md`, `docs/editorial-review-v2.md` : références et relecture des ajouts 2.0.
- `docs/content-v3-*-sources.md` : références et limites de la relecture des ajouts 3.0.
- `docs/content-addictions-sources.md` : sources et nuances des 100 questions supplémentaires sur les comportements et l'alimentation.

## Ajouter des questions

Ajouter les nouveaux lots dans **`src/content-v3/`** et les référencer dans son `index.mjs`, puis exécuter `npm run build`. Adapter les contrôles de distribution lors d’un enrichissement : la banque actuelle compte 400 questions par univers, sauf Addictions et prévention qui en compte 500. Conserver tous les identifiants existants pour préserver la progression. Les fichiers de `dist/data/` sont des banques historiques : leur contenu et leurs identifiants restent stables, et leur difficulté est recalibrée lors de l'assemblage.

```javascript
export default [{
  id: 'extra-001',
  category: 'math',
  subtheme: 'Calcul',
  difficulty: 1,                 // 1 débutant, 2 intermédiaire, 3 avancé, 4 expert
  type: 'qcm',                  // ou boolean avec exactement deux options
  question: 'Combien vaut un quart de 60 ?',
  options: ['15', '12', '20', '30'],
  correct: 0,                   // index AVANT mélange, à partir de zéro
  explanation: 'Un quart correspond à une division par quatre : 60 / 4 = 15. On peut vérifier en multipliant 15 par 4, ce qui redonne 60.',
  tip: 'La moitié de la moitié donne un quart.'
  // source: URL HTTPS réellement consultée, facultative
  // variant: autre énoncé conservant exactement les mêmes choix et la bonne réponse
}];
```

Les catégories et sous-thèmes autorisés sont décrits par `CATEGORIES` dans le moteur. Le build refuse les identifiants et énoncés dupliqués, les thèmes inconnus, les options invalides, les corrections manquantes et une distribution différente des effectifs attendus : dix univers de 400 questions et Addictions et prévention de 500 questions. Les tests de distribution décrivent la banque livrée de 4 500 questions ; les adapter si celle-ci s’enrichit. La détection de proximités lexicales de l’audit est une aide à la relecture, pas une validation automatique des faits.

## Vérification et limites

Le rapport de livraison est dans `VALIDATION.md`. Le jeu a été vérifié dans Chrome, directement par fichier et réseau coupé. Le mobile a été vérifié par émulation de viewport ; aucun téléphone physique n’a été utilisé. La banque a été relue et ses points spécialisés vérifiés par échantillons, avec des sources institutionnelles ou primaires ; elle reste extensible. Les liens de sources sont facultatifs pour jouer et nécessitent Internet pour être ouverts.
