import fs from "node:fs";
import path from "node:path";
import { JemiaHeader, JemiaFooter } from "../../_components/JemiaChrome";
import { AuthorBox } from "../../_components/AuthorBox";
import ArticleDiagnosisBanners from "../../_components/ArticleDiagnosisBanners";
import { Markdown } from "./Markdown";

export type Related = { href: string; title: string };

export function MarkdownArticle({
  slug,
  title,
  description,
  categoryLabel,
  categoryColor,
  published,
  publishedLabel,
  readingTime,
  campaign,
  related,
  faq,
}: {
  slug: string;
  title: string;
  description: string;
  categoryLabel: string;
  categoryColor: string;
  published: string;
  publishedLabel: string;
  readingTime: string;
  campaign: string;
  related: Related[];
  faq?: { q: string; a: string }[];
}) {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/blog", `${slug}.md`), "utf8");
  const body = raw
    .replace(/^﻿/, "")
    .replace(/^\s+/, "")
    .replace(/^#[^\n]*\n?/, "") // 先頭のH1（タイトル）はヒーローで表示するため除外
    .replace(/<!--[\s\S]*?-->/g, "") // HTMLコメントを除去
    .replace(/^\s*\*\*約[\d,，]+字\*\*\s*$/gm, "") // 文字数表記（例：約7,100字）は表示しない
    .replace(/\n\s*---\s*$/g, "") // 末尾に残る区切り線を除去
    .trimEnd();

  const pageUrl = `https://www.cocomake-guide.com/subscription/blog/${slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: title,
      description,
      datePublished: published,
      dateModified: published,
      author: { "@type": "Person", name: "早川 葵", affiliation: { "@type": "Organization", name: "JEMIA（株式会社ホットセラー）" } },
      publisher: { "@type": "Organization", name: "株式会社ホットセラー", url: "https://www.cocomake-guide.com" },
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://www.cocomake-guide.com/subscription" },
        { "@type": "ListItem", position: 2, name: "お役立ち記事", item: "https://www.cocomake-guide.com/subscription/blog" },
        { "@type": "ListItem", position: 3, name: title, item: pageUrl },
      ],
    },
  ];
  if (faq && faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JemiaHeader />

      <div className="bg-white text-slate-800 [text-wrap:pretty]">
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="パンくず" className="mb-6 text-xs text-slate-400">
              <a href="/subscription" className="hover:text-slate-600">ホーム</a>
              <span className="mx-1.5">/</span>
              <a href="/subscription/blog" className="hover:text-slate-600">お役立ち記事</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">{categoryLabel}</span>
            </nav>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: categoryColor }}>
              {categoryLabel}
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[32px] sm:leading-tight">
              {title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <time dateTime={published}>{publishedLabel}</time>
              <span aria-hidden>・</span>
              <span>{readingTime}</span>
              <span aria-hidden>・</span>
              <span>執筆：早川 葵（JEMIA運営局）</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <article>
            <Markdown source={body} />
          </article>

          <AuthorBox />
          <ArticleDiagnosisBanners campaign={campaign} />

          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">関連ページ</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="/subscription" className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  サブスク型インスタ運用代行「JEMIA」の料金プランを見る
                </a>
              </li>
              {related.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
