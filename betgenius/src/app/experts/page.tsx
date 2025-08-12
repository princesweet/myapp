"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ExpertsPage() {
  const { data: experts, mutate } = useSWR("/api/experts", fetcher);
  const [betCode, setBetCode] = useState("");

  async function submitPick() {
    const res = await fetch("/api/experts/picks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: betCode }) });
    if (res.ok) {
      setBetCode("");
      mutate();
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Experts</h1>
      <div className="p-3 border rounded">
        <div className="font-semibold mb-2">Submit your bet code as a pick</div>
        <div className="flex gap-2">
          <input className="border rounded p-2 flex-1" placeholder="Enter code (e.g., B365-XXXX)" value={betCode} onChange={e => setBetCode(e.target.value)} />
          <button onClick={submitPick} className="px-3 py-2 bg-indigo-600 text-white rounded">Submit</button>
        </div>
      </div>
      <div className="space-y-2">
        {(experts || []).map((ex: any) => (
          <div key={ex.id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-medium">{ex.user?.name || ex.user?.email || "Expert"}</div>
              <div className="text-sm text-gray-600">Win rate: {Math.round(ex.winRate * 100)}% • Picks: {ex.picksCount}</div>
            </div>
            <div className="text-sm">Verified: {ex.verified ? "Yes" : "No"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}