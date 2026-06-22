import { createPair } from "./actions";
import Link from "next/link";
import { getRingNumber, getSpeciesName, getUserAndAviary } from "@/lib/aviary";

export default async function NewPairPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: birds, error } = await supabase
    .from("birds")
    .select("id, ring_number, sex, species(name), status")
    .eq("aviary_id", aviary.id)
    .in("status", ["active", "retained", "young"])
    .order("ring_number");

  if (error) throw new Error(error.message);

  const maleBirds = (birds ?? []).filter((bird) => bird.sex === "male" || bird.sex === "unknown");
  const femaleBirds = (birds ?? []).filter((bird) => bird.sex === "female" || bird.sex === "unknown");

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Create Pair</h2>
          <div className="text-muted">Pair two existing birds for the current breeding season.</div>
        </div>
      </div>

      <form className="card" action={createPair}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Male bird</label><select name="male_bird_id" className="form-select" required><option value="">Select male bird</option>{maleBirds.map((bird) => <option key={bird.id} value={bird.id}>{getRingNumber(bird)}{getSpeciesName(bird.species) ? ` · ${getSpeciesName(bird.species)}` : ""}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label">Female bird</label><select name="female_bird_id" className="form-select" required><option value="">Select female bird</option>{femaleBirds.map((bird) => <option key={bird.id} value={bird.id}>{getRingNumber(bird)}{getSpeciesName(bird.species) ? ` · ${getSpeciesName(bird.species)}` : ""}</option>)}</select></div>
            <div className="col-md-6"><label className="form-label">Cage / aviary</label><input name="cage" className="form-control" placeholder="Breeding Cage 7" /></div>
            <div className="col-md-6"><label className="form-label">Status</label><select name="status" className="form-select"><option value="active">Active</option><option value="resting">Resting</option><option value="separated">Separated</option><option value="archived">Archived</option></select></div>
            <div className="col-md-4"><label className="form-label">Nest number</label><input name="nest_number" className="form-control" placeholder="Nest 4" /></div>
            <div className="col-md-4"><label className="form-label">Start date</label><input name="start_date" className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">End date</label><input name="end_date" className="form-control" type="date" /></div>
            <div className="col-12"><label className="form-label">Compatibility notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Pair behaviour, previous results, inbreeding notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Create pair</button><Link href="/dashboard/breeding" className="btn btn-outline-secondary">Cancel</Link></div>
        </div>
      </form>
    </>
  );
}
