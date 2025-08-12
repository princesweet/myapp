"use client";

import { useState } from "react";
import { providers } from "@/lib/providers";
import type { Selection } from "@/lib/providers/types";
import toast from "react-hot-toast";
import { AdBanner } from "@/components/AdBanner";

const sports = [
  { key: "FOOTBALL", label: "Football" },
  { key: "TENNIS", label: "Tennis" },
  { key: "BASKETBALL", label: "Basketball" },
  { key: "ATHLETICS", label: "Athletics" },
  { key: "F1", label: "F1" },
  { key: "GOLF", label: "Golf" },
  { key: "BOXING", label: "Boxing" },
  { key: "DARTS", label: "Darts" },
];

const sampleMatches: Record<string, string[]> = {
  FOOTBALL: ["FC Alpha vs FC Beta", "City United vs River Rovers", "AC North vs South FC"],
  TENNIS: ["Player A vs Player B", "Player C vs Player D"],
  BASKETBALL: ["Lions vs Eagles", "Bulls vs Wolves"],
  ATHLETICS: ["100m Heat 1", "200m Final"],
  F1: ["Grand Prix Qualifying", "Grand Prix Race"],
  GOLF: ["Open Round 1", "Open Round 2"],
  BOXING: ["Fighter A vs Fighter B"],
  DARTS: ["Darts Match 1"],
};

export default function PredictPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [selections, setSelections] = useState<Selection[]>([]);
  const [externalUrl, setExternalUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function onGenerate() {
    if (!selectedProvider || !selectedSport || !selectedMatch) {
      toast.error("Select provider, sport, and a match");
      return;
    }
    const provider = providers.find(p => p.key === selectedProvider);
    if (!provider) return;

    const mkt: Selection = { match: selectedMatch, market: "1X2", pick: "Home" };
    setSelections([mkt]);

    setLoading(true);
    try {
      const res = await fetch("/api/generate-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ providerKey: provider.key, sport: selectedSport, selections: [mkt] }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setGeneratedCode(data.code);
      setExternalUrl(data.externalUrl);
      toast.success("Code generated");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <AdBanner slot="predict-top" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">1. Select betting site</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {providers.map(p => (
              <button key={p.key} onClick={() => setSelectedProvider(p.key)} className={`border rounded p-3 text-left ${selectedProvider === p.key ? "border-indigo-600 bg-indigo-50" : ""}`}>
                <div className="font-medium">{p.displayName}</div>
                <div className="text-xs text-gray-500">Key: {p.key}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedProvider && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">2. Select sport</h2>
            <div className="flex flex-wrap gap-2">
              {sports.map(s => (
                <button key={s.key} onClick={() => setSelectedSport(s.key)} className={`px-3 py-2 border rounded ${selectedSport === s.key ? "border-indigo-600 bg-indigo-50" : ""}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSport && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">3. Generate code</h2>
            <button disabled={loading} onClick={onGenerate} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
              {loading ? "Generating..." : "Generate Code"}
            </button>
            {generatedCode && (
              <div className="mt-3 p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Generated Code</div>
                    <div className="text-2xl font-mono">{generatedCode}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => { navigator.clipboard.writeText(generatedCode); toast.success("Copied"); }} className="px-3 py-2 border rounded">Copy</button>
                    {externalUrl && (
                      <a href={externalUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-600 text-white rounded">Bet Now</a>
                    )}
                  </div>
                </div>
                {selections.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-semibold mb-2">Selections</div>
                    <ul className="text-sm space-y-1">
                      {selections.map((s, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{s.match}</span>
                          <span>{s.market} - {s.pick}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:col-span-1 border rounded p-3">
        <h3 className="font-semibold mb-2">Matches</h3>
        <div className="space-y-2 max-h-[70vh] overflow-auto">
          {(sampleMatches[selectedSport] || []).map(m => (
            <button key={m} onClick={() => setSelectedMatch(m)} className={`w-full text-left border rounded p-2 ${selectedMatch === m ? "border-indigo-600 bg-indigo-50" : ""}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}