import { createCage } from "./actions";

export default function NewCagePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Cage / Aviary</h2>
          <div className="text-muted">Create a cage, flight, hospital or breeding space.</div>
        </div>
      </div>

      <form className="card" action={createCage}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Name</label><input name="name" className="form-control" placeholder="Breeding Cage 1" required /></div>
            <div className="col-md-4"><label className="form-label">Type</label><select name="cage_type" className="form-select"><option value="breeding">Breeding</option><option value="flight">Flight</option><option value="hospital">Hospital</option><option value="quarantine">Quarantine</option></select></div>
            <div className="col-md-4"><label className="form-label">Status</label><select name="status" className="form-select"><option value="active">Active</option><option value="cleaning">Cleaning</option><option value="inactive">Inactive</option></select></div>
            <div className="col-md-4"><label className="form-label">Location</label><input name="location" className="form-control" placeholder="Bird room" /></div>
            <div className="col-md-4"><label className="form-label">Dimensions</label><input name="dimensions" className="form-control" placeholder="120 x 60 x 60 cm" /></div>
            <div className="col-md-4"><label className="form-label">Capacity</label><input name="capacity" className="form-control" type="number" placeholder="2" /></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save cage</button><a href="/dashboard/cages" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>
    </>
  );
}
