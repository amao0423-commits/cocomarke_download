import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// 注意: 本ページは一般的な構成のひな形です。実際の取得項目・利用目的・
//       委託先・解析/広告ツールの利用状況等に合わせて内容を調整し、
//       公開前に専門家の確認を推奨します。※所在地は要確認。
// ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "プライバシーポリシー｜JEMIA（株式会社ホットセラー）",
  description:
    "サブスク型インスタ運用代行「JEMIA」における個人情報の取得・利用・管理について定めたプライバシーポリシーです。Cookie・アクセス解析・広告配信の取り扱いについても記載しています。",
  alternates: { canonical: "https://www.cocomake-guide.com/subscription/privacy" },
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
      "株式会社ホットセラー（以下「当社」）は、サブスク型インスタ運用代行「JEMIA」（以下「本サービス」）の提供にあたり、個人情報の重要性を認識し、関係法令およびガイドラインを遵守して、適切に取得・利用・管理します。",
    ],
  },
  {
    h: "2. 取得する個人情報",
    body: [
      "当社は、本サービスの提供にあたり、以下の個人情報を取得することがあります。",
    ],
    list: [
      "お名前、メールアドレス、電話番号等の連絡先情報",
      "会社名・店舗名・業種等の事業に関する情報",
      "InstagramアカウントのIDおよび運用に関する情報",
      "お問い合わせ・資料請求・お申し込みの内容",
      "本サイトの利用状況（Cookie、アクセスログ、端末情報等）",
    ],
  },
  {
    h: "3. 利用目的",
    body: [
      "当社は、取得した個人情報を以下の目的で利用します。",
    ],
    list: [
      "本サービスの提供、運用および運用に関するご連絡のため",
      "お問い合わせ・資料請求・お申し込みへの対応のため",
      "ご案内・ご提案（メール等）の送付のため",
      "サービスの改善・新機能の開発・統計分析のため",
      "法令に基づく対応のため",
    ],
  },
  {
    h: "4. 第三者への提供",
    body: [
      "当社は、次の場合を除き、あらかじめご本人の同意を得ることなく個人情報を第三者に提供しません。",
    ],
    list: [
      "法令に基づく場合",
      "人の生命・身体・財産の保護に必要で、本人の同意取得が困難な場合",
      "本サービスの提供に必要な範囲で業務委託先に取り扱いを委託する場合",
    ],
  },
  {
    h: "5. 業務委託",
    body: [
      "当社は、利用目的の達成に必要な範囲で個人情報の取り扱いを外部に委託することがあります。この場合、当社は委託先に対して適切な監督を行います。",
    ],
  },
  {
    h: "6. Cookie・アクセス解析・広告について",
    body: [
      "本サイトでは、利用状況の把握・サービス改善・広告配信の最適化のため、Cookie等を利用したアクセス解析・広告配信ツールを使用しています。これらにより収集される情報には、個人を直接特定しない利用データが含まれます。",
      "本サイトでは Google アナリティクス（GA4）および Meta（Facebook）ピクセルを利用しています。ブラウザの設定によりCookieを無効化することで、これらの収集を拒否することができます。各ツールの詳細および取り扱いは、各社のポリシーをご確認ください。",
    ],
  },
  {
    h: "7. 安全管理措置",
    body: [
      "当社は、個人情報の漏えい、滅失、毀損、不正アクセス等を防止するため、必要かつ適切な安全管理措置を講じ、従業者に対して必要な監督を行います。",
    ],
  },
  {
    h: "8. 開示・訂正・削除等の請求",
    body: [
      "ご本人からの個人情報の開示、訂正、追加、削除、利用停止等のご請求に対しては、ご本人であることを確認のうえ、法令に従い適切に対応します。ご請求は下記の窓口までご連絡ください。",
    ],
  },
  {
    h: "9. お問い合わせ窓口",
    body: [
      "個人情報の取り扱いに関するお問い合わせは、下記の窓口までご連絡ください。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JemiaHeader />
      <div className="bg-white text-slate-800">
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">JEMIA</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">プライバシーポリシー</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">プライバシーポリシー</h1>
            <p className="mt-3 leading-loose text-slate-600">
              {COMPANY.name}は、サブスク型インスタ運用代行「JEMIA」における個人情報を適切に取り扱います。その取り扱い方針を以下のとおり定めます。
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
      <JemiaFooter />
    </>
  );
}
