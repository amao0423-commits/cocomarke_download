"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";
import { APPLY_PLANS, APPLY_OPTIONS, priceToNumber, numberToPrice } from "./plans";
import { ONBOARDING, PAYMENTS, ACCOUNT_STATUS_OPTIONS } from "./onboardingContent";
import { useLang } from "../useLang";

// ────────────────────────────────────────────────────────────────
// JEMIA お申し込み（オンボーディング）。専用URL /subscription/apply に表示。
//   - ?plan=<プランkey> があれば初期選択（プランカード経由）
//   - 無ければ顧客がプランを選択（受付枠バー経由）。複数選択可。
//   - 最終送信で /api/onboarding へ POST（Slack通知＋確認メール）。
//   - 表示言語（海外ユーザー向け）は ?lang= / localStorage から取得（LPと共通）。
//     選択肢の value・送信値は常に日本語の内部識別子のまま（表示だけ翻訳）。
// ────────────────────────────────────────────────────────────────

const HOME = "/subscription";
const SHINDAN_URL =
  "https://www.cocomake-guide.com/shindan.html?utm_source=onboarding&utm_medium=web&utm_campaign=account_check";

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

export default function OnboardingFlow({ sourceLabel }: { sourceLabel?: string } = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = params.get("plan");
  const [lang] = useLang();
  const t = ONBOARDING[lang];
  const PLANS_L = APPLY_PLANS[lang];
  const OPTIONS_L = APPLY_OPTIONS[lang];
  const PAYMENTS_L = PAYMENTS[lang];
  const STATUS_L = ACCOUNT_STATUS_OPTIONS[lang];

  const [step, setStep] = useState(1); // 1..5、6=完了
  // selectedPlans / selectedOptions は常に日本語の内部識別子（key / id）で保持する
  const [selectedPlans, setSelectedPlans] = useState<string[]>(
    initialPlan && APPLY_PLANS.ja.some((p) => p.key === initialPlan) ? [initialPlan] : []
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [payment, setPayment] = useState<string>("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
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
    const plansSum = selectedPlans.reduce((sum, key) => {
      const p = APPLY_PLANS.ja.find((x) => x.key === key);
      return sum + (p ? priceToNumber(p.price) : 0);
    }, 0);
    const optSum = selectedOptions.reduce((sum, id) => sum + (APPLY_OPTIONS.ja.find((o) => o.id === id)?.price ?? 0), 0);
    return plansSum + optSum;
  }, [selectedPlans, selectedOptions]);
  const totalLabel = numberToPrice(totalNumber);

  const togglePlan = (key: string) =>
    setSelectedPlans((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  // 同じ group（例：投稿制作）は片方だけ選択にする
  const toggleOption = (id: string) => {
    const opt = APPLY_OPTIONS.ja.find((o) => o.id === id);
    setSelectedOptions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const base = opt?.group
        ? prev.filter((x) => APPLY_OPTIONS.ja.find((o) => o.id === x)?.group !== opt.group)
        : prev;
      return [...base, id];
    });
  };
  // 表示用（現在の言語）とサーバー送信用（常に日本語＝運営向け）を分ける
  const selectedPlanNamesDisplay = selectedPlans
    .map((key) => PLANS_L.find((p) => p.key === key)?.name)
    .filter((n): n is string => Boolean(n));
  const selectedOptionNamesDisplay = selectedOptions
    .map((id) => OPTIONS_L.find((o) => o.id === id)?.name)
    .filter((n): n is string => Boolean(n));
  const selectedOptionNamesJa = selectedOptions
    .map((id) => APPLY_OPTIONS.ja.find((o) => o.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  // Instagramのユーザーネームで使える文字（英数字・ピリオド・アンダースコア）のみ許可
  const updateAccount = (i: number, value: string) =>
    setAccounts((prev) => prev.map((a, idx) => (idx === i ? value.replace(/[^A-Za-z0-9._]/g, "") : a)));
  const addAccount = () => setAccounts((prev) => [...prev, ""]);
  const removeAccount = (i: number) => setAccounts((prev) => prev.filter((_, idx) => idx !== i));

  const minStart = useMemo(() => minStartDate(), []);
  const startDateInvalid = startDate !== "" && (isWeekendStr(startDate) || startDate < minStart);
  const step4Ok =
    lastName.trim() !== "" &&
    firstName.trim() !== "" &&
    EMAIL_RE.test(email) &&
    (accountStatus !== "has" || accounts.some((a) => a.trim()));

  async function handleApply() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${lastName.trim()} ${firstName.trim()}`.trim(),
          lastName: lastName.trim(),
          firstName: firstName.trim(),
          plans: selectedPlans, // 常に日本語のプラン名（key）
          options: selectedOptionNamesJa, // 常に日本語のオプション名
          total: totalLabel,
          startDate,
          payment: PAYMENTS.ja.find((p) => p.id === payment)?.label || payment,
          email,
          accountStatus,
          accounts: accounts.filter((a) => a.trim()),
          source: sourceLabel,
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
          {!sourceLabel && (
            <button
              type="button"
              onClick={leave}
              aria-label={t.header.close}
              className="absolute right-0 top-0 rounded-full bg-white p-2 text-slate-400 shadow-sm hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          )}
          <p className="text-sm font-medium text-[#2D7A4F]">{t.header.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{t.header.title}</h1>
          {step <= 5 && (
            <p className="mt-3 leading-loose text-slate-600">
              {t.header.sub}
            </p>
          )}
        </header>

        {/* 進捗バー */}
        {step <= 5 && (
          <ol className="mt-8 flex items-center justify-between">
            {t.steps.map((label, i) => {
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
                    {i < t.steps.length - 1 && <div className={"h-0.5 flex-1 " + (step > n ? "bg-[#4CAF75]" : "bg-slate-200")} />}
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
              <StepTitle no={t.step1.no}>{t.step1.title}</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">{t.step1.sub}</p>
              <div className="mt-5 space-y-2">
                {PLANS_L.map((p) => {
                  const checked = selectedPlans.includes(p.key);
                  return (
                    <label
                      key={p.key}
                      className={
                        "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-sm " +
                        (checked ? "border-[#2D7A4F] bg-[#E8F5ED]" : "border-slate-200 hover:border-slate-300")
                      }
                    >
                      <span className="flex items-center gap-3">
                        <input type="checkbox" checked={checked} onChange={() => togglePlan(p.key)} className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                        <span>
                          <span className="block font-medium text-slate-800">{p.name}</span>
                          {p.note && <span className="block text-xs text-slate-400">{p.note}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 font-bold text-slate-700">{p.price} {t.step1.yen}<span className="text-xs font-normal text-slate-400">{t.step1.perMonth}</span></span>
                    </label>
                  );
                })}
              </div>

              {/* オプション（任意） */}
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700">{t.step1.optionsHeading}</p>
                <div className="mt-2 space-y-2">
                  {OPTIONS_L.map((o) => {
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
                <p className="mt-2 text-xs text-slate-400">{t.step1.optionsNote}</p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-3 text-sm">
                <span className="text-slate-500">{t.step1.totalLabel}</span>
                <span className="text-base font-bold text-[#2D7A4F]">{totalLabel} {t.step1.yen}</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                {t.step1.premiumPrefix}{" "}
                <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">{t.step1.premiumLink}</button>
                {t.step1.premiumSuffix}
              </p>
              <PrimaryButton onClick={() => go(2)} disabled={selectedPlans.length === 0}>{t.step1.cta}</PrimaryButton>
            </section>
          )}

          {/* STEP 2: 同意 */}
          {step === 2 && (
            <section>
              <StepTitle no={t.step2.no}>{t.step2.title}</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">{t.step2.sub}</p>
              <div className="mt-5 space-y-5 text-sm leading-relaxed text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">{t.step2.serviceHeading}</p>
                  <ul className="mt-2 space-y-1.5">
                    {t.step2.serviceItems.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.step2.privacyHeading}</p>
                  <ul className="mt-2 space-y-1.5">
                    {t.step2.privacyItems.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.step2.paymentHeading}</p>
                  <ul className="mt-2 space-y-1.5">
                    {t.step2.paymentItems.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              </div>
              <label className="mt-6 flex items-start gap-3 rounded-xl bg-[#E8F5ED] p-4 text-sm text-slate-700">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]" />
                <span>
                  {t.step2.agreePrefix}
                  <a href="/subscription/terms" target="_blank" className="font-medium text-[#2D7A4F] underline underline-offset-4">{t.step2.termsLink}</a>
                  {t.step2.agreeMid}
                  <a href="/subscription/privacy" target="_blank" className="font-medium text-[#2D7A4F] underline underline-offset-4">{t.step2.privacyLink}</a>
                  {t.step2.agreeSuffix}
                  <span className="mt-1 block text-xs text-slate-400">{t.step2.agreeNote}</span>
                </span>
              </label>
              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(1)}>{t.step2.back}</SecondaryButton>
                <PrimaryButton onClick={() => go(3)} disabled={!agreed}>{t.step2.next}</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 3: 開始日・お支払い方法 */}
          {step === 3 && (
            <section>
              <StepTitle no={t.step3.no}>{t.step3.title}</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">{t.step3.sub}</p>

              <div className="mt-5">
                <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">{t.step3.startDateLabel} <span className="text-[#FF6633]">*</span></label>
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
                  <p className="mt-1.5 text-xs text-[#FF6633]">{t.step3.startDateInvalid.replace("{min}", minStart)}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">{t.step3.startDateHint.replace("{min}", minStart)}</p>
                )}
              </div>

              <div className="mt-6">
                <p className="block text-sm font-medium text-slate-700">{t.step3.paymentLabel} <span className="text-[#FF6633]">*</span></p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {PAYMENTS_L.map((pm) => {
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
                <label htmlFor="ob-note" className="block text-sm font-medium text-slate-700">{t.step3.noteLabel}</label>
                <textarea id="ob-note" rows={3} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>

              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(2)}>{t.step3.back}</SecondaryButton>
                <PrimaryButton onClick={() => go(4)} disabled={!startDate || startDateInvalid || !payment}>{t.step3.next}</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 4: 連絡先・運用アカウント */}
          {step === 4 && (
            <section>
              <StepTitle no={t.step4.no}>{t.step4.title}</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">{t.step4.sub}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ob-last" className="block text-sm font-medium text-slate-700">{t.step4.lastName} <span className="text-[#FF6633]">*</span></label>
                  <input
                    id="ob-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t.step4.lastNamePh}
                    autoComplete="family-name"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                  />
                </div>
                <div>
                  <label htmlFor="ob-first" className="block text-sm font-medium text-slate-700">{t.step4.firstName} <span className="text-[#FF6633]">*</span></label>
                  <input
                    id="ob-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t.step4.firstNamePh}
                    autoComplete="given-name"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="ob-email" className="block text-sm font-medium text-slate-700">{t.step4.email} <span className="text-[#FF6633]">*</span></label>
                <input
                  id="ob-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.step4.emailPh}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
                />
              </div>

              <div className="mt-6">
                <p className="block text-sm font-medium text-slate-700">{t.step4.statusLabel} <span className="text-[#FF6633]">*</span></p>
                <div className="mt-2 space-y-2">
                  {STATUS_L.map((opt) => (
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
                        onChange={() => setAccountStatus(opt.id)}
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
                        {t.step4.accountLabelBase} {accounts.length > 1 ? `（${i + 1}）` : ""}{t.step4.accountLabelSuffix}<span className="text-[#FF6633]">*</span>
                      </label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex flex-1 items-center rounded-lg border border-slate-300 px-3 focus-within:border-[#2D7A4F] focus-within:ring-1 focus-within:ring-[#2D7A4F]">
                          <span className="text-slate-400">@</span>
                          <input
                            id={`ig-account-${i}`}
                            type="text"
                            value={acc}
                            onChange={(e) => updateAccount(i, e.target.value)}
                            placeholder={t.step4.accountPh}
                            className="w-full px-2 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        {accounts.length > 1 && (
                          <button type="button" onClick={() => removeAccount(i)} aria-label={t.step4.removeAccountAria} className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">{t.step4.removeAccount}</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addAccount} className="text-sm font-medium text-[#2D7A4F] hover:text-[#1A5C37]">{t.step4.addAccount}</button>
                </div>
              )}

              <div className="mt-4 rounded-xl bg-[#E8F5ED] p-4 text-sm leading-relaxed text-slate-600">
                {t.step4.multiInfo}
              </div>

              {(accountStatus === "none" || accountStatus === "planning") && (
                <div className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
                  {t.step4.noAccountInfo}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <SecondaryButton onClick={() => go(3)}>{t.step4.back}</SecondaryButton>
                <PrimaryButton onClick={() => go(5)} disabled={!step4Ok}>{t.step4.next}</PrimaryButton>
              </div>
            </section>
          )}

          {/* STEP 5: 最終確認 */}
          {step === 5 && (
            <section>
              <StepTitle no={t.step5.no}>{t.step5.title}</StepTitle>
              <p className="mt-3 leading-relaxed text-slate-600">{t.step5.sub}</p>

              <div className="mt-5 rounded-xl border border-[#4CAF75] bg-[#F1F8F4] p-5">
                <p className="text-sm font-bold text-[#1A5C37]">{t.step5.boxTitle}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">{t.step5.planLabel}</dt>
                    <dd className="text-right font-medium">{selectedPlanNamesDisplay.join("／") || t.step5.none}</dd>
                  </div>
                  {selectedOptionNamesDisplay.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-600">{t.step5.optionLabel}</dt>
                      <dd className="text-right font-medium">{selectedOptionNamesDisplay.join("／")}</dd>
                    </div>
                  )}
                  <div className="flex justify-between"><dt className="text-slate-600">{t.step5.startDateLabel}</dt><dd className="font-medium">{startDate || t.step5.none}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-600">{t.step5.paymentLabel}</dt><dd className="font-medium">{PAYMENTS_L.find((p) => p.id === payment)?.label || t.step5.none}</dd></div>
                  <div className="mt-2 flex justify-between border-t border-[#4CAF75] pt-2 text-base">
                    <dt className="font-bold text-slate-800">{t.step5.totalLabel}</dt>
                    <dd className="font-bold text-[#2D7A4F]">{totalLabel} {t.step5.yen}</dd>
                  </div>
                </dl>
              </div>

              <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                {t.step5.note}
              </p>

              <button onClick={handleApply} disabled={submitting} className="mt-6 block w-full rounded-xl bg-[#FF6633] px-6 py-3.5 text-center font-bold text-white transition hover:bg-[#E5551F] disabled:opacity-60">
                {submitting ? t.step5.submitting : t.step5.submit}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">{t.step5.submitNote}</p>

              <div className="mt-4">
                <SecondaryButton onClick={() => go(4)}>{t.step5.back}</SecondaryButton>
              </div>
            </section>
          )}

          {/* 完了 */}
          {step === 6 && (
            <section className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5ED] text-3xl text-[#2D7A4F]">✓</div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">{t.done.title}</h2>
              <p className="mt-3 leading-loose text-slate-600">
                {t.done.body1}<br />
                {t.done.body2}
              </p>

              <div className="mt-8">
                {/* モバイルは縦一列（↓・アイコン＋文言を横並びで読みやすく）、sm以上は横4列（›） */}
                <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-stretch sm:justify-between sm:gap-1 sm:text-center">
                  {t.done.timeline.map((s, i, arr) => (
                    <div key={s.title} className="flex flex-col items-center sm:flex-1 sm:flex-row">
                      <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 shadow-sm sm:w-auto sm:flex-1 sm:flex-col sm:items-center sm:bg-transparent sm:p-0 sm:shadow-none">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl text-white sm:h-14 sm:w-14 ${["bg-[#2D7A4F]", "bg-[#4CAF75]", "bg-[#4CAF75]", "bg-[#FF6633]"][i]}`}>{s.icon}</div>
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

              <p className="mt-8 text-sm text-slate-500">{t.done.mailNote}</p>
              <p className="mt-5 text-sm text-slate-500">
                {t.done.helpPrefix}{" "}
                <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">{t.done.helpLink}</button>
                {t.done.helpSuffix}
              </p>

              <div className="mt-8 rounded-2xl bg-[#E8F5ED] p-5 text-center">
                <p className="text-sm font-bold text-slate-800">{t.done.diagBoxTitle}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{t.done.diagBoxBody}</p>
                <a href={SHINDAN_URL} target="_blank" rel="noopener" className="mt-4 inline-block rounded-xl bg-[#2D7A4F] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1A5C37]">{t.done.diagCta}</a>
              </div>

              <button onClick={leave} className="mt-7 inline-block rounded-xl border border-slate-300 px-7 py-3 font-bold text-slate-700 transition hover:bg-slate-50">{t.done.backHome}</button>
            </section>
          )}
        </div>

        {/* 各ステップ共通の相談導線 */}
        {step <= 5 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            {t.footerHelp.prefix}{" "}
            <button type="button" onClick={() => setContactOpen(true)} className="font-medium text-[#2D7A4F] underline underline-offset-4">{t.footerHelp.link}</button>
          </p>
        )}

        {contactOpen && <ContactForm variant="modal" onClose={() => setContactOpen(false)} lang={lang} />}
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
