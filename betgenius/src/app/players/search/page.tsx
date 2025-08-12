"use client";

import { useState } from "react";

export default function PlayerSearchPage() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch(`/api/player/search?name=${encodeURIComponent(q)}`);
    const data = await r.json();
    setRes(data);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Search Player/Athlete</h1>
      <form onSubmit={onSearch} className="flex gap-2">
        <input className="flex-1 border rounded p-2" placeholder="Type a name..." value={q} onChange={e => setQ(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </form>
      {res && (
        <div className="p-4 border rounded space-y-2">
          <div className="text-xl font-semibold">{res.name}</div>
          {res.team && <div>Team: {res.team}</div>}
          {res.nationality && <div>Nationality: {res.nationality}</div>}
          {res.age && <div>Age: {res.age}</div>}
          {res.bio && <div className="text-sm text-gray-700">{res.bio}</div>}
          {res.stats && (
            <div className="text-sm text-gray-700">
              Latest stats: goals {res.stats.goals ?? "-"}, assists {res.stats.assists ?? "-"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}