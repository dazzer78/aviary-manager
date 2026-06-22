import Link from "next/link";
import { notFound } from "next/navigation";
import { getRingNumber, getSpeciesName, getUserAndAviary } from "@/lib/aviary";
import { updatePair } from "./actions";

export default async function EditPairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pairId = decodeURIComponent(id);
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: pair, error: pairError }, { data: birds, error: birdsError }] = await Promise.all([
    supabase
      .from("pairs")
      .select("id, male_bird_id, female_bird_id, cage, nest_number, start_date, end_date, status, notes")
      .eq("aviary_id", aviary.id)
      .eq("id", pairId)
      .maybeSingle(),
    supabase
      .from("birds")
      .select("id, ring_number, sex, species(name), status")
      .eq("aviary_id", aviary.id)
      .in("status", ["active", "retained", "young"])
      .order("ring_number"),
  ]);

  if (pairError) throw new Error(pairError.message);
  if (birdsError) throw new Error(birdsError.message);
  if (!pair) notFound();

  const maleBirds = (birds ?? []).filter((bird) => bird.sex === "male" || bird.sex === "unknown");
  const femaleBirds = (birds ?? []).filter((bird) => bird.sex === "female" || bird.sex === "unknown");
  const updateAction = updatePair.bind(null, pairId);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Edit Pair</h2>
          <div className="text-muted">Update breeding pair details and status.</div>
        </div>
      </div>

      <form className="card" action={updateAction}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Male bird</label><select name="male_bird_id" className="form-select" defaultValue={pair.male_bird_id ?? ""} required><option value="">Select male bird</option>{maleBirds.map((bird) => <option key={bird.id} value={bird.id}>{getRingNumber(bird)}{getSpeciesName(bird.species) ? ` · ${getSpeciesName(bird.species)}` : ""}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label">Female bird</label><select name="female_bird_id" className="form-select" defaultValue={pair.female_bird_id ?? ""} required><option value="">Select female bird</option>{femaleBirds.map((bird) => <option key={bird.id} value={bird.id}>{getRingNumber(bird)}{getSpeciesName(bird.species) ? ` · ${getSpeciesName(bird.species)}` : ""}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label">Cage / aviary</label><input name="cage" className="form-control" defaultValue={pair.cage ?? ""} /></div>
            <div className="col-md-6"><label className="form-label">Status</label><select name="status" className="form-select" defaultValue={pair.status ?? "active"}><option value="active">Active</option><option value="resting">Resting</option><option value="separated">Separated</option><option value="archived">Archived</option></select></div>
            <div className="col-md-4"><label className="form-label">Nest number</label><input name="nest_number" className="form-control" defaultValue={pair.nest_number ?? ""} /></div>
            <div className="col-md-4"><label className="form-label">Start date</label><input name="start_date" className="form-control" type="date" defaultValue={pair.start_date ?? ""} /></div>
            <div className="col-md-4"><label className="form-label">End date</label><input name="end_date" className="form-control" type="date" defaultValue={pair.end_date ?? ""} /></div>
            <div className="col-12"><label className="form-label">Compatibility notes</label><textarea name="notes" className="form-control" rows={4} defaultValue={pair.notes ?? ""} /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save changes</button><Link href="/dashboard/breeding" className="btn btn-outline-secondary">Cancel</Link></div>
        </div>
      </form>
    </>
  );
}
