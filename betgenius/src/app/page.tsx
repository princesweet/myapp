import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <AdBanner slot="home-top" />
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">BetGenius</h1>
        <p className="text-gray-600">Smart predictions, one-click bet codes, and real-time analytics.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/signup" className="px-4 py-2 rounded border">Sign up</Link>
          <Link href="/login" className="px-4 py-2 rounded border">Log in</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded bg-indigo-600 text-white">Start Predicting</Link>
        </div>
      </section>
      <AdBanner slot="home-bottom" />
    </main>
  );
}
