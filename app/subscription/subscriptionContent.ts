// ────────────────────────────────────────────────────────────────
// /subscription LP（SubscriptionClient.tsx）の多言語コンテンツ。
// 表示名（name）は言語ごとに翻訳するが、内部識別子（key）は常に
// 日本語のまま固定 — お申し込みURL・フォーム送信値・分析ラベルなど
// バックエンド／他ページとの整合性が必要な値はすべて key を使うこと。
// 金額（price）は換算せず円建ての数値のまま。単位表記のみ言語ごとに変える。
// ────────────────────────────────────────────────────────────────

export type Lang = "ja" | "ko";

export type Plan = {
  key: string;       // 内部識別子（常に日本語・不変）
  name: string;       // 表示名（言語ごとに翻訳）
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
};

export const PLANS: Record<Lang, Plan[]> = {
  ja: [
    {
      key: "いいね代行", name: "いいね代行", price: "9,800",
      desc: "ターゲット層への自動いいねで認知を拡大。フォロワーへの返しいいねも対応。アカウント保護設定付き。",
      features: ["1日最大200いいね", "ターゲットキーワード設定（最大50個）", "競合アカウントフォロワーへのアプローチ", "LINE相談サポート", "月次レポート"],
    },
    {
      key: "発見表示ブースト", name: "発見表示ブースト", price: "19,800",
      desc: "投稿の初速エンゲージメントを高め、おすすめ・発見タブへの掲載確率を劇的に向上。新規リーチを最大化。",
      features: ["投稿直後の集中ブースト", "ハッシュタグ最適化提案", "投稿タイミング分析・提案", "おすすめ・発見タブ掲載レポート", "LINE・メール相談サポート（優先）"],
    },
    {
      key: "セットプラン", name: "セットプラン", price: "24,980", popular: true,
      desc: "「いいね代行」と「発見表示ブースト」のセット。両方を同時運用し、相乗効果で成果を最大化。",
      features: ["いいね代行の全機能", "発見表示ブーストの全機能", "単独契約より4,620円お得", "月次簡易レポート"],
    },
    {
      key: "リスト上位表示", name: "リスト上位表示", price: "14,800",
      desc: "狙ったキーワード検索でアカウントが上位表示されるよう最適化。特定キーワードの独占を目指す。",
      features: ["上位キーワード分析・選定", "プロフィール最適化サポート", "検索順位モニタリング", "月次ランキングレポート"],
    },
    {
      key: "プレミアム", name: "プレミアム", price: "49,800",
      desc: "ご要望や他SNSへのエンゲージメント増加など、ご相談内容に応じて、あなたに合ったプランをご提案・セレクトします。",
      features: ["全プランの全機能", "専任コンサルタント担当", "投稿代行（月8本まで）", "分析レポート"],
    },
  ],
  ko: [
    {
      key: "いいね代行", name: "좋아요 대행", price: "9,800",
      desc: "타겟층에게 자동 좋아요를 눌러 인지도를 확대합니다. 팔로워에게 답례 좋아요도 지원. 계정 보호 설정 포함.",
      features: ["1일 최대 200회 좋아요", "타겟 키워드 설정(최대 50개)", "경쟁 계정 팔로워 대상 어프로치", "LINE 상담 지원", "월간 리포트"],
    },
    {
      key: "発見表示ブースト", name: "탐색 탭 노출 부스트", price: "19,800",
      desc: "게시물의 초기 반응을 높여 추천・탐색 탭 노출 확률을 극적으로 향상시킵니다. 신규 도달을 극대화합니다.",
      features: ["게시 직후 집중 부스트", "해시태그 최적화 제안", "게시 타이밍 분석・제안", "추천・탐색 탭 노출 리포트", "LINE・이메일 상담 지원(우선)"],
    },
    {
      key: "セットプラン", name: "세트 플랜", price: "24,980", popular: true,
      desc: "'좋아요 대행'과 '탐색 탭 노출 부스트'의 세트입니다. 두 가지를 동시에 운영하여 시너지 효과로 성과를 극대화합니다.",
      features: ["좋아요 대행의 모든 기능", "탐색 탭 노출 부스트의 모든 기능", "개별 계약보다 4,620엔 절약", "월간 간이 리포트"],
    },
    {
      key: "リスト上位表示", name: "리스트 상위 노출", price: "14,800",
      desc: "원하는 키워드 검색에서 계정이 상위 노출되도록 최적화합니다. 특정 키워드의 독점을 목표로 합니다.",
      features: ["상위 키워드 분석・선정", "프로필 최적화 지원", "검색 순위 모니터링", "월간 순위 리포트"],
    },
    {
      key: "プレミアム", name: "프리미엄", price: "49,800",
      desc: "요청 사항이나 다른 SNS 참여 증대 등 상담 내용에 맞춰 고객님께 맞는 플랜을 제안・구성해 드립니다.",
      features: ["전 플랜의 모든 기능", "전담 컨설턴트 배정", "게시물 대행 작성(월 8건까지)", "분석 리포트"],
    },
  ],
};

export type Faq = { q: string; a: string };

export const FAQS: Record<Lang, Faq[]> = {
  ja: [
    { q: "いつでも解約できますか？", a: "はい、月単位での契約ですので翌月分から解約が可能です。違約金や解約手数料は一切かかりません。" },
    { q: "効果が出るまでどれくらいかかりますか？", a: "多くのお客様で1〜2ヶ月以内に数値の改善が見られます。特におすすめ・発見タブへの掲載は早いケースで2〜3週間で効果が出始めます。" },
    { q: "アカウントが凍結されるリスクはありませんか？", a: "Instagramのガイドラインに準拠した安全な手法のみを使用しています。過去3000件以上の導入で凍結事例はゼロです。" },
    { q: "支払い方法は何に対応していますか？", a: "クレジットカード（VISA・Mastercard・JCB）・銀行振込・PayPayに対応しています。" },
    { q: "個人アカウントでも利用できますか？", a: "はい、個人・法人を問わずご利用いただけます。ビジネスアカウントへの切り替えを推奨しています（無料でサポートします）。" },
    { q: "上位表示を保証してくれますか？", a: "成果保証は一切しておりません。これはインスタグラムによるアルゴリズム（検索順位決定の仕様）で順位が決定されていく為、保証は不可能である為です。また、上位表示を達成したとしても、アルゴリズム変動によって順位変動する可能性は常に存在します。そのため、常にインスタグラムのアルゴリズムおよび、SEO状況の現状把握と変動時の対応を続けていく必要があることをご理解ください。" },
  ],
  ko: [
    { q: "언제든지 해지할 수 있나요?", a: "네, 월 단위 계약이므로 익월 분부터 해지가 가능합니다. 위약금이나 해지 수수료는 전혀 발생하지 않습니다." },
    { q: "효과가 나타나기까지 얼마나 걸리나요?", a: "대부분의 고객님께서 1~2개월 이내에 수치 개선을 경험하십니다. 특히 추천・탐색 탭 노출은 빠른 경우 2~3주 만에 효과가 나타나기 시작합니다." },
    { q: "계정이 정지될 위험은 없나요?", a: "인스타그램 가이드라인을 준수하는 안전한 방법만 사용하고 있습니다. 지금까지 3,000건 이상 도입 사례 중 계정 정지 사례는 전무합니다." },
    { q: "어떤 결제 방법을 지원하나요?", a: "신용카드(VISA・Mastercard・JCB)・계좌이체・PayPay를 지원합니다." },
    { q: "개인 계정으로도 이용할 수 있나요?", a: "네, 개인・법인 관계없이 이용하실 수 있습니다. 비즈니스 계정으로의 전환을 권장드리며, 전환 작업도 무료로 지원해 드립니다." },
    { q: "상위 노출을 보장해 주나요?", a: "성과 보장은 일절 해드리지 않습니다. 이는 인스타그램의 알고리즘(검색 순위 결정 방식)에 따라 순위가 정해지기 때문에 보장이 불가능하기 때문입니다. 또한 상위 노출을 달성하더라도 알고리즘 변동에 따라 순위가 다시 바뀔 가능성은 항상 존재합니다. 따라서 인스타그램의 알고리즘 및 SEO 현황을 지속적으로 파악하고 변동 시 대응해 나가야 함을 양해 부탁드립니다." },
  ],
};

export type Voice = { stars: number; text: string; name: string; biz: string; color: string };

export const VOICES: Record<Lang, Voice[]> = {
  ja: [
    { stars: 5, text: "「新宿 居酒屋」での検索で表示される機会が増え、インスタ経由でのご予約が入るようになりました。以前は認知してもらう手段がなかったので助かっています。", name: "都内・飲食店店長様", biz: "導入3ヶ月", color: "#E8734A" },
    { stars: 5, text: "投稿後のブーストを使い始めてから、リールの再生数が安定して伸びるようになってきました。まだ成長途中ですが手ごたえを感じています。", name: "フリーランス・クリエイター様", biz: "導入4ヶ月", color: "#5B73DE" },
    { stars: 4, text: "フォロワー以外の方からの保存やコメントが増えてきた実感があります。おすすめ・発見タブからの流入が増えているのをインサイトで確認できています。", name: "個人ブランディング中のお客様", biz: "導入2ヶ月", color: "#7B5EA7" },
    { stars: 5, text: "いいね代行でターゲット層との接点が増え、プロフィールへの訪問数が上がりました。サイトへの流入も少し改善されています。", name: "ECサイト運営担当者様", biz: "リピーター継続中", color: "#3D9BD4" },
    { stars: 5, text: "地域キーワードでの表示機会が増え、初めてのお客様からの問い合わせが来るようになりました。", name: "ネイルサロン経営者様", biz: "導入3ヶ月", color: "#C45BAA" },
    { stars: 4, text: "投稿への保存数が以前より増えています。劇的な変化というわけではないですが、数値が改善されているのは実感できます。", name: "美容サロン経営者様", biz: "導入3ヶ月", color: "#4CAF75" },
  ],
  ko: [
    { stars: 5, text: "'신주쿠 이자카야' 검색에서 노출되는 기회가 늘어나 인스타그램을 통한 예약이 들어오게 되었습니다. 예전에는 알릴 방법이 없었는데 정말 도움이 되고 있습니다.", name: "도쿄 시내・음식점 점장님", biz: "도입 3개월", color: "#E8734A" },
    { stars: 5, text: "게시 후 부스트를 사용하기 시작한 뒤로 릴스 조회수가 꾸준히 늘고 있습니다. 아직 성장 중이지만 효과를 체감하고 있습니다.", name: "프리랜서 크리에이터님", biz: "도입 4개월", color: "#5B73DE" },
    { stars: 4, text: "팔로워가 아닌 분들의 저장・댓글이 늘어난 것을 체감하고 있습니다. 추천・탐색 탭에서의 유입이 늘고 있는 것을 인사이트로 확인하고 있습니다.", name: "퍼스널 브랜딩 중이신 고객님", biz: "도입 2개월", color: "#7B5EA7" },
    { stars: 5, text: "좋아요 대행으로 타겟층과의 접점이 늘어나 프로필 방문 수가 증가했습니다. 사이트 유입도 조금씩 개선되고 있습니다.", name: "이커머스 사이트 운영 담당자님", biz: "재계약 유지 중", color: "#3D9BD4" },
    { stars: 5, text: "지역 키워드 노출 기회가 늘어나면서 신규 고객님의 문의가 들어오게 되었습니다.", name: "네일샵 대표님", biz: "도입 3개월", color: "#C45BAA" },
    { stars: 4, text: "게시물 저장 수가 예전보다 늘었습니다. 극적인 변화는 아니지만 수치가 개선되고 있음을 체감하고 있습니다.", name: "뷰티살롱 대표님", biz: "도입 3개월", color: "#4CAF75" },
  ],
};

export type ImproveItem = {
  k: string; badge: string; price: string; img: string; alt: string; title: string;
  points: [string, string][];
};

export const IMPROVE_ITEMS: Record<Lang, ImproveItem[]> = {
  ja: [
    {
      k: "like", badge: "いいね代行", price: "9,800円/月（税込）〜", img: "/images/intro/intro-like.webp", alt: "いいね代行の導入イメージ：フォロワー・非フォロワーとの交流",
      title: "フォロワー外との接点が生まれ、認知が広がる",
      points: [
        ["認知の入口が広がる", "これまで届かなかったフォロワー外のユーザーに、アカウントの存在を知ってもらえます。"],
        ["自然な認知拡大に繋がる", "ユーザーへの反応を積み重ねることで、アクティブな状態になりアカウントの評価が向上します。"],
        ["手間なく自動で", "ターゲット設定はおまかせ。運用の手間をかけずに認知拡大が進みます。"],
      ],
    },
    {
      k: "rank", badge: "リスト上位表示", price: "14,800円/月（税込）〜", img: "/images/intro/intro-rank.webp", alt: "リスト上位表示の導入イメージ：検索結果の上位に表示される",
      title: "検索で「見つけられる」アカウントへ",
      points: [
        ["検索で見つけられる", "「エリア×業種」などのキーワードで検索したユーザーに、上位表示で見つけてもらえます。"],
        ["安定した流入をつくる", "一時的なバズに頼らず、検索からの継続的な流入基盤を築きます。"],
        ["プロフィール流入が増加", "アカウントリストへ表示されるため、プロフィールからの流入・認知拡大に繋がります。"],
      ],
    },
  ],
  ko: [
    {
      k: "like", badge: "좋아요 대행", price: "9,800엔/월(세금 포함)~", img: "/images/intro/intro-like.webp", alt: "좋아요 대행 도입 이미지: 팔로워・비팔로워와의 교류",
      title: "팔로워 외 사용자와의 접점이 생기고 인지도가 확산됩니다",
      points: [
        ["인지도 확산의 입구가 넓어집니다", "지금까지 닿지 않았던 팔로워 외 사용자에게 계정의 존재를 알릴 수 있습니다."],
        ["자연스러운 인지도 확대로 이어집니다", "사용자에게 반응을 꾸준히 쌓아가면서 계정이 활성화되고 평가가 향상됩니다."],
        ["번거로움 없이 자동으로", "타겟 설정은 맡겨주세요. 운영 부담 없이 인지도 확대가 진행됩니다."],
      ],
    },
    {
      k: "rank", badge: "리스트 상위 노출", price: "14,800엔/월(세금 포함)~", img: "/images/intro/intro-rank.webp", alt: "리스트 상위 노출 도입 이미지: 검색 결과 상위 노출",
      title: "검색으로 '발견되는' 계정으로",
      points: [
        ["검색으로 발견됩니다", "'지역×업종' 등의 키워드로 검색한 사용자에게 상위 노출로 발견될 수 있습니다."],
        ["안정적인 유입을 만듭니다", "일시적인 화제성에 의존하지 않고, 검색을 통한 지속적인 유입 기반을 구축합니다."],
        ["프로필 유입이 증가합니다", "계정 리스트에 노출되므로 프로필 유입 및 인지도 확대로 이어집니다."],
      ],
    },
  ],
};

export type OptionItem = { icon: string; title: string; price: string; desc: string };

export const OPTION_ITEMS: Record<Lang, OptionItem[]> = {
  ja: [
    { icon: "📝", title: "投稿制作オプション", price: "月4本 +9,800円 / 月8本 +18,000円", desc: "プロによる投稿制作（文字入れ・構成・ハッシュタグ）。撮影した写真を送るだけでOK。" },
    { icon: "🚀", title: "発見表示ブースト", price: "+19,800円 / 月", desc: "おすすめ・発見タブへの露出を強化するオプション。新規リーチをさらに伸ばしたいときに追加できます。" },
    { icon: "👥", title: "複数アカウント割", price: "2つ目以降 5%OFF", desc: "複数店舗・系列店・ブランド別アカウントなど、2つ目以降を割引価格でご利用いただけます。" },
  ],
  ko: [
    { icon: "📝", title: "게시물 제작 옵션", price: "월 4건 +9,800엔 / 월 8건 +18,000엔", desc: "전문가가 게시물을 제작합니다(텍스트 삽입・구성・해시태그). 촬영한 사진만 보내주시면 됩니다." },
    { icon: "🚀", title: "탐색 탭 노출 부스트", price: "+19,800엔 / 월", desc: "추천・탐색 탭 노출을 강화하는 옵션입니다. 신규 도달을 더 늘리고 싶을 때 추가할 수 있습니다." },
    { icon: "👥", title: "복수 계정 할인", price: "2번째 계정부터 5% 할인", desc: "여러 매장・계열점・브랜드별 계정 등 2번째 계정부터 할인된 가격으로 이용하실 수 있습니다." },
  ],
};

export type FlowStep = { n: string; h: string; d: string; note?: string; active?: boolean };

export const FLOW_STEPS: Record<Lang, FlowStep[]> = {
  ja: [
    { n: "01", h: "お申し込み・無料相談", d: "フォームからお申し込みください。現状のアカウントを確認し、メールにてお手続きフォーム・ご相談内容に応じてご連絡いたします。", note: "所要 15〜30分／費用なし" },
    { n: "02", h: "作業内容・金額のご提示", d: "実施する作業と月額の内訳を書面でお渡しします。ご不明点が解消してからお申し込みいただけます。" },
    { n: "03", h: "プラン選択・お支払い", d: "ご希望のプランを選び、オンラインで決済。法人のお客様は請求書払いもご利用いただけます。" },
    { n: "04", h: "運用開始", d: "設定はすべて担当が対応します。以降は簡易月次レポートで進捗を共有します。", active: true },
  ],
  ko: [
    { n: "01", h: "신청・무료 상담", d: "폼을 통해 신청해 주세요. 현재 계정을 확인한 후 이메일로 절차 안내 및 상담 내용에 따라 연락드립니다.", note: "소요 시간 15~30분 / 비용 없음" },
    { n: "02", h: "작업 내용・금액 안내", d: "진행할 작업과 월 요금 내역을 서면으로 안내드립니다. 궁금하신 점이 해소된 후 신청하실 수 있습니다." },
    { n: "03", h: "플랜 선택・결제", d: "원하시는 플랜을 선택해 온라인으로 결제합니다. 법인 고객님은 청구서 결제도 이용하실 수 있습니다." },
    { n: "04", h: "운영 시작", d: "설정은 모두 담당자가 진행합니다. 이후에는 간이 월간 리포트로 진행 상황을 공유해 드립니다.", active: true },
  ],
};

// ── その他すべての静的UI文言 ──
export const UI = {
  ja: {
    langSwitcher: { ja: "日本語", ko: "한국어" },
    topbar: { hours: "受付：平日 09:00–18:00", tagline: "Instagram運用サブスク「JEMIA」" },
    nav: { pricing: "料金", results: "実績", faq: "FAQ", blog: "お役立ち記事", docFull: "📄 資料ダウンロード", docShort: "📄 資料", consultFull: "🎧 マーケティング相談はこちら", consultShort: "🎧 相談" },
    receptionBar: { badge: "受付中", slotsPrefix: "今月の残り受付枠：", slotsCount: "3件", note: "担当が固定制のため、月ごとに新規のお受け入れ数を制限しています。" },
    hero: {
      badge: "サブスク型インスタ運用代行",
      title1: "インスタ運用を", titleHighlight: "サブスクで", titleEnd: "。",
      sub1: "月額固定でインスタ運用をまるごとお任せ。", sub2: "いいね代行・おすすめ・発見タブ最適化・LINE相談まで。",
      ctaDiagnosis: "アカウント診断 →", ctaPricing: "料金を見る", ctaPlan: "30秒でプラン診断 →",
      stats: [["3000+", "導入アカウント数"], ["4.9", "平均満足度"], ["3x", "平均フォロワー増加"]] as [string, string][],
      tabAccount: "アカウント", tabHashtag: "ハッシュタグ", tabPlace: "場所",
      followerPrefix: "フォロワー ", followerLine: "フォロワー 12,400 · JEMIA運用中",
      rank1: "1位", rank2: "2位", rank3: "3位",
    },
    statsBar: [["12,400", "導入アカウント フォロワー増加", "平均 3ヶ月後の実績", false], ["340%", "おすすめ・発見タブ リーチ増加率", "先月比 平均値", true], ["4.9", "顧客満足度", "/ 5点満点（20件）", false]] as [string, string, string, boolean][],
    keywords: { heading: "おすすめ・発見タブ・検索上位の独占キーワード実績" },
    improve: { eyebrow: "How it improves", heading: "導入でアカウントはこう変わる", sub: "プランごとの導入イメージを、実際の画面とともにご紹介します。" },
    plansBanner: { title: "どのプランが合うか迷っていませんか？", sub: "かんたん4問・30秒で、あなたに最適なプランがわかります。", cta: "30秒でプラン診断 →" },
    plansSection: {
      eyebrow: "Plans & Pricing", heading: "料金プラン（月額固定・税込）",
      sub: "表示価格はすべて税込です。初期費用・解約手数料はかかりません。オプションを追加しない限り、記載の月額以外の請求は発生しません。",
      badges: ["初期費用 0円", "最低利用期間なし", "解約手数料 0円", "自動更新（当月連絡で翌月停止）", "クレジットカード／請求書払い"],
      popularBadge: "人気 No.1", yen: "円", perMonth: "/月（税込）〜", perMonthShort: "/月",
      ctaPremium: "相談する", ctaOther: "申し込む",
    },
    options: { eyebrow: "Options", heading: "プランに追加できるオプション", sub: "目的に合わせて、必要な施策だけを追加できます。すべてのプランに組み合わせOK。", note: "※ プレミアムは投稿代行（月8本まで）を標準で含みます。オプションはお申し込み時・運用開始後どちらでも追加できます。" },
    flow: {
      eyebrow: "How it works", heading: "導入の流れ", sub: "ご相談から運用開始まで、最短で翌日にスタートできます。お客様の作業は初回のヒアリングとお支払いのみです。",
      infoHeading: "運用にあたってお預かりする情報",
      passHead: "パスワードのお預かり", passBody: "いいね代行をご選択の場合、パスワードの共有が必要になります。お預かりする場合は取扱者を担当者に限定し、契約終了時に速やかに削除します。",
      cancelHead: "解約時のお手続き", cancelBody: "当月中のご連絡で翌月分から停止。違約金・引き止めはありません。設定はこちらで解除します。",
    },
    voicesSection: { eyebrow: "Voice", heading: "お客様の声" },
    whoWeAre: {
      eyebrow: "Who we are", heading: "専任の運営担当者がサポート", photoPlaceholder: "運用チーム写真（team.png）を配置",
      teamAlt: "JEMIA運用チーム（東京オフィス）", personAlt: "JEMIA運営責任者", personName: "JEMIA 運営責任者",
      personSub: "株式会社ホットセラー／Instagram運用マーケティング歴 6年",
      personText: "「頑張っても伸びない」を終わらせたい。― 運営責任者インタビューを公開しています。",
      personLink: "インタビューを読む →",
    },
    company: {
      eyebrow: "Company", heading: "運営会社",
      rows: [["会社名", "株式会社ホットセラー"], ["所在地", "東京都中央区晴海1-8-16 晴海トリトンスクエアX棟"], ["連絡先", "お問い合わせフォーム・LINE（受付：平日 09:00–18:00）"]] as [string, string][],
      note: "※ お打ち合わせはオンラインのほか、ご来社・訪問にも対応しています。",
      safetyHeading: "お取引の安全性について",
      safetyItems: ["・契約書／秘密保持契約（NDA）の締結に対応", "・請求書払い・法人口座での取引に対応"],
      safetyPrivacyPrefix: "・お預かり情報の取り扱いは", safetyPrivacyLink: "プライバシーポリシー", safetyPrivacySuffix: "に準拠",
    },
    media: { eyebrow: "Media", heading: "メディア掲載", ctaItem: "掲載ページを見る →", ctaAll: "メディア掲載実績の一覧を見る →" },
    blog: { eyebrow: "Blog", heading: "お役立ち記事", sub: "インスタ運用のヒントを発信しています。", featured: "★ 注目", cta: "記事一覧を見る →" },
    faqSection: { eyebrow: "FAQ", heading: "よくある質問" },
    finalCta: {
      eyebrow: "Get started", heading1: "マーケティングに関する", heading2: "ご相談はこちら",
      sub: "診断のみのご利用でも構いません。3営業日以内にご入力のメールアドレス宛にご返信します。",
      ctaBtn: "マーケティング相談をする", ctaLink: "30秒でプラン診断",
      boxHeading: "お問い合わせ前にご確認いただけます",
      boxItems: ["・利用規約／秘密保持方針", "・作業内容と月額の内訳を記載したサービス説明資料（PDF）", "・過去事例のインサイト実データ（許諾済み・3件）"],
      boxLink: "資料をダウンロードする →",
    },
    modal: {
      thanksTitle: "送信完了しました", thanksBody: "3日以内に確認後、ご入力いただいたメールアドレス宛にご連絡します。", close: "閉じる",
      titlePlanApply: "仮申し込み", titleConsult: "無料相談", subNote: "3日以内に確認後、ご入力いただいたメールアドレス宛にご連絡します",
      lastName: "姓", firstName: "名", required: "必須", optional: "任意",
      lastNamePh: "山田", firstNamePh: "太郎",
      email: "メールアドレス", emailPh: "example@email.com",
      instagram: "Instagram ID（@）", instagramPh: "@your_account",
      planWanted: "ご希望のプラン", planInterested: "関心のあるプラン", selectPlaceholder: "選択してください", undecided: "まだ決めていない（相談したい）",
      question: "ご質問事項", questionPh: "プラン・料金に関して等のご質問事項",
      sending: "送信中...", submit: "送信する →", hours: "受付時間：平日 09:00–18:00（時間外は翌営業日対応）",
      errName: "姓・名・メールアドレスは必須です。", errQuestion: "ご質問事項をご入力ください。", errEmail: "メールアドレスの形式が正しくありません。", errSend: "送信に失敗しました。",
    },
    chat: { aria: "お気軽にご相談ください", label: "お気軽にご相談" },
    footer: {
      tagline: "Instagram運用を、もっと自由に。もっとスマートに。", addr: "株式会社ホットセラー／東京都中央区晴海1-8-16",
      hours: "受付時間：平日 09:00 - 18:00（土日祝を除く）",
      colService: { head: "サービス", links: [["実データ", "#results"], ["料金", "#plans"], ["導入の流れ", "#flow"], ["法人のお客様", "/subscription/corporate"]] as [string, string][] },
      colInfo: { head: "情報", links: [["運営会社", "#company"], ["お役立ち記事", "/subscription/blog"], ["メディア掲載", "/subscription/media"]] as [string, string][] },
      colTerms: { head: "規約", links: [["利用規約", "/subscription/terms"], ["プライバシーポリシー", "/subscription/privacy"], ["秘密保持方針", "/subscription/confidentiality"]] as [string, string][] },
      legal: "表示している実績・数値は自社調査に基づく実測値であり、同等の成果を保証するものではありません。Instagramの仕様・規約変更により提供内容が変わる場合があります。Instagram は Meta Platforms, Inc. の商標です。",
      copyright: "© 2026 株式会社ホットセラー. All rights reserved.",
    },
  },
  ko: {
    langSwitcher: { ja: "日本語", ko: "한국어" },
    topbar: { hours: "상담 접수: 평일 09:00–18:00", tagline: "인스타그램 운영 구독 서비스 「JEMIA」" },
    nav: { pricing: "요금", results: "실적", faq: "FAQ", blog: "유용한 정보", docFull: "📄 자료 다운로드", docShort: "📄 자료", consultFull: "🎧 마케팅 상담하기", consultShort: "🎧 상담" },
    receptionBar: { badge: "상담 접수 중", slotsPrefix: "이번 달 남은 접수 인원: ", slotsCount: "3건", note: "담당자가 고정제로 운영되어, 매월 신규 접수 인원을 제한하고 있습니다." },
    hero: {
      badge: "구독형 인스타그램 운영 대행",
      title1: "인스타그램 운영을", titleHighlight: "구독으로", titleEnd: ".",
      sub1: "월 정액으로 인스타그램 운영을 통째로 맡기세요.", sub2: "좋아요 대행・추천・탐색 탭 최적화・상담 지원까지.",
      ctaDiagnosis: "계정 진단 →", ctaPricing: "요금 보기", ctaPlan: "30초 만에 플랜 진단 →",
      stats: [["3000+", "도입 계정 수"], ["4.9", "평균 만족도"], ["3x", "평균 팔로워 증가"]] as [string, string][],
      tabAccount: "계정", tabHashtag: "해시태그", tabPlace: "장소",
      followerPrefix: "팔로워 ", followerLine: "팔로워 12,400 · JEMIA 운영 중",
      rank1: "1위", rank2: "2위", rank3: "3위",
    },
    statsBar: [["12,400", "도입 계정 팔로워 증가", "평균 3개월 후 실적", false], ["340%", "추천・탐색 탭 도달 증가율", "전월 대비 평균값", true], ["4.9", "고객 만족도", "/ 5점 만점(20건)", false]] as [string, string, string, boolean][],
    keywords: { heading: "추천・탐색 탭・검색 상위 독점 키워드 실적" },
    improve: { eyebrow: "How it improves", heading: "도입하면 계정이 이렇게 달라집니다", sub: "플랜별 도입 이미지를 실제 화면과 함께 소개합니다." },
    plansBanner: { title: "어떤 플랜이 맞을지 고민되시나요?", sub: "간단한 4개 질문・30초면 나에게 맞는 플랜을 알 수 있습니다.", cta: "30초 플랜 진단 →" },
    plansSection: {
      eyebrow: "Plans & Pricing", heading: "요금 플랜(월 정액・세금 포함)",
      sub: "표시된 가격은 모두 세금 포함입니다. 초기 비용・해지 수수료는 없습니다. 옵션을 추가하지 않는 한 안내된 월 요금 외 청구는 발생하지 않습니다.",
      badges: ["초기 비용 0엔", "최소 이용 기간 없음", "해지 수수료 0엔", "자동 갱신(당월 연락 시 익월 정지)", "신용카드/청구서 결제"],
      popularBadge: "인기 No.1", yen: "엔", perMonth: "/월(세금 포함)~", perMonthShort: "/월",
      ctaPremium: "상담하기", ctaOther: "신청하기",
    },
    options: { eyebrow: "Options", heading: "플랜에 추가할 수 있는 옵션", sub: "목적에 맞춰 필요한 항목만 추가할 수 있습니다. 모든 플랜과 조합 가능합니다.", note: "※ 프리미엄 플랜은 게시물 대행 작성(월 8건까지)이 기본으로 포함되어 있습니다. 옵션은 신청 시・운영 개시 후 언제든 추가할 수 있습니다." },
    flow: {
      eyebrow: "How it works", heading: "도입 절차", sub: "상담부터 운영 시작까지 빠르면 다음 날부터 시작할 수 있습니다. 고객님이 하실 일은 최초 상담과 결제뿐입니다.",
      infoHeading: "운영을 위해 제공받는 정보",
      passHead: "비밀번호 제공", passBody: "'좋아요 대행'을 선택하신 경우 비밀번호 공유가 필요합니다. 제공해 주신 정보는 담당자만 취급하며, 계약 종료 시 즉시 삭제합니다.",
      cancelHead: "해지 절차", cancelBody: "당월 중 연락 주시면 익월 분부터 정지됩니다. 위약금・만류는 일절 없습니다. 설정 해제는 저희 측에서 진행합니다.",
    },
    voicesSection: { eyebrow: "Voice", heading: "고객님의 후기" },
    whoWeAre: {
      eyebrow: "Who we are", heading: "전담 운영 담당자가 서포트합니다", photoPlaceholder: "운영팀 사진(team.png) 배치 예정",
      teamAlt: "JEMIA 운영팀(도쿄 오피스)", personAlt: "JEMIA 운영 책임자", personName: "JEMIA 운영 책임자",
      personSub: "주식회사 핫셀러(Hotseller Inc.)／인스타그램 운영 마케팅 경력 6년",
      personText: "'열심히 해도 늘지 않는다'는 고민을 끝내고 싶습니다. ― 운영 책임자 인터뷰를 공개하고 있습니다.",
      personLink: "인터뷰 읽어보기 →",
    },
    company: {
      eyebrow: "Company", heading: "운영 회사",
      rows: [["회사명", "주식회사 핫셀러(Hotseller Inc.)"], ["소재지", "도쿄도 주오구 하루미 1-8-16 하루미 트리톤 스퀘어 X동"], ["연락처", "문의 폼・LINE(접수: 평일 09:00–18:00)"]] as [string, string][],
      note: "※ 미팅은 온라인 외에도 방문・내방 상담도 가능합니다.",
      safetyHeading: "거래 안전성에 대하여",
      safetyItems: ["・계약서/비밀유지계약(NDA) 체결 가능", "・청구서 결제・법인 계좌를 통한 거래 가능"],
      safetyPrivacyPrefix: "・제공받은 정보의 취급은 ", safetyPrivacyLink: "개인정보처리방침", safetyPrivacySuffix: "을 따릅니다",
    },
    media: { eyebrow: "Media", heading: "미디어 소개", ctaItem: "게재 페이지 보기 →", ctaAll: "미디어 소개 실적 목록 보기 →" },
    blog: { eyebrow: "Blog", heading: "유용한 정보", sub: "인스타그램 운영에 도움이 되는 정보를 전해드립니다.", featured: "★ 주목", cta: "기사 목록 보기 →" },
    faqSection: { eyebrow: "FAQ", heading: "자주 묻는 질문" },
    finalCta: {
      eyebrow: "Get started", heading1: "마케팅 관련", heading2: "상담은 이쪽으로",
      sub: "진단만 이용하셔도 괜찮습니다. 영업일 기준 3일 이내에 입력하신 이메일 주소로 답변드립니다.",
      ctaBtn: "마케팅 상담하기", ctaLink: "30초 플랜 진단",
      boxHeading: "문의 전에 확인하실 수 있습니다",
      boxItems: ["・이용약관/비밀유지방침", "・작업 내용과 월 요금 내역이 담긴 서비스 안내 자료(PDF)", "・과거 사례 인사이트 실제 데이터(동의 완료・3건)"],
      boxLink: "자료 다운로드하기 →",
    },
    modal: {
      thanksTitle: "제출이 완료되었습니다", thanksBody: "3일 이내에 확인 후 입력하신 이메일 주소로 연락드리겠습니다.", close: "닫기",
      titlePlanApply: "임시 신청", titleConsult: "무료 상담", subNote: "3일 이내에 확인 후 입력하신 이메일 주소로 연락드립니다",
      lastName: "성", firstName: "이름", required: "필수", optional: "선택",
      lastNamePh: "김", firstNamePh: "민수",
      email: "이메일 주소", emailPh: "example@email.com",
      instagram: "인스타그램 아이디(@)", instagramPh: "@your_account",
      planWanted: "희망 플랜", planInterested: "관심 있는 플랜", selectPlaceholder: "선택해 주세요", undecided: "아직 결정하지 못함(상담 희망)",
      question: "문의 내용", questionPh: "플랜・요금 등에 대한 문의 사항",
      sending: "전송 중...", submit: "제출하기 →", hours: "접수 시간: 평일 09:00–18:00(시간 외 문의는 다음 영업일에 처리)",
      errName: "성・이름・이메일 주소는 필수입니다.", errQuestion: "문의 내용을 입력해 주세요.", errEmail: "이메일 주소 형식이 올바르지 않습니다.", errSend: "전송에 실패했습니다.",
    },
    chat: { aria: "편하게 상담해 보세요", label: "편하게 상담하기" },
    footer: {
      tagline: "인스타그램 운영을 더 자유롭게. 더 스마트하게.", addr: "주식회사 핫셀러(Hotseller Inc.)／도쿄도 주오구 하루미 1-8-16",
      hours: "접수 시간: 평일 09:00 - 18:00(토・일・공휴일 제외)",
      colService: { head: "서비스", links: [["실제 데이터", "#results"], ["요금", "#plans"], ["도입 절차", "#flow"], ["법인 고객", "/subscription/corporate"]] as [string, string][] },
      colInfo: { head: "정보", links: [["운영 회사", "#company"], ["유용한 정보", "/subscription/blog"], ["미디어 소개", "/subscription/media"]] as [string, string][] },
      colTerms: { head: "약관", links: [["이용약관", "/subscription/terms"], ["개인정보처리방침", "/subscription/privacy"], ["비밀유지방침", "/subscription/confidentiality"]] as [string, string][] },
      legal: "게재된 실적・수치는 자사 조사에 기반한 실측치이며, 동일한 성과를 보장하는 것은 아닙니다. 인스타그램의 정책・약관 변경에 따라 제공 내용이 변경될 수 있습니다. Instagram은 Meta Platforms, Inc.의 상표입니다.",
      copyright: "© 2026 주식회사 핫셀러(Hotseller Inc.). All rights reserved.",
    },
  },
} satisfies Record<Lang, unknown>;

// ── ResultsBeforeAfter（導入前後 Before/After + フォロワー増加フロー）専用の文言 ──
export const RESULTS = {
  ja: {
    eyebrow: "Results", heading: "おすすめ・発見タブ流入でフォロワーが増えるまで",
    sub: "フォロワーにしか届かない投稿から、おすすめ・発見タブ掲載によって新規のお客様に届くようになります。導入前後の変化を比べてみましょう。",
    beforeStats: [["リーチ（1投稿）", "500"], ["いいね", "15"], ["保存", "0"], ["プロフィールアクセス", "12"]] as [string, string][],
    afterStats: [["おすすめ・発見タブ閲覧", "15,000"], ["いいね", "+620"], ["プロフィールアクセス", "+520"], ["フォロワー", "+380"]] as [string, string][],
    before: {
      badge: "導入前 — Before", date: "2026.02", caption: "フォロワーにしか届いていない状態",
      imgAlt: "導入前：フォロワーにしか届いていないInstagramプロフィール画面", imgCaption: "投稿はフォロワーのみに表示されている",
      callout: "フォロワーの約10%しか反応せず、新規のお客様に届いていない状態です。",
    },
    after: {
      badge: "導入後 — After", date: "2026.05（3ヶ月後）", caption: "おすすめ・発見タブから新規のお客様に届く状態",
      imgAlt: "導入後：おすすめ・発見タブに掲載され新規ユーザーに表示されている画面", imgCaption: "おすすめ・発見タブ「六本木グルメ」で上位表示",
      callout: "フォロワー外へリーチが広がり、来店・フォローにつながっています。",
    },
    conditionsTitle: "この事例の計測条件",
    conditions: [["業種・所在地", "飲食店（東京都・1店舗）"], ["開始時フォロワー", "412名"], ["利用プラン", "セットプラン（24,980円/月）"], ["投稿頻度", "週2回（お客様側で投稿）"]] as [string, string][],
    conditionsNote: "※ 個別事例であり、同等の成果を保証するものではありません。成果はアカウントの状態・投稿頻度・業種により異なります。",
    flowTitle: "おすすめ・発見タブ掲載からフォロワー増加までの流れ",
    flowSteps: [
      { no: "STEP 1", label: "おすすめ・発見タブに掲載", desc: "投稿直後の反応を高め、掲載対象に入りやすくします。" },
      { no: "STEP 2", label: "投稿を見つけてもらう", desc: "フォロワー外のユーザーの画面に表示されます。" },
      { no: "STEP 3", label: "プロフィール流入", desc: "気になった人がプロフィールを見に来ます。" },
      { no: "STEP 4", label: "フォロー・来店", desc: "フォローや予約・来店につながります。", highlight: true },
    ],
  },
  ko: {
    eyebrow: "Results", heading: "추천・탐색 탭 유입으로 팔로워가 늘어나기까지",
    sub: "팔로워에게만 도달하던 게시물이, 추천・탐색 탭 노출을 통해 신규 고객님께도 도달하게 됩니다. 도입 전후의 변화를 비교해 보세요.",
    beforeStats: [["도달(게시물당)", "500"], ["좋아요", "15"], ["저장", "0"], ["프로필 방문", "12"]] as [string, string][],
    afterStats: [["추천・탐색 탭 조회", "15,000"], ["좋아요", "+620"], ["프로필 방문", "+520"], ["팔로워", "+380"]] as [string, string][],
    before: {
      badge: "도입 전 — Before", date: "2026.02", caption: "팔로워에게만 도달하고 있는 상태",
      imgAlt: "도입 전: 팔로워에게만 도달하고 있는 인스타그램 프로필 화면", imgCaption: "게시물이 팔로워에게만 노출되고 있음",
      callout: "팔로워의 약 10%만 반응하며, 신규 고객님께는 도달하지 못하는 상태입니다.",
    },
    after: {
      badge: "도입 후 — After", date: "2026.05(3개월 후)", caption: "추천・탐색 탭을 통해 신규 고객님께 도달하는 상태",
      imgAlt: "도입 후: 추천・탐색 탭에 노출되어 신규 사용자에게 표시되는 화면", imgCaption: "추천・탐색 탭 '롯폰기 맛집'에서 상위 노출",
      callout: "팔로워 외부로 도달 범위가 확대되어 방문・팔로우로 이어지고 있습니다.",
    },
    conditionsTitle: "이 사례의 측정 조건",
    conditions: [["업종・소재지", "음식점(도쿄도・1개 매장)"], ["시작 시 팔로워", "412명"], ["이용 플랜", "세트 플랜(24,980엔/월)"], ["게시 빈도", "주 2회(고객님 측에서 게시)"]] as [string, string][],
    conditionsNote: "※ 개별 사례이며 동일한 성과를 보장하는 것은 아닙니다. 성과는 계정 상태・게시 빈도・업종에 따라 다릅니다.",
    flowTitle: "추천・탐색 탭 노출부터 팔로워 증가까지의 흐름",
    flowSteps: [
      { no: "STEP 1", label: "추천・탐색 탭 노출", desc: "게시 직후 반응을 높여 노출 대상에 들어가기 쉽게 합니다." },
      { no: "STEP 2", label: "게시물이 발견됨", desc: "팔로워가 아닌 사용자의 화면에도 노출됩니다." },
      { no: "STEP 3", label: "프로필 유입", desc: "관심이 생긴 사용자가 프로필을 방문합니다." },
      { no: "STEP 4", label: "팔로우・방문", desc: "팔로우나 예약・방문으로 이어집니다.", highlight: true },
    ],
  },
} satisfies Record<Lang, unknown>;
