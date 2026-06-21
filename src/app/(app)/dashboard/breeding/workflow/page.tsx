import { getUserAndAviary } from "@/lib/aviary";
import { createClutch } from "./actions";

export default async function BreedingWorkflowPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [pairsResult, clutchesResult, eggsResult, chicksResult] = await Promise.all([
    supabase.from("pairs").select("id, cage, status, male:birds!pairs_male_bird_id_fkey(ring_number), female:birds!pairs_female_bird_id_fkey(ring_number)").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("clutches").select("id, nest_number, status, laid_start_date, pair_id").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("eggs").select("id, status, clutch_id, expected_hatch_date").eq("aviary_id", aviary.id),
    supabase.from("chicks").select("id, status, ring_due_date").eq("aviary_id", aviary.id),
  ]);

  for (const result of [pairsResult, clutchesResult, eggsResult, chicksResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const pairs = pairsResult.data ?? [];
  const clutches = clutchesResult.data ?? [];
  const eggs = eggsResult.data ?? [];
  const chicks = chicksResult.data ?? [];

  const columns = [
    { title: "Pairs", items: pairs.map((pair) => ({ title: `${pair.male?.ring_number ?? "Male"} × ${pair.female?.ring_number ?? "Female"}`, meta: pair.cage || "No cage set", badge: pair.status })) },
    { title: "Clutches", items: clutches.map((clutch) => ({ title: clutch.nest_number ? `Nest ${clutch.nest_number}` : "Nest", meta: clutch.laid_start_date || "No laid date", badge: clutch.status })) },
    { title: "Eggs", items: eggs.map((egg) => ({ title: "Egg record", meta: egg.expected_hatch_date || "No hatch date", badge: egg.status })) },
    { title: "Chicks", items: chicks.filter((chick) => chick.status !== "ringed").map((chick) => ({ title: "Chick", meta: chick.ring_due_date || "No ring date", badge: chick.status })) },
    { title: "Ringed", items: chicks.filter((chick) => chick.status === "ringed").map((chick) => ({ title: "Ringed chick", meta: chick.ring_due_date || "No ring date", badge: chick.status })) },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Breeding Workflow</h2>
          <div className="text-muted">Live workflow from pairs through clutches, eggs, chicks and ringing.</div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header"><h3 className="card-title mb-0">Create Clutch</h3></div>
        <form className="card-body" action={createClutch}>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Pair</label><select name="pair_id" className="form-select" required><option value="">Select pair</option>{pairs.map((pair) => <option key={pair.id} value={pair.id}>{pair.male?.ring_number ?? "Male"} × {pair.female?.ring_number ?? "Female"}</option>)}</select></div>
            <div className="col-md-3"><label className="form-label">Nest number</label><input name="nest_number" className="form-control" placeholder="Nest #12" /></div>
            <div className="col-md-3"><label className="form-label">Laid start date</label><input name="laid_start_date" type="date" className="form-control" /></div>
            <div className="col-md-2 d-flex align-items-end"><button className="btn btn-primary w-100" type="submit">Add</button></div>
            <div className="col-12"><label className="form-label">Notes</label><input name="notes" className="form-control" placeholder="Optional clutch notes" /></div>
          </div>
        </form>
      </div>

      <div className="workflow-board">
        {columns.map((column) => (
          <div className="workflow-column" key={column.title}>
            <div className="workflow-column-title">{column.title}<span>{column.items.length}</span></div>
            {column.items.map((item, index) => (
              <div className="workflow-card" key={`${column.title}-${index}`}>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
                <span className="badge bg-blue-lt text-blue">{item.badge}</span>
              </div>
            ))}
            {column.items.length === 0 ? <div className="workflow-empty">Nothing here yet</div> : null}
          </div>
        ))}
      </div>
    </>
  );
}
