import type { Metadata } from "next";

// ────────────────────────────────────────────────────────────────
// 注意: 本ページは一般的な構成のひな形です。実際の運用体制・委託先の
//       有無等に合わせて内容を調整し、公開前に専門家の確認を推奨します。
//       ※所在地は要確認（下記 COMPANY.address）。
// ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "秘密保持方針｜JEMIA（株式会社ホットセラー）",
  description:
    "サブスク型インスタ運用代行「JEMIA」を運営する株式会社ホットセラーの秘密保持方針です。お預かりするアカウント情報・素材・お客様情報の取り扱いについて定めています。",
  alternates: { canonical: "https://www.cocomake-guide.com/confidentiality" },
};

const COMPANY = {
  name: "株式会社ホットセラー",
  dept: "JEMIAマーケティング事業部",
  address: "東京都中央区晴海1-8-16 晴海トリトンスクエアX棟",
  email: "info@cocomake-guide.com",
  updated: "2026年7月2日",
};

const sections = [
  {
    h: "1. 基本方針",
    body: [
      "株式会社ホットセラー（以下「当社」）は、サブスク型インスタ運用代行「JEMIA」（以下「本サービス」）の提供にあたり、お客様からお預かりした情報を厳重に管理し、お客様の信頼にお応えすることを重要な責務と考えています。本方針は、当社が取り扱う秘密情報の管理について定めるものです。",
    ],
  },
  {
    h: "2. 秘密情報の範囲",
    body: [
      "本方針における「秘密情報」とは、本サービスの提供に関連してお客様から開示・提供された情報のうち、以下を含む一切の情報をいいます。",
    ],
    list: [
      "Instagramアカウントのログイン情報・運用に関する情報",
      "投稿用の写真・動画・ロゴ・原稿等の素材",
      "店舗・サービス・商品に関する非公開情報",
      "お客様の氏名・連絡先等の個人情報",
      "運用方針・戦略・分析結果等、当社との協議で生じた情報",
    ],
  },
  {
    h: "3. 利用目的の限定",
    body: [
      "当社は、秘密情報を本サービスの提供および運用に関するご連絡の目的にのみ使用します。当該目的の範囲を超えて秘密情報を利用しません。",
    ],
  },
  {
    h: "4. 第三者への非開示",
    body: [
      "当社は、お客様の事前の同意がある場合、または法令に基づく開示を求められた場合を除き、秘密情報を第三者に開示・提供しません。",
      "本サービスの提供上必要な範囲で業務委託先に秘密情報の取り扱いを委託する場合は、当該委託先との間で本方針と同等の秘密保持義務を課し、適切に監督します。",
    ],
  },
  {
    h: "5. 安全管理措置",
    body: [
      "当社は、秘密情報の漏えい、滅失、毀損、不正アクセス等を防止するため、アクセス権限の管理をはじめとする必要かつ適切な安全管理措置を講じます。また、業務に従事する者に対し、秘密保持に関する教育・監督を行います。",
    ],
  },
  {
    h: "6. 返却・消去",
    body: [
      "本サービスの終了または解約後、当社は、お客様のご要望に応じて、お預かりした素材・情報を適切に返却または消去します。運用のために設定した権限等についても、速やかに解除の対応を行います。",
    ],
  },
  {
    h: "7. 有効期間",
    body: [
      "本方針に基づく秘密保持義務は、本サービスの提供期間中はもとより、提供終了後も継続して適用されるものとします。",
    ],
  },
  {
    h: "8. お問い合わせ",
    body: [
      "秘密情報の取り扱いに関するお問い合わせは、下記の窓口までご連絡ください。",
    ],
  },
];

export default function ConfidentialityPage() {
  return (
    <>
      <div className="bg-white text-slate-800">
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/" className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">秘密保持方針</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">秘密保持方針</h1>
            <p className="mt-3 leading-loose text-slate-600">
              {COMPANY.name}は、サブスク型インスタ運用代行「JEMIA」の提供にあたり、お客様からお預かりした情報を厳重に管理します。その取り扱い方針を以下のとおり定めます。
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-lg font-bold text-slate-900">{s.h}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 leading-loose text-slate-600">{p}</p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-2 leading-relaxed text-slate-600">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4CAF75]" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* 事業者情報 */}
            <section className="rounded-2xl bg-slate-50 p-6 sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">お問い合わせ窓口・事業者情報</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="sm:flex"><dt className="w-32 shrink-0 font-medium text-slate-500">事業者名</dt><dd className="text-slate-800">{COMPANY.name}</dd></div>
                <div className="sm:flex"><dt className="w-32 shrink-0 font-medium text-slate-500">担当部署</dt><dd className="text-slate-800">{COMPANY.dept}</dd></div>
                <div className="sm:flex"><dt className="w-32 shrink-0 font-medium text-slate-500">所在地</dt><dd className="text-slate-800">{COMPANY.address}</dd></div>
                <div className="sm:flex"><dt className="w-32 shrink-0 font-medium text-slate-500">連絡先</dt><dd className="text-slate-800">{COMPANY.email}</dd></div>
              </dl>
            </section>

            <p className="text-sm text-slate-400">制定・最終改定日：{COMPANY.updated}</p>
          </div>
        </main>
      </div>
    </>
  );
}
