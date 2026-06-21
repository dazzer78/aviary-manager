import { createSale } from "./actions";

export default function NewSalePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Record Sale</h2>
          <div className="text-muted">Log a completed sale record.</div>
        </div>
      </div>

      <form className="card" action={createSale}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Ring number</label><input name="ring_number" className="form-control" placeholder="Optional bird ring number" /></div>
            <div className="col-md-6"><label className="form-label">Buyer name</label><input name="buyer_name" className="form-control" placeholder="Name" /></div>
            <div className="col-md-4"><label className="form-label">Date</label><input name="sale_date" className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Amount</label><input name="amount" className="form-control" type="number" step="0.01" placeholder="0.00" /></div>
            <div className="col-md-4"><label className="form-label">Payment status</label><select name="payment_status" className="form-select"><option value="paid">Paid</option><option value="deposit">Deposit</option><option value="unpaid">Unpaid</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} placeholder="Collection details, paperwork, notes..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save sale</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>
    </>
  );
}
