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
const DEFAULT_SERVICE_DOCUMENT_HREF = "/download";
const RESTAURANT_DIAGNOSIS_URL = "/restaurant-diagnosis";

/** 上部バー「飲食店Instagram集客診断」：Instagram 風グラデをやや落ち着かせた色 */
const HEADER_RESTAURANT_DIAGNOSIS_COMPACT_CLASS =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white/35 bg-gradient-to-r from-[#6f4f88] via-[#b05068] to-[#c99552] px-3 py-2 text-[11px] font-semibold leading-tight text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg sm:px-3.5 sm:text-xs";

/** ドロワー下部「飲食店Instagram集客診断」 */
const HEADER_RESTAURANT_DIAGNOSIS_MENU_CLASS =
  "flex w-full items-center justify-center rounded-full border border-white/35 bg-gradient-to-r from-[#6f4f88] via-[#b05068] to-[#c99552] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg";

/** ドロワー下部「サービス資料をダウンロード」 */
const HEADER_DOWNLOAD_MENU_CLASS =
  "flex w-full items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-[#01408D] to-[#001A3D] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-lg";

export function SiteHeaderMobile({
  currentState = "default",
  currentPath = "/",
  logoHref = SERVICE_URL,
  className = "",
  isDownloadThanks = false,
  serviceDocumentHref = DEFAULT_SERVICE_DOCUMENT_HREF,
}: SiteHeaderMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    setIsOpen(false);
  }, [currentPath, currentState]);

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
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive =
                    !item.external &&
                    (currentPath === item.href ||
                      (item.href !== "/" && currentPath.startsWith(item.href)));

                  const itemClass = [
                    "flex items-center rounded-lg px-4 py-3.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-100 text-design-primary"
                      : "text-design-text-primary hover:bg-design-bg-sub",
                  ].join(" ");

                  if (item.external) {
                    return (
                      <a
                        key={`${item.label}-${item.href}`}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={closeMenu}
                        className={itemClass}
                      >
                        {item.label}
                      </a>
                    );
                  }

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
            </div>
          </div>
        </>
      )}
    </header>
  );
}
