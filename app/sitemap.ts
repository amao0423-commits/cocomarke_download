import type { MetadataRoute } from "next";

const BASE = "https://www.cocomake-guide.com";

// インデックス対象の公開ページ。admin / *thanks / contact フォーム / api は除外。
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/subscription", priority: 0.9, changeFrequency: "weekly" },
  { path: "/subscription/diagnosis", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subscription/corporate", priority: 0.7, changeFrequency: "monthly" },
  { path: "/subscription/restaurant", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subscription/salon", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subscription/esthetic", priority: 0.8, changeFrequency: "monthly" },
  { path: "/shindan.html", priority: 0.8, changeFrequency: "monthly" },
  { path: "/analysis", priority: 0.6, changeFrequency: "monthly" },
  { path: "/download", priority: 0.6, changeFrequency: "monthly" },
  { path: "/servicedocument", priority: 0.6, changeFrequency: "monthly" },
  { path: "/restaurant-diagnosis", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
