"use client";

const hatchRows = [
  {
    pair: "Gouldian Pair 3",
    nest: "Nest #12",
    expected: "22 Jun 2025",
    status: "Due Soon",
    statusClass: "bg-yellow text-yellow-fg",
    image: "/images/birds/gouldian-1.svg",
  },
  {
    pair: "Canary Pair 7",
    nest: "Nest #03",
    expected: "23 Jun 2025",
    status: "Incubating",
    statusClass: "bg-blue text-blue-fg",
    image: "/images/birds/canary-1.svg",
  },
  {
    pair: "Zebra Finch Pair 4",
    nest: "Nest #07",
    expected: "24 Jun 2025",
    status: "Incubating",
    statusClass: "bg-blue text-blue-fg",
    image: "/images/birds/zebra-1.svg",
  },
  {
    pair: "Gouldian Pair 5",
    nest: "Nest #02",
    expected: "26 Jun 2025",
    status: "Laid",
    statusClass: "bg-green text-green-fg",
    image: "/images/birds/gouldian-2.svg",
  },
];

const birdRows = [
  {
    ring: "GB24-00156",
    species: "Gouldian Finch",
    mutation: "Purple Head",
    sex: "Male",
    dob: "01/02/2024",
    status: "Active",
    statusClass: "bg-green text-green-fg",
    added: "2 days ago",
    image: "/images/birds/gouldian-1.svg",
  },
  {
    ring: "GB24-00155",
    species: "Canary",
    mutation: "Lizard Yellow",
    sex: "Female",
    dob: "15/01/2024",
    status: "Active",
    statusClass: "bg-green text-green-fg",
    added: "2 days ago",
    image: "/images/birds/canary-1.svg",
  },
  {
    ring: "GB24-00154",
    species: "Zebra Finch",
    mutation: "Normal",
    sex: "Female",
    dob: "10/01/2024",
    status: "Active",
    statusClass: "bg-green text-green-fg",
    added: "3 days ago",
    image: "/images/birds/zebra-1.svg",
  },
  {
    ring: "GB24-00153",
    species: "Gouldian Finch",
    mutation: "Black Head",
    sex: "Male",
    dob: "05/01/2024",
    status: "Young Bird",
    statusClass: "bg-yellow text-yellow-fg",
    added: "3 days ago",
    image: "/images/birds/gouldian-2.svg",
  },
  {
    ring: "GB24-00152",
    species: "Canary",
    mutation: "Red Mosaic",
    sex: "Female",
    dob: "03/01/2024",
    status: "Active",
    statusClass: "bg-green text-green-fg",
    added: "4 days ago",
    image: "/images/birds/canary-2.svg",
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="row row-cards mb-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3" style={{ backgroundColor: "#3b82f6" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7h.01"/><path d="M8 7h.01"/><path d="M12 12l3 4H9l3-4z"/><path d="M4 19c0-4.5 3.5-8 8-8s8 3.5 8 8"/></svg>
                </div>
                <div>
                  <div className="subheader">Total Birds</div>
                  <div className="h2 mb-0">156</div>
                </div>
              </div>
              <div className="text-success text-sm mt-2">↑ 12 vs last month</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3" style={{ backgroundColor: "#39c67a" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="subheader">Active Pairs</div>
                  <div className="h2 mb-0">32</div>
                </div>
              </div>
              <div className="text-success text-sm mt-2">↑ 4 vs last month</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3" style={{ backgroundColor: "#f59e0b" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M8 6c0-2 1.8-4 4-4s4 2 4 4-1.8 4-4 4-4-2-4-4z"/></svg>
                </div>
                <div>
                  <div className="subheader">Eggs Incubating</div>
                  <div className="h2 mb-0">18</div>
                </div>
              </div>
              <div className="text-success text-sm mt-2">↑ 2 vs last month</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3" style={{ backgroundColor: "#7c3aed" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-8-8"/><path d="M20 4v8h-8"/></svg>
                </div>
                <div>
                  <div className="subheader">Chicks This Season</div>
                  <div className="h2 mb-0">47</div>
                </div>
              </div>
              <div className="text-success text-sm mt-2">↑ 8 vs last month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h3 className="card-title mb-0">Tasks Due Today</h3>
              <a href="#" className="btn btn-sm btn-outline-primary">View all</a>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex justify-content-between"><span>Ring 4 Zebra Finch chicks</span><span className="badge bg-red-lt text-red">High</span></div>
              <div className="list-group-item d-flex justify-content-between"><span>Check Gouldian nest #12</span><span className="badge bg-orange-lt text-orange">Medium</span></div>
              <div className="list-group-item d-flex justify-content-between"><span>Administer medication to Bird A102</span><span className="badge bg-red-lt text-red">High</span></div>
              <div className="list-group-item d-flex justify-content-between"><span>Clean Breeding Cage 7</span><span className="badge bg-green-lt text-green">Low</span></div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">Upcoming Hatches</h3>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Nest</th>
                    <th>Expected Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hatchRows.map((row) => (
                    <tr key={row.pair}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={row.image} alt={row.pair} className="bird-thumb" />
                          <span>{row.pair}</span>
                        </div>
                      </td>
                      <td>{row.nest}</td>
                      <td>{row.expected}</td>
                      <td><span className={`badge ${row.statusClass}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mt-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h3 className="card-title mb-0">Recent Birds Added</h3>
              <a href="#" className="btn btn-sm btn-outline-primary">View all</a>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Ring Number</th>
                    <th>Species</th>
                    <th>Mutation</th>
                    <th>Sex</th>
                    <th>DOB</th>
                    <th>Status</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {birdRows.map((bird) => (
                    <tr key={bird.ring}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={bird.image} alt={bird.ring} className="bird-thumb" />
                          <span>{bird.ring}</span>
                        </div>
                      </td>
                      <td>{bird.species}</td>
                      <td>{bird.mutation}</td>
                      <td>{bird.sex === "Male" ? "♂" : "♀"}</td>
                      <td>{bird.dob}</td>
                      <td><span className={`badge ${bird.statusClass}`}>{bird.status}</span></td>
                      <td>{bird.added}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title mb-0">Breeding Overview</h3>
            </div>
            <div className="card-body d-flex align-items-center gap-3">
              <div className="donut-chart" aria-label="Breeding chart">
                <div className="donut-hole">
                  <div className="h3 mb-0">47</div>
                  <div className="text-muted text-sm">Total Chicks</div>
                </div>
              </div>
              <div className="small w-100">
                <div className="d-flex justify-content-between mb-1"><span>Hatched</span><span>47 (56%)</span></div>
                <div className="d-flex justify-content-between mb-1"><span>In Nest</span><span>22 (26%)</span></div>
                <div className="d-flex justify-content-between mb-1"><span>Eggs</span><span>18 (21%)</span></div>
                <div className="d-flex justify-content-between"><span>Lost</span><span>7 (8%)</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">Recent Activity</h3>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item">4 chicks ringed for Pair 06</div>
              <div className="list-group-item">Treatment added for Bird GB24-00123</div>
              <div className="list-group-item">New sale recorded</div>
              <div className="list-group-item">Egg laid for Pair 09</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
