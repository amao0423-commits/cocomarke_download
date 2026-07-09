"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";
import { APPLY_PLANS, APPLY_OPTIONS, priceToNumber, numberToPrice } from "./plans";

// ────────────────────────────────────────────────────────────────
// JEMIA お申し込み（オンボーディング）。専用URL /subscription/apply に表示。
//   - ?plan=<プラン名> があれば初期選択（プランカード経由）
//   - 無ければ顧客がプランを選択（受付枠バー経由）。複数選択可。
//   - 最終送信で /api/onboarding へ POST（Slack通知＋確認メール）。
// ────────────────────────────────────────────────────────────────

const HOME = "/subscription";
const SHINDAN_URL =
  "https://www.cocomake-guide.com/shindan.html?utm_source=onboarding&utm_medium=web&utm_campaign=account_check";

const PAYMENTS = [
  { id: "paypay", label: "PayPay" },
  { id: "bank", label: "口座振込" },
  { id: "card", label: "クレジットカード" },
];

const STEPS = ["内容確認", "同意", "開始日・お支払い方法", "アカウント情報", "お申し込み"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// 土日を含めて3日後。ただし土日に当たる場合は翌月曜（例: 金曜→次の月曜）
function minStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const day = d.getDay();
  if (day === 6) d.setDate(d.getDate() + 2);      // 土 → 月
  else if (day === 0) d.setDate(d.getDate() + 1); // 日 → 月
  return toYMD(d);
}
function isWeekendStr(s: string): boolean {
  if (!s) return false;
  const day = new Date(s + "T00:00:00").getDay();
  return day === 0 || day === 6;
}

export default function OnboardingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = params.get("plan");

  const [step, setStep] = useState(1); // 1..5、6=完了
  const [selectedPlans, setSelectedPlans] = useState<string[]>(
    initialPlan && APPLY_PLANS.some((p) => p.name === initialPlan) ? [initialPlan] : []
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [payment, setPayment] = useState<string>("");
  const [email, setEmail] = useState("");
  const [accountStatus, setAccountStatus] = useState<"has" | "none" | "planning">("has");
  const [accounts, setAccounts] = useState<string[]>([""]);
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const go = (n: number) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const leave = () => router.push(HOME);

  const totalNumber = useMemo(() => {
    const plansSum = selectedPlans.reduce((sum, name) => {
      const p = APPLY_PLANS.find((x) => x.name === name);
      return sum + (p ? priceToNumber(p.price) : 0);
    }, 0);
    const optSum = selectedOptions.reduce((sum, id) => sum + (APPLY_OPTIONS.find((o) => o.id === id)?.price ?? 0), 0);
    return plansSum + optSum;
  }, [selectedPlans, selectedOptions]);
  const totalLabel = numberToPrice(totalNumber);

  const togglePlan = (name: string) =>
    setSelectedPlans((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  // 同じ group（例：投稿制作）は片方だけ選択にする
  const toggleOption = (id: string) => {
    const opt = APPLY_OPTIONS.find((o) => o.id === id);
    setSelectedOptions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const base = opt?.group
        ? prev.filter((x) => APPLY_OPTIONS.find((o) => o.id === x)?.group !== opt.group)
        : prev;
      return [...base, id];
    });
  };
  const selectedOptionNames = selectedOptions
    .map((id) => APPLY_OPTIONS.find((o) => o.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  // Instagramのユーザーネームで使える文字（英数字・ピリオド・アンダースコア）のみ許可
  const updateAccount = (i: number, value: string) =>
    setAccounts((prev) => prev.map((a, idx) => (idx === i ? value.replace(/[^A-Za-z0-9._]/g, "") : a)));
  const addAccount = () => setAccounts((prev) => [...prev, ""]);
  const removeAccount = (i: number) => setAccounts((prev) => prev.filter((_, idx) => idx !== i));

  const minStart = useMemo(() => minStartDate(), []);
  const startDateInvalid = startDate !== "" && (isWeekendStr(startDate) || startDate < minStart);
  const step4Ok = EMAIL_RE.test(email) && (accountStatus !== "has" || accounts.some((a) => a.trim()));

  async function handleApply() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plans: selectedPlans,
          options: selectedOptionNames,
          total: totalLabel,
          startDate,
          payment: PAYMENTS.find((p) => p.id === payment)?.label || payment,
          email,
          accountStatus,
          accounts: accounts.filter((a) => a.trim()),
        }),
      });
    } catch {
      /* 通知失敗でも申込フローは完了扱い（サーバー側でログ） */
    } finally {
      setSubmitting(false);
      go(6);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 [text-wrap:pretty]">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
        {/* ヘッダー */}
        <header className="relative text-center">
          <button
            type="button"
            onClick={leave}
            aria-label="閉じる"
            className="absolute right-0 top-0 rounded-full bg-white p-2 text-slate-400 shadow-sm hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
          <p className="text-sm font-medium text-[#2D7A4F]">JEMIA お申し込み手続き</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">お申し込み手続き</h1>
          {step <= 5 && (
            <p className="mt-3 leading-loose text-slate-600">
              あと少しで運用スタートできます。上から順にお進みください（所要 約5分）。
            </p>
          )}
        </header>

        {/* 進捗バー */}
        {step <= 5 && (
          <ol className="mt-8 flex items-center justify-between">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const current = step === n;
              return (
                <li key={label} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && <div className={"h-0.5 flex-1 " + (step > i ? "bg-[#4CAF75]" : "bg-slate-200")} />}
                    <div
                      className={
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                        (done ? "bg-[#4CAF75] text-white" : current ? "bg-[#2D7A4F] text-white ring-4 ring-[#E8F5ED]" : "bg-slate-200 text-slate-500")
                      }
                    >
                      {done ? "✓" : n}
                    </div>
                    {i < STEPS.length - 1 && <div className={"h-0.5 flex-1 " + (step > n ? "bg-[#4CAF75]" : "bg-slate-200")} />}
                  </div>
                  <span className={"mt-2 hidden text-[11px] leading-tight sm:block " + (current ? "font-bold text-[#2D7A4F]" : "text-slate-500")}>{label}</span>
                </li>
              );
            })}
          </ol>
        )}

        {/* 本体カード */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* STEP 1: 内容確認（プラン選択） */}
          {step === 1 && (
            <section>
              <StepTitle no="STEP 1 / 5">お申し込み内容をご確認ください</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">ご希望のプランをお選びください（複数選択できます）。</p>
              <div className="mt-5 space-y-2">
                {APPLY_PLANS.map((p) => {
                  const checked = selectedPlans.includes(p.name);
                  return (
                    <label
                      key={p.name}
                      className={
                        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-sm " +
                        (checked ? "border-[#2D7A4F] bg-[#E8F5ED]" : "border-slate-200 hover:border-slate-300")
                      }
                    >
                      <span className="flex items-center gap-3">
                        <input type="checkbox" checked={checked} onChange={() => togglePlan(p.name)} className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                        <span>
                          <span className="block font-medium text-slate-800">{p.name}</span>
                          {p.note && <span className="block text-xs text-slate-400">{p.note}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 font-bold text-slate-700">{p.price} 円<span className="text-xs font-normal text-slate-400">/月</span></span>
                    </label>
                  );
                })}
              </div>

              {/* オプション（任意） */}
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700">オプション（任意）</p>
                <div className="mt-2 space-y-2">
                  {APPLY_OPTIONS.map((o) => {
                    const checked = selectedOptions.includes(o.id);
                    return (
                      <label
                        key={o.id}
                        className={
                          "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-sm " +
                          (checked ? "border-[#2D7A4F] bg-[#E8F5ED]" : "border-slate-200 hover:border-slate-300")
                        }
                      >
                        <span className="flex items-center gap-3">
                          <input type="checkbox" checked={checked} onChange={() => toggleOption(o.id)} className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                          <span className="font-medium text-slate-800">{o.name}</span>
                        </span>
                        <span className="shrink-0 font-bold text-slate-700">{o.priceLabel}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-slate-400">※「複数アカウント割」は2つ目以降のアカウントに適用されます（上の合計には反映していません）。</p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-3 text-sm">
                <span className="text-slate-500">合計月額（税込）</span>
                <span className="text-base font-bold text-[#2D7A4F]">{totalLabel} 円</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                プレミアムプランをご希望の場合は{" "}
                <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">こちらからご相談</button>
                ください。
              </p>
              <PrimaryButton onClick={() => go(2)} disabled={selectedPlans.length === 0}>この内容で進む</PrimaryButton>
            </section>
          )}

          {/* STEP 2: 同意 */}
          {step === 2 && (
            <section>
              <StepTitle no="STEP 2 / 5">ご利用にあたっての確認事項</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">運用を安心して進めるため、以下にご同意ください。</p>
              <div className="mt-5 space-y-5 text-sm leading-relaxed text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">サービス内容について</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>・成果（フォロワー数・順位等）はアカウントや仕様により変動し、特定の数値を保証するものではありません。</li>
                    <li>・アカウントの安全に配慮して運用しますが、Instagramの仕様変更等による影響を完全に排除するものではありません。</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800">お預かりする情報の取り扱い（秘密保持）</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>・お預かりするアカウント情報・素材・お客様情報は、運用および連絡の目的にのみ使用します。</li>
                    <li>・お客様の許可なく第三者に開示・提供することはありません。</li>
                    <li>・解約後は、ご要望に応じてお預かり情報を適切に削除いたします。</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800">お支払い・解約について</p>
                  <ul className="mt-2 space-y-1.5">
                    <li>・初回のお支払い確認後、運用準備を開始します。</li>
                    <li>・解約をご希望の場合は、ご希望月の締め日の5日前までに、ご担当者またはJEMIA運営事務局（info@cocomake-guide.com）へメールにてお申し出ください。締め日の5日前を過ぎた場合は、翌月からの解約となります。</li>
                  </ul>
                </div>
              </div>
              <label className="mt-6 flex items-start gap-3 rounded-xl bg-[#E8F5ED] p-4 text-sm text-slate-700">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                <span>
                  上記の注意事項、
                  <a href="/subscription/terms" target="_blank" className="font-medium text-[#2D7A4F] underline underline-offset-4">利用規約</a>
                  および
                  <a href="/subscription/privacy" target="_blank" className="font-medium text-[#2D7A4F] underline underline-offset-4">プライバシーポリシー</a>
                  ・秘密保持の内容に同意します
                  <span className="mt-1 block text-xs text-slate-400">（同意いただいた日時を記録します）</span>
                </span>
              </label>
              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(1)}>戻る</SecondaryButton>
                <PrimaryButton onClick={() => go(3)} disabled={!agreed}>同意して次へ</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 3: 開始日・お支払い方法 */}
          {step === 3 && (
            <section>
              <StepTitle no="STEP 3 / 5">運用開始日とお支払い方法</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">ご希望の運用開始日とお支払い方法をお選びください。</p>

              <div className="mt-5">
                <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">運用開始日 <span className="text-[#FF6633]">*</span></label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min={minStart}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={
                    "mt-1.5 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 " +
                    (startDateInvalid ? "border-[#FF6633] focus:border-[#FF6633] focus:ring-[#FF6633]" : "border-slate-300 focus:border-[#2D7A4F] focus:ring-[#2D7A4F]")
                  }
                />
                {startDateInvalid ? (
                  <p className="mt-1.5 text-xs text-[#FF6633]">土日は選択できません。最短で {minStart}（3日後）以降の平日をお選びください。</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">最短で {minStart}（3日後）から。土日は選択できません。</p>
                )}
              </div>

              <div className="mt-6">
                <p className="block text-sm font-medium text-slate-700">お支払い方法 <span className="text-[#FF6633]">*</span></p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {PAYMENTS.map((pm) => {
                    const active = payment === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPayment(pm.id)}
                        className={
                          "flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition " +
                          (active ? "border-[#2D7A4F] bg-[#E8F5ED] text-[#1A5C37] ring-1 ring-[#2D7A4F]" : "border-slate-200 text-slate-700 hover:border-slate-300")
                        }
                      >
                        {pm.label}
                        {active && <span className="text-[#2D7A4F]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="ob-note" className="block text-sm font-medium text-slate-700">補足・ご要望（任意）</label>
                <textarea id="ob-note" rows={3} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>

              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(2)}>戻る</SecondaryButton>
                <PrimaryButton onClick={() => go(4)} disabled={!startDate || startDateInvalid || !payment}>次へ</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 4: 連絡先・運用アカウント */}
          {step === 4 && (
            <section>
              <StepTitle no="STEP 4 / 5">ご連絡先と運用アカウント</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">ご連絡用のメールアドレスと、運用するInstagramアカウントの状況をお知らせください。</p>

              <div className="mt-5">
                <label htmlFor="ob-email" className="block text-sm font-medium text-slate-700">メールアドレス <span className="text-[#FF6633]">*</span></label>
                <input
                  id="ob-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                />
              </div>

              <div className="mt-6">
                <p className="block text-sm font-medium text-slate-700">運用するアカウントの状況 <span className="text-[#FF6633]">*</span></p>
                <div className="mt-2 space-y-2">
                  {[
                    { id: "has", label: "既にアカウントがある（IDを入力）" },
                    { id: "planning", label: "これから作成予定" },
                    { id: "none", label: "アカウントがない・未定" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm " +
                        (accountStatus === opt.id ? "border-[#2D7A4F] bg-[#E8F5ED]" : "border-slate-200")
                      }
                    >
                      <input
                        type="radio"
                        name="acc-status"
                        checked={accountStatus === opt.id}
                        onChange={() => setAccountStatus(opt.id as "has" | "none" | "planning")}
                        className="h-4 w-4 text-[#2D7A4F] focus:ring-[#2D7A4F]"
                      />
                      <span className="font-medium text-slate-800">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {accountStatus === "has" && (
                <div className="mt-5 space-y-3">
                  {accounts.map((acc, i) => (
                    <div key={i}>
                      <label htmlFor={`ig-account-${i}`} className="block text-sm font-medium text-slate-700">
                        InstagramアカウントID {accounts.length > 1 ? `（${i + 1}）` : ""}（＠ ユーザーネーム）<span className="text-[#FF6633]">*</span>
                      </label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex flex-1 items-center rounded-lg border border-slate-300 px-3 focus-within:border-[#2D7A4F] focus-within:ring-1 focus-within:ring-[#2D7A4F]">
                          <span className="text-slate-400">@</span>
                          <input
                            id={`ig-account-${i}`}
                            type="text"
                            value={acc}
                            onChange={(e) => updateAccount(i, e.target.value)}
                            placeholder="your_account"
                            className="w-full px-2 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        {accounts.length > 1 && (
                          <button type="button" onClick={() => removeAccount(i)} aria-label="このアカウントを削除" className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">削除</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addAccount} className="text-sm font-medium text-[#2D7A4F] hover:text-[#1A5C37]">＋ アカウントを追加する</button>
                </div>
              )}

              <div className="mt-4 rounded-xl bg-[#E8F5ED] p-4 text-sm leading-relaxed text-slate-600">
                複数アカウントの運用にも対応しています。運用後に追加することも可能です。
              </div>

              {(accountStatus === "none" || accountStatus === "planning") && (
                <div className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
                  アカウントがない状態でも、ご提供できる内容をご提案することは可能です。ただし原則はアカウント作成後のご対応となり、プランによっては最短で1週間後からのスタートでのご案内となる場合があります。
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(3)}>戻る</SecondaryButton>
                <PrimaryButton onClick={() => go(5)} disabled={!step4Ok}>次へ</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 5: 最終確認 */}
          {step === 5 && (
            <section>
              <StepTitle no="STEP 5 / 5">お申し込み内容の最終確認（仮）</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">以下の内容でお申し込みを承ります。内容をご確認のうえ、お進みください。</p>

              <div className="mt-5 rounded-xl border border-[#4CAF75] bg-[#F1F8F4] p-5">
                <p className="text-sm font-bold text-[#1A5C37]">お申し込み内容</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">プラン</dt>
                    <dd className="text-right font-medium">{selectedPlans.join("／") || "—"}</dd>
                  </div>
                  {selectedOptionNames.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-600">オプション</dt>
                      <dd className="text-right font-medium">{selectedOptionNames.join("／")}</dd>
                    </div>
                  )}
                  <div className="flex justify-between"><dt className="text-slate-600">運用開始日（希望）</dt><dd className="font-medium">{startDate || "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-600">お支払い方法</dt><dd className="font-medium">{PAYMENTS.find((p) => p.id === payment)?.label || "—"}</dd></div>
                  <div className="mt-2 flex justify-between border-t border-[#4CAF75] pt-2 text-base">
                    <dt className="font-bold text-slate-800">合計月額（税込）</dt>
                    <dd className="font-bold text-[#2D7A4F]">{totalLabel} 円</dd>
                  </div>
                </dl>
              </div>

              <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                ※運用開始日はあくまでご希望日です。アカウントの状況や営業日の都合により、前後する場合があります。確定日は担当者よりご連絡いたします。
              </p>

              <button onClick={handleApply} disabled={submitting} className="mt-6 block w-full rounded-xl bg-[#FF6633] px-6 py-3.5 text-center font-bold text-white transition hover:bg-[#E5551F] disabled:opacity-60">
                {submitting ? "送信中…" : "この内容で申し込む →"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">まだお支払いは発生しません。担当者による最終確認後に運用準備を開始します。</p>

              <div className="mt-4">
                <SecondaryButton onClick={() => go(4)}>戻る</SecondaryButton>
              </div>
            </section>
          )}

          {/* 完了 */}
          {step === 6 && (
            <section className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5ED] text-3xl text-[#2D7A4F]">✓</div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">お申し込みを受け付けました</h2>
              <p className="mt-3 leading-loose text-slate-600">
                ありがとうございます。お申し込み手続きが完了しました。<br />
                運用開始までの流れは以下のとおりです。
              </p>

              <div className="mt-8">
                {/* モバイルは縦一列（↓・アイコン＋文言を横並びで読みやすく）、sm以上は横4列（›） */}
                <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-stretch sm:justify-between sm:gap-1 sm:text-center">
                  {[
                    { icon: "📋", title: "内容確認", desc: "担当者が申込内容を確認", tone: "bg-[#2D7A4F]" },
                    { icon: "✉️", title: "支払方法の送付", desc: "お支払い方法をメール送付", tone: "bg-[#4CAF75]" },
                    { icon: "💳", title: "お入金の確認", desc: "お入金を確認", tone: "bg-[#4CAF75]" },
                    { icon: "🚀", title: "運用開始", desc: "運用スタート", tone: "bg-[#FF6633]" },
                  ].map((s, i, arr) => (
                    <div key={s.title} className="flex flex-col items-center sm:flex-1 sm:flex-row">
                      <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 shadow-sm sm:w-auto sm:flex-1 sm:flex-col sm:items-center sm:bg-transparent sm:p-0 sm:shadow-none">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-white sm:h-14 sm:w-14 ${s.tone}`}>{s.icon}</div>
                        <div className="min-w-0 sm:mt-2">
                          <p className="text-sm font-bold text-slate-800 sm:text-xs">{s.title}</p>
                          <p className="text-xs leading-tight text-slate-500 sm:mt-0.5 sm:text-[10px]">{s.desc}</p>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <span aria-hidden className="my-1 text-lg text-[#4CAF75] sm:my-0 sm:mb-8 sm:shrink-0">
                          <span className="sm:hidden">↓</span>
                          <span className="hidden sm:inline">›</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-8 text-sm text-slate-500">手続きでき次第、追ってメールでご連絡します。</p>
              <p className="mt-5 text-sm text-slate-500">
                ご不明な点があれば、いつでも{" "}
                <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">こちらからご相談</button>
                ください。
              </p>

              <div className="mt-8 rounded-2xl bg-[#E8F5ED] p-5 text-center">
                <p className="text-sm font-bold text-slate-800">運用開始までに、アカウントの現状もチェック</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">60秒でできる無料のアカウント診断で、いまの伸びしろを確認できます。</p>
                <a href={SHINDAN_URL} target="_blank" rel="noopener" className="mt-4 inline-block rounded-xl bg-[#2D7A4F] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1A5C37]">無料でアカウント診断する →</a>
              </div>

              <button onClick={leave} className="mt-7 inline-block rounded-xl border border-slate-300 px-7 py-3 font-bold text-slate-700 transition hover:bg-slate-50">JEMIAトップへ戻る</button>
            </section>
          )}
        </div>

        {/* 各ステップ共通の相談導線 */}
        {step <= 5 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            お手続きで困ったら{" "}
            <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">担当者に相談する</button>
          </p>
        )}

        {contactOpen && <ContactForm variant="modal" onClose={() => setContactOpen(false)} />}
      </div>
    </div>
  );
}

// ── 小コンポーネント ─────────────────────────────────────────────
function StepTitle({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#2D7A4F]">{no}</p>
      <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{children}</h2>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full whitespace-nowrap rounded-xl bg-[#2D7A4F] px-5 py-3 font-bold text-white transition hover:bg-[#1A5C37] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full whitespace-nowrap rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50">
      {children}
    </button>
  );
}
