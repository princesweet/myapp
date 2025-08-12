import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function fetchWikiSummary(name: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  return j;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const existingList = await prisma.player.findMany({ where: { name: { contains: name, } }, take: 1 });
  const existing = existingList[0];
  if (existing) return NextResponse.json({ id: existing.id, name: existing.name, team: existing.team, nationality: existing.nationality, age: existing.age, bio: (existing.bio as any)?.extract, stats: existing.stats });

  const wiki = await fetchWikiSummary(name);
  const payload: any = {
    name,
    sport: "FOOTBALL",
    bio: wiki ? { extract: wiki.extract } : undefined,
  };
  const created = await prisma.player.create({ data: payload });
  return NextResponse.json({ id: created.id, name: created.name, team: created.team, nationality: created.nationality, age: created.age, bio: (created.bio as any)?.extract, stats: created.stats });
}