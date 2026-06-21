-- Legacy import compatibility for data exported from another aviary manager.
-- Run this before rerunning aviary_excel_import.sql.
-- It keeps the legacy columns for imported data but removes old constraints that block modern Aviary Manager records.

create extension if not exists "pgcrypto";

-- Core compatibility columns used by the current app and/or legacy import.
alter table public.aviaries add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table public.species add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.species add column if not exists scientific_name text;
alter table public.species add column if not exists default_ring_days int not null default 7;
alter table public.species add column if not exists notes text;

alter table public.cages add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.cages add column if not exists cage_type text default 'breeding';
alter table public.cages add column if not exists location text;
alter table public.cages add column if not exists dimensions text;
alter table public.cages add column if not exists capacity int;
alter table public.cages add column if not exists status text default 'active';

alter table public.birds add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.birds add column if not exists ring_number text;
alter table public.birds add column if not exists mutation text;
alter table public.birds add column if not exists status text default 'active';
alter table public.birds add column if not exists photo_url text;
alter table public.birds add column if not exists cage_id uuid references public.cages(id) on delete set null;
alter table public.birds add column if not exists species_id uuid references public.species(id) on delete set null;
alter table public.birds add column if not exists color_mutation text;
alter table public.birds add column if not exists leg_ring text;
alter table public.birds add column if not exists active boolean default true;
alter table public.birds add column if not exists date_acquired date;

alter table public.pairs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.pairs add column if not exists season_id uuid;
alter table public.pairs add column if not exists male_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists female_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists cage text;
alter table public.pairs add column if not exists status text default 'active';

alter table public.clutches add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.clutches add column if not exists pair_id uuid references public.pairs(id) on delete cascade;
alter table public.clutches add column if not exists nest_number text;
alter table public.clutches add column if not exists laid_start_date date;
alter table public.clutches add column if not exists status text default 'active';

alter table public.eggs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.eggs add column if not exists clutch_id uuid references public.clutches(id) on delete cascade;
alter table public.eggs add column if not exists egg_number int;
alter table public.eggs add column if not exists laid_date date;
alter table public.eggs add column if not exists fertile boolean;
alter table public.eggs add column if not exists hatched boolean default false;
alter table public.eggs add column if not exists expected_hatch_date date;
alter table public.eggs add column if not exists hatch_date date;
alter table public.eggs add column if not exists status text default 'incubating';

alter table public.chicks add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.chicks add column if not exists egg_id uuid references public.eggs(id) on delete set null;
alter table public.chicks add column if not exists bird_id uuid references public.birds(id) on delete set null;
alter table public.chicks add column if not exists hatch_date date;
alter table public.chicks add column if not exists ring_due_date date;
alter table public.chicks add column if not exists ringed_date date;
alter table public.chicks add column if not exists weaned_date date;
alter table public.chicks add column if not exists status text default 'alive';

alter table public.sales add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.sales add column if not exists bird_id uuid references public.birds(id) on delete set null;
alter table public.sales add column if not exists buyer_name text;
alter table public.sales add column if not exists sale_date date;
alter table public.sales add column if not exists amount numeric(10,2);
alter table public.sales add column if not exists payment_status text default 'paid';

alter table public.bird_parentage add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.bird_parentage add column if not exists bird_id uuid references public.birds(id) on delete cascade;
alter table public.bird_parentage add column if not exists father_bird_id uuid references public.birds(id) on delete set null;
alter table public.bird_parentage add column if not exists mother_bird_id uuid references public.birds(id) on delete set null;
alter table public.bird_parentage add column if not exists source text default 'manual';

alter table public.tasks add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.tasks add column if not exists due_at timestamptz;

-- Keep legacy columns available, but make them optional.
do $$
declare
  r record;
begin
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
    and table_name in (
      'species','cages','birds','pairs','clutches','eggs','chicks','sales','tasks','treatments','bird_photos','bird_parentage'
    )
    and column_name in (
      'user_id','species_id','cage_id','bird_id','pair_id','clutch_id','egg_id','father_bird_id','mother_bird_id','aviary_id','name','ring_number','leg_ring'
    )
  loop
    execute format('alter table public.%I alter column %I drop not null', r.table_name, r.column_name);
  end loop;
end $$;

-- Widen old one-character fields.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='birds' and column_name='sex') then
    alter table public.birds alter column sex type text using trim(sex::text);
    alter table public.birds alter column sex set default 'unknown';
  end if;

  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='birds' and column_name='status') then
    alter table public.birds alter column status type text using trim(status::text);
    alter table public.birds alter column status set default 'active';
  end if;
end $$;

-- Drop legacy user_id foreign keys that block imports where user_id is intentionally null.
do $$
declare
  t text;
  c record;
begin
  foreach t in array array['species','cages','birds','pairs','clutches','eggs','chicks','sales','tasks','treatments','bird_photos','bird_parentage'] loop
    if to_regclass(format('public.%I', t)) is not null then
      for c in
        select conname
        from pg_constraint
        where conrelid = format('public.%I', t)::regclass
        and contype = 'f'
        and pg_get_constraintdef(oid) ilike '%user_id%'
      loop
        execute format('alter table public.%I drop constraint if exists %I', t, c.conname);
      end loop;
    end if;
  end loop;
end $$;

-- Allow safe parentage re-imports.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'bird_parentage_bird_id_key') then
    alter table public.bird_parentage drop constraint bird_parentage_bird_id_key;
  end if;
end $$;

create unique index if not exists idx_bird_parentage_one_per_bird on public.bird_parentage (bird_id) where bird_id is not null;

-- Indexes used by the app.
create index if not exists idx_birds_aviary_ring on public.birds (aviary_id, ring_number);
create index if not exists idx_birds_aviary_cage on public.birds (aviary_id, cage_id);
create index if not exists idx_cages_aviary_status on public.cages (aviary_id, status);
create index if not exists idx_tasks_aviary_status_due on public.tasks (aviary_id, status, due_at);
