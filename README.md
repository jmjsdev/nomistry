# Nomistry

**Générateur de noms avec vérification de disponibilité**

Nomistry est une application web moderne qui permet de générer des noms créatifs pour vos projets ou marques à l'aide de l'intelligence artificielle, puis de vérifier leur disponibilité sur multiples plateformes.

![Nomistry](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## Fonctionnalités principales

### 1. Génération de noms par IA

- Génération de noms créatifs basée sur votre description de projet
- Options de personnalisation avancées :
  - **Longueur** : Court (5-8 caractères), Moyen (9-12), Long (13+)
  - **Style** : Moderne, Classique, Fantaisie, Professionnel
  - **Thème** : Technologie, Nature, Aventure, Finance, Santé, Éducation, Divertissement
- Utilisation de Claude AI (Anthropic) pour des suggestions pertinentes et originales

### 2. Sélection interactive

- Interface intuitive pour parcourir les noms générés
- Système de favoris avec icône cœur
- Sélection multiple des noms à vérifier
- Actions groupées (sélectionner tout / désélectionner tout)

### 3. Vérification multi-plateforme

L'application vérifie la disponibilité de chaque nom sur :

#### Noms de domaine
- Extensions principales : .com, .fr, .net, .io, .app, .co
- Informations sur le registrar si le domaine est pris
- Liens directs pour acheter les domaines disponibles

#### Marques déposées
- INPI (France)
- EUIPO (Europe)
- USPTO (USA)
- WIPO (International)
- Liens vers les bases de données officielles

#### Réseaux sociaux
- Facebook
- Twitter/X
- Instagram
- LinkedIn
- YouTube
- TikTok
- Liens directs vers les profils

#### App Stores
- Apple App Store (iOS)
- Google Play Store (Android)
- Informations sur les applications existantes

### 4. Rapport détaillé

- Tableau de synthèse complet pour chaque nom
- Score de disponibilité global (0-100%)
- Codes couleurs intuitifs (vert = disponible, rouge = pris)
- Export du rapport en PDF avec toutes les informations
- Liens d'action directs pour réserver/acheter

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **State Management** : Zustand
- **IA** : Anthropic Claude API
- **PDF Export** : jsPDF + jsPDF-AutoTable
- **Icons** : Lucide React
- **Animations** : Framer Motion

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Une clé API Anthropic

### Étapes d'installation

1. Clonez le repository :
```bash
git clone <repository-url>
cd nomistry
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Ajoutez votre clé API Anthropic dans le fichier `.env` :
```env
ANTHROPIC_API_KEY=votre_clé_api_ici
```

5. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

6. Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

## Utilisation

### 1. Génération de noms

1. Accédez à la page d'accueil
2. Décrivez votre projet dans le champ de texte
3. Sélectionnez vos préférences :
   - Longueur du nom souhaitée
   - Style (moderne, classique, etc.)
   - Thème correspondant à votre secteur
4. Cliquez sur "Générer des noms"
5. Attendez quelques secondes pendant que l'IA génère vos suggestions

### 2. Sélection des noms

1. Parcourez la liste des noms générés
2. Marquez vos favoris avec l'icône cœur
3. Cochez les noms que vous souhaitez vérifier
4. Cliquez sur "Vérifier la disponibilité"

### 3. Consultation du rapport

1. Consultez le rapport détaillé de disponibilité
2. Analysez le score global de chaque nom
3. Vérifiez les détails pour chaque plateforme
4. Exportez le rapport en PDF si nécessaire
5. Utilisez les liens d'action pour réserver vos noms

## Structure du projet

```
nomistry/
├── src/
│   ├── app/                    # Pages et routes Next.js
│   │   ├── api/               # API routes
│   │   │   ├── generate/      # Génération de noms
│   │   │   └── verify/        # Vérification de disponibilité
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Page d'accueil
│   │   └── globals.css        # Styles globaux
│   ├── components/            # Composants React
│   │   ├── GenerationForm.tsx # Formulaire de génération
│   │   ├── NamesList.tsx      # Liste des noms générés
│   │   └── AvailabilityReport.tsx # Rapport de disponibilité
│   ├── lib/                   # Utilitaires
│   │   ├── utils.ts          # Fonctions utilitaires
│   │   └── pdf-export.ts     # Export PDF
│   ├── store/                 # State management
│   │   └── useAppStore.ts    # Store Zustand
│   └── types/                 # Types TypeScript
│       └── index.ts
├── public/                    # Fichiers statiques
├── .env.example              # Variables d'environnement (exemple)
├── next.config.js            # Configuration Next.js
├── tailwind.config.js        # Configuration Tailwind
├── tsconfig.json             # Configuration TypeScript
└── package.json              # Dépendances
```

## API Routes

### POST /api/generate

Génère des noms créatifs basés sur les options fournies.

**Body** :
```json
{
  "description": "Une plateforme de e-learning...",
  "length": "medium",
  "style": "modern",
  "theme": "education",
  "count": 10
}
```

**Response** :
```json
{
  "names": ["EduVerse", "LearnFlow", "ScholarHub", ...]
}
```

### POST /api/verify

Vérifie la disponibilité d'un nom sur toutes les plateformes.

**Body** :
```json
{
  "name": "EduVerse"
}
```

**Response** :
```json
{
  "report": {
    "name": "EduVerse",
    "domains": [...],
    "trademarks": [...],
    "socialMedia": [...],
    "appStores": [...],
    "overallScore": 75,
    "lastChecked": "2025-01-15T10:30:00Z"
  }
}
```

## Configuration

### Variables d'environnement

- `ANTHROPIC_API_KEY` : Votre clé API Anthropic (obligatoire)

### Personnalisation

Vous pouvez personnaliser l'application en modifiant :

- **Couleurs** : `tailwind.config.js`
- **Options de génération** : `src/types/index.ts`
- **Plateformes vérifiées** : `src/app/api/verify/route.ts`

## Améliorations futures

- [ ] Intégration avec de vraies API de vérification de domaines (WhoisXML, etc.)
- [ ] Connexion aux API officielles des réseaux sociaux
- [ ] Historique des recherches
- [ ] Système de compte utilisateur
- [ ] Partage de rapports
- [ ] Notifications pour les noms redevenus disponibles
- [ ] Support multilingue
- [ ] Mode sombre
- [ ] Vérification de packages logiciels (npm, PyPI, etc.)

## Notes importantes

### Simulation vs Production

Cette version utilise des **simulations** pour les vérifications de disponibilité. En production, vous devriez intégrer :

1. **API de domaines** : WhoisXML API, Domain Check API
2. **API de marques** : Accès officiels INPI, USPTO, EUIPO
3. **API des réseaux sociaux** : APIs officielles ou services comme Namechk
4. **API des App Stores** : iTunes Search API, Google Play Developer API

### Limitations

- Les vérifications sont actuellement simulées avec des données aléatoires
- Les liens vers les plateformes peuvent nécessiter des ajustements
- Certaines API nécessitent des comptes professionnels ou payants

## Licence

MIT

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

## Auteur

Créé avec Claude AI

---

**Nomistry** - Trouvez le nom parfait, disponible partout.
