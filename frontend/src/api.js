import { createClient } from '@supabase/supabase-js';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${REACT_APP_BACKEND_URL}/api`;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication APIs
export const authAPI = {
  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession();
  },
  
  // Sign in with email and password
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },
  
  // Sign out current user
  signOut: async () => {
    return await supabase.auth.signOut();
  }
};

// Projects APIs
export const projectsAPI = {
  // Get all projects for a user
  getUserProjects: async (userId) => {
    return await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
  },
  
  // Get a specific project by ID
  getProject: async (projectId) => {
    return await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
  },
  
  // Create a new project
  createProject: async (projectData) => {
    return await supabase
      .from('projects')
      .insert([projectData]);
  },
  
  // Update an existing project
  updateProject: async (projectId, projectData) => {
    return await supabase
      .from('projects')
      .update(projectData)
      .eq('id', projectId);
  },
  
  // Delete a project
  deleteProject: async (projectId) => {
    return await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
  }
};

// PRD APIs
export const prdAPI = {
  // Get PRD for a project
  getProjectPRD: async (projectId) => {
    return await supabase
      .from('prds')
      .select('*')
      .eq('project_id', projectId)
      .single();
  },
  
  // Create a new PRD
  createPRD: async (prdData) => {
    return await supabase
      .from('prds')
      .insert([prdData]);
  },
  
  // Update an existing PRD
  updatePRD: async (prdId, prdData) => {
    return await supabase
      .from('prds')
      .update(prdData)
      .eq('id', prdId);
  }
};

// For direct API calls to FastAPI backend (when needed)
export const backendAPI = {
  // Base fetch function with error handling
  fetchFromBackend: async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // Example of a direct backend API call
  getVisionValidation: async (projectId) => {
    return await backendAPI.fetchFromBackend(`/validate-vision/${projectId}`, {
      method: 'GET'
    });
  },
  
  // Example of a direct backend API call with body
  generateTechBlueprint: async (projectData) => {
    return await backendAPI.fetchFromBackend(`/generate-blueprint`, {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  prd: prdAPI,
  backend: backendAPI,
  supabase
};