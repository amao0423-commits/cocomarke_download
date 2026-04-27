"use client";

import { Suspense } from "react";
import InstagramDiagnostic from "@/components/InstagramDiagnostic";

export default function AnalysisPage() {
  return (
    <Suspense fallback={null}>
      <InstagramDiagnostic variant="page" />
    </Suspense>
  );
}
