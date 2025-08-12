"use client";

import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CodesPage() {
  const { data, mutate } = useSWR("/api/bet-codes", fetcher);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alias, setAlias] = useState<string>("");

  async function saveAlias(id: string) {
    await fetch(`/api/bet-codes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alias }) });
    setEditingId(null);
    mutate();
  }
  async function remove(id: string) {
    await fetch(`/api/bet-codes/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">My Bet Codes</h1>
      <div className="space-y-2">
        {(data || []).map((b: any) => (
          <div key={b.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-mono text-lg">{b.code}</div>
              <div className="text-sm text-gray-600">{b.providerKey} • {b.sport} {b.alias ? `• ${b.alias}` : ""}</div>
            </div>
            <div className="flex items-center gap-2">
              {editingId === b.id ? (
                <>
                  <input className="border rounded p-1" value={alias} onChange={e => setAlias(e.target.value)} placeholder="Alias" />
                  <button onClick={() => saveAlias(b.id)} className="px-3 py-1 border rounded">Save</button>
                </>
              ) : (
                <button onClick={() => { setEditingId(b.id); setAlias(b.alias || ""); }} className="px-3 py-1 border rounded">Edit Alias</button>
              )}
              <Link href={`/codes/${b.id}/stats`} className="px-3 py-1 border rounded">View Stats</Link>
              <button onClick={() => remove(b.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}