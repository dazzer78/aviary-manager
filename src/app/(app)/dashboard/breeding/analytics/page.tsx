import BreedingAnalyticsCharts from "@/components/BreedingAnalyticsCharts";
import { getUserAndAviary } from "@/lib/aviary";

function relationRingNumber(
  relation: { ring_number?: string | null } | { ring_number?: string | null }[] | null | undefined,
  fallback: string
) {
  if (Array.isArray(relation)) return relation[0]?.ring_number ?? fallback;
  return relation?.ring_number ?? fallback;
}

export default async function BreedingAnalyticsPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: pairs, error: pairsError }, { data: clutches, error: clutchesError }, { data: eggs, error: eggsError }, { data: chicks, error: chicksError }] = await Promise.all([
    supabase.from("pairs").select("id, cage, male:birds!pairs_male_bird_id_fkey(ring_number), female:birds!pairs_female_bird_id_fkey(ring_number)").eq("aviary_id", aviary.id),
    supabase.from("clutches").select("id, pair_id").eq("aviary_id", aviary.id),
    supabase.from("eggs").select("id, clutch_id, status, hatched").eq("aviary_id", aviary.id),
    supabase.from("chicks").select("id, egg_id, status").eq("aviary_id", aviary.id),
  ]);

  for (const result of [{ error: pairsError }, { error: clutchesError }, { error: eggsError }, { error: chicksError }]) {
    if (result.error) throw new Error(result.error.message);
  }

  const rows = (pairs ?? []).map((pair) => {
    const pairClutches = (clutches ?? []).filter((clutch) => clutch.pair_id === pair.id);
    const pairClutchIds = new Set(pairClutches.map((clutch) => clutch.id));
    const pairEggs = (eggs ?? []).filter((egg) => pairClutchIds.has(egg.clutch_id));
    const pairEggIds = new Set(pairEggs.map((egg) => egg.id));
    const pairChicks = (chicks ?? []).filter((chick) => pairEggIds.has(chick.egg_id));
    const hatched = pairEggs.filter((egg) => egg.hatched || egg.status === "hatched").length;
    const success = pairEggs.length ? Math.round((hatched / pairEggs.length) * 100) : 0;

    return {
      label: `${relationRingNumber(pair.male, "Male")} × ${relationRingNumber(pair.female, "Female")}`,
      eggs: pairEggs.length,
      hatched,
      chicks: pairChicks.length,
      success,
    };
  });

  const totalEggs = rows.reduce((sum, row) => sum + row.eggs, 0);
  const totalHatched = rows.reduce((sum, row) => sum + row.hatched, 0);
  const hatchRate = totalEggs ? Math.round((totalHatched / totalEggs) * 100) : 0;

  return (
    <>
      <div className="page-header">
        <div><h2 className="page-title">Breeding Analytics</h2><div className="text-muted">Success rates by pair and breeding output.</div></div>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Pairs" value={rows.length} />
        <Metric title="Eggs Laid" value={totalEggs} />
        <Metric title="Hatched" value={totalHatched} />
        <Metric title="Hatch Rate" value={`${hatchRate}%`} />
      </div>

      <BreedingAnalyticsCharts rows={rows} />

      <div className="card mt-3">
        <div className="card-header"><h3 className="card-title mb-0">Pair Results</h3></div>
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Pair</th><th>Eggs</th><th>Hatched</th><th>Chicks</th><th>Success</th></tr></thead>
            <tbody>
              {rows.map((row) => <tr key={row.label}><td><strong>{row.label}</strong></td><td>{row.eggs}</td><td>{row.hatched}</td><td>{row.chicks}</td><td><span className="badge bg-green-lt text-green">{row.success}%</span></td></tr>)}
              {rows.length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-5">No pair analytics yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return <div className="col-sm-6 col-lg-3"><div className="card"><div className="card-body"><div className="subheader">{title}</div><div className="h2 mb-0">{value}</div></div></div></div>;
}
