export default function NewSalePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Record Sale</h2>
          <div className="text-muted">Log a completed sale record.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Reference</label><input className="form-control" placeholder="Ring number or item reference" /></div>
            <div className="col-md-6"><label className="form-label">Buyer name</label><input className="form-control" placeholder="Name" /></div>
            <div className="col-md-4"><label className="form-label">Date</label><input className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Amount</label><input className="form-control" type="number" placeholder="0.00" /></div>
            <div className="col-md-4"><label className="form-label">Payment status</label><select className="form-select"><option>Paid</option><option>Deposit</option><option>Unpaid</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows={4} placeholder="Collection details, paperwork, notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary">Save sale</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </div>
    </>
  );
}
