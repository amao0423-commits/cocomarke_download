// ────────────────────────────────────────────────────────────────
// 導入前後（Before / After）+ 計測条件 + フォロワー増加フロー セクション
//
// 設置場所: /subscription ページの「Results（導入前後の変化）」。
//
// 画像: public/images/results/ に before / after 画像を置き、下の src を合わせる。
//   - BEFORE: プロフィール画面（フォロワーのみに届く状態）
//   - AFTER : おすすめ・発見タブ「六本木グルメ」に掲載された画面
//
// 文言は subscriptionContent.ts の RESULTS（Record<Lang,...>）を参照。
// ────────────────────────────────────────────────────────────────

import Image from "next/image";
import { RESULTS, type Lang } from "../subscriptionContent";

export default function ResultsBeforeAfter({ lang = "ja" }: { lang?: Lang }) {
  const t = RESULTS[lang];

  return (
    <section id="results" className="mx-auto max-w-5xl px-5 py-16 sm:py-20 [text-wrap:pretty]">
      {/* 見出し */}
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-[#2D7A4F]">{t.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl leading-loose text-slate-600">
          {t.sub}
        </p>
      </div>

      {/* Before / After 対比 */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* BEFORE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {t.before.badge}
            </span>
            <span className="text-xs text-slate-400">{t.before.date}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{t.before.caption}</p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-slate-50">
            <Image
              src="/images/results/before-profile.png"
              alt={t.before.imgAlt}
              width={520}
              height={520}
              sizes="260px"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">{t.before.imgCaption}</p>

          <dl className="mt-5 space-y-2.5">
            {t.beforeStats.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm">
                <dt className="text-slate-600">{label}</dt>
                <dd className="font-bold text-rose-500">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
            {t.before.callout}
          </p>
        </div>

        {/* AFTER */}
        <div className="rounded-3xl border-2 border-[#4CAF75] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium text-[#2D7A4F]">
              {t.after.badge}
            </span>
            <span className="text-xs text-slate-400">{t.after.date}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{t.after.caption}</p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-[#E8F5ED]">
            <Image
              src="/images/results/after-explore.png"
              alt={t.after.imgAlt}
              width={520}
              height={520}
              sizes="260px"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">{t.after.imgCaption}</p>

          <dl className="mt-5 space-y-2.5">
            {t.afterStats.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-[#E8F5ED] pb-2 text-sm">
                <dt className="text-slate-600">{label}</dt>
                <dd className="font-bold text-[#2D7A4F]">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-[#E8F5ED] px-4 py-3 text-center text-sm text-[#2D7A4F]">
            {t.after.callout}
          </p>
        </div>
      </div>

      {/* 計測条件 */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <p className="text-sm font-bold text-slate-900">{t.conditionsTitle}</p>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.conditions.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-slate-400">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          {t.conditionsNote}
        </p>
      </div>

      {/* フォロワー増加フロー */}
      <div className="mt-10 rounded-3xl border border-dashed border-[#4CAF75] bg-[#F1F8F4] p-6 sm:p-8">
        <p className="text-center text-sm font-bold text-slate-900">
          {t.flowTitle}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.flowSteps.map((step) => (
            <div
              key={step.no}
              className={
                "rounded-2xl p-4 " +
                (step.highlight ? "bg-[#2D7A4F] text-white" : "bg-white text-slate-700 shadow-sm")
              }
            >
              <div className={"text-[11px] font-bold tracking-wide " + (step.highlight ? "text-[#CDEBD9]" : "text-[#2D7A4F]")}>
                {step.no}
              </div>
              <div className={"mt-1 text-sm font-bold " + (step.highlight ? "text-white" : "text-slate-900")}>
                {step.label}
              </div>
              <p className={"mt-1.5 text-xs leading-relaxed " + (step.highlight ? "text-[#E8F5ED]" : "text-slate-500")}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
