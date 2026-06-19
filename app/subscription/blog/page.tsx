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
//   このページは "use client"（フィルタ動作のため）なので、
//   metadata export は使えません。SEO用のタイトル/ディスクリプションは
//   同階層に layout.tsx を置いて metadata を定義してください（下部のメモ参照）。
// ────────────────────────────────────────────────────────────────

// ── カテゴリ定義 ─────────────────────────────────────────────
const CATEGORIES = [
  { key: "all", label: "すべて" },
  { key: "algorithm", label: "発見タブ・アルゴリズム" },
  { key: "growth", label: "集客・運用" },
  { key: "industry", label: "業種別ノウハウ" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

// ── 記事データ（記事を追加したらここに足すだけ） ────────────────
type Post = {
  slug: string;
  href: string;
  category: Exclude<CategoryKey, "all">;
  title: string;
  excerpt: string;
  dateModified: string; // 表示用
  readingTime: string;
  featured?: boolean; // 注目記事として大きく出す
};

const POSTS: Post[] = [
  {
    slug: "instagram-explore-tab",
    href: "/subscription/blog/instagram-explore-tab",
    category: "algorithm",
    title: "インスタの発見タブに載る方法｜仕組みと最適化の7つのコツ",
    excerpt:
      "発見タブは、フォロワー以外の見込み客に投稿を届ける最大の入口。表示される投稿の条件から、載るための具体的な7つのコツまで解説します。",
    dateModified: "2026.06.19",
    readingTime: "約7分",
    featured: true,
  },
  // 例: 記事が増えたら下のように追記
  // {
  //   slug: "increase-followers",
  //   href: "/subscription/blog/increase-followers",
  //   category: "growth",
  //   title: "インスタのフォロワーを増やす方法【保存版】",
  //   excerpt: "...",
  //   dateModified: "2026.07.01",
  //   readingTime: "約8分",
  // },
];

const CATEGORY_LABEL: Record<Exclude<CategoryKey, "all">, string> = {
  algorithm: "発見タブ・アルゴリズム",
  growth: "集客・運用",
  industry: "業種別ノウハウ",
};

export default function BlogIndexPage() {
  const [active, setActive] = useState<CategoryKey>("all");

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
            発見タブ・アルゴリズム・集客のノウハウを、店舗やサロンの運用に役立つ形で発信しています。インスタ集客のヒントにどうぞ。
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
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* ── 記事ゼロ件のときの表示 ─────────────────────── */}
        {visible.length === 0 && (
          <p className="mt-16 text-center text-slate-500">
            このカテゴリの記事は準備中です。
          </p>
        )}

        {/* ── 注目記事 ──────────────────────────────────── */}
        {featured && (
          <a
            href={featured.href}
            className="group mt-10 block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="grid sm:grid-cols-2">
              {/* サムネ枠（画像が用意できたら <img> に差し替え） */}
              <div className="flex min-h-[180px] items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 p-8">
                <span className="text-center text-lg font-bold leading-snug text-white">
                  {CATEGORY_LABEL[featured.category]}
                </span>
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
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="inline-block w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {CATEGORY_LABEL[p.category]}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 group-hover:text-emerald-700">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                  <span>更新 {p.dateModified}</span>
                  <span aria-hidden>·</span>
                  <span>{p.readingTime}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-emerald-600 px-7 py-10 text-center text-white">
          <h2 className="text-xl font-bold">インスタ運用を、プロにまかせませんか？</h2>
          <p className="mx-auto mt-4 max-w-lg leading-loose text-emerald-50">
            発見タブ最適化からフォロワー増加まで、専任担当が月額固定で代行。記事を読む時間がないほど忙しい方こそ、まずは無料相談からどうぞ。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/subscription"
              className="rounded-xl bg-white px-6 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
              インスタ運用サブスクを見る →
            </a>
            <a
              href="/subscription#contact"
              className="rounded-xl border border-emerald-300/60 px-6 py-3 font-bold text-white transition hover:bg-emerald-500"
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
