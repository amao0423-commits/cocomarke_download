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
  /** メニュー「資料をダウンロード」のリンク先 */
  serviceDocumentHref?: string;
};

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const SERVICE_URL = "https://www.cocomarke.com/";
const USEFUL_INFO_URL = "https://www.cocomarke.com/blog";
const COMPANY_INFO_URL = "https://www.cocomarke.com/company";
const CONTACT_URL = "https://www.cocomarke.com/contact";
const DOCUMENTS_URL = "/";
const DEFAULT_SERVICE_DOCUMENT_HREF = "/download";
const RESTAURANT_DIAGNOSIS_URL = "/restaurant-diagnosis";

/** 飲食店向け診断：Instagram 風グラデをやや落ち着かせた色・白文字・薄枠 */
const HEADER_RESTAURANT_DIAGNOSIS_CTA_CLASS =
  "inline-flex max-w-full shrink-0 whitespace-nowrap min-w-[8.5rem] sm:min-w-[9.5rem] items-center justify-center rounded-full border border-white/35 bg-gradient-to-r from-[#6f4f88] via-[#b05068] to-[#c99552] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 sm:px-4 sm:text-sm hover:opacity-95 hover:shadow-md";

/** 資料をダウンロード：ネイビーグラデ背景・白文字・薄枠・軽い影 */
const HEADER_DOWNLOAD_CTA_CLASS =
  "inline-flex max-w-full shrink-0 whitespace-nowrap min-w-[10.5rem] sm:min-w-[11.5rem] items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-[#01408D] to-[#001A3D] px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 sm:px-4 sm:text-sm hover:opacity-95 hover:shadow-md";

/** 中央テキストナビ（スクロール前後で色は固定・hover / current のみ変化） */
const NAV_LINK_FOCUS =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function centerNavLinkClass(isActive: boolean): string {
  const shared = [
    "relative inline-flex items-center pb-1 text-xs leading-none transition-all duration-300 xl:text-sm",
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
  serviceDocumentHref = DEFAULT_SERVICE_DOCUMENT_HREF,
}: SiteHeaderProps) {
  const navItems = useMemo<NavItem[]>(() => {
    switch (currentState) {
      case "afterDiagnosis":
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "お役立ち資料", href: DOCUMENTS_URL },
          { label: "お問い合わせ", href: CONTACT_URL, external: true },
        ];
      case "afterContact":
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "お役立ち資料", href: DOCUMENTS_URL },
        ];
      case "default":
      default:
        return [
          { label: "サービス", href: SERVICE_URL, external: true },
          { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
          { label: "企業情報", href: COMPANY_INFO_URL, external: true },
          { label: "お役立ち資料", href: DOCUMENTS_URL },
          { label: "お問い合わせ", href: CONTACT_URL, external: true },
        ];
    }
  }, [currentState]);

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
          className="flex min-w-0 shrink items-center justify-center gap-2.5 lg:gap-3 xl:gap-4 2xl:gap-5"
          aria-label="メインナビゲーション"
        >
          {navItems.map((item) => {
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

        {/* 右：飲食店診断 + 資料DL CTA（折り返し不可：固定行高と干渉して崩れるのを防ぐ） */}
        <div className="flex min-w-0 flex-nowrap items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5">
          <Link
            href={RESTAURANT_DIAGNOSIS_URL}
            className={HEADER_RESTAURANT_DIAGNOSIS_CTA_CLASS}
          >
            飲食店診断
          </Link>
          <Link href={serviceDocumentHref} className={HEADER_DOWNLOAD_CTA_CLASS}>
            資料をダウンロード
          </Link>
        </div>
      </div>
    </header>
  );
}
