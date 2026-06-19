import Link from "next/link";
import styles from "../subscription.module.css";

/**
 * 業種別LP（/subscription/* 配下）で使う JEMIA 共通ヘッダー/フッター。
 * ポータル共通チェーンは ChromeSwitch が /subscription 配下で非表示にするため、
 * ブランドのヘッダー/フッターはこのコンポーネントで付与する。
 * リンクのみのためサーバーコンポーネントで動作。
 */
const C = "#FF6633";

export function JemiaHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link href="/subscription" className={styles.headerLogo}>
          JEM<span style={{ color: C }}>I</span>A
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/subscription/blog" style={{ fontSize: 13, fontWeight: 700, color: "#555555", textDecoration: "none", whiteSpace: "nowrap" }}>お役立ち記事</Link>
          <Link href="/subscription/corporate" className={styles.hideSmall} style={{ fontSize: 13, fontWeight: 700, color: "#555555", textDecoration: "none", whiteSpace: "nowrap" }}>法人</Link>
          <Link
            href="/subscription#plans"
            className={styles.headerCta}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            料金・相談
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function JemiaFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 900, fontSize: 20, color: "#fff" }}>
          JEM<span style={{ color: C }}>I</span>A
        </span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
        Instagram運用を、もっと自由に。もっとスマートに。
      </div>
      <div style={{ marginBottom: 16 }}>
        <Link href="/subscription" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", margin: "0 12px", fontSize: 13 }}>サービス概要</Link>
        <Link href="/subscription/corporate" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", margin: "0 12px", fontSize: 13 }}>法人のお客様</Link>
        <Link href="/subscription/diagnosis" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", margin: "0 12px", fontSize: 13 }}>プラン診断</Link>
      </div>
      <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 株式会社ホットセラー. All rights reserved.</div>
    </footer>
  );
}
