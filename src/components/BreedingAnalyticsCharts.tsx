"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { label: string; eggs: number; hatched: number; chicks: number; success: number };

export default function BreedingAnalyticsCharts({ rows }: { rows: Row[] }) {
  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title mb-0">Pair Performance</h3></div>
      <div className="card-body">
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eaf0" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="eggs" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Eggs" />
              <Bar dataKey="hatched" fill="#2563eb" radius={[6, 6, 0, 0]} name="Hatched" />
              <Bar dataKey="chicks" fill="#16a34a" radius={[6, 6, 0, 0]} name="Chicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
