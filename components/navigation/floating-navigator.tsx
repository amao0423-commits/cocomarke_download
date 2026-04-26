"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const IG_GRADIENT = {
  from: "#833AB4",
  via: "#FD1D1D",
  to: "#FCB045",
} as const;

function DiagnosisIllustration({
  variant,
  gradientId,
}: {
  variant: "chart" | "trend" | "sparkle";
  gradientId: string;
}) {
  const url = `url(#${gradientId})`;
  const common = "h-[18px] w-[18px] shrink-0";
  if (variant === "chart") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={IG_GRADIENT.from} />
            <stop offset="50%" stopColor={IG_GRADIENT.via} />
            <stop offset="100%" stopColor={IG_GRADIENT.to} />
          </linearGradient>
        </defs>
        <rect x="3" y="14" width="4.5" height="7" rx="1" fill={url} />
        <rect x="9.75" y="10" width="4.5" height="11" rx="1" fill={url} opacity={0.92} />
        <rect x="16.5" y="6" width="4.5" height="15" rx="1" fill={url} opacity={0.85} />
      </svg>
    );
  }
  if (variant === "trend") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={IG_GRADIENT.from} />
            <stop offset="50%" stopColor={IG_GRADIENT.via} />
            <stop offset="100%" stopColor={IG_GRADIENT.to} />
          </linearGradient>
        </defs>
        <path
          d="M4 17 L9 12 L13 14 L20 7"
          stroke={url}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 7 h3 v3" stroke={url} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={IG_GRADIENT.from} />
          <stop offset="50%" stopColor={IG_GRADIENT.via} />
          <stop offset="100%" stopColor={IG_GRADIENT.to} />
        </linearGradient>
      </defs>
      <path
        d="M12 3 L13.2 8.4 L19 9.3 L14.5 13 L15.7 18.6 L12 15.4 L8.3 18.6 L9.5 13 L5 9.3 L10.8 8.4 Z"
        fill={url}
      />
      <circle cx="6" cy="6" r="1.4" fill={url} opacity={0.75} />
      <circle cx="19" cy="15" r="1.1" fill={url} opacity={0.65} />
    </svg>
  );
}

export function FloatingNavigator() {
  const iconGradientPrefix = useId().replace(/:/g, "");
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const visible = scrolled && !dismissed;

  const mobileMotion = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  };
  const desktopMotion = {
    initial: { opacity: 0, y: 32, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 24, scale: 0.97 },
    transition: { type: "spring" as const, damping: 22, stiffness: 260 },
  };
  const motionProps = isLg ? desktopMotion : mobileMotion;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] max-w-[calc(100vw-32px)] lg:bottom-6 lg:right-6 lg:max-w-[min(22rem,calc(100vw-3rem))]"
      aria-live="polite"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="floating-cta"
            initial={motionProps.initial}
            animate={motionProps.animate}
            exit={motionProps.exit}
            transition={motionProps.transition}
            className="pointer-events-auto w-full"
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-[#833AB4]/15">
              {/* ヘッダー */}
              <div className="relative min-h-[2.75rem] border-b border-[#833AB4]/10 bg-[#F8F7FF] px-3 py-2.5 lg:min-h-[3.25rem] lg:px-4 lg:py-3">
                <p className="absolute left-1/2 top-1/2 w-[calc(100%-4.25rem)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-center text-[15px] font-bold leading-snug text-transparent lg:w-[calc(100%-3.5rem)] lg:text-[20px]">
                  👉 アカウント無料診断
                </p>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="absolute right-1 top-1/2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-[#833AB4]/55 transition hover:bg-white/90 hover:text-[#833AB4] lg:right-2 lg:h-9 lg:w-9 lg:min-h-0 lg:min-w-0"
                  aria-label="閉じる"
                >
                  <X className="h-5 w-5 lg:h-4 lg:w-4" strokeWidth={2} />
                </button>
              </div>

              {/* 本文 */}
              <div className="space-y-2 px-3 pb-3 pt-2.5 lg:space-y-4 lg:px-5 lg:pb-5 lg:pt-4">
                {/* 左：診断リスト / 右：イラスト（lg 以上のみ） */}
                <div className="hidden min-h-0 w-full flex-row items-start gap-3 lg:flex">
                  <ul className="min-w-0 flex-1 space-y-2 rounded-xl border border-[#833AB4]/12 bg-gradient-to-br from-[#833AB4]/5 via-[#FD1D1D]/5 to-[#FCB045]/5 px-3 py-2.5 sm:px-3.5 sm:py-3">
                    {[
                      { variant: "chart" as const, lines: ["エンゲージ分析"] },
                      { variant: "trend" as const, lines: ["投稿頻度と", "ハッシュタグの評価"] },
                      { variant: "sparkle" as const, lines: ["総合的な", "改善アドバイス"] },
                    ].map(({ variant, lines }, index) => (
                      <li key={variant} className="flex items-start gap-2 text-[11px] font-medium leading-snug sm:text-xs" style={{ color: "#01408D" }}>
                        <DiagnosisIllustration variant={variant} gradientId={`${iconGradientPrefix}-${variant}-${index}`} />
                        <span>
                          {lines.map((line, lineIndex) => (
                            <span key={line}>
                              {lineIndex > 0 ? <br /> : null}
                              {line}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                    <Image
                      src="/floating-subtitle-merit.png"
                      alt=""
                      fill
                      sizes="(max-width: 400px) 112px, 128px"
                      className="object-contain object-[right_bottom]"
                    />
                  </div>
                </div>

                <p
                  className="line-clamp-2 block w-full max-w-none text-xs leading-snug lg:hidden"
                  style={{ color: "#01408D" }}
                >
                  アカウントの成長度を、今すぐ確認できます。
                </p>

                <p
                  className="hidden w-full max-w-none text-xs leading-relaxed sm:text-[13px] lg:block"
                  style={{ color: "#01408D" }}
                >
                  あなたのアカウントがどこまで成長しているか、今すぐ確認できます。
                </p>

                {/* ボタン */}
                <Link
                  href="/?diagnosis=1"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] px-4 py-3.5 text-sm font-extrabold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 lg:px-5 lg:text-base"
                >
                  👉 30秒で無料診断する
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
