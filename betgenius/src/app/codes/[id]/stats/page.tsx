"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function CodeStatsPage(props: any) {
  const id: string = props.params?.id;
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    fetch(`/api/analytics/bet/${id}/summary`).then(r => r.json()).then(setData);
  }, [id]);

  if (!data) return <div className="p-4">Loading...</div>;

  const deviceData = Object.entries(data.byDevice).map(([name, value]) => ({ name, value }));
  const refData = Object.entries(data.byReferrer).map(([name, value]) => ({ name, value }));

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"]; 

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Bet Code Analytics</h1>
      <div>Total events: {data.total}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 p-3 border rounded">
          <h2 className="font-semibold mb-2">Devices</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {deviceData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64 p-3 border rounded">
          <h2 className="font-semibold mb-2">Referrers</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={refData}>
              <XAxis dataKey="name" hide={false} angle={-25} textAnchor="end" height={60} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}