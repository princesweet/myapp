"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CommunityPage() {
  const { data, mutate } = useSWR("/api/community/posts", fetcher);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function submit() {
    await fetch("/api/community/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content }) });
    setTitle(""); setContent(""); mutate();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Community</h1>
      <div className="p-3 border rounded space-y-2">
        <input className="w-full border rounded p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2" placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={submit} className="px-3 py-2 bg-indigo-600 text-white rounded">Post</button>
      </div>
      <div className="space-y-2">
        {(data || []).map((p: any) => (
          <div key={p.id} className="p-3 border rounded">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-700">{p.content}</div>
            <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}