// ────────────────────────────────────────────────────────────────
// 導入前後（Before / After）+ フォロワー増加フロー セクション
//
// 設置場所: /subscription ページの「Results（導入前後の変化）」を
//           このコンポーネントに置き換えています。
//
// 画像: public/ 配下に before / after 画像を置き、下の src を合わせてください。
//   - BEFORE: 泰然のプロフィール画面（フォロワーのみに届く状態）
//   - AFTER : おすすめ・発見タブ「六本木グルメ」に掲載された画面
//   例: public/images/results/before-profile.png, public/images/results/after-explore.png
// ────────────────────────────────────────────────────────────────

const beforeStats = [
  { label: "いいね", value: "15" },
  { label: "保存", value: "0" },
  { label: "コメント", value: "0" },
  { label: "リーチ", value: "500" },
];

const afterStats = [
  { label: "おすすめ・発見タブ閲覧", value: "15,000" },
  { label: "いいね", value: "+620" },
  { label: "プロフィールアクセス", value: "+520" },
  { label: "フォロワー", value: "+380" },
];

const flowSteps = [
  { icon: "🔍", label: "おすすめ・発見タブに掲載" },
  { icon: "👀", label: "投稿を見つける" },
  { icon: "👤", label: "プロフィール流入" },
  { icon: "✅", label: "フォロー", highlight: true },
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
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            導入前 — Before
          </span>
          <p className="mt-3 text-sm text-slate-600">フォロワーにしか届かない状態</p>

          {/* 画像（泰然プロフィール画面） */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-slate-50">
            <img
              src="/images/results/before-profile.png"
              alt="導入前：フォロワーにしか届いていないInstagramプロフィール画面"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">投稿はフォロワーのみに表示</p>

          {/* 数字 */}
          <dl className="mt-5 space-y-2.5">
            {beforeStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm">
                <dt className="text-slate-600">{s.label}</dt>
                <dd className="font-bold text-rose-500">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
            フォロワーの約10%しか反応せず、新規に届かない
          </p>
        </div>

        {/* AFTER */}
        <div className="rounded-3xl border-2 border-[#4CAF75] bg-white p-6 shadow-sm sm:p-7">
          <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium text-[#2D7A4F]">
            導入後 — After
          </span>
          <p className="mt-3 text-sm text-slate-600">おすすめ・発見タブから新規のお客様に届く状態</p>

          {/* 画像（おすすめ・発見タブ掲載画面） */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-[#E8F5ED]">
            <img
              src="/images/results/after-explore.png"
              alt="導入後：おすすめ・発見タブに掲載され新規ユーザーに表示されている画面"
              className="mx-auto h-auto w-full max-w-[260px] object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">おすすめ・発見タブ「六本木グルメ」で上位表示</p>

          {/* 数字 */}
          <dl className="mt-5 space-y-2.5">
            {afterStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-[#E8F5ED] pb-2 text-sm">
                <dt className="text-slate-600">{s.label}</dt>
                <dd className="font-bold text-[#2D7A4F]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 rounded-xl bg-[#E8F5ED] px-4 py-3 text-center text-sm text-[#2D7A4F]">
            フォロワー外へリーチが広がり、来店・フォローにつながる
          </p>
        </div>
      </div>

      {/* フォロワー増加フロー */}
      <div className="mt-10 rounded-3xl border border-dashed border-[#4CAF75] bg-[#F1F8F4] p-6 sm:p-8">
        <p className="text-center text-sm font-bold text-slate-900">
          おすすめ・発見タブ掲載からフォロワー増加までの流れ
        </p>
        {/* モバイルは縦一列（↓）、sm以上は横並び（›） */}
        <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <div
                className={
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm sm:w-auto sm:min-w-[104px] sm:flex-col sm:gap-1 sm:text-center sm:text-xs " +
                  (step.highlight
                    ? "bg-[#2D7A4F] font-bold text-white"
                    : "bg-white text-[#2D7A4F] shadow-sm")
                }
              >
                <span className="text-xl" aria-hidden>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <span aria-hidden className="text-lg leading-none text-[#4CAF75]">
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">›</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
