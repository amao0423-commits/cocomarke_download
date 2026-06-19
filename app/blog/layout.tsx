import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram運用お役立ち記事｜発見タブ・集客・運用のノウハウ｜JEMIA",
  description:
    "Instagramの発見タブ・アルゴリズム・集客・運用のノウハウを発信するお役立ち記事一覧。店舗やサロンのインスタ集客に役立つ実践的な情報をまとめています。",
  alternates: {
    canonical: "https://www.cocomake-guide.com/blog",
  },
  openGraph: {
    title: "Instagram運用お役立ち記事｜JEMIA",
    description:
      "発見タブ・アルゴリズム・集客・運用のノウハウを発信。店舗・サロンのインスタ集客に役立つ記事一覧。",
    url: "https://www.cocomake-guide.com/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
