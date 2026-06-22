import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram運用お役立ち記事｜発見タブ・集客・運用のノウハウ｜JEMIA",
  description:
    "Instagramの発見タブ・アルゴリズム・集客・運用のノウハウを発信するお役立ち記事一覧。店舗やサロンのインスタ集客に役立つ実践的な情報をまとめています。",
  alternates: {
    canonical: "https://www.cocomake-guide.com/subscription/blog",
  },
  openGraph: {
    title: "Instagram運用お役立ち記事｜JEMIA",
    description:
      "発見タブ・アルゴリズム・集客・運用のノウハウを発信。店舗・サロンのインスタ集客に役立つ記事一覧。",
    url: "https://www.cocomake-guide.com/subscription/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* サムネの装飾アイコン用（Tabler Icons webfont） */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css"
      />
      {children}
    </>
  );
}
