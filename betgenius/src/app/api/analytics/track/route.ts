import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDeviceType } from "@/lib/ua";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { type, betCodeId } = await request.json().catch(() => ({}));
  const headers = Object.fromEntries(request.headers.entries());
  const userAgent = headers["user-agent"] ?? null;
  const referrer = headers["referer"] ?? headers["referrer"] ?? null;
  const deviceType = getDeviceType(userAgent);
  const userId = session?.user ? (session.user as any).id : null;

  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });
  await prisma.analyticsEvent.create({
    data: {
      type,
      betCodeId: betCodeId ?? null,
      userId,
      referrer: referrer ?? undefined,
      deviceType,
      userAgent: userAgent ?? undefined,
    },
  });
  return NextResponse.json({ ok: true });
}