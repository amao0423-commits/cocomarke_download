"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  footnote?: ReactNode;
  visual?: ReactNode;
  /** 背面に写真ヒーローがあるとき：メッシュを出さず、見出しを白文字に */
  heroVariant?: "default" | "photo";
};

const contentMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

/** ヒーロー全体の背面：メッシュ＋大きなぼかし光（Cycle 系） */
export function HeroSectionBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* 下地：ページ色へ滑らかに（白との境界をなだらかに） */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white from-0% via-[#fcfcfb] via-45% to-[#f4f4f5]"
        aria-hidden
      />
      {/* 定義済みメッシュ */}
      <div
        className="absolute inset-0 bg-coco-mesh-wash bg-cover bg-center bg-no-repeat opacity-[0.85]"
        aria-hidden
      />
      {/* Blur Blob：淡い光の玉 */}
      <div
        className="absolute -left-[8%] top-[8%] h-[min(52vw,26rem)] w-[min(95vw,44rem)] rounded-full bg-stone-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-[-6%] h-[min(48vw,22rem)] w-[min(100vw,48rem)] -translate-x-1/2 rounded-full bg-slate-200/28 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-[5%] top-[22%] h-[min(42vw,20rem)] w-[min(85vw,36rem)] rounded-full bg-neutral-200/24 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-[-8%] left-[18%] h-[min(40vw,18rem)] w-[min(70vw,32rem)] rounded-full bg-stone-100/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-[2%] right-[12%] h-[min(38vw,17rem)] w-[min(65vw,28rem)] rounded-full bg-gray-200/26 blur-3xl"
        aria-hidden
      />
      {/* 上端をより白く（読みやすさ＋参考の「白からの接続」） */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white from-0% via-white/55 via-28% to-transparent to-55%"
        aria-hidden
      />
    </div>
  );
}

export function HeroSection({
  eyebrow,
  title,
  description,
  actions,
  footnote,
  visual,
  heroVariant = "default",
}: Props) {
  const gridClass = visual
    ? "grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center lg:gap-14"
    : "grid gap-12";
  const isPhotoHero = heroVariant === "photo";
  const photoTitleOnly = isPhotoHero && !visual;

  return (
    <div
      className={
        photoTitleOnly
          ? "relative font-sans"
          : "relative pb-8 pt-4 font-sans sm:pb-10 sm:pt-5 lg:pb-12 lg:pt-6"
      }
    >
      {!isPhotoHero ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <HeroSectionBackdrop />
          {!visual ? (
            <div className="absolute inset-0 z-[1]">
              <div
                className="absolute inset-0 opacity-[0.22]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgb(1 64 141 / 0.07) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute -left-[18%] top-1/2 z-0 h-[min(72vw,24rem)] w-[min(72vw,24rem)] -translate-y-1/2 rounded-full bg-[#01408D]/[0.02]" />
              <div className="absolute -right-[14%] top-[12%] z-0 h-[min(58vw,18rem)] w-[min(58vw,18rem)] rounded-full border border-slate-100/50 bg-slate-50/30" />
              <div className="absolute bottom-[-25%] left-[32%] z-0 h-[min(48vw,15rem)] w-[min(48vw,15rem)] rounded-full bg-sky-50/20 blur-3xl" />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div {...contentMotion}>
          <div
            className={
              visual
                ? "px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
                : photoTitleOnly
                  ? "relative px-6 py-6 text-center sm:px-10 sm:py-8 lg:px-14 lg:py-8"
                  : "relative px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-14 lg:py-24"
            }
          >
            <div className={`relative z-10 ${gridClass}`}>
              <div className={visual ? "max-w-2xl" : "mx-auto max-w-2xl"}>
                {eyebrow ? (
                  <p
                    className={`text-sm font-semibold ${isPhotoHero ? "text-white/85 drop-shadow-sm" : "text-design-primary"}`}
                  >
                    {eyebrow}
                  </p>
                ) : null}
                <h1
                  className={`font-bold tracking-tight ${isPhotoHero ? "text-balance text-white drop-shadow-sm leading-snug" : "text-cocomarke-navy"} ${eyebrow ? "mt-4" : "mt-0"}`}
                >
                  {title}
                </h1>
                {description ? (
                  <p
                    className={`mt-5 ${isPhotoHero ? "text-base text-white/90 drop-shadow-sm sm:text-lg" : "text-design-text-secondary"}`}
                  >
                    {description}
                  </p>
                ) : null}
                {actions ? (
                  <div
                    className={[
                      "mt-8 flex flex-wrap gap-3",
                      visual ? "" : "justify-center",
                    ].join(" ")}
                  >
                    {actions}
                  </div>
                ) : null}
                {footnote ? <div className="mt-6">{footnote}</div> : null}
              </div>
              {visual ? (
                <div className="flex w-full justify-center opacity-90 lg:justify-end">
                  {visual}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
