# Curiona — La curiosité se cultive

Un jeu éducatif original en français : **336 questions**, **7 univers**, **21 sous-thèmes**, **4 difficultés** et **6 modes**. Sans compte, sans abonnement, sans appel à une IA. Les explications et toutes les ressources nécessaires sont intégrées au dossier.

## Jouer

Double-cliquer sur **« Jouer à Curiona - Google Chrome »** sur le Bureau Windows. Ce raccourci ouvre directement `dist/index.html` dans Chrome, comme le jeu Roncerive déjà présent sur cet ordinateur. Il n’utilise aucun serveur et fonctionne sans réseau.

On peut aussi ouvrir `dist/index.html` avec Google Chrome. Garder le dossier complet à son emplacement pour que le raccourci et la sauvegarde restent associés à la même adresse.

Pour recréer le raccourci après avoir déplacé le projet : clic droit sur `Installer-Raccourci.ps1` → **Exécuter avec PowerShell**, ou depuis PowerShell dans ce dossier :

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Installer-Raccourci.ps1
```

Cette option d’exécution ne s’applique qu’à ce processus et ne change pas la configuration permanente du système. Le script cherche Chrome, crée uniquement le raccourci Curiona et ne touche pas aux autres jeux.

## Jouer à son rythme

- **Général — Grand mélange** : tous les univers.
- **Spécifique — À la carte** : un univers complet ou un sous-thème.
- **Personnalisé — Sur mesure** : plusieurs univers ou sous-thèmes combinés.
- **Révision — Le bon rappel** : les questions déjà rencontrées dont le rappel est arrivé.
- **Défi — Cap sur le défi** : 30 secondes par question ; objectif de 100 points par question prévue.
- **Détente — À ton rythme** : tous les univers sans chrono.

Une partie compte 8, 12, 20 ou 50 questions. Un filtre trop petit réduit sa longueur, avec un message avant le départ. Il n’y a jamais de doublon au cours d’une même partie. Les questions peu vues et les notions à revoir sont favorisées lors du tirage.

Toutes les réponses sont mélangées avec leurs identifiants d’origine. Les questions Vrai ou faux sont aussi mélangées ; lire les propositions avant de choisir. Une correction donne la bonne réponse et son explication. Le bouton suivant reste manuel. Le chrono du Défi s’arrête en correction, quand l’onglet est masqué et à l’accueil. Aucun autre mode n’a de chrono. Aucun point ne dépend de la vitesse.

Clavier : **1–4** ou **A–D** pour répondre ; **Entrée** après correction ; **Échap** pour mettre la partie de côté. Tabulation parcourt les commandes. Le bouton de haut-parleur active ou désactive les petits effets sonores. Les animations suivent la préférence système de réduction des mouvements.

Depuis la version **1.1**, une **musique douce originale** accompagne les questions et la lecture des explications : accords lents et notes légères, à faible volume, sans percussion. Elle démarre au lancement volontaire d’une partie. Le bouton **♪**, en haut à droite, l’active ou la coupe indépendamment des effets sonores. Ce choix est sauvegardé. La musique se met en pause à l’accueil, en fin de partie et lorsque l’onglet est masqué ; elle reprend en revenant aux questions. Elle est synthétisée sur l’appareil et fonctionne entièrement hors ligne.

## Progression et mémoire

Une bonne réponse rapporte 100 / 125 / 150 / 175 points selon la difficulté, plus un bonus de série allant jusqu’à 50 points. Elle donne 30 / 35 / 40 / 45 XP. Une erreur donne 8 XP et ne retire rien. Le niveau joueur vaut `1 + floor(sqrt(XP / 100))`.

L’adaptatif suit chaque univers séparément, à partir du niveau débutant : trois réussites consécutives le font monter d’un cran ; deux erreurs consécutives le font redescendre. Le tirage favorise le niveau ciblé sans exclure totalement les autres niveaux. Le choix explicite d’une difficulté constitue, lui, un filtre strict.

Une erreur programme un rappel à **10 minutes** ; une réussite espace les rappels à **1, 3, 7, 14 puis 30 jours**, selon le nombre de réussites consécutives sur cette question. Deux réussites successives consolident une notion. Un oubli ramène ce compteur à zéro. La Révision n’inclut que les rappels arrivés à échéance. **21 questions proposent une formulation alternative** lors d’une nouvelle rencontre ; ce ne sont pas des questions supplémentaires.

Les progrès, les huit badges, les statistiques par univers et les cent dernières parties figurent dans **Mes progrès**. Le bilan présente le score, la précision, l’XP, les points forts et les explications des notions à revoir. Ces résultats sont des indicateurs de jeu et ne constituent pas un diagnostic de connaissances ou de santé.

## Sauvegarder et transférer

Chaque réponse est sauvegardée automatiquement dans `localStorage`, sous la clé propre au jeu `curiona.save.v1`. Une exploration mise de côté se reprend depuis l’accueil, même après fermeture du navigateur. Les sauvegardes des autres jeux restent intactes.

Utiliser le même profil Chrome et la même adresse locale. Le stockage des fichiers `file://` dépend du navigateur : ne pas compter sur la navigation privée ou sur un déplacement du dossier pour conserver les données. Les boutons **Exporter ma sauvegarde** et **Importer** permettent de transférer le carnet en JSON. L’import est validé puis confirmé avant remplacement ; la progression est restaurée, mais la session en cours du fichier importé est abandonnée.

Les fichiers invalides ne remplacent pas la progression. Une sauvegarde locale illisible est conservée jusqu’à une action explicite et peut être exportée brute. Si le stockage est bloqué, un message recommande l’export.

## Développement

La structure reprend le fonctionnement HTML/JavaScript autonome de Roncerive : `dist/`, `scripts/`, `tests/`, `docs/` et dépôt Git distinct. Le jeu est placé dans un nouveau sous-dossier. Aucun autre projet n’a été modifié. Le dépôt Git local n’a aucun remote et aucune publication GitHub ou Sites n’a été effectuée.

**Node 22+**, aucune dépendance externe :

```text
npm run build     # valide et intègre la banque, le moteur et l’interface
npm test          # tests de logique et de contenu
npm run qa        # contrôles dans le véritable Chrome, profil temporaire isolé
npm start         # serveur facultatif sur http://127.0.0.1:4186
```

Le serveur est réservé au développement. Jouer sur son URL crée un espace de sauvegarde différent du lancement habituel par fichier. Le test Chrome utilise par défaut `C:/Program Files/Google/Chrome/Application/chrome.exe` ; la variable `CHROME_PATH` permet un autre emplacement. Ses captures et son rapport sont écrits dans `artifacts/` et exclus de Git. Les tests ne touchent pas au profil Chrome personnel.

- `src/engine.mjs` : tirage, scores, répétition espacée, progression, validation des sauvegardes.
- `src/app.js` : interface et audio synthétisé localement.
- `src/music.js` : musique douce, enveloppes audio et gestion des pauses.
- `src/variants.mjs` : reformulations associées aux identifiants stables.
- `dist/data/` : banques de questions éditables.
- `dist/game.bundle.js` : fichier généré, à reconstruire après une modification du contenu ou du code.
- `dist/style.css`, `dist/icon.svg` : présentation et illustrations vectorielles locales.
- `docs/source-notes-*.md` : sources consultées et limites éditoriales.

## Ajouter des questions

Ajouter les objets dans **`dist/data/extras.js`**, puis exécuter `npm run build`. Conserver tous les identifiants existants pour préserver la progression. Les trois banques initiales utilisent des générateurs : insérer au milieu peut déplacer leurs identifiants ; préférer le fichier `extras.js`.

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

Les catégories et sous-thèmes autorisés sont décrits par `CATEGORIES` dans le moteur. Le build refuse les identifiants et énoncés dupliqués, les thèmes inconnus, les options invalides et les corrections manquantes. Les tests de distribution décrivent la banque initiale ; les adapter si celle-ci s’enrichit.

## Vérification et limites

Le rapport de livraison est dans `VALIDATION.md`. Le jeu a été vérifié dans Chrome, directement par fichier et réseau coupé. Le mobile a été vérifié par émulation de viewport ; aucun téléphone physique n’a été utilisé. La banque a été relue et ses points spécialisés vérifiés par échantillons, avec des sources institutionnelles ou primaires ; elle reste extensible. Les liens de sources sont facultatifs pour jouer et nécessitent Internet pour être ouverts.
