"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function DiagnosisFooterLinkInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("diagnosis", "1");
    return `${pathname}?${p.toString()}`;
  }, [pathname, searchParams]);

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-design-text-secondary transition-colors hover:text-design-primary"
    >
      Instagramアカウント無料診断
    </Link>
  );
}

export function DiagnosisFooterLink() {
  return (
    <Suspense
      fallback={
        <Link
          href="/?diagnosis=1"
          className="inline-flex items-center gap-1.5 text-design-text-secondary transition-colors hover:text-design-primary"
        >
          Instagramアカウント無料診断
        </Link>
      }
    >
      <DiagnosisFooterLinkInner />
    </Suspense>
  );
}
