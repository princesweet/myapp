"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function LiveScoresPage() {
  const { data, mutate } = useSWR("/api/live-scores", fetcher, { refreshInterval: 30000 });
  const groups: Record<string, any[]> = {};
  (data || []).forEach((m: any) => {
    const key = m.continent || "Unknown";
    groups[key] = groups[key] || [];
    groups[key].push(m);
  });
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Live Scores</h1>
        <button onClick={() => mutate()} className="px-3 py-1 border rounded">Refresh</button>
      </div>
      <div className="space-y-4">
        {Object.keys(groups).map(cont => (
          <div key={cont} className="border rounded p-3">
            <h2 className="font-semibold mb-2">{cont}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {groups[cont].map((m, i) => (
                <div key={i} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.homeTeam} vs {m.awayTeam}</div>
                    <div className="text-xs text-gray-600">{m.league} • {new Date(m.startTime).toLocaleString()}</div>
                  </div>
                  <div className="font-mono text-lg">{m.homeScore} - {m.awayScore}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}