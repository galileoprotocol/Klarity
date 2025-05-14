// Fichier: Klarity/pages/api/ai/assistSection.js

// Ceci est un exemple simplifié. Dans une vraie application, vous utiliseriez le SDK d'OpenAI,
// d'Anthropic (pour Claude), ou de Google (pour Gemini), et vous construiriez des prompts plus sophistiqués.

// Fonction pour simuler un appel LLM (à remplacer par un vrai appel)
async function getLlmAssistance(prompt, sectionText) {
  console.log("-----------------------------------");
  console.log("Appel LLM (Simulation) avec le prompt :");
  console.log(prompt);
  console.log("Texte de la section fourni :");
  console.log(sectionText);
  console.log("-----------------------------------");

  // Réponses simulées basées sur l'action
  if (prompt.includes("Affiner et Clarifier le Problème")) {
    return {
      suggestion: `Basé sur "${sectionText}", voici une reformulation : "Les TPE du secteur X peinent à Y, résultant en Z." Considérez aussi : 1. Quel est l'impact chiffré ? 2. Depuis quand ce problème existe-t-il ?`,
      questions: ["Pouvez-vous être plus spécifique sur le type de 'petites entreprises' ?", "Quelles sont les conséquences directes ?"]
    };
  } else if (prompt.includes("Explorer les Causes Racines")) {
    return {
      guidance: "Commençons l'exercice des 5 Pourquoi. Répondez à chaque question pour creuser.",
      initialQuestion: `Le problème est : "${sectionText}". Pourquoi cela se produit-il ?`,
      nextStepType: 'guided_questions' // Indique au frontend de démarrer un flux de questions
    };
  } else if (prompt.includes("Valider l'Importance (Pistes de Recherche)")) {
    return {
      researchTracks: [
        "Mener des entretiens qualitatifs avec 5-10 gérants de votre cible.",
        "Créer un sondage en ligne pour quantifier la prévalence.",
        "Analyser les solutions concurrentes et leurs points faibles."
      ],
      actionableSuggestion: "Vous pourriez créer des tâches de validation basées sur ces pistes."
    };
  } else if (prompt.includes("Aligner Solution sur Problème")) {
    return {
      alignmentFeedback: `Votre solution semble bien répondre à l'aspect X du problème. Cependant, qu'en est-il de Y ? Comment votre solution adresse-t-elle cela ?`,
      suggestion: "Essayez de lier chaque fonctionnalité de votre solution à un aspect spécifique du problème énoncé."
    };
  }

  return { error: 'Action IA non reconnue ou non implémentée pour cette section.' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sectionKey, sectionTitle, sectionText, actionKey } = req.body;

  if (!sectionKey || !sectionText || !actionKey) {
    return res.status(400).json({ error: 'Paramètres manquants: sectionKey, sectionText, et actionKey sont requis.' });
  }

  let prompt = "";
  // Construire le prompt basé sur sectionKey et actionKey
  // Cette logique sera beaucoup plus élaborée

  if (sectionKey === 'problem_statement') {
    if (actionKey === 'clarify_problem') {
      prompt = `Tu es un expert en product management. Le Problem Statement actuel est: "${sectionText}". Aide l'utilisateur à l'Affiner et Clarifier. Pose des questions et suggère des reformulations.`;
    } else if (actionKey === 'explore_causes') {
      prompt = `Guide l'utilisateur pour Explorer les Causes Racines du problème: "${sectionText}" avec la méthode des 5 Pourquoi.`;
    } else if (actionKey === 'validate_importance') {
      prompt = `Suggère des Pistes de Recherche pour Valider l'Importance du problème: "${sectionText}".`;
    }
  } else if (sectionKey === 'solution_overview') {
    if (actionKey === 'align_solution') {
      prompt = `Analyse la "Solution Overview": "${sectionText}" et aide à l'Aligner sur le Problème (non fourni ici, mais tu l'aurais dans un vrai contexte).`;
    }
    // ... autres actions pour solution_overview
  }

  if (!prompt) {
    return res.status(400).json({ error: `L\'action "${actionKey}" n\'est pas définie pour la section "${sectionTitle}".` });
  }

  try {
    // Dans une vraie application, ici vous appelleriez votre LLM (Gemini, Claude, OpenAI)
    // avec le `prompt` construit et potentiellement `sectionText` comme contexte supplémentaire.
    const assistance = await getLlmAssistance(prompt, sectionText);
    
    if (assistance.error) {
      return res.status(500).json(assistance);
    }
    return res.status(200).json(assistance);

  } catch (error) {
    console.error("Erreur lors de l'appel à l'assistance IA:", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de la demande d'assistance IA." });
  }
} 