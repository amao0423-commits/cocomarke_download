import type { Lang } from "../subscriptionContent";

// オンボーディング（お申し込み手続き）で選択できるプラン。
// ※プレミアムは「マーケティング相談」フォーム経由のため、この一覧には含めない。
// key は表示言語によらず常に日本語の内部識別子（お申し込みURLの ?plan= や
// /api/onboarding への送信値と整合させるため）。name が言語ごとの表示名。
export type PlanPricing = { key: string; name: string; price: string; note?: string };

export const APPLY_PLANS: Record<Lang, PlanPricing[]> = {
  ja: [
    { key: "いいね代行", name: "いいね代行", price: "9,800" },
    { key: "発見表示ブースト", name: "発見表示ブースト", price: "19,800" },
    { key: "セットプラン", name: "セットプラン", price: "24,980", note: "いいね代行＋発見表示ブーストのセット" },
    { key: "リスト上位表示", name: "リスト上位表示", price: "14,800" },
  ],
  ko: [
    { key: "いいね代行", name: "좋아요 대행", price: "9,800" },
    { key: "発見表示ブースト", name: "탐색 탭 노출 부스트", price: "19,800" },
    { key: "セットプラン", name: "세트 플랜", price: "24,980", note: "좋아요 대행 + 탐색 탭 노출 부스트 세트" },
    { key: "リスト上位表示", name: "리스트 상위 노출", price: "14,800" },
  ],
};

// お申し込み時に追加できるオプション。
// group が同じものは相互排他（例：投稿制作の4本/8本はどちらか一方）。
// price は合計月額に加算する額（複数アカウント割は割引のため 0＝合計には反映しない）。
// id は言語によらず不変（選択状態・排他制御の識別子）。
export type PlanOption = { id: string; name: string; price: number; priceLabel: string; group?: string };

export const APPLY_OPTIONS: Record<Lang, PlanOption[]> = {
  ja: [
    { id: "post4", name: "投稿制作オプション（月4本）", price: 9800, priceLabel: "+9,800円/月", group: "post" },
    { id: "post8", name: "投稿制作オプション（月8本）", price: 18000, priceLabel: "+18,000円/月", group: "post" },
    { id: "multi", name: "複数アカウント割（2つ目以降 5%OFF）", price: 0, priceLabel: "5%OFF" },
  ],
  ko: [
    { id: "post4", name: "게시물 제작 옵션(월 4건)", price: 9800, priceLabel: "+9,800엔/월", group: "post" },
    { id: "post8", name: "게시물 제작 옵션(월 8건)", price: 18000, priceLabel: "+18,000엔/월", group: "post" },
    { id: "multi", name: "복수 계정 할인(2번째 계정부터 5% 할인)", price: 0, priceLabel: "5% 할인" },
  ],
};

// "24,800" → 24800
export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

// 24800 → "24,800"
export function numberToPrice(n: number): string {
  return n.toLocaleString("en-US");
}
