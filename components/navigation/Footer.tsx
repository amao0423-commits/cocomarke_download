"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { DiagnosisFooterLink } from "@/components/navigation/DiagnosisFooterLink";
import { SITE_SNS_LINKS } from "@/lib/siteSns";

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

const columnVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

const COCO_MARKETING_SITE = "https://www.cocomarke.com/" as const;

const quickLinks = [
  { label: "サービス概要", href: COCO_MARKETING_SITE },
  { label: "ブログ", href: "https://www.cocomarke.com/blog" },
  { label: "プライバシーポリシー", href: "https://www.cocomarke.com/privacy" },
] as const;

export function Footer() {
  const pathname = usePathname();
  /** トップ・資料DLフォーム：お問い合わせ帯と同系のフッター見た目に揃える */
  const blendHomeContact = pathname === "/" || pathname === "/download";

  return (
    <footer
      className={
        blendHomeContact
          ? "border-t-0 bg-slate-100 font-sans text-design-text-primary"
          : "border-t border-design-outline-border bg-design-bg-page font-sans text-design-text-primary"
      }
      role="contentinfo"
    >
      <div
        className={
          blendHomeContact
            ? "mx-auto max-w-[1200px] px-5 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16 lg:pt-12"
            : "mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
        }
      >
        <motion.div
          className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="order-2 lg:order-1">
          <motion.section
            variants={columnVariants}
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
          </motion.section>
          </div>

          <div className="order-1 lg:order-2">
          <motion.section
            variants={columnVariants}
            className="flex flex-col"
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
                <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
              </Link>
            </h2>
            <nav className="mt-4" aria-label="関連リンク">
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-design-text-secondary transition-colors hover:text-design-primary"
                  >
                    資料一覧
                  </Link>
                </li>
                {quickLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-design-text-secondary transition-colors hover:text-design-primary"
                    >
                      {item.label}
                      <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                    </Link>
                  </li>
                ))}
                <li>
                  <DiagnosisFooterLink />
                </li>
              </ul>
            </nav>
          </motion.section>
          </div>
        </motion.div>
      </div>

      <div
        className={
          blendHomeContact
            ? "border-t border-slate-200/80 py-6"
            : "border-t border-design-outline-border py-6"
        }
      >
        <p className="text-center text-xs text-design-text-secondary">
          2026 © Hotseller Inc. / COCOマーケ All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
