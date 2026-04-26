"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RESTAURANT_DIAGNOSIS_THANKS_STORAGE_KEY } from "./thanksPayload";
import {
  ArrowRight,
  BarChart3,
  Camera,
  CircleHelp,
  ClipboardList,
  Hash,
  MapPin,
  MessageCircle,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { InstagramToVisitFlowSection } from "@/components/InstagramToVisitFlowSection";

const BG_PINK = "#F8F0F6";

const igTitleClass =
  "bg-gradient-to-r from-[#E1306C] to-[#F77737] bg-clip-text text-transparent";

const floatInteractive =
  "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0";

const painPoints = [
  {
    title: "投稿しても来店につながらない",
    body: "いいねはつくが、予約や来店に結びつかず不安が残る。",
  },
  {
    title: "競合店ばかりが目立つ",
    body: "検索やおすすめで他店が上位に出て、自店が埋もれてしまう。",
  },
  {
    title: "運用に時間が取れない",
    body: "現場業務でSNS更新が後回しになり、投稿が途切れがち。",
  },
  {
    title: "何を投稿すべきか分からない",
    body: "メニュー写真だけでは飽きられ、企画に困っている。",
  },
  {
    title: "社内に知識を持つ者がいない",
    body: "SNSの必要性を感じるが上手く運用できていない。",
  },
  {
    title: "口コミ・評価が気になる",
    body: "低評価やコメントへの対応に悩み、ブランドイメージが心配。",
  },
] as const;

const diagnosisItems = [
  {
    icon: Search,
    title: "検索・発見のしやすさ",
    text: "地域・ジャンルで見つけてもらえるかをチェックします。",
  },
  {
    icon: Camera,
    title: "ビジュアル・世界観",
    text: "写真・動画・トーンが来店意欲を高めているか分析します。",
  },
  {
    icon: Hash,
    title: "ハッシュタグ・投稿設計",
    text: "タグ選定と投稿リズムが集客導線に合っているかを見ます。",
  },
  {
    icon: BarChart3,
    title: "エンゲージの質",
    text: "保存・シェア・コメントなど、反応の中身を評価します。",
  },
  {
    icon: TrendingUp,
    title: "来店・予約への導線",
    text: "プロフィールからアクセス・問い合わせまで繋がっているか確認します。",
  },
] as const;

const q1CategoryOptions = [
  "居酒屋",
  "バル",
  "焼肉",
  "ステーキ",
  "カフェ",
  "喫茶",
  "スイーツ",
  "ベーカリー",
  "ラーメン",
  "うどん",
  "そば",
  "イタリアン",
  "フレンチ",
  "洋食",
  "和食",
  "寿司",
  "韓国料理",
  "キッチンカー",
  "その他",
] as const;

type ChoiceQuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q8_area";

type SingleChoiceId = "q1" | "q2" | "q3" | "q6";

type MultiChoiceField = "q4" | "q5" | "q8_area";

type QuestionDef = {
  id: ChoiceQuestionId;
  q: string;
  options: string[];
};

const questions: QuestionDef[] = [
  {
    id: "q1",
    q: "Q1. お店のカテゴリーに最も近いものは？",
    options: [...q1CategoryOptions],
  },
  {
    id: "q2",
    q: "Q2. Instagramは運用していますか？",
    options: ["毎日更新している", "週に数回", "月に数回", "ほぼ更新していない", "アカウントがない"],
  },
  {
    id: "q3",
    q: "Q3. １ヶ月の投稿回数の目安は？",
    options: ["20回以上", "10〜19回", "5〜9回", "1〜4回", "ほぼゼロ"],
  },
  {
    id: "q4",
    q: "Q4. いま一番のお悩みは？",
    options: [
      "認知が広がらない",
      "来店・予約に繋がらない",
      "リールが伸びない",
      "コンセプトに迷走している",
      "平日の集客に課題がある",
      "アドバイスだけ聞きたい",
      "その他",
    ],
  },
  {
    id: "q5",
    q: "Q5. 新規来店のきっかけは？",
    options: [
      "Instagram・SNS",
      "Googleマップ（MEO）",
      "食べログ・ホットペッパー等",
      "知人・家族の紹介（口コミ）",
      "通りがかり・看板",
      "チラシ・地域情報誌",
      "テレビ・メディア掲載",
      "ネット広告",
      "よく分からない",
    ],
  },
  {
    id: "q6",
    q: "Q6. Instagram広告は出していますか？",
    options: ["継続して出している", "たまに試す", "これから検討", "出していない"],
  },
];

const areaQuestion: QuestionDef = {
  id: "q8_area",
  q: "Q8. 店舗のエリアは？",
  options: [
    "東京・首都圏",
    "関西",
    "名古屋・東海",
    "北海道",
    "東北",
    "北陸・甲信越",
    "中国・四国",
    "福岡・九州",
    "沖縄",
    "海外",
  ],
};

type FormAnswers = {
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string[];
  q5: string[];
  q6: string | null;
  q8_area: string[];
  storeName: string;
  instagram: string;
  consultation: string;
  email: string;
};

const initialAnswers: FormAnswers = {
  q1: null,
  q2: null,
  q3: null,
  q4: [],
  q5: [],
  q6: null,
  q8_area: [],
  storeName: "",
  instagram: "",
  consultation: "",
  email: "",
};

function isValidEmail(value: string) {
  const t = value.trim();
  if (!t) return false;
  // 簡易チェック（RFC 完全準拠は不要）
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

/** フローティング進捗の表示条件（フォーム到達 or 入力開始） */
function answersHaveProgress(a: FormAnswers): boolean {
  return (
    a.q1 != null ||
    a.q2 != null ||
    a.q3 != null ||
    a.q4.length > 0 ||
    a.q5.length > 0 ||
    a.q6 != null ||
    a.storeName.trim() !== "" ||
    a.q8_area.length > 0 ||
    a.instagram.trim() !== "" ||
    a.consultation.trim() !== "" ||
    a.email.trim() !== ""
  );
}

type FormProgressSnapshot = {
  done: number;
  total: number;
  pct: number;
  nextHint: string;
};

function computeRestaurantFormProgress(a: FormAnswers): FormProgressSnapshot {
  const steps: { ok: boolean; hint: string }[] = [
    { ok: a.q1 != null && a.q1 !== "", hint: "Q1 店舗カテゴリーを選んでください" },
    { ok: a.q2 != null && a.q2 !== "", hint: "Q2 Instagramの運用状況を選んでください" },
    { ok: a.q3 != null && a.q3 !== "", hint: "Q3 月の投稿回数目安を選んでください" },
    { ok: a.q4.length > 0, hint: "Q4 いま一番のお悩みを選んでください" },
    { ok: a.q5.length > 0, hint: "Q5 新規来店のきっかけを選んでください" },
    { ok: a.q6 != null && a.q6 !== "", hint: "Q6 Instagram広告の有無を選んでください" },
    { ok: a.storeName.trim() !== "", hint: "Q7 店舗名を入力してください" },
    { ok: a.q8_area.length > 0, hint: "Q8 店舗のエリアを選んでください" },
    { ok: isValidEmail(a.email), hint: "メールアドレスを入力してください" },
  ];
  const done = steps.filter((s) => s.ok).length;
  const total = steps.length;
  const next = steps.find((s) => !s.ok);
  return {
    done,
    total,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
    nextHint: next ? next.hint : "送信ボタンから無料診断を送れます",
  };
}

const LINE_URL = "https://lin.ee/nl7qUKz";

/** セクション内の見出し・カード列の基準幅を揃える */
const pageContentClass = "mx-auto w-full max-w-[1100px]";
/** フォーム入力は読みやすい幅に収める */
const formFieldsClass = "mx-auto w-full max-w-[720px]";

/**
 * ネイビー直下のピンク帯を角丸で重ねるとき、角丸半径と同じ -mt だけだと
 * サブピクセルでページ背景が線状に透けることがあるため +1px 重ねる。
 * transform で合成レイヤーにして継ぎ目を安定させる。
 */
const pinkOverlapCurveClass =
  "relative z-[1] -mt-[57px] transform-gpu rounded-t-[56px] sm:-mt-[81px] sm:rounded-t-[80px] lg:-mt-[101px] lg:rounded-t-[100px]";
const navyTopCurveClass =
  "relative z-0 transform-gpu rounded-t-[56px] sm:rounded-t-[80px] lg:rounded-t-[100px]";

export function RestaurantDiagnosisClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<FormAnswers>(initialAnswers);
  const [formSectionSeen, setFormSectionSeen] = useState(false);

  useEffect(() => {
    const el = document.getElementById("diagnosis-form");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setFormSectionSeen(true);
      },
      { threshold: 0.06, rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const formProgress = useMemo(() => computeRestaurantFormProgress(answers), [answers]);
  const showProgressFloater = formSectionSeen || answersHaveProgress(answers);

  const allAnswered = useMemo(() => {
    const singlesOk = questions.every(({ id }) => {
      if (id === "q4" || id === "q5") return true;
      const v = answers[id as SingleChoiceId];
      return v != null && v !== "";
    });
    return (
      singlesOk &&
      answers.q4.length > 0 &&
      answers.q5.length > 0 &&
      answers.q8_area.length > 0 &&
      answers.storeName.trim() !== "" &&
      isValidEmail(answers.email)
    );
  }, [answers]);

  const setChoiceAnswer = (id: SingleChoiceId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMultiChoice = (id: MultiChoiceField, value: string) => {
    setAnswers((prev) => {
      const cur = prev[id];
      const has = cur.includes(value);
      const next = has ? cur.filter((x) => x !== value) : [...cur, value];
      return { ...prev, [id]: next };
    });
  };

  const setTextField = (field: "storeName" | "instagram" | "consultation" | "email", value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    try {
      sessionStorage.setItem(RESTAURANT_DIAGNOSIS_THANKS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore quota / private mode */
    }
    try {
      await fetch("/api/restaurant-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
    } catch {
      /* 保存失敗はサンクス遷移を妨げない */
    }
    router.push("/restaurant-diagnosis/thanks");
  };

  return (
    <div className="isolate w-full font-sans text-design-text-primary" style={{ backgroundColor: BG_PINK }}>
      {/* Hero */}
      <section
        className="relative overflow-x-clip px-4 pb-14 pt-[calc(4rem+1.25rem)] sm:px-6 sm:pb-16 sm:pt-[calc(4rem+1.5rem)] lg:px-8 lg:pb-20 lg:pt-[calc(4rem+2rem)]"
        aria-labelledby="hero-restaurant-heading"
      >
        <div className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-[#E1306C]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[#F77737]/10 blur-3xl" />

        <div className={`relative ${pageContentClass} text-center`}>
          <p className="text-sm font-semibold leading-normal text-[#01408D]/90 sm:text-base sm:leading-normal">
            飲食店専門 · Instagram集客診断
          </p>
          <h1
            id="hero-restaurant-heading"
            className={`mx-auto mt-4 max-w-4xl overflow-visible pb-[0.35em] text-[1.65rem] font-extrabold leading-snug sm:text-3xl sm:leading-snug md:text-4xl md:leading-snug lg:text-[2.5rem] lg:leading-snug ${igTitleClass}`}
          >
            「いいね」で終わらせない。
            <br />
            来店につながるInstagramへ
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-design-text-secondary sm:text-base">
            忙しいオーナー様向けに、集客のボトルネックを可視化。
            外食・飲食で<strong className="text-design-text-primary">100店舗以上</strong>
            の支援実績をもとに、貴店のSNSを無料でチェックします。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#diagnosis-form"
              className={`inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full bg-[#01408D] px-8 py-3.5 text-sm font-bold text-white shadow-md sm:w-auto sm:max-w-none ${floatInteractive}`}
            >
              無料診断フォームへ
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/?diagnosis=1"
              className={`inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full border-2 border-[#01408D]/25 bg-white px-8 py-3.5 text-sm font-bold text-[#01408D] shadow-sm sm:w-auto sm:max-w-none ${floatInteractive}`}
            >
              Instagram集客診断（ID分析）
            </Link>
          </div>
        </div>
      </section>

      {/* Pain — パステルカード */}
      <section
        className="px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8"
        aria-labelledby="pain-heading"
      >
        <div className={pageContentClass}>
          <h2
            id="pain-heading"
            className={`text-center text-xl font-extrabold sm:text-2xl md:text-3xl ${igTitleClass}`}
          >
            こんなお悩み、ありませんか？
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-design-text-secondary sm:text-base">
            現場とSNSの両立は難しいもの。多くの飲食店様が同じ課題を抱えています。
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {painPoints.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-design-soft transition hover:shadow-design-soft-hover sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCE7EF] text-[#E1306C]">
                    <CircleHelp className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-cocomarke-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-design-text-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Educational — ネイビー + 曲線（下のピンクの角丸と同じ半径で重ねると隙間が出ない） */}
      <section
        className={`${navyTopCurveClass} w-full bg-gradient-to-b from-[#01408D] to-[#001A3D] px-4 pb-24 pt-16 text-white sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pb-36 lg:pt-20`}
        aria-labelledby="flow-heading"
      >
        <div className={pageContentClass}>
          <h2
            id="flow-heading"
            className="text-center text-xl font-extrabold text-white sm:text-2xl md:text-3xl"
          >
            Instagramから来店までの流れ
          </h2>

          <div className="mt-12 flex flex-col items-center gap-12 sm:mt-14 sm:gap-14">
            <InstagramToVisitFlowSection />

            <div className="mx-auto w-full max-w-2xl space-y-4 text-center text-base leading-relaxed text-white/90 sm:text-[17px]">
              <p>
                診断では、各ステップで<strong className="text-white">改善の余地があるポイント</strong>
                を洗い出し、優先順位をつけてご提案します。
              </p>
              <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-left sm:text-center">
                飲食店では「見た目の美味しさ」と「立地・予約のしやすさ」がセットで重要です。投稿だけでなく、プロフィールと導線まで見ます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services — パステルに戻す + 曲線 */}
      <section
        className={`${pinkOverlapCurveClass} w-full px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20`}
        style={{ backgroundColor: BG_PINK }}
        aria-labelledby="services-heading"
      >
        <div className={pageContentClass}>
          <h2
            id="services-heading"
            className={`text-center text-xl font-extrabold sm:text-2xl md:text-3xl ${igTitleClass}`}
          >
            無料診断でチェックする5項目
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-design-text-secondary sm:text-base">
            アカウントの「今」を把握し、次の一手が見えやすくなります。
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-5 xl:gap-4">
            {diagnosisItems.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex flex-col rounded-2xl border border-white/90 bg-white p-5 shadow-design-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E1306C]/15 to-[#F77737]/15 text-[#01408D]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-bold text-cocomarke-navy">{title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-design-text-secondary">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Profile */}
      <section
        className={`${navyTopCurveClass} w-full bg-gradient-to-b from-[#01408D] to-[#001A3D] px-4 pb-24 pt-14 text-white sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-36`}
        aria-labelledby="profile-heading"
      >
        <div className={`grid ${pageContentClass} grid-cols-1 gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-start lg:gap-14`}>
          <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-white/20 shadow-inner sm:h-44 sm:w-44">
            <Image
              src="/images/yamazaki-profile.png"
              alt="山崎"
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 160px, 176px"
              priority
            />
          </div>
          <div className="min-w-0">
            <h2 id="profile-heading" className="text-xl font-extrabold text-white sm:text-2xl">
              山崎{" "}
              <span className="text-base font-semibold text-white/80 sm:text-lg">
                （マーケティング担当）
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-[15px]">
              飲食・外食領域に特化し、集客戦略立案から来店導線設計・改善までを一気通貫で支援しています。多店舗チェーンから個店まで、業態特性・商圏データ・顧客行動を踏まえた戦略設計から、Instagramアカウントの運用支援まで一貫して行ってきました。
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-[15px]">
              単発施策ではなく、各接点におけるユーザー行動を分解・最適化し、継続的に成果へつながる集客モデルの構築を得意としています。
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <li className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
                <Users className="h-4 w-4 shrink-0 text-[#F77737]" aria-hidden />
                飲食店支援 <strong className="text-white">100店舗以上</strong>
              </li>
              <li className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#F77737]" aria-hidden />
                地域特性に合わせた集客設計
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        id="diagnosis-form"
        className={`${pinkOverlapCurveClass} w-full px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8`}
        style={{ backgroundColor: BG_PINK }}
        aria-labelledby="form-heading"
      >
        <div className={pageContentClass}>
          <h2
            id="form-heading"
            className={`text-center text-xl font-extrabold sm:text-2xl md:text-3xl ${igTitleClass}`}
          >
            SNS集客無料診断フォーム
          </h2>
          <p className="mt-3 text-center text-sm text-design-text-secondary sm:text-base">
            所要時間は約3分です。選択式の設問と、店舗名・メールなどのご記入にお答えください。
          </p>

          <div className={`${formFieldsClass} mt-10`}>
            <form onSubmit={handleSubmit} className="space-y-10">
              {questions.map(({ id, q, options }) => {
                const isMulti = id === "q4" || id === "q5";
                const legendText = isMulti ? `${q}（複数選択可）` : q;
                return (
                  <fieldset key={id} className="rounded-2xl border border-white/90 bg-white/95 p-5 shadow-design-soft sm:p-6">
                    <legend className="mb-4 w-full text-left text-sm font-bold text-cocomarke-navy sm:text-base">
                      {legendText}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const selected = isMulti
                          ? answers[id as MultiChoiceField].includes(opt)
                          : answers[id as SingleChoiceId] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              isMulti
                                ? toggleMultiChoice(id as MultiChoiceField, opt)
                                : setChoiceAnswer(id as SingleChoiceId, opt)
                            }
                            className={`min-h-[44px] max-w-full rounded-full border px-4 py-2.5 text-left text-xs font-medium leading-snug transition sm:text-sm ${
                              selected
                                ? "border-[#01408D] bg-[#01408D] text-white shadow-md"
                                : "border-slate-200 bg-white text-design-text-primary hover:border-[#01408D]/40"
                            } ${floatInteractive}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}

              <fieldset className="rounded-2xl border border-white/90 bg-white/95 p-5 shadow-design-soft sm:p-6">
                <legend className="mb-4 w-full text-left text-sm font-bold text-cocomarke-navy sm:text-base">
                  Q7. 店舗名
                </legend>
                <input
                  type="text"
                  name="storeName"
                  autoComplete="organization"
                  value={answers.storeName}
                  onChange={(e) => setTextField("storeName", e.target.value)}
                  placeholder="例：COCOカフェ 渋谷店"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-design-text-primary outline-none ring-[#01408D]/30 transition focus:border-[#01408D] focus:ring-2"
                />
              </fieldset>

              <fieldset className="rounded-2xl border border-white/90 bg-white/95 p-5 shadow-design-soft sm:p-6">
                <legend className="mb-4 w-full text-left text-sm font-bold text-cocomarke-navy sm:text-base">
                  {areaQuestion.q}（複数選択可）
                </legend>
                <div className="flex flex-wrap gap-2">
                  {areaQuestion.options.map((opt) => {
                    const selected = answers.q8_area.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleMultiChoice("q8_area", opt)}
                        className={`min-h-[44px] max-w-full rounded-full border px-4 py-2.5 text-left text-xs font-medium leading-snug transition sm:text-sm ${
                          selected
                            ? "border-[#01408D] bg-[#01408D] text-white shadow-md"
                            : "border-slate-200 bg-white text-design-text-primary hover:border-[#01408D]/40"
                        } ${floatInteractive}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="rounded-2xl border border-white/90 bg-white/95 p-5 shadow-design-soft sm:p-6">
                <legend className="mb-4 w-full text-left text-sm font-bold text-cocomarke-navy sm:text-base">
                  Q9. Instagramアカウント・相談内容（任意）
                </legend>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="restaurant-ig" className="mb-2 block text-xs font-semibold text-design-text-secondary">
                      Instagramアカウント
                    </label>
                    <input
                      id="restaurant-ig"
                      type="text"
                      name="instagram"
                      autoComplete="username"
                      value={answers.instagram}
                      onChange={(e) => setTextField("instagram", e.target.value)}
                      placeholder="@から入力可（任意）"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-design-text-primary outline-none ring-[#01408D]/30 transition focus:border-[#01408D] focus:ring-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="restaurant-consult" className="mb-2 block text-xs font-semibold text-design-text-secondary">
                      相談内容
                    </label>
                    <textarea
                      id="restaurant-consult"
                      name="consultation"
                      rows={4}
                      value={answers.consultation}
                      onChange={(e) => setTextField("consultation", e.target.value)}
                      placeholder="ご相談内容があればご記入ください（任意）"
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-design-text-primary outline-none ring-[#01408D]/30 transition focus:border-[#01408D] focus:ring-2"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="rounded-2xl border border-white/90 bg-white/95 p-5 shadow-design-soft sm:p-6">
                <legend className="mb-4 w-full text-left text-sm font-bold text-cocomarke-navy sm:text-base">
                  メールアドレス（必須）
                </legend>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={answers.email}
                  onChange={(e) => setTextField("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-design-text-primary outline-none ring-[#01408D]/30 transition focus:border-[#01408D] focus:ring-2"
                />
                <p className="mt-2 text-xs text-design-text-secondary">診断結果・ご連絡に使用します。</p>
              </fieldset>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="submit"
                  disabled={!allAnswered}
                  className={`inline-flex min-h-[52px] w-full max-w-md items-center justify-center rounded-full bg-gradient-to-r from-[#E1306C] to-[#F77737] px-10 py-3.5 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-lg sm:w-auto ${floatInteractive}`}
                >
                  無料診断を送信する
                </button>
              </div>

              <div className="rounded-2xl border border-dashed border-[#01408D]/25 bg-white/60 p-6 text-center">
                <p className="text-sm font-semibold text-cocomarke-navy">
                  LINEでそのまま相談したい方へ
                </p>
                <p className="mt-2 text-xs text-design-text-secondary sm:text-sm">
                  友だち追加後、チャットで気軽にご相談ください。
                </p>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full bg-[#06C755] px-6 py-3.5 text-sm font-bold text-white shadow-md sm:w-auto ${floatInteractive}`}
                >
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden />
                  LINEで相談（COCOマーケ公式）
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showProgressFloater ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-5 sm:justify-end sm:pb-6"
          aria-live="polite"
        >
          <div
            className="pointer-events-auto w-full max-w-[min(100%,22rem)] rounded-2xl border border-white/90 bg-white/95 p-4 shadow-[0_12px_40px_-8px_rgba(1,64,141,0.35)] backdrop-blur-sm transition-shadow duration-200 ease-out hover:shadow-[0_16px_48px_-10px_rgba(1,64,141,0.42)] sm:max-w-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E1306C]/12 to-[#F77737]/12 text-[#01408D]">
                <ClipboardList className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#01408D]/80">入力の進捗</p>
                <p className="mt-0.5 text-sm font-bold text-cocomarke-navy">
                  {formProgress.done}/{formProgress.total} 完了
                  <span className="ml-1.5 font-semibold text-design-text-secondary">（{formProgress.pct}%）</span>
                </p>
                <p className="mt-1.5 text-xs leading-snug text-design-text-secondary">{formProgress.nextHint}</p>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={formProgress.pct}
                  aria-label={`フォーム入力 ${formProgress.pct}パーセント完了`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E1306C] to-[#F77737] transition-[width] duration-500 ease-out"
                    style={{ width: `${formProgress.pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
