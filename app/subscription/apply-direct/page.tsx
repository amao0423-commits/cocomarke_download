import type { Metadata } from "next";
import { Suspense } from "react";
import OnboardingFlow from "../_components/OnboardingFlow";

// 担当者が相談者へ個別に案内する「単体のお申し込みリンク」。
// HP上には設置せず（どこからもリンクしない）、noindex で検索にも出さない。
// 送信時に source="担当者経由（相談後）" を付与し、通常のHP申込と区別できる。
export const metadata: Metadata = {
  title: "お申し込み手続き｜JEMIA",
  description: "サブスク型インスタ運用代行「JEMIA」のお申し込み手続きページです。",
  robots: { index: false, follow: false },
};

export default function ApplyDirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingFlow sourceLabel="担当者経由（相談後）" />
    </Suspense>
  );
}
