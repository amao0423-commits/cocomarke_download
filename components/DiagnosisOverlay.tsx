"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const InstagramDiagnostic = dynamic(
  () => import("@/components/InstagramDiagnostic"),
  { ssr: false, loading: () => null }
);

function DiagnosisOverlayInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const open = searchParams.get("diagnosis") === "1";

  const close = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("diagnosis");
    const q = p.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label="Instagramアカウント診断"
    >
      <InstagramDiagnostic variant="overlay" onRequestClose={close} />
    </div>
  );
}

export function DiagnosisOverlay() {
  return (
    <Suspense fallback={null}>
      <DiagnosisOverlayInner />
    </Suspense>
  );
}
