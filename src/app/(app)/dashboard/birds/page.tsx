export default function BirdsPage() {
  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Birds</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <a href="#" className="btn btn-primary">
                  Add Bird
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
                <div className="table-responsive">
                  <table className="table card-table table-vcenter">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Ring #</th>
                        <th>Sex</th>
                        <th>DOB</th>
                        <th>Cage</th>
                        <th className="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={7} className="text-center text-muted">
                          Load your birds here
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
