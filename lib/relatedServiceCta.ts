/**
 * 資料ごとの「関連サービスCTA」出し分け（design doc 案3a / 対応表 準拠）。
 * 誘導先は公式サイトのトップではなく、資料内容に最も近いページへ送る。
 * 追加・変更はこの RULES を編集する（コードベースのマッピング方式）。
 */
export type RelatedServiceCta = {
  badge: string;
  heading: string;
  description: string;
  ctaLabel: string;
  href: string;
};

type Rule = { test: RegExp; cta: RelatedServiceCta };

const RULES: Rule[] = [
  {
    // Instagramアルゴリズム攻略ガイド → 最新アルゴリズムの記事
    test: /アルゴリズム/,
    cta: {
      badge: '関連記事',
      heading: '最新アルゴリズムの変更点と対応',
      description: 'アルゴリズムの最新動向と、対応のポイントを記事で解説しています。',
      ctaLabel: '最新アルゴリズムの記事を見る',
      href: 'https://www.cocomarke.com/blog/instagram-algorithm-update-latest/',
    },
  },
  {
    // なぜSNSは売上につながらないのか → 業種別の導入事例記事
    test: /売上|つながらない|集客/,
    cta: {
      badge: '導入事例',
      heading: '売上・来店につながった支援事例',
      description: '不動産・アパレル・EC・飲食など、業種別に成果につながった事例を記事で公開しています。',
      ctaLabel: '売上・来店につながった支援事例を見る',
      href: 'https://www.cocomarke.com/blog/instagram-realestate-marketing/',
    },
  },
  {
    // 土台構築＆コンテンツ最適化 → 無料アカウント診断（自社提供サービス）
    test: /土台|基礎|コンテンツ最適化|再現性/,
    cta: {
      badge: '無料アカウント診断',
      heading: '自社アカウントの改善点を無料で確認',
      description: '1回の入力で、伸びていない原因と次の一手を無料で診断します。',
      ctaLabel: '自社アカウントの改善点を無料で確認する',
      href: '/analysis',
    },
  },
  {
    // Meta / Facebook 広告 → Facebook広告の始め方の記事（広告運用サービスは非提供）
    test: /Meta広告|Facebook|広告/,
    cta: {
      badge: '関連記事',
      heading: 'Facebook・Instagram広告の始め方',
      description: 'Facebook / Instagram 広告の始め方と考え方を記事で解説しています。',
      ctaLabel: 'Facebook広告の記事を見る',
      href: 'https://www.cocomarke.com/blog/facebook-ads-guide-how-to-start/',
    },
  },
  {
    // エンゲージメント強化 / 拡散・運用編 → 運用代行（自社提供サービス）
    test: /エンゲージ|拡散|運用編/,
    cta: {
      badge: '関連サービス',
      heading: 'Instagram運用代行サービス',
      description: 'アカウント設計から投稿制作・運用改善まで、一貫してお任せいただけます。',
      ctaLabel: 'Instagram運用代行サービスを見る',
      href: 'https://www.cocomarke.com/',
    },
  },
  {
    // COCOマーケ サービス概要 → 料金・導入事例
    test: /サービス概要|COCOマーケ/,
    cta: {
      badge: '料金・導入事例',
      heading: '料金と支援プランを確認する',
      description: '運用代行・伴走支援の費用感と導入事例をまとめてご確認いただけます。',
      ctaLabel: '料金と支援プランを確認する',
      href: 'https://www.cocomarke.com/',
    },
  },
];

/** どのルールにも当たらない資料向けの既定CTA */
const DEFAULT_CTA: RelatedServiceCta = {
  badge: 'プロに任せるという選択肢',
  heading: 'Instagram運用をプロに相談する',
  description: '足りていない改善ポイントの洗い出しから運用まで、COCOマーケが伴走します。',
  ctaLabel: '無料でアカウント診断を受ける',
  href: '/analysis',
};

export function getRelatedServiceCta(title: string | null | undefined): RelatedServiceCta {
  const t = (title ?? '').trim();
  if (t) {
    for (const r of RULES) if (r.test.test(t)) return r.cta;
  }
  return DEFAULT_CTA;
}
