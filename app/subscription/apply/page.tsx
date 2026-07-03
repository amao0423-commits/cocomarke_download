import type { Metadata } from "next";
import { Suspense } from "react";
import OnboardingFlow from "../_components/OnboardingFlow";

export const metadata: Metadata = {
  title: "お申し込み手続き｜JEMIA",
  description: "サブスク型インスタ運用代行「JEMIA」のお申し込み手続きページです。",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingFlow />
    </Suspense>
  );
}
