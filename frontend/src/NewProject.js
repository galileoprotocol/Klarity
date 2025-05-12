import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from './api';
import { supabase } from './api';

const PROJECT_TYPES = [
  { id: 'web_app', name: 'Web Application' },
  { id: 'mobile_app', name: 'Mobile Application' },
  { id: 'desktop_app', name: 'Desktop Application' },
  { id: 'saas', name: 'SaaS Product' },
  { id: 'marketplace', name: 'Marketplace' },
  { id: 'ecommerce', name: 'E-Commerce' },
  { id: 'ai_ml', name: 'AI/ML Solution' },
  { id: 'other', name: 'Other' }
];

const NewProject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        throw new Error('User not authenticated');
      }
      
      const projectData = {
        name,
        description,
        project_type: projectType,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await projectsAPI.createProject(projectData);
      
      if (error) throw error;
      
      // Redirect to the new project page
      if (data && data.length > 0) {
        navigate(`/projects/${data[0].id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">New Project</h3>
              <p className="mt-1 text-sm text-gray-600">
                Create a new project to start defining your vision. You'll be able to add a PRD, generate a blueprint, and more.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                      {error}
                    </div>
                  )}
                
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Project Name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                        placeholder="My Awesome Project"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                        placeholder="A brief description of your project"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description of your project. You can provide more details in the PRD later.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="project-type" className="block text-sm font-medium text-gray-700">
                      Project Type
                    </label>
                    <div className="mt-1">
                      <select
                        id="project-type"
                        name="project-type"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select type...</option>
                        {PROJECT_TYPES.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !name}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;