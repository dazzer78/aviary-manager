import { redirect } from "next/navigation";
import { createDefaultSeasonDefinition, mergeSeasonDefinitions, matchesSeason, type SeasonDefinition } from "@/lib/season";
import { createClient } from "@/lib/supabase/server";

export type Species = {
  id: string;
  aviary_id: string;
  name: string;
  scientific_name: string | null;
  notes: string | null;
  created_at: string;
};

export type Cage = {
  id: string;
  aviary_id: string;
  name: string;
  location: string | null;
  capacity: number | null;
  status: string | null;
  created_at: string;
};

export type Bird = {
  id: string;
  aviary_id?: string;
  species_id?: string | null;
  ring_number: string;
  name: string | null;
  sex: "male" | "female" | "unknown";
  mutation: string | null;
  date_of_birth: string | null;
  status: string;
  photo_url: string | null;
  notes: string | null;
  cage_id?: string | null;
  species?: { name: string } | null;
  created_at?: string | null;
};

export type Pair = {
  id: string;
  aviary_id: string;
  season_id: string | null;
  male_bird_id: string | null;
  female_bird_id: string | null;
  cage: string | null;
  status: "active" | "resting" | "separated" | "archived" | string;
  notes: string | null;
  created_at: string;
};

export type Clutch = {
  id: string;
  aviary_id: string;
  pair_id: string | null;
  nest_number: string | null;
  laid_start_date: string | null;
  status: "active" | "complete" | "failed" | "archived" | string;
  notes: string | null;
  created_at: string;
};

export type Egg = {
  id: string;
  aviary_id: string;
  clutch_id: string | null;
  egg_number: number | null;
  laid_date: string | null;
  fertile: boolean | null;
  hatched: boolean;
  expected_hatch_date: string | null;
  hatch_date: string | null;
  status: "incubating" | "hatched" | "infertile" | "lost" | string;
  notes?: string | null;
  created_at?: string;
};

export type Chick = {
  id: string;
  aviary_id: string;
  egg_id: string | null;
  bird_id: string | null;
  hatch_date: string | null;
  ring_due_date: string | null;
  ringed_date: string | null;
  status: "alive" | "ringed" | "weaned" | "sold" | "retained" | "lost" | string;
  notes?: string | null;
  created_at?: string;
};

export type Treatment = {
  id: string;
  aviary_id: string;
  bird_id: string;
  treatment_name: string;
  treatment_date?: string;
  follow_up_date: string | null;
  dosage: string | null;
  reason?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type Sale = {
  id: string;
  aviary_id: string;
  bird_id: string | null;
  buyer_name?: string | null;
  sale_date: string | null;
  amount: number | null;
  payment_status?: "paid" | "deposit" | "unpaid" | string;
  notes?: string | null;
  created_at?: string;
};

export type Task = {
  id: string;
  aviary_id: string;
  cage_id: string | null;
  bird_id: string | null;
  title: string;
  description?: string | null;
  due_at: string | null;
  status: "pending" | "completed" | "overdue" | string;
  priority: "low" | "medium" | "high" | string;
  created_at?: string;
};

export type BirdPhoto = {
  id: string;
  aviary_id: string;
  bird_id: string;
  image_url: string;
  caption: string | null;
  is_primary?: boolean | null;
  file_name?: string | null;
  created_at: string;
};

export type BreedingSeason = SeasonDefinition;

export function getSpeciesName(species: { name?: string | null } | { name?: string | null }[] | null | undefined) {
  if (Array.isArray(species)) return species[0]?.name ?? undefined;
  return species?.name ?? undefined;
}

export function getRingNumber(bird: { ring_number?: string | null } | null | undefined, fallback = "-") {
  return bird?.ring_number ?? fallback;
}

export function getMutation(bird: { mutation?: string | null } | null | undefined, fallback = "-") {
  return bird?.mutation ?? fallback;
}

export async function getUserAndAviary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: existing, error } = await supabase
    .from("aviaries")
    .select("id, name")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (existing) return { supabase, user, aviary: existing };

  const { data: created, error: createError } = await supabase
    .from("aviaries")
    .insert({ owner_id: user.id, name: "My Aviary" })
    .select("id, name")
    .single();

  if (createError) throw new Error(createError.message);
  return { supabase, user, aviary: created };
}

export async function getSeasonDefinitions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  aviaryId: string
) {
  const { data, error } = await supabase
    .from("breeding_seasons")
    .select("id, aviary_id, name, year, start_date, end_date, is_active, created_at")
    .eq("aviary_id", aviaryId)
    .order("year", { ascending: false });

  if (error) throw new Error(error.message);

  return mergeSeasonDefinitions((data ?? []) as BreedingSeason[]);
}

export function getSeasonDefinitionByYear(seasons: BreedingSeason[], year: number) {
  return seasons.find((season) => season.year === year) ?? createDefaultSeasonDefinition(year);
}

export async function getDashboardData(season: BreedingSeason) {
  const { supabase, aviary } = await getUserAndAviary();

  const [birds, pairs, eggs, chicks, treatments, sales, cages, tasks] = await Promise.all([
    supabase.from("birds").select("*, species(name)").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("pairs").select("id, status, created_at").eq("aviary_id", aviary.id),
    supabase.from("eggs").select("id, status, laid_date, expected_hatch_date, hatch_date, created_at").eq("aviary_id", aviary.id),
    supabase.from("chicks").select("id, status, hatch_date, ring_due_date, created_at").eq("aviary_id", aviary.id),
    supabase.from("treatments").select("id, treatment_name, treatment_date, follow_up_date, created_at").eq("aviary_id", aviary.id).order("treatment_date", { ascending: false }),
    supabase.from("sales").select("id, amount, sale_date, created_at").eq("aviary_id", aviary.id).order("sale_date", { ascending: false }),
    supabase.from("cages").select("id, name, capacity, status").eq("aviary_id", aviary.id),
    supabase.from("tasks").select("id, title, due_at, status, priority, created_at").eq("aviary_id", aviary.id).neq("status", "completed").order("due_at", { ascending: true, nullsFirst: false }),
  ]);

  for (const result of [birds, pairs, eggs, chicks, treatments, sales, cages, tasks]) {
    if (result.error) throw new Error(result.error.message);
  }

  const seasonBirds = (birds.data ?? []).filter((bird) =>
    matchesSeason(season, bird.date_of_birth, bird.created_at)
  ) as Bird[];

  const seasonPairs = (pairs.data ?? []).filter((pair) =>
    matchesSeason(season, pair.created_at)
  );

  const seasonEggs = (eggs.data ?? []).filter((egg) =>
    matchesSeason(season, egg.laid_date, egg.hatch_date, egg.expected_hatch_date, egg.created_at)
  );

  const seasonChicks = (chicks.data ?? []).filter((chick) =>
    matchesSeason(season, chick.hatch_date, chick.ring_due_date, chick.created_at)
  );

  const seasonTreatments = (treatments.data ?? []).filter((treatment) =>
    matchesSeason(season, treatment.treatment_date, treatment.follow_up_date, treatment.created_at)
  );

  const seasonSales = (sales.data ?? []).filter((sale) =>
    matchesSeason(season, sale.sale_date, sale.created_at)
  );

  const seasonTasks = (tasks.data ?? []).filter((task) =>
    matchesSeason(season, task.due_at, task.created_at)
  );

  return {
    aviary,
    birds: seasonBirds,
    pairs: seasonPairs,
    eggs: seasonEggs,
    chicks: seasonChicks,
    treatments: seasonTreatments,
    sales: seasonSales,
    cages: cages.data ?? [],
    tasks: seasonTasks,
  };
}

const stockSpeciesRules: Array<{ terms: string[]; query: string }> = [
  { terms: ["gouldian", "gouldian finch", "gouldianfinch"], query: "gouldian finch,bird" },
  { terms: ["zebra", "zebra finch", "zebrafinch"], query: "zebra finch,bird" },
  { terms: ["canary", "canaries", "fife", "gloster", "norwich", "lizard"], query: "yellow canary,bird" },
  { terms: ["budgie", "budgerigar", "parakeet"], query: "budgerigar,bird" },
  { terms: ["lovebird"], query: "lovebird,parrot,bird" },
  { terms: ["cockatiel"], query: "cockatiel,bird" },
  { terms: ["conure"], query: "conure,parrot,bird" },
  { terms: ["kakariki"], query: "kakariki,parrot,bird" },
  { terms: ["parrot"], query: "parrot,bird" },
  { terms: ["society", "bengalese"], query: "society finch,bird" },
  { terms: ["java"], query: "java sparrow,bird" },
  { terms: ["munia"], query: "munia,bird" },
  { terms: ["waxbill"], query: "waxbill,bird" },
  { terms: ["finch"], query: "finch,bird" },
  { terms: ["dove"], query: "dove,bird" },
  { terms: ["pigeon"], query: "pigeon,bird" },
  { terms: ["quail", "buttonquail"], query: "quail,bird" },
];

function normaliseSpeciesName(speciesName?: string | null) {
  return (speciesName ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function stableImageLock(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % 10000;
}

function stockPhotoUrl(query: string) {
  const safeQuery = encodeURIComponent(query.replace(/\s+/g, " ").trim());
  return `https://loremflickr.com/480/480/${safeQuery}?lock=${stableImageLock(query)}`;
}

export function fallbackImage(_status?: string | null, speciesName?: string | null) {
  const normalised = normaliseSpeciesName(speciesName);

  if (normalised) {
    const match = stockSpeciesRules.find((rule) =>
      rule.terms.some((term) => normalised.includes(term.toLowerCase()))
    );
    if (match) return stockPhotoUrl(match.query);

    return stockPhotoUrl(`${normalised},bird`);
  }

  return stockPhotoUrl("bird");
}

export function birdImageUrl(bird: { photo_url?: string | null; status?: string | null; species?: { name?: string | null } | { name?: string | null }[] | null }) {
  if (bird.photo_url) return bird.photo_url;
  const species = getSpeciesName(bird.species);
  return fallbackImage(bird.status, species);
}
