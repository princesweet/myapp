import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const experts = await prisma.expertProfile.findMany({ include: { user: true }, orderBy: { winRate: "desc" } });
  return NextResponse.json(experts);
}