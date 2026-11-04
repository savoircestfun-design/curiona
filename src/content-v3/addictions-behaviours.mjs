// Extension de prévention : repères et situations, sans diagnostic individuel.
const questions=[];
const S={
 behaviour:'https://www.ameli.fr/assure/sante/themes/addictions/addictions-comportementales',
 definition:'https://www.ameli.fr/assure/sante/themes/addictions/definition-facteurs-favorisants',
 anj:'https://www.anj.fr/joueurs/addiction',
 tools:'https://www.anj.fr/index.php/joueurs/limites-de-jeu',
 glossary:'https://www.anj.fr/glossaire',
 exclusion:'https://interdictiondejeux.anj.fr/',
 gambling:'https://www.who.int/news-room/fact-sheets/detail/gambling/',
 mechanisms:'https://joueurs-info-service.fr/Le-jeu-et-vous/Le-jeu-est-il-un-probleme/Prendre-conscience-des-mecanismes-en-jeu',
 jis:'https://www.joueurs-info-service.fr/Le-jeu-et-vos-proches/Comment-me-preserver-et-preserver-mes-proches/Se-faire-aider',
 ofdt:'https://www.ofdt.fr/publication/2024/la-pratique-des-jeux-d-argent-et-de-hasard-en-france-en-2023-2457',
 gaming:'https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder/',
 paho:'https://www.paho.org/en/topics/gambling-and-gaming-disorder',
 screen:'https://www.ameli.fr/assure/sante/themes/ecrans-enfance-adolescence/ecran-sante-enfant-adolescent',
 mildeca:'https://www.drogues.gouv.fr/les-ecrans-et-les-jeux-video',
 sleep:'https://www.ameli.fr/assure/sante/themes/troubles-sommeil-enfant/hygiene-vie-bon-sommeil-enfant',
 anses:'https://www.anses.fr/system/files/AP2019-SA-0152-RA.pdf',
 social:'https://sante.gouv.fr/prevention-en-sante/sante-des-populations/enfants/exposition-aux-ecrans/article/usages-des-reseaux-sociaux-chez-les-jeunes-risques-sanitaires-et-prevention',
 care:'https://www.ameli.fr/assure/sante/themes/addictions/prise-en-charge',
 help:'https://www.ameli.fr/assure/sante/themes/addictions/suivi',
 inserm:'https://www.inserm.fr/dossier/addictions/',
 cjc:'https://www.drogues.gouv.fr/sites/default/files/2026-01/Guide_CPS_Sport_VF-interactif.pdf',
 cps:'https://inpes.santepubliquefrance.fr/index.php/sante-mentale/depression-et-anxiete/rapportsynthese/les-competences-psychosociales-etat-des-connaissances-scientifiques-et-theoriques',
 education:'https://eduscol.education.gouv.fr/5931/prevention-des-conduites-addictives-former-et-proteger-les-eleves?menu_id=2450'
};
function add(difficulty,source,rows){
 for(const row of rows.trim().split('\n')){
  const a=row.split('¦');
  if(a.length!==6)throw Error('Question prévention comportementale invalide : '+row);
  const raw=a.slice(1,5),shift=questions.length%4;
  questions.push({id:'v3-prevention-'+String(401+questions.length),category:'prevention',subtheme:'Habitudes, jeux et alimentation',difficulty,type:'qcm',question:a[0],options:[...raw.slice(shift),...raw.slice(0,shift)],correct:(4-shift)%4,explanation:a[5],source});
 }
}
// Jeux d'argent : 7 débutantes, puis 6 questions par autre difficulté.
add(1,S.behaviour,`
Dans quelle activité risque-t-on de l'argent sur un résultat incertain pour espérer gagner davantage ?¦Un pari d'argent sur un match¦Un quiz gratuit sans mise¦Un puzzle emprunté gratuitement¦Une promenade avec des amis¦Une mise susceptible d'être perdue distingue le jeu d'argent de nombreux autres loisirs. Un pari sportif garde une part d'incertitude.
`);
add(1,S.anj,`
Après avoir perdu au jeu, une personne mise aussitôt davantage pour « se refaire ». Quel signal faut-il reconnaître ?¦Une poursuite risquée des pertes¦Une méthode de remboursement fiable¦Une amélioration certaine de ses chances¦Un signe que le résultat devient prévisible¦Chercher à récupérer immédiatement les pertes peut entraîner une escalade. Cette conduite mérite de faire une pause et d'en parler, sans conclure seul à un diagnostic.
Connaître très bien un sport garantit-il de gagner les paris sur ce sport ?¦Non, le résultat reste incertain¦Oui, si l'on suit tous les matchs¦Oui, si l'on soutient la meilleure équipe¦Oui, après quelques paris gagnants¦Les connaissances sportives n'éliminent pas les imprévus. Présenter un pari comme un gain assuré peut encourager une prise de risque financière.
`);
add(1,S.gambling,`
Quel argent faut-il protéger en priorité d'une dépense de jeu ?¦L'argent nécessaire au logement et aux repas¦L'argent qu'une publicité promet de doubler¦L'argent d'un gain encore hypothétique¦L'argent d'un emprunt prévu pour rejouer¦Le jeu peut détourner des ressources essentielles du foyer. Les dépenses nécessaires ne doivent pas dépendre de l'espoir de gagner une mise.
Les difficultés liées aux jeux d'argent peuvent-elles toucher une personne qui ne joue pas elle-même ?¦Oui, notamment un proche du joueur¦Non, seules les personnes qui misent sont concernées¦Seulement si elle possède aussi un compte de jeu¦Seulement si elle choisit les numéros du joueur¦Les tensions, les dettes et les dépenses du foyer peuvent affecter l'entourage. Les conséquences ne se limitent donc pas à la personne qui joue.
`);
add(1,S.tools,`
Pour limiter une dépense de jeu, à quel moment vaut-il mieux fixer un plafond compatible avec ses moyens ?¦Avant de commencer, sans l'augmenter pour récupérer une perte¦Après la première grosse perte uniquement¦Au moment où l'on pense qu'un gain approche¦En fonction de chaque publicité reçue¦Fixer des limites à l'avance est un outil de protection financière. Un plafond n'est pas un objectif à atteindre ni une garantie contre toute difficulté.
`);
add(1,S.jis,`
Un proche inquiet à cause des paris de son compagnon peut-il demander conseil pour lui-même ?¦Oui, l'entourage peut aussi être accompagné¦Non, seul le titulaire du compte peut parler à un professionnel¦Seulement après avoir remboursé toutes les dettes¦Uniquement si le joueur accepte de venir au même rendez-vous¦Les proches peuvent avoir besoin d'écoute et de conseils pour se préserver. Leur accès à une aide ne dépend pas de la présence du joueur au même entretien.
`);
add(2,S.mechanisms,`
Lors de tirages supposés indépendants, un numéro n'est pas sorti depuis longtemps. Que peut-on en conclure pour le prochain tirage ?¦Cette absence ne le rend pas automatiquement plus probable¦Il doit sortir pour équilibrer les résultats¦Il devient impossible à tirer¦Il est garanti si l'on double sa mise¦Dans un modèle de tirages indépendants, les résultats passés ne créent pas une dette du hasard. L'impression qu'un numéro est « dû » peut pousser à rejouer.
Une publicité montre trois gagnants sans indiquer combien de personnes ont perdu. Quelle information manque pour apprécier les chances de gain ?¦Le nombre total de participations et la répartition des résultats¦Le nombre d'abonnés de la marque uniquement¦La popularité de l'animateur de la publicité¦La rapidité annoncée du versement des gains¦Montrer uniquement des gagnants sélectionne les réussites. Sans connaître aussi les participations perdantes, on ne peut pas en déduire une fréquence de gain.
`);
add(2,S.tools,`
Sur un site de jeu, que limite principalement un plafond de dépôts ?¦Les sommes versées sur le compte joueur¦Le nombre de buts du match suivi¦Le montant garanti d'un futur gain¦Toutes les dépenses effectuées sur tous les sites¦Un plafond de dépôts encadre l'approvisionnement du compte sur l'opérateur concerné. Il ne constitue ni une promesse de gain ni un plafond universel partagé entre tous les sites.
`);
add(2,S.anj,`
Une personne emprunte régulièrement pour continuer à parier après avoir épuisé son argent disponible. Quelle réaction est la plus adaptée ?¦Prendre cette situation au sérieux et chercher une aide¦Considérer l'emprunt comme une stratégie normale de gain¦Attendre obligatoirement une dette très élevée avant d'en parler¦Croire qu'un meilleur choix de match suffit à régler le problème¦Emprunter pour poursuivre le jeu peut aggraver les difficultés financières. Mieux vaut en parler tôt à un professionnel plutôt que compter sur un pari réparateur.
`);
add(2,S.gambling,`
Un jeu d'argent est légalement autorisé. Cela permet-il de conclure qu'il ne présente aucun risque pour la santé ?¦Non, un produit légal peut aussi causer des dommages¦Oui, autorisation et absence de risque sont équivalentes¦Oui, sauf si le joueur utilise un téléphone¦Seulement si la publicité ne montre que des adultes¦La légalité encadre une activité ; elle ne supprime pas les risques financiers, relationnels ou psychologiques. Prévenir les dommages reste nécessaire.
`);
add(2,S.behaviour,`
Deux personnes misent la même somme, mais l'une n'arrive plus à arrêter et néglige ses obligations. Pourquoi comparer seulement la somme serait-il insuffisant ?¦Le contrôle de la pratique et ses conséquences comptent aussi¦La même somme signifie toujours la même situation clinique¦Une somme identique exclut un retentissement différent¦Seule la fréquence des publicités permet de les distinguer¦Le montant engagé ne décrit pas toute la situation. Les difficultés à s'arrêter et les répercussions quotidiennes doivent être examinées dans leur contexte.
`);
add(3,S.mechanisms,`
Pourquoi la part d'adresse présente dans certains jeux d'argent peut-elle entretenir une illusion de contrôle ?¦Un contrôle partiel peut être surestimé jusqu'à faire oublier le hasard¦La présence d'adresse supprime mathématiquement toute perte¦Une expérience longue transforme toujours un jeu en revenu régulier¦La confiance du joueur modifie directement le tirage aléatoire¦Des décisions peuvent influencer une partie du jeu sans en garantir l'issue. Confondre compétence partielle et maîtrise totale favorise une estimation excessive de ses chances.
`);
add(3,S.tools,`
Une personne fixe une limite sur un opérateur puis joue sur plusieurs autres. Quelle limite du dispositif faut-il comprendre ?¦Le plafond du premier opérateur ne couvre pas automatiquement les autres¦Le premier plafond se divise obligatoirement entre tous les comptes¦Tous les comptes se bloquent dès le premier dépôt¦Un second compte annule les pertes du premier¦L'ANJ précise que les limites d'un site concernent l'activité sur ce site. Une protection doit donc tenir compte de l'ensemble des dépenses et des pratiques.
`);
add(3,S.exclusion,`
Quelle différence distingue une interdiction volontaire de jeux demandée à l'ANJ d'un simple rappel personnel noté dans un agenda ?¦C'est un dispositif formalisé de restriction d'accès dans son périmètre¦Elle promet le remboursement des mises déjà perdues¦Elle augmente les probabilités des derniers paris en cours¦Elle remplace à elle seule tout accompagnement psychologique¦L'interdiction volontaire met en place une protection d'accès à des jeux concernés par le dispositif. Elle ne rembourse pas les pertes et peut être associée à un accompagnement.
`);
add(3,S.gambling,`
Faut-il attendre de remplir tous les critères d'un trouble du jeu pour agir sur des dommages financiers déjà présents ?¦Non, on peut prévenir les dommages et demander de l'aide plus tôt¦Oui, toute prévention exige d'abord un diagnostic confirmé¦Oui, sauf si la personne joue tous les jours¦Non, mais seulement après une condamnation judiciaire¦Des dommages peuvent apparaître avant qu'un diagnostic soit établi. La prévention et l'accès à une aide ne sont pas réservés aux situations répondant à tous les critères cliniques.
`);
add(3,S.ofdt,`
Dans une enquête, une échelle classe certains répondants « à risque de jeu problématique ». Que signifie ce résultat ?¦Un repérage statistique du risque, pas un diagnostic clinique individuel automatique¦Une certitude que tous auront les mêmes difficultés futures¦La preuve que toute personne qui joue est malade¦Une mesure du seul montant des gains¦Les enquêtes utilisent des instruments de repérage pour décrire des populations. Un score de risque ne remplace pas l'évaluation complète d'une personne par un professionnel.
`);
add(3,S.glossary,`
Un gain de 20 € apparaît sur un écran après une mise de 50 €. Pourquoi ce message ne décrit-il pas un bénéfice de 20 € ?¦Il faut aussi prendre en compte la mise dépensée¦Le bénéfice est nécessairement égal au gain affiché¦La mise n'a plus d'importance dès qu'un gain apparaît¦Un résultat positif à l'écran annule tous les paris précédents¦Le montant versé et le résultat net sont des grandeurs différentes. Ici, si 20 € sont rendus pour une mise totale de 50 €, la perte nette de cette opération est de 30 €.
`);
add(4,S.glossary,`
Un jeu fictif affiche un taux de retour moyen de 95 %. Quelle interprétation est correcte ?¦C'est une moyenne des mises redistribuées, pas la restitution garantie de 95 % à chaque joueur¦Chaque joueur récupérera exactement 95 % à la fin de sa session¦La probabilité de terminer bénéficiaire vaut nécessairement 95 %¦Après une perte, les gains suivants doivent compenser jusqu'à 95 %¦Un taux de retour porte sur des mises et des versements agrégés. Il ne décrit ni le résultat personnel de chaque session ni la probabilité de réaliser un bénéfice.
`);
add(4,S.tools,`
Un compte de jeu fictif était vide au départ : 120 € déposés, 35 € retirés, 15 € encore disponibles, sans bonus ni pari en cours. Quelle est la perte nette ?¦70 €¦85 €¦105 €¦120 €¦La perte nette est l'argent versé moins l'argent retiré et la valeur encore disponible : 120 − 35 − 15 = 70 €. Les dépôts seuls ne mesurent donc pas le résultat net.
`);
add(4,S.ofdt,`
Dans un exemple fictif représentatif, 40 % des adultes ont joué et 5 % de ces joueurs dépassent un seuil de risque. Quelle part de tous les adultes dépasse ce seuil ?¦2 %¦5 %¦12,5 %¦45 %¦Il faut conserver le bon dénominateur : 0,40 × 0,05 = 0,02, soit 2 % des adultes. Ce calcul illustratif n'est pas une estimation réelle de la population française.
`);
add(4,S.mechanisms,`
Un jeu fictif coûte 2 € par participation. Dans 5 % des cas il verse 30 €, mise comprise, et dans les autres cas rien. Quelle est l'espérance du résultat net par participation ?¦Une perte moyenne théorique de 0,50 €¦Un gain moyen théorique de 1,50 €¦Une perte moyenne théorique de 1,90 €¦Un gain moyen théorique de 0,50 €¦Le versement moyen théorique vaut 0,05 × 30 = 1,50 €. Après déduction de la mise de 2 €, l'espérance nette est de −0,50 € ; un gain possible ne rend donc pas l'espérance positive.
`);
add(4,S.gambling,`
Pourquoi une politique de prévention du jeu ne peut-elle reposer uniquement sur l'injonction « soyez raisonnable » adressée aux joueurs ?¦L'offre, les mécanismes commerciaux et l'accès influencent aussi les dommages¦Les facteurs individuels expliquent nécessairement tous les dommages¦L'information seule rend inutile tout encadrement de l'offre¦La prévention devient impossible dès qu'un jeu est autorisé¦Une approche de santé publique agit aussi sur l'environnement et l'offre. Tout faire reposer sur la volonté personnelle risque de culpabiliser les personnes et d'ignorer ces déterminants.
`);
add(4,S.anj,`
Un parieur gagne une grosse somme puis poursuit malgré des absences au travail et des tentatives d'arrêt infructueuses. Quelle conclusion le gain permet-il à lui seul ?¦Aucune conclusion fiable sur la maîtrise de sa pratique¦Il exclut une pratique problématique pour les mois suivants¦Il démontre que les absences n'ont plus de retentissement¦Il prouve l'efficacité d'une stratégie de gain durable¦Un gain ponctuel ne renseigne pas à lui seul sur le contrôle du comportement. L'évaluation doit considérer la persistance des difficultés, leurs conséquences et le contexte de vie.
`);
// Jeux vidéo et écrans : 6 débutantes, 7 intermédiaires, 6 avancées, 6 expertes.
add(1,S.gaming,`
Le simple fait d'aimer jouer aux jeux vidéo signifie-t-il que l'on a un trouble du jeu ?¦Non, aimer ce loisir ne suffit pas à établir un trouble¦Oui, dès qu'on a un jeu préféré¦Oui, dès qu'on joue avec des amis¦Oui, si l'on gagne souvent des parties¦La plupart des joueurs ne présentent pas un trouble du jeu. Le plaisir d'une activité ne suffit pas : le contrôle et les répercussions dans la vie comptent aussi.
`);
add(1,S.sleep,`
Pour préserver le sommeil d'un enfant, quel choix est le plus adapté au moment de préparer le coucher ?¦Prévoir un moment calme sans écran¦Commencer une compétition en ligne difficile à interrompre¦Garder les notifications sonores toute la nuit¦Remplacer le coucher par une dernière série de vidéos¦La préparation du sommeil gagne à être calme et régulière. Les écrans tardifs et les activités stimulantes peuvent retarder l'endormissement ou perturber la nuit.
`);
add(1,S.mildeca,`
Après être resté longtemps assis devant un jeu, quelle pause diversifie utilement les activités ?¦Se lever et bouger un peu¦Passer assis de l'ordinateur au téléphone¦Regarder une vidéo sans quitter son siège¦Remplacer le jeu par un autre jeu sur tablette¦Une autre application ne constitue pas forcément une pause dans la position assise. Préserver le mouvement et les autres activités fait partie d'un usage équilibré.
Pour organiser une session avec des amis en ligne, quel accord facilite un arrêt prévu ?¦Annoncer une heure de fin avant de commencer¦Décider que seul le dernier gagnant pourra partir¦Promettre de rester jusqu'à toutes les victoires souhaitées¦Ajouter une partie chaque fois qu'un ami se reconnecte¦Un accord préalable aide à préserver les autres activités et à annoncer son départ. Il peut être ajusté au contexte sans transformer une limite en compétition supplémentaire.
`);
add(1,S.screen,`
Un jeune dort moins et manque régulièrement ses rendez-vous parce qu'il reste sur son jeu. Quel élément mérite d'en parler à un adulte de confiance ?¦Les conséquences sur son sommeil et sa vie quotidienne¦Le classement du jeu dans les ventes¦Le nombre de points gagnés dans une partie¦Le fait que ses amis apprécient aussi ce jeu¦Les répercussions concrètes sont des raisons d'ouvrir le dialogue et de chercher des solutions. Elles ne permettent pas, à elles seules, de poser un diagnostic.
`);
add(1,S.social,`
Un réseau social provoque chez un adolescent un mal-être répété. Quelle première démarche est raisonnable ?¦En parler à un adulte de confiance et chercher du soutien¦Rester seul pour ne déranger personne¦Considérer que toute souffrance en ligne est imaginaire¦Publier obligatoirement tous ses messages privés¦Une expérience numérique pénible mérite d'être écoutée. Le dialogue et un soutien adapté permettent d'agir sur les usages ou les contenus qui posent problème.
`);
add(2,S.behaviour,`
Pour repérer un usage problématique du numérique, pourquoi le nombre d'heures ne suffit-il pas à lui seul ?¦Il faut aussi considérer le contexte, le contrôle et le retentissement¦Toutes les heures d'écran ont exactement le même effet¦Un grand nombre d'heures confirme toujours le même diagnostic¦Le contenu et le moment d'utilisation n'ont jamais d'importance¦Un total d'heures ne distingue pas les usages ni leurs conséquences. Il faut considérer la situation de la personne, ses autres activités et sa capacité à réguler la pratique.
`);
add(2,S.gaming,`
Le trouble du jeu vidéo décrit par l'OMS concerne-t-il seulement les jeux connectés à Internet ?¦Non, il peut concerner le jeu en ligne ou hors ligne¦Oui, une connexion permanente est indispensable¦Oui, mais seulement les compétitions diffusées en direct¦Non, mais uniquement les consoles portables¦La définition porte sur le comportement de jeu numérique et ses répercussions. Jouer hors ligne ne suffit donc pas à exclure une pratique problématique.
`);
add(2,S.sleep,`
Pourquoi laisser un téléphone qui reçoit des notifications dans la chambre peut-il compliquer le repos d'un enfant ?¦Les sollicitations peuvent interrompre le calme et le sommeil¦Les notifications garantissent un réveil plus reposé¦Le téléphone supprime le besoin de dormir régulièrement¦La présence d'un écran accélère toujours l'endormissement¦Les sons, les consultations nocturnes et la lumière peuvent perturber le repos. Ranger les appareils hors de la chambre aide à préserver un environnement calme.
`);
add(2,S.screen,`
Lors d'un repas avec un enfant, pourquoi l'usage du téléphone par l'adulte compte-t-il aussi ?¦Il peut interrompre les échanges et servir de modèle d'usage¦Seul le téléphone utilisé par l'enfant peut affecter les échanges¦Les adultes transmettent toujours mieux en consultant plusieurs écrans¦La présence physique de l'adulte suffit quelles que soient ses interactions¦L'attention partagée et les échanges comptent dans la relation. Les usages des adultes font donc aussi partie de la réflexion sur les écrans au sein de la famille.
Un contenu diffusé sur une tablette est-il forcément adapté à tous les enfants parce qu'il ne s'agit pas d'un jeu violent ?¦Non, l'âge, le contenu et la sensibilité de l'enfant restent à considérer¦Oui, l'absence de combat suffit à le rendre universel¦Oui, si la vidéo est courte¦Oui, si un autre enfant l'a déjà regardé¦Le support et un seul critère de contenu ne suffisent pas. Des images, des interactions ou des messages peuvent être inadaptés selon l'âge et la situation de l'enfant.
`);
add(2,S.anses,`
Désactiver des notifications non essentielles vise principalement à quoi ?¦Réduire les sollicitations qui poussent à revenir sur l'application¦Supprimer toute possibilité de développer un trouble¦Rendre tous les contenus consultés fiables¦Transformer automatiquement l'application en outil de soin¦Les notifications participent à la captation de l'attention. Les réduire peut aider à choisir ses moments de consultation, sans garantir à elle seule la résolution d'une difficulté.
`);
add(2,S.paho,`
Pourquoi une prévention des jeux vidéo peut-elle préserver aussi leurs usages récréatifs ou sociaux ?¦Un même loisir peut avoir des usages bénéfiques et des usages problématiques¦Tout bénéfice social rend impossible une difficulté ultérieure¦Un jeu éducatif ne peut jamais être pratiqué excessivement¦Prévenir impose nécessairement d'interdire tous les jeux à tous les âges¦Les jeux peuvent offrir du lien et du plaisir sans constituer un trouble. La prévention considère aussi les risques et les besoins de la personne, au lieu de juger le support seul.
`);
add(3,S.behaviour,`
Pourquoi « addiction aux écrans » est-il un terme trop général pour décrire précisément le trouble du jeu vidéo ?¦Un écran sert à des activités différentes qui ne correspondent pas toutes à ce trouble¦Tout usage d'écran est une forme identique de jeu vidéo¦Le trouble du jeu vidéo se définit uniquement par la taille de l'écran¦La classification dépend seulement du fabricant de l'appareil¦Échanger, travailler, regarder une vidéo et jouer sont des activités différentes. Une catégorie clinique centrée sur le jeu ne s'applique pas automatiquement à tout usage d'écran.
`);
add(3,S.anses,`
Une plateforme recommande surtout les contenus qui prolongent la consultation. Pourquoi ne peut-on pas supposer qu'ils sont les meilleurs pour la santé de l'utilisateur ?¦L'objectif d'engagement n'est pas équivalent à un objectif de santé¦Un contenu regardé longtemps est nécessairement bénéfique¦La personnalisation constitue une validation médicale des contenus¦Une recommandation algorithmique reflète toujours un choix pleinement informé¦Un système peut optimiser l'attention sans évaluer le bien-être. La pertinence commerciale d'une recommandation ne prouve donc ni sa qualité sanitaire ni son adaptation à une personne.
`);
add(3,S.social,`
Des adolescents qui vont mal utilisent davantage certains réseaux sociaux dans une enquête réalisée à un seul moment. Quelle conclusion serait excessive ?¦Affirmer que les réseaux ont causé à eux seuls tous les malaises observés¦Décrire une association entre les deux variables¦Rechercher le rôle du contenu et du contexte¦Étudier aussi la situation antérieure des adolescents¦Une association observée ne suffit pas à déterminer le sens du lien ni à exclure d'autres facteurs. Le mal-être peut aussi modifier les usages ; des études adaptées sont nécessaires.
`);
add(3,S.gaming,`
Quel ensemble correspond le mieux aux dimensions centrales du trouble du jeu vidéo décrites par l'OMS ?¦Contrôle altéré, priorité croissante au jeu, poursuite malgré les conséquences¦Bon classement, jeu récent, grand nombre d'amis en ligne¦Console personnelle, casque audio, abonnement payant¦Préférence pour un genre, plaisir de jouer, parties gagnées¦L'OMS décrit un ensemble de comportements avec un retentissement important. Les équipements, les préférences et la réussite dans le jeu ne constituent pas ces dimensions cliniques.
`);
add(3,S.mildeca,`
Pourquoi séparer le temps d'écran scolaire du temps de loisir peut-il aider une discussion familiale ?¦Les usages et les marges d'action ne sont pas identiques¦Le temps scolaire ne peut jamais fatiguer¦Toute heure scolaire annule les effets des autres usages¦Le seul objectif est de faire baisser un chiffre sans examiner les besoins¦Distinguer les activités permet de discuter de contraintes réelles et des moments modifiables. Cela n'enlève pas l'intérêt de protéger le repos, les pauses et les relations.
`);
add(3,S.screen,`
Un jeune fait ses devoirs mais dort très peu pour jouer chaque nuit. Pourquoi la réussite scolaire ne suffit-elle pas à écarter une difficulté ?¦La santé et la vie quotidienne comportent plusieurs domaines à examiner¦Les notes mesurent intégralement le sommeil et les relations¦Une réussite dans un domaine prouve l'absence de retentissement ailleurs¦Le sommeil n'est pertinent que si les résultats scolaires chutent¦Une conséquence peut toucher le sommeil, les relations ou l'état physique avant les notes. L'évaluation ne doit pas réduire le fonctionnement quotidien à un seul domaine.
`);
add(4,S.paho,`
Dans la CIM-11, la durée habituelle du profil de trouble du jeu est d'au moins douze mois. Quelle nuance évite une lecture mécanique ?¦Une durée plus courte peut être retenue si toutes les exigences sont remplies et les symptômes particulièrement sévères¦Douze mois de jeu, même sans dommage, confirment toujours le trouble¦Une semaine suffit systématiquement, quelle que soit la gravité¦La durée remplace l'examen du contrôle et du retentissement¦La durée est un repère clinique associé aux autres exigences, pas un compteur diagnostique isolé. L'exception de sévérité reste du ressort d'une évaluation professionnelle complète.
`);
add(4,S.anses,`
Pour attribuer un effet à un type précis de contenu numérique, pourquoi un indicateur regroupant toutes les heures d'écran pose-t-il problème ?¦Il mélange des expositions différentes et peut masquer le rôle du contenu étudié¦Un indicateur global mesure toujours mieux chaque contenu particulier¦Le regroupement élimine automatiquement tous les facteurs de confusion¦Le nombre d'heures permet à lui seul d'identifier le mécanisme causal¦Travail scolaire, échanges et contenus ciblés ne sont pas interchangeables. Un total global peut diluer une association spécifique et ne permet pas d'isoler son mécanisme.
`);
add(4,S.social,`
Une étude compare l'usage des réseaux chez des jeunes déjà en difficulté et chez des jeunes sans difficulté, sans connaître leurs usages antérieurs. Quel biais d'interprétation menace surtout la conclusion causale ?¦La temporalité incertaine et une possible causalité inverse¦Une preuve que toute association est nécessairement fausse¦L'impossibilité mathématique de comparer deux groupes¦La certitude que le groupe le plus connecté est représentatif de tous les jeunes¦Sans chronologie suffisante, on ignore si l'usage précède le mal-être ou s'il le suit. La comparaison peut guider la recherche sans établir à elle seule une cause.
`);
add(4,S.gaming,`
Dans un suivi clinique du jeu, pourquoi mesurer aussi le retour aux activités choisies est-il plus informatif que viser seulement moins d'heures ?¦Le fonctionnement et la reprise de contrôle font partie de l'objectif d'évaluation¦Toute réduction d'heures prouve une guérison complète¦Les activités hors jeu sont sans rapport avec les critères cliniques¦Un nombre d'heures identique signifie une situation identique pour tous¦Une diminution peut être imposée ou coexister avec des difficultés persistantes. Examiner le contrôle et la place des autres activités permet de mieux interpréter l'évolution.
`);
add(4,S.mildeca,`
Une étude hypothétique trouve davantage de fatigue chez les grands utilisateurs d'écrans, sans mesurer les horaires de travail. Pourquoi cette omission compte-t-elle ?¦Des horaires atypiques pourraient influencer à la fois l'usage et la fatigue¦Elle prouve que les écrans n'ont aucun effet possible¦Elle permet d'attribuer toute la fatigue au seul écran¦Le nombre de participants suffit toujours à éliminer cette omission¦Un facteur commun peut contribuer à l'association mesurée. Augmenter la taille de l'échantillon ne remplace pas la mesure des facteurs pertinents et une stratégie d'analyse adaptée.
`);
add(4,S.anses,`
Une application réduit ses notifications mais conserve défilement infini et lecture automatique. Quelle évaluation est la plus justifiée ?¦Il faut examiner l'ensemble des mécanismes de captation, pas un réglage isolé¦La suppression des notifications prouve que toute captation a disparu¦Le défilement n'influence jamais la durée de consultation¦Un seul réglage suffit à démontrer un effet sanitaire pour tous les utilisateurs¦Les interfaces combinent plusieurs sollicitations. Modifier un élément ne permet pas de conclure à l'effet global sans examiner les autres mécanismes et les usages réels.
`);
// Aide, autorégulation et autres comportements : 5/6/7/7 par difficulté.
add(1,S.cps,`
Une envie d'achat imprévue apparaît pendant une promotion. Quel geste laisse un temps de réflexion ?¦Faire une pause avant de décider si cet achat répond à un besoin¦Acheter immédiatement pour supprimer toute hésitation¦Augmenter son budget parce que le compte à rebours avance¦Considérer que l'envie oblige à passer commande¦Une envie n'impose pas d'agir immédiatement. Prendre du recul aide à distinguer besoin, émotion et sollicitation commerciale, sans qualifier cette envie de maladie.
Face à une émotion désagréable qui pousse à agir très vite, quelle compétence peut aider ?¦Reconnaître l'émotion avant de choisir sa réponse¦Se convaincre qu'il est interdit d'éprouver une émotion¦Décider que toute envie doit être satisfaite sur-le-champ¦Confondre l'émotion avec un ordre auquel il faut obéir¦Identifier ce que l'on ressent fait partie des compétences émotionnelles. Cela peut ouvrir d'autres réponses et n'exige pas de supprimer toutes ses émotions.
`);
add(1,S.inserm,`
Pourquoi traiter une personne en difficulté avec un comportement de « faible » est-il inadapté ?¦Les difficultés résultent de facteurs multiples et méritent une aide sans jugement¦Une insulte suffit habituellement à restaurer le contrôle¦Les facteurs sociaux et psychologiques n'ont aucun rôle¦La culpabilité garantit que le comportement s'arrête¦Les conduites problématiques ne se réduisent pas à une faute morale. L'écoute et l'accompagnement tiennent compte de la personne et de son environnement.
`);
add(1,S.help,`
Une habitude prend trop de place et fait souffrir. Peut-on en parler à son médecin avant de connaître le nom exact du problème ?¦Oui, on peut consulter pour faire le point¦Non, il faut d'abord trouver seul un diagnostic¦Seulement si une substance illégale est concernée¦Seulement après l'échec de tous les conseils trouvés en ligne¦Le premier entretien sert notamment à comprendre la difficulté et à orienter. Il n'est pas nécessaire de s'attribuer une étiquette pour demander de l'aide.
`);
add(1,S.education,`
Un groupe pousse un ami à continuer une activité qu'il veut arrêter. Quelle réponse respecte le mieux son choix ?¦Accepter son refus sans le ridiculiser¦Exiger qu'il prouve sa valeur en continuant¦Décider que l'avis du groupe remplace le sien¦Se moquer de lui jusqu'à ce qu'il accepte¦Respecter un refus et communiquer sans pression favorisent des relations protectrices. La prévention comprend aussi la capacité à exprimer et à respecter des limites.
`);
add(2,S.care,`
Pour comprendre un achat impulsif qui se répète, quelle observation est la plus utile à discuter ?¦Les situations, les émotions et les conséquences entourant les achats¦Le nombre de cartes bancaires indépendamment de leur usage¦La popularité des marques choisies uniquement¦Le nombre d'avis favorables laissés par les vendeurs¦Relever le contexte permet de mieux comprendre ce qui précède et suit le comportement. Ces informations peuvent guider un échange avec un professionnel, sans établir seules un diagnostic.
`);
add(2,S.cps,`
Quel objectif est le plus concret pour réorganiser une habitude numérique ?¦Choisir un moment précis sans notifications et faire le point après quelques jours¦Promettre de ne plus jamais ressentir d'envie¦Décider de devenir parfait dès demain sans préciser comment¦Attendre de n'avoir plus aucune difficulté dans la vie pour essayer¦Un objectif observable et révisable aide à voir ce qui fonctionne dans une situation donnée. Il ne s'agit pas d'une recette universelle ni d'un engagement à ne jamais rencontrer d'obstacle.
`);
add(2,S.cjc,`
Une consultation jeunes consommateurs peut-elle accueillir un jeune préoccupé par ses jeux vidéo même sans consommation de drogue ?¦Oui, ces consultations peuvent aborder des difficultés avec ou sans substance¦Non, elles sont réservées aux drogues illicites¦Seulement s'il possède une ordonnance pour un médicament¦Uniquement si une sanction scolaire a déjà été prononcée¦Les CJC proposent de faire le point avec les jeunes et leur entourage. Les questions liées au jeu vidéo ou à Internet peuvent y être abordées, sans attendre une sanction.
`);
add(2,S.behaviour,`
Une personne achète souvent des vêtements. Cette seule fréquence prouve-t-elle une addiction médicalement reconnue aux achats ?¦Non, elle ne suffit ni à définir la difficulté ni à poser un diagnostic¦Oui, toute répétition d'achat correspond au même trouble¦Oui, si les achats sont faits en ligne¦Oui, dès qu'une promotion influence une décision¦Les achats compulsifs sont un sujet clinique et de recherche, mais acheter souvent n'est pas un diagnostic. La souffrance, la perte de contrôle et les conséquences nécessitent un examen contextualisé.
`);
add(2,S.help,`
Qui peut être un premier interlocuteur accessible pour un adolescent inquiet de ses habitudes ?¦L'infirmière scolaire ou un professionnel de santé¦Uniquement un influenceur qui vend sa propre méthode¦Seulement le service commercial de l'application utilisée¦Exclusivement un autre joueur du même classement¦Les professionnels de proximité peuvent écouter, évaluer les besoins et orienter. Un vendeur de méthode ou un classement en ligne ne remplace pas cet accompagnement.
`);
add(2,S.jis,`
Un proche se sent épuisé à force de surveiller les dépenses d'un joueur. Quel besoin doit aussi être pris en compte ?¦Son propre soutien et la protection de ses limites¦Son obligation de régler personnellement toutes les dettes¦La nécessité de cacher sa fatigue pour toujours¦L'idée qu'il doit assumer seul le rôle de soignant¦L'entourage peut lui aussi être affecté et demander un accompagnement. Aider ne signifie pas tout prendre en charge ni renoncer à sa santé et à ses propres limites.
`);
add(3,S.care,`
Dans l'accompagnement d'une conduite problématique, pourquoi associer parfois soutien psychologique et accompagnement social ?¦Les difficultés peuvent concerner les émotions, le logement, les ressources et les relations¦Une difficulté sociale exclut nécessairement tout besoin psychologique¦Un suivi psychologique règle automatiquement toute dette ou difficulté de logement¦L'accompagnement social consiste seulement à surveiller la personne¦Une prise en charge globale considère plusieurs dimensions de la vie. Les interventions peuvent se compléter selon les besoins au lieu de réduire la situation à un seul comportement.
Une action de prévention des conduites à risque est proposée à tous les élèves d'un collège, sans sélection selon leurs difficultés. Quel ciblage décrit cette action ?¦Une prévention universelle¦Une prévention indiquée réservée aux premiers signes d'une difficulté¦Une prévention sélective limitée à un groupe particulièrement exposé¦Un traitement individuel après diagnostic confirmé¦La prévention universelle s'adresse à l'ensemble d'une population définie. Ce ciblage se distingue d'une action destinée à un groupe plus exposé ou à des personnes présentant déjà des signes préoccupants.
`);
add(3,S.cps,`
Une personne atteint un petit objectif qu'elle avait choisi pour modifier une habitude. Quel effet cette expérience peut-elle soutenir, sans garantir la suite ?¦Son sentiment de pouvoir agir sur la situation¦La certitude qu'aucun obstacle ne surviendra plus¦La preuve qu'elle n'aura jamais besoin d'aide¦La disparition automatique de toutes ses envies¦Une réussite concrète peut renforcer le sentiment d'efficacité personnelle et soutenir l'engagement. Elle ne garantit pas une évolution sans difficulté et n'interdit pas de demander un soutien.
`);
add(3,S.cjc,`
Des parents souhaitent parler des pratiques numériques de leur enfant, qui refuse pour l'instant de venir. Une CJC peut-elle les recevoir ?¦Oui, l'entourage peut être reçu même sans le jeune¦Non, un jeune doit toujours être présent au même entretien¦Seulement si les parents disposent de son mot de passe¦Uniquement après l'arrêt définitif de tout écran à la maison¦Les consultations peuvent soutenir les proches dans leur compréhension et leur positionnement. Recevoir l'entourage ne signifie pas poser un diagnostic sur une personne absente.
`);
add(3,S.cps,`
Une personne veut mieux gérer ses émotions pour éviter certains automatismes. Quel objectif est cohérent avec les compétences psychosociales ?¦Élargir ses façons de répondre aux émotions plutôt que nier leur existence¦Ne plus ressentir aucune tristesse ni frustration¦Considérer toute émotion intense comme une maladie addictive¦Agir immédiatement pour faire disparaître la moindre tension¦La régulation émotionnelle vise notamment à reconnaître les émotions et à disposer de réponses adaptées. Éprouver une émotion n'est pas en soi un trouble ni un échec.
`);
add(3,S.inserm,`
Dans une situation fictive, acheter soulage brièvement une tension puis les difficultés financières augmentent. Quel mécanisme peut entretenir la répétition ?¦Le soulagement immédiat peut favoriser la répétition malgré des coûts différés¦Les conséquences différées empêchent toujours toute répétition¦Un soulagement bref démontre un bénéfice global durable¦Une dette prouve à elle seule une addiction particulière¦Un effet immédiat agréable ou soulageant peut peser sur la répétition d'un comportement. Cette analyse d'une situation n'établit pas un diagnostic ni une catégorie clinique reconnue pour chaque achat.
`);
add(3,S.behaviour,`
Quelle distinction est correcte entre besoin d'aide et reconnaissance d'une catégorie diagnostique pour un comportement ?¦Une souffrance peut mériter une aide même si son classement clinique fait encore l'objet de recherches¦Aucune aide n'est possible sans une catégorie portant exactement le nom du comportement¦Tout comportement qui fait souffrir est automatiquement une addiction officiellement définie¦Un comportement non classé ne peut jamais avoir de conséquences réelles¦La recherche sur les classifications et l'accompagnement répondent à des questions différentes. On peut prendre une difficulté au sérieux sans généraliser abusivement le mot addiction.
`);
add(4,S.inserm,`
Une activité active des circuits cérébraux de récompense. Pourquoi cela ne démontre-t-il pas, à lui seul, qu'elle constitue une addiction ?¦Ces circuits participent aussi à des activités ordinaires et le diagnostic requiert d'autres éléments¦Toute activité plaisante relève nécessairement du même trouble¦L'activation cérébrale dispense de connaître le fonctionnement quotidien¦Une image cérébrale établit toujours la même gravité clinique chez tous¦Un mécanisme partagé n'est pas une preuve suffisante de catégorie diagnostique. Le contrôle, le retentissement et les autres éléments cliniques doivent aussi être considérés.
Un programme fictif présente une forte assiduité et un bon respect du protocole, mais aucune amélioration démontrée de son indicateur principal. Quel bilan distingue correctement les évaluations ?¦La mise en œuvre est documentée favorablement, mais l'efficacité sur cet indicateur n'est pas démontrée¦La forte assiduité prouve à elle seule l'efficacité sur l'indicateur principal¦L'absence d'effet prouve nécessairement que le protocole n'a pas été respecté¦Le respect du protocole garantit une amélioration future même sans suivi¦L'évaluation du déroulement et celle des effets répondent à des questions distinctes. Une bonne mise en œuvre ne prouve pas un bénéfice ; l'absence d'effet démontré n'identifie pas non plus automatiquement sa cause.
`);
add(4,S.care,`
Une personne présente à la fois une conduite de jeu problématique et des symptômes dépressifs. Pourquoi une évaluation globale est-elle nécessaire ?¦Les besoins peuvent être associés et nécessiter des interventions coordonnées sans supposer une cause unique¦Traiter un seul comportement garantit que tous les autres symptômes disparaîtront¦L'association prouve toujours que la dépression est uniquement causée par le jeu¦Les symptômes psychologiques empêchent tout accompagnement social¦Des difficultés peuvent coexister et s'influencer sans qu'une cause unique soit établie. L'évaluation permet d'organiser les soins selon les besoins, plutôt que d'appliquer une explication automatique.
`);
add(4,S.cps,`
Un programme de prévention évalué chez des collégiens améliore un indicateur. Que faut-il examiner avant d'annoncer le même effet chez des adultes avec achats compulsifs ?¦La population, le problème ciblé et les conditions d'intervention diffèrent¦Toute efficacité se transfère automatiquement à tout comportement et tout âge¦Seul le nom commercial du programme importe¦Un résultat positif interdit toute nouvelle évaluation¦Une preuve concerne un contexte et des critères précis. Généraliser à une autre population ou à un autre problème demande une justification et parfois une nouvelle évaluation.
Un programme fictif suit 100 personnes ; seules 50 répondent à la fin, dont 40 disent aller mieux. Quelle affirmation respecte les données ?¦40 % du groupe initial ont déclaré une amélioration ; l'évolution des 50 non-répondants est inconnue¦80 % du groupe initial ont certainement été améliorés¦Les 50 non-répondants ont nécessairement tous échoué¦Les réponses prouvent à elles seules l'effet causal du programme¦Quarante réponses favorables représentent 40 sur 100 au départ et 80 sur 50 répondants. La non-réponse et l'absence de comparaison limitent l'interprétation de l'efficacité.
Dans un essai fictif, un problème concerne 40 % du groupe témoin et 30 % du groupe accompagné. Quelle description de l'écart est correcte ?¦10 points de pourcentage, soit 25 % de moins relativement au taux témoin¦10 %, soit 10 points dans tous les sens du terme¦25 points de pourcentage, soit 10 % de moins relativement¦70 points de pourcentage, car 30 % vont encore mal¦L'écart absolu est de 40 − 30 = 10 points. Rapporté aux 40 % du groupe témoin, il représente 10/40 = 25 % ; ces deux mesures répondent à des questions différentes.
Dans un essai de prévention, des classes entières reçoivent chacune le même programme. Pourquoi analyser tous les élèves comme des observations entièrement indépendantes est-il discutable ?¦Les réponses d'élèves d'une même classe peuvent être corrélées¦La randomisation par classes interdit toute comparaison¦Chaque élève doit obligatoirement donner une réponse identique à ses camarades¦Le nombre total d'élèves élimine automatiquement toute dépendance¦Les élèves d'une même classe partagent un environnement et une intervention. L'analyse doit tenir compte de cette structure pour ne pas surestimer la précision des résultats.
`);

// Alimentation : 7/6/6/6 par difficulté.
const foodQuestions=[
  {
    "difficulty": 1,
    "question": "Quelle boisson est recommandée en premier pour s'hydrater au quotidien ?",
    "options": [
      "L'eau",
      "Le soda",
      "Le nectar de fruits",
      "La boisson énergisante"
    ],
    "correct": 0,
    "explanation": "L'eau est la boisson de référence pour s'hydrater. Une boisson sucrée ne devient pas indispensable parce qu'elle est présentée comme énergisante.",
    "source": "https://www.mangerbouger.fr/manger-mieux/a-tout-age-et-a-chaque-etape-de-la-vie/les-recommandations-alimentaires-pour-les-adultes/reduire/reduire-les-boissons-sucrees-aliments-gras-sucres-sales-et-ultra-transformes"
  },
  {
    "difficulty": 1,
    "question": "À quantité comparable de fruit utilisée, qu'apporte généralement davantage le fruit entier qu'un jus filtré ?",
    "options": [
      "Des sucres ajoutés par fabrication",
      "De la caféine",
      "Du sel ajouté",
      "Des fibres alimentaires"
    ],
    "correct": 3,
    "explanation": "Le fruit entier conserve davantage de fibres et rassasie généralement mieux. Un jus, même sans sucre ajouté, ne remplace pas automatiquement une portion de fruits.",
    "source": "https://www.ameli.fr/assure/sante/themes/alimentation/fruits-et-legumes/fruits-legumes-consommation"
  },
  {
    "difficulty": 1,
    "question": "Dans l'alimentation, que désigne la satiété ?",
    "options": [
      "Une allergie à un aliment",
      "Une manière de cuire les légumes",
      "Une période pendant laquelle on ne ressent plus la faim",
      "Une préférence pour une saveur"
    ],
    "correct": 2,
    "explanation": "La satiété correspond à l'absence de faim après avoir mangé. Elle se distingue d'une préférence gustative et sa durée peut varier selon les situations.",
    "source": "https://www.mangerbouger.fr/manger-mieux/se-faire-plaisir-en-mangeant-equilibre/manger-equilibre-ca-veut-dire-quoi-et-comment-y-arriver/comment-eviter-le-grignotage-entre-les-repas"
  },
  {
    "difficulty": 1,
    "question": "Une personne souffre de pertes de contrôle répétées lorsqu'elle mange. Quelle démarche peut l'aider ?",
    "options": [
      "Chercher uniquement un classement des aliments",
      "En parler à un professionnel de santé",
      "Garder obligatoirement le secret",
      "Attendre que son entourage devine"
    ],
    "correct": 1,
    "explanation": "Les difficultés alimentaires accompagnées de souffrance méritent un échange avec un professionnel. Un accompagnement adapté peut associer plusieurs types de soins.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-traitement"
  },
  {
    "difficulty": 1,
    "question": "Que signifie varier son alimentation ?",
    "options": [
      "Consommer des aliments de différentes familles au fil des repas",
      "Manger exclusivement son aliment préféré",
      "Changer seulement la marque d'un même produit",
      "Supprimer une famille d'aliments sans raison médicale"
    ],
    "correct": 0,
    "explanation": "La variété concerne les aliments et leurs apports sur plusieurs repas. Elle participe à l'équilibre alimentaire sans exiger qu'un seul repas soit parfait.",
    "source": "https://www.ameli.fr/assure/sante/themes/alimentation/alimentation-adulte/alimentation-adulte-equilibre-repas"
  },
  {
    "difficulty": 1,
    "question": "Aimer beaucoup le goût sucré permet-il, à lui seul, d'affirmer qu'une personne a une addiction ?",
    "options": [
      "Oui, dès que la saveur est appréciée",
      "Oui, si le dessert est son plat préféré",
      "Oui, si cette préférence dure plusieurs semaines",
      "Non, une préférence ne suffit pas à établir un trouble"
    ],
    "correct": 3,
    "explanation": "Une envie ou une préférence alimentaire ne pose pas un diagnostic d'addiction. Les difficultés et leurs conséquences doivent être examinées dans leur contexte.",
    "source": "https://www.ameli.fr/assure/sante/themes/addictions/addictions-comportementales"
  },
  {
    "difficulty": 1,
    "question": "Pour comparer la teneur en sucres de deux yaourts de tailles différentes, quelle donnée commune est utile ?",
    "options": [
      "Le nombre de mots du nom commercial",
      "La taille du logo de la marque",
      "Les grammes de sucres pour 100 g",
      "La couleur du pot"
    ],
    "correct": 2,
    "explanation": "Les valeurs pour 100 g permettent une comparaison sur la même base. La quantité effectivement consommée reste ensuite une information distincte.",
    "source": "https://www.ameli.fr/assure/sante/themes/alimentation/alimentation-adulte/alimentation-adulte-equilibre-repas"
  },
  {
    "difficulty": 2,
    "question": "Quel élément distingue une crise alimentaire préoccupante d'un repas festif simplement copieux ?",
    "options": [
      "Le fait que le repas soit exceptionnel",
      "Le sentiment de perdre le contrôle de ce que l'on mange",
      "Le fait de manger avec d'autres personnes",
      "La présence d'un dessert au menu"
    ],
    "correct": 1,
    "explanation": "La perte de contrôle et la souffrance sont des éléments importants à explorer. Un repas copieux isolé ne permet pas, à lui seul, de diagnostiquer un trouble alimentaire.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-definition-causes"
  },
  {
    "difficulty": 2,
    "question": "Pourquoi l'apparence ou le poids d'une personne ne suffisent-ils pas à repérer tous les troubles alimentaires ?",
    "options": [
      "Certains troubles peuvent exister sans maigreur ou surpoids apparent",
      "Tous les troubles donnent nécessairement la même silhouette",
      "La souffrance disparaît dès que le poids est stable",
      "Un poids habituel exclut les crises alimentaires"
    ],
    "correct": 0,
    "explanation": "Le repérage porte aussi sur les comportements, la souffrance et leurs conséquences. Une corpulence habituelle ne garantit pas l'absence de trouble alimentaire.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-symptomes"
  },
  {
    "difficulty": 2,
    "question": "Pourquoi les soins d'une boulimie peuvent-ils associer médecin, psychologue et professionnel de la nutrition ?",
    "options": [
      "Chaque professionnel doit ignorer ce que font les autres",
      "Le trouble dépend seulement du choix d'un aliment",
      "Le suivi médical remplace nécessairement toute autre aide",
      "Les dimensions physiques, psychiques et alimentaires doivent être prises en compte"
    ],
    "correct": 3,
    "explanation": "La prise en charge peut être pluridisciplinaire et adaptée à la personne. Réduire ces difficultés à un manque de volonté ou à un aliment unique serait insuffisant.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-traitement"
  },
  {
    "difficulty": 2,
    "question": "Selon l'OMS, lequel de ces produits contient des sucres libres même si aucun sucre n'a été ajouté lors de sa fabrication ?",
    "options": [
      "Une huile d'olive nature",
      "Un œuf nature",
      "Un jus de fruits",
      "Une eau de source nature"
    ],
    "correct": 2,
    "explanation": "Les sucres naturellement présents dans les jus appartiennent aux sucres libres au sens de l'OMS. Cette catégorie ne se limite donc pas au sucre ajouté par le fabricant.",
    "source": "https://www.who.int/fr/news-room/fact-sheets/detail/healthy-diet"
  },
  {
    "difficulty": 2,
    "question": "Que peut-on déduire de la mention « sans sucres ajoutés » sur un produit à base de fruits ?",
    "options": [
      "Il peut remplacer sans limite toutes les autres boissons",
      "Il peut néanmoins contenir les sucres naturellement présents dans les fruits",
      "Il ne contient nécessairement aucun sucre",
      "Il ne fournit nécessairement aucune énergie"
    ],
    "correct": 1,
    "explanation": "L'absence de sucres ajoutés n'implique pas l'absence de sucres dans le produit. La composition nutritionnelle et la nature de l'aliment restent à considérer.",
    "source": "https://www.ameli.fr/assure/sante/themes/alimentation/alimentation-adulte/alimentation-adulte-types-aliments/produits-sucres"
  },
  {
    "difficulty": 2,
    "question": "Pour choisir entre deux céréales du petit-déjeuner, à quoi sert principalement leur Nutri-Score ?",
    "options": [
      "À comparer leur qualité nutritionnelle globale sur une base commune",
      "À diagnostiquer une addiction aux céréales",
      "À fixer le nombre exact de repas de chaque personne",
      "À certifier l'absence de tout additif"
    ],
    "correct": 0,
    "explanation": "Le Nutri-Score aide à comparer des produits, notamment au sein d'une même catégorie. Il n'est ni un diagnostic médical ni une prescription alimentaire individuelle.",
    "source": "https://www.mangerbouger.fr/manger-mieux/s-informer-sur-les-produits-qu-on-achete/nouveau-nutri-score"
  },
  {
    "difficulty": 3,
    "question": "Pourquoi les troubles des conduites alimentaires ne se résument-ils pas à une « addiction au sucre » ?",
    "options": [
      "Ils concernent uniquement les aliments contenant du sucre ajouté",
      "Ils sont déterminés seulement par la composition du dernier repas",
      "Ils disparaissent toujours dès qu'un ingrédient est remplacé",
      "Ils impliquent plusieurs facteurs et peuvent concerner des aliments et comportements variés"
    ],
    "correct": 3,
    "explanation": "Les facteurs biologiques, psychologiques et sociaux peuvent se combiner. Une étiquette centrée sur le sucre ne rend pas compte de la diversité de ces troubles.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-definition-causes"
  },
  {
    "difficulty": 3,
    "question": "Quel raisonnement explique l'intérêt de prendre le temps de manger, sans en faire un traitement universel ?",
    "options": [
      "La vitesse du repas suffit à mesurer la gravité d'un trouble",
      "Un repas plus long empêche nécessairement tout retour de faim",
      "Les signaux liés au repas nécessitent du temps, mais un trouble alimentaire peut demander des soins",
      "Manger lentement élimine à lui seul tous les troubles alimentaires"
    ],
    "correct": 2,
    "explanation": "Prendre le temps de manger peut aider à percevoir les signaux du repas. Cela ne remplace pas une évaluation ou un accompagnement lorsque des difficultés persistent.",
    "source": "https://www.mangerbouger.fr/manger-mieux/se-faire-plaisir-en-mangeant-equilibre/manger-equilibre-ca-veut-dire-quoi-et-comment-y-arriver/comment-eviter-le-grignotage-entre-les-repas"
  },
  {
    "difficulty": 3,
    "question": "L'Anses évoque des sucres totaux hors lactose et galactose, tandis que l'OMS parle de sucres libres. Pourquoi leurs repères ne se comparent-ils pas directement gramme pour gramme ?",
    "options": [
      "Le repère le plus élevé annule automatiquement l'autre",
      "Les catégories de sucres comptabilisées ne sont pas identiques",
      "Un gramme change de masse selon l'institution",
      "Les deux expressions désignent obligatoirement tous les glucides"
    ],
    "correct": 1,
    "explanation": "Un repère nutritionnel doit être lu avec sa définition et la population concernée. Les sucres totaux visés par l'Anses et les sucres libres de l'OMS ont des périmètres différents.",
    "source": "https://www.anses.fr/system/files/NUT2012SA0103Ra-1.pdf?download=1"
  },
  {
    "difficulty": 3,
    "question": "Des difficultés alimentaires apparaissent dans un contexte de stress et de pression sur l'image du corps. Quelle interprétation est la plus juste ?",
    "options": [
      "Plusieurs facteurs peuvent contribuer, sans permettre d'attribuer le trouble à une cause unique",
      "Le stress prouve à lui seul un diagnostic précis",
      "L'image du corps n'a jamais de lien avec l'alimentation",
      "Un seul évènement explique nécessairement tous les symptômes"
    ],
    "correct": 0,
    "explanation": "Les troubles alimentaires ont des déterminants multiples. Repérer un contexte peut guider l'aide, mais ne suffit pas à expliquer toute l'histoire d'une personne.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-definition-causes"
  },
  {
    "difficulty": 3,
    "question": "Dans un suivi de troubles alimentaires, quel objectif correspond à l'accompagnement nutritionnel décrit par Ameli ?",
    "options": [
      "Classer définitivement tous les aliments en interdits et autorisés",
      "Organiser seul des restrictions pour compenser chaque repas",
      "Remplacer le suivi psychologique par le comptage systématique des aliments",
      "Retrouver une alimentation régulière, diversifiée et prise avec plaisir"
    ],
    "correct": 3,
    "explanation": "Le suivi nutritionnel s'inscrit dans un projet de soins et vise une relation plus équilibrée à l'alimentation. Il ne repose pas sur une punition après les repas.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-traitement"
  },
  {
    "difficulty": 3,
    "question": "Des épisodes de perte de contrôle alimentaire causent une souffrance mais semblent peu fréquents. Que peut-on raisonnablement en conclure ?",
    "options": [
      "Le diagnostic est certain quelle que soit la durée",
      "La fréquence rend inutile toute discussion sur le retentissement",
      "Une évaluation peut être utile même sans pouvoir affirmer un diagnostic complet",
      "Aucune aide n'est légitime tant qu'un seuil diagnostique n'est pas démontré"
    ],
    "correct": 2,
    "explanation": "Les critères diagnostiques doivent être évalués par un professionnel. Ne pas pouvoir conclure à un trouble précis n'annule pas la souffrance ni l'intérêt d'en parler.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-symptomes"
  },
  {
    "difficulty": 4,
    "question": "Dans les recommandations OMS sur les édulcorants sans sucre, pourquoi une association observée avec certaines maladies ne prouve-t-elle pas à elle seule un effet causal ?",
    "options": [
      "Une recommandation conditionnelle garantit l'absence de facteurs confondants",
      "Les caractéristiques initiales des consommateurs et leurs usages peuvent brouiller cette association",
      "Une association suffit toujours si l'échantillon est grand",
      "L'absence de calories rend impossible tout biais de sélection"
    ],
    "correct": 1,
    "explanation": "L'OMS signale des facteurs de confusion possibles dans ces données. Une association doit être interprétée avec la conception des études et ne démontre pas seule une causalité.",
    "source": "https://www.who.int/news/item/15-05-2023-who-advises-not-to-use-non-sugar-sweeteners-for-weight-control-in-newly-released-guideline"
  },
  {
    "difficulty": 4,
    "question": "Une étude de listes d'ingrédients trouve moins de produits contenant un ingrédient sucrant. Pourquoi cela ne démontre-t-il pas une baisse des grammes de sucres consommés ?",
    "options": [
      "Il manque notamment les quantités dans les produits et les quantités réellement consommées",
      "La fréquence d'un ingrédient mesure directement son poids ingéré",
      "Chaque ingrédient sucrant apporte exactement la même masse de sucres",
      "La présence d'un ingrédient suffit à connaître les portions de chaque consommateur"
    ],
    "correct": 0,
    "explanation": "Une fréquence de présence n'est pas une mesure de teneur ni d'exposition individuelle. Le rapport Anses distingue explicitement ces informations dans l'interprétation de ses résultats.",
    "source": "https://www.anses.fr/fr/system/files/OQALI2018SA0065Ra.pdf"
  },
  {
    "difficulty": 4,
    "question": "Pourquoi une dose journalière admissible d'un édulcorant et une recommandation sur son intérêt pour le contrôle du poids répondent-elles à deux questions différentes ?",
    "options": [
      "Une substance autorisée garantit une perte de poids durable",
      "Une efficacité incertaine démontre automatiquement un dépassement de dose",
      "Les deux repères mesurent nécessairement le même résultat clinique",
      "La première concerne l'évaluation toxicologique, l'autre l'efficacité d'une stratégie nutritionnelle"
    ],
    "correct": 3,
    "explanation": "La sécurité à certaines doses et l'efficacité à long terme ne sont pas interchangeables. Un produit peut respecter un cadre toxicologique sans apporter le bénéfice nutritionnel attendu.",
    "source": "https://www.who.int/publications/i/item/9789240046429/"
  },
  {
    "difficulty": 4,
    "question": "Un repérage bref suggère des crises alimentaires, mais le poids n'a pas changé. Quelle étape évite de confondre dépistage et diagnostic ?",
    "options": [
      "Retenir immédiatement une addiction spécifique à un nutriment",
      "Remplacer l'entretien par le seul total calorique estimé",
      "Une évaluation clinique globale des dimensions somatiques, nutritionnelles, psychiques et sociales",
      "Conclure à l'absence de trouble à partir du seul poids stable"
    ],
    "correct": 2,
    "explanation": "Le dépistage oriente vers une évaluation et ne suffit pas à établir un diagnostic. La HAS recommande une approche globale qui dépasse une mesure ponctuelle du poids.",
    "source": "https://www.has-sante.fr/jcms/pprd_2974164/fr/boulimie-hyperphagie-urgence-a-les-reperer-et-les-prendre-en-charge"
  },
  {
    "difficulty": 4,
    "question": "Dans un suivi, le poids se stabilise mais les crises alimentaires et la détresse persistent. Pourquoi ce seul résultat ne démontre-t-il pas une guérison ?",
    "options": [
      "La détresse ne doit être suivie qu'après un changement de poids",
      "Un indicateur corporel ne résume pas l'évolution comportementale et psychique",
      "Le poids est le seul critère valable de rétablissement",
      "Toute stabilité pondérale prouve l'absence de perte de contrôle"
    ],
    "correct": 1,
    "explanation": "Les troubles alimentaires comportent plusieurs dimensions et des conséquences variées. L'évaluation de l'évolution doit donc aussi tenir compte des crises, de la souffrance et du fonctionnement.",
    "source": "https://www.ameli.fr/assure/sante/themes/boulimie-et-hyperphagie-boulimique/boulimie-hyperphagie-boulimique-symptomes"
  },
  {
    "difficulty": 4,
    "question": "Une enquête donne uniquement les sucres totaux d'une alimentation. Peut-on en déduire exactement sa part de sucres libres au sens de l'OMS ?",
    "options": [
      "Non, il faut connaître les sources alimentaires et la nature des sucres comptés",
      "Oui, tous les sucres totaux sont toujours des sucres libres",
      "Oui, il suffit de diviser le total par deux",
      "Oui, la distinction dépend seulement du nombre de repas"
    ],
    "correct": 0,
    "explanation": "La catégorie des sucres libres inclut notamment les sucres ajoutés, ceux du miel et ceux des jus. Un total global ne permet pas de reconstituer à lui seul ces origines.",
    "source": "https://www.who.int/fr/news-room/fact-sheets/detail/healthy-diet"
  }
];
for(const q of foodQuestions)questions.push({id:"v3-prevention-"+String(401+questions.length),category:"prevention",subtheme:"Habitudes, jeux et alimentation",type:"qcm",...q});
for(const id of ['v3-prevention-463','v3-prevention-470'])questions.find(q=>q.id===id).source=S.cps;
export default questions;
