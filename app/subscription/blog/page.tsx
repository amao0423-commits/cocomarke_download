"use client";

import { useState } from "react";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ────────────────────────────────────────────────────────────────
// ⚠️ 差し替え必須: 既存サイトの共通コンポーネントのパスに合わせてください。
// ────────────────────────────────────────────────────────────────
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
//
// 📝 metadata について:
//   このページは "use client"（フィルタ動作のため）なので metadata export は使えません。
//   SEO用タイトルは同階層の layout.tsx で定義してください。
// ────────────────────────────────────────────────────────────────

// ── カテゴリ定義（色・アイコン・連番をここで一元管理） ──────────────
// thumb        : サムネ背景色（Tailwind bg クラス）
// accentBorder : カテゴリラベルの枠線色
// accentText   : カテゴリラベルの文字色
// icon         : 右下に薄く置く装飾アイコン（Tabler。globals で読み込み済み想定）
const CATEGORY_META = {
  algorithm: {
    label: "おすすめ・発見タブ・アルゴリズム",
    no: "01",
    thumb: "bg-emerald-700",
    accentBorder: "border-emerald-300/50",
    accentText: "text-emerald-200",
    icon: "ti-chart-bar",
  },
  growth: {
    label: "集客・運用",
    no: "02",
    thumb: "bg-cyan-800",
    accentBorder: "border-cyan-300/50",
    accentText: "text-cyan-200",
    icon: "ti-trending-up",
  },
  industry: {
    label: "業種別ノウハウ",
    no: "03",
    thumb: "bg-amber-700",
    accentBorder: "border-amber-300/50",
    accentText: "text-amber-100",
    icon: "ti-building-store",
  },
  interview: {
    label: "運営者インタビュー",
    no: "04",
    thumb: "bg-[#2D7A4F]",
    accentBorder: "border-[#9FD3B6]/50",
    accentText: "text-[#E8F5ED]",
    icon: "ti-microphone",
  },
  agency: {
    label: "運用代行の選び方",
    no: "05",
    thumb: "bg-slate-700",
    accentBorder: "border-slate-300/50",
    accentText: "text-slate-200",
    icon: "ti-scale",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_META;

const CATEGORIES = [
  { key: "all" as const, label: "すべて" },
  ...(Object.keys(CATEGORY_META) as CategoryKey[]).map((k) => ({
    key: k,
    label: CATEGORY_META[k].label,
  })),
];

// ── 記事データ（記事を追加したらここに足すだけ） ────────────────
type Post = {
  slug: string;
  href: string;
  category: CategoryKey;
  title: string;
  excerpt: string;
  dateModified: string;
  readingTime: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    slug: "instagram-algorithm-guide",
    href: "/subscription/blog/instagram-algorithm-guide",
    category: "algorithm",
    title: "【2026年版】Instagramアルゴリズムの仕組みを完全解説｜公式発言から読み解く伸びる投稿の条件",
    excerpt:
      "Instagramに単一のアルゴリズムは存在しません。フィード・ストーリーズ・リール・発見タブそれぞれの評価軸を、公式発言など一次情報だけで整理。2026年に伸びる投稿の条件を解説します。",
    dateModified: "2026.07.15",
    readingTime: "約12分",
    featured: true,
  },
  {
    slug: "subscription-vs-traditional",
    href: "/subscription/blog/subscription-vs-traditional",
    category: "agency",
    title: "【比較】Instagram運用代行の「サブスク型」と「従来型」どっちが得？費用相場を検証",
    excerpt:
      "運用代行の費用相場「月20〜30万円」は誰が言っている数字なのか。各社の公表値を出典つきで並べ、サブスク型と従来型の違いを整理。自社にどちらが向くか判断できます。",
    dateModified: "2026.07.15",
    readingTime: "約10分",
  },
  {
    slug: "is-agency-worth-it",
    href: "/subscription/blog/is-agency-worth-it",
    category: "agency",
    title: "Instagram運用代行は意味ない？「成果が出なかった」と言われる本当の理由",
    excerpt:
      "「運用代行は意味ない」と言われる理由を、代行会社側の7つの失敗パターンと依頼側の4つの原因の両面から解説。成果の出る条件と契約前チェックリストを示します。",
    dateModified: "2026.07.15",
    readingTime: "約10分",
  },
  {
    slug: "in-house-vs-outsourcing",
    href: "/subscription/blog/in-house-vs-outsourcing",
    category: "agency",
    title: "Instagram運用を内製 vs 外注、コストを本気で比較してみた",
    excerpt:
      "内製した場合の工数を積み上げて試算。月約76時間＝実質20万円前後の人件費に加え、機会費用・学習コスト・属人化リスクまで含めて外注と比較します。",
    dateModified: "2026.07.15",
    readingTime: "約9分",
  },
  {
    slug: "jemia-interview",
    href: "/subscription/blog/jemia-interview",
    category: "interview",
    title: "「頑張っても伸びない」を終わらせたい｜JEMIA運営責任者インタビュー",
    excerpt:
      "おすすめ・発見タブ重視の運用にこだわる理由、成果を出すアカウントの共通点、JEMIAが向いている人。運営責任者に、サービスに込めた想いを聞きました。",
    dateModified: "2026.07.07",
    readingTime: "約6分",
  },
  {
    slug: "instagram-algorithm-2026",
    href: "/subscription/blog/instagram-algorithm-2026",
    category: "algorithm",
    title: "【2026年最新】Instagramアルゴリズムの変化｜いま伸ばすべき5つの指標",
    excerpt:
      "Instagramは面ごとに別のランキング系統を持つ。評価が「いいね」から「保存・送信（シェア）」へ移るなか、発見タブ・リールで伸ばすためにいま追うべき5指標を公式出典つきで整理。",
    dateModified: "2026.07.16",
    readingTime: "約11分",
  },
  {
    slug: "followers-vs-engagement",
    href: "/subscription/blog/followers-vs-engagement",
    category: "growth",
    title: "フォロワー1万人でも売れない？「数」より「反応」で伸ばすInstagram運用【2026年】",
    excerpt:
      "Instagramは投稿をフォロワー数ではなく反応（保存・シェア・視聴時間）で評価します。公式の主要シグナルを踏まえ、追うべきKPIと反応の増やし方を出典つきで解説。",
    dateModified: "2026.07.16",
    readingTime: "約10分",
  },
  {
    slug: "restaurant-instagram-guide",
    href: "/subscription/blog/restaurant-instagram-guide",
    category: "industry",
    title: "飲食店のInstagram集客｜週2投稿で予約につなげる「来店導線」の作り方【2026年】",
    excerpt:
      "若年層の飲食店探しはInstagramが1位（Z世代38.9%・大学生63.5%）。発見される投稿・プロフィール導線・位置情報の3点で、週2投稿でも来店につなげる方法を出典つきで解説。",
    dateModified: "2026.07.16",
    readingTime: "約11分",
  },
  {
    slug: "instagram-explore-tab",
    href: "/subscription/blog/instagram-explore-tab",
    category: "algorithm",
    title: "インスタのおすすめ・発見タブに載る方法｜仕組みと最適化の7つのコツ【2026年】",
    excerpt:
      "発見タブはフォロワー以外の見込み客に届く最大の入口。フィードとは別のランキングで動く仕組みと、載るための具体的な7つのコツを公式出典つきで解説します。",
    dateModified: "2026.07.16",
    readingTime: "約10分",
    featured: true,
  },
  {
    slug: "increase-followers",
    href: "/subscription/blog/increase-followers",
    category: "growth",
    title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ【2026年】",
    excerpt:
      "フォロワーは「集める」のではなく「増える流れ」を作るもの。反応される投稿→新規に届く→プロフィール来訪→フォローの土台を9ステップで整える方法を公式出典つきで解説。",
    dateModified: "2026.07.16",
    readingTime: "約11分",
  },
  {
    slug: "agency-guide",
    href: "/subscription/blog/agency-guide",
    category: "agency",
    title: "Instagram運用代行の選び方｜費用相場・失敗しない比較ポイント【2026年】",
    excerpt:
      "運用代行の費用相場（各社の公表値）、依頼できる業務、代理店・フリーランス・サブスク型の違い、失敗しない選び方チェックリストを整理。自社が代行すべきか判断できます。",
    dateModified: "2026.07.15",
    readingTime: "約11分",
  },
];

// ── 雑誌風タイポのサムネ（注目記事＝大、通常＝小で sizes を出し分け） ──
function Thumbnail({ category, size }: { category: CategoryKey; size: "lg" | "sm" }) {
  const m = CATEGORY_META[category];
  const isLg = size === "lg";
  return (
    <div className={`relative h-full w-full overflow-hidden ${m.thumb}`}>
      {/* 右下の装飾アイコン */}
      <i
        className={`ti ${m.icon} absolute text-white/20`}
        aria-hidden="true"
        style={{ right: 14, bottom: 10, fontSize: isLg ? 56 : 34 }}
      />
      <div className={isLg ? "p-7" : "p-5"}>
        <span
          className={`inline-block rounded-full border ${m.accentBorder} ${m.accentText} ${
            isLg ? "text-[11px]" : "text-[10px]"
          } font-medium tracking-[0.15em]`}
          style={{ padding: isLg ? "3px 10px" : "2px 8px" }}
        >
          CATEGORY {m.no}
        </span>
        <p
          className={`mt-3 font-medium leading-snug text-white ${
            isLg ? "text-[1.6rem]" : "text-base"
          }`}
        >
          {m.label}
        </p>
      </div>
    </div>
  );
}

export default function BlogIndexPage() {
  const [active, setActive] = useState<CategoryKey | "all">("all");

  const visible = POSTS.filter((p) => active === "all" || p.category === active);
  const featured = visible.find((p) => p.featured) ?? visible[0];
  const rest = visible.filter((p) => p !== featured);

  return (
    <div className="bg-white text-slate-800">
      <JemiaHeader />

      {/* ── Hero ───────────────────────────────────────── */}
      <header className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
          <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
            <a href="/subscription" className="hover:text-slate-600">ホーム</a>
            <span className="mx-1.5">/</span>
            <span className="text-slate-500">お役立ち記事</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Instagram運用お役立ち記事
          </h1>
          <p className="mt-4 max-w-xl leading-loose text-slate-600">
            おすすめ・発見タブ・アルゴリズム・集客のノウハウを、店舗やサロンの運用に役立つ形で発信しています。インスタ集客のヒントにどうぞ。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        {/* ── カテゴリフィルタ ──────────────────────────── */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリ">
          {CATEGORIES.map((c) => {
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c.key)}
                className={
                  "rounded-full px-4 py-2 text-sm font-medium transition " +
                  (isActive
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* ── 記事ゼロ件 ─────────────────────────────────── */}
        {visible.length === 0 && (
          <p className="mt-16 text-center text-slate-500">このカテゴリの記事は準備中です。</p>
        )}

        {/* ── 注目記事 ──────────────────────────────────── */}
        {featured && (
          <a
            href={featured.href}
            className="group mt-10 block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="grid sm:grid-cols-2">
              <div className="min-h-[200px]">
                <Thumbnail category={featured.category} size="lg" />
              </div>
              <div className="p-7">
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  注目記事
                </span>
                <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-700">
                  {featured.title}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <span>更新 {featured.dateModified}</span>
                  <span aria-hidden>·</span>
                  <span>{featured.readingTime}</span>
                </div>
              </div>
            </div>
          </a>
        )}

        {/* ── 記事カード一覧 ────────────────────────────── */}
        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {rest.map((p) => (
              <a
                key={p.slug}
                href={p.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-32">
                  <Thumbnail category={p.category} size="sm" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-emerald-700">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span>更新 {p.dateModified}</span>
                    <span aria-hidden>·</span>
                    <span>{p.readingTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── CTA（白背景＋緑枠） ───────────────────────── */}
        <section className="mt-16 rounded-3xl border-2 border-emerald-200 bg-white px-7 py-10 text-center">
          <h2 className="text-xl font-bold text-emerald-800">インスタ運用を、プロにまかせませんか？</h2>
          <p className="mx-auto mt-4 max-w-lg leading-loose text-slate-600">
            おすすめ・発見タブ最適化からフォロワー増加まで、専任担当が月額固定で代行。記事を読む時間がないほど忙しい方こそ、まずは無料相談からどうぞ。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/subscription"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              サブスク型インスタ運用代行を見る →
            </a>
            <a
              href="/subscription#contact"
              className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              無料で相談する →
            </a>
          </div>
        </section>
      </main>

      <JemiaFooter />
    </div>
  );
}
