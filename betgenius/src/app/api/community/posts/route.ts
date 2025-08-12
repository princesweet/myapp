import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { title, content } = await request.json().catch(() => ({}));
  if (!title || !content) return NextResponse.json({ error: "title and content required" }, { status: 400 });
  const post = await prisma.post.create({ data: { title, content, userId } });
  return NextResponse.json(post);
}