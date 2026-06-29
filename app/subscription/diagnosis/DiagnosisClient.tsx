"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../subscription.module.css";

/* ── brand tokens ── */
const G   = "#2D7A4F";
const GL  = "#E8F5ED";
const C   = "#FF6633";
const CL  = "#FFF0EB";
const OW  = "#F8FAF7";
const BD  = "#D8EDE1";
const TM  = "#555555";
const TL  = "#888888";
const TXT = "#1A1A1A";

type PlanKey = "like" | "boost" | "set" | "rank" | "premium";

const PLAN_INFO: Record<PlanKey, { name: string; price: string; desc: string; popular?: boolean }> = {
  like:    { name: "いいね代行プラン",       price: "9,800",  desc: "ターゲット層への自動いいねで認知を拡大。まず「知ってもらう」第一歩に最適です。" },
  boost:   { name: "発見表示ブーストプラン", price: "19,800", desc: "投稿の初速エンゲージメントを高め、おすすめ・発見タブ掲載を狙う。反応・リーチを伸ばしたい方へ。" },
  set:     { name: "セットプラン",           price: "24,800", desc: "いいね代行＋発見ブーストの相乗効果で成果を最大化。最もコスパが良い人気No.1プラン。", popular: true },
  rank:    { name: "リスト上位表示プラン",   price: "29,800", desc: "狙ったキーワード検索で上位表示。地域×業種で「検索から見つけてもらう」を実現。" },
  premium: { name: "プレミアムプラン",       price: "49,800", desc: "専任コンサル＋投稿代行で運用をまるごとお任せ。最短で最大の成果を狙う方へ。" },
};

/* 同点時の優先順位（人気・汎用性の高い順） */
const PRIORITY: PlanKey[] = ["set", "premium", "boost", "rank", "like"];

const QUESTIONS: { q: string; options: { label: string; s: Partial<Record<PlanKey, number>> }[] }[] = [
  {
    q: "Instagram運用で、いま一番の課題は？",
    options: [
      { label: "フォロワー・認知が増えない",            s: { like: 2 } },
      { label: "投稿の反応（いいね・保存）が伸びない",  s: { boost: 2 } },
      { label: "検索で見つけてもらえない",              s: { rank: 2 } },
      { label: "運用する時間・人がいない",              s: { premium: 2, set: 1 } },
    ],
  },
  {
    q: "現在のフォロワー数は？",
    options: [
      { label: "〜1,000人",          s: { like: 1 } },
      { label: "1,000〜5,000人",     s: { boost: 1, set: 1 } },
      { label: "5,000〜10,000人",    s: { rank: 1, set: 1 } },
      { label: "10,000人以上",       s: { rank: 1, premium: 1 } },
    ],
  },
  {
    q: "月の予算感は？",
    options: [
      { label: "〜1万円",                       s: { like: 2 } },
      { label: "〜2.5万円",                     s: { set: 2, boost: 1 } },
      { label: "〜3万円",                       s: { rank: 2 } },
      { label: "5万円以上（しっかり投資したい）", s: { premium: 2 } },
    ],
  },
  {
    q: "理想の運用スタイルは？",
    options: [
      { label: "自分で運用し、ツールで効率化したい",   s: { like: 1, boost: 1 } },
      { label: "バランスよく両方やりたい",            s: { set: 2 } },
      { label: "プロに任せて成果を最大化したい",       s: { premium: 2, set: 1 } },
    ],
  },
];

function calcResult(answers: number[]): PlanKey {
  const score: Record<PlanKey, number> = { like: 0, boost: 0, set: 0, rank: 0, premium: 0 };
  answers.forEach((optIdx, qIdx) => {
    const opt = QUESTIONS[qIdx]?.options[optIdx];
    if (!opt) return;
    (Object.entries(opt.s) as [PlanKey, number][]).forEach(([k, v]) => { score[k] += v; });
  });
  let best: PlanKey = PRIORITY[0];
  let bestVal = -1;
  for (const k of PRIORITY) {
    if (score[k] > bestVal) { bestVal = score[k]; best = k; }
  }
  return best;
}

export default function DiagnosisClient() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;          // 0..QUESTIONS.length
  const done = step >= QUESTIONS.length;
  const result = done ? calcResult(answers) : null;
  const plan = result ? PLAN_INFO[result] : null;

  const choose = (optIdx: number) => setAnswers((a) => [...a, optIdx]);
  const back = () => setAnswers((a) => a.slice(0, -1));
  const restart = () => setAnswers([]);

  const progress = done ? 100 : Math.round((step / QUESTIONS.length) * 100);

  return (
    <>
      {/* ── Header ── */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/subscription" className={styles.headerLogo}>JEM<span style={{ color: C }}>I</span>A</Link>
          <Link href="/subscription" style={{ fontSize: 13, fontWeight: 700, color: TM, textDecoration: "none" }}>← サービス概要に戻る</Link>
        </div>
      </header>

      <div style={{ background: `linear-gradient(160deg,#fff 0%,${GL} 100%)`, minHeight: "70vh", padding: "48px 24px 72px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* タイトル */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: C, background: CL, padding: "5px 12px", borderRadius: 100, marginBottom: 14 }}>30秒でわかる</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: TXT, letterSpacing: "-.02em", lineHeight: 1.35 }}>
              どのプランが正解？<br />プラン診断
            </h1>
            {!done && <p style={{ fontSize: 14, color: TM, marginTop: 10 }}>かんたんな質問に答えるだけ。あなたに最適なプランをご提案します。</p>}
          </div>

          {/* 進捗バー */}
          <div style={{ height: 6, background: BD, borderRadius: 100, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${G},${C})`, borderRadius: 100, transition: "width .3s ease" }} />
          </div>

          {/* カード */}
          <div style={{ background: "#fff", border: `1px solid ${BD}`, borderRadius: 20, padding: "32px 24px", boxShadow: "0 10px 36px rgba(45,122,79,.08)" }}>

            {!done && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: G, marginBottom: 10 }}>Q{step + 1} / {QUESTIONS.length}</div>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: TXT, lineHeight: 1.5, marginBottom: 22 }}>{QUESTIONS[step].q}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {QUESTIONS[step].options.map((o, i) => (
                    <button
                      key={o.label}
                      onClick={() => choose(i)}
                      style={{ textAlign: "left", padding: "16px 18px", borderRadius: 12, border: `1.5px solid ${BD}`, background: OW, fontSize: 15, fontWeight: 700, color: TXT, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = G; e.currentTarget.style.background = GL; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = BD; e.currentTarget.style.background = OW; }}
                    >
                      <span>{o.label}</span>
                      <span style={{ color: G, fontWeight: 900 }}>→</span>
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={back} style={{ marginTop: 18, background: "none", border: "none", color: TL, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>← 前の質問に戻る</button>
                )}
              </>
            )}

            {done && plan && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 8 }}>あなたにおすすめは</div>
                {plan.popular && (
                  <div style={{ display: "inline-block", background: C, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 100, marginBottom: 12 }}>人気 No.1</div>
                )}
                <h2 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: G, letterSpacing: "-.02em", marginBottom: 8 }}>{plan.name}</h2>
                <div style={{ margin: "8px 0 18px", display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 40, fontWeight: 900, color: TXT }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: TL }}>円 / 月（税込）〜</span>
                </div>
                <p style={{ fontSize: 14, color: TM, lineHeight: 1.9, marginBottom: 28 }}>{plan.desc}</p>

                <Link href="/subscription?from=diagnosis#plans" style={{ display: "inline-block", width: "100%", boxSizing: "border-box", background: C, color: "#fff", padding: 16, borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(255,102,51,.25)", marginBottom: 12 }}>
                  このプランで相談する →
                </Link>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href="/subscription#plans" style={{ flex: 1, background: "#fff", color: G, border: `2px solid ${G}`, padding: "12px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>すべてのプランを見る</Link>
                  <button onClick={restart} style={{ flex: 1, background: OW, color: TM, border: `1px solid ${BD}`, padding: "12px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>もう一度診断する</button>
                </div>
                <p style={{ fontSize: 12, color: TL, marginTop: 18, lineHeight: 1.8 }}>
                  ※ 診断はあくまで目安です。迷ったら<Link href="/subscription/corporate" style={{ color: G, fontWeight: 700 }}>法人のお客様はこちら</Link>からもご相談いただけます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.siteFooter}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 900, fontSize: 20, color: "#fff" }}>JEM<span style={{ color: C }}>I</span>A</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
          Instagram運用を、もっと自由に。もっとスマートに。
        </div>
        <div style={{ marginBottom: 16 }}>
          <Link href="/subscription" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", margin: "0 12px", fontSize: 13 }}>サービス概要</Link>
          <Link href="/subscription/corporate" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", margin: "0 12px", fontSize: 13 }}>法人のお客様</Link>
        </div>
        <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 株式会社ホットセラー. All rights reserved.</div>
      </footer>
    </>
  );
}
