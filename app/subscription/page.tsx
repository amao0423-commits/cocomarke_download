import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "インスタ運用サブスク｜JEMIA",
  description: "月額固定でインスタ運用をまるごとお任せ。いいね代行・発見タブ最適化・LINE相談まで対応。3000アカウント以上の導入実績。",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
