import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI, prdAPI } from './api';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [prd, setPRD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

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
              {project?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {project?.description || 'No description provided'}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {project?.project_type || 'General'}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                Created: {new Date(project?.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Edit Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* PRD Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Product Requirements Document
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Define your vision and product requirements
                </p>
              </div>
              {prd ? (
                <Link
                  to={`/projects/${projectId}/prd`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-primary-100 hover:bg-primary-200"
                >
                  View & Edit PRD
                </Link>
              ) : (
                <Link
                  to={`/projects/${projectId}/prd`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Create PRD
                </Link>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {prd ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    PRD last updated: {new Date(prd.updated_at).toLocaleString()}
                  </p>
                  <div className="space-y-4">
                    {Object.keys(prd.content || {}).slice(0, 3).map(key => (
                      <div key={key} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h4 className="text-sm font-medium text-gray-900">{prd.content[key].title}</h4>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {prd.content[key].content || 'No content yet'}
                        </p>
                      </div>
                    ))}
                    {Object.keys(prd.content || {}).length > 3 && (
                      <p className="text-sm text-primary-600">+ {Object.keys(prd.content).length - 3} more sections</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 18.75h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H4.875A1.125 1.125 0 013.75 17.25v-1.5a1.125 1.125 0 00-1.125-1.125H1.5m3.75 18.75h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H4.875A1.125 1.125 0 013.75 17.25v-1.5a1.125 1.125 0 00-1.125-1.125H1.5m15-18.75h-1.5a1.125 1.125 0 00-1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 00-1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5m15 0h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-1.5" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No PRD created yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your Product Requirements Document.</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Blueprint Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Project Blueprint
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Technical specifications and architecture
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => navigate(`/projects/${projectId}/blueprint`)}
              >
                Generate Blueprint
              </button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No blueprint generated yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create a PRD first, then generate your technical blueprint.</p>
              </div>
            </div>
          </div>

          {/* Vision Validator Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vision Validator
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Evaluate your vision's feasibility and market fit
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => navigate(`/projects/${projectId}/validate`)}
              >
                Validate Vision
              </button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No validation performed yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get insights on your project's feasibility and market fit.</p>
              </div>
            </div>
          </div>

          {/* Vibe Coders Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vibe Coders Network
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Connect with skilled developers for your project
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled
              >
                Coming Soon
              </button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Vibe Coders Network</h3>
                <p className="mt-1 text-sm text-gray-500">This feature will be available in a future update.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;