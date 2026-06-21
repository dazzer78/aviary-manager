-- Adds optional fields used by the Breeding Pairs screen for spreadsheet imports.
-- Run this if the Breeding page reports missing legacy_* columns on pairs.

ALTER TABLE public.pairs
ADD COLUMN IF NOT EXISTS legacy_male_ring text,
ADD COLUMN IF NOT EXISTS legacy_female_ring text,
ADD COLUMN IF NOT EXISTS legacy_clutches integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS legacy_eggs integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS legacy_descendants text,
ADD COLUMN IF NOT EXISTS nest_number text,
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date;

-- If the legacy import put birds into pairs using linked bird IDs, backfill the ring text fields for display.
UPDATE public.pairs p
SET legacy_male_ring = COALESCE(p.legacy_male_ring, b.ring_number, b.leg_ring)
FROM public.birds b
WHERE p.male_bird_id = b.id
AND p.legacy_male_ring IS NULL;

UPDATE public.pairs p
SET legacy_female_ring = COALESCE(p.legacy_female_ring, b.ring_number, b.leg_ring)
FROM public.birds b
WHERE p.female_bird_id = b.id
AND p.legacy_female_ring IS NULL;

-- Backfill summary counts from imported live tables where available.
UPDATE public.pairs p
SET legacy_clutches = COALESCE(summary.clutch_count, 0)
FROM (
  SELECT pair_id, COUNT(*)::integer AS clutch_count
  FROM public.clutches
  WHERE pair_id IS NOT NULL
  GROUP BY pair_id
) summary
WHERE p.id = summary.pair_id
AND COALESCE(p.legacy_clutches, 0) = 0;

UPDATE public.pairs p
SET legacy_eggs = COALESCE(summary.egg_count, 0)
FROM (
  SELECT c.pair_id, COUNT(e.id)::integer AS egg_count
  FROM public.clutches c
  JOIN public.eggs e ON e.clutch_id = c.id
  WHERE c.pair_id IS NOT NULL
  GROUP BY c.pair_id
) summary
WHERE p.id = summary.pair_id
AND COALESCE(p.legacy_eggs, 0) = 0;
