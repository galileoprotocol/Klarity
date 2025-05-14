# User Stories pour le Suivi de Développement Détaillé par Phases et Milestones

## Rôle : Gestionnaire de Projet (PM) / Vous en tant que PM

### Feature : Gestion des Phases d'un Projet

**User Story PM-PH-1 : Créer une nouvelle phase de développement**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir ajouter une nouvelle phase à un projet existant, en spécifiant son nom, une description, ses objectifs principaux, et optionnellement une date de début et une date de fin cible,
*   **Afin de** structurer le déroulement du projet en grandes étapes claires pour l'équipe et le client.
*   **Critères d'Acceptation (AC) :**
    1.  Depuis la page de gestion d'un projet, une option "Ajouter une Phase" est disponible.
    2.  Un formulaire permet de saisir : Nom (requis), Description (optionnel), Objectifs de la phase (requis, texte), Date de début (optionnel), Date de fin cible (optionnel), Ordre d'affichage (optionnel).
    3.  La nouvelle phase est ajoutée à la liste des phases du projet, avec un statut initial "À venir".
    4.  Je peux voir la phase créée dans la vue d'ensemble des phases du projet.

**User Story PM-PH-2 : Visualiser la liste des phases d'un projet**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** voir une liste claire de toutes les phases définies pour un projet, avec leur nom, statut, dates (si définies), et un résumé des objectifs,
*   **Afin d'**avoir une vue d'ensemble de la planification et de la progression.
*   **AC :**
    1.  Une section "Phases du Projet" affiche les phases sous forme de liste ou de cartes.
    2.  Chaque phase affiche : Nom, Statut (ex: À venir, En cours, Terminée), Dates de début/fin cibles.
    3.  Je peux cliquer sur une phase pour voir ses détails et ses milestones.
    4.  Les phases peuvent être triées par ordre de création ou par un champ "ordre" manuel.

**User Story PM-PH-3 : Modifier une phase de développement existante**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir modifier les détails d'une phase existante (nom, description, objectifs, dates, statut, ordre),
*   **Afin d'**ajuster la planification en fonction de l'évolution du projet.
*   **AC :**
    1.  Sur chaque phase listée, une option "Modifier" est disponible.
    2.  Le formulaire d'édition pré-rempli avec les informations de la phase s'affiche.
    3.  Je peux modifier tous les champs de la phase, y compris son statut (ex: passer de "À venir" à "En cours").
    4.  Les modifications sont sauvegardées et reflétées dans la liste des phases.

**User Story PM-PH-4 : Supprimer une phase de développement**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir supprimer une phase (avec confirmation),
*   **Afin de** corriger des erreurs de planification ou de réorganiser le projet.
*   **AC :**
    1.  Une option "Supprimer" est disponible pour chaque phase.
    2.  Une modale de confirmation s'affiche avant la suppression définitive.
    3.  La suppression d'une phase supprime également les milestones et les sessions de travail qui y sont liées (ou les désassocie/archive - à définir, la suppression est plus simple pour MVP).

### Feature : Gestion des Milestones au sein d'une Phase

**User Story PM-MILE-1 : Ajouter un milestone à une phase**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir ajouter un ou plusieurs milestones à une phase de développement, en spécifiant le nom/objectif du milestone, une description optionnelle, une date cible, et un statut initial,
*   **Afin de** décomposer la phase en objectifs intermédiaires concrets et mesurables.
*   **AC :**
    1.  Dans la vue détaillée d'une phase, une option "Ajouter un Milestone" est disponible.
    2.  Un formulaire permet de saisir : Nom/Objectif (requis), Description (optionnel), Date cible (optionnel), Statut initial ("À faire").
    3.  Le nouveau milestone est ajouté à la liste des milestones de cette phase.

**User Story PM-MILE-2 : Visualiser les milestones d'une phase**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** voir la liste des milestones pour une phase sélectionnée, avec leur nom, statut, et date cible,
*   **Afin de** suivre la progression vers les objectifs de la phase.
*   **AC :**
    1.  La vue détaillée d'une phase affiche une liste de ses milestones.
    2.  Chaque milestone affiche son nom, statut (ex: À faire, En cours, Terminé, Validé), et date cible.
    3.  Je peux cliquer sur un milestone pour voir plus de détails (ou pour le modifier).

**User Story PM-MILE-3 : Modifier un milestone existant**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir modifier les détails d'un milestone (nom, description, date cible, statut),
*   **Afin d'**ajuster les objectifs intermédiaires.
*   **AC :**
    1.  Sur chaque milestone listé, une option "Modifier" est disponible.
    2.  Je peux modifier tous les champs du milestone, y compris son statut (ex: marquer comme "Terminé" ou "Validé").
    3.  Les modifications sont sauvegardées.

**User Story PM-MILE-4 : Supprimer un milestone**
*   **En tant que** Gestionnaire de Projet,
*   **Je veux** pouvoir supprimer un milestone d'une phase (avec confirmation),
*   **Afin de** réajuster les objectifs de la phase.
*   **AC :**
    1.  Option "Supprimer" sur chaque milestone.
    2.  Confirmation avant suppression.
    3.  La suppression d'un milestone désassocie les sessions de travail qui y étaient liées (elles restent liées à la phase).

---

## Rôle : Développeur (Dev) / Vous en tant que Dev

### Feature : Enregistrement des Sessions de Travail

**User Story DEV-SESS-1 : Sélectionner ma phase de travail active**
*   **En tant que** Développeur,
*   **Je veux** pouvoir facilement sélectionner la phase de développement sur laquelle je travaille actuellement pour un projet donné,
*   **Afin que** mes sessions de travail soient correctement rattachées.
*   **AC :**
    1.  Dans l'interface du projet, une liste déroulante ou un sélecteur me permet de choisir parmi les phases "En cours" (ou "À venir") du projet.
    2.  Ma sélection de phase active est mémorisée pour la session ou jusqu'à ce que je la change.

**User Story DEV-SESS-2 : Enregistrer une session de travail**
*   **En tant que** Développeur,
*   **Je veux** pouvoir enregistrer une session de travail en indiquant la date, la durée (saisie manuelle en heures), une description détaillée de ce que j'ai accompli, et lier optionnellement cette session à un milestone spécifique de la phase active,
*   **Afin de** documenter mon travail et de fournir de la visibilité au PM et au client.
*   **AC :**
    1.  Un bouton "Enregistrer une Session de Travail" (ou similaire) est accessible.
    2.  Un formulaire permet de saisir : Date (pré-remplie avec aujourd'hui), Durée (champ numérique, ex: 3.5), Description (champ texte riche), Milestone (liste déroulante optionnelle des milestones de la phase active).
    3.  La session est enregistrée et liée à la phase active et au milestone sélectionné (si applicable).

**User Story DEV-SESS-3 : Ajouter des screenshots à une session de travail**
*   **En tant que** Développeur,
*   **Je veux** pouvoir uploader un ou plusieurs screenshots lors de l'enregistrement d'une session de travail (ou en modifiant une session existante),
*   **Afin d'**illustrer visuellement mon travail et les fonctionnalités développées.
*   **AC :**
    1.  Le formulaire de session de travail permet de sélectionner et d'uploader des fichiers image.
    2.  Les images sont stockées de manière sécurisée (Supabase Storage).
    3.  Les URLs des images sont associées à la session de travail.
    4.  Une prévisualisation des images uploadées est possible.

**User Story DEV-SESS-4 : Visualiser et modifier mes sessions de travail enregistrées**
*   **En tant que** Développeur,
*   **Je veux** pouvoir voir une liste de mes sessions de travail pour une phase ou un projet, et pouvoir les modifier (description, durée, screenshots) ou les supprimer si nécessaire (avant validation client par exemple),
*   **Afin de** corriger des erreurs ou d'ajouter des détails.
*   **AC :**
    1.  Une vue liste mes sessions de travail, triables par date.
    2.  Je peux cliquer sur une session pour voir ses détails et accéder aux options de modification/suppression.
    3.  Les modifications sont sauvegardées.

---

## Rôle : Client / Fondateur du Projet

### Feature : Visualisation de l'Avancement du Projet

**User Story CLIENT-VIEW-1 : Consulter la liste des phases et des milestones du projet**
*   **En tant que** Client,
*   **Je veux** pouvoir visualiser la liste des phases de développement de mon projet, et pour chaque phase, voir les milestones prévus avec leur statut (À faire, En cours, Terminé, Validé),
*   **Afin d'**avoir une vue claire de la structure du projet et de l'avancement global par rapport aux objectifs.
*   **AC :**
    1.  Une section "Avancement du Projet" ou "Phases & Milestones" affiche ces informations.
    2.  La présentation est claire et facile à comprendre.
    3.  Le statut de chaque milestone est visuellement distinct.

**User Story CLIENT-VIEW-2 : Consulter le détail des sessions de travail pour une phase/milestone**
*   **En tant que** Client,
*   **Je veux** pouvoir cliquer sur une phase ou un milestone pour voir le détail des sessions de travail enregistrées par le développeur, incluant la date, la durée, la description du travail effectué, et les screenshots associés,
*   **Afin de** comprendre concrètement le travail réalisé et de suivre la progression.
*   **AC :**
    1.  En sélectionnant une phase/milestone, une liste chronologique des sessions de travail s'affiche.
    2.  Chaque session montre : Date, Durée, Description (formatée pour la lisibilité), Miniatures des screenshots (cliquables pour agrandir).
    3.  L'interface est optimisée pour la consultation.

**(Optionnel MVP) User Story CLIENT-FEEDBACK-1 : Valider un milestone ou donner du feedback**
*   **En tant que** Client,
*   **Je veux** avoir une option pour marquer un milestone comme "Validé" une fois que j'ai revu le travail correspondant, ou pour laisser un commentaire/feedback sur un milestone ou une session de travail,
*   **Afin d'**interagir avec le processus de développement.
*   **AC :**
    1.  Sur un milestone "Terminé", un bouton "Valider ce Milestone" est disponible.
    2.  Un espace de commentaire simple est disponible au niveau des milestones ou des phases. 