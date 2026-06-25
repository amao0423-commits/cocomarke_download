import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "送信完了 | JEMIA",
  description: "お問い合わせありがとうございます。翌営業日以内にご連絡いたします。",
  // サンクスページは検索結果に出さない
  robots: { index: false, follow: false },
};

const G = "#2D7A4F";
const C = "#FF6633";
const GL = "#E8F5ED";
const TM = "#555555";
const TXT = "#1A1A1A";

/**
 * 問い合わせ送信完了ページ。
 * /subscription のフォーム送信成功時にこの URL へ完全遷移する。
 * app/subscription/layout.tsx 配下のため Meta ピクセルが読み込まれ、
 * このページの読み込みで PageView が /subscription/thanks の URL で発火する。
 * → Meta 側で「URL に /subscription/thanks を含む」をコンバージョンに設定して計測できる。
 */
export default function SubscriptionThanksPage() {
  return (
    <>
      {/* 送信完了＝コンバージョン。GA4 に generate_lead を1回発火させる。
          このページは送信成功時のみ到達するため重複なく計測できる。 */}
      <Script id="ga4-generate-lead" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('event', 'generate_lead', { send_to: 'G-CV0JM0KPN9' });
      `}</Script>
      <section
      style={{
        minHeight: "70vh",
        background: `linear-gradient(160deg,#fff 0%,${GL} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #D8EDE1",
          borderRadius: 24,
          maxWidth: 560,
          width: "100%",
          textAlign: "center",
          padding: "48px 32px",
          boxShadow: "0 24px 60px rgba(45,122,79,.12)",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h1
          style={{
            fontSize: "clamp(22px,3vw,30px)",
            fontWeight: 700,
            color: TXT,
            letterSpacing: "-.02em",
            marginBottom: 16,
          }}
        >
          送信が完了しました
        </h1>
        <p style={{ fontSize: 15, color: TM, lineHeight: 1.9, marginBottom: 8 }}>
          お問い合わせいただきありがとうございます。
          <br />
          担当より翌営業日以内にご連絡いたします。
        </p>
        <p style={{ fontSize: 13, color: "#888888", lineHeight: 1.8, marginBottom: 32 }}>
          受付時間：平日 09:00 - 18:00（土日祝日は除く）
        </p>
        <Link
          href="/subscription"
          style={{
            display: "inline-block",
            background: G,
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          JEMIA トップに戻る
        </Link>
        <div style={{ marginTop: 28 }}>
          <span
            style={{
              fontFamily: "Montserrat,sans-serif",
              fontWeight: 900,
              fontSize: 18,
              color: G,
            }}
          >
            JEM<span style={{ color: C }}>I</span>A
          </span>
        </div>
      </div>
    </section>
    </>
  );
}
