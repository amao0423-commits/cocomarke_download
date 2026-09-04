"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type HeaderState = "default" | "afterDiagnosis" | "afterContact";

type SiteHeaderMobileProps = {
  currentState?: HeaderState;
  currentPath?: string;
  logoHref?: string;
  className?: string;
  /** 資料DL Thanks 完了時：下線・影を抑えて軽く見せる */
  isDownloadThanks?: boolean;
  /** メニュー「資料ダウンロード」のリンク先 */
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
const DEFAULT_SERVICE_DOCUMENT_HREF = "/servicedocument";
const RESTAURANT_DIAGNOSIS_URL = "/restaurant-diagnosis";
const META_UPDATES_URL = "/reference/meta-updates";

/** 本体サイト（cocomarke.com）への導線：ドロワー下部にまとめる */
const MAIN_SITE_LINKS: NavItem[] = [
  { label: "サービス", href: SERVICE_URL, external: true },
  { label: "お役立ち情報", href: USEFUL_INFO_URL, external: true },
  { label: "企業情報", href: COMPANY_INFO_URL, external: true },
  { label: "お問い合わせ", href: CONTACT_URL, external: true },
];

/** 上部バー「飲食店Instagram集客診断」：Instagram 風グラデをやや落ち着かせた色 */
const HEADER_RESTAURANT_DIAGNOSIS_COMPACT_CLASS =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-cta px-3 py-2 text-[11px] font-bold leading-tight text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lg sm:px-3.5 sm:text-xs";

/** ドロワー下部「飲食店Instagram集客診断」 */
const HEADER_RESTAURANT_DIAGNOSIS_MENU_CLASS =
  "flex w-full items-center justify-center rounded-full bg-cta px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lg";

/** ドロワー下部「サービス資料をダウンロード」 */
const HEADER_DOWNLOAD_MENU_CLASS =
  "flex w-full items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-[#0D3B75] to-[#001A3D] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg";

export function SiteHeaderMobile({
  currentState: _currentState = "default",
  currentPath = "/",
  logoHref = "/",
  className = "",
  isDownloadThanks = false,
  serviceDocumentHref = DEFAULT_SERVICE_DOCUMENT_HREF,
}: SiteHeaderMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /** 資料サイト内ナビ：お役立ち資料・Meta仕様変更まとめの2本
   *  （飲食店診断は「飲食店Instagram集客診断」CTAに集約） */
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "お役立ち資料", href: DOCUMENTS_URL },
      { label: "仕様変更まとめ", href: META_UPDATES_URL },
    ],
    [],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [currentPath, _currentState]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b-0 !bg-white transition-all duration-300 lg:hidden",
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
          "mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 transition-all duration-300 ease-out sm:px-6",
          isScrolled ? "h-14" : "h-16",
        ].join(" ")}
      >
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

        <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
          <Link
            href={RESTAURANT_DIAGNOSIS_URL}
            className={HEADER_RESTAURANT_DIAGNOSIS_COMPACT_CLASS}
          >
            飲食店Instagram集客診断
          </Link>

          <button
            type="button"
            aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-design-border bg-white text-design-text-primary transition hover:bg-design-bg-sub"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-design-text-primary/20"
          />
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-full z-50 border-b border-design-border bg-[#ffffff] shadow-lg"
          >
            <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6">
              {/* 資料サイト内ナビ（3本） */}
              <nav className="flex flex-col gap-1" aria-label="メインナビゲーション">
                {navItems.map((item) => {
                  const isActive =
                    currentPath === item.href ||
                    (item.href !== "/" && currentPath.startsWith(item.href));

                  const itemClass = [
                    "flex items-center rounded-lg px-4 py-3.5 text-sm font-medium transition",
                    isActive
                      ? "bg-emerald-50 text-design-primary"
                      : "text-design-text-primary hover:bg-design-bg-sub",
                  ].join(" ");

                  return (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      onClick={closeMenu}
                      className={itemClass}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* 主要CTA */}
              <div className="mt-4 flex flex-col gap-3 border-t border-design-border pt-4">
                <Link
                  href={RESTAURANT_DIAGNOSIS_URL}
                  onClick={closeMenu}
                  className={HEADER_RESTAURANT_DIAGNOSIS_MENU_CLASS}
                >
                  飲食店Instagram集客診断
                </Link>
                <Link
                  href={serviceDocumentHref}
                  onClick={closeMenu}
                  className={HEADER_DOWNLOAD_MENU_CLASS}
                >
                  サービス資料をダウンロード
                </Link>
              </div>

              {/* 本体サイトへの導線（1行にまとめる・枠線あり） */}
              <div className="mt-4 border-t border-design-border pt-4">
                <p className="px-1 pb-2 text-xs font-medium text-gray-400">
                  COCOマーケ公式HP
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {MAIN_SITE_LINKS.map((item) => (
                    <a
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={closeMenu}
                      className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-500 transition hover:bg-design-bg-sub hover:text-gray-700"
                    >
                      <span>{item.label}</span>
                      <svg
                        className="h-3 w-3"
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
