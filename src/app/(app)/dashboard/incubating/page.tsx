import Link from "next/link";
import { getSpeciesName, getUserAndAviary } from "@/lib/aviary";

type EggRow = {
  id: string;
  clutch_id: string | null;
  expected_hatch_date: string | null;
  status: string | null;
};

type ClutchRow = {
  id: string;
  pair_id: string | null;
  nest_number?: string | null;
};

type PairRow = {
  id: string;
  male_bird_id: string | null;
  female_bird_id: string | null;
  cage?: string | null;
};

type BirdRow = {
  id: string;
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

function speciesLabel(pair: PairRow | undefined, birdById: Map<string, BirdRow>) {
  const male = pair?.male_bird_id ? birdById.get(pair.male_bird_id) : undefined;
  const female = pair?.female_bird_id ? birdById.get(pair.female_bird_id) : undefined;
  return getSpeciesName(male?.species) || getSpeciesName(female?.species) || "Unknown species";
}

export default async function IncubatingPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const { data: eggs, error } = await supabase
    .from("eggs")
    .select("id, clutch_id, expected_hatch_date, status")
    .eq("aviary_id", aviary.id)
    .eq("status", "incubating")
    .order("expected_hatch_date", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);

  const eggRows = (eggs ?? []) as EggRow[];
  const clutchIds = Array.from(new Set(eggRows.map((egg) => egg.clutch_id).filter(Boolean))) as string[];

  const { data: clutches } = clutchIds.length
    ? await supabase.from("clutches").select("id, pair_id, nest_number").in("id", clutchIds)
    : { data: [] };

  const clutchRows = (clutches ?? []) as ClutchRow[];
  const clutchById = new Map(clutchRows.map((clutch) => [clutch.id, clutch]));
  const pairIds = Array.from(new Set(clutchRows.map((clutch) => clutch.pair_id).filter(Boolean))) as string[];

  const { data: pairs } = pairIds.length
    ? await supabase.from("pairs").select("id, male_bird_id, female_bird_id, cage").in("id", pairIds)
    : { data: [] };

  const pairRows = (pairs ?? []) as PairRow[];
  const pairById = new Map(pairRows.map((pair) => [pair.id, pair]));
  const birdIds = Array.from(new Set(pairRows.flatMap((pair) => [pair.male_bird_id, pair.female_bird_id]).filter(Boolean))) as string[];

  const { data: birds } = birdIds.length
    ? await supabase.from("birds").select("id, species(name)").in("id", birdIds)
    : { data: [] };

  const birdById = new Map(((birds ?? []) as BirdRow[]).map((bird) => [bird.id, bird]));
  const groups = clutchIds.map((clutchId) => {
    const groupEggs = eggRows.filter((egg) => egg.clutch_id === clutchId);
    const clutch = clutchById.get(clutchId);
    const pair = clutch?.pair_id ? pairById.get(clutch.pair_id) : undefined;
    const nextDate = groupEggs[0]?.expected_hatch_date ?? null;
    return { clutchId, eggs: groupEggs, clutch, pair, nextDate };
  });

  const unassigned = eggRows.filter((egg) => !egg.clutch_id);
  const totalEggs = eggRows.length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Incubating</h2>
          <div className="text-muted">Grouped by clutch / pair so you can drill into egg status.</div>
        </div>
        <Link href="/dashboard/clutches" className="btn btn-outline-primary">View clutches</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body text-center">
          <strong>{totalEggs} eggs</strong>
        </div>
      </div>

      <div className="card">
        <div className="list-group list-group-flush">
          {groups.map((group, index) => {
            const days = daysUntil(group.nextDate);
            const daysLabel = days === null ? "-" : days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days left`;
            const cage = group.pair?.cage || "No cage";
            const nest = group.clutch?.nest_number ? `Nest ${group.clutch.nest_number}` : "";
            const species = speciesLabel(group.pair, birdById);

            return (
              <Link href={`/dashboard/incubating/${group.clutchId}`} className="list-group-item" key={group.clutchId}>
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-lg" style={{ border: "2px solid #171717", background: "white" }}>{group.eggs.length}</div>
                    <div>
                      <strong>{cage}</strong>
                      <div className="text-muted">{species}{nest ? ` · ${nest}` : ""}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong>{daysLabel}</strong>
                    <div className="text-muted">{displayDate(group.nextDate)}</div>
                  </div>
                </div>
              </Link>
            );
          })}

          {unassigned.length > 0 ? (
            <div className="list-group-item">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar avatar-lg" style={{ border: "2px solid #171717", background: "white" }}>{unassigned.length}</div>
                  <div><strong>Unassigned</strong><div className="text-muted">No clutch linked</div></div>
                </div>
              </div>
            </div>
          ) : null}

          {totalEggs === 0 ? <div className="list-group-item text-center text-muted py-5">No eggs currently incubating.</div> : null}
        </div>
      </div>
    </>
  );
}
