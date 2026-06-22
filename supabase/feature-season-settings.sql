alter table public.breeding_seasons
  add column if not exists start_date date,
  add column if not exists end_date date;

update public.breeding_seasons
set
  start_date = coalesce(start_date, make_date(year, 1, 1)),
  end_date = coalesce(end_date, make_date(year, 12, 31))
where year is not null;

create unique index if not exists idx_breeding_seasons_aviary_year
  on public.breeding_seasons (aviary_id, year);
