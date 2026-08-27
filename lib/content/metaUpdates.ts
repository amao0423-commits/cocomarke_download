/**
 * Instagram / Meta 仕様変更タイムラインのコンテンツデータ。
 * 設置先: app/reference/meta-updates/（SEO評価の集約先メインに置くこと）
 *
 * ▼ 公開前に忘れないこと
 * 1. 各エントリの `sourceHref` に一次ソースURLを入れ、`sourceTodo: true` を外す
 *    （ページ上部の黄色いバーに一次ソース未設定件数が出ます。0件になれば
 *     バーは自動的に表示されなくなります）
 * 2. verify: "unverified" の項目を公式ソースで確認し、
 *    "official"（公式発表）または "observed"（観測情報）に振り分ける
 * 3. lastUpdated の日付を更新する（JSON-LD と表示の両方に反映される）
 * 4. Meta Business Suite の項目は現在ゼロ件です。管理画面の変更に気づいた
 *    時点で verify: "observed" として追記してください（公式発表がない領域
 *    なので、ここが最大の差別化ポイントになります）
 *
 * ▼ 更新運用
 * 週1回: Meta Newsroom / Meta for Developers チェンジログ / @mosseri を確認
 * 月1回: その月の追加分を note にまとめ本ページへ誘客
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

export const LAST_UPDATED = "2026.08.27";

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
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2026-07-meta-one-jp",
    date: "2026.07",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "official",
    title: "Meta One は日本国内では限定テスト段階（7月15日時点）",
    changeBody:
      "Meta公式は Meta One を限定テスト中と説明しており、日本全国の全アカウントを対象とした正式提供は確認できません。表示されるプラン特典は所在地・アカウント種別・テスト状況によって異なります。",
    impactBody:
      "クライアントに案内する際は、利用可能な場合がある段階として扱い、加入画面に表示される内容を都度確認してください。",
    sources: [src("Metaヘルプセンター")],
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
      "WhatsApp・Instagram・Messengerでの顧客対応を自動化するAIエージェントを、Meta One のビジネス向けパッケージに含まれる形で提供します。",
    impactBody:
      "DM対応を人力で回している運用は、自動化の範囲と有人対応の線引きを設計し直す判断材料です。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2026-06-instagram-plus",
    date: "2026.06",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "official",
    title: "Instagram Plus を正式提供開始（月額3.99ドル、日本では319円）",
    changeBody:
      "ストーリーズの追加機能などが利用できる個人向け有料プランで、Facebook Plus・WhatsApp Plus と同時に展開されています。",
    impactBody:
      "直接の運用影響は限定的ですが、Instagram全体が課金前提の設計へ移行していく流れの起点として押さえておきたい項目です。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2026-06-grid-reorder",
    date: "2026.06",
    year: "2026",
    cat: "ui",
    impact: "low",
    verify: "official",
    title: "プロフィールのグリッド並び替え機能",
    changeBody: "投稿順に縛られず、プロフィール上の並び順を自由に変更できるようになりました。",
    impactBody:
      "訴求したい投稿を上部に固定できるため、プロフィール到達後の導線設計を見直す価値があります。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2026-06-threads-community",
    date: "2026.06",
    year: "2026",
    cat: "feature",
    impact: "low",
    verify: "official",
    title: "Threads にコミュニティ機能を追加",
    changeBody: "関心テーマごとのコミュニティ単位で投稿・閲覧できる機能。",
    impactBody:
      "Instagramのフォロワー基盤をそのまま持ち込めるため、テキスト発信の新しい導線として検証する余地があります。",
    sources: [src("Threads公式")],
  },
  {
    id: "e-2026-05-insights-tabs",
    date: "2026.05",
    year: "2026",
    cat: "api",
    impact: "mid",
    verify: "official",
    title: "インサイトが「概要」「エンゲージメント」「オーディエンス」の3タブ構成に刷新",
    changeBody:
      "フィード投稿（カルーセル含む）とリールで利用可能。コラボ投稿・ライブ・リール広告コンテンツは対象外です。閲覧数の推移に加え、閲覧数を基準としたアクション率が確認できるようになりました。",
    impactBody: "月次レポートの参照箇所と指標定義が変わるため、テンプレートの更新が必要です。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2026-05-meta-one",
    date: "2026.05.27",
    year: "2026",
    cat: "ads",
    impact: "high",
    verify: "official",
    title: "サブスクリプション「Meta One」のグローバル展開を開始",
    changeBody:
      "Instagram・Facebook・WhatsApp向けの有料サブスクを新プランで統合。Meta One Plus（月額7.99ドル）とMeta One Premium（月19.99ドル）に加え、アプリ個別プランも導入されました。",
    impactBody:
      "Metaの収益源が広告一本から分散していく転換点です。今後のAI機能が有料前提で提供される可能性を織り込んでおく必要があります。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2026-05-aggregator",
    date: "2026.05",
    year: "2026",
    cat: "algo",
    impact: "high",
    verify: "unverified",
    title: "再投稿中心のアカウントを「アグリゲーター」とみなす仕組みを導入",
    changeBody:
      "直近30日間の投稿の大半が他者コンテンツの再投稿であるアカウントを「アグリゲーター」として扱うとされています。",
    impactBody: "まとめ系・キュレーション系の運用は構造的に不利になります。オリジナル比率の管理が必要です。",
    sources: [src("Instagram公式（要確認）")],
  },
  {
    id: "e-2026-05-instants",
    date: "2026.05",
    year: "2026",
    cat: "feature",
    impact: "low",
    verify: "official",
    title: "無加工写真を共有する「Instants」と専用アプリを提供",
    changeBody:
      "その場で撮影した写真を加工なしで共有する機能。親しい友人・相互フォローユーザーに限定され、投稿後24時間のみ表示されます。",
    impactBody:
      "法人アカウントでの活用余地は小さいものの、作り込まれていない発信が重視される方向の表れとして押さえておきたい項目です。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2026-04-medical-ad-guideline",
    date: "2026.04",
    year: "2026",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "改正 医療広告ガイドライン 施行",
    changeBody:
      "オンライン診療初診施設という新業態への対応と、SNS・動画広告の規制強化が2本柱。クリニック向けの診療内容への言及と受診を促す意図が重なる投稿は、SNSであっても医療広告として規制対象になります。インフルエンサーに報酬を渡して投稿を依頼する場合は、報酬を受け取る旨の明示義務が生じます。",
    impactBody:
      "美容・クリニック系アカウントを扱う場合、投稿本文だけでなくプロフィール・動画のテロップ・音声・概要欄まで確認範囲を広げる必要があります。",
    sources: [src("厚生労働省 医療広告ガイドライン"), src("事例解説書（第6版）")],
  },
  {
    id: "e-2026-04-grid-34-full",
    date: "2026.04",
    year: "2026",
    cat: "ui",
    impact: "high",
    verify: "official",
    title: "プロフィールグリッドの3:4表示が順次完全移行",
    changeBody:
      "2025年から段階的に進めてきた縦長グリッドへの移行が、順次すべてのアカウントに適用されます。",
    impactBody:
      "1:1前提で作った既存投稿はサムネイルで見切れます。テンプレートを3:4基準に作り直し、過去投稿の表示崩れを確認してください。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2026-04-threads-business",
    date: "2026.04",
    year: "2026",
    cat: "feature",
    impact: "mid",
    verify: "unverified",
    title: "Threads にビジネス向け機能を追加",
    changeBody:
      "制作から効果測定まで一貫して行える機能群が追加されるとされています。具体的な機能名と提供範囲は公式リリースでの確認が必要です。",
    impactBody: "Threadsを運用メニューに含めるかどうかの判断材料になります。",
    sources: [src("Meta公式リリース（要確認）")],
  },
  {
    id: "e-2026-03-medical-ad-revision",
    date: "2026.03.30",
    year: "2026",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "医療広告ガイドラインが最終改正（本体・Q&A・事例解説書を同時更新）",
    changeBody:
      "ガイドライン本体、Q&A、事例解説書（第6版）の3文書が同時に更新されました。第6版では自由診療における限定解除要件を満たしていない事例などが拡充されています。",
    impactBody:
      "施行前に社内チェック体制を更新するための起点となる日付です。3文書はセットで参照してください。",
    sources: [src("厚生労働省 公式ページ")],
  },
  {
    id: "e-2026-03-ad-policy-overhaul",
    date: "2026.03中旬",
    year: "2026",
    cat: "ads",
    impact: "high",
    verify: "unverified",
    title: "Meta広告のポリシー大改訂（AI開示義務化・マルチモーダル審査・Advantage+デフォルトON）",
    changeBody:
      "ソーシャル広告カテゴリ導入以来で最大規模とされる改訂。AI生成コンテンツの開示義務化、マルチモーダル審査の本格導入、Advantage+クリエイティブのデフォルトON化が含まれます。",
    impactBody:
      "Advantage+クリエイティブを意図せずONのまま配信している広告主が増えています。既存キャンペーンの設定確認と、AI生成素材の開示運用ルールの整備が必要です。",
    sources: [src("Meta広告ポリシー（要確認）")],
  },
  {
    id: "e-2026-03-search-grid",
    date: "2026.03",
    year: "2026",
    cat: "ui",
    impact: "mid",
    verify: "unverified",
    title: "検索結果が2列レイアウトに、発見タブのサムネイルが縦長仕様に変更",
    changeBody:
      "検索結果と発見タブの表示形式が変更され、1画面あたりの表示件数と見た目の印象が変わりました。",
    impactBody:
      "サムネイル1枚あたりの面積が変わるため、表紙デザインの文字サイズと余白を再設計する必要があります。",
    sources: [src("Instagram公式（要確認）")],
  },
  {
    id: "e-2026-02-advantage-sales",
    date: "2026.02",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "unverified",
    title: "ASC が「Advantage+ セールスキャンペーン」に名称変更、構造も変更",
    changeBody:
      "旧Advantage+ショッピングキャンペーン（ASC）から改称。1キャンペーン内に複数の広告セットを作成できるようになりました。",
    impactBody:
      "広告セットを増やすとオーディエンスの内部競合が起きやすいため、基本は1キャンペーン=1広告セットの運用を維持してください。",
    sources: [src("Metaビジネスヘルプセンター")],
  },
  {
    id: "e-2026-01-views",
    date: "2026.01",
    year: "2026",
    cat: "api",
    impact: "mid",
    verify: "unverified",
    title: "主要指標が「Views（閲覧数）」に統一",
    changeBody: "従来のリーチ・インプレッション等の表示が、閲覧数ベースに整理されました。",
    impactBody:
      "過去レポートとの数値比較ができなくなる箇所が出ます。移行時点を明記した上でKPIを再定義してください。",
    sources: [src("Instagram公式（要確認）")],
  },
  {
    id: "e-2026-meta-ai-signal",
    date: "2026年内",
    year: "2026",
    cat: "ads",
    impact: "mid",
    verify: "unverified",
    title: "Meta AI との対話内容が広告配信シグナルに",
    changeBody:
      "ユーザーの過去の行動に加え、Meta AIとの対話内容が購買意図の予測シグナルとして取り込まれるとされています。",
    impactBody:
      "属性ターゲティングの相対的な価値がさらに下がり、クリエイティブの本文と質に重心を寄せるべき判断材料になります。",
    sources: [src("Meta公式（要確認）")],
  },
  {
    id: "e-2026-stealth-marketing-gl",
    date: "2026年内",
    year: "2026",
    cat: "policy",
    impact: "mid",
    verify: "unverified",
    title: "ステマ規制ガイドライン改訂の議論",
    changeBody:
      "長尺動画における表示方法や、インフルエンサーによる二次投稿の扱いなどについて、運用基準の改訂が議論されています。",
    impactBody:
      "確定情報ではありませんが、改訂が入ればPR表示の運用ルールを見直す必要が生じるため、動向を追う対象として記録しています。",
    sources: [src("消費者庁（要確認）")],
  },

  // ===================== 2025 =====================
  {
    id: "e-2025-12-mosseri-raw",
    date: "2025.12.31",
    year: "2025",
    cat: "algo",
    impact: "mid",
    verify: "official",
    title: "Mosseri氏が「2026年はRaw（生）コンテンツの時代」と公式投稿",
    changeBody:
      "高度に編集された完璧なコンテンツより、粗削りで本物味のあるコンテンツが評価されやすくなるとの示唆をした発言。",
    impactBody:
      "Rawは低品質という意味ではありません。作り込みを減らすのではなく、過度な装飾を減らす方向で調整してください。",
    sources: [src("@mosseri 公式投稿")],
  },
  {
    id: "e-2025-12-hashtag-limit",
    date: "2025.12",
    year: "2025",
    cat: "algo",
    impact: "high",
    verify: "official",
    title: "ハッシュタグ数が1投稿あたり5個までに制限",
    changeBody: "従来は最大30個まで設定できたハッシュタグが、5個までに制限されました。",
    impactBody:
      "タグの物量でリーチを稼ぐ運用が成立しなくなります。投稿内容そのものとテーマの一貫性に評価が移っています。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2025-12-pg13",
    date: "2025.12",
    year: "2025",
    cat: "policy",
    impact: "mid",
    verify: "official",
    title: "映画の年齢区分「PG-13」に相当する基準を導入",
    changeBody:
      "10代アカウントに表示されるコンテンツの基準として、映画の年齢区分に準じた考え方が導入されました。",
    impactBody: "美容・医療・アルコールなど年齢層に配慮が必要な業種は、リーチ対象が絞られる可能性があります。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2025-12-highlight-round",
    date: "2025.12",
    year: "2025",
    cat: "ui",
    impact: "low",
    verify: "official",
    title: "ハイライトの丸型表示が復活",
    changeBody: "9月に変更されたグリッド表示から、従来の丸型アイコン表示に戻りました。",
    impactBody: "4:5前提で作り直したカバー画像が再び小さく表示されます。両方の表示で耐読できるデザインが安全です。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2025-11-identity-suspension",
    date: "2025.11",
    year: "2025",
    cat: "policy",
    impact: "mid",
    verify: "observed",
    title: "本人確認・顔認証を伴う停止事例の報告",
    changeBody:
      "ログイン時に突然本人確認を求められ、顔認証を実施しても復旧しないという報告が出ています。Metaの公式発表に基づく情報ではありません。",
    impactBody:
      "復旧経路を確保するためにも、ビジネスアカウントでの運用と管理者の複数設定を推奨します。",
    sources: [src("報告事例")],
  },
  {
    id: "e-2025-09-highlight-grid",
    date: "2025.09",
    year: "2025",
    cat: "ui",
    impact: "mid",
    verify: "official",
    title: "ハイライトが専用タブでのグリッド表示・4:5サムネイルに変更、並び替えが可能に",
    changeBody:
      "従来プロフィール上部に丸型アイコンで並んでいたハイライトが、専用タブ内に大きなサムネイルで表示される形式に変更。更新日時順で固定されていた並び順を変更できるようになりました。",
    impactBody: "既存のカバー画像は比率が合わなくなります。ハイライトを導線として使っている場合は作り直しが必要です。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2025-dental-clinic-order",
    date: "2025年",
    year: "2025",
    cat: "policy",
    impact: "high",
    verify: "official",
    title: "口コミ投稿を条件に割引を提供した歯科医院に、景表法違反で措置命令",
    changeBody:
      "東京都の歯科医院が、Googleクチコミへの高評価投稿を条件に割引を提供していた行為をステルスマーケティングにあたるとして、消費者庁から措置命令を受けました。",
    impactBody:
      "ステマ規制の措置対象は広告主（事業者）です。口コミ・レビューの獲得施策を設計している場合、対価と投稿を結びつける導線がないか点検してください。",
    sources: [src("消費者庁 措置命令")],
  },
  {
    id: "e-2025-07-threads-mau",
    date: "2025.07",
    year: "2025",
    cat: "feature",
    impact: "low",
    verify: "official",
    title: "Threads の月間アクティブ利用者数が4億人に",
    changeBody: "Meta社が「Threads API Summit」で公表。日本国内のMAUは公式数値が未公表です。",
    impactBody: "参入判断の材料となる規模の数字です。国内数値がない点を含めて提案文に反映してください。",
    sources: [src("Threads API Summit")],
  },
  {
    id: "e-2025-06-mass-suspension",
    date: "2025.06",
    year: "2025",
    cat: "policy",
    impact: "high",
    verify: "observed",
    title: "アカウント停止・凍結の報告が急増",
    changeBody:
      "明確な違反の心当たりがないまま停止されたという報告が世界的に増加しました。背景としてAI検知の強化と誤判定の増加が指摘されています。Metaが特定の原因を公式に発表しているものではありません。異議申し立ての期限は停止から180日と表示されます。",
    impactBody:
      "停止は代行・自社運用を問わず起こり得ます。投稿データの外部バックアップと、異議申し立て手順の社内文書化を推奨します。",
    sources: [src("報告事例")],
  },
  {
    id: "e-2025-04-threads-ads",
    date: "2025.04",
    year: "2025",
    cat: "ads",
    impact: "high",
    verify: "official",
    title: "Threads広告がリリース。Meta広告マネージャーから配信可能に",
    changeBody: "既存のMeta広告アカウントから、Threads面への配信ができるようになりました。",
    impactBody:
      "新しい配信面が1つ増える形です。Advantage+の自動配置に含まれるため、意図しない配信をしていないか確認してください。",
    sources: [src("Meta公式発表")],
  },
  {
    id: "e-2025-04-edits",
    date: "2025.04",
    year: "2025",
    cat: "feature",
    impact: "mid",
    verify: "official",
    title: "Instagram公式の動画編集アプリ「Edits」を提供開始",
    changeBody: "リール制作向けの公式編集アプリ。他社アプリのウォーターマークを入れない状態で書き出せます。",
    impactBody: "他社ロゴが残った動画はリールが伸びにくいとされているため、編集フローの標準を見直す価値があります。",
    sources: [src("Instagram公式")],
  },
  {
    id: "e-2025-carousel-music",
    date: "2025年内",
    year: "2025",
    cat: "algo",
    impact: "mid",
    verify: "unverified",
    title: "カルーセル投稿に音楽を追加でき、リールタブにも表示されるように",
    changeBody:
      "従来フィードに限定されていたカルーセル投稿が、音楽を付けることでリールタブの表示対象になります。",
    impactBody: "静止画中心の運用でも、動画面へのリーチ機会を得られます。既存カルーセルの再設計で対応可能です。",
    sources: [src("Instagram公式（要確認）")],
  },
  {
    id: "e-2025-01-ranking-explained",
    date: "2025.01",
    year: "2025",
    cat: "algo",
    impact: "high",
    verify: "official",
    title: "Mosseri氏が「Ranking Explained」で主要シグナルを公開",
    changeBody:
      "視聴時間・シェア・送信数という主要ランキング指標の優先度を説明。フィード・ストーリーズ・発見タブ・リールがそれぞれ独立したルールで動作することが示されました。",
    impactBody:
      "評価の中心が保存・送信（DMシェア）へ移りました。「誰かに送りたくなるか」を投稿設計の基準に置き換える必要があります。",
    sources: [src("@mosseri / @creators 公式投稿")],
  },
  {
    id: "e-2025-01-grid-34",
    date: "2025.01",
    year: "2025",
    cat: "ui",
    impact: "high",
    verify: "official",
    title: "プロフィールグリッドが1:1（正方形）から3:4（縦長）へ変更",
    changeBody: "1月中旬から順次適用。Mosseri氏は現在のトレンドに合わせた変更であると説明しています。",
    impactBody:
      "複数投稿をまたぐグリッドデザインを組んでいるアカウントは表示が崩れます。以降の投稿は3:4（1012×1350px）基準での制作が安全です。",
    sources: [src("Instagram公式ブログ")],
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
    sources: [src("Meta for Developers")],
  },
  {
    id: "e-2024-09-basic-display-notice",
    date: "2024.09.04",
    year: "2024",
    cat: "api",
    impact: "mid",
    verify: "official",
    title: "Basic Display API の終了を開発者向けブログで告知",
    changeBody: "12月4日をもって提供を終了する旨が公式に発表されました。",
    impactBody:
      "API系の変更はMeta for Developersのチェンジログにのみ出ます。SNS運用の情報源とは別に監視対象に含める必要があります。",
    sources: [src("Meta for Developers")],
  },
  {
    id: "e-2024-trial-reels",
    date: "2024年内",
    year: "2024",
    cat: "feature",
    impact: "mid",
    verify: "unverified",
    title: "トライアルリールの提供開始",
    changeBody:
      "フォロワー以外にだけ配信してテストできる機能。約24時間後にリールビューアーで閲覧数・いいね数・コメント数・シェア数が確認できます。",
    impactBody: "既存フォロワーの反応を求めずに新しい切り口を試せます。企画検証のコストを大きく下げる機能です。",
    sources: [src("Instagram公式（要確認）")],
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
    sources: [src("消費者庁 指定告示・運用基準")],
  },
  {
    id: "e-2023-07-threads-launch",
    date: "2023.07",
    year: "2023",
    cat: "feature",
    impact: "mid",
    verify: "official",
    title: "Threads がリリース（Instagram連携前提の設計）",
    changeBody:
      "テキスト主体のSNS。Instagramアカウントと連携して利用する設計で、最大500文字のテキストや画像・動画（最長5分）、外部リンクの共有に対応しています。",
    impactBody:
      "Instagramのフォロワー基盤をそのまま活用できるため、立ち上げコストが低い新しい導線として位置づけられます。",
    sources: [src("Meta公式発表")],
  },
];
