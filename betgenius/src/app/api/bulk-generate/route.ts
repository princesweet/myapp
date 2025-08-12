import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { providers, getProviderByKey } from "@/lib/providers";
import { prisma } from "@/lib/prisma";
import { canGenerateCode, recordGeneration } from "@/lib/quota";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const isPro = Boolean((session.user as any).isPro);

  const body = await request.json().catch(() => ({}));
  const { providerKeys, sport, selections } = body ?? {};
  if (!sport || !Array.isArray(selections) || selections.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const keys: string[] = Array.isArray(providerKeys) && providerKeys.length > 0 ? providerKeys : providers.map(p => p.key);

  const results: any[] = [];
  for (const key of keys) {
    const provider = getProviderByKey(key);
    if (!provider) continue;
    const quota = await canGenerateCode(userId, isPro);
    if (!quota.allowed) break;
    const result = await provider.generateCode(selections);
    const bet = await prisma.betCode.create({
      data: {
        providerKey: result.providerKey,
        code: result.code,
        selections: result.selections as any,
        sport,
        userId,
        externalUrl: result.externalUrl,
        status: "GENERATED",
      },
    });
    await prisma.analyticsEvent.create({ data: { type: "CODE_GENERATED", betCodeId: bet.id, userId } });
    await recordGeneration(userId);
    results.push({ providerKey: key, code: bet.code, externalUrl: bet.externalUrl });
  }

  return NextResponse.json({ results });
}