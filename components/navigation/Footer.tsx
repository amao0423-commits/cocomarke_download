"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SITE_SNS_LINKS } from "@/lib/siteSns";
import { DocumentDownloadLink } from "@/components/home/DocumentDownloadCta";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
} as const;

const COCO_MARKETING_SITE = "https://www.cocomarke.com/" as const;

const quickLinks = [
  { label: "サービス概要", href: COCO_MARKETING_SITE },
  { label: "お役立ち記事", href: "https://www.cocomarke.com/blog" },
  { label: "プライバシーポリシー", href: "https://www.cocomarke.com/privacy" },
] as const;

/** 全ルートで同一の見た目（背景・余白・上罫線） */
const FOOTER_SECTION_CLASS =
  "mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16";

export function Footer() {
  return (
    <footer
      className="border-t border-design-outline-border bg-design-bg-page font-sans text-design-text-primary"
      role="contentinfo"
    >
      <div className={FOOTER_SECTION_CLASS}>
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="order-2 lg:order-1">
          <section
            className="flex flex-col"
            aria-labelledby="footer-company-heading"
          >
            <h2
              id="footer-company-heading"
              className="text-sm font-medium leading-normal text-design-text-primary"
            >
              運用会社
            </h2>
            <div className="mt-4 flex flex-col gap-3 text-sm leading-normal text-design-text-secondary">
              <p className="font-medium text-design-text-primary">株式会社ホットセラー</p>
              <p>
                〒104-0053 東京都中央区晴海1丁目8-10 晴海アイランドトリトンスクエアX棟8階
              </p>
            </div>
            <nav
              className="mt-4 flex flex-wrap justify-start gap-3"
              aria-label="SNS"
            >
              {SITE_SNS_LINKS.map(({ href, label, src }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white/90 shadow-sm transition-opacity duration-200 hover:opacity-90 sm:h-11 sm:w-11"
                >
                  <Image
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                    aria-hidden
                  />
                </a>
              ))}
            </nav>
          </section>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-10 sm:gap-12">
            <section className="flex flex-col">
              <div className="mb-5">
                <DocumentDownloadLink
                  href="/servicedocument"
                  label="サービス資料ダウンロード"
                  className="w-full sm:w-auto"
                />
              </div>
              <nav aria-label="主要リンク">
                <ul className="flex flex-col gap-3 text-sm leading-normal text-design-text-secondary">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-design-primary"
                    >
                      お役立ち資料
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/analysis"
                      className="transition-colors hover:text-design-primary"
                    >
                      アカウント無料診断
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/restaurant-diagnosis"
                      className="transition-colors hover:text-design-primary"
                    >
                      飲食店SNS動線診断
                    </Link>
                  </li>
                </ul>
              </nav>
            </section>

            <section
              className="flex flex-col border-t border-slate-200/80 pt-10 sm:pt-12"
              aria-labelledby="footer-links-heading"
            >
              <h2
                id="footer-links-heading"
                className="text-sm font-normal leading-normal text-design-text-primary"
              >
                <Link
                  href={COCO_MARKETING_SITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-normal transition-colors hover:text-design-primary"
                >
                  COCOマーケ
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                </Link>
              </h2>
              <nav className="mt-4" aria-label="COCOマーケ関連">
                <ul className="flex flex-col gap-3 text-sm leading-normal text-design-text-secondary">
                  {quickLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-design-primary"
                      >
                        {item.label}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-design-outline-border py-6">
        <p className="text-center text-xs text-design-text-secondary">
          2026 © Hotseller Inc. / COCOマーケ All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
