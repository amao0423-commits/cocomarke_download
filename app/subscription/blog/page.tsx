"use client";

import { useState } from "react";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// ── カテゴリ定義（色・アイコン・連番をここで一元管理） ──────────────
const CATEGORY_META = {
  algorithm: {
    label: "発見タブ・アルゴリズム",
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
            発見タブ最適化からフォロワー増加まで、専任担当が月額固定で代行。記事を読む時間がないほど忙しい方こそ、まずは無料相談からどうぞ。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/subscription"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              インスタ運用サブスクを見る →
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
