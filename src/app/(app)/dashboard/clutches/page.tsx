export default function ClutchesPage() {
  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Clutches & Eggs</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <a href="#" className="btn btn-primary">
                  Add Clutch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Active Clutches</h3>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter">
                    <thead>
                      <tr>
                        <th>Breeding Pair</th>
                        <th>Laid Date</th>
                        <th>Expected Hatch</th>
                        <th>Eggs</th>
                        <th>Hatched</th>
                        <th className="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          Load your clutches here
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
