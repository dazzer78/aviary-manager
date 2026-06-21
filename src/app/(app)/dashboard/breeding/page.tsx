import Link from "next/link";
import { getUserAndAviary } from "@/lib/aviary";

type BirdRow = {
  id: string;
  ring_number?: string | null;
  leg_ring?: string | null;
  sex?: string | null;
  mutation?: string | null;
  color_mutation?: string | null;
  species?: { name?: string | null } | { name?: string | null }[] | null;
};

type PairRow = {
  id: string;
  male_bird_id?: string | null;
  female_bird_id?: string | null;
  cage?: string | null;
  nest_number?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  status?: string | null;
  legacy_male_ring?: string | null;
  legacy_female_ring?: string | null;
  legacy_clutches?: number | null;
  legacy_eggs?: number | null;
  legacy_descendants?: string | null;
};

function getSpeciesName(species: BirdRow["species"]) {
  if (Array.isArray(species)) return species[0]?.name ?? undefined;
  return species?.name ?? undefined;
}

function birdLabel(bird: BirdRow | undefined, fallback?: string | null) {
  if (!bird) return fallback || "Unknown";
  const ring = bird.ring_number || bird.leg_ring || fallback || "Unknown";
  const species = getSpeciesName(bird.species);
  return species ? `${ring} · ${species}` : ring;
}

function displayDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function statusClass(status?: string | null) {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "badge bg-green-lt text-green";
    case "complete":
    case "completed":
    case "closed":
      return "badge bg-blue-lt text-blue";
    case "inactive":
    case "ended":
      return "badge bg-secondary-lt text-secondary";
    default:
      return "badge bg-blue-lt text-blue";
  }
}

export default async function BreedingPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: pairs, error: pairsError }, { data: birds, error: birdsError }, { data: clutches }, { data: eggs }] = await Promise.all([
    supabase
      .from("pairs")
      .select("id, male_bird_id, female_bird_id, cage, nest_number, start_date, end_date, created_at, status, legacy_male_ring, legacy_female_ring, legacy_clutches, legacy_eggs, legacy_descendants")
      .eq("aviary_id", aviary.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("birds")
      .select("id, ring_number, leg_ring, sex, mutation, color_mutation, species(name)")
      .eq("aviary_id", aviary.id),
    supabase.from("clutches").select("id, pair_id, status").eq("aviary_id", aviary.id),
    supabase.from("eggs").select("id, clutch_id, status, hatched").eq("aviary_id", aviary.id),
  ]);

  if (pairsError) throw new Error(pairsError.message);
  if (birdsError) throw new Error(birdsError.message);

  const birdById = new Map((birds ?? []).map((bird) => [bird.id, bird as BirdRow]));
  const clutchesByPair = new Map<string, number>();
  const clutchToPair = new Map<string, string>();
  const eggsByPair = new Map<string, number>();

  for (const clutch of clutches ?? []) {
    if (!clutch.pair_id) continue;
    clutchToPair.set(clutch.id, clutch.pair_id);
    clutchesByPair.set(clutch.pair_id, (clutchesByPair.get(clutch.pair_id) ?? 0) + 1);
  }

  for (const egg of eggs ?? []) {
    if (!egg.clutch_id) continue;
    const pairId = clutchToPair.get(egg.clutch_id);
    if (!pairId) continue;
    eggsByPair.set(pairId, (eggsByPair.get(pairId) ?? 0) + 1);
  }

  const pairRows = (pairs ?? []) as PairRow[];
  const activePairs = pairRows.filter((pair) => pair.status === "active").length;
  const totalClutches = pairRows.reduce((sum, pair) => sum + (clutchesByPair.get(pair.id) ?? pair.legacy_clutches ?? 0), 0);
  const totalEggs = pairRows.reduce((sum, pair) => sum + (eggsByPair.get(pair.id) ?? pair.legacy_eggs ?? 0), 0);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Breeding Pairs</h2>
          <div className="text-muted">Imported pair records from your spreadsheet and live Aviary Manager data.</div>
        </div>
        <div className="d-flex gap-2">
          <Link href="/dashboard/breeding/workflow" className="btn btn-outline-primary">Workflow</Link>
          <Link href="/dashboard/breeding/analytics" className="btn btn-primary">Analytics</Link>
        </div>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Pairs" value={pairRows.length} />
        <Metric title="Active" value={activePairs} />
        <Metric title="Clutches" value={totalClutches} />
        <Metric title="Eggs" value={totalEggs} />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table card-table table-vcenter">
            <thead>
              <tr>
                <th>Male</th>
                <th>Female</th>
                <th>Cage / Nest</th>
                <th>Pairing Date</th>
                <th>Clutches</th>
                <th>Eggs</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pairRows.map((pair) => {
                const male = birdById.get(pair.male_bird_id ?? "");
                const female = birdById.get(pair.female_bird_id ?? "");
                const pairClutches = clutchesByPair.get(pair.id) ?? pair.legacy_clutches ?? 0;
                const pairEggs = eggsByPair.get(pair.id) ?? pair.legacy_eggs ?? 0;
                const cageNest = [pair.cage, pair.nest_number ? `Nest ${pair.nest_number}` : null].filter(Boolean).join(" / ") || "-";

                return (
                  <tr key={pair.id}>
                    <td><strong>{birdLabel(male, pair.legacy_male_ring)}</strong></td>
                    <td><strong>{birdLabel(female, pair.legacy_female_ring)}</strong></td>
                    <td>{cageNest}</td>
                    <td>{displayDate(pair.start_date ?? pair.created_at)}</td>
                    <td>{pairClutches}</td>
                    <td>{pairEggs}</td>
                    <td><span className={statusClass(pair.status)}>{pair.status ?? "unknown"}</span></td>
                  </tr>
                );
              })}
              {pairRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-5">
                    No breeding pairs found. Import the spreadsheet or create your first pair.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="card">
        <div className="card-body">
          <div className="subheader">{title}</div>
          <div className="h2 mb-0">{value}</div>
        </div>
      </div>
    </div>
  );
}
