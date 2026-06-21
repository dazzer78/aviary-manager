-- Aviary Manager legacy column type repair
-- Run this if you see errors such as: value too long for type character(1)
-- It widens older single-character columns to match the current app code.

alter table public.birds
alter column sex type text using trim(sex::text);

alter table public.birds
alter column sex set default 'unknown';

update public.birds
set sex = case lower(trim(sex))
  when 'm' then 'male'
  when 'f' then 'female'
  when 'u' then 'unknown'
  when 'x' then 'unknown'
  when '' then 'unknown'
  else lower(trim(sex))
end;

alter table public.birds
alter column status type text using trim(status::text);

alter table public.birds
alter column status set default 'active';

alter table public.eggs
alter column status type text using trim(status::text);

alter table public.eggs
alter column status set default 'incubating';

alter table public.chicks
alter column status type text using trim(status::text);

alter table public.chicks
alter column status set default 'alive';

alter table public.pairs
alter column status type text using trim(status::text);

alter table public.pairs
alter column status set default 'active';

alter table public.clutches
alter column status type text using trim(status::text);

alter table public.clutches
alter column status set default 'active';

alter table public.sales
alter column payment_status type text using trim(payment_status::text);

alter table public.sales
alter column payment_status set default 'paid';
