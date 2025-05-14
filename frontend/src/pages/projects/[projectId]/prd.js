import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SectionEditor from '../../../components/SectionEditor'; // Ajustez le chemin
// import Layout from '../../../components/Layout'; // Si vous avez un Layout global

// Données de section PRD (normalement chargées depuis une API ou un store)
const prdSectionsConfig = [
  { key: 'problem_statement', title: 'Problem Statement' },
  { key: 'solution_overview', title: 'Solution Overview' },
  { key: 'target_audience', title: 'Target Audience' },
  { key: 'user_stories', title: 'User Stories' },
  { key: 'key_features', title: 'Key Features' },
  // ... autres sections
];

const PRDPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  // État pour stocker le contenu de chaque section du PRD
  // Dans une vraie app, ceci viendrait de votre API / Supabase
  const [prdData, setPrdData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour la modale/panneau d'affichage des résultats IA
  const [iaAssistanceResult, setIaAssistanceResult] = useState(null);
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);

  // Charger les données du PRD pour ce projetId (simulation)
  useEffect(() => {
    if (projectId) {
      console.log(`Chargement du PRD pour le projet ${projectId}...`);
      setLoading(true);
      // Simuler un appel API pour charger les données du PRD
      setTimeout(() => {
        const mockData = {
          problem_statement: 'Les petites entreprises ont du mal à gérer leur présence en ligne...',
          solution_overview: 'Notre plateforme simplifiera la création de sites et la gestion des réseaux sociaux...',
          // ... autres données initiales pour les sections
        };
        setPrdData(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [projectId]);

  const handleSectionContentChange = (sectionKey, newContent) => {
    setPrdData(prevData => ({
      ...prevData,
      [sectionKey]: newContent,
    }));
    // Ici, vous appelleriez votre API pour sauvegarder le changement
    console.log(`Contenu de la section ${sectionKey} mis à jour :`, newContent);
  };

  const handleSavePRD = async () => {
    console.log("Sauvegarde du PRD complet :", prdData);
    // Logique d'appel API pour sauvegarder tout le PRD
    // try {
    //   const response = await fetch(`/api/projects/${projectId}/prd`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(prdData),
    //   });
    //   if (!response.ok) throw new Error('Sauvegarde échouée');
    //   alert('PRD Sauvegardé !');
    // } catch (err) {
    //   alert(`Erreur de sauvegarde: ${err.message}`);
    // }
  };

  // Étape 2: Implémenter l'appel fetch vers l'endpoint /api/ai/assistSection
  const handleIAActionRequest = async (actionKey, sectionTitleForContext) => {
    const sectionKey = prdSectionsConfig.find(s => s.title === sectionTitleForContext)?.key;
    if (!sectionKey) {
      console.error("Clé de section non trouvée pour le titre:", sectionTitleForContext);
      setIaAssistanceResult({ error: "Erreur interne: Clé de section non trouvée." });
      setIsIAModalOpen(true);
      return;
    }

    const sectionText = prdData[sectionKey] || '';

    console.log(`Demande d'assistance IA pour la section "${sectionTitleForContext}" (clé: ${sectionKey}), action: "${actionKey}"`);
    console.log("Texte actuel de la section:", sectionText);
    setIaAssistanceResult({ loading: true, message: `Analyse IA en cours pour "${sectionTitleForContext}"...` });
    setIsIAModalOpen(true);

    try {
      const response = await fetch('/api/ai/assistSection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey,
          sectionTitle: sectionTitleForContext, // Le titre est utile pour le contexte du prompt
          sectionText,
          actionKey,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Erreur API: ${response.status}`);
      }
      
      console.log("Réponse de l'IA:", result);
      setIaAssistanceResult(result); 
      //setIsIAModalOpen(true); // Déjà ouvert

    } catch (err) {
      console.error("Erreur lors de la demande d'assistance IA:", err);
      setIaAssistanceResult({ error: err.message || "Une erreur est survenue lors de l'assistance IA." });
      //setIsIAModalOpen(true); // Déjà ouvert
    }
  };

  if (loading) return <p>Chargement du PRD...</p>;
  if (error) return <p>Erreur de chargement: {error}</p>; 
  // if (!projectId) return <p>ID de projet manquant.</p>; // Géré par le useEffect et loading

  return (
    // <Layout>
    <div style={{ padding: '20px' }}>
      <h1>Product Requirements Document - Projet: {projectId}</h1>
      <p>Define your product vision clearly to guide development</p>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4>Templates PRD</h4>
        <p>Utilisez un template pour démarrer rapidement votre PRD</p>
        <button onClick={() => alert('Fonctionnalité de template à implémenter')}>Choisir un template</button>
      </div>

      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
        <button onClick={() => router.back()} style={{ marginRight: '10px' }}>Back to Project</button>
        <button onClick={() => alert('Export Markdown à implémenter')} style={{ marginRight: '10px' }}>Export as Markdown</button>
        <button onClick={() => alert('Export PDF à implémenter')} style={{ marginRight: '10px' }}>Export as PDF</button>
        <button onClick={handleSavePRD} style={{ fontWeight: 'bold', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px'}}>Save PRD</button>
      </div>

      <div style={{ display: 'flex', marginTop: '80px' }}>
        <nav style={{ width: '200px', marginRight: '20px', borderRight: '1px solid #eee', paddingTop: '15px'}}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {prdSectionsConfig.map(section => (
              <li key={section.key} style={{ marginBottom: '10px' }}>
                <a 
                  href={`#${section.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Pourrait implémenter un scroll plus doux ou une gestion d'état pour la section active
                    const element = document.getElementById(section.key);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ textDecoration: 'none', color: '#333' /* Mettre en évidence la section active plus tard */ }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main style={{ flex: 1 }}>
          {prdSectionsConfig.map(section => (
            <div key={section.key} id={section.key} style={{ marginBottom: '40px' }}> {/* Ajout d'un ID pour l'ancre */}
              <SectionEditor
                sectionDetails={section}
                initialContent={prdData[section.key] || ''}
                onContentChange={(newContent) => handleSectionContentChange(section.key, newContent)}
                onIAAction={handleIAActionRequest} // Passez la fonction ici
              />
            </div>
          ))}
        </main>
      </div>

      {/* Étape 3: Gérer la réponse de l'API pour afficher les suggestions */}
      {isIAModalOpen && (
        <div style={{
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)', 
          zIndex: 1001,
          minWidth: '400px',
          maxWidth: '600px'
        }}>
          <button onClick={() => setIsIAModalOpen(false)} style={{ float: 'right' }}>X</button>
          <h4>Résultat de l'Assistance IA</h4>
          {iaAssistanceResult?.loading && <p>{iaAssistanceResult.message}</p>}
          {iaAssistanceResult?.error && <p style={{ color: 'red' }}>Erreur: {iaAssistanceResult.error}</p>}
          {iaAssistanceResult?.suggestion && (
            <div>
              <h5>Suggestion de Reformulation:</h5>
              <p><em>{iaAssistanceResult.suggestion}</em></p>
              <button onClick={() => {
                // Logique pour appliquer la suggestion au textarea de la bonne section
                // Ceci est complexe et dépendra de comment vous gérez l'état des sections
                alert('Logique d\'application de la suggestion à implémenter.');
                setIsIAModalOpen(false);
              }}>Appliquer la suggestion</button>
            </div>
          )}
          {iaAssistanceResult?.questions && iaAssistanceResult.questions.length > 0 && (
            <div>
              <h5>Questions pour Approfondir:</h5>
              <ul>
                {iaAssistanceResult.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
          {iaAssistanceResult?.researchTracks && iaAssistanceResult.researchTracks.length > 0 && (
             <div>
              <h5>Pistes de Recherche:</h5>
              <ul>
                {iaAssistanceResult.researchTracks.map((track, i) => <li key={i}>{track}</li>)}
              </ul>
              {iaAssistanceResult.actionableSuggestion && <p>{iaAssistanceResult.actionableSuggestion}</p>}
            </div>
          )}
          {iaAssistanceResult?.guidance && (
            <div>
              <h5>Guidance (5 Pourquoi):</h5>
              <p>{iaAssistanceResult.guidance}</p>
              <p><strong>Question initiale:</strong> {iaAssistanceResult.initialQuestion}</p>
              {/* Ici, il faudrait un mini-formulaire pour les réponses et pour continuer le flux "5 Pourquoi" */}
              <textarea placeholder='Votre réponse...' rows={3} style={{width: '100%', marginTop:'10px'}}></textarea>
              <button onClick={() => alert('Logique des 5 Pourquoi à continuer...')}>Soumettre et Continuer</button>
            </div>
          )}
           {iaAssistanceResult?.alignmentFeedback && (
            <div>
              <h5>Feedback d'Alignement (Solution):</h5>
              <p>{iaAssistanceResult.alignmentFeedback}</p>
              {iaAssistanceResult.suggestion && <p><em>Suggestion: {iaAssistanceResult.suggestion}</em></p>}
            </div>
          )}
        </div>
      )}

    </div>
    // </Layout>
  );
};

export default PRDPage; 