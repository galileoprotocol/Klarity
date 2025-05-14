-- Schéma de base de données Klarity pour Supabase

-- Définition du type d'énumération pour le type de projet
CREATE TYPE project_type_enum AS ENUM (
  'webapp', 
  'mobileapp', 
  'desktopapp', 
  'saas', 
  'marketplace', 
  'ecommerce', 
  'ai_ml', 
  'other'
);

-- Table des projets
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  project_type project_type_enum,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Table des PRDs (Product Requirements Documents)
create table public.prds (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Table des Blueprint Techniques
create table public.blueprints (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Table des Validations de Vision
create table public.vision_validations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  score float,
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Politiques RLS (Row Level Security) pour la sécurité

-- Activation RLS
alter table public.projects enable row level security;
alter table public.prds enable row level security;
alter table public.blueprints enable row level security;
alter table public.vision_validations enable row level security;

-- Politiques Projects
create policy "Les utilisateurs peuvent voir leurs propres projets" 
  on public.projects for select 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent insérer leurs propres projets" 
  on public.projects for insert 
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent mettre à jour leurs propres projets" 
  on public.projects for update 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs propres projets" 
  on public.projects for delete 
  using (auth.uid() = user_id);

-- Politiques PRDs
create policy "Les utilisateurs peuvent voir leurs propres PRDs" 
  on public.prds for select 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent insérer leurs propres PRDs" 
  on public.prds for insert 
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent mettre à jour leurs propres PRDs" 
  on public.prds for update 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs propres PRDs" 
  on public.prds for delete 
  using (auth.uid() = user_id);

-- Politiques Blueprints
create policy "Les utilisateurs peuvent voir leurs propres blueprints" 
  on public.blueprints for select 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent insérer leurs propres blueprints" 
  on public.blueprints for insert 
  with check (auth.uid() = user_id);

create policy "Les utilisateurs peuvent mettre à jour leurs propres blueprints" 
  on public.blueprints for update 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent supprimer leurs propres blueprints" 
  on public.blueprints for delete 
  using (auth.uid() = user_id);

-- Politiques Vision Validations
create policy "Les utilisateurs peuvent voir leurs propres validations" 
  on public.vision_validations for select 
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent insérer leurs propres validations" 
  on public.vision_validations for insert 
  with check (auth.uid() = user_id);

-- Indexes pour améliorer les performances
create index projects_user_id_idx on public.projects(user_id);
create index prds_project_id_idx on public.prds(project_id);
create index prds_user_id_idx on public.prds(user_id);
create index blueprints_project_id_idx on public.blueprints(project_id);
create index blueprints_user_id_idx on public.blueprints(user_id);
create index vision_validations_project_id_idx on public.vision_validations(project_id);
create index vision_validations_user_id_idx on public.vision_validations(user_id);

-- Triggers pour mettre à jour le timestamp updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
before update on public.projects
for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
before update on public.prds
for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
before update on public.blueprints
for each row execute procedure public.handle_updated_at();
