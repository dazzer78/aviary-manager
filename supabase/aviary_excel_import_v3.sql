-- Aviary Manager Excel import v3
-- Generated from My Birds_21_06_2026 22_34.xlsx
-- This script is schema-aware and imports the legacy workbook into the current Aviary Manager model.
-- It clears existing aviary data tables before importing, but it keeps your aviary/user record.

begin;

create extension if not exists "pgcrypto";

-- Ensure at least one aviary exists. The app normally creates this automatically.
insert into public.aviaries (owner_id, name)
select auth.uid(), 'Imported Aviary'
where not exists (select 1 from public.aviaries);

-- Add support columns used by the import and future app features.
alter table public.species add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.species add column if not exists default_ring_days int not null default 7;
alter table public.species add column if not exists incubation_days int;
alter table public.species add column if not exists legacy_bird_count int;
alter table public.species add column if not exists notes text;

alter table public.cages add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.cages add column if not exists cage_type text default 'breeding';
alter table public.cages add column if not exists location text;
alter table public.cages add column if not exists dimensions text;
alter table public.cages add column if not exists capacity int;
alter table public.cages add column if not exists status text default 'active';

alter table public.birds add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.birds add column if not exists species_id uuid references public.species(id) on delete set null;
alter table public.birds add column if not exists cage_id uuid references public.cages(id) on delete set null;
alter table public.birds add column if not exists ring_number text;
alter table public.birds add column if not exists leg_ring text;
alter table public.birds add column if not exists name text;
alter table public.birds add column if not exists sex text default 'unknown';
alter table public.birds add column if not exists status text default 'active';
alter table public.birds add column if not exists active boolean default true;
alter table public.birds add column if not exists date_of_birth date;
alter table public.birds add column if not exists date_acquired date;
alter table public.birds add column if not exists mutation text;
alter table public.birds add column if not exists color_mutation text;
alter table public.birds add column if not exists photo_url text;
alter table public.birds add column if not exists band_date date;
alter table public.birds add column if not exists variety text;
alter table public.birds add column if not exists origin_breeder text;
alter table public.birds add column if not exists buy_price numeric(10,2);
alter table public.birds add column if not exists purchase_date date;
alter table public.birds add column if not exists genotype text;
alter table public.birds add column if not exists phenotype text;
alter table public.birds add column if not exists sell_price numeric(10,2);
alter table public.birds add column if not exists sell_date date;
alter table public.birds add column if not exists buyer text;
alter table public.birds add column if not exists death_date date;
alter table public.birds add column if not exists death_reason text;
alter table public.birds add column if not exists exchange_date date;
alter table public.birds add column if not exists exchange_breeder text;
alter table public.birds add column if not exists exchange_reason text;
alter table public.birds add column if not exists lost_date date;
alter table public.birds add column if not exists lost_details text;
alter table public.birds add column if not exists donation_date date;
alter table public.birds add column if not exists donation_breeder text;
alter table public.birds add column if not exists legacy_uuid text;
alter table public.birds add column if not exists legacy_id text;

alter table public.pairs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.pairs add column if not exists male_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists female_bird_id uuid references public.birds(id) on delete set null;
alter table public.pairs add column if not exists cage text;
alter table public.pairs add column if not exists status text default 'active';
alter table public.pairs add column if not exists start_date date;
alter table public.pairs add column if not exists end_date date;
alter table public.pairs add column if not exists legacy_male_ring text;
alter table public.pairs add column if not exists legacy_female_ring text;

alter table public.clutches add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.clutches add column if not exists pair_id uuid references public.pairs(id) on delete cascade;
alter table public.clutches add column if not exists nest_number text;
alter table public.clutches add column if not exists laid_start_date date;
alter table public.clutches add column if not exists creation_date date;
alter table public.clutches add column if not exists status text default 'active';
alter table public.clutches add column if not exists legacy_clutch_number text;

alter table public.eggs add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.eggs add column if not exists clutch_id uuid references public.clutches(id) on delete cascade;
alter table public.eggs add column if not exists egg_number int;
alter table public.eggs add column if not exists laid_date date;
alter table public.eggs add column if not exists fertile boolean;
alter table public.eggs add column if not exists hatched boolean default false;
alter table public.eggs add column if not exists expected_hatch_date date;
alter table public.eggs add column if not exists hatch_date date;
alter table public.eggs add column if not exists status text default 'incubating';
alter table public.eggs add column if not exists status_date date;
alter table public.eggs add column if not exists band_ring_number text;
alter table public.eggs add column if not exists start_incubation_date date;
alter table public.eggs add column if not exists band_date date;
alter table public.eggs add column if not exists legacy_clutch_number text;

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
alter table public.bird_parentage add column if not exists source text default 'legacy_import';

-- Remove legacy NOT NULL constraints that conflict with aviary_id based app data.
do $$
declare r record;
begin
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema='public'
    and table_name in ('species','cages','birds','pairs','clutches','eggs','chicks','sales','tasks','treatments','bird_photos','bird_parentage')
    and column_name in ('user_id','species_id','cage_id','bird_id','pair_id','clutch_id','egg_id','father_bird_id','mother_bird_id','aviary_id','name','ring_number','leg_ring')
  loop
    execute format('alter table public.%I alter column %I drop not null', r.table_name, r.column_name);
  end loop;
end $$;

-- Drop remaining legacy NOT NULL constraints that can block imports from older aviary managers.
-- This handles columns such as clutches.breeding_pair_id and other legacy required fields.
do $$
declare r record;
begin
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name in ('species','cages','birds','pairs','clutches','eggs','chicks','sales','tasks','treatments','bird_photos','bird_parentage')
      and column_name not in ('id')
      and is_nullable = 'NO'
  loop
    begin
      execute format('alter table public.%I alter column %I drop not null', r.table_name, r.column_name);
    exception when others then
      null;
    end;
  end loop;
end $$;

-- Widen legacy char fields and remove old enum-like check constraints where needed.
alter table public.birds alter column sex type text using trim(sex::text);
alter table public.birds alter column sex set default 'unknown';
alter table public.birds alter column status type text using trim(status::text);
alter table public.birds alter column status set default 'active';
alter table public.eggs alter column status type text using trim(status::text);
alter table public.eggs alter column status set default 'incubating';
alter table public.chicks alter column status type text using trim(status::text);
alter table public.chicks alter column status set default 'alive';
alter table public.pairs alter column status type text using trim(status::text);
alter table public.pairs alter column status set default 'active';
alter table public.clutches alter column status type text using trim(status::text);
alter table public.clutches alter column status set default 'active';

-- This repository copy only includes the compatibility header.
-- Use the downloadable /mnt/data/aviary_excel_import_v3.sql for the full data import body.
rollback;
