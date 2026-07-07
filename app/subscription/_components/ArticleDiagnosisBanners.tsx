// ────────────────────────────────────────────────────────────────
// 記事末・フッター前に差し込む診断バナー（2つ・上下並び）
//
// 配置: 各記事ページの </article>（＋執筆者/著者ボックス）の直後、
//       <aside>（関連ページ）の前あたりに <ArticleDiagnosisBanners campaign="..." /> を置く。
//
// バナー1: サービス紹介ページ内の診断セクション（あなたに合うプランが分かる）
//   → https://www.cocomake-guide.com/subscription/diagnosis
// バナー2: 顔キャラのタイプ診断ツール（あなたの伸びないタイプは？）
//   → https://www.cocomake-guide.com/shindan.html?utm...
//
// campaign: バナー2のタイプ診断リンクに付く utm_campaign（記事ごとに指定）
// ────────────────────────────────────────────────────────────────

const PLAN_DIAGNOSIS_URL = "https://www.cocomake-guide.com/subscription/diagnosis";

function typeDiagnosisUrl(campaign: string) {
  return `https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=${campaign}`;
}

// ブサかわ顔キャラ（shindan.html の顔デザインに合わせて再現）
function Face({
  skin = "#f6d9ba",
  hair = "#6b4a2f",
  variant = "normal",
  accessory = false,
}: {
  skin?: string;
  hair?: string;
  variant?: "normal" | "cry" | "surprised";
  accessory?: boolean;
}) {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      {/* 輪郭（丸め） */}
      <circle cx="40" cy="44" r="30" fill={skin} stroke="#c99a6a" strokeWidth="1.5" />
      {/* 耳 */}
      <circle cx="11" cy="44" r="5" fill={skin} stroke="#c99a6a" strokeWidth="1.5" />
      <circle cx="69" cy="44" r="5" fill={skin} stroke="#c99a6a" strokeWidth="1.5" />
      {/* 髪（上部こんもり） */}
      <path d="M12 34 Q14 14 40 13 Q66 14 68 34 Q60 24 40 24 Q20 24 12 34 Z" fill={hair} />
      {accessory && (
        <path d="M60 20 l13 -6" stroke="#e2703a" strokeWidth="4" strokeLinecap="round" />
      )}
      {/* 眉（短い線） */}
      <path d="M22 36 h9" stroke="#9a7a52" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 36 h9" stroke="#9a7a52" strokeWidth="2" strokeLinecap="round" />
      {/* 目（大きい白目・小さい黒目） */}
      <circle cx="28" cy="45" r="8.5" fill="#fff" stroke="#4a4a4a" strokeWidth="1.5" />
      <circle cx="52" cy="45" r="8.5" fill="#fff" stroke="#4a4a4a" strokeWidth="1.5" />
      <circle cx={variant === "surprised" ? 28 : 29} cy="46" r={variant === "surprised" ? 2.5 : 3.5} fill="#3a3a3a" />
      <circle cx={variant === "surprised" ? 52 : 53} cy="46" r={variant === "surprised" ? 2.5 : 3.5} fill="#3a3a3a" />
      {/* チーク */}
      <ellipse cx="22" cy="55" rx="4" ry="2.5" fill="#f4a6a6" opacity="0.6" />
      <ellipse cx="58" cy="55" rx="4" ry="2.5" fill="#f4a6a6" opacity="0.6" />
      {/* 口 */}
      {variant === "surprised" ? (
        <ellipse cx="40" cy="62" rx="5" ry="4.5" fill="#e08a8a" stroke="#b56a6a" strokeWidth="1" />
      ) : (
        <path d="M33 61 Q40 66 47 61" fill="none" stroke="#9a7a52" strokeWidth="2" strokeLinecap="round" />
      )}
      {/* 涙 */}
      {variant === "cry" && (
        <path d="M56 50 q3 7 0 11" fill="none" stroke="#6ab0e0" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function ArticleDiagnosisBanners({ campaign = "blog" }: { campaign?: string }) {
  return (
    <section aria-label="診断で現状をチェック" className="mt-14 space-y-4">
      {/* バナー1: プラン診断（サービス寄り） */}
      <a
        href={PLAN_DIAGNOSIS_URL}
        className="group relative block overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D7A4F] to-[#1A5C37] p-7 sm:p-8"
      >
        {/* 背景の装飾 */}
        <span aria-hidden className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[140px] font-black leading-none text-white/10">
          ?
        </span>
        <div className="relative z-10 text-white">
          <p className="text-xs font-bold tracking-[0.2em] text-[#B7DCC6]">PLAN DIAGNOSIS</p>
          <p className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
            あなたに合うプランが<br className="sm:hidden" />60秒で分かります
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#E8F5ED]">
            目的を選ぶだけで、最適なJEMIAのプランをご提案。まずは気軽にチェックしてみてください。
          </p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#1A5C37] transition group-hover:gap-2">
            プラン診断を見る <span aria-hidden>→</span>
          </span>
        </div>
      </a>

      {/* バナー2: タイプ診断（顔キャラ） */}
      <a
        href={typeDiagnosisUrl(campaign)}
        target="_blank"
        rel="noopener"
        className="group relative block overflow-hidden rounded-2xl border border-[#CDE7D8] bg-[#EAF4EE] p-7 sm:p-8"
      >
        {/* ドット装飾 */}
        <span aria-hidden className="absolute right-10 top-6 h-2 w-2 rounded-full bg-[#8FC7A6]" />
        <span aria-hidden className="absolute right-24 bottom-8 h-1.5 w-1.5 rounded-full bg-orange-300" />

        <div className="relative z-10 max-w-[62%] sm:max-w-[58%]">
          <p className="text-sm font-black tracking-wide text-[#1A5C37]">JEMIA</p>
          <p className="mt-3 text-xl font-bold leading-snug text-slate-800 sm:text-2xl">
            あなたのインスタ、<br />伸びないタイプは
            <span className="text-orange-500">？</span>
          </p>
          <p className="mt-3 text-xs font-bold text-slate-500">60秒・無料 ／ 12タイプ診断</p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition group-hover:gap-2 group-hover:bg-orange-600">
            無料で診断する <span aria-hidden>→</span>
          </span>
        </div>

        {/* 顔キャラたち */}
        <div aria-hidden className="pointer-events-none absolute right-2 top-1/2 hidden h-[86%] w-[38%] -translate-y-1/2 sm:block">
          <div className="absolute right-0 top-0 h-[46%] w-[46%]">
            <Face variant="cry" hair="#5a3d28" />
          </div>
          <div className="absolute right-[30%] top-[28%] h-[50%] w-[50%]">
            <Face variant="surprised" hair="#4a3020" accessory />
          </div>
          <div className="absolute right-[4%] bottom-0 h-[48%] w-[48%]">
            <Face variant="normal" hair="#6b4a2f" accessory />
          </div>
        </div>
      </a>
    </section>
  );
}
