-- Aviary Manager legacy database repair
-- Run this once in Supabase SQL Editor if your database was created from an older schema.
-- It aligns the existing database with the current app code without deleting data.

create extension if not exists "pgcrypto";

-- 1) Legacy user_id compatibility
-- The app now scopes records through aviaries.owner_id and table.aviary_id.
-- Older tables may still have NOT NULL user_id columns and foreign keys that block inserts.
do $$
declare
  t text;
  c record;
begin
  foreach t in array array[
    'species','birds','breeding_seasons','pairs','nests','clutches','eggs','chicks','treatments','sales','bird_photos','bird_parentage','breeding_events'
  ] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'user_id'
    ) then
      execute format('alter table public.%I alter column user_id drop not null', t);
    end if;

    for c in
      select conname
      from pg_constraint
      where conrelid = format('public.%I', t)::regclass
      and contype = 'f'
      and pg_get_constraintdef(oid) ilike '%user_id%'
    loop
      execute format('alter table public.%I drop constraint if exists %I', t, c.conname);
    end loop;
  end loop;
end $$;

-- 2) Core tables/columns expected by the app
create table if not exists public.aviaries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  location text,
  created_at timestamptz not null default now()
);

alter table public.aviaries add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.aviaries add column if not exists name text;
alter table public.aviaries add column if not exists location text;
alter table public.aviaries add column if not exists created_at timestamptz not null default now();

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  name text not null,
  scientific_name text,
  default_ring_days int not null default 7,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.species add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.species add column if not exists name text;
alter table public.species add column if not exists scientific_name text;
alter table public.species add column if not exists default_ring_days int not null default 7;
alter table public.species add column if not exists notes text;
alter table public.species add column if not exists created_at timestamptz not null default now();

create table if not exists public.birds (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  species_id uuid references public.species(id) on delete set null,
  ring_number text not null,
  name text,
  sex text not null default 'unknown',
  mutation text,
  date_of_birth date,
  status text not null default 'active',
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.birds add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.birds add column if not exists species_id uuid references public.species(id) on delete set null;
alter table public.birds add column if not exists ring_number text;
alter table public.birds add column if not exists name text;
alter table public.birds add column if not exists sex text not null default 'unknown';
alter table public.birds add column if not exists mutation text;
alter table public.birds add column if not exists date_of_birth date;
alter table public.birds add column if not exists status text not null default 'active';
alter table public.birds add column if not exists photo_url text;
alter table public.birds add column if not exists notes text;
alter table public.birds add column if not exists created_at timestamptz not null default now();
alter table public.birds add column if not exists updated_at timestamptz not null default now();

create table if not exists public.breeding_seasons (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  name text not null,
  year int not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.breeding_seasons add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.breeding_seasons add column if not exists name text;
alter table public.breeding_seasons add column if not exists year int;
alter table public.breeding_seasons add column if not exists is_active boolean not null default false;
alter table public.breeding_seasons add column if not exists created_at timestamptz not null default now();

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

alter table public.pairs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.pairs add column if not exists season_id uuid references public.breeding_seasons(id) on delete set null;
alter table public.pairs add column if not exists male_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists female_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists cage text;
alter table public.pairs add column if not exists status text not null default 'active';
alter table public.pairs add column if not exists notes text;
alter table public.pairs add column if not exists created_at timestamptz not null default now();

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

alter table public.nests add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.nests add column if not exists pair_id uuid references public.pairs(id) on delete set null;
alter table public.nests add column if not exists nest_number text;
alter table public.nests add column if not exists location text;
alter table public.nests add column if not exists status text not null default 'active';
alter table public.nests add column if not exists notes text;
alter table public.nests add column if not exists created_at timestamptz not null default now();

create table if not exists public.clutches (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  pair_id uuid references public.pairs(id) on delete cascade,
  nest_id uuid references public.nests(id) on delete set null,
  nest_number text,
  laid_start_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.clutches add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.clutches add column if not exists pair_id uuid references public.pairs(id) on delete cascade;
alter table public.clutches add column if not exists nest_id uuid references public.nests(id) on delete set null;
alter table public.clutches add column if not exists nest_number text;
alter table public.clutches add column if not exists laid_start_date date;
alter table public.clutches add column if not exists status text not null default 'active';
alter table public.clutches add column if not exists notes text;
alter table public.clutches add column if not exists created_at timestamptz not null default now();

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

alter table public.eggs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.eggs add column if not exists clutch_id uuid references public.clutches(id) on delete cascade;
alter table public.eggs add column if not exists egg_number int;
alter table public.eggs add column if not exists laid_date date;
alter table public.eggs add column if not exists fertile boolean;
alter table public.eggs add column if not exists hatched boolean not null default false;
alter table public.eggs add column if not exists expected_hatch_date date;
alter table public.eggs add column if not exists hatch_date date;
alter table public.eggs add column if not exists status text not null default 'incubating';
alter table public.eggs add column if not exists notes text;
alter table public.eggs add column if not exists created_at timestamptz not null default now();
alter table public.eggs add column if not exists updated_at timestamptz not null default now();

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

alter table public.chicks add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.chicks add column if not exists egg_id uuid references public.eggs(id) on delete set null;
alter table public.chicks add column if not exists bird_id uuid references public.birds(id) on delete set null;
alter table public.chicks add column if not exists hatch_date date;
alter table public.chicks add column if not exists ring_due_date date;
alter table public.chicks add column if not exists ringed_date date;
alter table public.chicks add column if not exists weaned_date date;
alter table public.chicks add column if not exists status text not null default 'alive';
alter table public.chicks add column if not exists notes text;
alter table public.chicks add column if not exists created_at timestamptz not null default now();
alter table public.chicks add column if not exists updated_at timestamptz not null default now();

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

alter table public.treatments add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.treatments add column if not exists bird_id uuid references public.birds(id) on delete cascade;
alter table public.treatments add column if not exists treatment_name text;
alter table public.treatments add column if not exists treatment_date date;
alter table public.treatments add column if not exists follow_up_date date;
alter table public.treatments add column if not exists dosage text;
alter table public.treatments add column if not exists reason text;
alter table public.treatments add column if not exists notes text;
alter table public.treatments add column if not exists created_at timestamptz not null default now();

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

alter table public.sales add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.sales add column if not exists bird_id uuid references public.birds(id) on delete set null;
alter table public.sales add column if not exists buyer_name text;
alter table public.sales add column if not exists sale_date date;
alter table public.sales add column if not exists amount numeric(10,2);
alter table public.sales add column if not exists payment_status text not null default 'paid';
alter table public.sales add column if not exists notes text;
alter table public.sales add column if not exists created_at timestamptz not null default now();

create table if not exists public.bird_photos (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.bird_photos add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.bird_photos add column if not exists bird_id uuid references public.birds(id) on delete cascade;
alter table public.bird_photos add column if not exists image_url text;
alter table public.bird_photos add column if not exists caption text;
alter table public.bird_photos add column if not exists created_at timestamptz not null default now();

create table if not exists public.bird_parentage (
  id uuid primary key default gen_random_uuid(),
  aviary_id uuid references public.aviaries(id) on delete cascade,
  bird_id uuid references public.birds(id) on delete cascade,
  father_bird_id uuid references public.birds(id) on delete set null,
  mother_bird_id uuid references public.birds(id) on delete set null,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

alter table public.bird_parentage add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.bird_parentage add column if not exists bird_id uuid references public.birds(id) on delete cascade;
alter table public.bird_parentage add column if not exists father_bird_id uuid references public.birds(id) on delete set null;
alter table public.bird_parentage add column if not exists mother_bird_id uuid references public.birds(id) on delete set null;
alter table public.bird_parentage add column if not exists source text not null default 'manual';
alter table public.bird_parentage add column if not exists created_at timestamptz not null default now();

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

alter table public.breeding_events add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.breeding_events add column if not exists pair_id uuid references public.pairs(id) on delete set null;
alter table public.breeding_events add column if not exists clutch_id uuid references public.clutches(id) on delete set null;
alter table public.breeding_events add column if not exists egg_id uuid references public.eggs(id) on delete set null;
alter table public.breeding_events add column if not exists chick_id uuid references public.chicks(id) on delete set null;
alter table public.breeding_events add column if not exists bird_id uuid references public.birds(id) on delete set null;
alter table public.breeding_events add column if not exists event_type text;
alter table public.breeding_events add column if not exists event_date date not null default current_date;
alter table public.breeding_events add column if not exists title text;
alter table public.breeding_events add column if not exists notes text;
alter table public.breeding_events add column if not exists created_at timestamptz not null default now();

-- 3) Backfill aviary_id on legacy rows where possible.
update public.species s set aviary_id = a.id from public.aviaries a where s.aviary_id is null and a.owner_id = s.user_id;
update public.birds b set aviary_id = a.id from public.aviaries a where b.aviary_id is null and a.owner_id = b.user_id;
update public.eggs e set aviary_id = c.aviary_id from public.clutches c where e.aviary_id is null and e.clutch_id = c.id;
update public.chicks ch set aviary_id = e.aviary_id from public.eggs e where ch.aviary_id is null and ch.egg_id = e.id;
update public.treatments tr set aviary_id = b.aviary_id from public.birds b where tr.aviary_id is null and tr.bird_id = b.id;
update public.sales sa set aviary_id = b.aviary_id from public.birds b where sa.aviary_id is null and sa.bird_id = b.id;
update public.bird_photos bp set aviary_id = b.aviary_id from public.birds b where bp.aviary_id is null and bp.bird_id = b.id;

-- 4) Helpful indexes for the current app.
create index if not exists idx_species_aviary_name on public.species (aviary_id, name);
create index if not exists idx_birds_aviary_ring on public.birds (aviary_id, ring_number);
create index if not exists idx_birds_aviary_status on public.birds (aviary_id, status);
create index if not exists idx_pairs_aviary_status on public.pairs (aviary_id, status);
create index if not exists idx_eggs_aviary_status on public.eggs (aviary_id, status);
create index if not exists idx_eggs_expected_hatch on public.eggs (aviary_id, expected_hatch_date);
create index if not exists idx_chicks_aviary_status on public.chicks (aviary_id, status);
create index if not exists idx_chicks_ring_due on public.chicks (aviary_id, ring_due_date);
create index if not exists idx_treatments_followup on public.treatments (aviary_id, follow_up_date);
create index if not exists idx_events_aviary_date on public.breeding_events (aviary_id, event_date desc);

-- 5) RLS and policies. Duplicate-policy errors are ignored by checking first.
do $$
declare
  t text;
begin
  foreach t in array array[
    'aviaries','species','birds','breeding_seasons','pairs','nests','clutches','eggs','chicks','treatments','sales','bird_photos','bird_parentage','breeding_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'aviaries' and policyname = 'Users can manage own aviaries') then
    create policy "Users can manage own aviaries" on public.aviaries for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
  end if;
end $$;

-- Generic per-aviary policies for child tables.
do $$
declare
  t text;
  p text;
begin
  foreach t in array array[
    'species','birds','breeding_seasons','pairs','nests','clutches','eggs','chicks','treatments','sales','bird_photos','bird_parentage','breeding_events'
  ] loop
    p := 'Users can manage own ' || t;
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = t and policyname = p) then
      execute format('create policy %I on public.%I for all using (exists (select 1 from public.aviaries a where a.id = %I.aviary_id and a.owner_id = auth.uid())) with check (exists (select 1 from public.aviaries a where a.id = %I.aviary_id and a.owner_id = auth.uid()))', p, t, t, t);
    end if;
  end loop;
end $$;

-- 6) Transactional RPC functions used by the breeding workflow.
create or replace function public.record_hatch_tx(
  p_aviary_id uuid,
  p_egg_id uuid,
  p_hatch_date date,
  p_ring_days int default 7
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_chick_id uuid;
  v_ring_due_date date;
begin
  v_ring_due_date := p_hatch_date + p_ring_days;

  update public.eggs
  set status = 'hatched', hatched = true, hatch_date = p_hatch_date
  where id = p_egg_id and aviary_id = p_aviary_id;

  if not found then
    raise exception 'Egg not found';
  end if;

  insert into public.chicks (aviary_id, egg_id, hatch_date, ring_due_date, status)
  values (p_aviary_id, p_egg_id, p_hatch_date, v_ring_due_date, 'alive')
  returning id into v_chick_id;

  insert into public.breeding_events (aviary_id, egg_id, chick_id, event_type, event_date, title, notes)
  values (p_aviary_id, p_egg_id, v_chick_id, 'hatched', p_hatch_date, 'Chick hatched', 'Ring due ' || v_ring_due_date::text);

  return v_chick_id;
end;
$$;

create or replace function public.mark_ringed_tx(
  p_aviary_id uuid,
  p_chick_id uuid,
  p_ring_number text,
  p_ringed_date date
)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_bird_id uuid;
  v_egg_id uuid;
  v_clutch_id uuid;
  v_pair_id uuid;
  v_father_id uuid;
  v_mother_id uuid;
begin
  select egg_id into v_egg_id
  from public.chicks
  where id = p_chick_id and aviary_id = p_aviary_id;

  if v_egg_id is null then
    raise exception 'Chick not found';
  end if;

  select clutch_id into v_clutch_id from public.eggs where id = v_egg_id and aviary_id = p_aviary_id;
  select pair_id into v_pair_id from public.clutches where id = v_clutch_id and aviary_id = p_aviary_id;
  select male_bird_id, female_bird_id into v_father_id, v_mother_id from public.pairs where id = v_pair_id and aviary_id = p_aviary_id;

  insert into public.birds (aviary_id, ring_number, status, notes)
  values (p_aviary_id, p_ring_number, 'young', 'Created from breeding workflow')
  returning id into v_bird_id;

  update public.chicks
  set status = 'ringed', ringed_date = p_ringed_date, bird_id = v_bird_id
  where id = p_chick_id and aviary_id = p_aviary_id;

  insert into public.bird_parentage (aviary_id, bird_id, father_bird_id, mother_bird_id, source)
  values (p_aviary_id, v_bird_id, v_father_id, v_mother_id, 'breeding_workflow');

  insert into public.breeding_events (aviary_id, pair_id, clutch_id, egg_id, chick_id, bird_id, event_type, event_date, title)
  values (p_aviary_id, v_pair_id, v_clutch_id, v_egg_id, p_chick_id, v_bird_id, 'ringed', p_ringed_date, 'Ringed as ' || p_ring_number);

  return v_bird_id;
end;
$$;
