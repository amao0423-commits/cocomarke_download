"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";

// ────────────────────────────────────────────────────────────────
// 相談モーダル（オンボーディング等から利用）。
// 送信先は既存の /api/subscription-contact。
// ────────────────────────────────────────────────────────────────

const TOPICS = [
  "サービス内容について知りたい",
  "料金・プランについて相談したい",
  "自分に合うプランが分からない",
  "お申し込み手続きについて",
  "運用中の内容について（既存のお客様）",
  "初期・提携・その他",
];

export default function ContactForm({ onClose }: { variant?: "modal"; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const topic = String(fd.get("topic") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !email || !topic || !message) {
      alert("お名前・メールアドレス・ご相談内容・詳細は必須です。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("メールアドレスの形式が正しくありません。");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/subscription-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
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
      else alert(data.error || "送信に失敗しました。");
    } catch {
      alert("送信に失敗しました。");
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
            <h3 className="mt-4 text-lg font-bold text-slate-900">お問い合わせを受け付けました</h3>
            <p className="mt-3 text-sm leading-loose text-slate-600">
              ご入力いただいたメールアドレスに受付確認メールをお送りしました。<br />
              担当者より、通常1〜2営業日以内にご連絡いたします。
            </p>
            <button onClick={onClose} className="mt-6 rounded-xl border border-slate-300 px-6 py-2.5 font-bold text-slate-700 hover:bg-slate-50">閉じる</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#2D7A4F]">お問い合わせ・ご相談</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">お気軽にご相談ください</h3>
              </div>
              <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ご相談内容をお選びのうえ、必要に応じて詳細をご記入ください。担当者よりご連絡します。
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="cf-name" className="block text-sm font-medium text-slate-700">お名前 <span className="text-[#FF6633]">*</span></label>
                <input id="cf-name" name="name" type="text" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>
              <div>
                <label htmlFor="cf-email" className="block text-sm font-medium text-slate-700">メールアドレス <span className="text-[#FF6633]">*</span></label>
                <input id="cf-email" name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>
              <div>
                <label htmlFor="cf-topic" className="block text-sm font-medium text-slate-700">ご相談内容 <span className="text-[#FF6633]">*</span></label>
                <select id="cf-topic" name="topic" defaultValue="" required className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]">
                  <option value="" disabled>選択してください</option>
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cf-message" className="block text-sm font-medium text-slate-700">詳細・ご質問 <span className="text-[#FF6633]">*</span></label>
                <textarea id="cf-message" name="message" rows={4} required placeholder="ご質問やご相談の詳細をご記入ください。" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]" />
              </div>
              <button type="submit" disabled={sending} className="w-full rounded-xl bg-[#2D7A4F] px-6 py-3 font-bold text-white transition hover:bg-[#1A5C37] disabled:opacity-60">
                {sending ? "送信中…" : "この内容で送信する"}
              </button>
              <p className="text-center text-xs text-slate-400">
                送信いただいた内容はJEMIA管理窓口が受け付け、3営業日以内に担当者よりご連絡いたします。
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
