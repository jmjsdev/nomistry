
# Prompt d’application : Générateur de noms avec

Nom de l'application : Nomistry

# vérification de disponibilité

## Description générale de l’application

Cette application web propose de générer des noms de projet ou de marque à partir d’une **description
fournie par l’utilisateur** , puis d’en vérifier la disponibilité sur diverses plateformes. L’interface sera
**conviviale, intuitive et interactive** , développée en React/Next.js pour une expérience fluide. L’objectif
est de guider l’utilisateur depuis la génération de noms créatifs jusqu’à la vérification détaillée de leur
disponibilité, le tout en quelques clics.

**Fonctionnement de base :** L’utilisateur saisit une description textuelle de son projet (par exemple le
concept, les valeurs ou l’activité de l’entreprise). Sur cette base, l’application utilise un modèle
**d’intelligence artificielle générative** pour proposer une liste de noms originaux correspondant à la
description. L’utilisateur pourra affiner la génération à l’aide d’options de personnalisation
(détaillées ci-dessous) afin d’obtenir des suggestions de noms pertinentes.

## Options de génération de noms

Pour que les noms proposés correspondent exactement aux attentes, l’application offre plusieurs
**paramètres de personnalisation**  :

```
Longueur du nom  : possibilité de choisir une longueur courte, moyenne ou longue du nom
généré (par exemple, 5-8 caractères, 9-12, ou plus).
Style du nom  : sélection du style souhaité (moderne, classique, fantaisie, professionnel, etc.).
Par exemple, un style moderne privilégiera des noms accrocheurs et innovants, tandis qu’un style
classique pourra proposer des noms plus traditionnels ou sobres. Exemple : l’outil Musely permet
de « choisir un style de nom comme Moderne ou Classique, et spécifier éventuellement la longueur du
nom » , illustrant ce type de personnalisation.
Thème  : choix d’un thème ou domaine sémantique associé au projet (technologie, nature,
aventure, finance, etc.). Ce thème orientera l’IA dans le choix des mots ou sonorités utilisés dans
les suggestions de noms, pour mieux coller à l’esprit du secteur.
```
En combinant ces options (longueur + style + thème), l’utilisateur pourra guider l’algorithme de
génération afin d’obtenir une liste de noms **sur mesure** alignés sur sa vision. _(Par exemple, un nom
“moderne” sur le thème de la technologie pourra donner des résultats comme des mots-valises innovants,
alors qu’un nom “fantaisie” sur le thème aventure proposera des sonorités imaginatives.)_

## Interface utilisateur et expérience conviviale

L’interface est pensée pour être simple et agréable à utiliser. Elle comportera **plusieurs sections
principales**  :

```
Formulaire de saisie  : En page d’accueil, l’utilisateur découvre un champ de texte pour décrire
son projet ou concept. Juste en dessous, les différentes options (longueur, style, thème)
```
### 1 • • 2 • •


```
apparaissent sous forme de menus déroulants ou de boutons radio clairement libellés.
L’utilisateur remplit la description et choisit les paramètres désirés, puis clique sur un bouton
“Générer des noms”.
Génération des noms  : Après soumission, l’application appelle le moteur d’IA pour produire une
série de noms candidats (par exemple, une dizaine de propositions). Ces noms sont affichés
sous forme de liste à l’écran, de façon bien lisible. Chaque proposition peut être présentée dans
une carte ou un encadré, avec éventuellement un petit bouton favori ♡ pour marquer celles que
l’utilisateur préfère. L’algorithme d’IA étant entraîné pour le naming , il fournit des suggestions
cohérentes par rapport à la description fournie. L’utilisateur peut ainsi faire un premier tri
visuel.
Sélection des noms favoris  : L’interface permet à l’utilisateur de sélectionner les noms qu’il
souhaite approfondir. Concrètement, chaque nom proposé est accompagné d’une case à cocher
ou d’un bouton de sélection. L’utilisateur coche un ou plusieurs noms qui lui plaisent le plus. Il
peut aussi éventuellement éditer légèrement un nom dans la liste pour le personnaliser avant
vérification (par exemple, corriger une orthographe ou combiner deux suggestions). Une fois sa
sélection faite, il clique sur “Vérifier la disponibilité” pour lancer l’analyse.
```
L’UI met l’accent sur la **convivialité** : design épuré, indications claires à chaque étape, et feedback
utilisateur (par ex. messages de chargement pendant la génération de noms, surlignement des champs
requis, etc.). L’approche est de **guider l’utilisateur pas à pas** , depuis l’idée initiale jusqu’au choix final
du nom validé.

## Vérification de la disponibilité sur multiples plateformes

Après la sélection des noms favoris, l’application procède à une **vérification exhaustive de la
disponibilité** de chacun de ces noms, sur plusieurs catégories de plateformes :

```
Noms de domaine  : L’application vérifie si les noms de domaine correspondants sont libres, en
ciblant les extensions les plus courantes (TLD) comme .com , .fr , .net , .io , etc. Pour ce faire, elle
interroge des APIs de registrars ou services whois. Par exemple, l’utilisateur « orignal.fr » sera
recherché auprès de registraires comme OVH, Afnic ou GoDaddy qui offrent un accès rapide aux
extensions standard (.fr, .com, .net). L’application pourra afficher pour chaque nom la
disponibilité sur divers TLD (exemple : NomChoisi.com – Disponible / NomChoisi.fr – Déjà
pris ). En cas d’indisponibilité d’un domaine de base, l’application peut suggérer des
alternatives (ajout d’un mot, d’un tiret ou usage d’une autre extension) comme le font certains
services. L’idée est de s’assurer qu’un nom retenu puisse avoir un domaine web adéquat.
Marques déposées (trademarks)  : L’application vérifie que le nom ne soit pas déjà protégé en
tant que marque commerciale. Elle interroge pour cela les bases de données officielles de dépôt
de marque : par exemple la base de l’ INPI pour la France, ou ses équivalents internationaux
(USPTO aux USA, EUIPO en Europe, base OMPI/WIPO, etc.). Certains outils en ligne comme
KnowEm intègrent ainsi une vérification dans les registres officiels, telle que la base USPTO des
marques déposées. De même, notre application pourra utiliser les API publiques lorsqu’elles
existent : par exemple, l’API de recherche de marques de l’INPI (ou du moins la base data.inpi )
pour savoir si le nom est déjà enregistré en France. Pour chaque nom sélectionné, le résultat
indiquera si une marque identique ou proche existe déjà dans les classes d’activité pertinentes.
Si une marque est trouvée, l’application alertera l’utilisateur (ex : "NomChoisi™ est déjà déposé,
n°123456 INPI" ), sinon elle confirmera la voie libre.
Réseaux sociaux  : L’application contrôle la disponibilité du nom en tant que pseudonyme ou
identifiant sur les réseaux sociaux majeurs  : Facebook, Twitter (X), Instagram, LinkedIn,
YouTube, etc. Concrètement, elle vérifie si le handle ou l’URL associée au nom est libre (par ex.
facebook.com/NomChoisi ). Des services comme KnowEm ou Namechk permettent déjà de vérifier
```
### • 1 • • 3 3 • 4 5 •


```
qu’un nom n’est pas utilisé sur de très nombreux réseaux sociaux et plateformes en quelques secondes
```
_._ Notre application se concentrera sur les plateformes les plus pertinentes par défaut (celles
citées ci-dessus), avec éventuellement la possibilité d’étendre la recherche à d’autres réseaux
selon le **thème choisi**. Par exemple, si le thème est “jeu vidéo”, on pourra inclure des
plateformes comme Steam, Twitch ou Discord dans la vérification. Si le thème est
“professionnel”, on privilégiera des réseaux comme LinkedIn ou des sites de portfolio. Le résultat
pour chaque nom indiquera, réseau par réseau, **“Disponible”** ou **“Pris”**.
**Stores d’applications mobiles**  : L’application va également vérifier si un nom est déjà utilisé par
une application publiée sur les principaux **App Stores** mobiles : **Apple App Store** (iOS) et **Google
Play Store** (Android). Elle effectuera une recherche sur ces plateformes pour voir si une
application porte le nom sélectionné. _Par exemple, l’outil NameRobot App Name Check recherche le
nom dans tous les app stores connus (Google Play, iTunes/App Store, Microsoft Store, Amazon
Appstore, Firefox add-ons, etc.) afin de signaler d’éventuelles collisions._ De même, notre
application indiquera pour chaque nom s’il existe déjà une app mobile du même nom (ce qui
pourrait poser problème en termes de **conflit de nom** ou de référencement). Cela permet aux
utilisateurs voulant lancer une application ou un produit numérique d’éviter les doublons sur les
stores.
**Autres plateformes pertinentes**  : En fonction du cas d’usage ou du secteur (thème) renseigné,
l’application peut étendre la vérification à d’autres plateformes spécifiques. Par exemple :
vérification du nom en tant que **nom de société** (registre du commerce), en tant que **nom de
package logiciel** (si le projet est un logiciel, on pourrait vérifier des dépôts comme npm, PyPI,
etc.), ou encore sur des **forums/domaines communautaires** liés au thème (par ex. un nom de
projet de jeu sur des sites de gaming). Cette section est adaptable : le but est de couvrir tous les
espaces où le nom choisi pourrait avoir besoin d’être unique.

La vérification multi-plateformes est un **temps fort de l’application** , car elle garantit à l’utilisateur
qu’un nom “coup de cœur” est non seulement percutant, mais aussi **juridiquement et
numériquement disponible** pour son usage futur. _Comme le rappelle un guide de naming, une
vérification de disponibilité à 360° (marque, domaine, réseaux sociaux) est devenue impérative avant
d’adopter un nom, à l’ère du web 2.0 et des réseaux sociaux omniprésents._ Notre application intègre
donc ces contrôles de manière transparente pour l’utilisateur.

## Présentation des résultats et rapport détaillé

Une fois les vérifications effectuées, l’application génère un **rapport détaillé** pour chaque nom
sélectionné :

```
Tableau de synthèse par nom  : Pour chaque nom favori de l’utilisateur, un tableau ou une fiche
récapitulative liste les catégories de vérification (domaine, marque, chaque réseau social, App
Stores, etc.) avec le statut correspondant. Par exemple :
```
```
Nom de domaine (.com, .fr,
etc.)
```
```
Marque
déposée
Facebook Twitter Instagram
```
```
App
Store
iOS
```
### ...

```
nomchoisi.com –
Libre<br>nomchoisi.fr –
Pris (chez OVH)
```
```
Disponible
(aucune
marque
trouvée)
```
```
Libre Pris Libre Libre ...
```
### 6 • 7 • 8 •


Dans cet exemple fictif, on voit que _nomchoisi.fr_ était déjà pris, tandis que _nomchoisi.com_ est libre.
Aucune marque déposée n’existe, et le nom est libre sur la plupart des réseaux sauf Twitter. Ce format
permet d’un coup d’œil de connaître la situation.

```
Indicateurs visuels  : Le rapport utilise des codes couleurs ou icônes ( vert pour disponible,
rouge pour indisponible) afin que l’information soit très rapidement compréhensible. Chaque
ligne ou case du tableau peut comporter en plus une petite info-bulle ou un lien “détails” pour
en savoir plus (par ex. si un nom de domaine est pris, indiquer par qui ou depuis quand si
disponible publiquement ; si une marque existe, indiquer le déposant et la classe, etc.).
```
```
Liens d’action directs  : L’application ne se contente pas de signaler la disponibilité, elle facilite
les prochaines étapes. Pour chaque item disponible, un lien ou bouton “Obtenir” est proposé :
```
```
Pour un domaine libre, un clic pourrait rediriger vers le site du registrar partenaire ou un outil
d’enregistrement pour acheter le domaine en question ( c’est d’ailleurs ce qui est recommandé :
“Réserver le meilleur nom de domaine disponible sans délai” dès qu’on en trouve un libre ).
Pour un pseudonyme de réseau social libre, un bouton pourrait ouvrir la page d’inscription du
réseau en pré-remplissant le nom choisi (quand c’est possible via l’URL) ou simplement copier le
nom pour que l’utilisateur crée manuellement le compte.
Pour une marque disponible, un lien peut mener vers la page officielle de dépôt (par ex. le
portail e-marque de l’INPI, ou le formulaire de dépôt international si pertinent) afin que
l’utilisateur entame les démarches s’il souhaite protéger ce nom.
```
```
Pour les App Stores, si le nom n’existe pas, on ne peut pas “réserver” un nom d’application sans
publier, mais l’application pourrait fournir un lien vers les guidelines pour réserver un nom de
bundle/app ou inciter à créer le brouillon de l’application sur la console développeur. Si le nom
est déjà pris par une app, un lien vers la fiche de l’app existante pourrait être fourni pour
information.
```
```
Export du rapport : L’utilisateur aura la possibilité de télécharger le rapport complet (par
exemple en PDF ou CSV) pour le conserver. Ainsi, il peut le partager avec son équipe ou le
consulter ultérieurement. Ce rapport contiendra la liste des noms vérifiés et toutes les
informations de disponibilité et liens associés.
```
## Stack technique et considérations d’implémentation

_(Note : éléments techniques pour contextualiser le prompt)_ L’application sera développée en **React** avec le
framework **Next.js** , ce qui permettra de combiner une interface réactive côté client et des API routes
côté serveur pour interagir avec les services externes. Le moteur de génération de noms pourra
s’appuyer sur une API d’IA (par exemple l’API d’OpenAI, Claude ou autre) pour transformer la description
utilisateur en propositions de noms créatifs. Les vérifications de disponibilité feront appel à divers
services : API de registrars/domaines pour les whois, API publiques des offices de propriété
intellectuelle (ex : Data INPI, USPTO via leur base TESS, API de l’EUIPO, ou **WIPO Global Brand
Database** couvrant 55+ pays ) pour les marques, et éventuellement des appels HTTP aux pages de
profil des réseaux sociaux ou à des API tierces (certaines bibliothèques ou services comme _NameCheckr_
peuvent centraliser ces vérifications). Pour les App Stores, des **API de recherche** (comme l’iTunes
Search API d’Apple, ou une requête HTTP sur le Play Store via leur search) seront utilisées.

Une attention particulière sera portée aux **performances** (la vérification multi-plateforme pouvant être
longue si faite naïvement). L’application pourra paralléliser les requêtes de disponibilité et afficher des

### • • • 9 • • • • 1

```
10
```

indicateurs de chargement par catégorie. L’objectif est que l’utilisateur obtienne son rapport complet en
un minimum de temps, tout en maintenant la fiabilité des informations.

**Résumé des points-clés à respecter dans le prompt généré pour l’IA** (Claude ou autre) :

```
Expliquer clairement la fonctionnalité de génération de noms à partir d’une description, avec
IA, et mentionner les options de longueur, style, thème.
Insister sur l’ interface user-friendly en React/Next.js et la simplicité du parcours utilisateur
(saisie, génération, sélection).
Détailler l’étape de sélection des noms par l’utilisateur et le passage à la vérification.
Lister toutes les catégories de vérification de disponibilité  : domaines (TLD courants) ,
marques (INPI, autres pays) , réseaux sociaux (principaux réseaux) , stores mobiles
, etc., en expliquant comment chacune est effectuée.
Mentionner la production d’un rapport clair pour chaque nom, avec indicateurs de disponibilité
et liens directs pour enregistrer/acheter le nom si disponible.
Conserver un ton instructif et détaillé, de sorte que l’IA comprenne bien chaque exigence de
l’application et puisse éventuellement générer le code correspondant (structure React, appels
API, etc.). Chaque fonctionnalité doit être clairement justifiée (ex : pourquoi telle vérification est
importante – référence à l’état de l’art du naming).
```
En suivant ces directives dans le prompt, l’IA pourra produire une application conforme, réunissant
**génération intelligente de noms** et **vérification multi-plateforme** pour aider l’utilisateur à trouver **le
nom parfait, disponible partout**.

AI Business Name Generator | Generate Unique Brand Names
https://www.hootsuite.com/social-media-tools/ai-business-name-generator?srsltid=AfmBOoorDJ-PCJBvBZUp5r-
_cMFbLjGbYb4gyD7Xyj5yaqEkmIGItPKq

Quiz de Générateur de Noms Amusant | Trouvez la Correspondance Parfaite pour Votre Nom -
Musely
https://musely.ai/fr/tools/name-generator-quiz

INPI : comment vérifier la disponibilité d’une marque avant le dépôt ?
https://marquo.fr/verification-disponibilite-inpi/

3 sites pour connaître la disponibilité de son pseudo sur les réseaux sociaux
https://www.blogdumoderateur.com/connaitre-disponibilite-pseudo-reseaux-sociaux/

Play it safe with the app name check
https://tools.namerobot.com/appcheck

Nom de marque : Quels outils pour vérifier la disponibilité?
https://www.creads.com/blog/decryptage/comment-faire/outils-pour-verifier-disponibilite-nom-de-marque/

How the WIPO Global Brand Database Helps Protect Your Trademarks Worldwide
https://trademarkfactory.com/blog/the-importance-of-wipos-trademark-database-for-global-trademark-protection/

### •
