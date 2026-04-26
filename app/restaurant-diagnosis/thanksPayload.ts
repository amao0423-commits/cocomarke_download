/** サンクス画面表示用（sessionStorage 経由で渡す） */
export const RESTAURANT_DIAGNOSIS_THANKS_STORAGE_KEY = "restaurant-diagnosis-thanks-v1";

export type RestaurantDiagnosisThanksPayload = {
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string[];
  q5: string[];
  q6: string | null;
  q8_area: string[];
  storeName: string;
  instagram: string;
  consultation: string;
  email: string;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === "string");
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

/** sessionStorage の生 JSON を表示用に正規化（旧形式の単一文字列も配列に寄せる） */
export function parseRestaurantDiagnosisThanksPayload(data: unknown): RestaurantDiagnosisThanksPayload | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  return {
    q1: typeof o.q1 === "string" ? o.q1 : null,
    q2: typeof o.q2 === "string" ? o.q2 : null,
    q3: typeof o.q3 === "string" ? o.q3 : null,
    q4: toStringArray(o.q4),
    q5: toStringArray(o.q5),
    q6: typeof o.q6 === "string" ? o.q6 : null,
    q8_area: toStringArray(o.q8_area),
    storeName: typeof o.storeName === "string" ? o.storeName : "",
    instagram: typeof o.instagram === "string" ? o.instagram : "",
    consultation: typeof o.consultation === "string" ? o.consultation : "",
    email: typeof o.email === "string" ? o.email : "",
  };
}
