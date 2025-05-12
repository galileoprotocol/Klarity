-- Création du type ENUM pour les types de projets
create type public.project_type_enum as enum (
  'SaaS',
  'Mobile',
  'Marketplace',
  'AI',
  'Web App',
  'Autre' -- Ajoutez/modifiez selon vos besoins
);

-- Table des projets
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  project_type public.project_type_enum, -- Utilisation de l'ENUM
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
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null -- Ajout de updated_at
);

-- Triggers pour mettre à jour le timestamp updated_at (Fonction unique)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Application du trigger aux tables
create trigger handle_projects_updated_at
before update on public.projects
for each row execute procedure public.handle_updated_at();

create trigger handle_prds_updated_at
before update on public.prds
for each row execute procedure public.handle_updated_at();

create trigger handle_blueprints_updated_at
before update on public.blueprints
for each row execute procedure public.handle_updated_at();

create trigger handle_vision_validations_updated_at -- Trigger pour vision_validations
before update on public.vision_validations
for each row execute procedure public.handle_updated_at();


-- Politiques RLS (Row Level Security) pour la sécurité

-- Activation RLS
alter table public.projects enable row level security;
alter table public.prds enable row level security;
alter table public.blueprints enable row level security;
alter table public.vision_validations enable row level security;

-- Politiques Projects
create policy "Allow users to view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Politiques PRDs
create policy "Allow users to view their own PRDs"
  on public.prds for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own PRDs"
  on public.prds for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own PRDs"
  on public.prds for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own PRDs"
  on public.prds for delete
  using (auth.uid() = user_id);

-- Politiques Blueprints
create policy "Allow users to view their own blueprints"
  on public.blueprints for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own blueprints"
  on public.blueprints for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own blueprints"
  on public.blueprints for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own blueprints"
  on public.blueprints for delete
  using (auth.uid() = user_id);

-- Politiques Vision Validations
create policy "Allow users to view their own validations"
  on public.vision_validations for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own validations"
  on public.vision_validations for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own validations" -- Ajout politique UPDATE si nécessaire
  on public.vision_validations for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own validations" -- Ajout politique DELETE si nécessaire
  on public.vision_validations for delete
  using (auth.uid() = user_id);

-- Indexes pour améliorer les performances
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists prds_project_id_idx on public.prds(project_id);
create index if not exists prds_user_id_idx on public.prds(user_id);
create index if not exists blueprints_project_id_idx on public.blueprints(project_id);
create index if not exists blueprints_user_id_idx on public.blueprints(user_id);
create index if not exists vision_validations_project_id_idx on public.vision_validations(project_id);
create index if not exists vision_validations_user_id_idx on public.vision_validations(user_id);
