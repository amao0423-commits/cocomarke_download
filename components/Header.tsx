"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteHeaderMobile } from "@/components/site-header-mobile";

type HeaderState = "default" | "afterDiagnosis" | "afterContact";

function resolveHeaderState(pathname: string): HeaderState {
  if (pathname.startsWith("/thanks/diagnosis")) {
    return "afterDiagnosis";
  }

  if (pathname.startsWith("/thanks/contact")) {
    return "afterContact";
  }

  return "default";
}

function HeaderBar() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  /** 管理画面ではサイト共通ヘッダー（資料一覧ナビ等）を出さない */
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const currentState = resolveHeaderState(pathname);
  const isDownloadThanks =
    pathname === "/download" && searchParams.get("thanks") === "1";

  return (
    <>
      <SiteHeader
        currentState={currentState}
        currentPath={pathname}
        isDownloadThanks={isDownloadThanks}
      />
      <SiteHeaderMobile
        currentState={currentState}
        currentPath={pathname}
        isDownloadThanks={isDownloadThanks}
      />
    </>
  );
}

function HeaderFallback() {
  return (
    <div
      className="sticky top-0 z-50 min-h-[4rem] !bg-white shadow-none transition-all duration-300"
      aria-hidden
    />
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderBar />
    </Suspense>
  );
}
