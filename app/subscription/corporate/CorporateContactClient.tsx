"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../subscription.module.css";
import { getAttribution } from "@/lib/attribution";

/* ── brand tokens（SubscriptionClient と統一） ── */
const G   = "#2D7A4F";
const GL  = "#E8F5ED";
const C   = "#FF6633";
const CL  = "#FFF0EB";
const OW  = "#F8FAF7";
const BD  = "#D8EDE1";
const TM  = "#555555";
const TL  = "#888888";
const TXT = "#1A1A1A";

const industries   = ["飲食・カフェ・レストラン","美容・サロン・エステ","アパレル・ファッション","EC・ネットショップ","不動産・インテリア","ブライダル・フォト","医療・クリニック","その他"];
const accountCounts = ["1アカウント","2〜3アカウント","4〜5アカウント","6〜10アカウント","11アカウント以上"];
const followerOpts = ["1,000人未満","1,000〜5,000人","5,000〜10,000人","10,000人以上"];
const budgetOpts   = ["5万円未満","5〜20万円","20〜50万円","50万円以上（要相談）"];
const methodOpts   = ["メール","電話","LINE","オンラインMTG"];
const timeOpts     = ["09:00〜11:00（午前中）","11:00〜13:00（昼前）","13:00〜15:00（午後早め）","15:00〜17:00（午後）","17:00〜18:00（夕方）"];

const label: React.CSSProperties = { display:"block", fontSize:13, fontWeight:700, marginBottom:8, color:TXT };
const input: React.CSSProperties = { width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none", background:"#fff" };
const req  = <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span>;
const opt  = <span style={{ fontSize:10, color:TL, background:OW, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>任意</span>;

export default function CorporateContactClient() {
  const [sending, setSending] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const company       = get("company");
    const name          = get("name");
    const email         = get("email");
    const industry      = get("industry");
    const accountCount  = get("accountCount");
    const budget        = get("budget");
    const contactMethod = get("contactMethod");

    if (!company || !name || !email || !industry || !accountCount || !budget || !contactMethod) {
      alert("必須項目（会社名・担当者名・メール・業種・アカウント数・予算感・連絡方法）をご入力ください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("メールアドレスの形式が正しくありません。");
      return;
    }

    const message = [
      `業種: ${industry}`,
      `運用予定のアカウント数: ${accountCount}`,
      `現在のフォロワー数: ${get("followers") || "未選択"}`,
      `月間予算感: ${budget}`,
      `ご希望の連絡方法: ${contactMethod}`,
      `ご希望の連絡時間帯: ${get("contactTime") || "指定なし"}`,
      "",
      "ご相談内容・目標:",
      get("message") || "（記載なし）",
    ].join("\n");

    setSending(true);
    try {
      const res = await fetch("/api/subscription-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${company}／${name}`,
          email,
          inquiry_type: "法人お問い合わせ",
          instagram_id: get("account").replace(/^@/, ""),
          message,
          source: "corporate",
          cta: "法人お問い合わせフォーム",
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = "/subscription/thanks";
        return;
      }
      alert(data.error || "送信に失敗しました。");
    } catch {
      alert("送信に失敗しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <Link href="/subscription" className={styles.headerLogo}>JEM<span style={{ color:C }}>I</span>A</Link>
          <Link href="/subscription" style={{ fontSize:13, fontWeight:700, color:TM, textDecoration:"none" }}>← サービス概要に戻る</Link>
        </div>
      </header>

      <div style={{ background:`linear-gradient(160deg,#fff 0%,${GL} 100%)`, padding:"56px 24px 72px" }}>
        <div className={styles.grid2} style={{ maxWidth:1080, margin:"0 auto", gap:48, alignItems:"start" }}>

          {/* Left: copy */}
          <div>
            <div style={{ display:"inline-block", fontSize:11, fontWeight:700, letterSpacing:".08em", color:G, background:"#fff", border:`1px solid ${BD}`, padding:"5px 12px", borderRadius:100, marginBottom:18 }}>法人向けサービス</div>
            <h1 style={{ fontSize:"clamp(24px,3.2vw,38px)", fontWeight:700, lineHeight:1.3, letterSpacing:"-.02em", color:TXT, marginBottom:20 }}>
              Instagram運用を、<br />
              <span style={{ color:G, borderBottom:`3px solid ${C}` }}>もっと効率的に管理</span><br />
              できる法人向けプラン
            </h1>
            <p style={{ fontSize:15, color:TM, lineHeight:1.9, marginBottom:28 }}>
              複数アカウントの管理、投稿運用の効率化、いいね周りまで、法人のInstagram活用をスムーズに。自社の運用体制に合わせて、必要な機能・サポートをカスタマイズ可能です。まずはお気軽にご相談ください。
            </p>
            <ul style={{ listStyle:"none", margin:"0 0 28px", padding:0 }}>
              {["複数アカウントの一括管理に対応","専任担当による導入・活用サポート","業種・ターゲットに合わせたカスタム対応","インボイス・請求書払いに対応"].map((t)=>(
                <li key={t} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, color:TXT, marginBottom:12 }}>
                  <span style={{ width:20, height:20, borderRadius:"50%", background:GL, color:G, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["いいね代行","発見タブ最適化","リスト上位表示","複数アカウント","専任担当","インボイス対応"].map((c)=>(
                <span key={c} style={{ background:"#fff", color:G, border:`1px solid ${BD}`, fontSize:12, fontWeight:700, padding:"6px 12px", borderRadius:100 }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:"32px 28px", boxShadow:"0 10px 36px rgba(45,122,79,.08)" }}>
            <div style={{ fontSize:19, fontWeight:700, color:TXT, marginBottom:4 }}>法人様お問い合わせ</div>
            <p style={{ fontSize:13, color:TL, marginBottom:24 }}>3日以内に確認後、ご入力いただいたメールアドレス宛にご連絡します（平日 09:00–18:00）</p>

            <form onSubmit={submitForm}>
              <input type="text" name="website" style={{ display:"none" }} tabIndex={-1} autoComplete="off" />

              <div style={{ marginBottom:18 }}>
                <label style={label}>会社名{req}</label>
                <input name="company" type="text" placeholder="例：株式会社〇〇" autoComplete="organization" style={input} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>担当者名{req}</label>
                <input name="name" type="text" placeholder="例：山田 太郎" autoComplete="name" style={input} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>メールアドレス{req}</label>
                <input name="email" type="email" placeholder="example@company.co.jp" autoComplete="email" style={input} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>業種{req}</label>
                <select name="industry" defaultValue="" style={input}>
                  <option value="" disabled>選択してください</option>
                  {industries.map((o)=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>運用予定のInstagramアカウント（@）{opt}</label>
                <input name="account" type="text" placeholder="@your_account" style={input} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>運用予定のアカウント数{req}</label>
                <select name="accountCount" defaultValue="" style={input}>
                  <option value="" disabled>選択してください</option>
                  {accountCounts.map((o)=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>現在のフォロワー数{opt}</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {followerOpts.map((o)=>(
                    <label key={o} style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:TXT, border:`1px solid ${BD}`, borderRadius:8, padding:"8px 12px", cursor:"pointer" }}>
                      <input type="radio" name="followers" value={o} /> {o}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>月間予算感{req}</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {budgetOpts.map((o)=>(
                    <label key={o} style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:TXT, border:`1px solid ${BD}`, borderRadius:8, padding:"8px 12px", cursor:"pointer" }}>
                      <input type="radio" name="budget" value={o} /> {o}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>ご希望の連絡方法{req}</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {methodOpts.map((o)=>(
                    <label key={o} style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:TXT, border:`1px solid ${BD}`, borderRadius:8, padding:"8px 12px", cursor:"pointer" }}>
                      <input type="radio" name="contactMethod" value={o} /> {o}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={label}>ご希望の連絡時間帯{opt}</label>
                <select name="contactTime" defaultValue="" style={input}>
                  <option value="">特になし・いつでも可</option>
                  {timeOpts.map((o)=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:8 }}>
                <label style={label}>ご相談内容・目標{opt}</label>
                <textarea name="message" rows={4} placeholder="現在の課題、達成したいKPI、開始希望時期など何でもお書きください" style={{ ...input, resize:"vertical" }} />
              </div>

              <button type="submit" disabled={sending} style={{ width:"100%", background:C, color:"#fff", border:"none", padding:16, borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:8, opacity:sending?.6:1, boxShadow:"0 4px 20px rgba(255,102,51,.25)" }}>
                {sending ? "送信中..." : "送信する →"}
              </button>
              <p style={{ fontSize:11, color:TL, textAlign:"center", marginTop:12, lineHeight:1.7 }}>
                受付時間：平日 09:00–18:00（時間外は翌営業日に順次対応）
              </p>
            </form>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.siteFooter}>
        <div style={{ marginBottom:12 }}>
          <span style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:20, color:"#fff" }}>JEM<span style={{ color:C }}>I</span>A</span>
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:16 }}>
          Instagram運用を、もっと自由に。もっとスマートに。
        </div>
        <div style={{ marginBottom:16 }}>
          <Link href="/subscription" style={{ color:"rgba(255,255,255,0.6)", textDecoration:"none", margin:"0 12px", fontSize:13 }}>サービス概要</Link>
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.9 }}>
          受付時間：平日 09:00 - 18:00（土日祝日は除く）<br />
          時間外のお問い合わせは次の相談時間に順次返答しております。
        </div>
        <div style={{ marginTop:20, fontSize:12, color:"rgba(255,255,255,0.4)" }}>© 2026 株式会社ホットセラー. All rights reserved.</div>
      </footer>
    </>
  );
}
