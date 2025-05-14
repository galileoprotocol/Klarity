# Klarity - Plateforme "Vision-First" pour Startups

Klarity est une plateforme qui guide les fondateurs de startups et les porteurs de projets innovants de l'idée brute à un projet structuré et validé, en combinant une méthodologie "Vision-First" rigoureuse avec la puissance de l'IA et une marketplace de talents augmentés (Vibe Coders).

## Fonctionnalités Principales

### MVP 1.9 (Version actuelle)

- **Éditeur de PRD**: Création et édition de documents d'exigences produit (PRD) avec des sections prédéfinies.
- **Gestion de Projets**: Création, listing et gestion de projets.
- **Authentication**: Inscription/connexion sécurisée via Supabase Auth.
- **Export de PRD en PDF**: Export en format PDF côté client pour partage et collaboration.
- **Templates de PRD**: Modèles prédéfinis pour différents types de projets (SaaS, Mobile, E-commerce).
- **AI CodeGuide**: Assistant IA pour aider à la rédaction de PRD et obtenir des conseils sur le développement.
- **Interface Utilisateur Intuitive**: Design moderne et responsive basé sur Tailwind CSS.

### Fonctionnalités à venir (Post-MVP 1.9)

- **Project Blueprint Generator**: Génération de recommandations techniques basées sur les besoins du projet.
- **Vision Validator**: Évaluation de la faisabilité et de l'adéquation au marché.
- **Marketplace Vibe Coders**: Connection avec des développeurs qualifiés.

## Stack Technique

- **Frontend**: React avec Tailwind CSS
- **Backend**: FastAPI (Python)
- **Base de Données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **IA**: Intégration avec Claude (Anthropic) et Gemini (Google)

## Configuration du Projet

### Prérequis

- Node.js (v14+)
- Python 3.9+
- Compte Supabase
- Clés API pour Anthropic Claude et/ou Google Gemini (pour la fonctionnalité CodeGuide)

### Variables d'Environnement

Créez un fichier `.env` dans le dossier `/frontend` avec les variables suivantes:

```
REACT_APP_BACKEND_URL=https://votre-projet-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

Créez un fichier `.env` dans le dossier `/backend` avec les variables suivantes:

```
SUPABASE_URL=https://votre-projet-supabase.supabase.co
SUPABASE_ANON_KEY=votre-clé-anon-supabase
SUPABASE_SERVICE_KEY=votre-clé-service-supabase
ANTHROPIC_API_KEY=votre-clé-api-anthropic
GOOGLE_API_KEY=votre-clé-api-google
```

### Installation et Démarrage

1. **Configuration Supabase**:
   - Créez un projet sur Supabase
   - Exécutez le script SQL dans `/app/supabase_schema.sql` via l'éditeur SQL de Supabase
   - Notez l'URL du projet et les clés API

2. **Installation du Frontend**:
   ```bash
   cd frontend
   yarn install
   yarn dev
   ```

3. **Installation du Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

## Structure du Projet

- `/frontend`: Application React
  - `/src`: Composants et logique frontend
    - `CodeGuide.js`: Composant pour l'assistant IA
    - `PRDEditor.js`: Éditeur de PRD avec export PDF
    - `prdTemplates.js`: Templates prédéfinis pour différents types de projets
- `/backend`: API FastAPI
  - `/external_integrations`: Modules d'intégration externes
    - `ai_codeguide.py`: Module d'intégration avec les LLMs (Claude et Gemini)
- `/supabase_schema.sql`: Définition du schéma de la base de données

## Fonctionnalités détaillées

### AI CodeGuide

Le Chatbot AI CodeGuide permet aux utilisateurs d'obtenir des réponses à leurs questions concernant le développement de produits, les bonnes pratiques, l'architecture technique et plus encore. Il est intégré directement dans l'interface de gestion de projet et peut fournir des conseils contextuels basés sur les informations du projet.

Caractéristiques principales:
- Support pour deux modèles d'IA: Claude (Anthropic) et Gemini (Google)
- Contextualisation des réponses basée sur les détails du projet et le contenu du PRD
- Conservation de l'historique des conversations
- Interface utilisateur intuitive avec formatage de messages enrichi

## Contribution

Ce projet est en développement actif. Si vous souhaitez contribuer, veuillez suivre ces étapes:

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité
3. Soumettez une pull request

## À Propos de la Méthodologie "Vision-First"

La méthodologie "Vision-First" de Klarity guide les fondateurs à travers un processus structuré:

1. **Définition du Problème**: Identifier clairement le problème à résoudre.
2. **Proposition de Valeur**: Formuler comment le produit résout ce problème.
3. **Public Cible**: Définir précisément les utilisateurs.
4. **User Stories**: Établir les scénarios d'utilisation principaux.
5. **Priorisation des Fonctionnalités**: Déterminer le MVP et les phases de développement.
6. **Validation Technique**: Évaluer la faisabilité technique et les ressources nécessaires.

Cette approche garantit que la vision produit est clairement définie avant tout développement.
