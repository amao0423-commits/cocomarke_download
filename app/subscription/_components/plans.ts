// オンボーディング（お申し込み手続き）で選択できるプラン。
// ※プレミアムプランは「マーケティング相談」フォーム経由のため、この一覧には含めない。
export type PlanPricing = { name: string; price: string; note?: string };

export const APPLY_PLANS: PlanPricing[] = [
  { name: "人気・おすすめ投稿表示プラン", price: "19,800" },
  { name: "いいね代行プラン", price: "9,800" },
  { name: "セットプラン", price: "24,980", note: "いいね代行＋人気・おすすめ投稿表示のセット" },
  { name: "アカウント上位表示プラン", price: "29,800" },
];

// "24,800" → 24800
export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

// 24800 → "24,800"
export function numberToPrice(n: number): string {
  return n.toLocaleString("en-US");
}
