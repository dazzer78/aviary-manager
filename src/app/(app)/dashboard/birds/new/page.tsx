export default function NewBirdPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Bird</h2>
          <div className="text-muted">Create a new bird record with ring, species and breeding details.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Ring number</label><input className="form-control" placeholder="GB26-00123" /></div>
            <div className="col-md-4"><label className="form-label">Species</label><input className="form-control" placeholder="Gouldian Finch" /></div>
            <div className="col-md-4"><label className="form-label">Mutation</label><input className="form-control" placeholder="Purple Head" /></div>
            <div className="col-md-4"><label className="form-label">Sex</label><select className="form-select"><option>Unknown</option><option>Male</option><option>Female</option></select></div>
            <div className="col-md-4"><label className="form-label">Date of birth</label><input className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select className="form-select"><option>Active</option><option>Young Bird</option><option>Sold</option><option>Deceased</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows={4} placeholder="Health, parentage or breeding notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary">Save bird</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </div>
    </>
  );
}
