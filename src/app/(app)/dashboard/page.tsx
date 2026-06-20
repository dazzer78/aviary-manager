export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>

      <div className="row row-cards">
        {[
          ["Total Birds", "156"],
          ["Active Pairs", "32"],
          ["Eggs Incubating", "18"],
          ["Chicks This Season", "47"],
        ].map(([title, value]) => (
          <div className="col-sm-6 col-lg-3" key={title}>
            <div className="card">
              <div className="card-body">
                <div className="subheader">{title}</div>
                <div className="h1 mb-0">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
