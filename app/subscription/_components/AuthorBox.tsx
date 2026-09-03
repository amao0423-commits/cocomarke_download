// 記事の執筆者プロフィール（全ブログ記事で共通利用）。
// 執筆者は個人名ではなく編集部名義で統一する。
export const AUTHOR = {
  name: "JEMIA編集部",
  org: "JEMIA運営局",
  byline: "JEMIA編集部",
  bio: "JEMIA運営局の編集・コンテンツ担当チーム。Instagramを中心としたSNS運用支援の現場に携わり、店舗・個人事業主のアカウント改善やおすすめ・発見タブ攻略の企画・分析を担当。「良いものが正しく見つけてもらえる」運用の考え方を、できるだけわかりやすく発信することを大切にしています。",
};

export function AuthorBox() {
  return (
    <aside className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 [text-wrap:pretty]">
      <p className="text-xs font-medium text-slate-500">執筆者</p>
      <p className="mt-1 text-base font-bold text-slate-900">
        {AUTHOR.name}
      </p>
      <p className="mt-3 text-sm leading-loose text-slate-600">{AUTHOR.bio}</p>
    </aside>
  );
}
