import type { Metadata } from "next";
import MetaUpdatesTimeline from "@/components/reference/MetaUpdatesTimeline";
import { LAST_UPDATED } from "@/lib/content/metaUpdates";

const PAGE_TITLE = "Instagram / Meta 仕様変更タイムライン｜COCOマーケ";
const PAGE_DESCRIPTION =
  "2023年10月以降のInstagram・Metaの仕様変更を、公式一次ソース付きで時系列にまとめた無料リファレンス。アルゴリズム・表示仕様・広告ポリシー・日本国内の規制改定まで随時更新しています。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/reference/meta-updates/",
  },
};

function isoDateFromDotted(dotted: string): string {
  const [y, m, d] = dotted.split(".");
  return `${y}-${m}-${d ?? "01"}`;
}

export default function MetaUpdatesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Instagram / Meta 仕様変更タイムライン",
    description:
      "2023年10月以降のInstagram・Metaの仕様変更を、一次ソース付きで時系列にまとめた無料リファレンス",
    inLanguage: "ja",
    dateModified: isoDateFromDotted(LAST_UPDATED),
    author: { "@type": "Organization", name: "COCOマーケ" },
    publisher: { "@type": "Organization", name: "株式会社ホットセラー" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MetaUpdatesTimeline />
    </>
  );
}
