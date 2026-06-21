export default function NewPairPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Create Pair</h2>
          <div className="text-muted">Pair two birds for the current breeding season.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Male bird</label><input className="form-control" placeholder="Search ring number or name" /></div>
            <div className="col-md-6"><label className="form-label">Female bird</label><input className="form-control" placeholder="Search ring number or name" /></div>
            <div className="col-md-4"><label className="form-label">Season</label><select className="form-select"><option>Season 2026</option><option>Season 2025</option></select></div>
            <div className="col-md-4"><label className="form-label">Cage / aviary</label><input className="form-control" placeholder="Breeding Cage 7" /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select className="form-select"><option>Active</option><option>Resting</option><option>Separated</option></select></div>
            <div className="col-12"><label className="form-label">Compatibility notes</label><textarea className="form-control" rows={4} placeholder="Pair behaviour, previous results, inbreeding notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary">Create pair</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </div>
    </>
  );
}
