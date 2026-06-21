-- Feature 8: advanced breeding workflow
-- Run after supabase/schema.sql

alter table public.species add column if not exists default_ring_days int not null default 7;
alter table public.chicks add column if not exists weaned_date date;

create table if not exists public.bird_parentage (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  father_bird_id uuid references public.birds(id) on delete set null,
  mother_bird_id uuid references public.birds(id) on delete set null,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (bird_id)
);

create table if not exists public.nests (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  pair_id uuid references public.pairs(id) on delete set null,
  nest_number text not null,
  location text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.clutches add column if not exists nest_id uuid references public.nests(id) on delete set null;

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

alter table public.bird_parentage enable row level security;
alter table public.nests enable row level security;
alter table public.breeding_events enable row level security;

drop policy if exists "Users can manage own parentage" on public.bird_parentage;
drop policy if exists "Users can manage own nests" on public.nests;
drop policy if exists "Users can manage own breeding events" on public.breeding_events;

create policy "Users can manage own parentage" on public.bird_parentage for all using (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid())) with check (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid()));
create policy "Users can manage own nests" on public.nests for all using (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid())) with check (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid()));
create policy "Users can manage own breeding events" on public.breeding_events for all using (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid())) with check (aviary_id in (select a.id from public.aviaries a where a.owner_id = auth.uid()));
