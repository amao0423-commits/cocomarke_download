import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        /* =========================================================
           整理後トークン（実体は globals.css の :root 変数）
           色を変えるときは globals.css の :root を編集する。
           ========================================================= */

        /* --- ブランド主要色 --- */
        navy: {
          DEFAULT: "var(--color-navy)",
          hover: "var(--color-navy-hover)",
        },
        accent: "var(--color-accent)",

        /* --- 背景・面 --- */
        bg: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          soft: "var(--color-surface-soft)",
        },

        /* --- テキスト --- */
        text: {
          DEFAULT: "var(--color-text)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },

        /* --- 罫線 --- */
        border: "var(--color-border)",

        /* --- 用途特化（淡色面） --- */
        "mint-soft": "var(--color-mint-soft)",
        "lavender-soft": "var(--color-lavender-soft)",
        "neutral-soft": "var(--color-neutral-soft)",

        /* --- 診断系で温度感 --- */
        grade: {
          positive: "var(--color-grade-positive)",
        },
        instagram: {
          blue: "var(--color-instagram-blue)",
          pink: "var(--color-instagram-pink)",
        },

        /* =========================================================
           旧エイリアス（後方互換・第三段階では消さない）
           既存コードの className が壊れないよう、すべて新トークンへ向ける。
           黒(#1a1a1a)系は移行どおり navy(#01408D) に寄せておく。
           grep で参照ゼロを確認し次第、順次このブロックを削っていく。
           ========================================================= */
        "cocomarke-navy": "var(--color-navy)",
        "cocomarke-black": "var(--color-navy)",
        page: "var(--color-bg)",
        design: {
          primary: "var(--color-navy)",
          "primary-hover": "var(--color-navy-hover)",
          "text-primary": "var(--color-text)",
          "text-secondary": "var(--color-text-secondary)",
          "text-muted": "var(--color-text-muted)",
          border: "var(--color-border)",
          "bg-page": "var(--color-bg)",
          "bg-sub": "var(--color-surface-soft)",
          surface: "var(--color-surface)",
          "surface-soft": "var(--color-surface-soft)",
          "surface-hover": "var(--color-bg)",
          "outline-border": "var(--color-border)",
          "outline-hover": "var(--color-neutral-soft)",
          "accent-blue-soft": "var(--color-neutral-soft)",
          "accent-mint-soft": "var(--color-mint-soft)",
          "accent-lavender-soft": "var(--color-lavender-soft)",
          accent: "var(--color-accent)",
        },
      },
      backgroundImage: {
        "instagram-gradient":
          "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        "coco-hero-mesh":
          "radial-gradient(ellipse 85% 65% at 20% 15%, rgba(245, 245, 245, 0.95) 0%, transparent 58%), radial-gradient(ellipse 75% 55% at 85% 20%, rgba(241, 245, 249, 0.65) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 40%, rgba(229, 231, 235, 0.45) 0%, transparent 52%)",
        "coco-library-wash":
          "linear-gradient(180deg, rgba(252, 252, 251, 0) 0%, rgba(247, 248, 250, 0.85) 50%, rgba(241, 245, 249, 0.35) 100%)",
        "coco-cta-wash":
          "linear-gradient(165deg, rgba(247, 248, 250, 0.95) 0%, rgba(252, 252, 251, 0.98) 50%, rgba(243, 244, 246, 0.4) 100%)",
        "coco-mesh-wash":
          "radial-gradient(ellipse 120% 95% at 50% -8%, rgba(241, 245, 249, 0.45) 0%, transparent 58%), radial-gradient(ellipse 90% 75% at 10% 42%, rgba(229, 231, 235, 0.35) 0%, transparent 62%), radial-gradient(ellipse 85% 72% at 92% 28%, rgba(228, 228, 231, 0.28) 0%, transparent 60%), radial-gradient(ellipse 75% 60% at 78% 78%, rgba(245, 245, 246, 0.22) 0%, transparent 64%), radial-gradient(ellipse 70% 58% at 28% 88%, rgba(229, 231, 235, 0.18) 0%, transparent 68%)",
      },
      boxShadow: {
        "design-soft":
          "0 1px 2px rgba(31, 41, 55, 0.04), 0 6px 20px -4px rgba(31, 41, 55, 0.06)",
        "design-soft-hover":
          "0 2px 4px rgba(31, 41, 55, 0.05), 0 10px 24px -6px rgba(31, 41, 55, 0.07)",
        "design-saas-card":
          "0 2px 8px rgba(15, 23, 42, 0.04), 0 8px 32px rgba(15, 23, 42, 0.06), 0 24px 48px -12px rgba(15, 23, 42, 0.05)",
        "design-saas-card-hover":
          "0 6px 16px rgba(15, 23, 42, 0.06), 0 14px 40px rgba(15, 23, 42, 0.08), 0 28px 56px -8px rgba(15, 23, 42, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
