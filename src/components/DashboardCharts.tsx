"use client";

import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Monthly = { month: string; eggs: number; chicks: number };
type Species = { name: string; value: number };

const colours = ["#2563eb", "#7c3aed", "#16a34a", "#f59e0b"];

export default function DashboardCharts({ monthly, species }: { monthly: Monthly[]; species: Species[] }) {
  return (
    <div className="row row-cards mb-3">
      <div className="col-lg-8">
        <div className="card chart-card">
          <div className="card-header"><h3 className="card-title mb-0">Breeding Performance</h3></div>
          <div className="card-body">
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="eggs" stroke="#7c3aed" strokeWidth={2} fill="transparent" name="Eggs" />
                  <Area type="monotone" dataKey="chicks" stroke="#2563eb" strokeWidth={3} fill="#dbeafe" name="Chicks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card chart-card h-100">
          <div className="card-header"><h3 className="card-title mb-0">Species Mix</h3></div>
          <div className="card-body">
            <div className="chart-wrap chart-wrap-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={species} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4}>
                    {species.map((entry, index) => <Cell key={entry.name} fill={colours[index % colours.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="species-legend">
              {species.map((item, index) => (
                <div className="d-flex justify-content-between align-items-center" key={item.name}>
                  <span><span className="legend-dot" style={{ background: colours[index % colours.length] }} />{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
