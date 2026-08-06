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
    // Instagramアルゴリズム攻略ガイド → 運用代行
    test: /アルゴリズム/,
    cta: {
      badge: '関連サービス',
      heading: 'Instagram運用代行サービス',
      description: '最新アルゴリズムに対応した運用設計・改善を、プロが伴走して支援します。',
      ctaLabel: '最新アルゴリズムに対応した運用支援を見る',
      href: 'https://www.cocomarke.com/',
    },
  },
  {
    // なぜSNSは売上につながらないのか → 導入事例・集客導線
    test: /売上|つながらない|集客/,
    cta: {
      badge: '導入事例',
      heading: '売上・来店につながった支援事例',
      description: '不動産・アパレル・EC・飲食など、業種別に成果につながった事例を公開しています。',
      ctaLabel: '売上・来店につながった支援事例を見る',
      href: 'https://www.cocomarke.com/blog',
    },
  },
  {
    // 土台構築＆コンテンツ最適化 → 無料アカウント診断
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
    // エンゲージメント強化 / 拡散・運用編 → 運用代行
    test: /エンゲージ|拡散|運用編/,
    cta: {
      badge: '運用代行サービス',
      heading: '投稿制作から拡散まで任せる',
      description: 'アカウント設計から投稿制作・運用改善まで、一貫してお任せいただけます。',
      ctaLabel: '投稿制作から拡散まで任せる方法を見る',
      href: 'https://www.cocomarke.com/',
    },
  },
  {
    // Meta広告最新トレンド → Meta広告運用
    test: /Meta広告|広告/,
    cta: {
      badge: 'Meta広告・広告運用',
      heading: 'Meta広告の運用について相談する',
      description: 'Facebook / Instagram 広告の設計・運用を、成果ベースでサポートします。',
      ctaLabel: 'Meta広告の運用について相談する',
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
