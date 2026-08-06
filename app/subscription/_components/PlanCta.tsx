"use client";

import { useState } from "react";

// ────────────────────────────────────────────────────────────────
// 料金プランの「お申し込み」＋「資料請求モーダル」
//
// 使い方:
//   各プランカードの CTA 部分に <PlanCta planName="人気・おすすめ投稿表示プラン" />
//   を置いてください。クリックで資料請求モーダルが開きます。
//
// 申し込みボタンのリンク先（applyHref）と、資料請求の送信処理・
// サンクスページURL（THANKS_URL）は実環境に合わせて差し替えてください。
// ────────────────────────────────────────────────────────────────

// 送信後に遷移するサンクスページ（別URL）
const THANKS_URL = "/thanks-document";

// 「興味のあるサービス」の選択肢（プラン名に合わせて調整可）
const SERVICE_OPTIONS = [
  "人気・おすすめ投稿表示プラン",
  "いいね代行プラン",
  "セットプラン",
  "アカウント上位表示プラン",
  "プレミアムプラン",
  "まだ決めていない / 相談したい",
];

// 「資料請求の目的」の選択肢
const PURPOSE_OPTIONS = [
  "サービス内容を詳しく知りたい",
  "料金・プランを比較検討したい",
  "社内・上司に共有したい",
  "他社と比較したい",
  "導入を具体的に検討している",
];

type PlanCtaProps = {
  planName: string;
  applyHref?: string; // 申し込みのリンク先（決済 or 相談フォーム）
};

export default function PlanCta({ planName, applyHref = "/subscription#contact" }: PlanCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 申し込み（主） */}
      <a
        href={applyHref}
        className="block rounded-xl bg-[#FF6633] px-6 py-3.5 text-center font-bold text-white transition hover:bg-[#E5551F]"
      >
        このプランで申し込む →
      </a>

      {/* 資料請求（従・テキストリンク） */}
      <p className="mt-3 text-center text-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-medium text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]"
        >
          またはこのプランの資料をもらう →
        </button>
      </p>

      {open && (
        <DocumentRequestModal
          planName={planName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── 資料請求モーダル ─────────────────────────────────────────────
function DocumentRequestModal({
  planName,
  onClose,
}: {
  planName: string;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      // ▼ ここに実際の送信処理を入れてください（API / フォームサービス等）
      //   例: await fetch("/api/document-request", {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json" },
      //         body: JSON.stringify(payload),
      //       });
      console.log("資料請求データ:", payload);

      // 送信後、別URLのサンクスページへ遷移
      window.location.href = THANKS_URL;
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-modal-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[#2D7A4F]">資料請求</p>
            <h3 id="doc-modal-title" className="mt-1 text-lg font-bold text-slate-900">
              「{planName}」の資料をもらう
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          ご入力後、担当者から資料をメールでお送りします（その場でのダウンロードではありません）。
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* どのプランの資料か（hidden） */}
          <input type="hidden" name="plan" value={planName} />

          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              お名前 <span className="text-[#FF6633]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
            />
          </div>

          {/* メール */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              メールアドレス <span className="text-[#FF6633]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
            />
          </div>

          {/* 資料請求のチェック項目（デフォルトでチェック） */}
          <div>
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="request_document"
                value="yes"
                defaultChecked
                required
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D7A4F] focus:ring-[#2D7A4F]"
              />
              <span>
                資料の送付を希望します <span className="text-[#FF6633]">*</span>
              </span>
            </label>
          </div>

          {/* 興味のあるサービス（デフォルトは未選択） */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-slate-700">
              興味のあるサービス
            </label>
            <select
              id="service"
              name="service"
              defaultValue=""
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
            >
              <option value="">選択してください</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 資料請求の目的（必須） */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
              資料請求の目的 <span className="text-[#FF6633]">*</span>
            </label>
            <select
              id="purpose"
              name="purpose"
              defaultValue=""
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
            >
              <option value="" disabled>
                選択してください
              </option>
              {PURPOSE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* 任意の質問 */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-slate-700">
              ご質問・ご要望（任意）
            </label>
            <textarea
              id="question"
              name="question"
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2D7A4F] focus:outline-none focus:ring-1 focus:ring-[#2D7A4F]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#2D7A4F] px-6 py-3 font-bold text-white transition hover:bg-[#1A5C37] disabled:opacity-60"
          >
            {submitting ? "送信中…" : "資料を請求する"}
          </button>

          <p className="text-center text-xs text-slate-400">
            送信いただいた情報は、資料送付およびご連絡の目的にのみ使用します。
          </p>
        </form>
      </div>
    </div>
  );
}
