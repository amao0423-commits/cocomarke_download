"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * 初回訪問時の流入元（UTM・参照元）を記録するだけの不可視コンポーネント。
 * ルートレイアウトに 1 つ置く。
 */
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
