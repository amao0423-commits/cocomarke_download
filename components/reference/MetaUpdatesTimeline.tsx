"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import {
  CATEGORY_LABELS,
  IMPACT_LABELS,
  LAST_UPDATED,
  META_UPDATE_ENTRIES,
  VERIFY_LABELS,
  type MetaUpdateEntry,
  type UpdateCategory,
  type VerifyStatus,
} from "@/lib/content/metaUpdates";

const CATEGORY_FILTERS: Array<{ key: "all" | UpdateCategory; label: string }> = [
  { key: "all", label: "すべて" },
  { key: "algo", label: CATEGORY_LABELS.algo },
  { key: "ui", label: CATEGORY_LABELS.ui },
  { key: "feature", label: CATEGORY_LABELS.feature },
  { key: "policy", label: CATEGORY_LABELS.policy },
  { key: "ads", label: CATEGORY_LABELS.ads },
  { key: "api", label: CATEGORY_LABELS.api },
];

const IMPACT_CHIP: Record<MetaUpdateEntry["impact"], string> = {
  high: "bg-[#FDECEB] text-[#D8453F]",
  mid: "bg-[#FDF3E0] text-[#A96A05]",
  low: "bg-[#EFF3F6] text-[#4A5A6A]",
};

const VERIFY_CHIP: Record<VerifyStatus, string> = {
  official: "bg-[#EAF5FE] text-[#0B6FB8] font-medium",
  observed: "bg-transparent text-[#8494A3] border border-dashed border-[#C3CED8] font-medium",
  unverified: "bg-[#FFF04A] text-[#4A3E00] font-bold",
};

const YEARS = ["2026", "2025", "2024", "2023"] as const;

function buildPageUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin + window.location.pathname;
}

function writeClipboard(text: string, onDone: (ok: boolean) => void) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => onDone(true),
      () => onDone(false)
    );
    return;
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    onDone(true);
  } catch {
    onDone(false);
  }
}

export default function MetaUpdatesTimeline() {
  const [activeCat, setActiveCat] = useState<"all" | UpdateCategory>("all");
  const [highOnly, setHighOnly] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedEntryId, setCopiedEntryId] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const todoCount = useMemo(
    () => META_UPDATE_ENTRIES.reduce((n, e) => n + e.sources.filter((s) => s.todo).length, 0),
    []
  );

  const visibleEntries = useMemo(
    () =>
      META_UPDATE_ENTRIES.filter((e) => {
        const okCat = activeCat === "all" || e.cat === activeCat;
        const okImp = !highOnly || e.impact === "high";
        return okCat && okImp;
      }),
    [activeCat, highOnly]
  );

  const entriesByYear = useMemo(() => {
    const map = new Map<string, MetaUpdateEntry[]>();
    for (const y of YEARS) map.set(y, []);
    for (const e of visibleEntries) {
      map.get(e.year)?.push(e);
    }
    return map;
  }, [visibleEntries]);

  const handleCopyEntry = useCallback(
    (entry: MetaUpdateEntry) => {
      const url = `${buildPageUrl()}#${entry.id}`;
      writeClipboard(url, (ok) => {
        if (ok) {
          setCopiedEntryId(entry.id);
          if (copiedTimer.current) clearTimeout(copiedTimer.current);
          copiedTimer.current = setTimeout(() => setCopiedEntryId(null), 1800);
          showToast("項目のURLをコピーしました");
        } else {
          showToast("コピーできませんでした");
        }
      });
    },
    [showToast]
  );

  const handleCopyPageUrl = useCallback(() => {
    writeClipboard(buildPageUrl(), (ok) => {
      showToast(ok ? "ページのURLをコピーしました" : "コピーできませんでした");
    });
  }, [showToast]);

  const handleCopyCitation = useCallback(() => {
    const text = `出典：Instagram / Meta 仕様変更タイムライン（COCOマーケ）${buildPageUrl()}`;
    writeClipboard(text, (ok) => {
      showToast(ok ? "出典表記をコピーしました" : "コピーできませんでした");
    });
  }, [showToast]);

  const handleTodoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showToast("一次ソースURLが未設定です");
    },
    [showToast]
  );

  return (
    <div className="bg-[#F7FAFC] font-sans text-[#1B2733]">
      {todoCount > 0 && (
        <div className="bg-[#FFF04A] px-5 py-2.5 text-center text-sm font-bold text-[#4A3E00]">
          公開前チェック：一次ソース未設定のリンクが {todoCount} 件あります
        </div>
      )}

      <header className="border-b border-[#E3E9EF] bg-white px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-[880px]">
          <h1 className="mb-3 text-2xl font-bold leading-snug tracking-[0.01em] sm:text-[30px]">
            <span className="bg-[linear-gradient(transparent_62%,#FFF04A_62%)]">
              Instagram / Meta 仕様変更タイムライン
            </span>
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF5FE] px-3.5 py-1 text-[13px] font-bold text-[#0B6FB8]">
              ※ 最終更新 {LAST_UPDATED}
            </span>
            <span className="text-[13px] text-[#8494A3]">
              {META_UPDATE_ENTRIES.length}件を掲載中
            </span>
          </div>
          <p className="mb-5 max-w-[66ch] text-[15px] leading-relaxed text-[#4A5A6A]">
            2023年10月以降のInstagram・Metaの仕様変更を、一次ソース付きで時系列にまとめています。
            アルゴリズム・表示仕様・広告ポリシーから日本国内の規制改定まで、法人アカウント運用に影響するものを随時追加しています。
          </p>
          <div className="rounded-[10px] border border-[#E3E9EF] bg-white p-4 text-[13.5px] leading-relaxed text-[#4A5A6A]">
            <strong className="text-[#1B2733]">転載・引用について</strong>
            <p className="mt-1">
              本ページの内容は、出典として本ページへのリンクを明記していただければ自由に引用・転載できます。
              各項目の「この項目のURLをコピー」から特定の項目だけを参照することができます。
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button type="button" onClick={handleCopyCitation} className={pillButtonClass}>
                出典表記をコピー
              </button>
              <button type="button" onClick={handleCopyPageUrl} className={pillButtonClass}>
                このページのURLをコピー
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="カテゴリで絞り込む"
        className="border-b border-[#E3E9EF] bg-white/95"
      >
        <div className="mx-auto flex max-w-[880px] flex-wrap gap-2 px-5 py-3 sm:px-6">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveCat(f.key)}
              className={`${pillButtonClass} ${
                activeCat === f.key ? "border-[#1E9BF0] bg-[#1E9BF0] text-white hover:bg-[#0B6FB8]" : ""
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="mx-1 w-px self-stretch bg-[#E3E9EF]" aria-hidden />
          <button
            type="button"
            onClick={() => setHighOnly((v) => !v)}
            className={`${pillButtonClass} ${
              highOnly ? "border-[#1E9BF0] bg-[#1E9BF0] text-white hover:bg-[#0B6FB8]" : ""
            }`}
          >
            影響度 大のみ
          </button>
        </div>
      </nav>

      <main className="px-5 pb-2 pt-8 sm:px-6">
        <div className="mx-auto max-w-[880px]">
          {YEARS.map((year) => {
            const entries = entriesByYear.get(year) ?? [];
            if (entries.length === 0) return null;
            return (
              <div key={year}>
                <div className="mb-1 mt-9 flex items-center gap-3.5 first:mt-0">
                  <h2 className="text-xl font-bold tracking-[0.04em]">{year}</h2>
                  <span className="h-px flex-1 bg-[#E3E9EF]" aria-hidden />
                </div>
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    id={entry.id}
                    className="flex flex-col gap-1.5 border-b border-[#E3E9EF] py-5 sm:flex-row sm:gap-5 sm:py-[22px] [&:target_h3]:bg-[linear-gradient(transparent_62%,#FFF04A_62%)]"
                  >
                    <div className="shrink-0 pt-0 text-[13px] font-bold tracking-[0.02em] text-[#8494A3] tabular-nums sm:w-[76px] sm:pt-[3px]">
                      {entry.date}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <span className={`rounded-[5px] px-2.5 py-0.5 text-[11.5px] font-bold leading-[1.7] ${IMPACT_CHIP[entry.impact]}`}>
                          {IMPACT_LABELS[entry.impact]}
                        </span>
                        <span className="rounded-[5px] bg-[#EFF3F6] px-2.5 py-0.5 text-[11.5px] font-medium leading-[1.7] text-[#4A5A6A]">
                          {CATEGORY_LABELS[entry.cat]}
                        </span>
                        <span className={`rounded-[5px] px-2.5 py-0.5 text-[11.5px] leading-[1.7] ${VERIFY_CHIP[entry.verify]}`}>
                          {VERIFY_LABELS[entry.verify]}
                        </span>
                      </div>
                      <h3 className="mb-2 text-base font-bold leading-relaxed sm:text-[17px]">
                        {entry.title}
                      </h3>
                      <p className="mb-1.5 text-[14.5px] leading-[1.85] text-[#4A5A6A]">
                        <span className="mr-2 inline-block text-[12.5px] font-bold tracking-[0.02em] text-[#8494A3]">
                          変更内容
                        </span>
                        {entry.changeBody}
                      </p>
                      <p className="mb-1.5 text-[14.5px] leading-[1.85] text-[#1B2733]">
                        <span className="mr-2 inline-block text-[12.5px] font-bold tracking-[0.02em] text-[#8494A3]">
                          実務への影響
                        </span>
                        {entry.impactBody}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[12.5px]">
                        {entry.sources.map((s, idx) =>
                          s.todo ? (
                            <a
                              key={idx}
                              href={s.href}
                              onClick={handleTodoClick}
                              className="cursor-not-allowed border-b border-dashed border-[#A96A05] font-medium text-[#A96A05] before:mr-1 before:content-['⚠']"
                            >
                              {s.label}
                            </a>
                          ) : (
                            <a
                              key={idx}
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#0B6FB8] before:mr-1 before:text-[11px] before:content-['→'] hover:underline"
                            >
                              {s.label}
                            </a>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopyEntry(entry)}
                          className={`border-0 bg-transparent p-0 text-[12.5px] before:mr-1 before:content-['⎘'] hover:text-[#0B6FB8] ${
                            copiedEntryId === entry.id ? "text-[#0B6FB8]" : "text-[#8494A3]"
                          }`}
                        >
                          この項目のURLをコピー
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            );
          })}

          {visibleEntries.length === 0 && (
            <p className="py-12 text-center text-sm text-[#8494A3]">該当する項目がありません。</p>
          )}

          <p className="mb-12 mt-10 text-[12.5px] leading-[1.9] text-[#8494A3]">
            本ページは株式会社ホットセラーが運営する「COCOマーケ」が編集しています。
            「公式発表」は Meta または所管官庁の一次発表が確認できるもの、「観測情報」は公式発表ではなく利用者・運用現場からの報告に基づくもの、「要検証」は一次ソースの確認をまだ済ませていないものを指します。
            内容の正確性には努めていますが、最終的な判断は必ず一次ソースからご確認ください。
            掲載漏れや誤りのご指摘はお問い合わせフォームよりお寄せください。
          </p>
        </div>
      </main>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-7 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#1B2733] px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-200 ${
          toast ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {toast}
      </div>
    </div>
  );
}

const pillButtonClass =
  "appearance-none rounded-full border border-[#E3E9EF] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#4A5A6A] transition-colors hover:border-[#1E9BF0] hover:bg-[#EAF5FE] hover:text-[#0B6FB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E9BF0] focus-visible:outline-offset-2";
