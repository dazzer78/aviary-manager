"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const monthlyHatches = [
  { month: "Jan", chicks: 8, eggs: 16 },
  { month: "Feb", chicks: 12, eggs: 19 },
  { month: "Mar", chicks: 18, eggs: 25 },
  { month: "Apr", chicks: 24, eggs: 31 },
  { month: "May", chicks: 31, eggs: 38 },
  { month: "Jun", chicks: 47, eggs: 56 },
];

const breedingRates = [
  { month: "Jan", fertility: 72, hatch: 64 },
  { month: "Feb", fertility: 75, hatch: 68 },
  { month: "Mar", fertility: 79, hatch: 71 },
  { month: "Apr", fertility: 82, hatch: 74 },
  { month: "May", fertility: 85, hatch: 77 },
  { month: "Jun", fertility: 84, hatch: 76 },
];

const speciesBreakdown = [
  { name: "Gouldians", value: 58 },
  { name: "Canaries", value: 42 },
  { name: "Zebras", value: 36 },
  { name: "Other", value: 20 },
];

const quickActions = [
  { label: "Add Bird", href: "/dashboard/birds/new", icon: "🐦" },
  { label: "Create Pair", href: "/dashboard/pairs/new", icon: "💞" },
  { label: "Record Egg", href: "/dashboard/eggs/new", icon: "🥚" },
  { label: "Add Treatment", href: "/dashboard/treatments/new", icon: "💊" },
  { label: "Record Sale", href: "/dashboard/sales/new", icon: "💷" },
];

const chartColours = ["#2563eb", "#7c3aed", "#16a34a", "#f59e0b"];

export default function DashboardPage() {
  return (
    <>
      <div className="quick-actions mb-3">
        {quickActions.map((action) => (
          <Link href={action.href} className="quick-action" key={action.label}>
            <span className="quick-action-icon">{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="row row-cards mb-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card stat-card">
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
          <div className="card stat-card">
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
          <div className="card stat-card">
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
          <div className="card stat-card">
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

      <div className="row row-cards mb-3">
        <div className="col-lg-8">
          <div className="card chart-card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div>
                <h3 className="card-title mb-0">Breeding Performance</h3>
                <div className="text-muted small">Monthly eggs and chicks recorded this season</div>
              </div>
              <span className="badge bg-green-lt text-green">+18% season trend</span>
            </div>
            <div className="card-body">
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyHatches} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chicksGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.26} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eaf0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="eggs" stroke="#7c3aed" strokeWidth={2} fill="transparent" name="Eggs" />
                    <Area type="monotone" dataKey="chicks" stroke="#2563eb" strokeWidth={3} fill="url(#chicksGradient)" name="Chicks" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card chart-card h-100">
            <div className="card-header">
              <h3 className="card-title mb-0">Species Mix</h3>
              <div className="text-muted small">Current registered birds</div>
            </div>
            <div className="card-body">
              <div className="chart-wrap chart-wrap-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={speciesBreakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4}>
                      {speciesBreakdown.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColours[index % chartColours.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="species-legend">
                {speciesBreakdown.map((item, index) => (
                  <div className="d-flex justify-content-between align-items-center" key={item.name}>
                    <span><span className="legend-dot" style={{ background: chartColours[index % chartColours.length] }} />{item.name}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
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
              <h3 className="card-title mb-0">Fertility & Hatch Rate</h3>
            </div>
            <div className="card-body">
              <div className="chart-wrap chart-wrap-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breedingRates} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eaf0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} unit="%" />
                    <Tooltip />
                    <Bar dataKey="fertility" fill="#2563eb" radius={[6, 6, 0, 0]} name="Fertility" />
                    <Bar dataKey="hatch" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Hatch" />
                  </BarChart>
                </ResponsiveContainer>
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
