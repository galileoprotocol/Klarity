# Conception Wireframes/Maquettes UX/UI - Suivi de Développement par Phases et Milestones

**Date de création :** 13 Mai 2025
**Version :** 1.0
**Auteur :** [Votre Nom/Équipe] & Assistant IA

**Objectif de ce Document :**
Ce document présente la conception de l'expérience utilisateur (UX) et de l'interface utilisateur (UI) pour la fonctionnalité de suivi de développement par phases et milestones. Il sert de référence pour l'équipe de développement frontend.

---

**Contexte Général :**
Cette fonctionnalité sera principalement accessible depuis la page de détails d'un projet existant (ex: `ProjectDetails.js`). Elle pourrait apparaître comme un nouvel onglet ou une section majeure dans cette page.

---

## Rôle : Gestionnaire de Projet (PM) / Vous en tant que PM

### Écran PM-PHM-1 : Vue d'Ensemble des Phases et Milestones du Projet

*   **Objectif Utilisateur (PM) :** Avoir une vue globale de la structure des phases et des milestones du projet, et pouvoir ajouter/modifier ces éléments.
*   **Intégration :** Pourrait être un onglet "Planification & Suivi" ou "Phases & Avancement" dans la page de détails du projet.
*   **Informations Clés à Afficher :**
    *   Titre : "Planification et Suivi du Projet : [Nom du Projet]".
    *   Bouton principal : "+ Ajouter une Phase".
    *   Liste des Phases du projet (chaque phase est un conteneur/carte extensible) :
        *   Pour chaque Phase :
            *   Nom de la Phase (éditable).
            *   Description courte de la Phase (éditable).
            *   Objectifs principaux de la Phase (éditable).
            *   Dates de début et de fin cible (éditables).
            *   Statut de la Phase (menu déroulant : À venir, En cours, Terminé, En revue, Bloqué, Annulé).
            *   Indicateur de progression de la phase (basé sur le statut des milestones).
            *   Boutons d'action pour la Phase : "Modifier", "Supprimer", "+ Ajouter un Milestone à cette Phase".
            *   Liste des Milestones de cette phase (si la phase est "dépliée") :
                *   Pour chaque Milestone :
                    *   Nom/Objectif du Milestone (éditable).
                    *   Description du Milestone (éditable).
                    *   Date cible du Milestone (éditable).
                    *   Statut du Milestone (menu déroulant : À faire, En cours, Terminé, Validé Client).
                    *   Boutons d'action pour le Milestone : "Modifier", "Supprimer".
*   **Actions Utilisateur Principales (PM) :**
    *   Ajouter une nouvelle phase.
    *   Modifier les détails d'une phase existante.
    *   Changer le statut d'une phase.
    *   Réorganiser l'ordre des phases (drag & drop ou via un champ "ordre").
    *   Supprimer une phase.
    *   Ajouter un nouveau milestone à une phase.
    *   Modifier les détails d'un milestone.
    *   Changer le statut d'un milestone.
    *   Supprimer un milestone.
*   **Composants UI Majeurs :**
    *   Liste de cartes "accordéon" ou "extensibles" pour chaque phase.
    *   Formulaires (dans des modales ou en édition inline) pour la création/modification des phases et des milestones.
    *   Menus déroulants pour les statuts.
    *   Sélecteurs de date.
    *   Boutons d'action.
*   **États :**
    *   Aucune phase définie.
    *   Liste des phases avec leurs milestones.
    *   Formulaire de création/édition de phase/milestone ouvert.

---

## Rôle : Développeur (Dev) / Vous en tant que Dev

### Écran DEV-SESS-1 : Interface d'Enregistrement de Session de Travail

*   **Objectif Utilisateur (Dev) :** Enregistrer rapidement et facilement son temps de travail, la description de ses activités, et les preuves visuelles.
*   **Intégration :** Pourrait être une section "Mon Travail Aujourd'hui" ou un bouton "Nouvelle Session" accessible depuis le tableau de bord du projet ou depuis la vue des phases/milestones.
*   **Informations Clés à Afficher (Formulaire) :**
    *   Titre : "Enregistrer une Session de Travail".
    *   **Sélecteur de Phase :** Liste déroulante des phases du projet actuellement "En cours" (ou "À venir").
    *   **Sélecteur de Milestone (Optionnel) :** Liste déroulante des milestones de la phase sélectionnée (filtrée sur les milestones "À faire" ou "En cours"). Apparaît si une phase est sélectionnée.
    *   Champ "Date de la Session" (pré-rempli avec aujourd'hui, éditable).
    *   Champ "Durée" (saisie numérique, ex: "3.5" pour 3h30). Unité claire (heures).
    *   Champ "Description du Travail Effectué" (textarea riche ou Markdown simple).
        *   Placeholder : "Décrivez les tâches accomplies, les problèmes rencontrés, les prochaines étapes..."
    *   Zone d'Upload de Screenshots :
        *   Bouton "Ajouter des Screenshots" ou zone de glisser-déposer.
        *   Prévisualisation des images uploadées avec option de suppression.
    *   Bouton CTA : "Enregistrer la Session".
*   **Actions Utilisateur Principales (Dev) :**
    *   Sélectionner la phase (et optionnellement le milestone).
    *   Remplir la date, la durée, la description.
    *   Uploader des screenshots.
    *   Soumettre le formulaire.
*   **Composants UI Majeurs :**
    *   Formulaire.
    *   Listes déroulantes (avec recherche si beaucoup de phases/milestones).
    *   Champ numérique pour la durée.
    *   Éditeur de texte pour la description.
    *   Composant d'upload de fichiers avec prévisualisation.
*   **États :** Formulaire vide, Formulaire en cours de remplissage, Upload d'images en cours, Confirmation de sauvegarde.

### Écran DEV-SESS-2 : Vue de Mes Sessions de Travail (Historique pour le Dev)

*   **Objectif Utilisateur (Dev) :** Consulter, modifier ou supprimer ses propres entrées de temps.
*   **Intégration :** Onglet "Mes Sessions" dans le projet ou dans son profil utilisateur global.
*   **Informations Clés à Afficher :**
    *   Filtres : Par projet, par phase, par période.
    *   Liste chronologique (ou groupée par jour/phase) de ses sessions de travail.
    *   Pour chaque session : Date, Durée, Brève description (avec "Lire plus"), Phase/Milestone associé, Nombre de screenshots.
    *   Actions par session : "Voir Détails/Modifier", "Supprimer".
*   **Actions Utilisateur Principales (Dev) :**
    *   Filtrer ses sessions.
    *   Ouvrir une session pour la modifier (ouvre un formulaire similaire à Écran DEV-SESS-1 pré-rempli).
    *   Supprimer une session (avec confirmation).
*   **Composants UI Majeurs :** Liste/Tableau de données, filtres, pagination.

---

## Rôle : Client / Fondateur du Projet

### Écran CLIENT-VIEW-1 : Vue d'Ensemble des Phases et Milestones (Similaire à PM-PHM-1 mais en lecture seule et orientée progression)

*   **Objectif Utilisateur (Client) :** Comprendre la structure du projet et suivre l'avancement global.
*   **Intégration :** Section "Avancement de mon Projet" dans la page de détails du projet.
*   **Informations Clés à Afficher :**
    *   Liste des Phases (similaire à la vue PM, mais sans les boutons d'édition/ajout).
    *   Pour chaque Phase : Nom, Description, Objectifs, Statut (avec code couleur/icône clair), Dates (si visibles par le client), Progression (résumé du nombre de milestones terminés/total).
    *   En dépliant une phase : Liste des Milestones avec leur Nom, Statut, Date cible.
*   **Actions Utilisateur Principales (Client) :**
    *   Consulter la structure.
    *   Déplier/replier les phases pour voir les milestones.
    *   Cliquer sur une phase ou un milestone pour voir les sessions de travail associées (mène à Écran CLIENT-VIEW-2).
*   **Composants UI Majeurs :** Interface de consultation claire, indicateurs de progression visuels.

### Écran CLIENT-VIEW-2 : Vue Détaillée des Sessions de Travail (pour une Phase ou un Milestone)

*   **Objectif Utilisateur (Client) :** Comprendre le travail concret effectué par le développeur.
*   **Intégration :** S'affiche lorsqu'un client clique sur une phase/milestone dans Écran CLIENT-VIEW-1.
*   **Informations Clés à Afficher :**
    *   Titre rappelant la Phase/Milestone sélectionné.
    *   Liste chronologique des sessions de travail enregistrées par le développeur pour cette phase/ce milestone.
    *   Pour chaque session :
        *   Date.
        *   Durée.
        *   Description du travail effectué (bien formatée).
        *   Galerie des screenshots (miniatures cliquables pour agrandir dans une lightbox/modale).
    *   (Optionnel MVP) Bouton/Lien "Poser une question sur cette session" (qui pourrait ouvrir un chat ou un email pré-rempli).
    *   (Optionnel MVP) Option pour valider un milestone si toutes les sessions semblent couvrir le travail.
*   **Actions Utilisateur Principales (Client) :**
    *   Lire les descriptions.
    *   Visualiser les screenshots.
    *   Naviguer entre les sessions.
*   **Composants UI Majeurs :** Liste claire et lisible, galerie d'images/lightbox.

--- 