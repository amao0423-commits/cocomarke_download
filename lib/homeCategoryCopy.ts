/** ジャンル別の見出し・説明（HOME のカード風エリア用） */

export const HOME_CATEGORY_COPY: Record<

  string,

  { headline: string; description: string }

> = {

  Instagram運用のノウハウ集: {

    headline: 'Instagram運用のヒントがまとまった資料集',

    description:

      '投稿の設計や運用の見直し、成果につなげるためのノウハウが揃っています。',

  },

  最新アルゴリズム調査レポート: {

    headline: 'アルゴリズムの最新動向を整理したレポート',

    description:

      '仕様の変化や傾向を押さえ、日々の運用判断に活かせる内容です。',

  },

  サービス関連: {

    headline: 'サービス概要・ご案内',

    description: 'cocomarkeの支援内容や進め方がわかる資料です。',

  },

};



export function getHomeCategoryCopy(categoryName: string): {

  headline: string;

  description: string;

} {

  return (

    HOME_CATEGORY_COPY[categoryName] ?? {

      headline: categoryName,

      description: 'このジャンルの資料一覧です。',

    }

  );

}

