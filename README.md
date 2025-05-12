# Klarity - Plateforme "Vision-First" pour Startups

Klarity est une plateforme qui guide les fondateurs de startups et les porteurs de projets innovants de l'idée brute à un projet structuré et validé, en combinant une méthodologie "Vision-First" rigoureuse avec la puissance de l'IA et une marketplace de talents augmentés (Vibe Coders).

## Fonctionnalités Principales

### MVP 1.9 (Version actuelle)

- **CodeGuide - Éditeur de PRD**: Création et édition de documents d'exigences produit (PRD) avec des sections prédéfinies.
- **Gestion de Projets**: Création, listing et gestion de projets.
- **Authentication**: Inscription/connexion sécurisée via Supabase Auth.
- **Export de PRD**: Export en format Markdown pour partage et collaboration.
- **Interface Utilisateur Intuitive**: Design moderne et responsive basé sur Tailwind CSS.

### Fonctionnalités à venir (Post-MVP 1.9)

- **AI CodeGuide**: Assistant IA pour aider à la rédaction de PRD.
- **Project Blueprint Generator**: Génération de recommandations techniques basées sur les besoins du projet.
- **Vision Validator**: Évaluation de la faisabilité et de l'adéquation au marché.
- **Marketplace Vibe Coders**: Connection avec des développeurs qualifiés.

## Stack Technique

- **Frontend**: Next.js avec TypeScript, Tailwind CSS et Shadcn/ui
- **Backend & Base de Données**: Supabase (PostgreSQL, Auth, Storage)
- **Authentification**: Supabase Auth
- **API Backend**: Supabase Edge Functions / Next.js API Routes

## Configuration du Projet

### Prérequis

- Node.js (v14+)
- Compte Supabase
- Connaissance de React et Next.js

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

- `/frontend`: Application Next.js avec React
- `/backend`: API FastAPI pour intégration avec Supabase
- `/supabase_schema.sql`: Définition du schéma de la base de données

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
