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
  /** ボタン見た目のCTA */
  button?: boolean;
};

const SERVICE_URL = "https://www.cocomarke.com/";
const USEFUL_INFO_URL = "https://www.cocomarke.com/blog";
const COMPANY_INFO_URL = "https://www.cocomarke.com/company";
const CONTACT_URL = "https://www.cocomarke.com/contact";
const DOCUMENTS_URL = "/";
const SERVICE_DOCUMENT_URL = "/download";

/** 無料相談：白背景・ネイビーグラデ文字（右CTA列のバランス用にやや抑える） */
const HEADER_CTA_CLASS =
  "inline-flex shrink-0 min-w-[11.5rem] items-center justify-center rounded-full border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg";

const HEADER_CTA_TEXT_CLASS =
  "bg-gradient-to-r from-[#01408D] to-[#001A3D] bg-clip-text text-transparent";

/** 資料をダウンロード：ネイビーグラデ背景・白文字・薄枠・軽い影 */
const HEADER_DOWNLOAD_CTA_CLASS =
  "inline-flex shrink-0 min-w-[11.5rem] items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-[#01408D] to-[#001A3D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg";

/** 中央テキストナビ（スクロール前後で色は固定・hover / current のみ変化） */
const NAV_LINK_FOCUS =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function centerNavLinkClass(isActive: boolean): string {
  const shared = [
    "relative inline-flex items-center pb-1 text-sm leading-none transition-all duration-300",
    NAV_LINK_FOCUS,
    "hover:text-gray-900",
  ].join(" ");
  if (!isActive) {
    return `${shared} font-medium text-gray-500`;
  }
  return [
    shared,
    "font-semibold text-gray-900",
    "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-gray-900 after:content-['']",
  ].join(" ");
}

export function SiteHeader({
  currentState = "default",
  currentPath = "/",
  logoHref = SERVICE_URL,
  className = "",
  isDownloadThanks = false,
}: SiteHeaderProps) {
  const navItems = useMemo<NavItem[]>(() => {
    switch (currentState) {
      case "afterDiagnosis":
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "資料一覧", href: DOCUMENTS_URL },
          { label: "無料相談", href: CONTACT_URL, external: true, button: true },
        ];
      case "afterContact":
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "資料一覧", href: DOCUMENTS_URL },
        ];
      case "default":
      default:
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "資料一覧", href: DOCUMENTS_URL },
          { label: "無料相談", href: CONTACT_URL, external: true, button: true },
        ];
    }
  }, [currentState]);

  const centerNavItems = useMemo(
    () => navItems.filter((item) => !item.button),
    [navItems],
  );
  const ctaNavButtons = useMemo(
    () => navItems.filter((item) => item.button),
    [navItems],
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
          "mx-auto hidden w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 px-5 transition-all duration-300 ease-out lg:grid lg:px-8 xl:gap-x-4 xl:px-10",
          isScrolled ? "h-14" : "h-16",
        ].join(" ")}
      >
        {/* 左：ロゴ */}
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

        {/* 中：テキストナビ（リンク間はやや詰める） */}
        <nav
          className="flex min-w-0 shrink items-center justify-center gap-4 xl:gap-5"
          aria-label="メインナビゲーション"
        >
          {centerNavItems.map((item) => {
            const isActive =
              !item.external &&
              (currentPath === item.href ||
                (item.href !== "/" && currentPath.startsWith(item.href)));

            const linkClass = centerNavLinkClass(isActive);

            if (item.external) {
              return (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={linkClass}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 右：CTA（右列いっぱいに寄せ、左列と対称にバランス） */}
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5">
          {ctaNavButtons.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className={HEADER_CTA_CLASS}
            >
              <span className={HEADER_CTA_TEXT_CLASS}>{item.label}</span>
            </a>
          ))}
          <Link href={SERVICE_DOCUMENT_URL} className={HEADER_DOWNLOAD_CTA_CLASS}>
            資料をダウンロード
          </Link>
        </div>
      </div>
    </header>
  );
}
