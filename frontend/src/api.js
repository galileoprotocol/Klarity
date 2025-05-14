import { createClient } from '@supabase/supabase-js';

// URL pour votre backend FastAPI
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'; // Fallback au cas où non défini, mais devrait être dans .env
const API_BASE_URL = `${REACT_APP_BACKEND_URL}/api`;

// URLs pour Supabase (ne doivent PAS dépendre de REACT_APP_BACKEND_URL)
const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || window.ENV?.NEXT_PUBLIC_SUPABASE_URL || 'https://dfvysmgrlemphqprkvbg.supabase.co';
const SUPABASE_PROJECT_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdnlzbWdybGVtcGhxcHJrdmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODE3NzIsImV4cCI6MjA2MjY1Nzc3Mn0.D89hO_-bJODjRby8324qc78btc1Ym6rV-oOHyx4C6SM';

// Log des valeurs pour déboguer
console.log("REACT_APP_BACKEND_URL (pour API FastAPI):", REACT_APP_BACKEND_URL);
console.log("API_BASE_URL (pour API FastAPI):", API_BASE_URL);
console.log("SUPABASE_PROJECT_URL (pour client Supabase):", SUPABASE_PROJECT_URL);
console.log("SUPABASE_PROJECT_ANON_KEY (pour client Supabase):", SUPABASE_PROJECT_ANON_KEY?.substring(0, 10) + "...");

// Initialize Supabase client
export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PROJECT_ANON_KEY);

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
    const { data, error } = await supabase
      .from('prds')
      .select('id, project_id, user_id, content, created_at, updated_at') // Colonnes explicites
      .eq('project_id', projectId)
      .maybeSingle(); // Utiliser maybeSingle() pour gérer l'absence de PRD

    // Ne considérer comme une véritable erreur que si ce n'est pas simplement "aucun enregistrement trouvé"
    // PGRST116 est le code d'erreur de PostgREST pour "Fetched zero rows" quand on attendait une ligne (avec .single()) 
    // ou quand .maybeSingle() retourne null, ce qui n'est pas une erreur en soi.
    if (error && error.code !== 'PGRST116') { 
      console.error("Supabase error fetching PRD:", error);
      // Il est préférable de laisser le composant appelant gérer le cas où data est null
      // plutôt que de lever une exception ici si aucun PRD n'est trouvé.
    }
    // Retourner { data, error } pour permettre au composant de vérifier si data est null
    return { data, error: (error && error.code === 'PGRST116' ? null : error) };
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

// Blueprints APIs
export const blueprintsAPI = {
  // Save a new Blueprint
  saveBlueprint: async (blueprintData) => { // blueprintData = { project_id, user_id, content: { answers, recommendations } }
    console.log("Attempting to save blueprint with data:", blueprintData); // Pour débogage
    const { data, error } = await supabase
      .from('blueprints')
      .insert([{
        project_id: blueprintData.project_id,
        user_id: blueprintData.user_id,
        content: blueprintData.content,
      }])
      .select(); 
    
    if (error) {
      console.error('Supabase error saving blueprint:', error);
    }
    return { data, error };
  },

  // Fonction pour récupérer le blueprint d'un projet
  getBlueprintForProject: async (projectId) => {
    console.log(`Attempting to fetch blueprint for project ID: ${projectId}`); // Pour débogage
    const { data, error } = await supabase
      .from('blueprints')
      .select('*') // Ou colonnes spécifiques: 'id, project_id, user_id, content, created_at, updated_at'
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { 
      console.error("Supabase error fetching blueprint:", error);
    }
    // Retourner null pour data si aucun blueprint n'est trouvé (comportement de maybeSingle)
    // et null pour error si c'était juste PGRST116 (aucun enregistrement)
    console.log("Blueprint fetched in api.js:", { data, error: (error && error.code === 'PGRST116' ? null : error) });
    return { data, error: (error && error.code === 'PGRST116' ? null : error) };
  },
};

// Vision Validations APIs
export const visionValidationsAPI = {
  // Save a new Vision Validation result
  saveValidationResult: async (validationData) => { // { project_id, user_id, score, feedback (jsonb) }
    console.log("Attempting to save vision validation with data:", validationData);
    const { data, error } = await supabase
      .from('vision_validations')
      .insert([{
        project_id: validationData.project_id,
        user_id: validationData.user_id,
        score: validationData.score,
        feedback: validationData.feedback, // Doit être un objet JSON valide
        // created_at est géré par Supabase (default now())
        // updated_at sera géré par le trigger si la table 'vision_validations' en a un (elle devrait)
      }])
      .select();
    
    if (error) {
      console.error('Supabase error saving vision validation:', error);
    }
    return { data, error };
  },

  // Get the latest Vision Validation result for a project
  getLatestValidationForProject: async (projectId) => {
    console.log(`Attempting to fetch latest vision validation for project ID: ${projectId}`);
    const { data, error } = await supabase
      .from('vision_validations')
      .select('*') // Ou colonnes spécifiques
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { 
      console.error("Supabase error fetching vision validation:", error);
    }
    console.log("Vision validation fetched in api.js:", { data, error: (error && error.code === 'PGRST116' ? null : error) });
    return { data, error: (error && error.code === 'PGRST116' ? null : error) };
  },
};

// CodeGuide AI Assistant API
export const codeGuideAPI = {
  // Envoie une question au backend et retourne la réponse
  askQuestion: async (questionData) => { // { question, project_id, message_history, provider }
    console.log("Sending question to CodeGuide:", questionData);
    try {
      const response = await fetch(`${API_BASE_URL}/codeguide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CodeGuide API request failed:', error);
      throw error;
    }
  },
  
  // Envoie une demande d'assistance pour une section spécifique
  getSectionAssistance: async (assistData) => { // { section_key, section_title, section_text, action_key, project_context, provider }
    console.log("Requesting section assistance:", assistData);
    try {
      const response = await fetch(`${API_BASE_URL}/section-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Section assistance API request failed:', error);
      throw error;
    }
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
  blueprints: blueprintsAPI,
  visionValidations: visionValidationsAPI,
  codeGuide: codeGuideAPI,
  backend: backendAPI,
  supabase,

  // DEPRECATED: L'export PDF est maintenant géré directement côté client avec html2pdf.js 
  // Cette fonction est conservée à titre de référence mais n'est plus utilisée
  // Pour plus de détails, voir PRDEditor.js -> exportAsPDF()
  /*
  exportPRDAsPDF: async (htmlContent, filename = "prd.pdf") => {
    const endpoint = `${API_BASE_URL}/prd/export/pdf`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          html_content: htmlContent, 
          filename: filename 
        }),
      });

      if (!response.ok) {
        // Try to parse error details from backend
        let errorDetail = `Failed to generate PDF. Status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorDetail = errorData.detail;
          }
        } catch (e) {
          // Ignore if response is not JSON
        }
        throw new Error(errorDetail);
      }

      // Expecting a blob as response
      const blob = await response.blob();
      return { data: blob, error: null };

    } catch (error) {
      console.error('Error calling PDF export API:', error);
      return { data: null, error: error.message || 'An unknown error occurred during PDF export.' };
    }
  }
  */
};