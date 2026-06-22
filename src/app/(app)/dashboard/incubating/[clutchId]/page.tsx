import Link from "next/link";
import { notFound } from "next/navigation";
import { getRingNumber, getSpeciesName, getUserAndAviary } from "@/lib/aviary";

type BirdRow = {
  id: string;
  ring_number?: string | null;
  leg_ring?: string | null;
  species?: { name?: string | null } | { name?: string | null }[] | null;
};

function displayDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function daysUntil(date?: string | null) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function birdLine(bird?: BirdRow) {
  if (!bird) return "Unknown bird";
  const species = getSpeciesName(bird.species);
  const ring = getRingNumber(bird, "NO RING");
  return species ? `${species} · ${ring}` : ring;
}

export default async function IncubatingClutchPage({ params }: { params: Promise<{ clutchId: string }> }) {
  const { clutchId } = await params;
  const { supabase, aviary } = await getUserAndAviary();

  const { data: clutch, error: clutchError } = await supabase
    .from("clutches")
    .select("id, pair_id, nest_number, laid_start_date, status")
    .eq("aviary_id", aviary.id)
    .eq("id", clutchId)
    .maybeSingle();

  if (clutchError) throw new Error(clutchError.message);
  if (!clutch) notFound();

  const [{ data: eggs, error: eggsError }, { data: pair }] = await Promise.all([
    supabase
      .from("eggs")
      .select("id, egg_number, laid_date, expected_hatch_date, hatch_date, status")
      .eq("aviary_id", aviary.id)
      .eq("clutch_id", clutch.id)
      .order("egg_number", { ascending: true, nullsFirst: false }),
    clutch.pair_id
      ? supabase.from("pairs").select("id, male_bird_id, female_bird_id, cage").eq("aviary_id", aviary.id).eq("id", clutch.pair_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (eggsError) throw new Error(eggsError.message);

  const birdIds = [pair?.male_bird_id, pair?.female_bird_id].filter(Boolean) as string[];
  const { data: birds } = birdIds.length
    ? await supabase.from("birds").select("id, ring_number, leg_ring, species(name)").in("id", birdIds)
    : { data: [] };

  const birdById = new Map(((birds ?? []) as BirdRow[]).map((bird) => [bird.id, bird]));
  const male = pair?.male_bird_id ? birdById.get(pair.male_bird_id) : undefined;
  const female = pair?.female_bird_id ? birdById.get(pair.female_bird_id) : undefined;
  const rows = eggs ?? [];
  const incubating = rows.filter((egg) => egg.status === "incubating").length;
  const hatched = rows.filter((egg) => egg.status === "hatched" || egg.hatch_date).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">{pair?.cage || "Incubating clutch"}</h2>
          <div className="text-muted">{clutch.nest_number ? `Nest ${clutch.nest_number}` : "Egg status"}</div>
        </div>
        <Link href="/dashboard/incubating" className="btn btn-outline-primary">Back to incubating</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><div className="subheader">Male</div><strong>{birdLine(male)}</strong></div>
            <div className="col-md-6"><div className="subheader">Female</div><strong>{birdLine(female)}</strong></div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body text-center"><strong>{rows.length} eggs</strong> · {incubating} incubating · {hatched} hatched</div>
      </div>

      <div className="card">
        <div className="list-group list-group-flush">
          {rows.map((egg) => {
            const days = daysUntil(egg.expected_hatch_date);
            const daysLabel = egg.hatch_date ? "Hatched" : days === null ? "-" : days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days left`;
            const icon = egg.hatch_date || egg.status === "hatched" ? "◔" : "◯";
            return (
              <div className="list-group-item" key={egg.id}>
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ fontSize: 42, lineHeight: 1 }}>{icon}</div>
                    <div>
                      <strong>{egg.status || "unknown"}</strong>
                      <div>{daysLabel}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong>{displayDate(egg.expected_hatch_date)}</strong>
                    <div className="text-muted">{egg.egg_number ? `Egg ${egg.egg_number}` : "Egg"}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {rows.length === 0 ? <div className="list-group-item text-center text-muted py-5">No eggs found for this clutch.</div> : null}
        </div>
      </div>
    </>
  );
}
