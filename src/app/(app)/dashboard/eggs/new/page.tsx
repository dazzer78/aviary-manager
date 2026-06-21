export default function NewEggPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Record Egg</h2>
          <div className="text-muted">Log a newly laid egg and expected hatch date.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Pair / clutch</label><input className="form-control" placeholder="Gouldian Pair 3 - Nest #12" /></div>
            <div className="col-md-3"><label className="form-label">Egg number</label><input className="form-control" type="number" placeholder="1" /></div>
            <div className="col-md-3"><label className="form-label">Laid date</label><input className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Expected hatch date</label><input className="form-control" type="date" /></div>
            <div className="col-md-4"><label className="form-label">Fertility</label><select className="form-select"><option>Unknown</option><option>Fertile</option><option>Infertile</option></select></div>
            <div className="col-md-4"><label className="form-label">Status</label><select className="form-select"><option>Incubating</option><option>Hatched</option><option>Lost</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" rows={4} placeholder="Condition, candling result, foster details..." /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary">Record egg</button><a href="/dashboard" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </div>
    </>
  );
}
