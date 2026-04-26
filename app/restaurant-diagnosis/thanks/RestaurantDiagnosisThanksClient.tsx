"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, FileText, MessageCircle } from "lucide-react";
import {
  parseRestaurantDiagnosisThanksPayload,
  RESTAURANT_DIAGNOSIS_THANKS_STORAGE_KEY,
  type RestaurantDiagnosisThanksPayload,
} from "../thanksPayload";

/** サンクス画面背景（サイトに合わせた薄いブルーグレー） */
const BG = "#EFF4FA";
/** COCOマーケ brand navy（tailwind: cocomarke-navy） */
const ACCENT_BLUE = "#01408D";
const ACCENT_BLUE_SOFT = "#E3EEF6";
const LINE_URL = "https://lin.ee/nl7qUKz";

const MULTI_SUMMARY_KEYS = new Set<keyof RestaurantDiagnosisThanksPayload>(["q4", "q5", "q8_area"]);

const REMINDER_ROWS: { label: string; keys: (keyof RestaurantDiagnosisThanksPayload)[] }[] = [
  { label: "店舗カテゴリー", keys: ["q1"] },
  { label: "Instagramの運用状況", keys: ["q2"] },
  { label: "月間の投稿回数目安", keys: ["q3"] },
  { label: "いま一番のお悩み", keys: ["q4"] },
  { label: "新規来店のきっかけ", keys: ["q5"] },
  { label: "Instagram広告", keys: ["q6"] },
  { label: "店舗名", keys: ["storeName"] },
  { label: "店舗エリア", keys: ["q8_area"] },
  { label: "Instagramアカウント", keys: ["instagram"] },
  { label: "相談内容", keys: ["consultation"] },
  { label: "メールアドレス", keys: ["email"] },
];

function loadPayload(): RestaurantDiagnosisThanksPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(RESTAURANT_DIAGNOSIS_THANKS_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    return parseRestaurantDiagnosisThanksPayload(data);
  } catch {
    return null;
  }
}

const STATUS_MESSAGES = ["診断シートを読み取り中", "アカウントを確認中"] as const;

function randomDurationMs() {
  return 3000 + Math.floor(Math.random() * 2001);
}

export function RestaurantDiagnosisThanksClient() {
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const [percent, setPercent] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [payload, setPayload] = useState<RestaurantDiagnosisThanksPayload | null>(null);

  useEffect(() => {
    setPayload(loadPayload());
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const total = randomDurationMs();
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / total) * 100));
      setPercent(next);
      if (elapsed >= total) {
        setPhase("done");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const id = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [phase]);

  const reminderItems = useMemo(() => {
    if (!payload) return [];
    return REMINDER_ROWS.map(({ label, keys }) => {
      const key = keys[0];
      const v = payload[key];
      let text: string;
      if (MULTI_SUMMARY_KEYS.has(key)) {
        const arr = v as string[];
        text = Array.isArray(arr) && arr.length > 0 ? arr.join("、") : "（未入力）";
      } else if (typeof v === "string") {
        text = v.trim() || "（未入力）";
      } else if (v == null) {
        text = "（未入力）";
      } else {
        text = String(v);
      }
      const isOptionalEmpty =
        (key === "instagram" || key === "consultation") && (!text || text === "（未入力）");
      if (isOptionalEmpty) return null;
      return { label, text };
    }).filter(Boolean) as { label: string; text: string }[];
  }, [payload]);

  if (phase === "loading") {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center px-4 font-sans text-design-text-primary"
        style={{ backgroundColor: BG }}
      >
        <div className="relative flex flex-col items-center">
          <div className="relative h-32 w-32 sm:h-36 sm:w-36">
            <div
              className="absolute inset-0 rounded-full motion-safe:animate-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, #01408D 0deg, #01408D 110deg, #BFDBFE 110deg, #E0EEF8 250deg, #01408D 360deg)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-[7px] rounded-full shadow-[inset_0_1px_2px_rgba(1,64,141,0.08)] sm:inset-[8px]"
              style={{ backgroundColor: BG }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
              <p className="text-xs font-bold text-[#01408D] sm:text-sm">
                送信中 {percent}%
                <span className="inline-block w-[1.5ch] animate-pulse">...</span>
              </p>
            </div>
          </div>
          <p
            key={statusIdx}
            className="mt-6 max-w-xs text-center text-sm font-semibold text-[#01408D]/90 sm:text-base"
          >
            {STATUS_MESSAGES[statusIdx]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col font-sans text-slate-800"
      style={{ backgroundColor: BG }}
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-3 px-4 pb-3 pt-5 sm:gap-4 sm:px-5 sm:pb-4 sm:pt-7">
        {/* 1. 送信完了 */}
        <section className="rounded-2xl border border-slate-100/80 bg-white px-5 py-5 shadow-sm sm:rounded-[1.125rem] sm:px-6 sm:py-6">
          <div className="flex justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full shadow-inner sm:h-16 sm:w-16"
              style={{ backgroundColor: ACCENT_BLUE }}
              aria-hidden
            >
              <Check className="h-8 w-8 text-white sm:h-9 sm:w-9" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-4 text-center text-[15px] font-bold leading-snug text-slate-800 sm:text-lg">
            送信が完了しました！
            <br className="sm:hidden" />
            <span className="sm:ml-1">お申し込みありがとうございます。</span>
          </h1>
          <p className="mt-3 text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
            以下の内容でお問い合わせを受け付けいたしました。
            <br />
            3営業日以内に担当者よりご連絡させて頂きます。
          </p>
          <div className="mt-4 flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#01408D]"
              style={{ backgroundColor: ACCENT_BLUE_SOFT }}
            >
              <span className="text-[0.65rem] leading-none" aria-hidden>
                ●
              </span>
              今しばらくお待ちください
            </span>
          </div>
        </section>

        {/* 2. ご入力内容 */}
        <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-100/80 bg-white px-4 py-4 shadow-sm sm:rounded-[1.125rem] sm:px-5 sm:py-5">
          <div
            className="mb-3 flex items-center gap-2 text-sm font-semibold sm:text-[0.9375rem]"
            style={{ color: ACCENT_BLUE }}
          >
            <FileText className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            ご入力内容
          </div>
          <ul className="divide-y divide-slate-100">
            {(payload ? reminderItems : []).map(({ label, text }) => (
              <li key={label} className="flex gap-3 py-3 first:pt-0 sm:py-3.5">
                <span className="w-[7.25rem] shrink-0 text-xs leading-snug text-slate-500 sm:w-32 sm:text-[13px]">
                  {label}
                </span>
                <span className="min-w-0 flex-1 text-right text-xs font-semibold leading-snug text-slate-800 sm:text-[13px]">
                  {text}
                </span>
              </li>
            ))}
            {!payload && (
              <li className="py-4 text-center text-xs text-slate-500 sm:text-sm">
                入力内容を表示できませんでした。お手数ですがフォーム画面に戻り、再度ご確認ください。
              </li>
            )}
          </ul>
        </section>

        {/* 3. 次のステップ（LINE）— 白カード上でボタンコントラストを確保 */}
        <section className="shrink-0 rounded-2xl border border-slate-100/80 bg-white px-4 py-4 shadow-sm sm:rounded-[1.125rem] sm:px-5 sm:py-5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-sm"
              aria-hidden
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            次のステップ
          </div>
          <h2 className="mt-2 text-base font-bold leading-snug text-slate-900 sm:text-lg">LINEで結果をスムーズに受け取る</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            友だち追加特典として
            <span className="font-semibold text-slate-800">飲食店SNS集客改善PDF</span>
            をプレゼント中です。診断結果のご案内もLINEで受け取れます。
          </p>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-4 py-3 text-sm font-bold text-white shadow-md ring-1 ring-black/5 transition hover:brightness-[1.03] active:scale-[0.99] sm:min-h-[52px] sm:text-base"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            LINEを登録してPDFを受け取る
          </a>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            公式LINEの友だち追加で特典URLをお送りします
          </p>
        </section>

        <div className="flex shrink-0 justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <Link
            href="/restaurant-diagnosis"
            className="text-xs font-semibold text-[#01408D] underline-offset-2 hover:underline sm:text-sm"
          >
            診断フォームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
