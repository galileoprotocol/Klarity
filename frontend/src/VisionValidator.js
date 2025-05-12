import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './api';

// Composant pour le Vision Validator (version basique pour MVP1.7)
const VisionValidator = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [prd, setPRD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  
  // Charger les données du projet et du PRD
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails du projet
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) throw projectError;
        setProject(projectData);
        
        // Récupérer le PRD s'il existe
        const { data: prdData, error: prdError } = await supabase
          .from('prds')
          .select('*')
          .eq('project_id', projectId)
          .single();
          
        if (!prdError && prdData) {
          setPRD(prdData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchData();
    }
  }, [projectId]);
  
  // Fonction pour valider la vision (simulation pour MVP1.7)
  const validateVision = async () => {
    try {
      setValidating(true);
      
      // Dans une version future, ceci enverrait les données à un système d'IA
      // Pour MVP1.7, nous utilisons une logique simple pour générer un score
      
      let feasibilityScore = 0;
      let marketFitScore = 0;
      let completenessScore = 0;
      let feedback = [];
      
      // Vérifier si le PRD existe
      if (!prd || !prd.content) {
        setValidationResults({
          overall_score: 0,
          feasibility_score: 0,
          market_fit_score: 0,
          completeness_score: 0,
          feedback: ['Veuillez créer un PRD avant de valider votre vision.']
        });
        return;
      }
      
      // Évaluer la complétude du PRD
      const content = prd.content;
      let filledSections = 0;
      let totalSections = Object.keys(content).length;
      
      Object.keys(content).forEach(key => {
        const section = content[key];
        if (section.content && section.content.trim().length > 20) {
          filledSections++;
        } else {
          feedback.push(`La section "${section.title}" n'est pas suffisamment détaillée.`);
        }
      });
      
      completenessScore = Math.round((filledSections / totalSections) * 100);
      
      // Critères de faisabilité simplifiés (basé sur les mots clés)
      const allContent = Object.keys(content)
        .map(key => content[key].content || '')
        .join(' ')
        .toLowerCase();
      
      // Mots clés positifs pour la faisabilité
      const feasibilityPositive = [
        'simple', 'standard', 'api', 'existant', 'technologie', 'faisable',
        'réaliste', 'établi', 'connu'
      ];
      
      // Mots clés négatifs pour la faisabilité
      const feasibilityNegative = [
        'complexe', 'difficile', 'innovant', 'révolutionnaire', 'jamais fait',
        'impossible', 'challenge', 'techniques avancées'
      ];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      feasibilityPositive.forEach(word => {
        if (allContent.includes(word)) positiveCount++;
      });
      
      feasibilityNegative.forEach(word => {
        if (allContent.includes(word)) negativeCount++;
      });
      
      feasibilityScore = Math.min(100, Math.max(0, 50 + (positiveCount * 10) - (negativeCount * 15)));
      
      if (feasibilityScore < 40) {
        feedback.push('La faisabilité technique semble être un défi. Considérez simplifier certains aspects ou détailler davantage l\'approche technique.');
      }
      
      // Critères d'adéquation au marché simplifiés
      const marketFitPositive = [
        'besoin', 'client', 'utilisateur', 'marché', 'solution', 
        'problème', 'valeur', 'avantage', 'bénéfice', 'cible'
      ];
      
      const marketFitNegative = [
        'incertain', 'peut-être', 'espérons', 'essayons', 'expérimental'
      ];
      
      positiveCount = 0;
      negativeCount = 0;
      
      marketFitPositive.forEach(word => {
        if (allContent.includes(word)) positiveCount++;
      });
      
      marketFitNegative.forEach(word => {
        if (allContent.includes(word)) negativeCount++;
      });
      
      marketFitScore = Math.min(100, Math.max(0, 50 + (positiveCount * 8) - (negativeCount * 12)));
      
      if (marketFitScore < 40) {
        feedback.push('L\'adéquation au marché pourrait être améliorée. Essayez de mieux définir votre public cible et le problème que vous résolvez.');
      }
      
      // Si le PRD est trop court globalement
      const totalLength = allContent.length;
      if (totalLength < 200) {
        feedback.push('Votre PRD est très court. Ajoutez plus de détails pour obtenir une meilleure validation.');
        completenessScore = Math.min(completenessScore, 30);
      }
      
      // Score global
      const overallScore = Math.round((feasibilityScore + marketFitScore + completenessScore) / 3);
      
      // Génération de feedbacks généraux basés sur le score global
      if (overallScore >= 80) {
        feedback.unshift('Votre vision est bien définie et semble prometteuse. Vous êtes sur la bonne voie !');
      } else if (overallScore >= 60) {
        feedback.unshift('Votre vision est solide mais pourrait bénéficier de quelques améliorations.');
      } else if (overallScore >= 40) {
        feedback.unshift('Votre vision a du potentiel mais nécessite plus de travail et de détails.');
      } else {
        feedback.unshift('Votre vision a besoin d\'être significativement améliorée et clarifiée.');
      }
      
      // Dans une version future, ces résultats seraient sauvegardés en base de données
      const results = {
        overall_score: overallScore,
        feasibility_score: feasibilityScore,
        market_fit_score: marketFitScore,
        completeness_score: completenessScore,
        feedback: feedback
      };
      
      setValidationResults(results);
      
      // Simuler un appel API (pour un délai réaliste)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Error validating vision:', error);
      setError(error.message);
    } finally {
      setValidating(false);
    }
  };
  
  // Rendu conditionnel en fonction de l'état
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>Error: {error}</p>
            <button 
              onClick={() => navigate(`/projects/${projectId}`)}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Retour au Projet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!prd) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
            <h3 className="text-lg font-medium">PRD requis</h3>
            <p className="mt-2">Vous devez créer un PRD avant de pouvoir valider votre vision.</p>
            <div className="mt-4">
              <button 
                onClick={() => navigate(`/projects/${projectId}/prd`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Créer un PRD
              </button>
              <button 
                onClick={() => navigate(`/projects/${projectId}`)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour au Projet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              Vision Validator
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Évaluez la faisabilité et l'adéquation au marché de votre projet.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour au Projet
            </button>
            {!validationResults && (
              <button
                type="button"
                onClick={validateVision}
                disabled={validating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {validating ? 'Validation...' : 'Valider la Vision'}
              </button>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informations du Projet
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Détails du projet à valider.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nom du Projet</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project?.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project?.description || 'Aucune description fournie'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type de Projet</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project?.project_type || 'Non spécifié'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Validation Results or Instructions */}
        {validating ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin mx-auto mb-4 h-12 w-12 border-t-2 border-b-2 border-primary-600 rounded-full"></div>
            <h3 className="text-lg font-medium text-gray-900">Validation en cours...</h3>
            <p className="mt-2 text-sm text-gray-500">
              Nous analysons votre PRD pour évaluer la faisabilité et l'adéquation au marché.
            </p>
          </div>
        ) : validationResults ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Résultats de la Validation
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Analyse basée sur votre Product Requirements Document (PRD).
              </p>
            </div>
            
            {/* Overall Score */}
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full">
                  <div className="flex items-center justify-center w-16 h-16 border-4 border-primary-500 rounded-full">
                    <span className="text-2xl font-bold text-primary-700">{validationResults.overall_score}</span>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Score Global</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Évaluation globale de votre vision sur 100
                </p>
              </div>
              
              {/* Detailed Scores */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Faisabilité Technique
                        </dt>
                        <dd className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">
                            {validationResults.feasibility_score}
                          </p>
                          <p className="ml-2 flex items-baseline text-sm font-semibold">
                            /100
                          </p>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Adéquation au Marché
                        </dt>
                        <dd className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">
                            {validationResults.market_fit_score}
                          </p>
                          <p className="ml-2 flex items-baseline text-sm font-semibold">
                            /100
                          </p>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-md">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Complétude du PRD
                        </dt>
                        <dd className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">
                            {validationResults.completeness_score}
                          </p>
                          <p className="ml-2 flex items-baseline text-sm font-semibold">
                            /100
                          </p>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Feedback</h3>
                <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {validationResults.feedback.map((item, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6">
                        <div className="flex items-start">
                          {index === 0 ? (
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Note on Validation */}
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">Note</h3>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        Cette validation est basée sur une analyse automatisée de votre PRD. 
                        Dans les prochaines versions, nous fournirons une analyse plus approfondie
                        et des recommandations plus détaillées.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setValidationResults(null)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Nouvelle Validation
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${projectId}/prd`)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Améliorer le PRD
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Validez votre vision</h3>
              <p className="mt-1 text-sm text-gray-500">
                Cliquez sur le bouton "Valider la Vision" pour analyser votre PRD et obtenir des recommandations.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={validateVision}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Valider la Vision
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionValidator;