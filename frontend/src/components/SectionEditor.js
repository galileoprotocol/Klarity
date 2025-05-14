import React, { useState } from 'react';
import ContextualIAButton from './ContextualIAButton';

/**
 * Composant d'édition d'une section du PRD avec intégration de l'IA contextuelle
 * @param {Object} sectionDetails - Détails de la section (key, title)
 * @param {string} initialContent - Contenu initial de la section
 * @param {Function} onContentChange - Fonction appelée lors du changement de contenu
 * @param {Function} onIAAction - Fonction appelée lors de la sélection d'une action IA
 */
const SectionEditor = ({ sectionDetails, initialContent, onContentChange, onIAAction }) => {
  // État local pour le contenu du textarea
  const [content, setContent] = useState(initialContent || '');

  // Gestion du changement de contenu
  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setContent(newContent);
    
    // Appeler le callback parent si fourni
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // Récupération des actions IA appropriées pour cette section
  const getSectionSpecificIAActions = (sectionKey) => {
    console.log("[SectionEditor] getSectionSpecificIAActions pour:", sectionKey);
    
    // Actions disponibles selon le type de section
    switch (sectionKey) {
      case 'problem':
        return [
          { key: 'clarify_problem', label: 'Affiner et clarifier' },
          { key: 'explore_causes', label: 'Explorer les causes profondes' },
          { key: 'identify_stakeholders', label: 'Identifier les parties prenantes' }
        ];
      
      case 'solution':
        return [
          { key: 'brainstorm_solutions', label: 'Brainstorming de solutions' },
          { key: 'evaluate_alternatives', label: 'Évaluer les alternatives' },
          { key: 'highlight_uniqueness', label: 'Souligner l\'unicité' }
        ];
      
      case 'target_audience':
        return [
          { key: 'define_personas', label: 'Définir des personas' },
          { key: 'segment_audience', label: 'Segmenter l\'audience' },
          { key: 'audience_needs', label: 'Analyser les besoins' }
        ];
      
      case 'user_stories':
        return [
          { key: 'generate_user_stories', label: 'Générer des user stories' },
          { key: 'prioritize_stories', label: 'Prioriser les stories' },
          { key: 'refine_acceptance', label: 'Définir les critères d\'acceptance' }
        ];
      
      case 'features':
        return [
          { key: 'list_key_features', label: 'Lister les fonctionnalités clés' },
          { key: 'mvp_scope', label: 'Définir le scope MVP' },
          { key: 'feature_prioritization', label: 'Prioriser les fonctionnalités' }
        ];
      
      case 'success_metrics':
        return [
          { key: 'define_kpis', label: 'Définir des KPIs' },
          { key: 'success_criteria', label: 'Critères de succès' }
        ];
      
      case 'technical_considerations':
        return [
          { key: 'tech_stack_recommendations', label: 'Recommandations techniques' },
          { key: 'architecture_overview', label: 'Aperçu d\'architecture' },
          { key: 'identify_challenges', label: 'Identifier les défis techniques' }
        ];
      
      case 'timeline':
        return [
          { key: 'estimate_milestones', label: 'Estimer les jalons' },
          { key: 'risk_assessment', label: 'Évaluation des risques' }
        ];
      
      default:
        console.log("[SectionEditor] Aucune action IA définie pour cette section:", sectionKey);
        return [];
    }
  };

  // Récupération des actions IA pour cette section
  const iaActionsForThisSection = sectionDetails?.key 
    ? getSectionSpecificIAActions(sectionDetails.key)
    : [];
  
  // Debug log pour voir si des actions sont disponibles
  console.log("[SectionEditor] Actions IA pour", sectionDetails?.title, ":", iaActionsForThisSection);

  return (
    <div className="section-editor">
      <div className="section-header">
        <h3 className="section-title">
          {sectionDetails?.title || 'Section'}
          <ContextualIAButton 
            sectionTitle={sectionDetails?.title || 'Section'}
            iaActions={iaActionsForThisSection}
            onActionSelect={(actionKey, sectionTitle) => {
              console.log(`[SectionEditor] Action IA sélectionnée: ${actionKey} pour ${sectionTitle}`);
              if (onIAAction) {
                onIAAction(actionKey, sectionDetails?.key, content);
              }
            }}
          />
        </h3>
      </div>
      
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={sectionDetails?.placeholder || 'Entrez votre contenu ici...'}
        className="section-textarea"
        rows={10}
      />
    </div>
  );
};

export default SectionEditor; 