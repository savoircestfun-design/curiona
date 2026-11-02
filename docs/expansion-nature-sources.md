# Extension animaux, nature et vie quotidienne

Cette extension contient 504 questions originales : 152 pour **Monde animal**, 152 pour **Nature & jardin** et 200 pour **Vie quotidienne**. Les 48 questions initiales des deux premiers univers restent dans leur banque d’origine. Chaque univers atteint ainsi 200 questions après assemblage.

Les identifiants `exp-an-`, `exp-na-` et `exp-da-` sont explicites et stables. La banque ajoute 71 questions vrai/faux et 433 QCM. Les propositions des QCM avancés et experts ont été relues pour remplacer les réponses manifestement absurdes par des confusions entre concepts voisins.

## Portée de la vérification

Les questions et explications sont rédigées pour le jeu, sans reproduction de passages des sources. Les références ci-dessous documentent des vérifications ciblées et les principaux points délicats. Il ne s’agit pas d’une validation externe exhaustive des 504 questions. Les connaissances générales ont fait l’objet d’une relecture éditoriale, complétée par ces consultations institutionnelles et scientifiques.

Consultations effectuées le 2 novembre 2026. Les données de prix, les performances chiffrées variables, les conseils médicaux et les recommandations de sécurité alimentaire ne sont pas utilisés.

## Références consultées

| Source | Vérification et utilisation |
| --- | --- |
| [MNHN — Qu’est-ce qu’un insecte ?](https://www.mnhn.fr/fr/qu-est-ce-qu-un-insecte) | Organisation générale, cuticule, segmentation et diversité des insectes. La page ne sert pas de référence aux distinctions fines entre types de métamorphose. |
| [MNHN — Comment les insectes ont conquis la Terre](https://www.mnhn.fr/fr/comment-les-insectes-ont-conquis-la-terre) | Contexte évolutif, vol et rôles écologiques des insectes. |
| [Lachmann, Szamado et Bergstrom, 2001 — Cost and conflict in animal signals and human language](https://pubmed.ncbi.nlm.nih.gov/11687618/) | `exp-an-fa-029` : un coût élevé de production n’est pas une condition universelle de l’honnêteté d’un signal. L’explication mentionne notamment les contraintes physiques. |
| [Randolph Nesse — Tinbergen’s Four Questions](https://websites.umich.edu/~nesse/Articles/Nesse-Tinbergen%27s%204%20Q-EMPH-2018%20.pdf) | `exp-an-fa-031` : les explications proximales comprennent **mécanisme et ontogenèse**. Le QCM propose un exemple de mécanisme et des distracteurs relevant de la fonction adaptative ou de l’histoire évolutive. |
| [INRAE — Mieux comprendre comment les plantes et les champignons communiquent](https://www.inrae.fr/actualites/mieux-comprendre-comment-plantes-champignons-communiquent) | `exp-na-so-029`, mycorhizes et échanges : arbuscules formés dans des cellules racinaires, apport de nutriments par le champignon et composés carbonés fournis par la plante. Référence également utile pour distinguer les nodosités à rhizobia. |
| [MNHN — Comment et depuis quand fabrique-t-on du pain ?](https://www.mnhn.fr/fr/comment-et-depuis-quand-fabrique-t-on-du-pain) | Farine, hydratation, fermentation et rôle de la structure de la pâte dans la rétention des gaz. |
| [INRAE — Biodiversité des levains et pains de qualité](https://www.inrae.fr/actualites/biodiversite-levains-pains-qualite) | Association de microorganismes dans les levains ; distinction avec une culture de levure boulangère seule. |
| [IUPAC Gold Book — Shear thinning, PDF](https://goldbook.iupac.org/terms/view/S05640/pdf) | `exp-da-cu-047` : diminution de viscosité apparente avec la vitesse de cisaillement. Le contexte précise l’absence de dépendance temporelle, afin de ne pas confondre rhéofluidification et thixotropie. La notice historique et son PDF ont été consultés ; la page HTML actuelle a renvoyé un accès refusé lors d’une ouverture. |
| [TWI — Galvanic corrosion](https://www.twi-global.com/technical-knowledge/faqs/faq-what-is-galvanic-corrosion-and-how-can-it-be-avoided) | `exp-da-ob-044` : couplage électrique de métaux différents dans un électrolyte, accélération de l’attaque du membre anodique. Distinction avec abrasion et passivation. |
| [BIPM — Unités de base du SI](https://www.bipm.org/en/measurement-units/si-base-units) | Distinction entre grandeurs et unités ; définitions du SI et réalisation pratique. Les graphies `l` et `L` du litre ne sont pas utilisées comme distracteurs concurrents. |
| [JCGM/BIPM — VIM, traçabilité métrologique 2.41](https://jcgm.bipm.org/vim/en/2.41.html) | `exp-da-me-038` : chaîne documentée d’étalonnages et référence ; la traçabilité ne garantit ni une incertitude nulle ni une adéquation universelle à l’usage. |
| [JCGM/BIPM — Index annoté du VIM](https://jcgm.bipm.org/vim/en/annoindex.html) | `exp-da-me-025` et `exp-da-me-046` : distinction entre justesse, fidélité, exactitude et biais. |
| [ADEME — Consommation des appareils ménagers](https://agirpourlatransition.ademe.fr/particuliers/economiser/energie/consommation-appareils-menagers) | Dépendance de la consommation aux durées et conditions d’usage ; aucune estimation de coût ou consommation annuelle spécifique n’est reprise. |
| [ADEME — Performance des pompes à chaleur air/eau](https://infos.ademe.fr/energies/2025/comment-maximiser-la-performance-de-votre-pompe-a-chaleur-air-eau/) | `exp-da-en-038` et performance saisonnière : influence des températures et du fonctionnement réel. Pas de COP universel ni de promesse de gain chiffré. |

## Contrôles structurels réalisés

- 504 identifiants et 504 énoncés normalisés distincts dans l’extension.
- Chaque QCM a quatre choix distincts et une seule réponse marquée correcte ; chaque vrai/faux a deux choix.
- Toutes les explications comportent au moins 70 caractères.
- Ajouts animaux et nature : 38 questions par niveau pour chaque univers, à combiner aux 12 initiales par niveau.
- Vie quotidienne : 50 questions par niveau et 50 par sous-thème. Matrices par sous-thème : Cuisine `[13,13,12,12]`, Objets et matériaux `[12,13,13,12]`, Mesures pratiques `[12,12,13,13]`, Énergie au quotidien `[13,12,12,13]`.
- Import JavaScript contrôlé avec Node. Les contrôles d’assemblage et d’interface relèvent du projet principal.
