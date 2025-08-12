import Link from "next/link";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b">
        <div className="max-w-6xl mx-auto flex items-center gap-4 p-3">
          <Link href="/" className="font-bold">BetGenius</Link>
          <Link href="/dashboard" className="text-sm">Dashboard</Link>
          <Link href="/predict" className="text-sm">Predict</Link>
          <Link href="/codes" className="text-sm">My Codes</Link>
          <Link href="/players/search" className="text-sm">Player Search</Link>
          <Link href="/livescores" className="text-sm">Live Scores</Link>
          <Link href="/experts" className="text-sm">Experts</Link>
          <Link href="/community" className="text-sm">Community</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}