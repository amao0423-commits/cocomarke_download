import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/navigation/Footer";
import { DiagnosisOverlay } from "@/components/DiagnosisOverlay";
import "./globals.css";

/** ヘッダーを別チャンクに分け、開発時の layout チャンク取得タイムアウトを減らす */
const Header = dynamic(() => import("@/components/Header"), {
  ssr: true,
  loading: () => (
    <div
      className="sticky top-0 z-50 min-h-[4rem] !bg-white shadow-none transition-all duration-300"
      aria-hidden
    />
  ),
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "cocomarke ポータル",
  description: "アカウント分析・サービス資料のポータル",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} min-h-screen font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <DiagnosisOverlay />
      </body>
    </html>
  );
}
