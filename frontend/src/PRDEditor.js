import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { prdAPI, projectsAPI } from './api';

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

  // Fetch project and PRD data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await projectsAPI.getProject(projectId);
        if (projectError) throw projectError;
        setProject(projectData);
        
        // Fetch PRD if it exists
        const { data: prdData, error: prdError } = await prdAPI.getProjectPRD(projectId);
        
        if (!prdError && prdData) {
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
        const { error } = await prdAPI.updatePRD(prd.id, {
          content: formattedContent,
          updated_at: new Date().toISOString()
        });
        
        if (error) throw error;
      } else {
        // Create new PRD
        const { error } = await prdAPI.createPRD({
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
              onClick={handleSavePRD}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {saving ? 'Saving...' : 'Save PRD'}
            </button>
          </div>
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
              
              <textarea
                value={prdContent[activeSection].content}
                onChange={(e) => handleSectionChange(activeSection, e.target.value)}
                placeholder={prdContent[activeSection].placeholder}
                className="prd-editor w-full h-96"
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