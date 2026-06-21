export default function NewTreatmentPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Treatment</h2>
          <div className="text-muted">Record medication, supplements or vet treatment.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Bird</label><input className="form-control" placeholder="Search ring number" /></div>
            <div className="col-md-6"><label className="form-label">Treatment name</label><input className="form-control" placeholder="Medication / supplement" /></div>
            <div className="col-md-4"><label className="form-label">Treatment date</label><input className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Dosage</label><input className="form-control" placeholder="e.g. 1 drop daily" /></div>
            <div className="col-md-4"><label className="form-label">Follow-up date</label><input className="form-control" type="date" /></div>
            <div className="col-12"><label className="form-label">Reason</label><input className="form-control" placeholder="Respiratory, mites, quarantine, routine..." /></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows={4} placeholder="Symptoms, vet advice, response to treatment..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary">Save treatment</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </div>
    </>
  );
}
