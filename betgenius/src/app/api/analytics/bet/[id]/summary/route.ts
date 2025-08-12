import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, context: any) {
  const betCodeId = context.params.id as string;
  const events = await prisma.analyticsEvent.findMany({ where: { betCodeId } });
  const total = events.length;
  const byType: Record<string, number> = {};
  const byDevice: Record<string, number> = {};
  const byReferrer: Record<string, number> = {};
  for (const e of events) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    const device = e.deviceType || "unknown";
    byDevice[device] = (byDevice[device] || 0) + 1;
    const ref = e.referrer || "direct";
    byReferrer[ref] = (byReferrer[ref] || 0) + 1;
  }
  return NextResponse.json({ total, byType, byDevice, byReferrer });
}