import { getUserAndAviary } from "@/lib/aviary";
import { createEgg } from "./actions";

function getPairCage(pairRef: unknown): string | undefined {
  if (Array.isArray(pairRef)) {
    const first = pairRef[0] as { cage?: string } | undefined;
    return first?.cage;
  }

  return (pairRef as { cage?: string } | null | undefined)?.cage;
}

export default async function NewEggPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: clutches } = await supabase
    .from("clutches")
    .select("id, nest_number, pairs(cage)")
    .eq("aviary_id", aviary.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Record Egg</h2>
          <div className="text-muted">Log a newly laid egg and expected hatch date.</div>
        </div>
      </div>

      <form className="card" action={createEgg}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Clutch</label><select name="clutch_id" className="form-select" required><option value="">Select clutch</option>{(clutches ?? []).map((clutch) => <option key={clutch.id} value={clutch.id}>{clutch.nest_number || "Nest"} {getPairCage(clutch.pairs) ? `- ${getPairCage(clutch.pairs)}` : ""}</option>)}</select></div>
            <div className="col-md-3"><label className="form-label">Egg number</label><input name="egg_number" className="form-control" type="number" placeholder="1" /></div>
            <div className="col-md-3"><label className="form-label">Laid date</label><input name="laid_date" className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Expected hatch date</label><input name="expected_hatch_date" className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Fertility</label><select name="fertile" className="form-select"><option value="">Unknown</option><option value="true">Fertile</option><option value="false">Infertile</option></select></div>
            <div className="col-md-4"><label className="form-label">Status</label><select name="status" className="form-select"><option value="incubating">Incubating</option><option value="hatched">Hatched</option><option value="infertile">Infertile</option><option value="lost">Lost</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Condition, candling result, foster details..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Record egg</button><a href="/dashboard/breeding/workflow" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>
    </>
  );
}
