import { applyEmailHtmlAssetUrls } from '@/lib/emailLogoUrl';

/** ロゴ行〜事業部名の行まで（内側テーブル続き＝メイン・フッター前） */
const BROADCAST_HTML_PREFIX = `<html lang="ja">
<head>
<meta charset="UTF-8">
<title>COCOマーケ 資料ダウンロード</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:40px 0;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
<tr>
<td style="padding-bottom:20px;">
<img src="{{emailLogoUrl}}" alt="COCOマーケ" width="200" style="display:block;max-width:220px;height:auto;border:0;outline:none;text-decoration:none;" />
</td>
</tr>
<tr>
<td style="font-size:18px;font-weight:bold;padding-bottom:20px;">
COCOマーケ マーケティング事業部
</td>
</tr>
`;

/** 固定フッター（連絡先〜 HTML 終端） */
const BROADCAST_HTML_FOOTER = `<tr>
<td style="border-top:1px solid #eeeeee;padding-top:25px;font-size:14px;line-height:1.8;">
<p><strong>■ COCOマーケ公式サイト</strong><br>
<a href="https://www.cocomarke.com/" style="color:#111;">https://www.cocomarke.com/</a>
</p>
<p><strong>■ Instagramマーケティング ノウハウ・運用戦略ブログ</strong><br>
<a href="https://www.cocomarke.com/blog" style="color:#111;">ブログはこちら</a>
</p>
<p><strong>■ お問い合わせ</strong><br>
<a href="https://lin.ee/8pdeegx" style="color:#111;">公式LINE（@cocomarke）</a><br>
<a href="https://www.cocomarke.com/contact" style="color:#111;">お問い合わせフォームはこちら</a>
</p>
<p style="font-size:12px;color:#888;margin-top:20px;">
※このメールにご返信いただいてもお答えすることができません。<br>
お問い合わせは上記リンクよりお願いいたします。<br>
※なお、弊社担当よりメールでご連絡させていただく場合もございます。
</p>
</td>
</tr>
<tr>
<td style="border-top:1px solid #eeeeee;padding-top:20px;font-size:12px;color:#888;">
COCOマーケ マーケティング事業部<br>
Mail：info@nishinippon-adv.jp<br>
（平日9:00〜18:00）
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
`;

function embedMainRows(mainBodyHtml: string): string {
  const t = mainBodyHtml.trim();
  if (!t) {
    return `<tr>
<td style="font-size:16px;line-height:1.8;padding-bottom:20px;">
</td>
</tr>
`;
  }
  if (t.toLowerCase().startsWith('<tr')) {
    return `${t}\n`;
  }
  return `<tr>
<td style="font-size:16px;line-height:1.8;padding-bottom:20px;">
${mainBodyHtml}
</td>
</tr>
`;
}

/** メイン HTML 断片に外枠・固定フッターを付与し、ロゴ等の URL を解決する */
export function buildBroadcastEmailHtml(mainBodyHtml: string): string {
  const raw = `${BROADCAST_HTML_PREFIX}${embedMainRows(mainBodyHtml)}${BROADCAST_HTML_FOOTER}`;
  return applyEmailHtmlAssetUrls(raw);
}
