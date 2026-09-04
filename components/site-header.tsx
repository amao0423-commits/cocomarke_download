"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HeaderState = "default" | "afterDiagnosis" | "afterContact";

type SiteHeaderProps = {
  currentState?: HeaderState;
  currentPath?: string;
  logoHref?: string;
  className?: string;
  /** 資料DL Thanks 完了時：下線・影を抑えて軽く見せる */
  isDownloadThanks?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const SERVICE_URL = "https://www.cocomarke.com/";
const DOCUMENTS_URL = "/";
const RESTAURANT_DIAGNOSIS_URL = "/restaurant-diagnosis";
const META_UPDATES_URL = "/reference/meta-updates";

/** 本体サイト（cocomarke.com）への導線：右端に1本だけ集約 */
const MAIN_SITE_URL = SERVICE_URL;

/** 飲食店Instagram集客診断：主要CTA（オレンジ #E0603A） — design doc の第一アクセント */
const HEADER_RESTAURANT_DIAGNOSIS_CTA_CLASS =
  "inline-flex max-w-full shrink-0 whitespace-nowrap min-w-[10.5rem] sm:min-w-[11.5rem] items-center justify-center rounded-full bg-cta px-3 py-2.5 text-xs font-bold text-white shadow-[0_2px_8px_rgba(224,96,58,.3)] transition-all duration-200 sm:px-4 sm:text-sm hover:bg-cta-hover hover:shadow-md";

/** 本体サイトへ外部リンク（枠線あり・右端） */
const MAIN_SITE_LINK_CLASS =
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700 xl:text-sm";

/** 中央テキストナビ（スクロール前後で色は固定・hover / current のみ変化） */
const NAV_LINK_FOCUS =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function centerNavLinkClass(isActive: boolean): string {
  const shared = [
    "relative inline-flex items-center pb-1 text-sm leading-none transition-all duration-300",
    NAV_LINK_FOCUS,
    "hover:text-[#0D3B75]",
  ].join(" ");
  if (!isActive) {
    return `${shared} font-medium text-gray-500`;
  }
  return [
    shared,
    "font-semibold text-[#0D3B75]",
    "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#2E7D5B] after:content-['']",
  ].join(" ");
}

export function SiteHeader({
  currentState: _currentState = "default",
  currentPath = "/",
  logoHref = "/",
  className = "",
  isDownloadThanks = false,
}: SiteHeaderProps) {
  /** 資料サイト内ナビ：お役立ち資料・Meta仕様変更まとめの2本
   *  （飲食店診断は右側の「飲食店Instagram集客診断」CTAに集約） */
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "お役立ち資料", href: DOCUMENTS_URL },
      { label: "仕様変更まとめ", href: META_UPDATES_URL },
    ],
    [],
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b-0 !bg-white transition-all duration-300",
        isDownloadThanks
          ? "shadow-none"
          : isScrolled
            ? "shadow-md"
            : "shadow-none",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto hidden w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 px-4 transition-all duration-300 ease-out sm:gap-x-3 sm:px-5 lg:grid lg:px-6 xl:gap-x-4 xl:px-10",
          isScrolled
            ? "min-h-16 py-2.5 sm:py-3"
            : "min-h-20 py-3.5 sm:min-h-[5.25rem] sm:py-4",
        ].join(" ")}
      >
        {/* 左：ロゴ（COCOマーケロゴのまま） */}
        <div className="flex min-w-0 items-center justify-start">
          <Link
            href={logoHref}
            className="inline-flex shrink-0 items-center"
            aria-label="COCOマーケ トップへ"
          >
            <Image
              src="/images/cocomarke-logo.png"
              alt="COCOマーケ"
              width={200}
              height={49}
              className={[
                "w-auto transition-all duration-300 ease-out",
                isScrolled ? "h-7" : "h-9",
              ].join(" ")}
              priority
            />
          </Link>
        </div>

        {/* 中：資料サイト内ナビ（2本に絞る・現在地は緑下線） */}
        <nav
          className="flex min-w-0 shrink items-center justify-center gap-5 lg:gap-6 xl:gap-8"
          aria-label="メインナビゲーション"
        >
          {navItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/" && currentPath.startsWith(item.href));

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={centerNavLinkClass(isActive)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 右：飲食店CTA ＋ 本体サイト導線（1本に集約） */}
        <div className="flex min-w-0 flex-nowrap items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5">
          <Link
            href={RESTAURANT_DIAGNOSIS_URL}
            className={HEADER_RESTAURANT_DIAGNOSIS_CTA_CLASS}
          >
            飲食店Instagram集客診断
          </Link>
          <a
            href={MAIN_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className={MAIN_SITE_LINK_CLASS}
            aria-label="COCOマーケ公式HPへ（別タブで開く）"
          >
            <span>COCOマーケ公式HP</span>
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
