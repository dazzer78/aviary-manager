-- Feature 8 RPC helpers
-- Run after schema.sql and feature-8-breeding-workflow.sql

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

  select clutch_id into v_clutch_id
  from public.eggs
  where id = v_egg_id and aviary_id = p_aviary_id;

  select pair_id into v_pair_id
  from public.clutches
  where id = v_clutch_id and aviary_id = p_aviary_id;

  select male_bird_id, female_bird_id into v_father_id, v_mother_id
  from public.pairs
  where id = v_pair_id and aviary_id = p_aviary_id;

  insert into public.birds (aviary_id, ring_number, status, notes)
  values (p_aviary_id, p_ring_number, 'young', 'Created from breeding workflow')
  returning id into v_bird_id;

  update public.chicks
  set status = 'ringed', ringed_date = p_ringed_date, bird_id = v_bird_id
  where id = p_chick_id and aviary_id = p_aviary_id;

  insert into public.bird_parentage (aviary_id, bird_id, father_bird_id, mother_bird_id, source)
  values (p_aviary_id, v_bird_id, v_father_id, v_mother_id, 'breeding_workflow')
  on conflict (bird_id) do update
  set father_bird_id = excluded.father_bird_id,
      mother_bird_id = excluded.mother_bird_id,
      source = excluded.source;

  insert into public.breeding_events (aviary_id, pair_id, clutch_id, egg_id, chick_id, bird_id, event_type, event_date, title)
  values (p_aviary_id, v_pair_id, v_clutch_id, v_egg_id, p_chick_id, v_bird_id, 'ringed', p_ringed_date, 'Ringed as ' || p_ring_number);

  return v_bird_id;
end;
$$;
