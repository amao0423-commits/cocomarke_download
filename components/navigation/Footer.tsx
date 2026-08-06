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
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

const COCO_MARKETING_SITE = "https://www.cocomarke.com/" as const;

const relatedLinks = [
  { label: "COCOマーケ", href: COCO_MARKETING_SITE },
  { label: "サービス概要", href: COCO_MARKETING_SITE },
  { label: "お役立ち記事", href: "https://www.cocomarke.com/blog" },
  { label: "プライバシーポリシー", href: "https://www.cocomarke.com/privacy" },
] as const;

const siteMenu = [
  { label: "お役立ち資料", href: "/" },
  { label: "アカウント無料診断", href: "/analysis" },
  { label: "飲食店SNS動線診断", href: "/restaurant-diagnosis" },
] as const;

export function Footer() {
  return (
    <footer
      className="border-t border-[#E4E9F0] bg-[#F7F9FC] font-sans text-[#17233A]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* ブランド */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 rounded-full bg-[#0D3B75]" aria-hidden />
              <span className="text-[15px] font-bold text-[#17233A]">COCOマーケ</span>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-[12.5px] leading-relaxed text-[#4A5871]">
              <p className="font-bold text-[#17233A]">株式会社ホットセラー</p>
              <p>
                〒104-0053 東京都中央区晴海1丁目8-10
                <br />
                晴海アイランドトリトンスクエアX棟8階
              </p>
            </div>
            <nav className="mt-4 flex gap-2.5" aria-label="SNS">
              {SITE_SNS_LINKS.map(({ href, label, src }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-[#E4E9F0] bg-white transition hover:border-[#0D3B75]/30"
                >
                  <Image src={src} alt="" width={20} height={20} className="h-5 w-5 object-contain" aria-hidden />
                </a>
              ))}
            </nav>
          </div>

          {/* サイトメニュー */}
          <div>
            <h2 className="mb-4 text-[12px] font-bold text-[#17233A]">サイトメニュー</h2>
            <nav aria-label="サイトメニュー">
              <ul className="flex flex-col gap-3 text-[12.5px] text-[#4A5871]">
                {siteMenu.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition-colors hover:text-[#0D3B75]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 関連リンク */}
          <div>
            <h2 className="mb-4 text-[12px] font-bold text-[#17233A]">関連リンク</h2>
            <nav aria-label="COCOマーケ関連">
              <ul className="flex flex-col gap-3 text-[12.5px] text-[#4A5871]">
                {relatedLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-[#0D3B75]"
                    >
                      {item.label}
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* まずは資料から */}
          <div>
            <h2 className="mb-4 text-[12px] font-bold text-[#17233A]">まずは資料から</h2>
            <DocumentDownloadLink
              href="/servicedocument"
              label="サービス資料DL"
              className="w-full"
            />
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#7A879C]">
              1分の入力ですぐご覧いただけます。
            </p>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-[#E4E9F0] py-6">
        <p className="text-center text-xs text-[#7A879C]">
          2026 © Hotseller Inc. / COCOマーケ All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
