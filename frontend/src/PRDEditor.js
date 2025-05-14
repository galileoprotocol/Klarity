import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from './api';
import html2pdf from 'html2pdf.js';
// Import des templates
import { getTemplateForProjectType, TEMPLATES_BY_PROJECT_TYPE } from './prdTemplates';
// Import du composant SectionEditor
import SectionEditor from './components/SectionEditor';
// Import des styles
import './styles/SectionEditor.css';

// PRD Template structure
const PRD_TEMPLATE = {
  problem: {
    title: 'Problem Statement',
    content: '',
    placeholder: 'Describe the problem your product solves. What pain points does it address?'
  },
  solution: {
    title: 'Solution Overview',
    content: '',
    placeholder: 'Provide a high-level description of your solution. How does it solve the problem?'
  },
  target_audience: {
    title: 'Target Audience',
    content: '',
    placeholder: 'Define your target users. Who will benefit from your product?'
  },
  user_stories: {
    title: 'User Stories',
    content: '',
    placeholder: 'List key user stories in the format: "As a [user type], I want to [action] so that [benefit]"'
  },
  features: {
    title: 'Key Features',
    content: '',
    placeholder: 'Outline the main features of your product, focusing on the MVP'
  },
  success_metrics: {
    title: 'Success Metrics',
    content: '',
    placeholder: 'How will you measure success? What KPIs are most relevant?'
  },
  technical_considerations: {
    title: 'Technical Considerations',
    content: '',
    placeholder: 'Any specific technical requirements or constraints to consider?'
  },
  timeline: {
    title: 'Development Timeline',
    content: '',
    placeholder: 'Outline the proposed timeline for development milestones'
  }
};

// PRD Editor Component
const PRDEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [prd, setPRD] = useState(null);
  const [prdContent, setPRDContent] = useState(PRD_TEMPLATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('problem');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);

  // Fetch project and PRD data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await api.projects.getProject(projectId);
        if (projectError) throw projectError;
        setProject(projectData);
        
        // Fetch PRD if it exists
        const prdResponse = await api.prd.getProjectPRD(projectId);
        
        if (prdResponse.error) {
          console.error('Error fetching PRD in PRDEditor:', prdResponse.error);
          throw prdResponse.error;
        }
        
        const prdData = prdResponse.data;
        
        if (prdData) {
          setPRD(prdData);
          
          // If PRD has content, update the local state
          if (prdData.content) {
            const contentWithDefaults = { ...PRD_TEMPLATE };
            
            // Merge existing PRD content with template
            Object.keys(contentWithDefaults).forEach(key => {
              if (prdData.content[key]) {
                contentWithDefaults[key] = {
                  ...contentWithDefaults[key],
                  content: prdData.content[key].content || ''
                };
              }
            });
            
            setPRDContent(contentWithDefaults);
          }
        } else {
          // Aucun PRD trouvé, initialiser avec le template vide
          setPRD(null);
          setPRDContent(PRD_TEMPLATE);
          
          // PRD vide, afficher le sélecteur de template automatiquement
          setShowTemplateSelector(true);
          
          // Suggérer au premier chargement un template adapté au type de projet
          if (projectData && projectData.project_type && TEMPLATES_BY_PROJECT_TYPE[projectData.project_type]) {
            setTimeout(() => {
              if (window.confirm(`Voulez-vous utiliser le template recommandé pour votre projet de type ${projectData.project_type} ?`)) {
                applyTemplate(projectData.project_type);
              }
            }, 1000); // Délai léger pour laisser le temps à l'interface de s'initialiser
          }
        }
      } catch (error) {
        console.error('Error fetching PRD data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  // Handle section content change
  const handleSectionChange = (sectionKey, value) => {
    setPRDContent(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content: value
      }
    }));
  };

  // Nouvelle fonction pour gérer les actions IA
  const handleIAAction = async (actionKey, sectionKey, currentContent) => {
    try {
      console.log(`Action IA: ${actionKey} pour la section ${sectionKey}`);
      
      // Vérifier que l'action et la section sont valides
      if (!actionKey || !sectionKey || !prdContent[sectionKey]) {
        console.error("Action IA ou section invalide");
        return;
      }
      
      // Afficher un indicateur de chargement (à implémenter)
      // setActionInProgress(true); 
      
      // Préparer les données pour l'API
      const requestData = {
        section_key: sectionKey,
        section_title: prdContent[sectionKey].title,
        section_text: currentContent,
        action_key: actionKey,
        project_context: {
          name: project?.name,
          description: project?.description,
          project_type: project?.project_type
        },
        provider: 'claude' // ou 'gemini'
      };
      
      // Appel à l'API d'assistance par section
      const response = await api.codeGuide.getSectionAssistance(requestData);
      
      // Traiter la réponse
      if (response && response.response) {
        // Afficher la réponse dans une modale, un panneau latéral ou un autre UI
        alert(`Suggestion de l'IA pour "${prdContent[sectionKey].title}":\n\n${response.response}`);
        
        // À terme, intégrer une UI plus sophistiquée pour afficher et appliquer les suggestions
      }
    } catch (error) {
      console.error("Erreur lors de l'action IA:", error);
      alert(`Erreur: ${error.message || "Une erreur est survenue lors de la communication avec l'IA."}`);
    } finally {
      // Désactiver l'indicateur de chargement
      // setActionInProgress(false);
    }
  };

  // Fonction pour appliquer un template
  const applyTemplate = (templateType) => {
    setApplyingTemplate(true);
    try {
      const template = TEMPLATES_BY_PROJECT_TYPE[templateType] || TEMPLATES_BY_PROJECT_TYPE.default;
      
      // Confirmer avant d'écraser le contenu existant
      if (Object.values(prdContent).some(section => section.content)) {
        if (!window.confirm("Cette action remplacera le contenu actuel du PRD. Voulez-vous continuer ?")) {
          setApplyingTemplate(false);
          return;
        }
      }
      
      // Appliquer le template
      setPRDContent(template);
      setShowTemplateSelector(false);
      
      // Message de succès
      alert(`Template "${templateType}" appliqué avec succès !`);
    } catch (err) {
      console.error('Erreur lors de l\'application du template:', err);
      alert('Erreur lors de l\'application du template.');
    } finally {
      setApplyingTemplate(false);
    }
  };

  // Save PRD to database
  const handleSavePRD = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Prepare content for saving
      const formattedContent = {};
      Object.keys(prdContent).forEach(key => {
        formattedContent[key] = {
          title: prdContent[key].title,
          content: prdContent[key].content
        };
      });
      
      if (prd) {
        // Update existing PRD
        const { error } = await api.prd.updatePRD(prd.id, {
          content: formattedContent,
          updated_at: new Date().toISOString()
        });
        
        if (error) throw error;
      } else {
        // Create new PRD
        const { error } = await api.prd.createPRD({
          project_id: projectId,
          user_id: project.user_id,
          content: formattedContent
        });
        
        if (error) throw error;
      }
      
      // Show success message
      alert('PRD saved successfully!');
    } catch (error) {
      console.error('Error saving PRD:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Export PRD as Markdown
  const exportAsMD = () => {
    let markdown = `# ${project?.name || 'Project'} - Product Requirements Document\n\n`;
    
    Object.keys(prdContent).forEach(key => {
      const section = prdContent[key];
      markdown += `## ${section.title}\n\n${section.content || 'No content yet.'}\n\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'project'}-prd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export PRD as PDF (nouvelle version utilisant html2pdf.js en client-side)
  const exportAsPDF = async () => {
    setExportingPDF(true);
    setError(null);

    try {
      // 1. Construct HTML content from prdContent
      // This can include more styling for a better PDF
      let htmlString = `
        <html>
        <head>
          <title>${project?.name || 'Project'} PRD</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              width: 210mm;
              padding: 15mm;
              margin: 0 auto;
            }
            h1 { 
              color: #2563eb; 
              text-align: center; 
              font-size: 24px; 
              margin-bottom: 20px; 
            }
            h2 { 
              color: #1e40af; 
              font-size: 18px; 
              border-bottom: 1px solid #ddd; 
              padding-bottom: 5px; 
              margin-top: 30px; 
            }
            p { 
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <h1>${project?.name || 'Project'} - Product Requirements Document</h1>
      `;
      
      Object.keys(prdContent).forEach(key => {
        const section = prdContent[key];
        htmlString += `<h2>${section.title}</h2>`;
        // Basic conversion of newlines to <br> for HTML
        const sectionContentHtml = section.content ? section.content.replace(/\n/g, '<br />') : 'No content yet.';
        htmlString += `<p>${sectionContentHtml}</p>`;
      });
      
      htmlString += '</body></html>';

      // 2. Create a temporary container for the PDF content with explicit dimensions
      const container = document.createElement('div');
      container.style.position = 'fixed';   // Au lieu de 'absolute' pour garantir la visibilité
      container.style.top = '0';            // Positionner en haut de la page
      container.style.left = '0';           // Positionner à gauche
      container.style.width = '210mm';      // Largeur A4
      container.style.height = 'auto';      // Hauteur adaptative
      container.style.backgroundColor = 'white';
      container.style.zIndex = '-9999';     // Cacher visuellement mais garder dans le DOM
      container.style.opacity = '0';        // Invisible mais toujours rendu
      
      // 3. Create the inner element with the actual content
      const element = document.createElement('div');
      element.innerHTML = htmlString;
      element.style.width = '210mm';        // Largeur A4
      element.style.overflow = 'visible';   // Assurer que tout le contenu est visible
      
      // 4. Append to DOM
      container.appendChild(element);
      document.body.appendChild(container);

      // 5. Configuration de html2pdf avec des options optimisées
      const options = {
        filename: `${project?.name || 'project'}-prd.pdf`,
        margin: [15, 15, 15, 15],           // Marges : haut, droite, bas, gauche (en mm)
        image: { type: 'jpeg', quality: 1 }, // Qualité maximale
        html2canvas: { 
          scale: 2,                         // Échelle plus élevée pour meilleure qualité
          useCORS: true,                    // Pour les images externes
          logging: true,                    // Activer les logs pour le débogage
          letterRendering: true,            // Améliore le rendu du texte
          allowTaint: true,                 // Permet de capturer des images de différentes origines
          scrollX: 0,                       // Éviter les problèmes de défilement
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,                   // Compression du PDF
        }
      };
      
      // 6. Petit délai pour s'assurer que le DOM a le temps de rendre l'élément
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 7. Generate PDF
      console.log('Starting PDF generation with element:', element);
      await html2pdf().from(element).set(options).save();
      
      // 8. Clean up
      document.body.removeChild(container);
      
      alert('PRD exported as PDF successfully!');
    } catch (err) {
      console.error('Error exporting PRD as PDF:', err);
      setError(err.message || 'Failed to export PDF.');
      alert(`Error exporting PDF: ${err.message || 'Failed to export PDF.'}`);
    } finally {
      setExportingPDF(false);
    }
  };

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
              onClick={() => navigate('/projects')}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Back to Projects
            </button>
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
              {project?.name} - Product Requirements Document
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Define your product vision clearly to guide development
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Project
            </button>
            <button
              type="button"
              onClick={exportAsMD}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Export as Markdown
            </button>
            <button
              type="button"
              onClick={exportAsPDF}
              disabled={exportingPDF || saving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {exportingPDF ? 'Exporting PDF...' : 'Export as PDF'}
            </button>
            <button
              type="button"
              onClick={handleSavePRD}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {saving ? 'Saving...' : 'Save PRD'}
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-medium text-gray-900">Templates PRD</h3>
              <p className="text-sm text-gray-500">Utilisez un template pour démarrer rapidement votre PRD</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {showTemplateSelector ? 'Masquer les templates' : 'Choisir un template'}
            </button>
          </div>

          {showTemplateSelector && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Empty Template */}
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-primary-500">
                <h3 className="text-sm font-medium text-gray-900">Template Vide</h3>
                <p className="mt-1 text-xs text-gray-500">Document vierge avec sections standard</p>
                <button
                  onClick={() => applyTemplate('default')}
                  disabled={applyingTemplate}
                  className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Appliquer
                </button>
              </div>
              
              {/* SaaS Template */}
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-primary-500">
                <h3 className="text-sm font-medium text-gray-900">Template SaaS</h3>
                <p className="mt-1 text-xs text-gray-500">Pour applications et services cloud</p>
                <button
                  onClick={() => applyTemplate('saas')}
                  disabled={applyingTemplate}
                  className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Appliquer
                </button>
              </div>
              
              {/* Mobile App Template */}
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-primary-500">
                <h3 className="text-sm font-medium text-gray-900">Template Mobile</h3>
                <p className="mt-1 text-xs text-gray-500">Pour applications iOS et Android</p>
                <button
                  onClick={() => applyTemplate('mobileapp')}
                  disabled={applyingTemplate}
                  className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Appliquer
                </button>
              </div>
              
              {/* E-commerce Template */}
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-primary-500">
                <h3 className="text-sm font-medium text-gray-900">Template E-commerce</h3>
                <p className="mt-1 text-xs text-gray-500">Pour boutiques en ligne et marketplaces</p>
                <button
                  onClick={() => applyTemplate('ecommerce')}
                  disabled={applyingTemplate}
                  className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Appliquer
                </button>
              </div>
              
              {/* Auto-detected Template */}
              {project?.project_type && TEMPLATES_BY_PROJECT_TYPE[project.project_type] && (
                <div className="relative rounded-lg border-2 border-primary-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-primary-500">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                    Recommandé
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">Template basé sur le type de projet</h3>
                  <p className="mt-1 text-xs text-gray-500">Adapté à votre projet {project.project_type}</p>
                  <button
                    onClick={() => applyTemplate(project.project_type)}
                    disabled={applyingTemplate}
                    className="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Sidebar - Section Navigation */}
            <div className="md:col-span-1 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1">
                {Object.keys(prdContent).map(key => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full px-3 py-2 text-sm font-medium text-left rounded-md ${
                      activeSection === key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {prdContent[key].title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{prdContent[activeSection].title}</h3>
              
              <SectionEditor 
                sectionDetails={{
                  key: activeSection,
                  title: prdContent[activeSection].title,
                  placeholder: prdContent[activeSection].placeholder
                }}
                initialContent={prdContent[activeSection].content}
                onContentChange={(value) => handleSectionChange(activeSection, value)}
                onIAAction={handleIAAction}
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePRD}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDEditor;