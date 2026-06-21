-- Aviary Manager initial Supabase schema
-- Run this in Supabase SQL Editor.

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
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.birds (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  species_id uuid references public.species(id) on delete set null,
  ring_number text not null,
  name text,
  sex text not null default 'unknown' check (sex in ('male', 'female', 'unknown')),
  mutation text,
  date_of_birth date,
  status text not null default 'active' check (status in ('active', 'young', 'sold', 'deceased', 'retained')),
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aviary_id, ring_number)
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
  status text not null default 'active' check (status in ('active', 'resting', 'separated', 'archived')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.clutches (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  pair_id uuid references public.pairs(id) on delete cascade,
  nest_number text,
  laid_start_date date,
  status text not null default 'active' check (status in ('active', 'complete', 'failed', 'archived')),
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
  status text not null default 'incubating' check (status in ('incubating', 'hatched', 'infertile', 'lost')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.chicks (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  egg_id uuid references public.eggs(id) on delete set null,
  bird_id uuid references public.birds(id) on delete set null,
  hatch_date date,
  ring_due_date date,
  ringed_date date,
  status text not null default 'alive' check (status in ('alive', 'ringed', 'weaned', 'sold', 'retained', 'lost')),
  notes text,
  created_at timestamptz not null default now()
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

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete set null,
  buyer_name text,
  sale_date date,
  amount numeric(10,2),
  payment_status text not null default 'paid' check (payment_status in ('paid', 'deposit', 'unpaid')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bird_photos (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.aviaries enable row level security;
alter table public.species enable row level security;
alter table public.birds enable row level security;
alter table public.breeding_seasons enable row level security;
alter table public.pairs enable row level security;
alter table public.clutches enable row level security;
alter table public.eggs enable row level security;
alter table public.chicks enable row level security;
alter table public.treatments enable row level security;
alter table public.sales enable row level security;
alter table public.bird_photos enable row level security;

create policy "Users can manage own aviaries" on public.aviaries for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- MVP policies: records are visible/editable when they belong to one of the user's aviaries.
create policy "Users can manage own species" on public.species for all using (exists (select 1 from public.aviaries a where a.id = species.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = species.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own birds" on public.birds for all using (exists (select 1 from public.aviaries a where a.id = birds.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = birds.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own seasons" on public.breeding_seasons for all using (exists (select 1 from public.aviaries a where a.id = breeding_seasons.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = breeding_seasons.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own pairs" on public.pairs for all using (exists (select 1 from public.aviaries a where a.id = pairs.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = pairs.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own clutches" on public.clutches for all using (exists (select 1 from public.aviaries a where a.id = clutches.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = clutches.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own eggs" on public.eggs for all using (exists (select 1 from public.aviaries a where a.id = eggs.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = eggs.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own chicks" on public.chicks for all using (exists (select 1 from public.aviaries a where a.id = chicks.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = chicks.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own treatments" on public.treatments for all using (exists (select 1 from public.aviaries a where a.id = treatments.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = treatments.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own sales" on public.sales for all using (exists (select 1 from public.aviaries a where a.id = sales.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = sales.aviary_id and a.owner_id = auth.uid()));
create policy "Users can manage own photos" on public.bird_photos for all using (exists (select 1 from public.aviaries a where a.id = bird_photos.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = bird_photos.aviary_id and a.owner_id = auth.uid()));
