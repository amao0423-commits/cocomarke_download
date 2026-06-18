import type { MetadataRoute } from "next";

const BASE = "https://www.cocomake-guide.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 管理画面・APIはクロール対象外（サンクス等の noindex は各ページ側で指定済み）
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
