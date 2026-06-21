import { getUserAndAviary } from "@/lib/aviary";
import { createClutch } from "./actions";
import { markRinged, recordHatch } from "./progression-actions";

function getRingNumber(birdRef: unknown): string | undefined {
  if (Array.isArray(birdRef)) {
    const first = birdRef[0] as { ring_number?: string } | undefined;
    return first?.ring_number;
  }

  return (birdRef as { ring_number?: string } | null | undefined)?.ring_number;
}

export default async function BreedingWorkflowPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [pairsResult, clutchesResult, eggsResult, chicksResult, eventsResult] = await Promise.all([
    supabase.from("pairs").select("id, cage, status, male:birds!pairs_male_bird_id_fkey(ring_number), female:birds!pairs_female_bird_id_fkey(ring_number)").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("clutches").select("id, nest_number, status, laid_start_date, pair_id").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("eggs").select("id, status, clutch_id, expected_hatch_date").eq("aviary_id", aviary.id),
    supabase.from("chicks").select("id, status, ring_due_date").eq("aviary_id", aviary.id),
    supabase.from("breeding_events").select("id, title, event_type, event_date, notes").eq("aviary_id", aviary.id).order("created_at", { ascending: false }).limit(8),
  ]);

  for (const result of [pairsResult, clutchesResult, eggsResult, chicksResult, eventsResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const pairs = pairsResult.data ?? [];
  const clutches = clutchesResult.data ?? [];
  const eggs = eggsResult.data ?? [];
  const chicks = chicksResult.data ?? [];
  const events = eventsResult.data ?? [];
  const openEggs = eggs.filter((egg) => egg.status === "incubating");
  const unringedChicks = chicks.filter((chick) => chick.status !== "ringed");

  const columns = [
    { title: "Pairs", items: pairs.map((pair) => ({ title: `${getRingNumber(pair.male) ?? "Male"} × ${getRingNumber(pair.female) ?? "Female"}`, meta: pair.cage || "No cage set", badge: pair.status })) },
    { title: "Clutches", items: clutches.map((clutch) => ({ title: clutch.nest_number ? `Nest ${clutch.nest_number}` : "Nest", meta: clutch.laid_start_date || "No laid date", badge: clutch.status })) },
    { title: "Eggs", items: eggs.map((egg) => ({ title: "Egg record", meta: egg.expected_hatch_date || "No hatch date", badge: egg.status })) },
    { title: "Chicks", items: unringedChicks.map((chick) => ({ title: "Chick", meta: chick.ring_due_date || "No ring date", badge: chick.status })) },
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

      <div className="row row-cards mb-3">
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><h3 className="card-title mb-0">Create Clutch</h3></div>
            <form className="card-body" action={createClutch}>
              <div className="mb-3"><label className="form-label">Pair</label><select name="pair_id" className="form-select" required><option value="">Select pair</option>{pairs.map((pair) => <option key={pair.id} value={pair.id}>{getRingNumber(pair.male) ?? "Male"} × {getRingNumber(pair.female) ?? "Female"}</option>)}</select></div>
              <div className="mb-3"><label className="form-label">Nest number</label><input name="nest_number" className="form-control" placeholder="Nest #12" /></div>
              <div className="mb-3"><label className="form-label">Laid start date</label><input name="laid_start_date" type="date" className="form-control" /></div>
              <div className="mb-3"><label className="form-label">Notes</label><input name="notes" className="form-control" placeholder="Optional clutch notes" /></div>
              <button className="btn btn-primary w-100" type="submit">Add clutch</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><h3 className="card-title mb-0">Record Hatch</h3></div>
            <form className="card-body" action={recordHatch}>
              <div className="mb-3"><label className="form-label">Egg</label><select name="egg_id" className="form-select" required><option value="">Select egg</option>{openEggs.map((egg) => <option key={egg.id} value={egg.id}>Egg due {egg.expected_hatch_date ?? "unknown"}</option>)}</select></div>
              <div className="mb-3"><label className="form-label">Hatch date</label><input name="hatch_date" type="date" className="form-control" required /></div>
              <div className="mb-3"><label className="form-label">Ring after days</label><input name="ring_days" type="number" defaultValue={7} className="form-control" /></div>
              <button className="btn btn-primary w-100" type="submit">Record hatch</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header"><h3 className="card-title mb-0">Mark Ringed</h3></div>
            <form className="card-body" action={markRinged}>
              <div className="mb-3"><label className="form-label">Chick</label><select name="chick_id" className="form-select" required><option value="">Select chick</option>{unringedChicks.map((chick) => <option key={chick.id} value={chick.id}>Chick - ring due {chick.ring_due_date ?? "unknown"}</option>)}</select></div>
              <div className="mb-3"><label className="form-label">Ring number</label><input name="ring_number" className="form-control" placeholder="GB26-00123" required /></div>
              <div className="mb-3"><label className="form-label">Ringed date</label><input name="ringed_date" type="date" className="form-control" required /></div>
              <button className="btn btn-primary w-100" type="submit">Create bird record</button>
            </form>
          </div>
        </div>
      </div>

      <div className="workflow-board mb-3">
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

      <div className="card">
        <div className="card-header"><h3 className="card-title mb-0">Breeding Timeline</h3></div>
        <div className="list-group list-group-flush">
          {events.map((event) => <div className="list-group-item" key={event.id}><strong>{event.title}</strong><div className="text-muted small">{event.event_date} · {event.event_type}{event.notes ? ` · ${event.notes}` : ""}</div></div>)}
          {events.length === 0 ? <div className="list-group-item text-muted">No breeding events yet.</div> : null}
        </div>
      </div>
    </>
  );
}
