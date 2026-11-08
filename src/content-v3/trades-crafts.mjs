// Métiers : automobile, boulangerie et paysage. Questions originales et repères techniques.
const questions=[];
const counts={};
const S={
 mechanic:'https://www.onisep.fr/ressources/univers-metier/metiers/technicien-technicienne-automobile',
 tyres:'https://www.michelin.fr/auto/conseils/entretenir-pneus/parallelisme-et-equilibrage-des-pneus',
 pressure:'https://www.michelin.fr/auto/conseils/pression-pneus/gonfler-pneus',
 lambda:'https://www.hella.com/techworld/fr/technique/capteurs-et-actionneurs/sonde-lambda-defectueuse/',
 charge:'https://www.hella.com/techworld/fr/technique/electricite-et-electronique/systeme-de-demarrage-et-de-charge/verification-du-regulateur-multifonction/',
 diagnosis:'https://www.hella-gutmann.com/fileadmin/Manuals/html/mega-macs-pc-manual/fr-FR/355447051.html',
 baker:'https://www.onisep.fr/ressources/univers-metier/metiers/boulanger-boulangere',
 bread:'https://technomitron.aainb.com/plan/',
 knead:'https://technomitron.aainb.com/petrissage/methodes-de-petrissage/',
 yeast:'https://www.lesaffre.com/wp-content/uploads/2022/01/Lesaffre_DP_2022_FR.pdf',
 volume:'https://lesaffre-wa.com/gw/fonctionnalites/volume-et-tolerance',
 training:'https://www.entrepreneursboulangerie.org/wp-content/uploads/PROGRAMME-PETRISSAGE-PATE-fevrier-2025.pdf',
 bakerySafety:'https://www.inrs.fr/metiers/commerce-service/boulangerie-patisserie/boulangerie-patisserie-agir',
 gardener:'https://www.onisep.fr/ressources/univers-metier/metiers/ouvrier-ouvriere-paysagiste',
 garden:'https://lesentreprisesdupaysage.fr/content/uploads/2019/12/guide-biodiversite-ref-gestion-ecologique-des-jardins-noe.pdf',
 soil:'https://www.jardiner-autrement.fr/teneur-sol-matiere-organique/',
 compaction:'https://uved-scv.cirad.fr/co/2_1_3_CompactionSol.html',
 planting:'https://www.lesentreprisesdupaysage.fr/content/uploads/2021/10/ecom2026642a-fascicule_35_amenagements-paysagers_202005-1.pdf',
 water:'https://www.lesentreprisesdupaysage.fr/content/uploads/2020/01/evetav-n38-181023-web.pdf',
 hedge:'https://ephytia.inrae.fr/fr/C/22285/Guide-Eco-Fruits-Haies-et-lisieres-de-bois'
};
function add(trade,subtheme,difficulty,source,rows){
 for(const row of rows.trim().split('\n')){
  const a=row.trim().split('¦');
  if(a.length!==6)throw Error('Question métier invalide : '+row);
  const number=counts[trade]=(counts[trade]||0)+1,raw=a.slice(1,5),shift=(number-1)%4;
  questions.push({id:'v3-trades-'+trade+'-'+String(number).padStart(3,'0'),category:'trades',subtheme,difficulty,type:'qcm',question:a[0],options:[...raw.slice(shift),...raw.slice(0,shift)],correct:(4-shift)%4,explanation:a[5],source});
 }
}
add('mechanic','Mécanicien automobile',1,S.mechanic,`
Quel est le travail principal d'un mécanicien automobile ?¦Entretenir et réparer des véhicules¦Concevoir uniquement des routes¦Organiser uniquement les examens de conduite¦Fabriquer uniquement des carrosseries neuves¦Le mécanicien intervient sur le fonctionnement du véhicule. Il recherche les pannes, entretient les organes et contrôle les réparations.
Pourquoi le mécanicien demande-t-il quand un bruit apparaît ?¦Pour préciser les conditions du défaut¦Pour choisir la couleur d'une pièce¦Pour remplacer toutes les pièces à la fois¦Pour éviter tout contrôle du véhicule¦Un bruit à froid, au freinage ou dans un virage ne fournit pas les mêmes indices. Les observations du conducteur orientent le diagnostic.
Dans un moteur thermique, quel est un rôle essentiel de l'huile moteur ?¦Limiter les frottements entre pièces¦Remplacer le carburant dans le réservoir¦Gonfler les pneus¦Nettoyer le pare-brise¦Le film d'huile réduit les frottements et l'usure des pièces mobiles. L'huile participe aussi à d'autres fonctions, dont l'évacuation de chaleur.
Quelle pièce met en contact la voiture avec la chaussée ?¦Le pneu¦Le filtre à huile¦Le radiateur¦Le démarreur¦Les pneus transmettent au sol les efforts de traction, de freinage et de guidage. Leur état influence directement le comportement du véhicule.
À quoi sert principalement le système de freinage ?¦Ralentir ou arrêter le véhicule¦Régler la température de l'habitacle¦Augmenter la capacité du réservoir¦Charger le téléphone¦Le freinage réduit la vitesse en dissipant une partie de l'énergie du véhicule. Son entretien concerne un système essentiel à la sécurité.
Quel instrument permet de mesurer une tension électrique ?¦Un voltmètre¦Un pied à coulisse¦Un manomètre de pneus¦Un thermomètre¦Le voltmètre indique une différence de potentiel, exprimée en volts. Les contrôles du véhicule suivent une méthode et des précautions adaptées.
Quel organe filtre l'air destiné aux occupants de l'habitacle ?¦Le filtre d'habitacle¦Le filtre à huile¦Le filtre à carburant¦Le filtre de transmission¦Le filtre d'habitacle retient une partie des particules de l'air de ventilation. Il ne remplit pas la même fonction que le filtre à air moteur.
Que désigne une vidange d'huile moteur ?¦Le remplacement de l'huile usagée¦Le remplissage du réservoir de carburant¦La recharge de la batterie¦Le réglage des rétroviseurs¦La vidange renouvelle l'huile selon les préconisations du véhicule. Le type d'huile et les opérations associées dépendent du constructeur.
Quel document aide à retrouver les opérations d'entretien prévues pour un véhicule ?¦Son programme d'entretien constructeur¦Le seul nuancier de carrosserie¦Une carte routière¦Une publicité sans référence au modèle¦Le programme indique les contrôles et remplacements prévus. Il tient compte du véhicule et peut varier selon son usage.
Pourquoi effectue-t-on un contrôle après une réparation automobile ?¦Pour vérifier le résultat de l'intervention¦Pour rendre inutile le diagnostic initial¦Pour garantir qu'aucune panne future n'arrivera¦Pour remplacer automatiquement une autre pièce¦Une réparation doit être vérifiée dans les conditions appropriées. Ce contrôle confirme le résultat observé sans promettre une absence définitive de panne.
`);
add('mechanic','Mécanicien automobile',2,S.mechanic,`
Sur une voiture thermique, quel organe lance la rotation du moteur au démarrage ?¦Le démarreur¦Le silencieux¦Le radiateur¦Le filtre à air¦Le démarreur entraîne le moteur pour permettre son lancement. Il a une fonction différente de celle de l'alternateur.
Quel organe adapte le rapport entre la rotation du moteur et celle des roues motrices ?¦La boîte de vitesses¦Le vase d'expansion¦Le catalyseur¦Le filtre à carburant¦Les rapports de transmission permettent d'adapter vitesse et effort aux besoins de déplacement du véhicule.
Dans un moteur à quatre temps, quelle suite est correcte ?¦Admission, compression, combustion-détente, échappement¦Compression, échappement, admission, combustion-détente¦Admission, échappement, compression, combustion-détente¦Échappement, combustion-détente, compression, admission¦Les quatre temps organisent le renouvellement des gaz et la production du travail mécanique. Le cycle complet comprend deux tours de vilebrequin.
À quoi sert le circuit de refroidissement d'un moteur ?¦Évacuer l'excès de chaleur et maîtriser sa température¦Maintenir tous les composants à zéro degré¦Fournir l'étincelle des bougies¦Réduire la pression des pneus¦Le moteur doit travailler dans une plage de température adaptée. Le refroidissement évacue de la chaleur sans chercher à rendre le moteur aussi froid que possible.
Que mesure une clé dynamométrique lors d'un serrage ?¦Le couple appliqué¦La longueur du filetage¦La température de l'écrou¦La tension de la batterie¦Le couple de serrage s'exprime généralement en newtons-mètres. La valeur prescrite dépend de l'assemblage et des consignes du constructeur.
Quelle est la fonction principale d'un amortisseur de suspension ?¦Freiner les oscillations de la suspension¦Augmenter directement la puissance moteur¦Remplacer la pression du pneu¦Changer le rapport de boîte¦L'amortisseur dissipe l'énergie des oscillations. Il aide la suspension à contrôler les mouvements de la roue et de la carrosserie.
Pourquoi une référence de pièce doit-elle être vérifiée avant son montage ?¦Des versions proches peuvent utiliser des pièces différentes¦Toutes les pièces d'une marque sont identiques¦La couleur garantit toujours la compatibilité¦La pièce la plus lourde convient à chaque modèle¦Le modèle, la motorisation et la version peuvent modifier la compatibilité. L'apparence seule ne suffit pas à identifier la bonne pièce.
`);
add('mechanic','Mécanicien automobile',2,S.charge,`
Sur une voiture thermique en fonctionnement, à quoi sert principalement l'alternateur ?¦Produire l'électricité du réseau de bord et recharger la batterie¦Déclencher directement l'ouverture des soupapes¦Refroidir les plaquettes de frein¦Filtrer les gaz d'échappement¦Entraîné par le moteur, l'alternateur transforme de l'énergie mécanique en énergie électrique. Sa production est régulée selon le système du véhicule.
`);
add('mechanic','Mécanicien automobile',2,S.pressure,`
Quelle référence utiliser pour choisir la pression de gonflage d'une voiture ?¦Les préconisations constructeur adaptées à la charge¦La pression choisie pour une autre voiture au hasard¦La valeur la plus élevée disponible sur le gonfleur¦La couleur du bouchon de valve¦La pression prescrite dépend notamment du véhicule, des pneus et de la charge. Elle se lit dans la documentation ou sur l'étiquette prévue.
`);
add('mechanic','Mécanicien automobile',2,S.tyres,`
Quelle opération compense une répartition inégale de masse dans un ensemble roue-pneu ?¦L'équilibrage¦La vidange¦Le réglage de l'allumage¦La purge du refroidissement¦L'équilibrage corrige le balourd de l'ensemble tournant. Il se distingue du réglage des angles de suspension, appelé géométrie.
`);
add('mechanic','Mécanicien automobile',3,S.diagnosis,`
Un outil affiche un défaut lié à un capteur. Que faut-il en conclure d'abord ?¦Le circuit concerné doit être contrôlé pour préciser la cause¦Le capteur est forcément la seule pièce en panne¦Le moteur entier doit être remplacé¦L'effacement du défaut prouve la réparation¦Un code oriente la recherche, mais ne remplace pas le diagnostic. Le signal peut être perturbé par le câblage, une alimentation ou d'autres causes.
Quel intérêt présente l'enregistrement des valeurs pendant l'apparition d'une panne intermittente ?¦Relier le symptôme aux conditions réelles de fonctionnement¦Rendre tous les codes défaut inutiles à jamais¦Garantir qu'une pièce neuve sera nécessaire¦Empêcher toute variation des mesures¦Un défaut intermittent peut disparaître à l'atelier. Des paramètres enregistrés au bon moment apportent des indices sur son apparition.
Pourquoi compare-t-on une mesure à une valeur de référence du constructeur ?¦Pour l'interpréter dans le contexte du système contrôlé¦Parce que toutes les voitures ont les mêmes valeurs¦Pour éviter de connaître l'unité de mesure¦Pour transformer une hypothèse en certitude sans contrôle¦Une mesure isolée n'est pas automatiquement normale ou anormale. La méthode, les conditions et la référence permettent de l'interpréter.
`);
add('mechanic','Mécanicien automobile',3,S.lambda,`
Quelle information une sonde lambda fournit-elle à la gestion moteur ?¦Une indication de l'oxygène résiduel dans l'échappement¦Le niveau d'huile dans la boîte de vitesses¦La pression du pneu avant gauche¦L'épaisseur des plaquettes de frein¦Cette information aide la gestion moteur à ajuster le mélange air-carburant. La fonction précise dépend du type et de la position de la sonde.
Pourquoi peut-on trouver une sonde lambda après le catalyseur ?¦Pour contribuer à surveiller le fonctionnement du catalyseur¦Pour mesurer la vitesse des roues¦Pour lubrifier l'échappement¦Pour remplacer le filtre d'habitacle¦Les informations avant et après catalyseur servent au contrôle de son efficacité. La sonde aval ne joue donc pas seulement le rôle d'une sonde placée ailleurs.
`);
add('mechanic','Mécanicien automobile',3,S.tyres,`
Quel réglage concerne l'inclinaison d'une roue par rapport à la verticale, vue de face ?¦Le carrossage¦L'équilibrage dynamique¦Le taux de compression¦L'avance à l'allumage¦Le carrossage est un angle de géométrie. Sa valeur doit correspondre aux spécifications du véhicule.
Une roue équilibrée garantit-elle que la géométrie de la suspension est correcte ?¦Non, ce sont deux contrôles distincts¦Oui, l'équilibrage règle tous les angles¦Oui, quelle que soit l'usure des articulations¦Seulement si la jante est peinte¦Une roue peut être équilibrée et présenter un mauvais angle d'orientation. Les deux opérations répondent à des défauts différents.
`);
add('mechanic','Mécanicien automobile',3,S.mechanic,`
À quoi sert un différentiel automobile dans un virage ?¦Permettre aux roues motrices concernées de tourner à des vitesses différentes¦Imposer le même trajet aux deux roues¦Remplacer le freinage hydraulique¦Empêcher tout mouvement de suspension¦Dans un virage, la roue extérieure parcourt généralement plus de distance. Le différentiel autorise une différence de vitesse de rotation.
Dans un frein à disque, quelle transformation d'énergie est principalement recherchée ?¦Énergie de mouvement en chaleur¦Chaleur en carburant¦Énergie lumineuse en mouvement¦Énergie chimique en lumière¦Le frottement entre plaquettes et disque dissipe de l'énergie en chaleur. La conception du frein doit permettre de gérer cet échauffement.
Quel rôle joue la distribution d'un moteur thermique ?¦Synchroniser notamment les soupapes avec le mouvement des pistons¦Répartir le liquide lave-glace¦Équilibrer les roues¦Filtrer le carburant¦La distribution coordonne les mouvements nécessaires au cycle moteur. Son architecture varie : elle peut notamment employer une courroie ou une chaîne.
`);
add('mechanic','Mécanicien automobile',4,S.diagnosis,`
Deux capteurs affichent simultanément des valeurs incohérentes et partagent une alimentation. Quelle hypothèse exploite directement ce point commun ?¦Un défaut de l'alimentation partagée¦Deux usures mécaniques indépendantes¦Deux références de pièces incompatibles¦Deux vieillissements distincts des sondes¦Rechercher un élément partagé permet de tester une cause commune. L'hypothèse doit ensuite être confirmée par des contrôles adaptés.
Un défaut disparaît après effacement des codes, puis revient dans les mêmes conditions. Quelle conclusion est justifiée ?¦La cause peut être toujours présente¦L'outil a forcément provoqué la panne¦Le capteur est forcément la seule cause¦Le calculateur doit forcément être remplacé¦Effacer la mémoire ne répare pas un circuit. Le retour du défaut justifie de poursuivre l'analyse des conditions et des causes.
Une panne survient seulement moteur chaud. Quelle comparaison teste le mieux l'effet de la température ?¦Les mêmes paramètres à froid puis pendant le défaut¦Deux pièces de marques différentes à température inconnue¦Les seuls codes effacés avant chaque essai¦Deux trajets à froid avec des conducteurs différents¦La comparaison dans des conditions maîtrisées aide à identifier ce qui change avec la température. Elle ne remplace pas les précautions de contrôle.
`);
add('mechanic','Mécanicien automobile',4,S.lambda,`
Pour un mélange air-carburant, que signifie un coefficient lambda supérieur à 1 ?¦Un excès d'air par rapport au mélange stœchiométrique¦Un excès de carburant par rapport au mélange stœchiométrique¦L'absence totale d'air¦Une pression d'huile supérieure à un bar¦Lambda compare l'air réel au besoin théorique de combustion. Une valeur supérieure à un correspond à un mélange dit pauvre.
Pourquoi la présence d'un chauffage intégré accélère-t-elle l'utilité d'une sonde lambda ?¦Il amène plus vite l'élément sensible à sa température de service¦Il augmente directement la température du carburant injecté¦Il élimine mécaniquement toutes les particules d'échappement¦Il remplace la régulation du mélange par une tension constante¦La sonde doit être suffisamment chaude pour fonctionner correctement. Son chauffage réduit le délai avant une mesure exploitable.
`);
add('mechanic','Mécanicien automobile',4,S.charge,`
Sur un système de charge piloté, pourquoi une unique tension relevée au ralenti ne suffit-elle pas toujours au diagnostic ?¦La consigne varie selon les conditions de fonctionnement¦La tension permet seulement de connaître l'âge de la batterie¦L'alternateur doit fournir la même tension dans tous les cas¦Le régime moteur donne directement la capacité de la batterie¦La gestion de charge peut faire varier la production de l'alternateur. Le contrôle doit respecter les conditions et références du constructeur.
Une batterie est déchargée alors que l'alternateur vient d'être remplacé. Quelle démarche évite une conclusion prématurée ?¦Contrôler aussi les liaisons et la commande de charge¦Conclure au défaut de la pièce neuve d'après ce seul constat¦Remplacer le démarreur sans vérifier sa consommation¦Choisir une batterie plus grosse sans rechercher la cause¦Une panne de charge peut venir de connexions, de câblage ou de commande. Le diagnostic examine le système, pas seulement la pièce déjà remplacée.
`);
add('mechanic','Mécanicien automobile',4,S.mechanic,`
Un arbre transmet 200 N·m à 1 500 tr/min, puis le même couple à 3 000 tr/min. Comment évolue la puissance mécanique transmise ?¦Elle double¦Elle est divisée par deux¦Elle reste identique¦Elle est multipliée par quatre¦La puissance mécanique vaut le couple multiplié par la vitesse angulaire. À couple constant, doubler la vitesse de rotation double la puissance.
Une réduction idéale de transmission multiplie le couple par 3. Que fait-elle à la vitesse de rotation de sortie ?¦Elle la divise par 3¦Elle la multiplie par 3¦Elle la conserve exactement¦Elle la divise par 9¦Sans pertes, la puissance se conserve. Le gain de couple s'accompagne d'une diminution proportionnelle de la vitesse de rotation.
Pourquoi un défaut de freinage ne se diagnostique-t-il pas seulement à partir du kilométrage ?¦L'usage et les contrôles de l'état réel comptent aussi¦Le kilométrage ne concerne que l'usure des pneumatiques¦Toutes les garnitures s'usent exactement au même rythme¦Le compteur mesure directement l'épaisseur des plaquettes¦Le style d'usage, les conditions et l'état des organes comptent. Des contrôles adaptés sont nécessaires pour établir la cause d'un défaut.
`);
add('baker','Boulanger',1,S.baker,`
Quel produit est au cœur du métier de boulanger ?¦Le pain¦Le fromage affiné¦La charcuterie sèche¦Le jus de fruits¦Le boulanger fabrique notamment du pain et des viennoiseries. Son travail associe préparation, fermentation, cuisson et organisation de la production.
Quelle matière première est obtenue en moulant des grains de céréales ?¦La farine¦La levure¦Le sel¦Le beurre¦La farine apporte une grande part de la matière d'un pain. Ses caractéristiques varient selon la céréale et le travail de mouture.
Quel appareil travaille mécaniquement la pâte à pain ?¦Le pétrin¦La trancheuse à pain¦La chambre froide¦La balance¦Le pétrin mélange et travaille les ingrédients. Son réglage influence la consistance et le développement de la pâte.
Quel outil permet de doser les ingrédients par leur masse ?¦Une balance¦Une grigne¦Une pelle à enfourner¦Un banneton¦La pesée aide à reproduire une recette avec précision. Le volume apparent d'un ingrédient ne donne pas toujours une masse fiable.
Que désigne la mie du pain ?¦Sa partie intérieure¦Sa croûte extérieure¦La farine du sac¦La sole du four¦La mie est la partie interne du pain. Sa structure et ses alvéoles dépendent des ingrédients et des étapes de fabrication.
Comment appelle-t-on un morceau de pâte préparé pour devenir un pain ?¦Un pâton¦Une fournée¦Un pétrin¦Un moulin¦Le pâton est une portion de pâte. Plusieurs pâtons peuvent être cuits ensemble dans une même fournée.
À quoi sert une pelle à enfourner ?¦À introduire les pains dans certains fours¦À peser le sel¦À analyser la farine¦À refroidir la chambre de fermentation¦La pelle aide à déposer les pâtons dans le four. Le matériel utilisé dépend de l'organisation et du type de four.
Que fait le boulanger pendant le façonnage ?¦Il donne au pâton sa forme¦Il moud les grains¦Il emballe le pain déjà refroidi¦Il nettoie les sacs de farine¦Le façonnage prépare la forme du futur pain. Il intervient avant la dernière fermentation et la cuisson.
Quel ingrédient hydrate la farine dans une pâte à pain courante ?¦L'eau¦Le sel sec¦La levure sèche seule¦La vapeur après cuisson¦L'eau permet aux constituants de la farine de s'hydrater. Sa quantité influence la consistance et le travail de la pâte.
Pourquoi les surfaces de préparation doivent-elles être propres ?¦Pour limiter la contamination des aliments¦Pour remplacer la cuisson¦Pour supprimer le besoin de peser¦Pour faire lever la pâte plus vite¦L'hygiène protège les aliments tout au long de la préparation. Elle repose aussi sur les mains, les ustensiles et l'organisation du travail.
`);
add('baker','Boulanger',2,S.yeast,`
La levure de boulanger est principalement constituée de quoi ?¦De micro-organismes vivants¦De sel minéral broyé¦De cristaux de sucre uniquement¦De poudre de craie¦La levure de boulanger est un champignon microscopique. Elle utilise des sucres et participe à la fermentation de la pâte.
Dans un levain de panification vivant, que trouve-t-on habituellement ?¦Des levures et des bactéries lactiques¦Uniquement des cristaux de sel¦Uniquement de l'air sans micro-organismes¦Seulement des grains entiers secs¦Un levain est un milieu fermenté qui héberge notamment levures et bactéries lactiques. Leur activité contribue à la levée et aux arômes.
`);
add('baker','Boulanger',2,S.volume,`
Quel gaz produit par la fermentation contribue à faire gonfler la pâte ?¦Le dioxyde de carbone¦L'hélium¦Le néon¦Le dioxyde de soufre¦Le gaz s'accumule dans la structure de la pâte. Le volume dépend à la fois de sa production et de la capacité de la pâte à le retenir.
`);
add('baker','Boulanger',2,S.bread,`
En panification, que nomme-t-on le pointage ?¦La première fermentation de la pâte après pétrissage¦Le découpage du pain après cuisson¦La pesée du pain vendu¦Le nettoyage final du four¦Le pointage précède la division et les opérations de mise en forme dans un schéma courant. La pâte évolue pendant ce repos.
Qu'est-ce que l'apprêt d'un pain ?¦La dernière fermentation des pâtons avant cuisson¦La récolte du blé¦Le refroidissement du four vide¦La découpe du pain refroidi¦L'apprêt se déroule après façonnage. Le boulanger l'adapte pour obtenir des pâtons prêts à être enfournés.
Pourquoi grigne-t-on certains pâtons avant de les enfourner ?¦Pour guider leur développement pendant la cuisson¦Pour retirer toute la levure¦Pour mesurer leur masse¦Pour empêcher la croûte de se former¦Les incisions créent des zones d'ouverture contrôlée. Elles participent à la forme et au développement du pain.
Que signifie « fleurer » un plan de travail en boulangerie ?¦Y répartir une petite quantité de farine¦L'asperger d'huile de moteur¦Le couvrir de levain épais¦Y déposer du sel en gros tas¦Le fleurage limite l'adhérence de la pâte. Il se fait avec mesure pour éviter les excès de farine.
Quel repos suit immédiatement le défournement du pain ?¦Le ressuage¦Le pointage¦Le frasage¦Le laminage¦Pendant le ressuage, le pain refroidit et laisse échapper de l'humidité. Un refroidissement adapté préserve mieux sa texture.
Que crée le tourage d'une pâte levée feuilletée ?¦Une alternance de couches de pâte et de matière grasse¦Un mélange parfaitement homogène de toutes les couches¦Une croûte déjà cuite avant enfournement¦Une pâte dépourvue d'eau¦Les plis et l'abaisse forment des couches. Cette organisation contribue au feuilletage des viennoiseries comme les croissants.
`);
add('baker','Boulanger',2,S.bakerySafety,`
Pourquoi cherche-t-on à limiter la mise en suspension de poussières de farine au fournil ?¦Pour réduire l'exposition respiratoire des travailleurs¦Pour transformer la farine en sucre¦Pour refroidir plus vite le pain¦Pour empêcher les balances de mesurer¦Les poussières de farine peuvent nuire à la santé respiratoire. Les méthodes de manipulation et de nettoyage doivent limiter leur dispersion.
`);
add('baker','Boulanger',3,S.training,`
Une pâte contient 1 kg de farine et 650 g d'eau, sans autre apport d'eau. Quel est son taux d'hydratation, rapporté à la farine ?¦65 %¦35 %¦39,4 %¦165 %¦En pourcentage boulanger, l'eau est comparée à la farine : 650 divisé par 1 000, puis multiplié par 100, donne 65 %.
Une recette prévoit 18 g de sel par kilogramme de farine. Quelle quantité faut-il pour 5 kg de farine ?¦90 g¦23 g¦180 g¦900 g¦La proportion est conservée en multipliant toutes les quantités par cinq. Le sel nécessaire vaut donc 18 × 5, soit 90 g.
Pourquoi le boulanger tient-il compte de la température de l'eau de pétrissage ?¦Elle influence la température finale de la pâte¦Elle fixe seule la masse de farine¦Elle supprime le besoin de fermentation¦Elle détermine la couleur du sac¦L'eau est un levier de réglage thermique. Le boulanger tient aussi compte de la farine, du local et de l'échauffement au pétrissage.
`);
add('baker','Boulanger',3,S.knead,`
Quel réseau de la pâte de blé contribue à retenir les gaz de fermentation ?¦Le réseau de gluten¦Un réseau de cristaux de sel¦Une couche de cendres¦Un treillis de grains de sucre¦L'hydratation et le travail de la pâte développent un réseau de protéines. Sa capacité à se déformer et retenir les gaz compte dans la panification.
Pourquoi augmenter sans limite le pétrissage n'améliore-t-il pas nécessairement le pain ?¦Un travail excessif peut altérer la pâte et ses qualités¦Le pétrissage n'agit jamais sur la pâte¦La farine devient forcément stérile¦Le sel disparaît après quelques tours¦Le pétrissage doit être adapté à la farine et au produit. Un excès peut notamment échauffer et oxyder davantage la pâte.
`);
add('baker','Boulanger',3,S.bread,`
Dans une pâte à pain de blé, que désigne l'extensibilité ?¦Sa capacité à s'allonger sans se déchirer immédiatement¦Sa capacité à reprendre sa forme uniquement¦Sa teneur en sel uniquement¦Sa température de cuisson¦L'extensibilité décrit l'allongement possible. Elle se distingue de l'élasticité, qui correspond au retour vers la forme précédente.
Pourquoi une détente peut-elle faciliter le façonnage après une mise en forme ?¦Elle laisse la pâte se relâcher¦Elle cuit déjà le centre du pâton¦Elle retire toute l'eau de la pâte¦Elle transforme la levure en farine¦Le repos réduit la résistance au travail dans les schémas adaptés. La pâte devient plus facile à allonger sans forcer inutilement.
À quoi sert un banneton dans la fabrication de certains pains ?¦À soutenir leur forme pendant l'apprêt¦À broyer les grains¦À mesurer la température du four¦À conserver le pain immergé¦Le banneton accompagne le pâton pendant sa fermentation finale. Il est retiré avant la cuisson habituelle du pain sur sole.
Que provoque principalement la vapeur apportée au début de cuisson de certains pains ?¦Elle retarde le dessèchement immédiat de la surface¦Elle supprime toute coloration future¦Elle remplace la fermentation précédente¦Elle maintient définitivement la mie crue¦Une surface restant souple au début de cuisson accompagne l'expansion. La gestion de la vapeur dépend du produit et du four.
Pourquoi le même temps d'apprêt ne convient-il pas automatiquement à deux pâtes de températures différentes ?¦La température influence la vitesse de fermentation¦La fermentation dépend uniquement de la forme du four¦Le temps suffit toujours quel que soit le contexte¦La farine cesse d'absorber l'eau dès le façonnage¦Le boulanger observe l'évolution des pâtons et adapte son organisation. Température, recette et activité fermentaire agissent ensemble.
`);
add('baker','Boulanger',4,S.training,`
Une pâte comprend 800 g de farine, 500 g d'eau et 200 g de levain composé de 100 g d'eau et 100 g de farine. Quel est le taux d'hydratation total ?¦Environ 66,7 %¦62,5 %¦75 %¦50 %¦Il faut compter le levain : 600 g d'eau pour 900 g de farine. Le rapport 600 ÷ 900 vaut environ 66,7 %.
Un boulanger veut 60 pâtons de 350 g, sans compter de pertes avant division. Quelle masse de pâte doit-il préparer ?¦21 kg¦17,5 kg¦24 kg¦210 kg¦La masse totale vaut 60 × 350 g, soit 21 000 g. Cette valeur concerne les pâtons crus, pas le poids des pains après cuisson.
Une fournée passe de 20 kg de pâte à 17 kg de pain refroidi. Quelle est la perte de masse rapportée à la pâte ?¦15 %¦3 %¦17,6 %¦85 %¦La perte est de 3 kg. Rapportée aux 20 kg initiaux, elle vaut 3 ÷ 20 = 15 %, notamment du fait de l'eau évaporée.
`);
add('baker','Boulanger',4,S.bread,`
Que représente principalement le nombre du type d'une farine française, comme T65 ?¦Une classe de teneur en matières minérales¦Le pourcentage exact de protéines panifiables¦Le pourcentage d'eau absorbable au pétrissage¦La force boulangère mesurée à l'alvéographe¦Le classement repose sur le taux de cendres, lié aux matières minérales. Le type ne donne pas à lui seul la force boulangère.
En analyse de farine, que traduit la valeur W de l'alvéographe ?¦Un indicateur de force boulangère¦La teneur totale en matières minérales¦La masse volumique de la farine sèche¦Le taux d'humidité du grain d'origine¦Le W exprime le travail de déformation mesuré à l'alvéographe. Il aide à caractériser la farine sans résumer tous ses comportements.
À l'alvéographe, que compare le rapport P/L ?¦La ténacité et l'extensibilité de la pâte¦L'hydratation et la teneur en sel¦Le temps de pointage et celui d'apprêt¦La teneur en protéines et en lipides¦P caractérise la résistance à la déformation et L l'allongement mesuré. Le rapport renseigne sur l'équilibre de ces propriétés.
Que se passe-t-il lors de la gélatinisation de l'amidon pendant la cuisson du pain ?¦Ses granules absorbent de l'eau et perdent leur organisation initiale¦Ses granules se transforment entièrement en sucres fermentescibles¦Ses molécules produisent directement le réseau de gluten¦Ses molécules se cristallisent sans intervention de l'eau¦Avec l'eau et la chaleur, l'amidon change d'organisation. Cette transformation contribue à fixer la structure de la mie.
Pourquoi le rassissement du pain ne s'explique-t-il pas seulement par son dessèchement ?¦L'amidon se réorganise aussi au cours du temps¦Les levures poursuivent leur croissance après cuisson¦Le sel disparaît progressivement de la mie¦La mie produit de nouvelles protéines pendant le stockage¦La rétrogradation de l'amidon participe au raffermissement de la mie. La migration et la perte d'eau peuvent également intervenir.
Quelle réaction participe au brunissement et à certains arômes de la croûte du pain ?¦La réaction de Maillard entre composés sucrés et aminés¦La photosynthèse¦La congélation de la levure¦La cristallisation du sel seule¦La chaleur favorise des réactions entre sucres réducteurs et composés aminés. Le brunissement ne résulte pas uniquement d'une caramélisation.
`);
add('baker','Boulanger',4,S.volume,`
Une pâte produit du gaz mais s'étale et retient mal les bulles. Quel aspect faut-il examiner en plus de la fermentation ?¦La tenue de sa structure viscoélastique¦La seule quantité de ferment incorporée¦La seule durée du ressuage après cuisson¦La seule profondeur des grignes à venir¦La levée nécessite à la fois du gaz et une structure capable de le retenir. Ajouter du ferment ne corrige pas automatiquement un défaut de tenue.
`);
add('gardener','Jardinier paysagiste',1,S.gardener,`
Quelle mission relève du jardinier paysagiste ?¦Aménager et entretenir des espaces verts¦Fabriquer uniquement des engrais en usine¦Réparer les moteurs d'avion¦Réaliser uniquement des cartes routières¦Le jardinier paysagiste intervient notamment sur plantations, massifs, pelouses et aménagements. Il adapte son travail au lieu et aux végétaux.
Quel outil manuel sert à couper de petites branches ?¦Un sécateur¦Un râteau¦Une bêche¦Un arrosoir¦Le sécateur réalise des coupes adaptées à son diamètre de travail. Une branche plus importante demande un outil et une méthode appropriés.
Quel outil rassemble facilement des feuilles au sol ?¦Un râteau à feuilles¦Un plantoir¦Un cordeau¦Un sécateur¦Les dents du râteau à feuilles permettent de regrouper les débris légers. L'outil se choisit selon la surface et le travail prévu.
À quoi sert un arrosoir ?¦À apporter de l'eau aux végétaux¦À mesurer l'acidité d'un sol¦À tailler une haie¦À affûter les outils¦L'arrosoir permet un apport localisé. La quantité d'eau doit correspondre aux besoins et à l'état du sol.
Que signifie « semer » ?¦Mettre des graines en place pour les faire germer¦Couper toutes les racines¦Ramasser les fruits mûrs¦Tondre une pelouse¦Le semis installe des graines dans des conditions favorables à leur germination. Il se distingue de la plantation d'un végétal déjà développé.
Comment nomme-t-on un ensemble de plantes disposées dans une zone de jardin ?¦Un massif¦Une motte¦Un tuteur¦Un godet¦Un massif associe des végétaux sur un espace défini. Sa composition tient compte de leur taille, de leur développement et de leurs besoins.
Quel outil permet de transporter terre et végétaux sur un petit chantier ?¦Une brouette¦Une cisaille¦Un cordeau¦Un plantoir¦La brouette transporte une charge en limitant le port manuel. Son utilisation doit rester adaptée au terrain et au poids transporté.
Avant de choisir des plantes pour un massif, que faut-il observer ?¦L'ensoleillement et les caractéristiques du sol¦Seulement la couleur des pots¦Seulement le nom du fournisseur¦Uniquement la longueur du tuyau¦Lumière, sol et climat conditionnent la réussite des végétaux. Le choix des plantes doit précéder la seule recherche d'un effet décoratif.
Qu'appelle-t-on une plante vivace ?¦Une plante qui peut vivre plusieurs années¦Une plante qui fleurit obligatoirement toute l'année¦Une plante sans racines¦Une plante qui ne demande jamais d'eau¦Une vivace persiste plusieurs années. Certaines perdent leurs parties aériennes en hiver puis repartent depuis leurs organes souterrains.
À quoi sert un tuteur adapté à une jeune plantation ?¦À apporter un soutien temporaire¦À remplacer son système racinaire¦À nourrir directement ses feuilles¦À empêcher définitivement toute croissance¦Le tuteurage répond à un besoin de stabilité. Les attaches doivent être adaptées et surveillées pendant la croissance.
`);
add('gardener','Jardinier paysagiste',2,S.water,`
Quel effet un paillage adapté peut-il avoir sur le sol ?¦Limiter l'évaporation de l'eau¦Supprimer pour toujours tout besoin d'arrosage¦Transformer le sable en argile¦Rendre toutes les plantes résistantes au gel¦Le paillage protège la surface et aide à conserver l'humidité. Son intérêt dépend du matériau, de l'épaisseur et du contexte.
Pourquoi regrouper des plantes aux besoins en eau proches dans un aménagement ?¦Pour adapter plus facilement l'arrosage à chaque zone¦Pour leur imposer toutes une croissance identique¦Pour supprimer l'effet du climat¦Pour garantir une floraison simultanée¦Des zones cohérentes évitent de traiter de la même manière des plantes très sobres et d'autres plus exigeantes en eau.
`);
add('gardener','Jardinier paysagiste',2,S.planting,`
Chez un jeune arbre, où se situe le collet ?¦À la transition entre les racines et la partie aérienne¦À l'extrémité de chaque feuille¦Au sommet des fleurs¦Au centre du fruit¦Le collet est un repère important à la plantation. L'enfouir excessivement peut compromettre le bon développement du végétal.
Qu'est-ce qu'une motte de plantation ?¦Le volume de terre tenu autour des racines¦Une couche de peinture sur l'écorce¦Un tas de graines sans substrat¦Une branche coupée en morceaux¦La motte conserve une partie de l'environnement racinaire. Sa manipulation doit éviter d'endommager les racines qu'elle contient.
Pourquoi surveiller les attaches d'un arbre tuteuré au fil du temps ?¦Pour éviter qu'elles n'étranglent son tronc¦Pour qu'elles entrent profondément dans l'écorce¦Pour arrêter sa croissance en diamètre¦Pour supprimer ses racines superficielles¦Le tronc grossit et les attaches vieillissent. Une surveillance permet d'adapter ou retirer le soutien lorsqu'il n'est plus nécessaire.
`);
add('gardener','Jardinier paysagiste',2,S.garden,`
Que désigne une plante à feuillage caduc ?¦Une plante qui perd ses feuilles pendant une saison¦Une plante qui garde chaque feuille toute sa vie¦Une plante incapable de fleurir¦Une plante sans période de repos¦Le feuillage caduc est renouvelé après une période où la plante est défeuillée. Cela peut modifier l'ombre et l'aspect d'un aménagement selon la saison.
Quel matériau peut alimenter un compost de jardin ?¦Des déchets végétaux adaptés et variés¦Des débris de verre¦Des piles usagées¦Des morceaux de plastique¦Le compostage transforme de la matière organique grâce à des organismes vivants. Les déchets non organiques cités doivent suivre d'autres filières.
Pourquoi vérifier la présence d'un nid occupé avant un entretien de haie ?¦Pour éviter de déranger ou détruire une nichée¦Pour déterminer la couleur des feuilles¦Pour calculer le pH du sol¦Pour choisir automatiquement une taille plus sévère¦Une haie peut abriter des oiseaux et d'autres animaux. L'observation préalable aide à adapter ou reporter l'intervention.
`);
add('gardener','Jardinier paysagiste',2,S.soil,`
Que renseigne le pH d'un sol ?¦Son caractère acide, neutre ou basique¦Sa profondeur exacte¦Son pourcentage de cailloux à lui seul¦Le nombre de vers de terre présents¦Le pH décrit un aspect chimique du sol. Il influence notamment la disponibilité de certains éléments nutritifs pour les plantes.
`);
add('gardener','Jardinier paysagiste',2,S.hedge,`
Pourquoi une haie comprenant plusieurs espèces adaptées peut-elle être intéressante ?¦Elle diversifie les habitats et les ressources pour la faune¦Elle empêche toutes les maladies sans exception¦Elle supprime tout besoin d'entretien¦Elle garantit la même floraison toute l'année¦La diversité des végétaux peut étaler les ressources et offrir différents abris. Les espèces doivent aussi convenir au site.
`);
add('gardener','Jardinier paysagiste',3,S.soil,`
Quelle distinction fait-on entre texture et structure d'un sol ?¦La texture décrit les particules, la structure leur organisation¦La texture est la couleur, la structure le pH¦La texture ne concerne que les racines, la structure les feuilles¦Ces deux mots désignent exactement la même propriété¦Sable, limon et argile définissent la texture. Leur assemblage en agrégats et les vides entre eux participent à la structure.
Pourquoi une analyse du sol est-elle utile avant un apport correctif important ?¦Pour identifier les caractéristiques à corriger réellement¦Pour garantir une dose identique dans tous les jardins¦Pour remplacer l'observation des végétaux à vie¦Pour supprimer l'influence de l'arrosage¦Un apport doit répondre à un besoin établi. La composition, le pH et l'état du sol orientent le choix et évitent des corrections inutiles.
`);
add('gardener','Jardinier paysagiste',3,S.compaction,`
Quelle conséquence un sol fortement compacté peut-il avoir sur les végétaux ?¦Freiner l'enracinement et les circulations d'air et d'eau¦Multiplier automatiquement toutes les racines¦Augmenter toujours l'aération¦Rendre la plante indépendante de l'eau¦Le tassement réduit certains espaces du sol et peut créer une barrière physique. Les racines et les échanges s'en trouvent limités.
Pourquoi la dureté d'un sol très sec ne suffit-elle pas à prouver sa compaction ?¦L'humidité modifie sa résistance à la pénétration¦Un sol sec ne contient jamais de racines¦Tout sol dur est toujours sableux¦Le pH se lit directement dans sa dureté¦Pour interpréter la résistance du sol, il faut tenir compte de son humidité. L'observation de ses couches et des racines complète le diagnostic.
`);
add('gardener','Jardinier paysagiste',3,S.garden,`
Pourquoi connaître l'époque de floraison d'un arbuste avant de programmer sa taille ?¦Une taille mal placée peut enlever les futurs boutons floraux¦Toutes les fleurs apparaissent seulement sur des racines¦La taille détermine toujours la couleur de la fleur¦La saison n'a aucun lien avec les boutons¦Selon l'espèce, les boutons se forment sur des pousses d'âges différents. Le calendrier doit respecter cette biologie et les autres contraintes du site.
Quelle est la différence entre un amendement et un engrais, dans leur objectif principal ?¦L'amendement améliore le sol, l'engrais apporte des éléments nutritifs¦L'amendement taille les racines, l'engrais taille les feuilles¦L'engrais sert uniquement à retenir les oiseaux¦Les deux sont obligatoirement des produits liquides¦Les fonctions peuvent se recouper pour certains produits organiques. La distinction porte sur l'objectif recherché, pas simplement sur leur apparence.
Que permet le bouturage de nombreux végétaux ?¦Produire une nouvelle plante à partir d'un fragment de plante¦Obtenir obligatoirement un nouveau croisement génétique¦Transformer une graine en engrais¦Supprimer tous les risques sanitaires¦Le bouturage est une multiplication végétative. Il conserve généralement les caractéristiques génétiques du végétal dont provient la bouture.
`);
add('gardener','Jardinier paysagiste',3,S.water,`
Un goutteur débite 2 litres par heure. Combien apporte-t-il en 45 minutes, si le débit reste constant ?¦1,5 litre¦0,75 litre¦2,5 litres¦90 litres¦Quarante-cinq minutes représentent trois quarts d'heure. Le volume fourni vaut donc 2 × 0,75 = 1,5 litre.
Pourquoi un calendrier d'arrosage fixe toute l'année peut-il gaspiller de l'eau ?¦La météo et les besoins des plantes changent¦Tous les sols perdent la même quantité d'eau chaque jour¦La pluie n'atteint jamais les massifs¦Les plantes cessent de vivre en été¦La pluie, la chaleur, le vent et le développement des végétaux modifient les besoins. Le suivi du sol aide à ajuster les apports.
`);
add('gardener','Jardinier paysagiste',3,S.hedge,`
Quel choix favorise une continuité de nourriture pour certains insectes dans une haie ?¦Associer des floraisons échelonnées dans la saison¦Choisir seulement une floraison de quelques jours¦Retirer toutes les fleurs dès leur apparition¦Ne conserver que des plantes artificielles¦Des floraisons successives étalent la disponibilité de nectar et de pollen. Leur intérêt dépend aussi des espèces accueillies et du contexte.
`);
add('gardener','Jardinier paysagiste',4,S.water,`
Quelle quantité de paillage faut-il pour couvrir 24 m² sur 5 cm d'épaisseur, sans tassement ni pertes ?¦1,2 m³¦0,12 m³¦4,8 m³¦120 m³¦On convertit 5 cm en 0,05 m, puis on multiplie la surface par l'épaisseur : 24 × 0,05 = 1,2 m³.
Une pluie de 10 mm tombe uniformément sur un massif de 30 m². Quel volume d'eau cela représente-t-il avant ruissellement et infiltration ?¦300 litres¦30 litres¦3 litres¦3 000 litres¦Un millimètre sur un mètre carré correspond à un litre. Dix millimètres sur trente mètres carrés représentent donc 300 litres.
Un réseau comporte 20 goutteurs de 2 litres par heure chacun. Quel est son débit total théorique ?¦40 litres par heure¦10 litres par heure¦22 litres par heure¦400 litres par heure¦Les débits des goutteurs s'additionnent : 20 × 2 = 40 litres par heure. Le débit réel dépend du bon fonctionnement du réseau.
`);
add('gardener','Jardinier paysagiste',4,S.garden,`
Sur un plan à l'échelle 1:100, une allée mesure 8 cm. Quelle longueur représente-t-elle sur le terrain ?¦8 mètres¦80 centimètres¦80 mètres¦0,8 mètre¦Chaque centimètre du plan représente 100 cm, soit un mètre. Huit centimètres représentent donc huit mètres.
Un massif doit accueillir une plante tous les 50 cm sur une ligne de 4 m, avec une plante à chaque extrémité. Combien faut-il de plantes ?¦9¦8¦7¦10¦La ligne contient huit intervalles de 0,50 m. Avec une plante à chaque extrémité, le nombre de plantes est supérieur d'une unité au nombre d'intervalles.
Une plante jaunit dans un sol constamment détrempé. Pourquoi ajouter un engrais sans diagnostic est-il insuffisant ?¦Une difficulté racinaire peut limiter l'absorption¦Toute feuille jaune prouve un manque d'azote¦L'engrais supprime à lui seul l'excès d'eau¦Les racines n'influencent pas la couleur des feuilles¦Le jaunissement a plusieurs causes possibles. Un excès d'eau peut perturber les racines ; il faut observer le contexte avant de choisir une correction.
Pourquoi choisir un arbre en fonction de sa taille adulte plutôt que de sa seule taille à l'achat ?¦Pour anticiper son espace de développement¦Pour prévoir exactement l'année de sa mort¦Pour rendre inutile tout suivi de sa croissance¦Pour déduire automatiquement la profondeur de toutes ses racines¦L'arbre développe couronne et racines au fil des années. Un espace adapté réduit les conflits avec bâtiments, usages et autres plantations.
`);
add('gardener','Jardinier paysagiste',4,S.soil,`
Un sol contient du fer, mais une plante sensible présente une chlorose sur terrain très calcaire. Quelle explication est plausible ?¦Le contexte chimique rend le fer peu disponible¦Le fer total est nécessairement absorbé en totalité¦La présence de calcaire prouve une carence en eau¦La chlorose indique toujours un excès de lumière¦La quantité totale d'un élément ne dit pas toute sa disponibilité. Le pH et les caractéristiques du sol peuvent limiter son absorption ; le diagnostic doit être confirmé.
`);
add('gardener','Jardinier paysagiste',4,S.compaction,`
Des racines s'étalent au-dessus d'une couche dense et la traversent peu. Quel diagnostic doit être envisagé ?¦Un horizon limitant l'enracinement¦Une ramification forcément normale sans contrainte¦Une carence foliaire déduite du seul tracé des racines¦Un excès d'azote confirmé sans analyse¦La forme des racines renseigne sur les obstacles rencontrés. Il faut examiner la couche et son contexte pour distinguer contrainte physique et autres causes.
`);
add('gardener','Jardinier paysagiste',4,S.hedge,`
La présence d'auxiliaires dans une haie prouve-t-elle à elle seule que tous les ravageurs du jardin seront contrôlés ?¦Non, l'effet dépend des espèces et du fonctionnement du milieu¦Oui, toute haie supprime automatiquement tous les ravageurs¦Oui, dès qu'un insecte est observé¦Non, car aucun auxiliaire ne consomme de ravageurs¦Une haie peut fournir abris et ressources sans garantir un résultat identique partout. Le suivi des populations complète l'aménagement écologique.
`);
export default questions;
