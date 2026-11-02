# Textes de la version en ligne

Relecture du 2 novembre 2026, pour une publication du jeu statique sur GitHub Pages.

## Formulations retenues

- Le jeu est gratuit, sans compte et sans installation.
- Les progrès, les réponses, les fiches gardées et les réglages audio sont enregistrés **dans ce navigateur**. Cette formulation est plus précise que « sur cet appareil » : deux profils de navigateur ont des carnets différents.
- La synchronisation entre appareils n’est pas automatique. L’export et l’import de la sauvegarde JSON servent à transférer ou conserver le carnet.
- Deux personnes qui utilisent le même profil de navigateur partagent le même carnet.
- La version en ligne demande une connexion pour charger le site. Elle n’est pas présentée comme une application installée disponible hors connexion : aucun service worker ne garantit ce comportement.
- La version ouverte depuis le dossier complet du jeu conserve son fonctionnement sans réseau. Sa sauvegarde est distincte de celle du site publié ; l’export/import permet de passer de l’une à l’autre.

## Textes corrigés

| Emplacement | Ancien texte | Nouveau texte |
| --- | --- | --- |
| Panneau de volume | Un fond discret, à ton goût. Ce réglage est mémorisé. | Le volume est enregistré dans ce navigateur. |
| Bas de Mes fiches | Tes fiches sont sauvegardées sur cet appareil et incluses dans l’export du carnet. | Tes fiches sont enregistrées dans ce navigateur et incluses dans l’export de ta sauvegarde. |
| Description du site | Un jeu éducatif gratuit et hors ligne. | Un jeu éducatif gratuit, sans compte, avec une progression personnelle. |
| JavaScript désactivé | Active JavaScript dans Chrome… Aucune connexion n’est nécessaire. | Active JavaScript dans ton navigateur pour jouer à Curiona. |
| Bandeau d’accueil | Sans compte · 100 % hors ligne | Sans compte · Sans installation |
| Pied de page | Ton carnet reste sur cet appareil | Progression dans ce navigateur |

Dans l’aide, l’ancien paragraphe centré sur le raccourci Windows est remplacé par une explication du carnet dans le navigateur, du transfert entre appareils et du besoin de connexion au chargement du site. Les consignes de la version locale restent dans le README.

## Contrôle de cohérence

Le code lit et écrit le carnet sous la clé `curiona.save.v1` de `localStorage`. Il ne transmet pas les sauvegardes au dépôt GitHub. La documentation publique distingue l’accès en ligne du lancement par fichier et ne promet pas une conservation en navigation privée ou après effacement des données du site.

Le README présente les ressources du jeu et la publication statique sans références à d’autres jeux ou à l’ordinateur de développement. Le lien du jeu est ajouté après confirmation de sa publication.

Les pages de questions et les banques pédagogiques ne sont pas modifiées par cette relecture.
