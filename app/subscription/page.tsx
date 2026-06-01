import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "Instagram運用サブスク JEMIA | COCOマーケ",
  description: "月額固定でインスタ運用をまるごとお任せ。いいね代行・発見タブ最適化・LINE相談まで対応。200アカウント以上の導入実績。",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
