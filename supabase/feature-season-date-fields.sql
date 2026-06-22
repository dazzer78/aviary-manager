-- Fix for existing databases where breeding_seasons was created before season date fields existed.

ALTER TABLE public.breeding_seasons
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Backfill dates for existing season rows using calendar-year defaults.
UPDATE public.breeding_seasons
SET
  start_date = COALESCE(start_date, make_date(year, 1, 1)),
  end_date = COALESCE(end_date, make_date(year, 12, 31))
WHERE year IS NOT NULL;
