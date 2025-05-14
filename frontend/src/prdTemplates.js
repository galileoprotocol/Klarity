// Templates PRD pour différents types de produits
// Chaque template définit le contenu initial des sections du PRD

// Structure commune à tous les templates
// Pour les consistance, tous les templates ont les mêmes sections
// mais le contenu est adapté selon le type de produit
const TEMPLATE_SECTIONS = {
  problem: {
    title: 'Problem Statement',
    placeholder: 'Describe the problem your product solves. What pain points does it address?'
  },
  solution: {
    title: 'Solution Overview',
    placeholder: 'Provide a high-level description of your solution. How does it solve the problem?'
  },
  target_audience: {
    title: 'Target Audience',
    placeholder: 'Define your target users. Who will benefit from your product?'
  },
  user_stories: {
    title: 'User Stories',
    placeholder: 'List key user stories in the format: "As a [user type], I want to [action] so that [benefit]"'
  },
  features: {
    title: 'Key Features',
    placeholder: 'Outline the main features of your product, focusing on the MVP'
  },
  success_metrics: {
    title: 'Success Metrics',
    placeholder: 'How will you measure success? What KPIs are most relevant?'
  },
  technical_considerations: {
    title: 'Technical Considerations',
    placeholder: 'Any specific technical requirements or constraints to consider?'
  },
  timeline: {
    title: 'Development Timeline',
    placeholder: 'Outline the proposed timeline for development milestones'
  }
};

// Template vide (standard)
export const EMPTY_TEMPLATE = Object.keys(TEMPLATE_SECTIONS).reduce((acc, key) => {
  acc[key] = {
    ...TEMPLATE_SECTIONS[key],
    content: ''
  };
  return acc;
}, {});

// Template SaaS
export const SAAS_TEMPLATE = {
  problem: {
    ...TEMPLATE_SECTIONS.problem,
    content: `Les entreprises de [secteur cible] font face à des défis significatifs dans [problème spécifique], ce qui entraîne [conséquence négative] et [impact sur les résultats].

Les solutions actuelles sur le marché sont souvent [limitations des solutions existantes], ce qui les rend inadéquates pour [raison spécifique].`
  },
  solution: {
    ...TEMPLATE_SECTIONS.solution,
    content: `Notre solution SaaS propose une plateforme [caractéristique principale] qui permet aux entreprises de [avantage principal] sans avoir à [limitation éliminée].

Notre approche se distingue par [différenciateur clé] et offre [proposition de valeur unique].`
  },
  target_audience: {
    ...TEMPLATE_SECTIONS.target_audience,
    content: `Utilisateurs primaires:
- Professionnels du [secteur] qui ont besoin de [besoin spécifique]
- Entreprises de taille [taille] dans le secteur [secteur]
- Départements [type de département] cherchant à améliorer [processus]

Décideurs:
- [Titre du poste] responsables des décisions d'achat
- [Autre partie prenante] qui influence les décisions`
  },
  user_stories: {
    ...TEMPLATE_SECTIONS.user_stories,
    content: `En tant qu'administrateur, je veux pouvoir gérer facilement les utilisateurs et les permissions afin de maintenir la sécurité et le contrôle de l'accès.

En tant qu'utilisateur, je veux un tableau de bord personnalisable afin de visualiser rapidement les données les plus importantes pour moi.

En tant que responsable d'équipe, je veux pouvoir assigner des tâches et suivre leur progression afin d'améliorer la productivité de l'équipe.

En tant qu'utilisateur mobile, je veux accéder à toutes les fonctionnalités clés sur mon téléphone afin de rester productif en déplacement.

En tant que décideur, je veux des rapports détaillés sur [métriques clés] afin d'évaluer le ROI et prendre des décisions basées sur les données.`
  },
  features: {
    ...TEMPLATE_SECTIONS.features,
    content: `MVP (Première version):
- Authentification et gestion des utilisateurs (individuelle et SSO)
- Tableau de bord personnalisable avec widgets configurables
- Module de [fonctionnalité principale 1]
- Fonctionnalité de [fonctionnalité principale 2]
- Rapports de base et exports (CSV, PDF)
- API RESTful pour intégrations tierces

Versions futures:
- Intégration avec [services tiers]
- Fonctionnalités avancées de collaboration
- Intelligence artificielle pour [cas d'usage]
- Application mobile native`
  },
  success_metrics: {
    ...TEMPLATE_SECTIONS.success_metrics,
    content: `Engagement utilisateur:
- Taux d'adoption: [objectif] dans les 3 premiers mois
- Rétention: [objectif]% après 6 mois
- Utilisation hebdomadaire active: [objectif]%

Croissance:
- Conversion des essais gratuits: [objectif]%
- Taux de croissance mensuel: [objectif]%
- NPS (Net Promoter Score): [objectif]

Performance technique:
- Disponibilité du service: 99.9%
- Temps de réponse moyen: < [objectif] ms
- Taux d'erreur: < [objectif]%`
  },
  technical_considerations: {
    ...TEMPLATE_SECTIONS.technical_considerations,
    content: `Architecture:
- Application web SPA (React/Vue.js) avec backend API (Node.js/Python)
- Base de données principale: PostgreSQL pour les données relationnelles
- Redis pour la mise en cache et les sessions
- Search: Elasticsearch pour les recherches avancées

Sécurité:
- Authentification OAuth2/JWT
- Chiffrement des données sensibles
- Conformité RGPD/CCPA

Déploiement & Infrastructure:
- Infrastructure cloud sur AWS/GCP
- CI/CD automatisé via GitHub Actions
- Monitoring avec Datadog/New Relic`
  },
  timeline: {
    ...TEMPLATE_SECTIONS.timeline,
    content: `Phase 1 (Mois 1-2):
- Configuration de l'infrastructure et de l'environnement de développement
- Développement des fonctionnalités d'authentification et de gestion des utilisateurs
- Base de données initiale et modèles de données

Phase 2 (Mois 3-4):
- Développement du tableau de bord et des visualisations
- Implémentation des [fonctionnalités principales]
- Premier test interne (alpha)

Phase 3 (Mois 5-6):
- Finalisation des fonctionnalités MVP
- Tests utilisateurs et corrections de bugs
- Préparation du lancement
- Version bêta pour utilisateurs sélectionnés

Phase 4 (Mois 7):
- Lancement officiel (MVP)
- Collecte des retours utilisateurs
- Planification des fonctionnalités pour la V2`
  }
};

// Template Application Mobile
export const MOBILE_APP_TEMPLATE = {
  problem: {
    ...TEMPLATE_SECTIONS.problem,
    content: `Les utilisateurs de smartphones rencontrent des difficultés pour [problème spécifique] lorsqu'ils sont dans [contexte d'utilisation]. Les solutions existantes ne répondent pas adéquatement à ce besoin car elles [limites des solutions actuelles].

Cette lacune entraîne [conséquence négative] pour [cible], qui doivent alors [alternative inefficace].`
  },
  solution: {
    ...TEMPLATE_SECTIONS.solution,
    content: `Notre application mobile [nom] offre une solution intuitive et efficace pour [résoudre le problème] grâce à [approche innovante/technologie].

L'application permet aux utilisateurs de [bénéfice principal] directement depuis leur smartphone, n'importe où et n'importe quand, en simplifiant considérablement [processus complexe].`
  },
  target_audience: {
    ...TEMPLATE_SECTIONS.target_audience,
    content: `Utilisateurs primaires:
- Personnes âgées de [tranche d'âge] qui [caractéristique comportementale]
- Utilisateurs de smartphones [iOS/Android/les deux] qui ont besoin de [besoin spécifique]
- [Segments démographiques ou professionnels spécifiques]

Contexte d'utilisation:
- En déplacement/au travail/à domicile
- Pendant [activité spécifique]
- À une fréquence [quotidienne/hebdomadaire/autre]`
  },
  user_stories: {
    ...TEMPLATE_SECTIONS.user_stories,
    content: `En tant qu'utilisateur, je veux pouvoir m'inscrire rapidement avec mon compte [réseau social/email] afin de commencer à utiliser l'application sans friction.

En tant qu'utilisateur en déplacement, je veux pouvoir [action principale] même sans connexion internet afin de rester productif partout.

En tant qu'utilisateur débutant, je veux un tutoriel intuitif afin de comprendre rapidement comment utiliser les fonctionnalités principales.

En tant qu'utilisateur régulier, je veux des notifications personnalisées afin de rester informé des [types d'événements importants].

En tant qu'utilisateur, je veux pouvoir personnaliser [aspect de l'interface] afin d'adapter l'application à mes préférences.`
  },
  features: {
    ...TEMPLATE_SECTIONS.features,
    content: `MVP (Version 1.0):
- Inscription/connexion (email, social login)
- Profils utilisateurs personnalisables
- Fonctionnalité principale: [détailler]
- Fonctionnalité secondaire: [détailler]
- Mode hors-ligne pour les fonctionnalités essentielles
- Notifications push pour [événements clés]

Fonctionnalités futures:
- Synchronisation entre appareils
- [Fonctionnalité premium] (modèle freemium)
- Intégration avec [services tiers populaires]
- Mode sombre / personnalisation avancée
- Version tablette optimisée`
  },
  success_metrics: {
    ...TEMPLATE_SECTIONS.success_metrics,
    content: `Acquisition & Engagement:
- Téléchargements: [objectif] dans les 3 premiers mois
- Taux de rétention J1: [objectif]%
- Taux de rétention J30: [objectif]%
- Durée moyenne de session: [objectif] minutes
- Fréquence d'utilisation: [objectif] fois par [période]

Performance technique:
- Taux de crash: < [objectif]%
- Temps de démarrage: < [objectif] secondes
- Utilisation de batterie: < [objectif]% par heure d'utilisation

Business:
- Conversion vers version premium (si applicable): [objectif]%
- Revenus publicitaires par utilisateur actif (si applicable): [objectif]$
- Note moyenne sur les stores: > [objectif]/5`
  },
  technical_considerations: {
    ...TEMPLATE_SECTIONS.technical_considerations,
    content: `Plateformes:
- iOS (version min: [version])
- Android (version min: [version])

Architecture & Stack:
- [Framework natif/cross-platform] pour le développement
- API REST/GraphQL backend pour [fonctionnalités nécessitant un serveur]
- Base de données locale SQLite pour le stockage hors-ligne
- Firebase pour notifications et analytics

Aspects techniques spécifiques:
- Optimisation batterie pour [fonctionnalités énergivores]
- Gestion du cache pour le mode hors-ligne
- Protection des données utilisateur (chiffrement local)
- Accessibilité conforme aux normes WCAG`
  },
  timeline: {
    ...TEMPLATE_SECTIONS.timeline,
    content: `Phase 1 (Mois 1-2):
- Design UX/UI et prototypage
- Établissement de l'architecture technique
- Développement de l'authentification et des profils utilisateurs

Phase 2 (Mois 2-3):
- Développement des fonctionnalités principales
- Mise en place du backend minimal nécessaire
- Tests internes (alpha)

Phase 3 (Mois 4):
- Développement des fonctionnalités secondaires
- Optimisation de performance
- Tests beta avec groupe restreint d'utilisateurs

Phase 4 (Mois 5):
- Corrections basées sur les retours beta
- Préparation des stores (screenshots, descriptions, etc.)
- Publication sur App Store et Google Play`
  }
};

// Template E-commerce
export const ECOMMERCE_TEMPLATE = {
  problem: {
    ...TEMPLATE_SECTIONS.problem,
    content: `Le marché de [catégorie de produits/services] manque actuellement de solutions qui [avantage distinctif non satisfait], obligeant les clients à se contenter de [limitations des options existantes].

Les consommateurs dans ce segment éprouvent des difficultés avec [problème spécifique] lorsqu'ils essaient de [activité d'achat], ce qui entraîne [conséquence négative] et [impact sur l'expérience d'achat/conversion].`
  },
  solution: {
    ...TEMPLATE_SECTIONS.solution,
    content: `Notre plateforme e-commerce offre une expérience d'achat supérieure pour [catégorie de produits] grâce à [innovation principale] et [différenciateur clé].

Nous résolvons les frustrations actuelles en proposant [solution spécifique au problème identifié] tout en ajoutant [avantage supplémentaire inattendu] pour transformer l'expérience client.`
  },
  target_audience: {
    ...TEMPLATE_SECTIONS.target_audience,
    content: `Acheteurs principaux:
- [Segment démographique] intéressés par [catégorie de produits]
- [Comportement d'achat spécifique] avec un budget moyen de [fourchette]
- Motivés par [facteurs de décision d'achat]

Vendeurs (si marketplace):
- [Type de vendeurs/marchands] spécialisés dans [industrie]
- À la recherche de [bénéfice principal pour les vendeurs]

Segments secondaires:
- [Autre segment] qui pourraient être intéressés par [catégorie connexe]
- [Prescripteurs/influenceurs] qui recommandent des produits à la cible principale`
  },
  user_stories: {
    ...TEMPLATE_SECTIONS.user_stories,
    content: `En tant qu'acheteur, je veux pouvoir filtrer les produits selon [critères spécifiques] afin de trouver rapidement ce qui correspond exactement à mes besoins.

En tant qu'acheteur mobile, je veux un processus de checkout simplifié en moins de 3 étapes afin de finaliser mon achat rapidement sans frustration.

En tant que client fidèle, je veux un programme de fidélité qui récompense mes achats répétés afin de bénéficier d'avantages exclusifs.

En tant qu'acheteur indécis, je veux pouvoir comparer facilement plusieurs produits côte à côte afin de prendre une décision d'achat éclairée.

En tant que vendeur (si marketplace), je veux un dashboard intuitif pour gérer mes produits et commandes afin d'optimiser mes ventes.`
  },
  features: {
    ...TEMPLATE_SECTIONS.features,
    content: `MVP (Première version):
- Catalogue produits avec filtres avancés et recherche
- Panier d'achat et processus de paiement optimisé
- Comptes utilisateurs avec historique d'achats
- Système de notation et avis produits
- Gestion des stocks et statuts de commande
- Intégration des principales méthodes de paiement
- Site responsive (desktop et mobile)

Versions futures:
- Application mobile native
- Programme de fidélité et récompenses
- Recommandations personnalisées basées sur les achats précédents
- Comparateur de produits
- Chat en direct pour le support client
- Gestion des retours en ligne`
  },
  success_metrics: {
    ...TEMPLATE_SECTIONS.success_metrics,
    content: `Métriques commerciales:
- Taux de conversion: [objectif]%
- Valeur moyenne du panier: [objectif]€
- Taux de retour client: [objectif]%
- Coût d'acquisition client: < [objectif]€

Métriques UX:
- Taux de rebond: < [objectif]%
- Temps moyen sur le site: > [objectif] minutes
- Taux d'abandon de panier: < [objectif]%
- Pages vues par session: > [objectif]

Performance technique:
- Temps de chargement des pages: < [objectif] secondes
- Disponibilité: > 99.9%
- Taux de conversion mobile: [objectif]% (vs desktop)`
  },
  technical_considerations: {
    ...TEMPLATE_SECTIONS.technical_considerations,
    content: `Architecture:
- Frontend: [React/Vue.js/autre] pour l'interface utilisateur
- Backend: [Node.js/Python/autre] pour la logique serveur
- Base de données: [PostgreSQL/MongoDB/autre] pour les données produits et utilisateurs
- Système de paiement: Intégration avec [Stripe/PayPal/autre]

Sécurité:
- Certification SSL/TLS
- Conformité PCI DSS pour le traitement des paiements
- Protection contre la fraude et monitoring
- Chiffrement des données sensibles

Aspects spécifiques e-commerce:
- Système de gestion des stocks en temps réel
- Calcul de taxes et frais de livraison
- Génération de factures automatisée
- API pour intégration avec les systèmes logistiques`
  },
  timeline: {
    ...TEMPLATE_SECTIONS.timeline,
    content: `Phase 1 (Mois 1-2):
- Design UX/UI de l'interface
- Mise en place du catalogue produits et base de données
- Développement du système d'authentification utilisateur

Phase 2 (Mois 3-4):
- Développement du panier et processus de checkout
- Intégration des systèmes de paiement
- Mise en place du système de gestion des commandes

Phase 3 (Mois 5-6):
- Développement des systèmes d'avis et notation
- Optimisation SEO et performance
- Tests utilisateurs et ajustements

Phase 4 (Mois 7):
- Tests de charge et sécurité
- Stratégie de lancement et marketing
- Lancement officiel (MVP)
- Collecte des premiers retours utilisateurs`
  }
};

// Map des templates par type de projet
export const TEMPLATES_BY_PROJECT_TYPE = {
  saas: SAAS_TEMPLATE,
  mobileapp: MOBILE_APP_TEMPLATE,
  ecommerce: ECOMMERCE_TEMPLATE,
  // Par défaut, utilisez le template vide pour les autres types
  default: EMPTY_TEMPLATE
};

// Fonction helper pour obtenir le template approprié en fonction du type de projet
export const getTemplateForProjectType = (projectType) => {
  return TEMPLATES_BY_PROJECT_TYPE[projectType] || EMPTY_TEMPLATE;
};

export default {
  EMPTY_TEMPLATE,
  SAAS_TEMPLATE,
  MOBILE_APP_TEMPLATE,
  ECOMMERCE_TEMPLATE,
  TEMPLATES_BY_PROJECT_TYPE,
  getTemplateForProjectType
}; 