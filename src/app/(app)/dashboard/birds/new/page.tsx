import Link from "next/link";
import { createBird } from "./actions";

export default function NewBirdPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Bird</h2>
          <div className="text-muted">Create a new bird record using ring number as the main identifier.</div>
        </div>
      </div>

      <form className="card" action={createBird}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Ring number</label><input name="ring_number" className="form-control" placeholder="GB26-00123" required /></div>
            <div className="col-md-4"><label className="form-label">Species</label><input name="species" className="form-control" placeholder="Gouldian Finch" /></div>
            <div className="col-md-4"><label className="form-label">Mutation</label><input name="mutation" className="form-control" placeholder="Purple Head" /></div>
            <div className="col-md-4"><label className="form-label">Photo URL</label><input name="photo_url" className="form-control" placeholder="/images/birds/gouldian-1.svg" /></div>
            <div className="col-md-4"><label className="form-label">Sex</label><select name="sex" className="form-select"><option value="unknown">Unknown</option><option value="male">Male</option><option value="female">Female</option></select></div>
            <div className="col-md-4"><label className="form-label">Date of birth</label><input name="date_of_birth" className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select name="status" className="form-select"><option value="active">Active</option><option value="young">Young Bird</option><option value="retained">Retained</option><option value="sold">Sold</option><option value="deceased">Deceased</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Health, parentage or breeding notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save bird</button><Link href="/dashboard/birds" className="btn btn-outline-secondary">Cancel</Link></div>
        </div>
      </form>
    </>
  );
}
