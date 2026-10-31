# Validation de Curiona 1.0

Vérifications effectuées le **31 octobre 2026**, sur cet ordinateur Windows. La version livrée est celle de `dist/`, issue de `npm run build`.

## Résultats

- **31 tests automatisés réussis**, zéro échec (`npm test`).
- **46 contrôles d’intégration réussis dans Google Chrome**, zéro exception JavaScript (`npm run qa`).
- Banque intégrée : **336 questions**, dont **304 QCM et 32 vrais/faux**. Sept univers de 48 questions, trois sous-thèmes par univers, seize questions par sous-thème et quatre questions par difficulté dans chaque sous-thème.
- **21 reformulations alternatives** présentes dans le jeu généré, une par sous-thème. Elles conservent les choix et leur bonne réponse.
- Raccourci du Bureau réellement créé, cible et fichier vérifiés, puis **ouvert avec succès**. La fenêtre obtenue s’intitule « Curiona — La curiosité se cultive - Google Chrome ».

## Logique et apprentissage

Les tests couvrent le mélange des choix en conservant leurs identifiants, les scores et bonus plafonnés, les XP après erreur, les seuils de niveaux, l’indépendance de l’adaptatif par univers et les délais de rappel de 10 minutes puis 1/3/7/14/30 jours. Les filtres stricts de difficulté, les catégories, sous-thèmes et unions personnalisées sont vérifiés.

Le tirage de la banque entière ne répète aucun identifiant dans une partie. Un petit filtre s’épuise proprement. La dernière question rencontrée est écartée au départ suivant lorsqu’un autre choix existe et que la rencontre est récente. Les questions déjà très vues sont défavorisées. Les huit objectifs de badges sont contrôlés, y compris les conditions qui ne doivent pas les débloquer.

L’import/export JSON est vérifié par aller-retour. Les fichiers d’une autre application, les statistiques invalides et les historiques incohérents sont refusés. Les données arbitraires ne sont pas restaurées.

## Chrome et interface

Les tests lancent le véritable exécutable Google Chrome avec un profil temporaire distinct, sur **l’adresse `file://` de livraison**, avec le réseau désactivé. Ils ne modifient pas le profil personnel.

Parcours contrôlés : accueil, choix d’un sous-thème expert, avertissement de partie raccourcie, réponse au clavier, correction après mélange, garde contre le double clic, épuisement, bilan, calcul des points, badge, rechargement, reprise de session, export et import réel via l’entrée fichier, confirmation d’import, rejet d’un fichier corrompu, révision et mélange personnalisé vide.

Le chrono est contrôlé en fonctionnement, en correction, à l’accueil et lorsque le document est masqué. Son expiration est testée grâce au temps virtuel de Chrome : une seule erreur est enregistrée et la correction reste à lire. Le réglage du son est vérifié dans les deux sens.

Captures inspectées sur ordinateur (1440 px) et en **émulation mobile 390 × 844** : accueil, question, correction, bilan et statistiques. Aucun débordement horizontal détecté sur les vues contrôlées. Un chevauchement de la bannière de reprise avec la navigation mobile a été corrigé et fait l’objet d’une assertion dédiée. Les corrections distinguent les réponses par texte, symbole et bordure, en plus de la couleur.

Les captures et la liste détaillée des contrôles figurent dans `artifacts/`. Le script ferme son propre Chrome de test ; la fenêtre personnelle ouverte depuis le raccourci reste disponible.

## Contenu

Contrôles de structure et d’unicité des identifiants et énoncés, relecture croisée des explications, vérification des calculs et de points spécialisés à partir de sources primaires ou institutionnelles. Les distracteurs trop caricaturaux ont été remaniés. Les formulations psychologiques précisent les limites et ne servent pas au diagnostic. Les références et limites de chaque lot sont documentées dans `docs/source-notes-*.md`.

## Limites connues

- Le mobile est testé par émulation dans Chrome, pas sur un téléphone physique.
- La banque est relue et les faits spécialisés sont vérifiés par échantillons ; elle n’a pas été certifiée par un comité pédagogique.
- Certaines notions reviennent avec le même énoncé. Vingt et une disposent d’une formulation alternative.
- Le stockage local des adresses `file://` dépend du navigateur et de son profil. L’export est conseillé avant de déplacer le jeu ou d’effacer des données de navigation.
- L’ouverture des liens de sources demande Internet ; jouer, lire les explications et sauvegarder n’en demandent pas.
- Aucune publication distante ni action GitHub n’a été effectuée. Le nouveau projet est indépendant et les autres jeux ont seulement été consultés.
