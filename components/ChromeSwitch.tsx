"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * ポータル共通のヘッダー/フッター（チェーン）を出し分けるスイッチ。
 *
 * `/subscription` 配下は JEMIA LP 独自のヘッダー/フッターを使うため、
 * COCOマーケ ポータルの HeaderShell / Footer / DiagnosisOverlay を非表示にする。
 * HeaderShell は async サーバーコンポーネントのため、ここでは描画済みノードを
 * props で受け取り、表示可否のみクライアント側で判定する。
 */
export default function ChromeSwitch({
  header,
  footer,
  overlay,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  overlay: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/subscription") ?? false;

  return (
    <>
      {!bare && header}
      <main>{children}</main>
      {!bare && footer}
      {!bare && overlay}
    </>
  );
}
