import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { providers } from "@/lib/providers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { code } = await request.json().catch(() => ({}));
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const bet = await prisma.betCode.findFirst({ where: { code } });
  if (!bet) return NextResponse.json({ error: "Unknown code" }, { status: 404 });

  const provider = providers.find(p => p.key === bet.providerKey);
  if (provider?.validateCode && !(await provider.validateCode(bet.code))) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  let profile = await prisma.expertProfile.findUnique({ where: { userId } });
  if (!profile) profile = await prisma.expertProfile.create({ data: { userId, verified: false } });

  const pick = await prisma.expertPick.create({ data: { expertId: profile.id, betCodeId: bet.id, verified: true } });
  await prisma.expertProfile.update({ where: { id: profile.id }, data: { picksCount: { increment: 1 } } });

  return NextResponse.json({ id: pick.id });
}