import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(_req: Request, context: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { alias } = await _req.json().catch(() => ({}));
  const id = context.params.id as string;
  const existing = await prisma.betCode.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = await prisma.betCode.update({ where: { id }, data: { alias } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, context: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const id = context.params.id as string;
  const existing = await prisma.betCode.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.betCode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}