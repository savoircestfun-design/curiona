# Validation de Curiona 2.0

Vérifications initiales le **31 octobre 2026**, mises à jour le **2 novembre 2026**, sur cet ordinateur Windows. La version livrée est celle de `dist/`, issue de `npm run build`.

## Résultats

- **52 tests automatisés réussis**, zéro échec (`npm test`).
- **141 contrôles d’intégration réussis dans Google Chrome**, zéro exception JavaScript (`npm run qa`).
- Banque intégrée : **1 800 questions**, dont **1 561 QCM et 239 vrais/faux**. Neuf univers de 200 questions, quatre sous-thèmes par univers et 50 questions par sous-thème. Chaque univers contient 50 questions de chaque difficulté ; chaque sous-thème en contient 12 ou 13 par difficulté.
- **21 reformulations alternatives** présentes dans le jeu généré, une par sous-thème historique. Elles conservent les choix et leur bonne réponse et ne comptent pas comme des questions supplémentaires.
- Raccourci du Bureau réellement créé, cible et fichier vérifiés, puis **ouvert avec succès**. La fenêtre obtenue s’intitule « Curiona — La curiosité se cultive - Google Chrome ».

## Logique et apprentissage

Les tests couvrent le mélange des choix en conservant leurs identifiants, les scores et bonus plafonnés, les XP après erreur, les seuils de niveaux, l’indépendance de la compétence et de l’adaptatif par sous-thème et les délais de rappel de 10 minutes puis 1/3/7/14/30 jours. Les filtres stricts de difficulté, les catégories, sous-thèmes et unions personnalisées sont vérifiés.

La version 2.0 affiche une compétence avec niveau et XP pour chacun des neuf univers et des 36 sous-thèmes. Les niveaux sont accessibles depuis les cartes, les réglages, les questions et les statistiques. L’XP d’un sous-thème ne modifie pas ses voisins. Un sous-thème jamais exploré commence au niveau débutant, même si son univers a déjà progressé. L’import et la lecture des anciens carnets reconstruisent l’XP précise depuis les réponses enregistrées tout en conservant le niveau global, les points, les badges, la musique et les historiques.

Les thèmes sont séparés des quatre façons de jouer. Les contrôles Chrome vérifient que Nature conserve son titre en Apprendre, Défi, Détente et Révision, que les liens de sous-thèmes ouvrent directement leur sélection, et que le rejeu garde thème et difficulté. Des parties réelles en Détente puis en Défi conservent Jardinage jusque dans les questions tirées ; le filtre reste associé à une partie rechargée. Les réglages mobiles n’ont pas de débordement horizontal et le bouton Commencer reste visible pendant que leur contenu défile.

Le tirage de la banque entière ne répète aucun identifiant dans une partie. Un petit filtre s’épuise proprement. La dernière question rencontrée est écartée au départ suivant lorsqu’un autre choix existe et que la rencontre est récente. Les questions déjà très vues sont défavorisées. Les huit objectifs de badges sont contrôlés, y compris les conditions qui ne doivent pas les débloquer.

L’import/export JSON est vérifié par aller-retour. Les fichiers d’une autre application, les statistiques invalides et les historiques incohérents sont refusés. Les données arbitraires ne sont pas restaurées.

## Chrome et interface

Le correctif 1.4.1 fixe la barre Question suivante dans le viewport, seulement après réponse. Les tests reproduisent une très longue explication en 1366 × 768, vérifient la position et la cible réelle de clic en haut, au milieu et en fin de page, puis effectuent un clic de souris sans défilement. La fin de la correction reste lisible au-dessus de la barre. Celle-ci disparaît à la nouvelle question ou au bilan et affiche Voir mon bilan à la dernière correction. Les contrôles couvrent également le mobile en portrait et en paysage. Captures dédiées : `14-suivante-fixe-desktop.png` et `15-suivante-fixe-mobile.png`.

Les tests lancent le véritable exécutable Google Chrome avec un profil temporaire distinct, sur **l’adresse `file://` de livraison**, avec le réseau désactivé. Ils ne modifient pas le profil personnel.

Parcours contrôlés : accueil, choix d’un sous-thème expert, avertissement de partie raccourcie, réponse au clavier, correction après mélange, garde contre le double clic, épuisement, bilan, calcul des points, badge, rechargement, reprise de session, export et import réel via l’entrée fichier, confirmation d’import, rejet d’un fichier corrompu, révision et mélange personnalisé vide.

Le chrono est contrôlé en fonctionnement, en correction, à l’accueil et lorsque le document est masqué. Son expiration est testée grâce au temps virtuel de Chrome : une seule erreur est enregistrée et la correction reste à lire. Le réglage du son est vérifié dans les deux sens.

La musique douce de la version 1.1 est contrôlée séparément des effets : attente d’un lancement volontaire, démarrage pendant les questions, présence d’un signal à faible niveau, maintien pendant les corrections, coupure avec fondu et nettoyage des notes, reprise, basculements rapides sans accumulation, pause hors de l’onglet et arrêt en fin de partie. Le choix reste mémorisé après rechargement et l’import des anciens carnets demeure compatible. Le niveau du signal est mesuré dans Chrome ; ce contrôle ne mesure pas le volume physique des enceintes de l’utilisateur.

Captures inspectées sur ordinateur (1440 px) et en **émulation mobile 390 × 844** : accueil, question, correction, bilan et statistiques. Aucun débordement horizontal détecté sur les vues contrôlées. Un chevauchement de la bannière de reprise avec la navigation mobile a été corrigé et fait l’objet d’une assertion dédiée. Les corrections distinguent les réponses par texte, symbole et bordure, en plus de la couleur.

Les captures et la liste détaillée des contrôles figurent dans `artifacts/`. Le script ferme son propre Chrome de test ; la fenêtre personnelle ouverte depuis le raccourci reste disponible.

## Contenu

La version 2.0 ajoute **1 464 questions** et les univers **Langue française** et **Vie quotidienne**. Les empreintes des trois banques historiques garantissent que les 336 questions précédentes et leurs identifiants restent inchangés. Les tests couvrent les effectifs exacts, les filtres de tous les modes dans les nouveaux univers et la conservation d’un carnet antérieur. Chrome vérifie leurs cartes à 200 questions, puis joue une question de Vocabulaire et de Cuisine avec correction et progression de compétence.

`npm run audit:content` contrôle la structure complète, les répartitions, les explications identiques et les proximités lexicales à relire. Aucun énoncé ni aucune explication identique n’est détecté. Les quatre paires proches restantes correspondent à des notions distinctes : fusion/vaporisation, IPv4/IPv6, homophones verbaux/adjectif et confidentialité/intégrité. Les révisions et références des nouveaux lots sont documentées dans `docs/expansion-*-sources.md` et `docs/editorial-review-v2.md`.

La version 1.4 ajoute des fiches personnelles sauvegardées et un volume musical indépendant. Les tests contrôlent la migration des anciens carnets, l’export/import des fiches, la déduplication et le refus des valeurs invalides. Chrome vérifie l’ajout depuis la correction sans modifier l’XP, la lecture sans score, la recherche, le retrait et le rendu mobile. Le volume est conservé après rechargement ; à 0 %, le signal devient silencieux sans arrêter la partition. Échap ferme le réglage sans quitter la partie. Les commandes du volume restent dans la largeur du mobile.

Les améliorations 1.3 sont aussi contrôlées dans Chrome : recherche par sous-thème sans accent, message sans résultat, restauration de tous les univers après effacement, suggestion de découverte et célébration du passage de niveau directement dans la correction. Les délais des rappels sont présentés en minutes, heures ou jours ; aucun service réseau ni nouvelle donnée personnelle n’est ajouté.

Contrôles de structure et d’unicité des identifiants et énoncés, relecture croisée des explications, vérification des calculs et de points spécialisés à partir de sources primaires ou institutionnelles. Les distracteurs trop caricaturaux ont été remaniés. Les formulations psychologiques précisent les limites et ne servent pas au diagnostic. Les références et limites de chaque lot sont documentées dans `docs/source-notes-*.md`.

## Limites connues

- Le mobile est testé par émulation dans Chrome, pas sur un téléphone physique.
- La banque est relue et les faits spécialisés sont vérifiés par échantillons ; elle n’a pas été certifiée par un comité pédagogique.
- Une question peut réapparaître lors de parties ultérieures ou en Révision. Vingt et une disposent d’une formulation alternative.
- Le stockage local des adresses `file://` dépend du navigateur et de son profil. L’export est conseillé avant de déplacer le jeu ou d’effacer des données de navigation.
- L’ouverture des liens de sources demande Internet ; jouer, lire les explications et sauvegarder n’en demandent pas.
- Aucune publication distante ni action GitHub n’a été effectuée. Le nouveau projet est indépendant et les autres jeux ont seulement été consultés.
