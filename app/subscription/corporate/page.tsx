import type { Metadata } from "next";
import CorporateContactClient from "./CorporateContactClient";

export const metadata: Metadata = {
  title: "法人向けお問い合わせ｜JEMIA",
  description: "複数アカウントの一括管理・専任サポート・インボイス対応。法人のInstagram運用をまるごとお任せ。まずはお気軽にご相談ください。",
};

export default function CorporateContactPage() {
  return <CorporateContactClient />;
}
