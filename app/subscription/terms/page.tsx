import type { Metadata } from "next";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// 注意: 本ページは一般的な構成のひな形です。実際のサービス内容・料金・
//       解約条件等に合わせて内容を調整し、公開前に専門家の確認を
//       推奨します。※所在地は要確認（下記 COMPANY.address）。
// ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "利用規約｜JEMIA（株式会社ホットセラー）",
  description:
    "サブスク型インスタ運用代行「JEMIA」の利用規約です。サービス内容、料金、解約方法、免責事項等を定めています。",
  alternates: { canonical: "https://www.cocomake-guide.com/subscription/terms" },
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
    h: "第1条（適用）",
    body: [
      "本規約は、株式会社ホットセラー（以下「当社」）が提供するサブスク型インスタ運用代行「JEMIA」（以下「本サービス」）の利用に関する条件を、本サービスを利用するお客様（以下「利用者」）と当社との間で定めるものです。利用者は、本規約に同意のうえ本サービスを利用するものとします。",
    ],
  },
  {
    h: "第2条（サービス内容）",
    body: [
      "本サービスは、利用者のInstagramアカウントの運用支援（おすすめ・発見タブ最適化、エンゲージメント向上施策、投稿に関する提案、分析レポート等）を、お申し込みいただいたプランの範囲で提供するものです。具体的な内容は各プランおよびオプションの定めによります。",
    ],
  },
  {
    h: "第3条（料金・お支払い）",
    body: [
      "利用者は、お申し込みいただいたプランおよびオプションに応じた月額料金を、当社が定める方法によりお支払いいただきます。料金はすべて税込表示です。",
      "当社は、お申し込み内容を確認のうえ、お支払い方法をご案内します。初回のお支払い確認後に運用準備を開始します。",
    ],
  },
  {
    h: "第4条（契約期間・更新）",
    body: [
      "本サービスの契約期間は1ヶ月単位とし、利用者から解約のお申し出がない限り、同一条件で自動的に更新されるものとします。",
    ],
  },
  {
    h: "第5条（解約）",
    body: [
      "利用者は、次に定める方法により、いつでも本サービスを解約することができます。",
      "解約をご希望の場合は、ご希望月の締め日の5日前までに、ご担当者またはJEMIA運営事務局（info@cocomake-guide.com）へメールにてお申し出ください。",
      "締め日の5日前を過ぎてお申し出いただいた場合、当月分は通常どおり提供・課金され、翌月からの解約となります。",
      "解約の効力は、当社がお申し出を確認し、利用者へ受付の旨をご連絡した時点で確定します。",
    ],
  },
  {
    h: "第6条（成果・免責）",
    body: [
      "当社は本サービスの提供にあたり善良な管理者の注意をもって運用しますが、フォロワー数・表示順位・エンゲージメント等の成果は、アカウントの状況やInstagramの仕様・アルゴリズムの変更等により変動するため、特定の成果を保証するものではありません。",
      "Instagramの仕様変更、規約変更、アカウントの制限・停止等、当社の責によらない事由により生じた損害について、当社は責任を負いません。",
    ],
  },
  {
    h: "第7条（禁止事項）",
    body: [
      "利用者は、法令または公序良俗に違反する行為、当社もしくは第三者の権利を侵害する行為、本サービスの運営を妨げる行為を行ってはならないものとします。",
    ],
  },
  {
    h: "第8条（秘密情報の取り扱い）",
    body: [
      "当社は、本サービスの提供のためにお預かりしたアカウント情報・素材・利用者情報を、運用および連絡の目的にのみ使用し、利用者の許可なく第三者に開示・提供しません。個人情報の取り扱いについては、別途定めるプライバシーポリシーによります。",
    ],
  },
  {
    h: "第9条（規約の変更）",
    body: [
      "当社は、必要と判断した場合、利用者に事前に通知することなく本規約を変更できるものとします。変更後の規約は、当社サイトに掲載した時点から効力を生じます。",
    ],
  },
  {
    h: "第10条（準拠法・管轄）",
    body: [
      "本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の所在地を管轄する裁判所を第一審の専属的合意管轄とします。",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JemiaHeader />
      <div className="bg-white text-slate-800">
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">JEMIA</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">利用規約</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">利用規約</h1>
            <p className="mt-3 leading-loose text-slate-600">
              本規約は、{COMPANY.name}が提供するサブスク型インスタ運用代行「JEMIA」のご利用条件を定めるものです。
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.h} id={s.h.includes("解約") ? "cancellation" : undefined}>
                <h2 className="text-lg font-bold text-slate-900">{s.h}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 leading-loose text-slate-600">{p}</p>
                ))}
              </section>
            ))}

            {/* 事業者情報 */}
            <section className="rounded-2xl bg-slate-50 p-6 sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">事業者情報</h2>
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
