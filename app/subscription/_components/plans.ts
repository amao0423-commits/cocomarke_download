// オンボーディング（お申し込み手続き）で選択できるプラン。
// ※プレミアムは「マーケティング相談」フォーム経由のため、この一覧には含めない。
export type PlanPricing = { name: string; price: string; note?: string };

export const APPLY_PLANS: PlanPricing[] = [
  { name: "いいね代行", price: "9,800" },
  { name: "発見表示ブースト", price: "19,800" },
  { name: "セットプラン", price: "24,980", note: "いいね代行＋発見表示ブーストのセット" },
  { name: "リスト上位表示", price: "14,800" },
];

// お申し込み時に追加できるオプション。
// group が同じものは相互排他（例：投稿制作の4本/8本はどちらか一方）。
// price は合計月額に加算する額（複数アカウント割は割引のため 0＝合計には反映しない）。
export type PlanOption = { id: string; name: string; price: number; priceLabel: string; group?: string };

export const APPLY_OPTIONS: PlanOption[] = [
  { id: "post4", name: "投稿制作オプション（月4本）", price: 9800, priceLabel: "+9,800円/月", group: "post" },
  { id: "post8", name: "投稿制作オプション（月8本）", price: 18000, priceLabel: "+18,000円/月", group: "post" },
  { id: "multi", name: "複数アカウント割（2つ目以降 5%OFF）", price: 0, priceLabel: "5%OFF" },
];

// "24,800" → 24800
export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

// 24800 → "24,800"
export function numberToPrice(n: number): string {
  return n.toLocaleString("en-US");
}
