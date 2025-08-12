"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AdBanner({ slot, className = "" }: { slot: string; className?: string }) {
  const { data: session } = useSession();
  const isPro = Boolean((session?.user as any)?.isPro);

  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (isPro) return null;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}