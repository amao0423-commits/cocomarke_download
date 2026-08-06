// ────────────────────────────────────────────────────────────────
// 導入前後（Before / After）+ 計測条件 + フォロワー増加フロー セクション
//
// 設置場所: /subscription ページの「Results（導入前後の変化）」。
//
// 画像: public/images/results/ に before / after 画像を置き、下の src を合わせる。
//   - BEFORE: プロフィール画面（フォロワーのみに届く状態）
//   - AFTER : おすすめ・発見タブ「六本木グルメ」に掲載された画面
// ────────────────────────────────────────────────────────────────

import Image from "next/image";

const beforeStats = [
  { label: "リーチ（1投稿）", value: "500" },
  { label: "いいね", value: "15" },
  { label: "保存", value: "0" },
  { label: "プロフィールアクセス", value: "12" },
];

const afterStats = [
  { label: "おすすめ・発見タブ閲覧", value: "15,000" },
  { label: "いいね", value: "+620" },
  { label: "プロフィールアクセス", value: "+520" },
  { label: "フォロワー", value: "+380" },
];

const conditions = [
  { label: "業種・所在地", value: "飲食店（東京都・1店舗）" },
  { label: "開始時フォロワー", value: "412名" },
  { label: "利用プラン", value: "セットプラン（24,980円/月）" },
  { label: "投稿頻度", value: "週2回（お客様側で投稿）" },
];

const flowSteps = [
  { no: "STEP 1", label: "おすすめ・発見タブに掲載", desc: "投稿直後の反応を高め、掲載対象に入りやすくします。" },
  { no: "STEP 2", label: "投稿を見つけてもらう", desc: "フォロワー外のユーザーの画面に表示されます。" },
  { no: "STEP 3", label: "プロフィール流入", desc: "気になった人がプロフィールを見に来ます。" },
  { no: "STEP 4", label: "フォロー・来店", desc: "フォローや予約・来店につながります。", highlight: true },
];

export default function ResultsBeforeAfter() {
  return (
    <section id="results" className="mx-auto max-w-5xl px-5 py-16 sm:py-20 [text-wrap:pretty]">
      {/* 見出し */}
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-[#2D7A4F]">Results</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          おすすめ・発見タブ流入でフォロワーが増えるまで
        </h2>
        <p className="mx-auto mt-3 max-w-2xl leading-loose text-slate-600">
          フォロワーにしか届かない投稿から、おすすめ・発見タブ掲載によって新規のお客様に届くようになります。導入前後の変化を比べてみましょう。
        </p>
      </div>

      {/* Before / After 対比 */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* BEFORE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              導入前 — Before
            </span>
            <span className="text-xs text-slate-400">2026.02</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">フォロワーにしか届いていない状態</p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-slate-50">
            <Image
              src="/images/results/before-profile.png"
              alt="導入前：フォロワーにしか届いていないInstagramプロフィール画面"
              width={520}
              height={520}
              sizes="260px"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">投稿はフォロワーのみに表示されている</p>

          <dl className="mt-5 space-y-2.5">
            {beforeStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm">
                <dt className="text-slate-600">{s.label}</dt>
                <dd className="font-bold text-rose-500">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
            フォロワーの約10%しか反応せず、新規のお客様に届いていない状態です。
          </p>
        </div>

        {/* AFTER */}
        <div className="rounded-3xl border-2 border-[#4CAF75] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium text-[#2D7A4F]">
              導入後 — After
            </span>
            <span className="text-xs text-slate-400">2026.05（3ヶ月後）</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">おすすめ・発見タブから新規のお客様に届く状態</p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-[#E8F5ED]">
            <Image
              src="/images/results/after-explore.png"
              alt="導入後：おすすめ・発見タブに掲載され新規ユーザーに表示されている画面"
              width={520}
              height={520}
              sizes="260px"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">おすすめ・発見タブ「六本木グルメ」で上位表示</p>

          <dl className="mt-5 space-y-2.5">
            {afterStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-[#E8F5ED] pb-2 text-sm">
                <dt className="text-slate-600">{s.label}</dt>
                <dd className="font-bold text-[#2D7A4F]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-[#E8F5ED] px-4 py-3 text-center text-sm text-[#2D7A4F]">
            フォロワー外へリーチが広がり、来店・フォローにつながっています。
          </p>
        </div>
      </div>

      {/* 計測条件 */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <p className="text-sm font-bold text-slate-900">この事例の計測条件</p>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {conditions.map((c) => (
            <div key={c.label}>
              <dt className="text-xs text-slate-400">{c.label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-800">{c.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          ※ 個別事例であり、同等の成果を保証するものではありません。成果はアカウントの状態・投稿頻度・業種により異なります。
        </p>
      </div>

      {/* フォロワー増加フロー */}
      <div className="mt-10 rounded-3xl border border-dashed border-[#4CAF75] bg-[#F1F8F4] p-6 sm:p-8">
        <p className="text-center text-sm font-bold text-slate-900">
          おすすめ・発見タブ掲載からフォロワー増加までの流れ
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {flowSteps.map((step) => (
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
