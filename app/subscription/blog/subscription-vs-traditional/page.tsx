import type { Metadata } from "next";
import { MarkdownArticle } from "../_components/MarkdownArticle";

const URL = "https://www.cocomake-guide.com/subscription/blog/subscription-vs-traditional";
const TITLE = "【比較】Instagram運用代行の「サブスク型」と「従来型」どっちが得？費用相場を検証";
const DESC =
  "Instagram運用代行の費用相場「月20〜30万円」は誰が言っている数字なのか。各社の公表値を出典つきで並べ、サブスク型と従来型の構造的な違いを整理。自社にどちらが向くかを判断できます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "ja_JP" },
};

const FAQ = [
  {
    q: "Instagram運用代行の費用相場はいくらですか？",
    a: "各社の公表値では、代理店のトータル運用で月20〜50万円（初期10〜30万円）、個人・フリーランスで月1〜20万円、サブスク型で月数千円〜数万円が目安です。いずれも自己申告値で、業務範囲により変動します。",
  },
  {
    q: "なぜ「相場は月20〜30万円」と言われるのですか？",
    a: "その数字の多くは、運用代行会社自身が自社サイトで公表しているものです。公的統計ではなく売り手側の提示値であるため、鵜呑みにせず業務範囲とセットで判断する必要があります。",
  },
  {
    q: "サブスク型はなぜ従来型より安いのですか？",
    a: "業務をパッケージ化して工程を標準化し、個別カスタマイズを抑えているためです。ただし効率化なのかテンプレの使い回しなのかは会社により差があるため、契約前に見極めが必要です。",
  },
  {
    q: "サブスク型が向いているのはどんな企業ですか？",
    a: "従来型の高額予算は出せないが継続的に成果を出したい中小企業・店舗・個人事業主に向きます。逆に大規模キャンペーンや広告・インフルエンサーまで統合したい場合は従来型が適します。",
  },
  {
    q: "金額以外で何を比較すればいいですか？",
    a: "7業務（競合調査／初期設定／企画／制作・投稿／コメント対応／分析レポート／広告運用）のうちどこまで含まれるか、KPI設定、解約条件の3点です。金額だけの比較は避けてください。",
  },
  {
    q: "契約前に必ず確認すべきことは？",
    a: "初期費用と最低契約期間、専任担当の有無、レポートに改善提案があるか、解約条件、業界の法規制（薬機法・ステマ規制）への理解です。記事末のチェックリスト10項目を活用してください。",
  },
];

export default function Page() {
  return (
    <MarkdownArticle
      slug="subscription-vs-traditional"
      faq={FAQ}
      title={TITLE}
      description={DESC}
      categoryLabel="運用代行の選び方"
      categoryColor="#334155"
      published="2026-07-15"
      publishedLabel="2026年7月15日"
      readingTime="約10分"
      campaign="agency_cost"
      related={[
        { href: "/subscription/blog/instagram-algorithm-guide", title: "【2026年版】Instagramアルゴリズムの仕組みを完全解説" },
        { href: "/subscription/blog/is-agency-worth-it", title: "Instagram運用代行は意味ない？成果が出ない本当の理由" },
        { href: "/subscription/blog/in-house-vs-outsourcing", title: "内製 vs 外注、Instagram運用のコストを本気で比較" },
      ]}
    />
  );
}
