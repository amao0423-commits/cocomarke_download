/**
 * 流入元（アトリビューション）の記録ユーティリティ。
 *
 * ユーザーが最初に着地したページの UTM パラメータ・参照元（referrer）・
 * ランディング URL を sessionStorage に「初回のみ」保存する（first-touch）。
 * 診断ページ → /subscription への内部遷移で UTM が URL から消えても、
 * フォーム送信時にここから取り出してメールに記載できる。
 */

const KEY = "jemia_attribution";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing?: string;
};

/** 初回訪問時に流入元を記録（2回目以降は何もしない）。 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return; // first-touch のみ保持
    const p = new URLSearchParams(window.location.search);
    const pick = (k: string) => p.get(k)?.trim() || undefined;
    const data: Attribution = {
      utm_source: pick("utm_source"),
      utm_medium: pick("utm_medium"),
      utm_campaign: pick("utm_campaign"),
      utm_content: pick("utm_content"),
      utm_term: pick("utm_term"),
      referrer: document.referrer || undefined,
      landing: window.location.href,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage 不可（プライベートモード等）は無視 */
  }
}

/** 記録済みの流入元を取り出す。未記録なら空オブジェクト。 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}
