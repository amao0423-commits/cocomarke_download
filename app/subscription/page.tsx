import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "インスタ運用サブスク｜月額固定で代行・フォロワー増・発見タブ最適化｜JEMIA",
  description: "インスタ運用をプロにまるごとお任せできる月額サブスク。いいね代行・発見タブ最適化・LINE相談まで対応。契約縛りなし・解約自由で、平均3倍のフォロワー増加。導入3000アカウント突破。無料相談受付中。",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
