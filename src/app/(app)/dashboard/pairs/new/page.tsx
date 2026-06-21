import { createPair } from "./actions";

export default function NewPairPage() {
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
            <div className="col-md-6"><label className="form-label">Male ring number</label><input name="male_ring" className="form-control" placeholder="GB26-00123" required /></div>
            <div className="col-md-6"><label className="form-label">Female ring number</label><input name="female_ring" className="form-control" placeholder="GB26-00124" required /></div>
            <div className="col-md-6"><label className="form-label">Cage / aviary</label><input name="cage" className="form-control" placeholder="Breeding Cage 7" /></div>
            <div className="col-md-6"><label className="form-label">Status</label><select name="status" className="form-select"><option value="active">Active</option><option value="resting">Resting</option><option value="separated">Separated</option><option value="archived">Archived</option></select></div>
            <div className="col-12"><label className="form-label">Compatibility notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Pair behaviour, previous results, inbreeding notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Create pair</button><a href="/dashboard/breeding/workflow" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>
    </>
  );
}
