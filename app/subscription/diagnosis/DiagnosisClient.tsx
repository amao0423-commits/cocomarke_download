"use client";

import { useState } from "react";
import { JemiaHeader, JemiaFooter } from "../_components/JemiaChrome";

// かんたんプランニング（旧プラン診断を差し替え）
//   STEP1: 5つの質問＋補足。総合資料もこの画面からダウンロード可能。
//   STEP2: 送付先（メール・アカウントID・同意）
//   STEP3: おすすめプラン＋業種別事例＋お申し込み/資料への導線
// 送信は /api/planning（Brevo）へ。回答者にはおすすめプランの案内メールが届く。

const APPLY_URL = "/subscription/apply";
const DOC_URL = "/docs/plan-overview.pdf"; // 総合資料（ブラウザで直接プレビュー）
const CONTACT_URL = "/subscription#contact";

type QKey = "industry" | "issue" | "status" | "time" | "budget";

const QUESTIONS: { key: QKey; no: number; title: string; cols: string; options: { value: string; label: string }[] }[] = [
  {
    key: "industry", no: 1, title: "業種を教えてください", cols: "sm:grid-cols-3",
    options: [
      { value: "food", label: "飲食店" }, { value: "beauty", label: "美容・サロン" }, { value: "retail", label: "小売・EC" },
      { value: "school", label: "教室・スクール" }, { value: "service", label: "サービス業" }, { value: "other", label: "その他" },
    ],
  },
  {
    key: "issue", no: 2, title: "いま一番の悩みは？", cols: "sm:grid-cols-2",
    options: [
      { value: "reach", label: "新規の人に知られていない" },
      { value: "convert", label: "フォロワーは増えても集客につながらない" },
      { value: "time", label: "投稿する時間がない" },
      { value: "howto", label: "何をすればいいか分からない" },
    ],
  },
  {
    key: "status", no: 3, title: "アカウントの状況は？", cols: "sm:grid-cols-2",
    options: [
      { value: "none", label: "まだ無い・作りたて" }, { value: "new", label: "始めたばかり" },
      { value: "stuck", label: "運用中だが伸び悩み" }, { value: "growing", label: "ある程度伸びている" },
    ],
  },
  {
    key: "time", no: 4, title: "運用に割ける時間は？", cols: "sm:grid-cols-3",
    options: [
      { value: "none", label: "ほぼ取れない" }, { value: "little", label: "少しなら取れる" }, { value: "enough", label: "それなりに取れる" },
    ],
  },
  {
    key: "budget", no: 5, title: "月の予算感は？", cols: "sm:grid-cols-2",
    options: [
      { value: "b1", label: "〜1万円" }, { value: "b3", label: "1〜3万円" }, { value: "b5", label: "3〜5万円" }, { value: "b5over", label: "5万円以上・未定" },
    ],
  },
];

const PLANS = {
  like: { name: "いいね代行プラン", price: "9,800", why: "ターゲット層への自動いいねで認知の入口をつくり、投稿の反応を底上げします。まず低コストで「見つけてもらう」土台づくりに最適です。" },
  boost: { name: "人気・おすすめ投稿表示プラン", price: "19,800", why: "おすすめ・発見タブへの露出を強化し、新規リーチを最大化します。新規に知られたい方に最も効果的なプランです。" },
  set: { name: "セットプラン", price: "24,980", why: "いいね代行と人気・おすすめ投稿表示を組み合わせ、認知拡大とリーチを両立。伸び悩みを抜け出したい方に人気No.1の組み合わせです。" },
  rank: { name: "アカウント上位表示プラン", price: "29,800", why: "狙ったキーワードでの検索上位を押し上げ、「エリア×業種」で見つけられる状態をつくります。指名・地域集客の強化に。" },
  premium: { name: "プレミアムプラン", price: "49,800", why: "投稿代行を含めた専任担当が、戦略から実行までまるごと伴走。手間をかけずに、任せるだけで成果につながる運用が回ります。" },
} as const;
type PlanKey = keyof typeof PLANS;

function recommend(ans: Record<QKey, string>): { plan: PlanKey; note?: string } {
  // ※プレミアムは診断では自動推奨しない（要相談枠）。推奨は like/boost/set/rank。
  const cap = ({ b1: 1, b3: 3, b5: 5, b5over: 99 } as Record<string, number>)[ans.budget] ?? 99;
  let plan: PlanKey;
  let note: string | undefined;
  if (ans.issue === "reach") plan = "boost";
  else if (ans.issue === "convert") plan = "set";
  else if (ans.issue === "time") {
    plan = "set";
    note = "投稿制作までお任せになりたい場合は、投稿制作オプションの追加や、専任担当が伴走するプレミアムプラン（要相談）もご案内できます。";
  } else plan = "set";

  const pm = (k: PlanKey) => Math.ceil(Number(PLANS[k].price.replace(/,/g, "")) / 10000);
  if (pm(plan) > cap) {
    const order: PlanKey[] = ["like", "boost", "set", "rank"];
    const aff = order.filter((k) => pm(k) <= cap);
    if (aff.length) {
      plan = aff[aff.length - 1];
      note = "ご予算に合わせたプランをご提案しています。ご相談いただければ、目的に応じた組み合わせもご案内できます。";
    } else plan = "like";
  }
  if (ans.status === "none") note = "アカウント開設からのサポートも可能です。まずは基礎づくりからご相談ください。";
  return { plan, note };
}

const STEPS = ["ご希望を選ぶ", "送付先を入力", "結果を見る"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DiagnosisClient() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<QKey, string>>({ industry: "", issue: "", status: "", time: "", budget: "" });
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [accId, setAccId] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; consent?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ plan: PlanKey; note?: string } | null>(null);

  const allAnswered = QUESTIONS.every((q) => answers[q.key]);

  function pick(key: QKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }
  function go(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goToContact() {
    if (allAnswered) go(2);
  }

  async function handleSubmit() {
    const emailOk = EMAIL_RE.test(email);
    setErrors({ email: !emailOk, consent: !consent });
    if (!emailOk || !consent) return;

    setSubmitting(true);
    const rec = recommend(answers);
    // 送信（失敗しても結果は表示する）
    try {
      await fetch("/api/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, note, email, accId, plan: rec.plan }),
      });
    } catch {
      /* 送信失敗でも結果表示は継続 */
    }
    setResult(rec);
    setSubmitting(false);
    go(3);
  }

  function reset() {
    setAnswers({ industry: "", issue: "", status: "", time: "", budget: "" });
    setNote(""); setEmail(""); setAccId(""); setConsent(false);
    setErrors({}); setResult(null);
    go(1);
  }

  return (
    <>
      <JemiaHeader />

      <div className="min-h-screen bg-slate-50 text-slate-800 [text-wrap:pretty]">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          {/* ヘッダー */}
          <header className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F5ED] px-4 py-1.5 text-xs font-bold text-[#2D7A4F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF75]" />1分で完了・無料
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">かんたんプランニング</h1>
            <p className="mt-3 leading-loose text-slate-600">
              5つの質問に答えるだけで、あなたに合うプランと、<br className="hidden sm:block" />
              サービス資料・お申し込みのご案内をお届けします。
            </p>
          </header>

          {/* ステップインジケーター */}
          <ol className="mt-8 flex items-center justify-center gap-2 text-xs font-bold sm:gap-3">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <li key={label} className="flex items-center gap-2 sm:gap-3">
                  <span className={"flex items-center gap-2 rounded-full px-3 py-1.5 " + (active ? "bg-[#2D7A4F] text-white" : done ? "bg-[#E8F5ED] text-[#2D7A4F]" : "bg-slate-100 text-slate-400")}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[11px]">{done ? "✓" : n}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                  {i < STEPS.length - 1 && <span aria-hidden className="text-[#9FD3B6]">›</span>}
                </li>
              );
            })}
          </ol>

          {/* STEP1: 質問 */}
          {step === 1 && (
            <div className="mt-8 space-y-4">
              {QUESTIONS.map((q) => (
                <fieldset key={q.key} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <legend className="flex items-center gap-2.5 px-1">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D7A4F] text-sm font-bold text-white">{q.no}</span>
                    <span className="text-base font-bold text-slate-900">{q.title}</span>
                    <span className="text-xs text-rose-500">必須</span>
                  </legend>
                  <div className={"mt-4 grid grid-cols-2 gap-2.5 " + q.cols}>
                    {q.options.map((o) => {
                      const active = answers[q.key] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => pick(q.key, o.value)}
                          className={"rounded-xl border px-3 py-3.5 text-sm font-medium transition " + (active ? "border-[#2D7A4F] bg-[#E8F5ED] text-[#1A5C37] ring-1 ring-[#2D7A4F]" : "border-slate-200 text-slate-700 hover:border-[#9FD3B6] hover:bg-[#E8F5ED]/40")}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              {/* 補足（任意） */}
              <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <legend className="flex items-center gap-2.5 px-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D7A4F] text-sm font-bold text-white">6</span>
                  <span className="text-base font-bold text-slate-900">補足・ご要望はありますか？</span>
                  <span className="text-xs text-slate-400">任意</span>
                </legend>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="現在の運用状況やご要望などがあればご記入ください。"
                  className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                />
              </fieldset>

              <button
                type="button"
                onClick={goToContact}
                disabled={!allAnswered}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2D7A4F] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1A5C37] disabled:cursor-not-allowed disabled:opacity-50"
              >
                送付先の入力へ進む <span aria-hidden>→</span>
              </button>
              {!allAnswered && <p className="text-center text-xs text-slate-400">必須項目（1〜5）をすべて選んでください。</p>}

              {/* 総合資料ダウンロードの小さな明記 */}
              <p className="pt-1 text-center text-xs text-slate-400">
                全プランをまとめた
                <a href={DOC_URL} target="_blank" rel="noopener" className="font-medium text-[#2D7A4F] underline underline-offset-2 hover:text-[#1A5C37]">総合資料</a>
                も、こちらからご覧いただけます。
              </p>
            </div>
          )}

          {/* STEP2: 送付先 */}
          {step === 2 && (
            <div className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900">結果と資料の送付先</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  診断結果はこの画面で表示されます。あわせて、おすすめプランのご案内・サービス資料・お申し込みのご案内をメールでお送りします。
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="pl-email" className="block text-sm font-medium text-slate-700">メールアドレス <span className="text-rose-500">*</span></label>
                    <input
                      id="pl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-rose-600">正しいメールアドレスをご入力ください。</p>}
                  </div>

                  <div>
                    <label htmlFor="pl-acc" className="block text-sm font-medium text-slate-700">InstagramアカウントID（＝ ユーザーネーム）<span className="text-slate-400">任意</span></label>
                    <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-[#2D7A4F] focus-within:ring-1 focus-within:ring-[#2D7A4F]">
                      <span className="text-slate-400">@</span>
                      <input id="pl-acc" type="text" value={accId} onChange={(e) => setAccId(e.target.value)} placeholder="your_account" className="w-full px-2 py-2.5 text-sm focus:outline-none" />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">ご記入いただくと、より具体的なご提案が可能です。</p>
                  </div>

                  <label className="flex items-start gap-2.5 text-sm text-slate-600">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                    <span>診断目的での連絡・資料送付に同意します（しつこい営業はありません）。</span>
                  </label>
                  {errors.consent && <p className="-mt-2 text-xs text-rose-600">同意にチェックを入れてください。</p>}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D7A4F] px-6 py-3.5 font-bold text-white transition hover:bg-[#1A5C37] disabled:opacity-60 sm:flex-1">
                    {submitting ? "送信中…" : "結果を見る →"}
                  </button>
                  <button type="button" onClick={() => go(1)} className="w-full whitespace-nowrap rounded-xl border border-slate-300 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto">戻る</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP3: 結果 */}
          {step === 3 && result && (
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl bg-[#123524] p-7 text-center text-white sm:p-9">
                <p className="text-xs font-bold tracking-widest text-[#9FD3B6]">RECOMMENDED PLAN</p>
                <p className="mt-3 text-sm text-[#E8F5ED]">あなたへのおすすめプランは</p>
                <p className="mt-2 text-2xl font-bold sm:text-3xl">{PLANS[result.plan].name}</p>
                <p className="mt-3 inline-block rounded-full bg-white/15 px-5 py-1.5 text-lg font-bold text-white">月額 {PLANS[result.plan].price} 円（税込）〜</p>
                <p className="mx-auto mt-5 max-w-md text-sm leading-loose text-[#E8F5ED]">{PLANS[result.plan].why}</p>
              </div>

              {result.note && (
                <div className="rounded-xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">{result.note}</div>
              )}

              <div className="rounded-xl bg-[#E8F5ED] px-5 py-4 text-sm leading-relaxed text-slate-700">
                ご入力のメールアドレス宛に、<b>おすすめプランのご案内</b>と<b>サービス資料・お申し込みのご案内</b>をお送りしました。
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={APPLY_URL} className="flex-1 rounded-xl bg-[#FF6633] px-6 py-3.5 text-center font-bold text-white transition hover:bg-[#E5551F]">このプランで申し込む →</a>
                <a href={DOC_URL} target="_blank" rel="noopener" className="flex-1 rounded-xl border border-slate-300 px-6 py-3.5 text-center font-bold text-slate-700 transition hover:bg-slate-50">総合資料を見る</a>
              </div>
              <p className="text-center text-xs text-slate-400">
                お申し込みは月額固定・契約縛りなし・初期費用0円。まず相談したい方は{" "}
                <a href={CONTACT_URL} className="text-[#2D7A4F] underline underline-offset-4">こちら</a>からどうぞ。
              </p>

              <div className="text-center">
                <button type="button" onClick={reset} className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-700">もう一度診断する</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <JemiaFooter />
    </>
  );
}
