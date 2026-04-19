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
        "brand-sky": {
          light: "#60CEFC",
          DEFAULT: "#027EF7",
        },
        "cocomarke-yellow": "#fde047",
        "cocomarke-teal": "#38b2ac",
        "cocomarke-black": "#1a1a1a",
        "cocomarke-gray": "#e2e8f0",
        "cocomarke-navy": "#01408D",
        page: "#F9FAFB",
        accent: {
          DEFAULT: "#1a1a1a",
          muted: "#475569",
        },
        grade: {
          positive: "#059669",
          neutral: "#525252",
          negative: "#9CA3AF",
        },
        instagram: {
          blue: "#0095F6",
          pink: "#E1306C",
        },
        design: {
          primary: "#1a1a1a",
          "primary-hover": "#27272a",
          "text-primary": "#1F2937",
          "text-secondary": "#6B7280",
          "text-muted": "#9CA3AF",
          border: "#E5E7EB",
          "bg-page": "#FCFCFB",
          "bg-sub": "#F7F8FA",
          surface: "#FFFFFF",
          "surface-soft": "#F7F8FA",
          "surface-hover": "#F9FAFB",
          "outline-border": "#E5E7EB",
          "outline-hover": "#F3F4F6",
          "accent-blue-soft": "#F3F4F6",
          "accent-mint-soft": "#EAF8F1",
          "accent-lavender-soft": "#F2EEFF",
          accent: "#10B981",
        },
      },
      backgroundImage: {
        "brand-sky-gradient":
          "linear-gradient(180deg, #60CEFC 0%, #027EF7 100%)",
        "instagram-gradient":
          "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        "coco-hero-mesh":
          "radial-gradient(ellipse 85% 65% at 20% 15%, rgba(245, 245, 245, 0.95) 0%, transparent 58%), radial-gradient(ellipse 75% 55% at 85% 20%, rgba(241, 245, 249, 0.65) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 40%, rgba(229, 231, 235, 0.45) 0%, transparent 52%)",
        "coco-library-wash":
          "linear-gradient(180deg, rgba(252, 252, 251, 0) 0%, rgba(247, 248, 250, 0.85) 50%, rgba(241, 245, 249, 0.35) 100%)",
        "coco-cta-wash":
          "linear-gradient(165deg, rgba(247, 248, 250, 0.95) 0%, rgba(252, 252, 251, 0.98) 50%, rgba(243, 244, 246, 0.4) 100%)",
        /** Cycle 系：極淡いグレーのメッシュ（白ベース） */
        "coco-mesh-wash":
          "radial-gradient(ellipse 120% 95% at 50% -8%, rgba(241, 245, 249, 0.45) 0%, transparent 58%), radial-gradient(ellipse 90% 75% at 10% 42%, rgba(229, 231, 235, 0.35) 0%, transparent 62%), radial-gradient(ellipse 85% 72% at 92% 28%, rgba(228, 228, 231, 0.28) 0%, transparent 60%), radial-gradient(ellipse 75% 60% at 78% 78%, rgba(245, 245, 246, 0.22) 0%, transparent 64%), radial-gradient(ellipse 70% 58% at 28% 88%, rgba(229, 231, 235, 0.18) 0%, transparent 68%)",
      },
      boxShadow: {
        "design-soft":
          "0 1px 2px rgba(31, 41, 55, 0.04), 0 6px 20px -4px rgba(31, 41, 55, 0.06)",
        "design-soft-hover":
          "0 2px 4px rgba(31, 41, 55, 0.05), 0 10px 24px -6px rgba(31, 41, 55, 0.07)",
        /** SaaS カード：ニュートラルな広めの影 */
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
