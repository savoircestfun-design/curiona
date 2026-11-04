# Validation de Curiona 3.0

## Groupes mondiaux, mélanges et contenu — 4 novembre 2026

Les 67 tests du jeu et les 66 tests d'intégration du serveur passent avec la banque finale de 4 400 questions. Chaque univers contient 400 questions, dont 100 par difficulté. Les neuf univers historiques reçoivent chacun 200 ajouts ; Politique et Drogues et prévention en contiennent chacun 400. Les 1 800 identifiants et contenus précédents restent disponibles, avec un recalibrage des difficultés à l'assemblage. Les tests de sauvegarde couvrent un ancien carnet complet et les 4 400 favoris.

L'audit final ne détecte ni identifiant ou énoncé identique, ni explication dupliquée. Ses 29 proximités lexicales restantes sont des sujets distincts ou des formulations de même famille (pays, institutions, opérations différentes). Les notes `docs/content-v3-*-sources.md` décrivent les références et les limites de la revue ciblée ; l'audit structurel ne constitue pas une vérification exhaustive des faits.

202 contrôles Chrome du solo, 22 du social, 30 des sanctions et 43 des nouveaux groupes passent. Ces derniers couvrent la découverte mondiale, l'entrée directe sans saisie de code, les mélanges d'univers, les salons privés, les invitations et la conservation du groupe entre les manches. L'hôte démarre manuellement ; une arrivée ne lance jamais la partie. Les captures ordinateur, tablette et mobile ont été inspectées. Ces formats sont émulés dans Chrome, sans appareil mobile physique.

524 contrôles PDF passent sur six vrais téléchargements du jeu : erreurs, révision, 100 questions Maths Expert, astronomie, Politique · Océanie et Drogues et prévention. Les 45 pages ont été rendues ; la pagination et les pages représentatives ont été inspectées. Les énoncés, corrections, explications, caractères mathématiques et choix fautifs attendus sont présents, sans caractère hors page ni modification de la progression.

Les tests serveur couvrent les salons publics et privés, le mélange équilibré, les huit participants, le lancement réservé à l'hôte, les manches successives avec le même accès, les requêtes périmées, les invitations privées et les écritures concurrentes. Une migration ajoutée crée les invitations sans réécrire les migrations antérieures. Les anciennes manches gardent leur difficulté historique jusqu'à leur fin.

Les contrôles distants après publication sont consignés ci-dessous lorsqu'ils ont été exécutés. Les contrôles d'interface précédents utilisent une API simulée ; ils ne remplacent pas cette vérification distante.

## Battles à huit, lancement manuel et équité — 2 novembre 2026

Le serveur passe 46 tests d'intégration : 16 pour les salons et les battles, 14 pour le suivi des sorties et la rapidité, et 16 pour les amis et les messages. Les nouvelles vérifications couvrent sept arrivées concurrentes dans un salon à huit, le refus d'une neuvième personne, huit réponses concurrentes avec une seule attribution des points, les capacités entières de deux à huit et le démarrage réservé à l'hôte, y compris pour les duels trouvés automatiquement. Un départ dans un duel encore en attente rend de nouveau la recherche possible.

Le bonus de rapidité et la grâce d'une seconde utilisent l'horloge serveur, après réception du corps JSON complet. Les tests contrôlent la perte de bonus à la première sortie, le total nul en cas de récidive, les répétitions d'événements, la persistance au rechargement, les retours après changement de question et les courses entre présence et réponse. Le barème des salons antérieurs est préservé. Aucune migration ni donnée du carnet solo n'a été modifiée.

30 contrôles Chrome avec une API simulée passent et sont reproductibles avec `npm run qa:fairplay`. Le chat intégré ne provoque aucune sortie. Les huit joueurs, compteurs, avertissements, corrections et bilans restent dans la largeur des affichages testés à 390, 768, 1024 et 1440 px. Les captures ont été inspectées ; mobile et tablette sont des formats émulés dans Chrome, sans test sur appareil physique. Les 141 contrôles du solo et les 22 contrôles sociaux passent également.

13 contrôles supplémentaires passent sur le serveur réellement publié avec huit clients HTTP distincts : salle d'attente à huit, lancement par l'hôte, même question, huit réponses sans doublon, contrôle du score serveur, première sanction sans bonus, récidive à zéro point et compteur partagé. Les huit participants de vérification ont quitté le salon après le contrôle.

Après publication, 11 contrôles supplémentaires passent dans deux navigateurs Chrome isolés sur le site public. Un vrai changement d'onglet, avec événements natifs du navigateur, rend l'absence et le compteur visibles chez l'hôte ; le retour présente l'avertissement et une réponse juste conserve sa base de 100 points avec un bonus de rapidité nul. L'exécution instrumentée finale ne relève aucune erreur JavaScript, CORS ou réseau, y compris à la sortie par les boutons du jeu. Les participants de vérification ont quitté leurs salons ; aucun profil social n'a été créé.

La publication GitHub Pages `40d7560` et le serveur Sites version4 sont en ligne. Les fichiers publics `index.html`, `game.bundle.js` et `battle.css` répondent en HTTP200 et correspondent aux fichiers locaux validés.

## Amis et chat texte — 2 novembre 2026

Le serveur a été étendu par une migration ajoutée après la migration existante, sans modifier les tables de battles déjà publiées. Les 28 tests d'intégration passent : 12 pour les battles et 16 pour les profils, demandes d'amis, messages privés, statuts en ligne/hors ligne, non-lus, curseurs, rétention, limites et contrôle d'accès au chat des salons. Les tests couvrent les blocages et les arrivées concurrentes, l'absence de double message lors d'une relance et la séparation des clés de profils et de participants.

Les 63 tests du jeu et 141 contrôles Chrome du solo passent également. Les messages sont rendus comme du texte échappé ; les profils amis et les carnets solo sont stockés séparément dans le navigateur.

22 contrôles Chrome supplémentaires avec une API simulée couvrent l'interface Amis, les messages texte multiligne, le maintien de la saisie et du focus, les reprises après une panne, le blocage, l'import de profil et les discussions pendant les questions. Ils vérifient aussi la réception d'un message entrant juste avant l'envoi de notre propre message, pour les discussions privées et le chat du salon. Les captures ordinateur et mobile 390 px ont été inspectées. Les réponses et la barre Question suivante restent accessibles lorsque le panneau privé est ouvert. Cette série est reproductible avec `npm run qa:social`.

9 contrôles ont réussi sur le serveur réellement publié : demandes acceptées avant messages, présence, non-lus, texte multiligne, idempotence, chat du salon avant et pendant une battle et refus des accès extérieurs. Un profil a été laissé sans requêtes pendant 95 secondes : il est passé hors ligne, puis a retrouvé à son retour le message envoyé pendant son absence. Le blocage a ensuite empêché les nouveaux messages et demandes. Ces contrôles utilisent uniquement des profils de vérification.

12 contrôles supplémentaires ont réussi sur le site public dans deux profils Chrome isolés : création explicite, demande et acceptation, message privé reçu, profil et amis retrouvés après rechargement, chat de salon reçu avant et pendant une question, focus et brouillon préservés, affichage mobile et correction de la battle. Aucune erreur JavaScript, CORS ou réseau. Les deux participants ont quitté le salon de vérification.

## Battles en ligne — 2 novembre 2026

63 tests de logique et de contenu, 141 contrôles Chrome du jeu solo et 17 contrôles Chrome des nouveaux écrans Battles avec une API simulée ont réussi. Les captures Battles sur ordinateur et mobile 390 px ont été inspectées, sans débordement sur les écrans contrôlés. Les carnets solo restent séparés des résultats multijoueurs.

Le serveur compagnon possède 12 tests d'intégration sur SQLite derrière un adaptateur D1 : mots de passe, autorisations, simultanéité des réponses et des entrées, capacité des salons, matchmaking à quatre clients, maintien d'une recherche active, délai serveur, déconnexion de l'hôte et forfait hors classement.

Dix contrôles ont aussi réussi contre le serveur réellement publié : santé D1, CORS depuis GitHub Pages, salon protégé, rejet du mauvais mot de passe et d'un démarrage par un invité, partie complète à deux clients indépendants, score exact, gagnant, bilan par sous-thème, recherche automatique d'adversaire et annuaire. Les salons de vérification ont été quittés après les tests. Ce contrôle simule des clients distincts ; il n'a pas été effectué depuis deux logements physiques.

Les nouvelles captures et scripts de contrôle ponctuels sont dans `artifacts/` (ignoré par Git). Le service distant est nécessaire aux battles ; les tests du mode solo continuent de passer hors réseau.

Après publication, 11 contrôles supplémentaires ont réussi dans deux vrais onglets Chrome sur le site public, sans API simulée : création protégée, invitation, arrivée de l'invité, lancement, questions et corrections identiques, question suivante, reprise après rechargement, affichage mobile 390 px, carnet solo intact et sortie des deux joueurs. Aucune erreur JavaScript, CORS ou réseau n'a été relevée. `index.html`, `game.bundle.js` et `battle.css` publics répondent en HTTP 200 et correspondent aux fichiers locaux validés. Publication GitHub Pages : commit `40db241` ; serveur Sites : version publiée 2.

## Vérifications antérieures — version 2.1

Vérifications initiales le **31 octobre 2026**, mises à jour le **2 novembre 2026**, sur cet ordinateur Windows. La version livrée est celle de `dist/`, issue de `npm run build`.

Version publique vérifiée : **https://savoircestfun-design.github.io/curiona/**, dépôt **https://github.com/savoircestfun-design/curiona**. GitHub Pages annonce le déploiement terminé depuis la branche `gh-pages`. La page et les cinq ressources principales répondent en HTTP 200 ; leurs contenus correspondent aux fichiers locaux validés. Les 248 contrôles PDF ont également été exécutés avec succès depuis cette adresse HTTPS publique, avec quatre téléchargements réels.

## Résultats

- **63 tests automatisés réussis**, zéro échec (`npm test`).
- **141 contrôles d’intégration réussis dans Google Chrome**, zéro exception JavaScript (`npm run qa`).
- **248 contrôles PDF réussis**, quatre téléchargements réels, extraction et rendu (`npm run qa:pdf`).
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

La version 2.1 ajoute les fiches PDF personnelles : erreurs déjà commises, révision des notions rencontrées et apprentissage sans partie préalable. Les filtres portent sur tous les univers, un univers ou un sous-thème, avec difficulté et lots de 20, 50 ou toutes les notions. Une entrée depuis le bilan limite le contenu aux erreurs de cette partie. Le dernier choix incorrect, sa date et les choix de l’historique sont désormais conservés et validés à l’import, sans modifier les carnets anciens. Une erreur ancienne sans choix connu est explicitement signalée ; le temps écoulé est distingué.

Quatre PDF sont réellement téléchargés dans Chrome : erreurs personnelles (1 page), révision globale (2), Maths expert (12) et Astronomie débutant (3). Les 248 contrôles vérifient chaque question, réponse et explication, les accents et symboles mathématiques, l’absence de pages blanches et de caractères hors page, les anciens carnets, la reprise et l’export/import. Les rendus des pages représentatives ont été inspectés visuellement. Les PDF et leurs polices sont produits localement par jsPDF 4.2.1 et DejaVu Sans 2.37, avec licences intégrées.

Les textes publics sont adaptés : aucune promesse de fonctionnement hors ligne pour le chargement du site, sauvegarde décrite comme propre au navigateur et à son profil, absence de synchronisation automatique, transfert par export/import. Les nouveaux réglages PDF et la navigation sont vérifiés en affichage mobile. Voir `docs/online-copy-review.md`.

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
- La version publique est hébergée sur GitHub Pages. Les sauvegardes et les PDF des joueurs sont créés dans leur navigateur ; le jeu ne possède pas de compte joueur ni de base de données de progression.
