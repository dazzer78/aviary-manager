-- Egg lifecycle events
-- This removes the need for users to manually edit egg status.
-- Current egg/chick state should be derived from the most recent lifecycle events.

create table if not exists public.egg_events (
  id uuid primary key default gen_random_uuid(),
  egg_id uuid not null,
  event_type text not null,
  event_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),

  constraint egg_events_event_type_check check (
    event_type in (
      'egg_created',
      'hatched',
      'ringed',
      'not_fertilised',
      'broken',
      'abandoned',
      'dead_in_shell',
      'dead_before_ringing'
    )
  )
);

create index if not exists egg_events_egg_id_event_date_idx
  on public.egg_events (egg_id, event_date desc, created_at desc);

alter table public.egg_events enable row level security;

create policy "Users can view egg events"
  on public.egg_events
  for select
  using (auth.uid() is not null);

create policy "Users can insert egg events"
  on public.egg_events
  for insert
  with check (auth.uid() is not null);

create policy "Users can update egg events"
  on public.egg_events
  for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Backfill starter events from existing eggs table when present.
-- This is intentionally defensive because the current schema may still evolve.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'eggs'
  ) then
    insert into public.egg_events (egg_id, event_type, event_date, notes)
    select
      e.id,
      'egg_created',
      coalesce(e.laid_date, e.created_at::date, current_date),
      'Backfilled from existing egg record'
    from public.eggs e
    where not exists (
      select 1
      from public.egg_events ee
      where ee.egg_id = e.id
        and ee.event_type = 'egg_created'
    );
  end if;
end $$;

comment on table public.egg_events is
  'Append-only egg lifecycle event history. Egg status is derived from events rather than manually edited.';
