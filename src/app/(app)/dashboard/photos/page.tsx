export default function PhotosPage() {
  return (
    <div className="page-wrapper">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Bird Photos</h2>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <a href="#" className="btn btn-primary">
                  Upload Photo
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
                <div className="card-body">
                  <div className="text-center text-muted py-8">
                    <p>Your bird photos will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
