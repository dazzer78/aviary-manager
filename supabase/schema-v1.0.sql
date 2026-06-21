-- Aviary Manager schema v1.0
-- Authoritative current schema for a clean Supabase project.

create extension if not exists "pgcrypto";

create table if not exists public.aviaries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  name text not null,
  scientific_name text,
  default_ring_days int not null default 7,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.cages (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  name text not null,
  cage_type text not null default 'breeding',
  location text,
  dimensions text,
  capacity int,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.birds (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  species_id uuid references public.species(id) on delete set null,
  cage_id uuid references public.cages(id) on delete set null,
  ring_number text not null,
  name text,
  sex text not null default 'unknown',
  mutation text,
  date_of_birth date,
  status text not null default 'active',
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aviary_id, ring_number)
);

create table if not exists public.bird_parentage (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade unique,
  father_bird_id uuid references public.birds(id) on delete set null,
  mother_bird_id uuid references public.birds(id) on delete set null,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.breeding_seasons (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  name text not null,
  year int not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.pairs (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  season_id uuid references public.breeding_seasons(id) on delete set null,
  male_bird_id uuid references public.birds(id) on delete set null,
  female_bird_id uuid references public.birds(id) on delete set null,
  cage text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.clutches (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  pair_id uuid references public.pairs(id) on delete cascade,
  nest_number text,
  laid_start_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.eggs (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  clutch_id uuid references public.clutches(id) on delete cascade,
  egg_number int,
  laid_date date,
  fertile boolean,
  hatched boolean not null default false,
  expected_hatch_date date,
  hatch_date date,
  status text not null default 'incubating',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chicks (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  egg_id uuid references public.eggs(id) on delete set null,
  bird_id uuid references public.birds(id) on delete set null,
  hatch_date date,
  ring_due_date date,
  ringed_date date,
  weaned_date date,
  status text not null default 'alive',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  treatment_name text not null,
  treatment_date date not null,
  follow_up_date date,
  dosage text,
  reason text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete set null,
  cage_id uuid references public.cages(id) on delete set null,
  task_type text not null default 'general',
  title text not null,
  description text,
  due_at timestamptz,
  priority text not null default 'medium',
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete set null,
  buyer_name text,
  sale_date date,
  amount numeric(10,2),
  payment_status text not null default 'paid',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bird_photos (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  image_url text not null,
  storage_path text,
  file_name text,
  is_primary boolean not null default false,
  caption text,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.breeding_events (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  pair_id uuid references public.pairs(id) on delete set null,
  clutch_id uuid references public.clutches(id) on delete set null,
  egg_id uuid references public.eggs(id) on delete set null,
  chick_id uuid references public.chicks(id) on delete set null,
  bird_id uuid references public.birds(id) on delete set null,
  event_type text not null,
  event_date date not null default current_date,
  title text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_birds_aviary_ring on public.birds (aviary_id, ring_number);
create index if not exists idx_birds_aviary_cage on public.birds (aviary_id, cage_id);
create index if not exists idx_tasks_aviary_status_due on public.tasks (aviary_id, status, due_at);
create index if not exists idx_photos_bird_primary on public.bird_photos (bird_id, is_primary);
create index if not exists idx_events_aviary_date on public.breeding_events (aviary_id, event_date desc);

alter table public.aviaries enable row level security;
alter table public.species enable row level security;
alter table public.cages enable row level security;
alter table public.birds enable row level security;
alter table public.bird_parentage enable row level security;
alter table public.breeding_seasons enable row level security;
alter table public.pairs enable row level security;
alter table public.clutches enable row level security;
alter table public.eggs enable row level security;
alter table public.chicks enable row level security;
alter table public.treatments enable row level security;
alter table public.tasks enable row level security;
alter table public.sales enable row level security;
alter table public.bird_photos enable row level security;
alter table public.breeding_events enable row level security;
