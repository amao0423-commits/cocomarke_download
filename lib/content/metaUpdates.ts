/**
 * Instagram / Meta 仕様変更タイムラインのコンテンツデータ。
 * 設置先: app/reference/meta-updates/（SEO評価の集約先メインに置くこと）
 *
 * ▼ このファイルの原則（2026.09.04 全件検証時に確立）
 * 1. すべてのエントリは一次ソースURL付きで掲載する。URLを確認できないもの、
 *    出来事の実在自体を確認できないものは掲載しない（推測でURLを入れない）。
 * 2. date / year は「一次ソースが公表された日付」に合わせる。二次メディアの
 *    記事日や、機能が広く行き渡った時期ではない。
 * 3. verify の使い分け
 *    official  = Meta / Instagram / 所管官庁の一次発表を確認済み
 *    observed  = 公式発表はないが、信頼できる報道・広範な報告がある
 *    unverified= 一次ソースが弱く、内容の一部が裏取りできていない
 * 4. 公式ソースに書かれていない数値（価格・比率など）は本文に書かない。
 *    二次メディアのみが報じている値は「公式未公表」と明記する。
 *
 * ▼ 更新運用
 * 週1回: Meta Newsroom / Meta for Developers チェンジログ / @mosseri を確認
 * 月1回: その月の追加分を note にまとめ本ページへ誘客
 * 追加時は必ず一次ソースURLをその場で開いて日付と内容を確認してから書くこと。
 */

export type ImpactLevel = "high" | "mid" | "low";
export type VerifyStatus = "official" | "observed" | "unverified";
export type UpdateCategory = "algo" | "ui" | "feature" | "policy" | "ads" | "api";

export type MetaUpdateSource = {
  label: string;
  href: string;
  /** true の間はリンク無効・「一次ソースURL未設定です」トーストを表示 */
  todo: boolean;
};

export type MetaUpdateEntry = {
  id: string;
  date: string;
  year: "2026" | "2025" | "2024" | "2023";
  cat: UpdateCategory;
  impact: ImpactLevel;
  verify: VerifyStatus;
  title: string;
  changeBody: string;
  impactBody: string;
  sources: MetaUpdateSource[];
};

export const LAST_UPDATED = "2026.09.04";

export const CATEGORY_LABELS: Record<UpdateCategory, string> = {
  algo: "アルゴリズム",
  ui: "表示・UI",
  feature: "機能追加",
  policy: "規約・停止リスク",
  ads: "広告・課金",
  api: "API・計測",
};

export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  high: "影響度 大",
  mid: "影響度 中",
  low: "影響度 小",
};

export const VERIFY_LABELS: Record<VerifyStatus, string> = {
  official: "公式発表",
  observed: "観測情報",
  unverified: "要検証",
};

function src(label: string, href = "#"): MetaUpdateSource {
  return { label, href, todo: href === "#" };
}

export const META_UPDATE_ENTRIES: MetaUpdateEntry[] = [
  // ===================== 2026 =====================
  {
    id: "e-2026-08-ai-profile-label",
    date: "2026.08.31",
    year: "2026",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "AI生成プロフィールのラベル義務化と、未表示時のリーチ制限",
    changeBody:
      "従来の「AI Creator」ラベルが「AI-generated profile」に改称。AIで生成した人物を主体とするプロフィールでラベルを付けていない場合、リーチが制限されおすすめの対象から外れます。状態はAccount Statusで確認でき、異議申し立ても可能です。",
    impactBody:
      "AIキャラクターを人格として運用している場合はラベル付けが必要です。画像生成やキャプション整形にAIを使う程度の運用は対象外と明記されています。",
    sources: [
      src(
        "Instagram Creators 公式ブログ",
        "https://creators.instagram.com/blog/ai-generated-profile-label"
      ),
    ],
  },
  {
    id: "e-2026-08-teen-ag-agreement",
    date: "2026.08.27",
    year: "2026",
    cat: "policy",
    impact: "low",
    verify: "official",
    title: "米州司法長官との和解が裁判所承認により発効（10代保護）",
    changeBody:
      "米国52州の司法長官との和解が承認され、米国内の18歳未満に対し1日2時間の既定上限、深夜0〜6時のNight Mode、8〜15時の通知ミュート、非アルゴリズムフィードの既定化、いいね数非表示が適用されます。",
    impactBody:
      "対象は米国内の未成年のみで、日本の法人アカウントへの直接影響はほぼありません。Metaが既定値をどう動かすかの方向性として観測価値があります。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2026/08/agreement-with-state-attorneys-general-supporting-teens/"
      ),
    ],
  },
  {
    id: "e-2026-08-fb-login-fast-switch",
    date: "2026.08.27",
    year: "2026",
    cat: "api",
    impact: "low",
    verify: "official",
    title: "Facebookログインの Fast App Switch が既定で有効化",
    changeBody:
      "iOS SDK 18.1.1以降、ログインがアプリ内ブラウザではなくFacebookアプリへのネイティブ切り替えに変わります（18.0.3以降デフォルトON）。Info.plist の LSApplicationQueriesSchemes に fbauth2 の追加が必要です。",
    impactBody:
      "自社アプリ・サイトでFacebookログインを使っている場合のみ影響します。未対応だとログイン導線が壊れる可能性があります。Instagram運用そのものへの影響はありません。",
    sources: [
      src(
        "Meta for Developers Blog",
        "https://developers.facebook.com/blog/post/2026/08/27/new-from-facebook-login-beta/"
      ),
    ],
  },
  {
    id: "e-2026-08-business-agent-token",
    date: "2026.08.01",
    year: "2026",
    cat: "ads",
    impact: "high",
    verify: "official",
    title: "Meta Business Agent のトークン従量課金を開始",
    changeBody:
      "無料試用期間が終了し、100万トークンあたり2.00ドルの従量課金へ移行。WhatsApp・Instagram・MessengerでAIが処理するすべての会話が課金対象になります。",
    impactBody:
      "DM自動応答を導入している運用では、会話量に比例してコストが増えるため、月額の再試算が必要です。",
    sources: [
      src(
        "Meta for Developers（料金ドキュメント）",
        "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages"
      ),
    ],
  },
  {
    id: "e-2026-06-business-agent",
    date: "2026.06.03",
    year: "2026",
    cat: "feature",
    impact: "high",
    verify: "official",
    title: "企業向けAI「Meta Business Agent」を発表",
    changeBody:
      "WhatsApp・Instagram・Messengerでの顧客対応を自動化するAIエージェント。",
    impactBody:
      "DM対応を人力で回している運用は、自動化の範囲と有人対応の線引きを設計し直す判断材料です。",
    sources: [
      src("Meta Newsroom", "https://about.fb.com/news/2026/06/meta-business-agent/"),
    ],
  },
  {
    id: "e-2026-06-instagram-plus",
    date: "2026.06.05",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "official",
    title: "Instagram Plus を日本を含む各国で提供開始",
    changeBody:
      "ストーリーズの追加機能などが利用できる個人向け有料プラン。Meta公式は「本日から正式に日本を含む世界各国で提供開始」と発表していますが、月額料金は公式ページに記載がなく「アプリ上で確認」とされています。",
    impactBody:
      "直接の運用影響は限定的ですが、Instagram全体が課金前提の設計へ移行していく流れの起点として押さえておきたい項目です。",
    sources: [
      src(
        "Meta Newsroom（日本語）",
        "https://about.fb.com/ja/news/2026/06/introducing-instagram-plus/"
      ),
    ],
  },
  {
    id: "e-2026-05-instants",
    date: "2026.05.13",
    year: "2026",
    cat: "feature",
    impact: "low",
    verify: "official",
    title: "無加工写真を共有する「Instants」と専用アプリを提供",
    changeBody:
      "その場で撮影した写真を加工なしで共有する機能。専用アプリが一部の国のiOS・Androidで順次提供されます。",
    impactBody:
      "法人アカウントでの活用余地は小さいものの、作り込まれていない発信が重視される方向の表れとして押さえておきたい項目です。",
    sources: [
      src("Meta Newsroom", "https://about.fb.com/news/2026/05/instants-share-in-the-moment/"),
    ],
  },
  {
    id: "e-2026-04-medical-ad-guideline",
    date: "2026.04.01",
    year: "2026",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "改正 医療広告等ガイドライン 施行",
    changeBody:
      "令和8年3月30日最終改正版が4月1日に施行。オンライン診療受診施設という新業態への対応と、SNS・動画広告の規制強化が柱です。診療内容への言及と受診を促す意図が重なる投稿は、SNSであっても医療広告として規制対象になります。改正で正式名称が「医療広告等ガイドライン」に変わりました。",
    impactBody:
      "美容・クリニック系アカウントを扱う場合、投稿本文だけでなくプロフィール・動画のテロップ・音声・概要欄まで確認範囲を広げる必要があります。",
    sources: [
      src("厚生労働省 医療広告等ガイドライン", "https://www.mhlw.go.jp/content/001683594.pdf"),
      src("事例解説書（第6版）", "https://www.mhlw.go.jp/content/001683116.pdf"),
    ],
  },
  {
    id: "e-2026-04-threads-api",
    date: "2026.04.14",
    year: "2026",
    cat: "api",
    impact: "mid",
    verify: "official",
    title: "Threads API を拡張（プロフィール発見の閾値緩和・返信承認など）",
    changeBody:
      "ブランド・クリエイター向けにテキスト添付（1万字）、oEmbed、ユーザー名/メディア種別での検索、返信承認、Webhooks に対応。プロフィール発見機能の閾値が1,000フォロワーから100フォロワーへ緩和されました。",
    impactBody:
      "Threadsを外部ツールから運用・計測する場合の選択肢が広がります。アプリ内のビジネス向け機能追加ではなく、開発者向けAPIの更新です。",
    sources: [
      src(
        "Meta for Developers Blog",
        "https://developers.facebook.com/blog/post/2026/04/14/whats-new-in-the-threads-api/"
      ),
    ],
  },
  {
    id: "e-2026-03-medical-ad-revision",
    date: "2026.03.30",
    year: "2026",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "医療広告等ガイドラインが最終改正（本体・Q&A・事例解説書を同時更新）",
    changeBody:
      "ガイドライン本体、Q&A、事例解説書（第6版）の3文書が同時に更新されました。第6版では自由診療における限定解除要件を満たしていない事例などが拡充されています。",
    impactBody:
      "施行前に社内チェック体制を更新するための起点となる日付です。3文書はセットで参照してください。",
    sources: [
      src(
        "厚生労働省 公式ページ",
        "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryou/kokokukisei/index.html"
      ),
    ],
  },
  {
    id: "e-2026-02-marketing-api-v25",
    date: "2026.02.18",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "official",
    title: "Marketing API v25.0 以降で ASC / AAC の作成・更新が不可に",
    changeBody:
      "グラフAPI v25.0・マーケティングAPI v25.0の公開に伴い、Advantage+ショッピングキャンペーン（ASC）とAdvantage+アプリキャンペーン（AAC）をMarketing APIから作成・更新できなくなりました。「Advantage+ セールスキャンペーン」への名称変更と構造変更自体は2025年に実施済みです。",
    impactBody:
      "APIやツール経由でASCを運用している場合は移行が必要です。広告マネージャー上のUI変更とは別件として扱ってください。",
    sources: [
      src(
        "Meta for Developers Blog",
        "https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25/"
      ),
    ],
  },

  // ===================== 2025 =====================
  {
    id: "e-2025-12-hashtag-limit",
    date: "2025.12.18",
    year: "2025",
    cat: "algo",
    impact: "high",
    verify: "official",
    title: "ハッシュタグ数が1投稿あたり5個までに制限",
    changeBody:
      "Instagram公式アカウント @creators が「Starting today, Instagram will allow up to 5 hashtags in a reel or post.」と告知。汎用的なタグを多数付けるより、絞ったタグの方がパフォーマンスと体験の双方に良いと説明しています。",
    impactBody:
      "タグの物量でリーチを稼ぐ運用が成立しなくなります。投稿内容そのものとテーマの一貫性に評価が移っています。",
    sources: [
      src("Instagram @creators 公式投稿", "https://www.threads.com/@creators/post/DSalXGPCWM4/"),
    ],
  },
  {
    id: "e-2025-10-pg13",
    date: "2025.10.14",
    year: "2025",
    cat: "policy",
    impact: "mid",
    verify: "official",
    title: "10代アカウントに映画の「PG-13」に相当する基準を導入",
    changeBody:
      "10代アカウントに表示されるコンテンツの基準として、映画の年齢区分に準じた考え方が導入されました。Metaは米国映画協会（MPA）の公開ガイドラインを参考にしたが、MPAとの協業ではないと明記しています。",
    impactBody:
      "美容・医療・アルコールなど年齢層に配慮が必要な業種は、リーチ対象が絞られる可能性があります。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2025/10/instagram-teen-accounts-pg-13-ratings/"
      ),
    ],
  },
  {
    id: "e-2025-10-meta-ai-signal",
    date: "2025.10.01",
    year: "2025",
    cat: "ads",
    impact: "mid",
    verify: "official",
    title: "Meta AI との対話内容を広告・おすすめのシグナルに追加",
    changeBody:
      "ユーザーの過去の行動に加え、Meta AIとの対話内容がおすすめと広告配信のシグナルとして使われます。2025年12月16日から適用されました。",
    impactBody:
      "属性ターゲティングの相対的な価値がさらに下がり、クリエイティブの本文と質に重心を寄せるべき判断材料になります。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2025/10/improving-your-recommendations-apps-ai-meta/"
      ),
    ],
  },
  {
    id: "e-2025-08-threads-mau",
    date: "2025.08.12",
    year: "2025",
    cat: "feature",
    impact: "low",
    verify: "official",
    title: "Threads の月間アクティブ利用者数が4億人に",
    changeBody:
      "Adam Mosseri氏がThreadsで「more than 400 million people active on Threads every month」と公表。日本国内のMAUは公式数値が未公表です。",
    impactBody:
      "参入判断の材料となる規模の数字です。国内数値がない点を含めて提案文に反映してください。",
    sources: [
      src("Adam Mosseri 公式投稿", "https://www.threads.com/@mosseri/post/DNQuTFlCV9P/"),
    ],
  },
  {
    id: "e-2025-06-mass-suspension",
    date: "2025.06.16",
    year: "2025",
    cat: "policy",
    impact: "high",
    verify: "observed",
    title: "アカウント停止・凍結の報告が急増",
    changeBody:
      "明確な違反の心当たりがないまま停止されたという報告が世界的に増加。TechCrunchはChange.orgの署名が4,000件を超えたことなどを報じましたが、AIが原因という直接的な証拠はなく、Metaも当時この問題を公式には認めていません。",
    impactBody:
      "停止は代行・自社運用を問わず起こり得ます。投稿データの外部バックアップと、異議申し立て手順の社内文書化を推奨します。",
    sources: [
      src(
        "TechCrunch（報道）",
        "https://techcrunch.com/2025/06/16/instagram-users-complain-of-mass-bans-pointing-finger-at-ai/"
      ),
    ],
  },
  {
    id: "e-2025-04-threads-ads",
    date: "2025.04.23",
    year: "2025",
    cat: "ads",
    impact: "high",
    verify: "official",
    title: "Threads広告が全世界の広告主に拡大。Meta広告マネージャーから配信可能に",
    changeBody:
      "2025年1月に米国・日本の一部でテストを開始し、4月23日に要件を満たす全世界の広告主へ拡大。Advantage+または手動配置で新規キャンペーンを作成すると、Threadsフィードがデフォルトで含まれます。",
    impactBody:
      "新しい配信面が1つ増える形です。Advantage+の自動配置に含まれるため、意図しない配信をしていないか確認してください。",
    sources: [
      src("Meta Newsroom（日本語）", "https://about.fb.com/ja/news/2025/01/ads-for-threads/"),
    ],
  },
  {
    id: "e-2025-04-edits",
    date: "2025.04.22",
    year: "2025",
    cat: "feature",
    impact: "mid",
    verify: "official",
    title: "Instagram公式の動画編集アプリ「Edits」を提供開始",
    changeBody:
      "リール制作向けの公式編集アプリ。アプリ内からInstagram・Facebookへ直接共有でき、書き出してもウォーターマークが付きません。",
    impactBody:
      "他社ロゴが残った動画はリールが伸びにくいとされているため、編集フローの標準を見直す価値があります。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2025/04/introducing-edits-streamlined-video-creation-app/"
      ),
    ],
  },
  {
    id: "e-2025-03-dental-clinic-order",
    date: "2025.03.18",
    year: "2025",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "口コミ投稿を条件に割引を提供した歯科医院に、ステマ告示違反で措置命令",
    changeBody:
      "歯列矯正の診療所が、星5のクチコミ投稿を条件に5,000円分のQUOカード提供または治療費の5,000円割引を伝えていた行為に対し、消費者庁が景品表示法第5条第3号（ステマ告示）該当として措置命令を出しました。違法とされたのは割引の提供自体ではなく、事業者の表示であることを明瞭にしなかった点です。",
    impactBody:
      "ステマ規制の措置対象は広告主（事業者）です。口コミ・レビューの獲得施策を設計している場合、対価と投稿を結びつける導線がないか点検してください。",
    sources: [
      src("消費者庁 措置命令", "https://www.caa.go.jp/notice/entry/041364/"),
    ],
  },
  {
    id: "e-2025-01-ranking-signals",
    date: "2025.01.22",
    year: "2025",
    cat: "algo",
    impact: "high",
    verify: "official",
    title: "Mosseri氏がランキングの主要シグナルを解説する動画シリーズを公開",
    changeBody:
      "視聴時間・いいね・送信数という主要ランキング指標の優先度を説明。フィード・ストーリーズ・発見タブ・リールがそれぞれ独立したルールで動作することが示されました。なお2023年5月公開の公式ページ「Instagram Ranking Explained」は別文書です。",
    impactBody:
      "評価の中心が保存・送信（DMシェア）へ移りました。「誰かに送りたくなるか」を投稿設計の基準に置き換える必要があります。",
    sources: [
      src(
        "Instagram公式ブログ（Ranking Explained）",
        "https://about.instagram.com/blog/announcements/instagram-ranking-explained"
      ),
    ],
  },
  {
    id: "e-2025-01-grid-34",
    date: "2025.01.19",
    year: "2025",
    cat: "ui",
    impact: "high",
    verify: "official",
    title: "プロフィールグリッドが正方形から縦長へ変更",
    changeBody:
      "1月中旬から順次適用。Mosseri氏はThreadsで「アップロードされる写真・動画の多くが縦向きなので、長方形の方がうまく見せられる」と説明しています。3:4という具体的な比率はMeta公式の記載ではなく第三者計測に基づく値です。",
    impactBody:
      "複数投稿をまたぐグリッドデザインを組んでいるアカウントは表示が崩れます。以降の投稿は縦長基準での制作が安全です。",
    sources: [
      src("Adam Mosseri 公式投稿", "https://www.threads.com/@mosseri/post/DFBmsT0SKO6"),
    ],
  },

  // ===================== 2024 =====================
  {
    id: "e-2024-12-basic-display-end",
    date: "2024.12.04",
    year: "2024",
    cat: "api",
    impact: "high",
    verify: "official",
    title: "Instagram Basic Display API が提供終了",
    changeBody:
      "外部アプリが個人アカウントのデータを取得できなくなります。ビジネス・クリエイターアカウントは Instagram Graph API で引き続き取得可能です。",
    impactBody:
      "自社サイトにInstagramフィードを取り込んでいる場合、連携が切れて更新が止まっている可能性があります。プラグイン・ツールの接続状況を確認してください。",
    sources: [
      src(
        "Meta for Developers チェンジログ",
        "https://developers.facebook.com/docs/instagram-platform/changelog"
      ),
    ],
  },
  {
    id: "e-2024-12-trial-reels",
    date: "2024.12.10",
    year: "2024",
    cat: "feature",
    impact: "mid",
    verify: "official",
    title: "トライアルリールの提供開始",
    changeBody:
      "フォロワー以外にだけ配信してテストできる機能。約24時間後にリールビューアーで閲覧数・いいね数・コメント数・シェア数が確認できます。",
    impactBody:
      "既存フォロワーの反応を求めずに新しい切り口を試せます。企画検証のコストを大きく下げる機能です。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/"
      ),
    ],
  },
  {
    id: "e-2024-10-carousel-music",
    date: "2024.10.17",
    year: "2024",
    cat: "algo",
    impact: "mid",
    verify: "official",
    title: "音楽付きの写真・カルーセルがリールタブにも表示されるように",
    changeBody:
      "Instagram公式アカウント @creators が「photos and carousels with music are now eligible to appear in the Reels tab」と告知しました。",
    impactBody:
      "静止画中心の運用でも、動画面へのリーチ機会を得られます。既存カルーセルの再設計で対応可能です。",
    sources: [
      src("Instagram @creators 公式投稿", "https://www.threads.com/@creators/post/DBO9JuXxMBJ"),
    ],
  },
  {
    id: "e-2024-09-basic-display-notice",
    date: "2024.09.04",
    year: "2024",
    cat: "api",
    impact: "mid",
    verify: "official",
    title: "Basic Display API の終了を開発者向けブログで告知",
    changeBody:
      "12月4日をもって提供を終了する旨が公式に発表され、90日の移行期間が案内されました。",
    impactBody:
      "API系の変更はMeta for Developersのチェンジログにのみ出ます。SNS運用の情報源とは別に監視対象に含める必要があります。",
    sources: [
      src(
        "Meta for Developers Blog",
        "https://developers.facebook.com/blog/post/2024/09/04/update-on-instagram-basic-display-api/"
      ),
    ],
  },
  {
    id: "e-2024-04-aggregator",
    date: "2024.04.30",
    year: "2024",
    cat: "algo",
    impact: "high",
    verify: "official",
    title: "再投稿中心の「アグリゲーター」をおすすめ対象から除外",
    changeBody:
      "直近30日間に他者のコンテンツを10回以上投稿しているアカウントを「アグリゲーター」として扱い、おすすめ面に表示しない仕組みが導入されました。2026年4月30日には対象が写真・カルーセルにも拡大されています。",
    impactBody:
      "まとめ系・キュレーション系の運用は構造的に不利になります。オリジナル比率の管理が必要です。",
    sources: [
      src(
        "Instagram Creators 公式ブログ",
        "https://creators.instagram.com/blog/recommendations-and-originality"
      ),
    ],
  },

  // ===================== 2023 =====================
  {
    id: "e-2023-10-stealth-marketing",
    date: "2023.10.01",
    year: "2023",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "ステルスマーケティング規制 施行（景品表示法 指定告示）",
    changeBody:
      "事業者が自らの表示であることを消費者に判別困難にした表示が、景品表示法上の不当表示として規制対象になりました。",
    impactBody:
      "措置命令の対象は投稿者ではなく広告主（事業者）です。インフルエンサー施策や口コミ獲得施策を実施する場合、PR表示の運用ルールを社内で確立しておく必要があります。",
    sources: [
      src(
        "消費者庁 指定告示・運用基準",
        "https://www.caa.go.jp/policies/policy/representation/fair_labeling/stealth_marketing"
      ),
    ],
  },
  {
    id: "e-2023-07-threads-launch",
    date: "2023.07.05",
    year: "2023",
    cat: "feature",
    impact: "mid",
    verify: "official",
    title: "Threads がリリース（Instagram連携前提の設計）",
    changeBody:
      "テキスト主体のSNS。Instagramチームが開発し、Instagramアカウントでログインして利用する設計です。",
    impactBody:
      "Instagramのフォロワー基盤をそのまま活用できるため、立ち上げコストが低い新しい導線として位置づけられます。",
    sources: [
      src(
        "Meta Newsroom",
        "https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/"
      ),
    ],
  },
];
