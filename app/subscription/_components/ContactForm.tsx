"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";
import type { Lang } from "../subscriptionContent";
import { CONTACT_FORM, TOPICS } from "./onboardingContent";

// ────────────────────────────────────────────────────────────────
// 相談モーダル（オンボーディング等から利用）。
// 送信先は既存の /api/subscription-contact。
// ────────────────────────────────────────────────────────────────

export default function ContactForm({ onClose, lang = "ja" }: { variant?: "modal"; onClose: () => void; lang?: Lang }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const t = CONTACT_FORM[lang];
  const topics = TOPICS[lang];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lastName = String(fd.get("last_name") ?? "").trim();
    const firstName = String(fd.get("first_name") ?? "").trim();
    const name = `${lastName} ${firstName}`.trim();
    const email = String(fd.get("email") ?? "").trim();
    const topicId = String(fd.get("topic") ?? "").trim();
    // 送信先の運営（日本語話者）向けに、選択肢の値は常に日本語表記を送信する
    const topic = TOPICS.ja.find((x) => x.id === topicId)?.label ?? topicId;
    const message = String(fd.get("message") ?? "").trim();
    if (!lastName || !firstName || !email || !topicId || !message) {
      alert(t.errRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert(t.errEmail);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/subscription-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          last_name: lastName,
          first_name: firstName,
          email,
          inquiry_type: topic,
          message,
          source: "consult",
          cta: "オンボーディング：担当者に相談",
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else alert(data.error || t.errSend);
    } catch {
      alert(t.errSend);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5ED] text-2xl text-[#2D7A4F]">✓</div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">{t.doneTitle}</h3>
            <p className="mt-3 text-sm leading-loose text-slate-600">
              {t.doneBody.split("\n").map((line, i) => (
                <span key={i}>{line}{i < t.doneBody.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
            <button onClick={onClose} className="mt-6 rounded-xl border border-slate-300 px-6 py-2.5 font-bold text-slate-700 hover:bg-slate-50">{t.close}</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#2D7A4F]">{t.eyebrow}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{t.title}</h3>
              </div>
              <button type="button" onClick={onClose} aria-label={t.close} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t.intro}
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cf-last" className="block text-sm font-medium text-slate-700">{t.lastName} <span className="text-[#FF6633]">*</span></label>
                  <input id="cf-last" name="last_name" type="text" autoComplete="family-name" placeholder={t.lastNamePh} required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
                </div>
                <div>
                  <label htmlFor="cf-first" className="block text-sm font-medium text-slate-700">{t.firstName} <span className="text-[#FF6633]">*</span></label>
                  <input id="cf-first" name="first_name" type="text" autoComplete="given-name" placeholder={t.firstNamePh} required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
                </div>
              </div>
              <div>
                <label htmlFor="cf-email" className="block text-sm font-medium text-slate-700">{t.email} <span className="text-[#FF6633]">*</span></label>
                <input id="cf-email" name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>
              <div>
                <label htmlFor="cf-topic" className="block text-sm font-medium text-slate-700">{t.topic} <span className="text-[#FF6633]">*</span></label>
                <select id="cf-topic" name="topic" defaultValue="" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]">
                  <option value="" disabled>{t.topicPlaceholder}</option>
                  {topics.map((tp) => <option key={tp.id} value={tp.id}>{tp.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cf-message" className="block text-sm font-medium text-slate-700">{t.message} <span className="text-[#FF6633]">*</span></label>
                <textarea id="cf-message" name="message" rows={4} required placeholder={t.messagePh} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>
              <button type="submit" disabled={sending} className="w-full rounded-xl bg-[#2D7A4F] px-6 py-3 font-bold text-white transition hover:bg-[#1A5C37] disabled:opacity-60">
                {sending ? t.sending : t.submit}
              </button>
              <p className="text-center text-xs text-slate-400">
                {t.footerNote}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
