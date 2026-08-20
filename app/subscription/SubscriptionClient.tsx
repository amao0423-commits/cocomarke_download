"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./subscription.module.css";
import { getAttribution } from "@/lib/attribution";
import { useRouter } from "next/navigation";
import { mediaItems } from "./_components/MediaMentions";
import ResultsBeforeAfter from "./_components/ResultsBeforeAfter";
import ContactForm from "./_components/ContactForm";
import { type Lang, PLANS, FAQS, VOICES, IMPROVE_ITEMS, OPTION_ITEMS, FLOW_STEPS, UI } from "./subscriptionContent";

/* ── brand tokens ── */
const G   = "#2D7A4F";
const GL  = "#E8F5ED";
const GM  = "#4CAF75";
const C   = "#FF6633";
const CL  = "#FFF0EB";
const OW  = "#F8FAF7";
const BD  = "#D8EDE1";
const TM  = "#555555";
const TL  = "#888888";
const TXT = "#1A1A1A";

// TOPに表示する最新のお役立ち記事（自動横スクロール）。色はお役立ち記事一覧のカテゴリ色に合わせる。
const latestPosts: { href: string; tag: string; title: string; color: string; featured?: boolean }[] = [
  { href: "/subscription/blog/jemia-interview", tag: "INTERVIEW", title: "「頑張っても伸びない」を終わらせたい｜運営責任者インタビュー", color: "#2D7A4F", featured: true },
  { href: "/subscription/blog/instagram-algorithm-2026", tag: "アルゴリズム", title: "【2026年最新】Instagramアルゴリズムの変化と5つの指標", color: "#047857" },
  { href: "/subscription/blog/followers-vs-engagement", tag: "集客・運用", title: "フォロワー1万人でも売れない？「数」より「反応」の運用術", color: "#155E75" },
  { href: "/subscription/blog/restaurant-instagram-guide", tag: "業種別ノウハウ", title: "飲食店のインスタ集客｜週2投稿で予約につながる導線の作り方", color: "#B45309" },
  { href: "/subscription/blog/instagram-explore-tab", tag: "アルゴリズム", title: "インスタのおすすめ・発見タブに載る方法｜7つのコツ", color: "#047857" },
  { href: "/subscription/blog/increase-followers", tag: "集客・運用", title: "インスタのフォロワーを増やす方法｜土台から作る9つのステップ", color: "#155E75" },
  { href: "/subscription/blog/agency-guide", tag: "集客・運用", title: "インスタ運用代行の選び方｜料金相場と失敗しない比較ポイント", color: "#155E75" },
];

export default function SubscriptionClient() {
  const router = useRouter();
  // 表示言語（海外ユーザー向けの言語切り替え。まずは日本語／韓国語に対応）。
  // 金額は換算せず円建てのまま、単位表記のみ言語ごとに切り替える。
  const [lang, setLangState] = useState<Lang>("ja");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem("jemia_lang");
    const initial = (fromQuery === "ko" || fromQuery === "ja") ? fromQuery : (saved === "ko" || saved === "ja") ? saved : "ja";
    setLangState(initial as Lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("jemia_lang", l);
  };
  const t = UI[lang];
  const P = PLANS[lang];
  const FQ = FAQS[lang];
  const VC = VOICES[lang];
  const IM = IMPROVE_ITEMS[lang];
  const OPT = OPTION_ITEMS[lang];
  const FLW = FLOW_STEPS[lang];
  const [modal, setModal]       = useState(false);
  const [thanks, setThanks]     = useState(false);
  const [sending, setSending]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number|null>(null);
  const [voicePage, setVoicePage] = useState(0);
  // どのCTAからフォームを開いたか（メール件名・本文の振り分けに使用）
  const [formSource, setFormSource] = useState<"consult"|"plan_apply">("consult");
  const [formCta, setFormCta]       = useState("");
  // モーダルの「ご希望のプラン」初期値（プラン申込ボタンから開いたとき自動選択）
  const [formPlan, setFormPlan]     = useState("");
  // 右下追従のチャット相談ボタン
  const [chatOpen, setChatOpen]     = useState(false);
  const simRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* typing simulation */
  const chips = ["#渋谷カフェ","#恵比寿ランチ","#表参道スイーツ","#代官山雑貨"];
  useEffect(() => {
    let idx = 0, typing = false;
    function switchKw(newIdx: number) {
      if (typing || !simRef.current) return;
      typing = true; idx = newIdx;
      const target = chips[newIdx];
      let cur = simRef.current.textContent ?? "";
      let i = cur.length;
      function erase() {
        if (!simRef.current) return;
        if (i > 0) { simRef.current.textContent = cur.slice(0, --i); setTimeout(erase, 35); }
        else typeChar(0);
      }
      function typeChar(j: number) {
        if (!simRef.current) return;
        if (j < target.length) { simRef.current.textContent = target.slice(0, j+1); setTimeout(()=>typeChar(j+1), 75); }
        else { typing = false; setTimeout(()=>switchKw((newIdx+1)%chips.length), 2200); }
      }
      erase();
    }
    const t = setTimeout(()=>switchKw(0), 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (source: "consult"|"plan_apply" = "consult", cta = "", plan = "") => {
    setFormSource(source);
    setFormCta(cta);
    setFormPlan(plan);
    setModal(true); setThanks(false); document.body.style.overflow="hidden";
  };
  const closeModal = () => { setModal(false); document.body.style.overflow=""; };

  // メール等の「マーケティング相談」リンク（?consult=1 / #contact）で相談フォームを自動で開く
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (p.get("consult") === "1" || window.location.hash === "#contact") {
      openModal("consult", "メール：マーケティング相談");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 申し込み導線：プレミアムは「マーケティング相談」フォーム、他は申し込み手続きページへ
  // ※ key は表示言語によらず常に日本語の内部識別子（お申し込みURL・フォーム送信値と整合させるため）
  const startApply = (plan: { key:string }) => {
    if (plan.key === "プレミアム") {
      openModal("consult", `料金表：${plan.key}`, plan.key);
      return;
    }
    router.push(`/subscription/apply?plan=${encodeURIComponent(plan.key)}${lang !== "ja" ? `&lang=${lang}` : ""}`);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lastName  = ((fd.get("last_name") as string) || "").trim();
    const firstName = ((fd.get("first_name") as string) || "").trim();
    const name    = `${lastName} ${firstName}`.trim();
    const email   = (fd.get("email") as string).trim();
    const message = (fd.get("message") as string).trim();
    if (!lastName || !firstName || !email) { alert(t.modal.errName); return; }
    if (formSource === "consult" && !message) { alert(t.modal.errQuestion); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert(t.modal.errEmail); return; }
    setSending(true);
    // 診断ページ経由（/subscription?from=diagnosis）なら「プラン診断」を優先
    const fromDiagnosis =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("from") === "diagnosis";
    const source = fromDiagnosis ? "diagnosis" : formSource;
    const cta = fromDiagnosis ? `プラン診断経由${formCta ? `（${formCta}）` : ""}` : formCta;
    try {
      const res = await fetch("/api/subscription-contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name, last_name: lastName, first_name: firstName, email,
          inquiry_type: fd.get("inquiry_type"),
          instagram_id: fd.get("instagram_id"),
          message,
          source,
          cta,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        // 送信成功時はサンクスページへ完全遷移し、その URL で Meta の PageView を発火させる
        document.body.style.overflow = "";
        window.location.href = "/subscription/thanks";
        return;
      }
      else alert(data.error || t.modal.errSend);
    } catch { alert(t.modal.errSend); }
    finally { setSending(false); }
  };

  const voicePerPage = 3;
  const voicePages = Math.ceil(VC.length / voicePerPage);
  const visibleVoices = VC.slice(voicePage * voicePerPage, (voicePage+1) * voicePerPage);

  const kw1 = ["新宿ランチ","渋谷カフェ","大宮居酒屋","川越カフェ","中目黒グルメ","札幌グルメ","すすきのカフェ","韓国旅行","箱根温泉","女子旅","沖縄ホテル","池袋ランチ","横浜カフェ","名古屋グルメ","大阪スイーツ","福岡グルメ","神戸カフェ","京都ランチ","鎌倉カフェ","吉祥寺ディナー","銀座グルメ"];
  const kw2 = ["ハイトーンカラー","レイヤーカット","髪質改善","縮毛矯正","横浜美容室","渋谷美容室","ブライダルエステ","小顔矯正","アートメイク","ルームツアー","韓国インテリア","表参道美容室","銀座ネイル","梅田美容室","心斎橋ネイル","名古屋美容室","福岡美容室","札幌美容室","まつ毛パーマ","二重整形","脱毛サロン"];
  const kw3 = ["시부야 맛집","신주쿠맛집","아트메이크","ネイルサロン","新宿グルメ","姿勢改善","婚約指輪","韓国式足裏角質ケア","프치쁠라코스메","原宿カフェ","恵比寿ディナー","大宮ネイル","川崎美容室","横浜ネイル","千葉グルメ","大阪ネイル","시부야 카페","하라주쿠 쇼핑","上野グルメ","町田美容室"];

  const btnPrimary: React.CSSProperties = { background:C, color:"#fff", border:"none", padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", boxShadow:`0 4px 20px rgba(255,102,51,.3)` };

  return (
    <div className="[text-wrap:pretty]">
      {/* ── 最上部インフォバー ── */}
      <div style={{ background:"#1A1A1A" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"7px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap", fontSize:12, color:"rgba(255,255,255,.78)" }}>
          <span>{t.topbar.hours}</span>
          <span style={{ color:"rgba(255,255,255,.3)" }}>｜</span>
          <span>{t.topbar.tagline}</span>
          {/* 海外ユーザー向け：表示言語の切り替え（現在は日本語／韓国語） */}
          <div style={{ display:"flex", gap:4 }}>
            {(["ja","ko"] as Lang[]).map((l)=>(
              <button key={l} onClick={()=>setLang(l)} style={{ padding:"2px 9px", borderRadius:5, border:"1px solid rgba(255,255,255,.25)", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit", background: lang===l ? "#fff" : "transparent", color: lang===l ? "#1A1A1A" : "rgba(255,255,255,.75)" }}>
                {UI[l].langSwitcher[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── JEMIA Header ── */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.headerLogo}>JEM<span style={{ color:C }}>I</span>A</a>
          <nav className={styles.headerNav}>
            {([[t.nav.pricing,"#plans"],[t.nav.results,"#voices"],[t.nav.faq,"#faq"]] as const).map(([label,href])=>(
              <a key={href} href={href}>{label}</a>
            ))}
            <Link href="/subscription/blog">{t.nav.blog}</Link>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/subscription/blog" className={styles.navLinkMobile}>{t.nav.blog}</Link>
            <Link href="/subscription/diagnosis" className={styles.headerCorp}>
              <span className={styles.labelFull}>{t.nav.docFull}</span><span className={styles.labelShort}>{t.nav.docShort}</span>
            </Link>
            <button className={styles.headerCta} onClick={()=>openModal("consult","ヘッダー：マーケティング相談")}>
              <span className={styles.labelFull}>{t.nav.consultFull}</span><span className={styles.labelShort}>{t.nav.consultShort}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 受付枠バー（ヘッダー直下） ── */}
      <div style={{ background:OW, borderBottom:`1px solid ${BD}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"11px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", textAlign:"center" }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:CL, color:C, fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100, flexShrink:0 }}>
            <span className={styles.pulseDot} style={{ width:6, height:6, borderRadius:"50%", background:C, display:"inline-block" }} />{t.receptionBar.badge}
          </span>
          <span style={{ fontSize:14, fontWeight:700, color:TXT }}>{t.receptionBar.slotsPrefix}<span style={{ color:C, fontWeight:900 }}>{t.receptionBar.slotsCount}</span></span>
          <span style={{ fontSize:12.5, color:TM }}>{t.receptionBar.note}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="top" style={{ background:`linear-gradient(160deg,#fff 0%,${GL} 100%)`, padding:"72px 24px 64px", position:"relative", overflow:"hidden", scrollMarginTop:64 }}>
        <div className={styles.heroGrid} style={{ maxWidth:1100, margin:"0 auto", alignItems:"center", paddingBottom:80 }}>
          {/* left */}
          <div className={styles.fadeUp}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:CL, color:C, fontSize:12, fontWeight:700, letterSpacing:".06em", padding:"6px 14px", borderRadius:100, marginBottom:20 }}>
              <span className={styles.pulseDot} style={{ width:6, height:6, background:C, borderRadius:"50%", display:"inline-block" }} />
              {t.hero.badge}
            </div>
            <h1 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, lineHeight:1.25, letterSpacing:"-.03em", marginBottom:20, color:TXT }}>
              {t.hero.title1}<br />
              <span style={{ color:G, borderBottom:`3px solid ${C}` }}>{t.hero.titleHighlight}</span>{t.hero.titleEnd}
            </h1>
            <p style={{ fontSize:15, color:TM, marginBottom:32, lineHeight:1.8 }}>
              {t.hero.sub1}<br />
              {t.hero.sub2}
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
              <a href="/shindan.html" style={{ ...btnPrimary, display:"inline-block", textDecoration:"none" }}>{t.hero.ctaDiagnosis}</a>
              <a href="#plans" style={{ background:"transparent", color:G, border:`2px solid ${G}`, padding:"12px 24px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none", display:"inline-block" }}>{t.hero.ctaPricing}</a>
              <Link href="/subscription/diagnosis" style={{ display:"inline-flex", alignItems:"center", gap:6, color:C, fontSize:14, fontWeight:700, textDecoration:"none", padding:"12px 4px" }}>{t.hero.ctaPlan}</Link>
            </div>
            <div style={{ display:"flex", gap:28 }}>
              {t.hero.stats.map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:26, color:G, lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:11, color:TL, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* right: search sim */}
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ width:280, maxWidth:"100%", background:"#fff", borderRadius:24, border:`1.5px solid ${BD}`, boxShadow:`0 2px 16px rgba(45,122,79,.08),0 24px 60px rgba(45,122,79,.14)`, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 10px", borderBottom:`1px solid ${BD}` }}>
                <span style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:15 }}>Instagram</span>
                <span style={{ fontSize:18, color:TL }}>⊕</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, margin:"12px 14px 0", background:OW, borderRadius:10, padding:"8px 12px" }}>
                <span style={{ fontSize:12, color:TL }}>🔍</span>
                <span ref={simRef} style={{ fontSize:13, flex:1, minHeight:18 }} />
                <span className={styles.cursor} />
              </div>
              <div style={{ display:"flex", padding:"0 14px", marginTop:10, borderBottom:`1px solid ${BD}`, gap:0 }}>
                {[t.hero.tabAccount, t.hero.tabHashtag, t.hero.tabPlace].map((tab,i)=>(
                  <div key={tab} style={{ fontSize:11, fontWeight:700, padding:"6px 10px", color:i===0?G:TL, borderBottom:i===0?`2px solid ${G}`:"2px solid transparent", marginBottom:-1, whiteSpace:"nowrap" }}>{tab}</div>
                ))}
              </div>
              <div style={{ padding:"6px 0 2px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px" }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${G},${GM})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", position:"relative", flexShrink:0 }}>
                    J
                    <span style={{ position:"absolute", bottom:-2, right:-2, width:15, height:15, borderRadius:"50%", background:C, color:"#fff", fontSize:8, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid #fff" }}>1</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700 }}>@your_shop_jemia</div>
                    <div style={{ fontSize:10, color:TL, marginTop:1 }}>{t.hero.followerLine}</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:G }}>{t.hero.rank1}</div>
                </div>
                {[["A","3,200",t.hero.rank2],["B","1,800",t.hero.rank3]].map(([n,f,p])=>(
                  <div key={n} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", opacity:.42 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#bbb,#999)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>{n}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700 }}>@competitor_{n.toLowerCase()}</div><div style={{ fontSize:10, color:TL }}>{t.hero.followerPrefix}{f}</div></div>
                    <div style={{ fontSize:11, fontWeight:700, color:TL }}>{p}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"8px 14px 14px", borderTop:`1px solid ${BD}` }}>
                {chips.map((c)=>(
                  <span key={c} style={{ background:GL, color:G, fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:100 }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* stats bar */}
        <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:"28px 24px", maxWidth:1100, margin:"0 auto", boxShadow:"0 10px 36px rgba(45,122,79,.08)" }}>
          <div className={styles.grid3}>
            {t.statsBar.map(([n,l,d,coral])=>(
              <div key={l as string} className={styles.statCell} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:42, fontWeight:900, color:coral?C:G, lineHeight:1, letterSpacing:"-.03em" }}>{n}</div>
                <div style={{ fontSize:12, color:TL, marginTop:6, fontWeight:500 }}>{l}</div>
                <div style={{ fontSize:11, color:TL, marginTop:2, opacity:.7 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results（導入前後 Before/After + フロー） ── */}
      <section style={{ background:OW }}>
        <ResultsBeforeAfter lang={lang} />
      </section>

      {/* ── Keywords Marquee ── */}
      <section style={{ background:G, padding:"64px 0", overflow:"hidden" }}>
        <div style={{ padding:"0 24px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.6)", textTransform:"uppercase", marginBottom:12 }}>Keywords</div>
          <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:700, color:"#fff", marginBottom:32, letterSpacing:"-.02em" }}>{t.keywords.heading}</h2>
        </div>
        {[kw1, kw2, kw3].map((row, ri)=>{
          const cls = ri===1 ? styles.marqueeTrack2 : ri===2 ? styles.marqueeTrack3 : styles.marqueeTrack;
          const doubled = [...row,...row];
          return (
            <div key={ri} className={styles.marqueeMask} style={{ overflow:"hidden", marginTop:ri>0?12:0 }}>
              <div className={cls} style={{ display:"flex", width:"max-content" }}>
                {doubled.map((kw,ki)=>(
                  <span key={ki} style={{ background:ki%3===0?"rgba(255,102,51,1)":"rgba(255,255,255,.15)", color:"#fff", border:"1px solid rgba(255,255,255,.25)", padding:"8px 18px", borderRadius:100, fontSize:13, fontWeight:500, whiteSpace:"nowrap", marginRight:16, flexShrink:0 }}>{kw}</span>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── 導入でこう変わる ── */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.improve.eyebrow}</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>{t.improve.heading}</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>{t.improve.sub}</p>
          </div>
          {IM.map((r, ri, arr)=>(
            <div key={r.k} className={styles.grid2} style={{ gap:48, alignItems:"center", marginBottom: ri < arr.length-1 ? 56 : 0 }}>
              <div style={{ background:OW, border:`1px solid ${BD}`, borderRadius:20, padding:18 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt={r.alt} loading="lazy" style={{ display:"block", width:"100%", height:"auto", borderRadius:12 }} />
              </div>
              <div>
                <span style={{ display:"inline-block", background:GL, color:G, fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:100, marginBottom:14 }}>{r.badge} — {r.price}</span>
                <h3 style={{ fontSize:"clamp(18px,2.2vw,24px)", fontWeight:700, color:TXT, lineHeight:1.5, marginBottom:20 }}>{r.title}</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  {r.points.map(([h,d],pi)=>(
                    <div key={h} style={{ display:"flex", gap:12 }}>
                      <span style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background:G, color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{pi+1}</span>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:TXT }}>{h}</div>
                        <p style={{ fontSize:13.5, color:TM, lineHeight:1.8, marginTop:2 }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Plans ── */}
      {/* ── プラン診断への導線バナー ── */}
      <section style={{ padding:"56px 24px 0", background:"#fff" }}>
        <Link href="/subscription/diagnosis" style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap", background:`linear-gradient(135deg,${GL},#fff)`, border:`1.5px solid ${BD}`, borderRadius:16, padding:"22px 26px", textDecoration:"none" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:TXT, marginBottom:4 }}>{t.plansBanner.title}</div>
            <div style={{ fontSize:13, color:TM }}>{t.plansBanner.sub}</div>
          </div>
          <span style={{ background:C, color:"#fff", padding:"12px 22px", borderRadius:10, fontSize:14, fontWeight:700, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(255,102,51,.25)" }}>{t.plansBanner.cta}</span>
        </Link>
      </section>

      <section id="plans" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.plansSection.eyebrow}</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>{t.plansSection.heading}</h2>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, marginBottom:12 }} />
          <p style={{ fontSize:15, color:TM, marginBottom:18, lineHeight:1.8 }}>{t.plansSection.sub}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
            {t.plansSection.badges.map((b)=>(
              <span key={b} style={{ display:"inline-flex", alignItems:"center", gap:6, background:OW, border:`1px solid ${BD}`, color:TXT, fontSize:12, fontWeight:700, padding:"6px 13px", borderRadius:100 }}>
                <span style={{ color:G }}>✓</span>{b}
              </span>
            ))}
          </div>
          {/* 5プラン カード一覧 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, alignItems:"stretch" }}>
            {P.map((p)=>{
              const isPop = !!p.popular;
              return (
                <div key={p.key} style={{ position:"relative", background:"#fff", border:isPop?`2px solid ${C}`:`1px solid ${BD}`, borderRadius:16, padding:"26px 20px 22px", display:"flex", flexDirection:"column", boxShadow:isPop?"0 12px 34px rgba(255,102,51,.18)":"0 6px 24px rgba(20,40,60,.06)" }}>
                  {isPop && <span style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:C, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:100, whiteSpace:"nowrap", letterSpacing:".04em" }}>{t.plansSection.popularBadge}</span>}
                  <h3 style={{ fontSize:17, fontWeight:800, margin:"4px 0 6px", color:TXT }}>{p.name}</h3>
                  <p style={{ fontSize:12.5, color:TM, minHeight:56, margin:"0 0 12px", lineHeight:1.7 }}>{p.desc}</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
                    <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:27, fontWeight:900, color:G, lineHeight:1 }}>{p.price}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:G }}>{t.plansSection.yen}</span>
                    <span style={{ fontSize:12, color:TL, fontWeight:600 }}>{t.plansSection.perMonth}</span>
                  </div>
                  <div style={{ height:1, background:BD, margin:"16px 0" }} />
                  <ul style={{ listStyle:"none", padding:0, margin:"0 0 18px", flex:1 }}>
                    {p.features.map((f)=>(
                      <li key={f} style={{ fontSize:12.5, padding:"6px 0 6px 22px", position:"relative", color:"#374150", lineHeight:1.6 }}>
                        <span style={{ position:"absolute", left:0, top:5, color:G, fontWeight:800 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={()=>startApply(p)} style={{ width:"100%", textAlign:"center", fontWeight:800, fontSize:13.5, padding:13, borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", ...(isPop ? { background:C, color:"#fff", border:`1.5px solid ${C}` } : { background:"#fff", color:"#1A5C37", border:`1.5px solid ${G}` }) }}>{p.key==="プレミアム"?t.plansSection.ctaPremium:t.plansSection.ctaOther} →</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Options ── */}
      <section style={{ padding:"72px 24px", background:GL }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.options.eyebrow}</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>{t.options.heading}</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>{t.options.sub}</p>
          </div>
          <div className={styles.grid3} style={{ gap:20 }}>
            {OPT.map((o)=>(
              <div key={o.title} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:"28px 24px", textAlign:"center" }}>
                <div style={{ fontSize:32 }} aria-hidden>{o.icon}</div>
                <div style={{ marginTop:12, fontSize:16, fontWeight:700, color:TXT }}>{o.title}</div>
                <div style={{ marginTop:6, fontSize:14, fontWeight:700, color:G }}>{o.price}</div>
                <p style={{ marginTop:12, fontSize:13, color:TM, lineHeight:1.8, textAlign:"left" }}>{o.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop:20, textAlign:"center", fontSize:12, color:TL }}>{t.options.note}</p>
        </div>
      </section>

      {/* ── Flow ── */}
      <section id="flow" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.flow.eyebrow}</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>{t.flow.heading}</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>{t.flow.sub}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, alignItems:"stretch" }}>
            {FLW.map((s)=>(
              <div key={s.n} style={{ background:"#fff", border:s.active?`2px solid ${G}`:`1px solid ${BD}`, borderRadius:16, padding:"24px 22px", display:"flex", flexDirection:"column" }}>
                <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:26, fontWeight:900, color:s.active?G:"#D1D5DB", lineHeight:1, marginBottom:12 }}>{s.n}</div>
                <h4 style={{ fontSize:16, fontWeight:700, marginBottom:8, color:TXT }}>{s.h}</h4>
                <p style={{ fontSize:13, color:TM, lineHeight:1.75, flex:1 }}>{s.d}</p>
                {s.note && <p style={{ fontSize:12, color:TL, marginTop:12 }}>{s.note}</p>}
              </div>
            ))}
          </div>

          {/* 運用にあたってお預かりする情報 */}
          <div style={{ marginTop:24, background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"24px 26px" }}>
            <p style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:16 }}>{t.flow.infoHeading}</p>
            <div className={styles.grid2} style={{ gap:24 }}>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:TXT, marginBottom:4 }}>{t.flow.passHead}</p>
                <p style={{ fontSize:13, color:TM, lineHeight:1.8 }}>{t.flow.passBody}</p>
              </div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:TXT, marginBottom:4 }}>{t.flow.cancelHead}</p>
                <p style={{ fontSize:13, color:TM, lineHeight:1.8 }}>{t.flow.cancelBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Voices ── */}
      <section id="voices" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.voicesSection.eyebrow}</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>{t.voicesSection.heading}</h2>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, marginBottom:40 }} />
          <div className={styles.grid3} style={{ gap:20 }}>
            {visibleVoices.map((v)=>(
              <div key={v.name} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:24 }}>
                <div style={{ color:C, fontSize:14, marginBottom:12 }}>{"★".repeat(v.stars)}{"☆".repeat(5-v.stars)}</div>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8, marginBottom:16 }}>{v.text}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:40, height:40, borderRadius:"28%", background:v.color, position:"relative", flexShrink:0, overflow:"hidden" }}>
                    <span style={{ position:"absolute", bottom:-3, left:"50%", transform:"translateX(-50%)", width:30, height:18, background:"rgba(255,255,255,.88)", borderRadius:"50% 50% 0 0 / 70% 70% 0 0", display:"block" }} />
                    <span style={{ position:"absolute", top:7, left:"50%", transform:"translateX(-50%)", width:14, height:14, background:"rgba(255,255,255,.88)", borderRadius:"50%", display:"block" }} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:TXT }}>{v.name}</div>
                    <div style={{ fontSize:11, color:TL }}>{v.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
            {Array.from({length:voicePages}).map((_,i)=>(
              <button key={i} onClick={()=>setVoicePage(i)} style={{ width:i===voicePage?20:7, height:7, borderRadius:i===voicePage?4:"50%", background:i===voicePage?G:BD, border:"none", cursor:"pointer", padding:0, transition:"all .25s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 専任の運営担当者がサポート（Who we are） ── */}
      <section style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className={styles.grid2} style={{ gap:48, alignItems:"center" }}>
            {/* 運用チーム写真 */}
            <div style={{ background:OW, border:`1px solid ${BD}`, borderRadius:20, padding:18 }}>
              <div style={{ position:"relative", borderRadius:12, overflow:"hidden", background:"#EDEFED", minHeight:220, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ position:"absolute", fontSize:12, color:TL }}>{t.whoWeAre.photoPlaceholder}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/company/team.png" alt={t.whoWeAre.teamAlt} loading="lazy" style={{ position:"relative", display:"block", width:"100%", height:"auto", borderRadius:12 }} onError={(e)=>{ e.currentTarget.style.display="none"; }} />
              </div>
            </div>
            {/* テキスト＋責任者カード */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.whoWeAre.eyebrow}</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>{t.whoWeAre.heading}</h2>
              <div style={{ border:`1.5px solid ${BD}`, borderRadius:16, padding:"22px 24px", background:"#fff" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/interview/interview-1.png" alt={t.whoWeAre.personAlt} style={{ width:54, height:54, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:TXT }}>{t.whoWeAre.personName}</div>
                    <div style={{ fontSize:12.5, color:TM }}>{t.whoWeAre.personSub}</div>
                  </div>
                </div>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8, marginBottom:14 }}>{t.whoWeAre.personText}</p>
                <Link href="/subscription/blog/jemia-interview" style={{ color:G, fontSize:14, fontWeight:700, textDecoration:"none" }}>{t.whoWeAre.personLink}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 運営会社 ＋ メディア掲載（Company / Media） ── */}
      <section id="company" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className={styles.grid2} style={{ gap:48, alignItems:"start" }}>
            {/* 運営会社 */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.company.eyebrow}</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>{t.company.heading}</h2>
              <dl>
                {t.company.rows.map(([k,v])=>(
                  <div key={k} style={{ display:"flex", gap:16, padding:"14px 0", borderBottom:`1px solid ${BD}` }}>
                    <dt style={{ width:72, flexShrink:0, fontSize:13, color:TL }}>{k}</dt>
                    <dd style={{ fontSize:14, color:TXT, lineHeight:1.7 }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p style={{ fontSize:12, color:TL, margin:"14px 0 20px", lineHeight:1.8 }}>{t.company.note}</p>
              <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"22px 24px" }}>
                <p style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:14 }}>{t.company.safetyHeading}</p>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:10 }}>
                  {t.company.safetyItems.map((it)=>(
                    <li key={it} style={{ fontSize:13.5, color:TM, lineHeight:1.7 }}>{it}</li>
                  ))}
                  <li style={{ fontSize:13.5, color:TM, lineHeight:1.7 }}>{t.company.safetyPrivacyPrefix}<Link href="/subscription/privacy" style={{ color:G, textDecoration:"underline" }}>{t.company.safetyPrivacyLink}</Link>{t.company.safetyPrivacySuffix}</li>
                </ul>
              </div>
            </div>
            {/* メディア掲載 */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.media.eyebrow}</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>{t.media.heading}</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {mediaItems.map((m)=>(
                  <div key={m.url} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"18px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:12.5, color:TM }}>{m.media}</span>
                      <time style={{ fontSize:12, color:TL }}>{m.date}</time>
                    </div>
                    <a href={m.url} target="_blank" rel="noopener" style={{ display:"block", fontSize:14, fontWeight:700, color:TXT, lineHeight:1.6, marginBottom:10, textDecoration:"none" }}>{m.title}</a>
                    <a href={m.url} target="_blank" rel="noopener" style={{ fontSize:13, fontWeight:700, color:G, textDecoration:"none" }}>{t.media.ctaItem}</a>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <Link href="/subscription/media" style={{ fontSize:13, fontWeight:700, color:G, textDecoration:"none" }}>{t.media.ctaAll}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── お役立ち記事（自動横スクロール） ── */}
      <section style={{ padding:"48px 0 44px", background:"#fff", overflow:"hidden" }}>
        <div style={{ padding:"0 24px", maxWidth:1100, margin:"0 auto", marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:8 }}>{t.blog.eyebrow}</div>
          <h2 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:700, color:TXT, letterSpacing:"-.02em" }}>{t.blog.heading}</h2>
          <p style={{ fontSize:14, color:TM, marginTop:6, lineHeight:1.8 }}>{t.blog.sub}</p>
        </div>
        <div className={styles.marqueeMask} style={{ overflow:"hidden" }}>
          <div className={styles.blogMarquee} style={{ display:"flex", width:"max-content" }}>
            {[...latestPosts, ...latestPosts].map((a, i)=>(
              <Link key={i} href={a.href} style={{ position:"relative", flexShrink:0, width:290, marginRight:16, background:"#fff", border: a.featured ? `2px solid ${C}` : `1px solid ${BD}`, borderRadius:16, overflow:"hidden", textDecoration:"none", boxShadow: a.featured ? "0 6px 22px rgba(255,102,51,.18)" : "0 2px 14px rgba(0,0,0,.05)" }}>
                {a.featured && (
                  <span style={{ position:"absolute", top:10, left:10, zIndex:2, background:C, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, boxShadow:"0 2px 8px rgba(255,102,51,.3)" }}>{t.blog.featured}</span>
                )}
                <div style={{ height:150, background:a.color, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
                  <span style={{ color:"#fff", fontSize:15, fontWeight:700, textAlign:"center", lineHeight:1.5, letterSpacing:".02em" }}>{a.tag}</span>
                </div>
                <div style={{ padding:"16px 16px 18px" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:TXT, lineHeight:1.55, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{a.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:28 }}>
          <Link href="/subscription/blog" style={{ display:"inline-block", color:G, fontSize:14, fontWeight:700, textDecoration:"none", border:`2px solid ${G}`, borderRadius:10, padding:"10px 24px" }}>{t.blog.cta}</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>{t.faqSection.eyebrow}</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:40, letterSpacing:"-.02em", color:TXT }}>{t.faqSection.heading}</h2>
          {FQ.map((faq,i)=>(
            <div key={i} style={{ borderBottom:`1px solid ${BD}` }}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:"100%", textAlign:"left", background:"none", border:"none", padding:"20px 0", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, fontFamily:"inherit", color:TXT }}>
                {faq.q}
                <span style={{ width:24, height:24, borderRadius:"50%", background:GL, color:G, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"transform .3s", transform:openFaq===i?"rotate(45deg)":"none" }}>+</span>
              </button>
              {openFaq===i && <div style={{ fontSize:14, color:TM, lineHeight:1.8, paddingBottom:20 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="contact" style={{ background:`linear-gradient(135deg,${G} 0%,#1a5c37 100%)`, padding:"80px 24px", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className={styles.grid2} style={{ gap:48, alignItems:"center" }}>
            {/* 左：CTA */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.7)", textTransform:"uppercase", marginBottom:12 }}>{t.finalCta.eyebrow}</div>
              <h2 style={{ fontSize:"clamp(24px,3.4vw,36px)", fontWeight:700, color:"#fff", marginBottom:16, lineHeight:1.3, letterSpacing:"-.02em" }}>{t.finalCta.heading1}<br />{t.finalCta.heading2}</h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,.75)", marginBottom:32, lineHeight:1.8 }}>{t.finalCta.sub}</p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button style={{ background:"#fff", color:G, border:"none", padding:"16px 32px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }} onClick={()=>openModal("consult","最終CTA：マーケティング相談")}>{t.finalCta.ctaBtn}</button>
                <Link href="/subscription/diagnosis" style={{ background:"rgba(255,255,255,.12)", color:"#fff", border:"2px solid rgba(255,255,255,.6)", padding:"16px 28px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none" }}>{t.finalCta.ctaLink}</Link>
              </div>
            </div>
            {/* 右：確認事項 */}
            <div style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.2)", borderRadius:16, padding:"26px 28px" }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:16 }}>{t.finalCta.boxHeading}</p>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 18px", display:"flex", flexDirection:"column", gap:12 }}>
                {t.finalCta.boxItems.map((it)=>(
                  <li key={it} style={{ fontSize:13.5, color:"rgba(255,255,255,.82)", lineHeight:1.7 }}>{it}</li>
                ))}
              </ul>
              <Link href="/subscription/diagnosis" style={{ fontSize:14, fontWeight:700, color:"#fff", textDecoration:"underline" }}>{t.finalCta.boxLink}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {modal && (
        <div onClick={(e)=>{ if(e.target===e.currentTarget) closeModal(); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:480, padding:"clamp(22px,5vw,40px)", position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
            <button onClick={closeModal} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", fontSize:22, cursor:"pointer", color:TL, lineHeight:1 }}>×</button>
            {thanks ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8, color:TXT }}>{t.modal.thanksTitle}</h3>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8 }}>{t.modal.thanksBody}</p>
                <button style={{ ...btnPrimary, marginTop:24 }} onClick={closeModal}>{t.modal.close}</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:TXT }}>{formSource === "plan_apply" ? t.modal.titlePlanApply : t.modal.titleConsult}</h3>
                <p style={{ fontSize:13, color:TL, marginBottom:28 }}>{t.modal.subNote}</p>
                <form ref={formRef} onSubmit={submitForm}>
                  <input type="text" name="website" style={{ display:"none" }} tabIndex={-1} autoComplete="off" />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                    <div>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{t.modal.lastName}<span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>{t.modal.required}</span></label>
                      <input name="last_name" type="text" placeholder={t.modal.lastNamePh} required autoComplete="family-name" style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{t.modal.firstName}<span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>{t.modal.required}</span></label>
                      <input name="first_name" type="text" placeholder={t.modal.firstNamePh} required autoComplete="given-name" style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                  </div>
                  {[
                    { label:t.modal.email, name:"email", type:"email", placeholder:t.modal.emailPh, required:true },
                    { label:t.modal.instagram, name:"instagram_id", type:"text", placeholder:t.modal.instagramPh, required:false },
                  ].map((f)=>(
                    <div key={f.name} style={{ marginBottom:16 }}>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{f.label}{f.required && <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>{t.modal.required}</span>}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} onInput={f.name === "instagram_id" ? (e)=>{ e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9._]/g, ""); } : undefined} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{formSource === "plan_apply" ? t.modal.planWanted : t.modal.planInterested}</label>
                    <select name="inquiry_type" value={formPlan} onChange={(e)=>setFormPlan(e.target.value)} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, background:"#fff", outline:"none" }}>
                      <option value="">{t.modal.selectPlaceholder}</option>
                      {P.map(p=><option key={p.key} value={p.key}>{p.name}（¥{p.price}{t.plansSection.perMonthShort}）</option>)}
                      <option value="まだ決めていない">{t.modal.undecided}</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{t.modal.question}{formSource === "consult"
                      ? <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>{t.modal.required}</span>
                      : <span style={{ fontSize:10, color:TL, background:OW, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>{t.modal.optional}</span>}</label>
                    <textarea name="message" placeholder={t.modal.questionPh} required={formSource === "consult"} rows={3} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none", resize:"vertical" }} />
                  </div>
                  <button type="submit" disabled={sending} style={{ ...btnPrimary, width:"100%", padding:16, fontSize:15, marginTop:8, opacity:sending?.6:1 }}>
                    {sending ? t.modal.sending : t.modal.submit}
                  </button>
                  <p style={{ fontSize:11, color:TL, textAlign:"center", marginTop:12, lineHeight:1.7 }}>{t.modal.hours}</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── 右下追従のチャット相談ボタン（チャットボット風） ── */}
      {!chatOpen && (
        <button
          onClick={()=>setChatOpen(true)}
          aria-label={t.chat.aria}
          style={{ position:"fixed", right:16, bottom:16, zIndex:150, display:"flex", alignItems:"center", gap:8, background:G, color:"#fff", border:"none", borderRadius:100, padding:"10px 18px 10px 12px", boxShadow:"0 8px 24px rgba(45,122,79,.38)", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700 }}
        >
          <span style={{ width:30, height:30, borderRadius:"50%", background:"#fff", color:G, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>💬</span>
          <span>{t.chat.label}</span>
        </button>
      )}
      {chatOpen && <ContactForm variant="modal" onClose={()=>setChatOpen(false)} lang={lang} />}

      {/* ── JEMIA Footer ── */}
      <footer className={styles.siteFooter}>
        <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"left" }}>
          <div className={styles.grid2} style={{ gap:40, alignItems:"start" }}>
            {/* ブランド */}
            <div>
              <div style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:22, color:"#fff", marginBottom:12 }}>JEM<span style={{ color:C }}>I</span>A</div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.9, marginBottom:12 }}>{t.footer.tagline}<br />{t.footer.addr}</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.9 }}>{t.footer.hours}</p>
            </div>
            {/* リンク3カラム */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
              {[t.footer.colService, t.footer.colInfo, t.footer.colTerms].map((col)=>(
                <div key={col.head}>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.9)", marginBottom:12 }}>{col.head}</div>
                  <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:10 }}>
                    {col.links.map(([label,href])=>(
                      <li key={label}>
                        {href.startsWith("#")
                          ? <a href={href} style={{ color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13 }}>{label}</a>
                          : <Link href={href} style={{ color:"rgba(255,255,255,0.6)", textDecoration:"none", fontSize:13 }}>{label}</Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", marginTop:36, paddingTop:24 }}>
            <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.45)", lineHeight:1.9, marginBottom:10 }}>{t.footer.legal}</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
