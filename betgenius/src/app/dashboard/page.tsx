"use client";

import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      <AdBanner slot="dashboard-top" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
        <Link href="/predict" className="bg-indigo-600 text-white px-4 py-2 rounded">Start Predicting</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Total Bets: 0</div>
        <div className="p-4 border rounded">Wins: 0</div>
        <div className="p-4 border rounded">Losses: 0</div>
      </div>
      <AdBanner slot="dashboard-bottom" />
    </div>
  );
}