-- Ajout pour la fonctionnalité de Suivi de Développement Détaillé par Phases et Milestones
-- (À exécuter APRÈS votre script supabase_schema.sql original)

-- Table pour les Phases d'un Projet
CREATE TABLE IF NOT EXISTS public.project_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    objectives TEXT, -- Objectifs clairs de la phase
    start_date DATE,
    end_date_target DATE,
    status VARCHAR(50) DEFAULT 'À venir' NOT NULL CHECK (status IN ('À venir', 'En cours', 'En revue', 'Terminée', 'Bloquée', 'Annulée')),
    phase_order INTEGER, -- Pour l'ordre d'affichage
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activer RLS pour project_phases
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour project_phases
DROP POLICY IF EXISTS "Project owners can manage their project phases" ON public.project_phases;
CREATE POLICY "Project owners can manage their project phases" 
ON public.project_phases FOR ALL
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id))
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

DROP POLICY IF EXISTS "Authenticated users can view project phases they own" ON public.project_phases;
CREATE POLICY "Authenticated users can view project phases they own"
ON public.project_phases FOR SELECT
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));


-- Table pour les Milestones d'une Phase
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_phase_id UUID REFERENCES public.project_phases(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- Nom ou objectif du milestone
    description TEXT,
    target_date DATE,
    status VARCHAR(50) DEFAULT 'À faire' NOT NULL CHECK (status IN ('À faire', 'En cours', 'Terminé', 'Validé Client')),
    milestone_order INTEGER, -- Pour l'ordre d'affichage dans la phase
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activer RLS pour project_milestones
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour project_milestones
DROP POLICY IF EXISTS "Users can manage milestones of phases they can access" ON public.project_milestones;
CREATE POLICY "Users can manage milestones of phases they can access" 
ON public.project_milestones FOR ALL
USING (auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.project_phases pp ON p.id = pp.project_id WHERE pp.id = project_phase_id))
WITH CHECK (auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.project_phases pp ON p.id = pp.project_id WHERE pp.id = project_phase_id));

DROP POLICY IF EXISTS "Authenticated users can view milestones of phases they can access" ON public.project_milestones;
CREATE POLICY "Authenticated users can view milestones of phases they can access"
ON public.project_milestones FOR SELECT
USING (auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.project_phases pp ON p.id = pp.project_id WHERE pp.id = project_phase_id));


-- Table pour les Sessions de Travail des Développeurs
CREATE TABLE IF NOT EXISTS public.developer_work_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_phase_id UUID REFERENCES public.project_phases(id) ON DELETE CASCADE NOT NULL,
    user_id_developer UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL, -- Qui a fait le travail
    milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL, -- Milestone optionnel lié
    session_date DATE DEFAULT CURRENT_DATE NOT NULL,
    duration_hours NUMERIC(4,2) NOT NULL CHECK (duration_hours > 0),
    description TEXT NOT NULL,
    screenshots_urls JSONB, -- Tableau d'URLs des screenshots
    linked_task_ids TEXT[], -- Tableau d'IDs de tâches (format libre pour l'instant)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Activer RLS pour developer_work_sessions
ALTER TABLE public.developer_work_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour developer_work_sessions
DROP POLICY IF EXISTS "Developers can create their own work sessions on accessible phases" ON public.developer_work_sessions;
CREATE POLICY "Developers can create their own work sessions on accessible phases" 
ON public.developer_work_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id_developer AND 
             auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.project_phases pp ON p.id = pp.project_id WHERE pp.id = project_phase_id));

DROP POLICY IF EXISTS "Developers can view their own work sessions" ON public.developer_work_sessions;
CREATE POLICY "Developers can view their own work sessions" 
ON public.developer_work_sessions FOR SELECT
USING (auth.uid() = user_id_developer);

DROP POLICY IF EXISTS "Developers can update their own work sessions" ON public.developer_work_sessions;
CREATE POLICY "Developers can update their own work sessions" 
ON public.developer_work_sessions FOR UPDATE
USING (auth.uid() = user_id_developer) 
WITH CHECK (auth.uid() = user_id_developer);

DROP POLICY IF EXISTS "Project owners can view work sessions on their projects" ON public.developer_work_sessions;
CREATE POLICY "Project owners can view work sessions on their projects" 
ON public.developer_work_sessions FOR SELECT
USING (auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.project_phases pp ON p.id = pp.project_id WHERE pp.id = project_phase_id));


-- Triggers pour appeler la fonction handle_updated_at (qui doit déjà exister) sur UPDATE pour les nouvelles tables
DROP TRIGGER IF EXISTS handle_project_phases_updated_at ON public.project_phases;
CREATE TRIGGER handle_project_phases_updated_at BEFORE UPDATE ON public.project_phases FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_project_milestones_updated_at ON public.project_milestones;
CREATE TRIGGER handle_project_milestones_updated_at BEFORE UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_developer_work_sessions_updated_at ON public.developer_work_sessions;
CREATE TRIGGER handle_developer_work_sessions_updated_at BEFORE UPDATE ON public.developer_work_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- Indexes pour améliorer les performances des requêtes fréquentes pour les nouvelles tables
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_phase_id ON public.project_milestones(project_phase_id);
CREATE INDEX IF NOT EXISTS idx_developer_work_sessions_project_phase_id ON public.developer_work_sessions(project_phase_id);
CREATE INDEX IF NOT EXISTS idx_developer_work_sessions_user_id_developer ON public.developer_work_sessions(user_id_developer);
CREATE INDEX IF NOT EXISTS idx_developer_work_sessions_milestone_id ON public.developer_work_sessions(milestone_id);


-- Commentaires sur les tables et colonnes
COMMENT ON TABLE public.project_phases IS 'Définit les grandes phases d''un projet de développement.';
COMMENT ON COLUMN public.project_phases.objectives IS 'Objectifs clairs à atteindre pour la fin de cette phase.';
COMMENT ON COLUMN public.project_phases.phase_order IS 'Permet de définir un ordre d''affichage manuel des phases.';

COMMENT ON TABLE public.project_milestones IS 'Définit les jalons ou objectifs intermédiaires au sein d''une phase de projet.';
COMMENT ON COLUMN public.project_milestones.status IS 'Statut du milestone (À faire, En cours, Terminé, Validé Client).';

COMMENT ON TABLE public.developer_work_sessions IS 'Enregistre les sessions de travail effectuées par les développeurs sur les projets.';
COMMENT ON COLUMN public.developer_work_sessions.screenshots_urls IS 'Tableau d''URLs des images stockées (ex: dans Supabase Storage).';
COMMENT ON COLUMN public.developer_work_sessions.linked_task_ids IS 'Tableau d''identifiants de tâches liées (provenant d''un Kanban externe ou futur Kanban interne).';