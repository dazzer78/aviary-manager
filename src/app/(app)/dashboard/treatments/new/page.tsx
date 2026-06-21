import Link from "next/link";
import { createTreatment } from "./actions";

export default function NewTreatmentPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Treatment</h2>
          <div className="text-muted">Record medication, supplements or vet treatment.</div>
        </div>
      </div>

      <form className="card" action={createTreatment}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Bird ring number</label><input name="ring_number" className="form-control" placeholder="GB26-00123" required /></div>
            <div className="col-md-6"><label className="form-label">Treatment name</label><input name="treatment_name" className="form-control" placeholder="Medication / supplement" required /></div>
            <div className="col-md-4"><label className="form-label">Treatment date</label><input name="treatment_date" className="form-control" type="date" required /></div>
            <div className="col-md-4"><label className="form-label">Dosage</label><input name="dosage" className="form-control" placeholder="e.g. 1 drop daily" /></div>
            <div className="col-md-4"><label className="form-label">Follow-up date</label><input name="follow_up_date" className="form-control" type="date" /></div>
            <div className="col-12"><label className="form-label">Reason</label><input name="reason" className="form-control" placeholder="Respiratory, mites, quarantine, routine..." /></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Symptoms, vet advice, response to treatment..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save treatment</button><Link href="/dashboard/birds" className="btn btn-outline-secondary">Cancel</Link></div>
        </div>
      </form>
    </>
  );
}
