-- Cages / Aviaries module
-- Run this after the repair migration.

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

alter table public.cages add column if not exists aviary_id uuid references public.aviaries(id) on delete cascade;
alter table public.cages add column if not exists name text;
alter table public.cages add column if not exists cage_type text not null default 'breeding';
alter table public.cages add column if not exists location text;
alter table public.cages add column if not exists dimensions text;
alter table public.cages add column if not exists capacity int;
alter table public.cages add column if not exists status text not null default 'active';
alter table public.cages add column if not exists notes text;
alter table public.cages add column if not exists created_at timestamptz not null default now();
alter table public.cages add column if not exists updated_at timestamptz not null default now();

alter table public.birds add column if not exists cage_id uuid references public.cages(id) on delete set null;

create index if not exists idx_cages_aviary_status on public.cages (aviary_id, status);
create index if not exists idx_birds_aviary_cage on public.birds (aviary_id, cage_id);

alter table public.cages enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cages' and policyname = 'Users can manage own cages') then
    create policy "Users can manage own cages" on public.cages
    for all
    using (exists (select 1 from public.aviaries a where a.id = cages.aviary_id and a.owner_id = auth.uid()))
    with check (exists (select 1 from public.aviaries a where a.id = cages.aviary_id and a.owner_id = auth.uid()));
  end if;
end $$;
