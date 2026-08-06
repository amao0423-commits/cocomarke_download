"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./subscription.module.css";
import { getAttribution } from "@/lib/attribution";
import { useRouter } from "next/navigation";
import { mediaItems } from "./_components/MediaMentions";
import ResultsBeforeAfter from "./_components/ResultsBeforeAfter";
import ContactForm from "./_components/ContactForm";

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

const plans = [
  {
    name: "いいね代行",
    price: "9,800",
    desc: "ターゲット層への自動いいねで認知を拡大。フォロワーへの返しいいねも対応。アカウント保護設定付き。",
    features: ["1日最大200いいね","ターゲットキーワード設定（最大50個）","競合アカウントフォロワーへのアプローチ","LINE相談サポート","月次レポート"],
  },
  {
    name: "発見表示ブースト",
    price: "19,800",
    desc: "投稿の初速エンゲージメントを高め、おすすめ・発見タブへの掲載確率を劇的に向上。新規リーチを最大化。",
    features: ["投稿直後の集中ブースト","ハッシュタグ最適化提案","投稿タイミング分析・提案","おすすめ・発見タブ掲載レポート","LINE・メール相談サポート（優先）"],
  },
  {
    name: "セットプラン",
    price: "24,980",
    popular: true,
    desc: "「いいね代行」と「発見表示ブースト」のセット。両方を同時運用し、相乗効果で成果を最大化。",
    features: ["いいね代行の全機能","発見表示ブーストの全機能","単独契約より4,620円お得","月次簡易レポート"],
  },
  {
    name: "リスト上位表示",
    price: "14,800",
    desc: "狙ったキーワード検索でアカウントが上位表示されるよう最適化。特定キーワードの独占を目指す。",
    features: ["上位キーワード分析・選定","プロフィール最適化サポート","検索順位モニタリング","月次ランキングレポート"],
  },
  {
    name: "プレミアム",
    price: "49,800",
    desc: "ご要望や他SNSへのエンゲージメント増加など、ご相談内容に応じて、あなたに合ったプランをご提案・セレクトします。",
    features: ["全プランの全機能","専任コンサルタント担当","投稿代行（月8本まで）","分析レポート"],
  },
];

const faqs = [
  { q:"いつでも解約できますか？", a:"はい、月単位での契約ですので翌月分から解約が可能です。違約金や解約手数料は一切かかりません。" },
  { q:"効果が出るまでどれくらいかかりますか？", a:"多くのお客様で1〜2ヶ月以内に数値の改善が見られます。特におすすめ・発見タブへの掲載は早いケースで2〜3週間で効果が出始めます。" },
  { q:"アカウントが凍結されるリスクはありませんか？", a:"Instagramのガイドラインに準拠した安全な手法のみを使用しています。過去3000件以上の導入で凍結事例はゼロです。" },
  { q:"支払い方法は何に対応していますか？", a:"クレジットカード（VISA・Mastercard・JCB）・銀行振込・PayPayに対応しています。" },
  { q:"個人アカウントでも利用できますか？", a:"はい、個人・法人を問わずご利用いただけます。ビジネスアカウントへの切り替えを推奨しています（無料でサポートします）。" },
  { q:"上位表示を保証してくれますか？", a:"成果保証は一切しておりません。これはインスタグラムによるアルゴリズム（検索順位決定の仕様）で順位が決定されていく為、保証は不可能である為です。また、上位表示を達成したとしても、アルゴリズム変動によって順位変動する可能性は常に存在します。そのため、常にインスタグラムのアルゴリズムおよび、SEO状況の現状把握と変動時の対応を続けていく必要があることをご理解ください。" },
];

const voices = [
  { stars:5, text:"「新宿 居酒屋」での検索で表示される機会が増え、インスタ経由でのご予約が入るようになりました。以前は認知してもらう手段がなかったので助かっています。", name:"都内・飲食店店長様", biz:"導入3ヶ月", color:"#E8734A" },
  { stars:5, text:"投稿後のブーストを使い始めてから、リールの再生数が安定して伸びるようになってきました。まだ成長途中ですが手ごたえを感じています。", name:"フリーランス・クリエイター様", biz:"導入4ヶ月", color:"#5B73DE" },
  { stars:4, text:"フォロワー以外の方からの保存やコメントが増えてきた実感があります。おすすめ・発見タブからの流入が増えているのをインサイトで確認できています。", name:"個人ブランディング中のお客様", biz:"導入2ヶ月", color:"#7B5EA7" },
  { stars:5, text:"いいね代行でターゲット層との接点が増え、プロフィールへの訪問数が上がりました。サイトへの流入も少し改善されています。", name:"ECサイト運営担当者様", biz:"リピーター継続中", color:"#3D9BD4" },
  { stars:5, text:"地域キーワードでの表示機会が増え、初めてのお客様からの問い合わせが来るようになりました。", name:"ネイルサロン経営者様", biz:"導入3ヶ月", color:"#C45BAA" },
  { stars:4, text:"投稿への保存数が以前より増えています。劇的な変化というわけではないですが、数値が改善されているのは実感できます。", name:"美容サロン経営者様", biz:"導入3ヶ月", color:"#4CAF75" },
];

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
  const startApply = (plan: { name:string }) => {
    if (plan.name === "プレミアム") {
      openModal("consult", `料金表：${plan.name}`, plan.name);
      return;
    }
    router.push(`/subscription/apply?plan=${encodeURIComponent(plan.name)}`);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lastName  = ((fd.get("last_name") as string) || "").trim();
    const firstName = ((fd.get("first_name") as string) || "").trim();
    const name    = `${lastName} ${firstName}`.trim();
    const email   = (fd.get("email") as string).trim();
    const message = (fd.get("message") as string).trim();
    if (!lastName || !firstName || !email) { alert("姓・名・メールアドレスは必須です。"); return; }
    if (formSource === "consult" && !message) { alert("ご質問事項をご入力ください。"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("メールアドレスの形式が正しくありません。"); return; }
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
      else alert(data.error || "送信に失敗しました。");
    } catch { alert("送信に失敗しました。"); }
    finally { setSending(false); }
  };

  const voicePerPage = 3;
  const voicePages = Math.ceil(voices.length / voicePerPage);
  const visibleVoices = voices.slice(voicePage * voicePerPage, (voicePage+1) * voicePerPage);

  const kw1 = ["新宿ランチ","渋谷カフェ","大宮居酒屋","川越カフェ","中目黒グルメ","札幌グルメ","すすきのカフェ","韓国旅行","箱根温泉","女子旅","沖縄ホテル","池袋ランチ","横浜カフェ","名古屋グルメ","大阪スイーツ","福岡グルメ","神戸カフェ","京都ランチ","鎌倉カフェ","吉祥寺ディナー","銀座グルメ"];
  const kw2 = ["ハイトーンカラー","レイヤーカット","髪質改善","縮毛矯正","横浜美容室","渋谷美容室","ブライダルエステ","小顔矯正","アートメイク","ルームツアー","韓国インテリア","表参道美容室","銀座ネイル","梅田美容室","心斎橋ネイル","名古屋美容室","福岡美容室","札幌美容室","まつ毛パーマ","二重整形","脱毛サロン"];
  const kw3 = ["시부야 맛집","신주쿠맛집","아트메이크","ネイルサロン","新宿グルメ","姿勢改善","婚約指輪","韓国式足裏角質ケア","프치쁠라코스메","原宿カフェ","恵比寿ディナー","大宮ネイル","川崎美容室","横浜ネイル","千葉グルメ","大阪ネイル","시부야 카페","하라주쿠 쇼핑","上野グルメ","町田美容室"];

  const btnPrimary: React.CSSProperties = { background:C, color:"#fff", border:"none", padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", boxShadow:`0 4px 20px rgba(255,102,51,.3)` };

  return (
    <div className="[text-wrap:pretty]">
      {/* ── 最上部インフォバー ── */}
      <div style={{ background:"#1A1A1A" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"7px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:14, flexWrap:"wrap", fontSize:12, color:"rgba(255,255,255,.78)" }}>
          <span>運営：株式会社ホットセラー</span>
          <span style={{ color:"rgba(255,255,255,.3)" }}>｜</span>
          <span>受付：平日 09:00–18:00</span>
          <span style={{ color:"rgba(255,255,255,.3)" }}>｜</span>
          <span>Instagram運用サブスク「JEMIA」</span>
        </div>
      </div>

      {/* ── JEMIA Header ── */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.headerLogo}>JEM<span style={{ color:C }}>I</span>A</a>
          <nav className={styles.headerNav}>
            {([["料金","#plans"],["実績","#voices"],["FAQ","#faq"]] as const).map(([label,href])=>(
              <a key={href} href={href}>{label}</a>
            ))}
            <Link href="/subscription/blog">お役立ち記事</Link>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/subscription/blog" className={styles.navLinkMobile}>お役立ち記事</Link>
            <Link href="/subscription/diagnosis" className={styles.headerCorp}>
              <span className={styles.labelFull}>📄 資料ダウンロード</span><span className={styles.labelShort}>📄 資料</span>
            </Link>
            <button className={styles.headerCta} onClick={()=>openModal("consult","ヘッダー：マーケティング相談")}>
              <span className={styles.labelFull}>🎧 マーケティング相談はこちら</span><span className={styles.labelShort}>🎧 相談</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 受付枠バー（ヘッダー直下） ── */}
      <div style={{ background:OW, borderBottom:`1px solid ${BD}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"11px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap", textAlign:"center" }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:CL, color:C, fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100, flexShrink:0 }}>
            <span className={styles.pulseDot} style={{ width:6, height:6, borderRadius:"50%", background:C, display:"inline-block" }} />受付中
          </span>
          <span style={{ fontSize:14, fontWeight:700, color:TXT }}>今月の残り受付枠：<span style={{ color:C, fontWeight:900 }}>3件</span></span>
          <span style={{ fontSize:12.5, color:TM }}>担当が固定制のため、月ごとに新規のお受け入れ数を制限しています。</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="top" style={{ background:`linear-gradient(160deg,#fff 0%,${GL} 100%)`, padding:"72px 24px 64px", position:"relative", overflow:"hidden", scrollMarginTop:64 }}>
        <div className={styles.heroGrid} style={{ maxWidth:1100, margin:"0 auto", alignItems:"center", paddingBottom:80 }}>
          {/* left */}
          <div className={styles.fadeUp}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:CL, color:C, fontSize:12, fontWeight:700, letterSpacing:".06em", padding:"6px 14px", borderRadius:100, marginBottom:20 }}>
              <span className={styles.pulseDot} style={{ width:6, height:6, background:C, borderRadius:"50%", display:"inline-block" }} />
              サブスク型インスタ運用代行
            </div>
            <h1 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, lineHeight:1.25, letterSpacing:"-.03em", marginBottom:20, color:TXT }}>
              インスタ運用を<br />
              <span style={{ color:G, borderBottom:`3px solid ${C}` }}>サブスクで</span>。
            </h1>
            <p style={{ fontSize:15, color:TM, marginBottom:32, lineHeight:1.8 }}>
              月額固定でインスタ運用をまるごとお任せ。<br />
              いいね代行・おすすめ・発見タブ最適化・LINE相談まで。
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
              <a href="/shindan.html" style={{ ...btnPrimary, display:"inline-block", textDecoration:"none" }}>アカウント診断 →</a>
              <a href="#plans" style={{ background:"transparent", color:G, border:`2px solid ${G}`, padding:"12px 24px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none", display:"inline-block" }}>料金を見る</a>
              <Link href="/subscription/diagnosis" style={{ display:"inline-flex", alignItems:"center", gap:6, color:C, fontSize:14, fontWeight:700, textDecoration:"none", padding:"12px 4px" }}>30秒でプラン診断 →</Link>
            </div>
            <div style={{ display:"flex", gap:28 }}>
              {[["3000+","導入アカウント数"],["4.9","平均満足度"],["3x","平均フォロワー増加"]].map(([n,l])=>(
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
                {["アカウント","ハッシュタグ","場所"].map((t,i)=>(
                  <div key={t} style={{ fontSize:11, fontWeight:700, padding:"6px 10px", color:i===0?G:TL, borderBottom:i===0?`2px solid ${G}`:"2px solid transparent", marginBottom:-1, whiteSpace:"nowrap" }}>{t}</div>
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
                    <div style={{ fontSize:10, color:TL, marginTop:1 }}>フォロワー 12,400 · JEMIA運用中</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:G }}>1位</div>
                </div>
                {[["A","3,200","2位"],["B","1,800","3位"]].map(([n,f,p])=>(
                  <div key={n} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", opacity:.42 }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#bbb,#999)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>{n}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700 }}>@competitor_{n.toLowerCase()}</div><div style={{ fontSize:10, color:TL }}>フォロワー {f}</div></div>
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
            {[
              ["12,400","導入アカウント フォロワー増加","平均 3ヶ月後の実績",false],
              ["340%","おすすめ・発見タブ リーチ増加率","先月比 平均値",true],
              ["4.9","顧客満足度","/ 5点満点（20件）",false],
            ].map(([n,l,d,coral])=>(
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
        <ResultsBeforeAfter />
      </section>

      {/* ── Keywords Marquee ── */}
      <section style={{ background:G, padding:"64px 0", overflow:"hidden" }}>
        <div style={{ padding:"0 24px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.6)", textTransform:"uppercase", marginBottom:12 }}>Keywords</div>
          <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:700, color:"#fff", marginBottom:32, letterSpacing:"-.02em" }}>おすすめ・発見タブ・検索上位の独占キーワード実績</h2>
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
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>How it improves</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>導入でアカウントはこう変わる</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>プランごとの導入イメージを、実際の画面とともにご紹介します。</p>
          </div>
          {[
            { badge:"いいね代行", price:"9,800円/月（税込）〜", img:"/images/intro/intro-like.webp", alt:"いいね代行の導入イメージ：フォロワー・非フォロワーとの交流",
              title:"フォロワー外との接点が生まれ、認知が広がる",
              points:[
                ["認知の入口が広がる","これまで届かなかったフォロワー外のユーザーに、アカウントの存在を知ってもらえます。"],
                ["自然な認知拡大に繋がる","ユーザーへの反応を積み重ねることで、アクティブな状態になりアカウントの評価が向上します。"],
                ["手間なく自動で","ターゲット設定はおまかせ。運用の手間をかけずに認知拡大が進みます。"],
              ] },
            { badge:"リスト上位表示", price:"14,800円/月（税込）〜", img:"/images/intro/intro-rank.webp", alt:"リスト上位表示の導入イメージ：検索結果の上位に表示される",
              title:"検索で「見つけられる」アカウントへ",
              points:[
                ["検索で見つけられる","「エリア×業種」などのキーワードで検索したユーザーに、上位表示で見つけてもらえます。"],
                ["安定した流入をつくる","一時的なバズに頼らず、検索からの継続的な流入基盤を築きます。"],
                ["プロフィール流入が増加","アカウントリストへ表示されるため、プロフィールからの流入・認知拡大に繋がります。"],
              ] },
          ].map((r, ri, arr)=>(
            <div key={r.badge} className={styles.grid2} style={{ gap:48, alignItems:"center", marginBottom: ri < arr.length-1 ? 56 : 0 }}>
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
            <div style={{ fontSize:16, fontWeight:700, color:TXT, marginBottom:4 }}>どのプランが合うか迷っていませんか？</div>
            <div style={{ fontSize:13, color:TM }}>かんたん4問・30秒で、あなたに最適なプランがわかります。</div>
          </div>
          <span style={{ background:C, color:"#fff", padding:"12px 22px", borderRadius:10, fontSize:14, fontWeight:700, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(255,102,51,.25)" }}>30秒でプラン診断 →</span>
        </Link>
      </section>

      <section id="plans" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Plans & Pricing</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>料金プラン（月額固定・税込）</h2>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, marginBottom:12 }} />
          <p style={{ fontSize:15, color:TM, marginBottom:18, lineHeight:1.8 }}>表示価格はすべて税込です。初期費用・解約手数料はかかりません。オプションを追加しない限り、記載の月額以外の請求は発生しません。</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
            {["初期費用 0円","最低利用期間なし","解約手数料 0円","自動更新（当月連絡で翌月停止）","クレジットカード／請求書払い"].map((b)=>(
              <span key={b} style={{ display:"inline-flex", alignItems:"center", gap:6, background:OW, border:`1px solid ${BD}`, color:TXT, fontSize:12, fontWeight:700, padding:"6px 13px", borderRadius:100 }}>
                <span style={{ color:G }}>✓</span>{b}
              </span>
            ))}
          </div>
          {/* 5プラン カード一覧 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, alignItems:"stretch" }}>
            {plans.map((p)=>{
              const isPop = !!p.popular;
              return (
                <div key={p.name} style={{ position:"relative", background:"#fff", border:isPop?`2px solid ${C}`:`1px solid ${BD}`, borderRadius:16, padding:"26px 20px 22px", display:"flex", flexDirection:"column", boxShadow:isPop?"0 12px 34px rgba(255,102,51,.18)":"0 6px 24px rgba(20,40,60,.06)" }}>
                  {isPop && <span style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:C, color:"#fff", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:100, whiteSpace:"nowrap", letterSpacing:".04em" }}>人気 No.1</span>}
                  <h3 style={{ fontSize:17, fontWeight:800, margin:"4px 0 6px", color:TXT }}>{p.name}</h3>
                  <p style={{ fontSize:12.5, color:TM, minHeight:56, margin:"0 0 12px", lineHeight:1.7 }}>{p.desc}</p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
                    <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:27, fontWeight:900, color:G, lineHeight:1 }}>{p.price}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:G }}>円</span>
                    <span style={{ fontSize:12, color:TL, fontWeight:600 }}>/月（税込）〜</span>
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
                  <button onClick={()=>startApply(p)} style={{ width:"100%", textAlign:"center", fontWeight:800, fontSize:13.5, padding:13, borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", ...(isPop ? { background:C, color:"#fff", border:`1.5px solid ${C}` } : { background:"#fff", color:"#1A5C37", border:`1.5px solid ${G}` }) }}>{p.name==="プレミアム"?"相談する":"申し込む"} →</button>
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
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Options</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>プランに追加できるオプション</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>目的に合わせて、必要な施策だけを追加できます。すべてのプランに組み合わせOK。</p>
          </div>
          <div className={styles.grid3} style={{ gap:20 }}>
            {[
              { icon:"📝", title:"投稿制作オプション", price:"月4本 +9,800円 / 月8本 +18,000円", desc:"プロによる投稿制作（文字入れ・構成・ハッシュタグ）。撮影した写真を送るだけでOK。" },
              { icon:"🚀", title:"発見表示ブースト", price:"+19,800円 / 月", desc:"おすすめ・発見タブへの露出を強化するオプション。新規リーチをさらに伸ばしたいときに追加できます。" },
              { icon:"👥", title:"複数アカウント割", price:"2つ目以降 5%OFF", desc:"複数店舗・系列店・ブランド別アカウントなど、2つ目以降を割引価格でご利用いただけます。" },
            ].map((o)=>(
              <div key={o.title} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:"28px 24px", textAlign:"center" }}>
                <div style={{ fontSize:32 }} aria-hidden>{o.icon}</div>
                <div style={{ marginTop:12, fontSize:16, fontWeight:700, color:TXT }}>{o.title}</div>
                <div style={{ marginTop:6, fontSize:14, fontWeight:700, color:G }}>{o.price}</div>
                <p style={{ marginTop:12, fontSize:13, color:TM, lineHeight:1.8, textAlign:"left" }}>{o.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop:20, textAlign:"center", fontSize:12, color:TL }}>※ プレミアムは投稿代行（月8本まで）を標準で含みます。オプションはお申し込み時・運用開始後どちらでも追加できます。</p>
        </div>
      </section>

      {/* ── Flow ── */}
      <section id="flow" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>How it works</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>導入の流れ</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>ご相談から運用開始まで、最短で翌日にスタートできます。お客様の作業は初回のヒアリングとお支払いのみです。</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16, alignItems:"stretch" }}>
            {[
              { n:"01", h:"お申し込み・無料相談", d:"フォームからお申し込みください。現状のアカウントを確認し、メールにてお手続きフォーム・ご相談内容に応じてご連絡いたします。", note:"所要 15〜30分／費用なし" },
              { n:"02", h:"作業内容・金額のご提示", d:"実施する作業と月額の内訳を書面でお渡しします。ご不明点が解消してからお申し込みいただけます。" },
              { n:"03", h:"プラン選択・お支払い", d:"ご希望のプランを選び、オンラインで決済。法人のお客様は請求書払いもご利用いただけます。" },
              { n:"04", h:"運用開始", d:"設定はすべて担当が対応します。以降は簡易月次レポートで進捗を共有します。", active:true },
            ].map((s)=>(
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
            <p style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:16 }}>運用にあたってお預かりする情報</p>
            <div className={styles.grid2} style={{ gap:24 }}>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:TXT, marginBottom:4 }}>パスワードのお預かり</p>
                <p style={{ fontSize:13, color:TM, lineHeight:1.8 }}>いいね代行をご選択の場合、パスワードの共有が必要になります。お預かりする場合は取扱者を担当者に限定し、契約終了時に速やかに削除します。</p>
              </div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:TXT, marginBottom:4 }}>解約時のお手続き</p>
                <p style={{ fontSize:13, color:TM, lineHeight:1.8 }}>当月中のご連絡で翌月分から停止。違約金・引き止めはありません。設定はこちらで解除します。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Voices ── */}
      <section id="voices" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Voice</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>お客様の声</h2>
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
                <span style={{ position:"absolute", fontSize:12, color:TL }}>運用チーム写真（team.png）を配置</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/company/team.png" alt="JEMIA運用チーム（東京オフィス）" loading="lazy" style={{ position:"relative", display:"block", width:"100%", height:"auto", borderRadius:12 }} onError={(e)=>{ e.currentTarget.style.display="none"; }} />
              </div>
            </div>
            {/* テキスト＋責任者カード */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Who we are</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>専任の運営担当者がサポート</h2>
              <div style={{ border:`1.5px solid ${BD}`, borderRadius:16, padding:"22px 24px", background:"#fff" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/interview/interview-1.png" alt="JEMIA運営責任者" style={{ width:54, height:54, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:TXT }}>JEMIA 運営責任者</div>
                    <div style={{ fontSize:12.5, color:TM }}>株式会社ホットセラー／Instagram運用マーケティング歴 6年</div>
                  </div>
                </div>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8, marginBottom:14 }}>「頑張っても伸びない」を終わらせたい。― 運営責任者インタビューを公開しています。</p>
                <Link href="/subscription/blog/jemia-interview" style={{ color:G, fontSize:14, fontWeight:700, textDecoration:"none" }}>インタビューを読む →</Link>
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
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Company</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>運営会社</h2>
              <dl>
                {[
                  ["会社名","株式会社ホットセラー"],
                  ["所在地","東京都中央区晴海1-8-16 晴海トリトンスクエアX棟"],
                  ["連絡先","お問い合わせフォーム・LINE（受付：平日 09:00–18:00）"],
                ].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", gap:16, padding:"14px 0", borderBottom:`1px solid ${BD}` }}>
                    <dt style={{ width:72, flexShrink:0, fontSize:13, color:TL }}>{k}</dt>
                    <dd style={{ fontSize:14, color:TXT, lineHeight:1.7 }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p style={{ fontSize:12, color:TL, margin:"14px 0 20px", lineHeight:1.8 }}>※ お打ち合わせはオンラインのほか、ご来社・訪問にも対応しています。</p>
              <div style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"22px 24px" }}>
                <p style={{ fontSize:14, fontWeight:700, color:TXT, marginBottom:14 }}>お取引の安全性について</p>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:10 }}>
                  <li style={{ fontSize:13.5, color:TM, lineHeight:1.7 }}>・契約書／秘密保持契約（NDA）の締結に対応</li>
                  <li style={{ fontSize:13.5, color:TM, lineHeight:1.7 }}>・請求書払い・法人口座での取引に対応</li>
                  <li style={{ fontSize:13.5, color:TM, lineHeight:1.7 }}>・お預かり情報の取り扱いは<Link href="/subscription/privacy" style={{ color:G, textDecoration:"underline" }}>プライバシーポリシー</Link>に準拠</li>
                </ul>
              </div>
            </div>
            {/* メディア掲載 */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Media</div>
              <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT, marginBottom:24 }}>メディア掲載</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {mediaItems.map((m)=>(
                  <div key={m.url} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:16, padding:"18px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:12.5, color:TM }}>{m.media}</span>
                      <time style={{ fontSize:12, color:TL }}>{m.date}</time>
                    </div>
                    <p style={{ fontSize:14, fontWeight:700, color:TXT, lineHeight:1.6, marginBottom:10 }}>{m.title}</p>
                    <a href={m.url} target="_blank" rel="noopener" style={{ fontSize:13, fontWeight:700, color:G, textDecoration:"none" }}>掲載ページを見る →</a>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <Link href="/subscription/media" style={{ fontSize:13, fontWeight:700, color:G, textDecoration:"none" }}>メディア掲載実績の一覧を見る →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── お役立ち記事（自動横スクロール） ── */}
      <section style={{ padding:"48px 0 44px", background:"#fff", overflow:"hidden" }}>
        <div style={{ padding:"0 24px", maxWidth:1100, margin:"0 auto", marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:8 }}>Blog</div>
          <h2 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:700, color:TXT, letterSpacing:"-.02em" }}>お役立ち記事</h2>
          <p style={{ fontSize:14, color:TM, marginTop:6, lineHeight:1.8 }}>インスタ運用のヒントを発信しています。</p>
        </div>
        <div className={styles.marqueeMask} style={{ overflow:"hidden" }}>
          <div className={styles.blogMarquee} style={{ display:"flex", width:"max-content" }}>
            {[...latestPosts, ...latestPosts].map((a, i)=>(
              <Link key={i} href={a.href} style={{ position:"relative", flexShrink:0, width:290, marginRight:16, background:"#fff", border: a.featured ? `2px solid ${C}` : `1px solid ${BD}`, borderRadius:16, overflow:"hidden", textDecoration:"none", boxShadow: a.featured ? "0 6px 22px rgba(255,102,51,.18)" : "0 2px 14px rgba(0,0,0,.05)" }}>
                {a.featured && (
                  <span style={{ position:"absolute", top:10, left:10, zIndex:2, background:C, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, boxShadow:"0 2px 8px rgba(255,102,51,.3)" }}>★ 注目</span>
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
          <Link href="/subscription/blog" style={{ display:"inline-block", color:G, fontSize:14, fontWeight:700, textDecoration:"none", border:`2px solid ${G}`, borderRadius:10, padding:"10px 24px" }}>記事一覧を見る →</Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>FAQ</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:40, letterSpacing:"-.02em", color:TXT }}>よくある質問</h2>
          {faqs.map((faq,i)=>(
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
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.7)", textTransform:"uppercase", marginBottom:12 }}>Get started</div>
              <h2 style={{ fontSize:"clamp(24px,3.4vw,36px)", fontWeight:700, color:"#fff", marginBottom:16, lineHeight:1.3, letterSpacing:"-.02em" }}>マーケティングに関する<br />ご相談はこちら</h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,.75)", marginBottom:32, lineHeight:1.8 }}>診断のみのご利用でも構いません。3営業日以内にご入力のメールアドレス宛にご返信します。</p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button style={{ background:"#fff", color:G, border:"none", padding:"16px 32px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }} onClick={()=>openModal("consult","最終CTA：マーケティング相談")}>マーケティング相談をする</button>
                <Link href="/subscription/diagnosis" style={{ background:"rgba(255,255,255,.12)", color:"#fff", border:"2px solid rgba(255,255,255,.6)", padding:"16px 28px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none" }}>30秒でプラン診断</Link>
              </div>
            </div>
            {/* 右：確認事項 */}
            <div style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.2)", borderRadius:16, padding:"26px 28px" }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:16 }}>お問い合わせ前にご確認いただけます</p>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 18px", display:"flex", flexDirection:"column", gap:12 }}>
                <li style={{ fontSize:13.5, color:"rgba(255,255,255,.82)", lineHeight:1.7 }}>・利用規約／秘密保持方針</li>
                <li style={{ fontSize:13.5, color:"rgba(255,255,255,.82)", lineHeight:1.7 }}>・作業内容と月額の内訳を記載したサービス説明資料（PDF）</li>
                <li style={{ fontSize:13.5, color:"rgba(255,255,255,.82)", lineHeight:1.7 }}>・過去事例のインサイト実データ（許諾済み・3件）</li>
              </ul>
              <Link href="/subscription/diagnosis" style={{ fontSize:14, fontWeight:700, color:"#fff", textDecoration:"underline" }}>資料をダウンロードする →</Link>
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
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8, color:TXT }}>送信完了しました</h3>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8 }}>3日以内に確認後、ご入力いただいたメールアドレス宛にご連絡します。</p>
                <button style={{ ...btnPrimary, marginTop:24 }} onClick={closeModal}>閉じる</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:TXT }}>{formSource === "plan_apply" ? "仮申し込み" : "無料相談"}</h3>
                <p style={{ fontSize:13, color:TL, marginBottom:28 }}>3日以内に確認後、ご入力いただいたメールアドレス宛にご連絡します</p>
                <form ref={formRef} onSubmit={submitForm}>
                  <input type="text" name="website" style={{ display:"none" }} tabIndex={-1} autoComplete="off" />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                    <div>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>姓<span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span></label>
                      <input name="last_name" type="text" placeholder="山田" required autoComplete="family-name" style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>名<span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span></label>
                      <input name="first_name" type="text" placeholder="太郎" required autoComplete="given-name" style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                  </div>
                  {[
                    { label:"メールアドレス", name:"email", type:"email", placeholder:"example@email.com", required:true },
                    { label:"Instagram ID（@）", name:"instagram_id", type:"text", placeholder:"@your_account", required:false },
                  ].map((f)=>(
                    <div key={f.name} style={{ marginBottom:16 }}>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{f.label}{f.required && <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span>}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} onInput={f.name === "instagram_id" ? (e)=>{ e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9._]/g, ""); } : undefined} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{formSource === "plan_apply" ? "ご希望のプラン" : "関心のあるプラン"}</label>
                    <select name="inquiry_type" value={formPlan} onChange={(e)=>setFormPlan(e.target.value)} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, background:"#fff", outline:"none" }}>
                      <option value="">選択してください</option>
                      {plans.map(p=><option key={p.name} value={p.name}>{p.name}（¥{p.price}/月）</option>)}
                      <option value="まだ決めていない">まだ決めていない（相談したい）</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>ご質問事項{formSource === "consult"
                      ? <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span>
                      : <span style={{ fontSize:10, color:TL, background:OW, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>任意</span>}</label>
                    <textarea name="message" placeholder="プラン・料金に関して等のご質問事項" required={formSource === "consult"} rows={3} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none", resize:"vertical" }} />
                  </div>
                  <button type="submit" disabled={sending} style={{ ...btnPrimary, width:"100%", padding:16, fontSize:15, marginTop:8, opacity:sending?.6:1 }}>
                    {sending ? "送信中..." : "送信する →"}
                  </button>
                  <p style={{ fontSize:11, color:TL, textAlign:"center", marginTop:12, lineHeight:1.7 }}>受付時間：平日 09:00–18:00（時間外は翌営業日対応）</p>
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
          aria-label="お気軽にご相談ください"
          style={{ position:"fixed", right:16, bottom:16, zIndex:150, display:"flex", alignItems:"center", gap:8, background:G, color:"#fff", border:"none", borderRadius:100, padding:"10px 18px 10px 12px", boxShadow:"0 8px 24px rgba(45,122,79,.38)", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700 }}
        >
          <span style={{ width:30, height:30, borderRadius:"50%", background:"#fff", color:G, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>💬</span>
          <span>お気軽にご相談</span>
        </button>
      )}
      {chatOpen && <ContactForm variant="modal" onClose={()=>setChatOpen(false)} />}

      {/* ── JEMIA Footer ── */}
      <footer className={styles.siteFooter}>
        <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"left" }}>
          <div className={styles.grid2} style={{ gap:40, alignItems:"start" }}>
            {/* ブランド */}
            <div>
              <div style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:22, color:"#fff", marginBottom:12 }}>JEM<span style={{ color:C }}>I</span>A</div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.9, marginBottom:12 }}>Instagram運用を、もっと自由に。もっとスマートに。<br />株式会社ホットセラー／東京都中央区晴海1-8-16</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.9 }}>受付時間：平日 09:00 - 18:00（土日祝を除く）</p>
            </div>
            {/* リンク3カラム */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
              {[
                { head:"サービス", links:[["実データ","#results"],["料金","#plans"],["導入の流れ","#flow"],["法人のお客様","/subscription/corporate"]] },
                { head:"情報", links:[["運営会社","#company"],["お役立ち記事","/subscription/blog"],["メディア掲載","/subscription/media"]] },
                { head:"規約", links:[["利用規約","/subscription/terms"],["プライバシーポリシー","/subscription/privacy"],["秘密保持方針","/subscription/confidentiality"]] },
              ].map((col)=>(
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
            <p style={{ fontSize:11.5, color:"rgba(255,255,255,0.45)", lineHeight:1.9, marginBottom:10 }}>表示している実績・数値は自社調査に基づく実測値であり、同等の成果を保証するものではありません。Instagramの仕様・規約変更により提供内容が変わる場合があります。Instagram は Meta Platforms, Inc. の商標です。</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>© 2026 株式会社ホットセラー. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
