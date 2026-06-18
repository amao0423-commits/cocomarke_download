"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./subscription.module.css";

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
    name: "いいね代行プラン",
    price: "9,800",
    desc: "ターゲット層への自動いいねで認知を拡大。フォロワーへの返しいいねも対応。アカウント保護設定付き。",
    features: ["1日最大200いいね","ターゲットキーワード設定（最大50個）","競合アカウントフォロワーへのアプローチ","LINE相談サポート","月次レポート"],
  },
  {
    name: "発見表示ブーストプラン",
    price: "19,800",
    desc: "投稿の初速エンゲージメントを高め、発見タブへの掲載確率を劇的に向上。新規リーチを最大化。",
    features: ["投稿直後の集中ブースト","ハッシュタグ最適化提案","投稿タイミング分析・提案","発見タブ掲載レポート","LINE相談サポート（優先）"],
  },
  {
    name: "セットプラン",
    price: "24,800",
    popular: true,
    desc: "最もコスパが良い組み合わせ。いいね代行と発見ブーストを同時運用し、相乗効果で成果を最大化。",
    features: ["いいね代行プランの全機能","発見表示ブーストの全機能","単独契約より5,000円お得","戦略MTG 月1回（30分）","詳細分析レポート"],
  },
  {
    name: "リスト上位表示プラン",
    price: "29,800",
    desc: "狙ったキーワード検索でアカウントが上位表示されるよう最適化。地域×業種キーワードの独占を目指す。",
    features: ["キーワード分析・選定（最大20個）","プロフィール最適化サポート","キャプション戦略アドバイス","検索順位モニタリング","月次ランキングレポート"],
  },
  {
    name: "プレミアムプラン",
    price: "49,800",
    desc: "全プランの機能に加え、専任コンサルタントが戦略立案から実行まで伴走。最短で最大の成果を狙う。",
    features: ["全プランの全機能","専任コンサルタント担当","投稿代行（月8本まで）","競合分析レポート"],
  },
];

const faqs = [
  { q:"いつでも解約できますか？", a:"はい、月単位での契約ですので翌月分から解約が可能です。違約金や解約手数料は一切かかりません。" },
  { q:"効果が出るまでどれくらいかかりますか？", a:"多くのお客様で1〜2ヶ月以内に数値の改善が見られます。特に発見タブへの掲載は早いケースで2〜3週間で効果が出始めます。" },
  { q:"アカウントが凍結されるリスクはありませんか？", a:"Instagramのガイドラインに準拠した安全な手法のみを使用しています。過去3000件以上の導入で凍結事例はゼロです。" },
  { q:"支払い方法は何に対応していますか？", a:"クレジットカード（VISA・Mastercard・JCB）および銀行振込に対応しています。" },
  { q:"個人アカウントでも利用できますか？", a:"はい、個人・法人を問わずご利用いただけます。ビジネスアカウントへの切り替えを推奨しています（無料でサポートします）。" },
  { q:"上位表示を保証してくれますか？", a:"成果保証は一切しておりません。これはGoogleによるアルゴリズム（検索順位決定の仕様）で順位が決定されていく為、保証は不可能である為です。また、上位表示を達成したとしても、アルゴリズム変動によって順位変動する可能性は常に存在します。そのため、常にSEO状況の現状把握と変動時の対応を続けていく必要があることをご理解ください。" },
];

const voices = [
  { stars:5, text:"「新宿 居酒屋」での検索で表示される機会が増え、インスタ経由でのご予約が入るようになりました。以前は認知してもらう手段がなかったので助かっています。", name:"都内・飲食店店長様", biz:"導入3ヶ月", color:"#E8734A" },
  { stars:5, text:"投稿後のブーストを使い始めてから、リールの再生数が安定して伸びるようになってきました。まだ成長途中ですが手ごたえを感じています。", name:"フリーランス・クリエイター様", biz:"導入4ヶ月", color:"#5B73DE" },
  { stars:4, text:"フォロワー以外の方からの保存やコメントが増えてきた実感があります。発見タブからの流入が増えているのをインサイトで確認できています。", name:"個人ブランディング中のお客様", biz:"導入2ヶ月", color:"#7B5EA7" },
  { stars:5, text:"いいね代行でターゲット層との接点が増え、プロフィールへの訪問数が上がりました。サイトへの流入も少し改善されています。", name:"ECサイト運営担当者様", biz:"リピーター継続中", color:"#3D9BD4" },
  { stars:5, text:"地域キーワードでの表示機会が増え、初めてのお客様からの問い合わせが来るようになりました。", name:"ネイルサロン経営者様", biz:"導入3ヶ月", color:"#C45BAA" },
  { stars:4, text:"投稿への保存数が以前より増えています。劇的な変化というわけではないですが、数値が改善されているのは実感できます。", name:"美容サロン経営者様", biz:"導入3ヶ月", color:"#4CAF75" },
];

export default function SubscriptionClient() {
  const [tab, setTab]           = useState(0);
  const [modal, setModal]       = useState(false);
  const [thanks, setThanks]     = useState(false);
  const [sending, setSending]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number|null>(null);
  const [voicePage, setVoicePage] = useState(0);
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

  const openModal = () => { setModal(true); setThanks(false); document.body.style.overflow="hidden"; };
  const closeModal = () => { setModal(false); document.body.style.overflow=""; };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name    = (fd.get("name") as string).trim();
    const email   = (fd.get("email") as string).trim();
    const message = (fd.get("message") as string).trim();
    if (!name || !email || !message) { alert("お名前・メールアドレス・ご相談内容は必須です。"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("メールアドレスの形式が正しくありません。"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/subscription-contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name, email, inquiry_type: fd.get("inquiry_type"), instagram_id: fd.get("instagram_id"), message }),
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

  const kw1 = ["新宿ランチ","渋谷カフェ","大宮居酒屋","川越カフェ","中目黒グルメ","札幌グルメ","すすきのカフェ","韓国旅行","箱根温泉","女子旅","沖縄ホテル"];
  const kw2 = ["ハイトーンカラー","レイヤーカット","髪質改善","縮毛矯正","横浜美容室","渋谷美容室","ブライダルエステ","小顔矯正","アートメイク","ルームツアー","韓国インテリア"];
  const kw3 = ["시부야 맛집","신주쿠맛집","아트메이크","ネイルサロン","新宿グルメ","姿勢改善","婚約指輪","韓国式足裏角質ケア","프치쁠라코스메"];

  const btnPrimary: React.CSSProperties = { background:C, color:"#fff", border:"none", padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", boxShadow:`0 4px 20px rgba(255,102,51,.3)` };

  return (
    <>
      {/* ── JEMIA Header ── */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.headerLogo}>JEM<span style={{ color:C }}>I</span>A</a>
          <nav className={styles.headerNav}>
            {([["特徴","#features"],["料金","#plans"],["実績","#voices"],["FAQ","#faq"]] as const).map(([label,href])=>(
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Link href="/subscription/corporate" className={styles.headerCorp}>法人のお客様</Link>
            <button className={styles.headerCta} onClick={openModal}>無料で相談する</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="top" style={{ background:`linear-gradient(160deg,#fff 0%,${GL} 100%)`, padding:"72px 24px 64px", position:"relative", overflow:"hidden", scrollMarginTop:64 }}>
        <div className={styles.heroGrid} style={{ maxWidth:1100, margin:"0 auto", alignItems:"center", paddingBottom:80 }}>
          {/* left */}
          <div className={styles.fadeUp}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:CL, color:C, fontSize:12, fontWeight:700, letterSpacing:".06em", padding:"6px 14px", borderRadius:100, marginBottom:20 }}>
              <span className={styles.pulseDot} style={{ width:6, height:6, background:C, borderRadius:"50%", display:"inline-block" }} />
              インスタ運用サブスク
            </div>
            <h1 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, lineHeight:1.25, letterSpacing:"-.03em", marginBottom:20, color:TXT }}>
              インスタ運用を<span style={{ color:G, borderBottom:`3px solid ${C}` }}>サブスクで</span>。<br />
              月額固定の<span style={{ color:G }}>フォロワー増加</span>サービス
            </h1>
            <p style={{ fontSize:15, color:TM, marginBottom:32, lineHeight:1.8 }}>
              月額固定でインスタ運用をまるごとお任せ。<br />
              いいね代行・発見タブ最適化・LINE相談まで。
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
              <button style={btnPrimary} onClick={openModal}>無料で相談する →</button>
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
              ["340%","発見タブ リーチ増加率","先月比 平均値",true],
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

      {/* ── Features ── */}
      <section id="features" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Features</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>インスタ運用サブスクが選ばれる3つの理由</h2>
          <p style={{ fontSize:15, color:TM, margin:"0 0 16px", lineHeight:1.8 }}>インスタ集客・SNS運用をプロにまるごとお任せ。月額サブスクだから続けやすく、成果につながります。</p>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, margin:"0 0 40px" }} />
          <div className={styles.grid3} style={{ gap:24 }}>
            {[
              { icon:"📅", title:"月額固定・解約自由", desc:"契約縛りなし。月々定額で予算が読める。いつでも解約OK。成果が出なければ継続しなくていい。" },
              { icon:"🎛️", title:"自由な組み合わせ",   desc:"いいね代行・発見タブ・リスト上位・セットプランなど、目的に合わせてプランを選択・変更できる。" },
              { icon:"💬", title:"LINE直接相談",         desc:"専任担当がLINEで対応。投稿アドバイス・分析レポート・戦略相談まで気軽に聞ける。" },
            ].map((f)=>(
              <div key={f.title} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:"32px 28px", position:"relative", overflow:"hidden", transition:"box-shadow .2s,transform .2s" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${G},${GM})` }} />
                <div style={{ width:48, height:48, borderRadius:12, background:GL, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, fontSize:22 }}>{f.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10, color:TXT }}>{f.title}</h3>
                <p style={{ fontSize:14, color:TM, lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BA Section ── */}
      <section style={{ padding:"80px 24px", background:OW }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Results</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>インスタ運用代行の導入で変わるフォロワーと発見タブ流入</h2>
          <p style={{ fontSize:15, color:TM, margin:"0 0 8px", lineHeight:1.8 }}>発見タブ流入を増やし、フォロワーを増やすまでの変化を導入前後で比較します。</p>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, marginBottom:40 }} />
          <div className={styles.grid2} style={{ gap:24, marginBottom:40 }}>
            {[
              { badge:"導入前 — Before", badgeBg:"#f0f0f0", badgeColor:"#888", title:"よくある状況", img:"/jemia/grapefruit-ade.png", caption:"フォロワーにしか届かない投稿イメージ", items:["フォロワーが増えない","投稿しても反応がない","発見タブに載らない","何をすれば良いかわからない","リソースがなく更新が止まる"], dotColor:"#ccc" },
              { badge:"導入後 — After",  badgeBg:GL,       badgeColor:G,     title:"JEMIAを使った結果", img:"/jemia/search-result-top.png", caption:"発見タブに掲載された後の検索結果イメージ", items:["3ヶ月でフォロワー3倍以上","エンゲージメント率 8〜12%","発見タブ流入が劇的に増加","専任担当が戦略をサポート","オーナーはコアに集中できる"], dotColor:G },
            ].map((card)=>(
              <div key={card.title} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:20, padding:32 }}>
                <span style={{ background:card.badgeBg, color:card.badgeColor, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:100, display:"inline-block", marginBottom:16 }}>{card.badge}</span>
                <h4 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:TXT }}>{card.title}</h4>
                <Image src={card.img} alt={card.caption} width={400} height={180} style={{ width:"100%", height:180, objectFit:"contain", borderRadius:10, marginBottom:8, background:GL }} />
                <p style={{ fontSize:11, color:TL, marginBottom:16, textAlign:"center" }}>{card.caption}</p>
                {card.items.map((item)=>(
                  <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:`1px solid ${BD}`, fontSize:14, color:TXT }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:card.dotColor, flexShrink:0, display:"inline-block" }} />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* stats */}
          <div className={styles.grid4} style={{ gap:20 }}>
            {[["3x","平均フォロワー増加率"],["3000+","累計導入アカウント"],["4.9","顧客満足度（5点満点）"],["92%","3ヶ月継続率"]].map(([n,l])=>(
              <div key={l} style={{ background:"#fff", border:`1px solid ${BD}`, borderRadius:12, padding:"24px 20px", textAlign:"center" }}>
                <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:32, fontWeight:900, color:G, lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:12, color:TL, marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Keywords Marquee ── */}
      <section style={{ background:G, padding:"64px 0", overflow:"hidden" }}>
        <div style={{ padding:"0 24px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.6)", textTransform:"uppercase", marginBottom:12 }}>Keywords</div>
          <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:700, color:"#fff", marginBottom:32, letterSpacing:"-.02em" }}>発見タブ・検索上位の独占キーワード実績</h2>
        </div>
        {[kw1, kw2, kw3].map((row, ri)=>{
          const cls = ri===1 ? styles.marqueeTrack2 : ri===2 ? styles.marqueeTrack3 : styles.marqueeTrack;
          const doubled = [...row,...row];
          return (
            <div key={ri} style={{ overflow:"hidden", marginTop:ri>0?12:0 }}>
              <div className={cls} style={{ display:"flex", gap:16, width:"max-content" }}>
                {doubled.map((kw,ki)=>(
                  <span key={ki} style={{ background:ki%3===0?"rgba(255,102,51,1)":"rgba(255,255,255,.15)", color:"#fff", border:"1px solid rgba(255,255,255,.25)", padding:"8px 18px", borderRadius:100, fontSize:13, fontWeight:500, whiteSpace:"nowrap" }}>{kw}</span>
                ))}
              </div>
            </div>
          );
        })}
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
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>インスタ運用サブスクの料金プラン（月額固定・5プラン）</h2>
          <div style={{ width:40, height:3, borderRadius:2, background:`linear-gradient(90deg,${G},${C})`, marginBottom:12 }} />
          <p style={{ fontSize:15, color:TM, marginBottom:36, lineHeight:1.8 }}>目的に合わせて選べる5プラン。すべて月額固定・解約自由。</p>
          {/* tabs */}
          <div className={styles.swipeHint}><span>←</span><span>横にスライドできます</span><span>→</span></div>
          <div style={{ display:"flex", borderBottom:`2px solid ${BD}`, marginBottom:32, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            {plans.map((p,i)=>(
              <div key={p.name} style={{ position:"relative", display:"inline-flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end" }}>
                {p.popular && <span style={{ background:C, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:100, marginBottom:4, whiteSpace:"nowrap" }}>人気 No.1</span>}
                <button onClick={()=>setTab(i)} style={{ padding:"12px 18px", fontSize:13, fontWeight:700, background:"none", border:"none", cursor:"pointer", color:tab===i?G:TL, whiteSpace:"nowrap", borderBottom:tab===i?`3px solid ${G}`:"3px solid transparent", marginBottom:-2, fontFamily:"inherit", transition:"all .2s" }}>{p.name}</button>
              </div>
            ))}
          </div>
          {/* panel */}
          <div className={styles.grid2} style={{ gap:40, alignItems:"start" }}>
            <div>
              {plans[tab].popular && (
                <div style={{ display:"flex", alignItems:"center", gap:8, background:CL, border:`1px solid rgba(255,102,51,.25)`, borderRadius:8, padding:"8px 14px", marginBottom:16 }}>
                  <span style={{ fontSize:16 }}>🏆</span>
                  <span style={{ fontSize:12, fontWeight:700, color:C }}>最も選ばれているプランです</span>
                  <span style={{ fontSize:11, color:TL, marginLeft:"auto" }}>全お申し込みの42%</span>
                </div>
              )}
              <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8, color:TXT }}>{plans[tab].name}</h3>
              <div style={{ margin:"18px 0", display:"flex", alignItems:"baseline", gap:6 }}>
                <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:44, fontWeight:900, color:G }}>{plans[tab].price}</span>
                <span style={{ fontSize:14, color:TL }}>円 / 月（税込）〜</span>
              </div>
              <p style={{ fontSize:14, color:TM, marginBottom:24, lineHeight:1.8 }}>{plans[tab].desc}</p>
              <button style={{ ...btnPrimary, width:"100%", padding:16, fontSize:15, boxShadow:`0 4px 20px rgba(255,102,51,.25)` }} onClick={openModal}>このプランで申し込む →</button>
            </div>
            <ul style={{ listStyle:"none" }}>
              {plans[tab].features.map((f)=>(
                <li key={f} style={{ padding:"10px 0", borderBottom:`1px solid ${BD}`, fontSize:14, display:"flex", alignItems:"flex-start", gap:10, color:TXT }}>
                  <span style={{ width:20, height:20, borderRadius:"50%", background:GL, color:G, fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Flow ── */}
      <section style={{ padding:"80px 24px", background:OW }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>How it works</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, letterSpacing:"-.02em", color:TXT }}>インスタ運用代行サービスの導入の流れ</h2>
            <p style={{ fontSize:15, color:TM, margin:"12px 0 0", lineHeight:1.8 }}>インスタ集客・SNS運用の代行を、ご相談から運用開始までスムーズに進めます。</p>
          </div>
          <div className={styles.stepsGrid} style={{ position:"relative" }}>
            {[["01","無料相談","LINEまたはフォームからご連絡。現状のアカウントをヒアリングし最適なプランをご提案。"],
              ["02","プラン選択・決済","ご希望のプランを選択し、オンラインで決済。"],
              ["03","設定・運用開始","最短翌日から運用スタート。初期設定はすべて担当が対応。お客様の作業は不要。"],
            ].map(([n,h,p])=>(
              <div key={n} style={{ textAlign:"center", padding:"0 12px", position:"relative", zIndex:1 }}>
                <div style={{ fontFamily:"Montserrat,sans-serif", width:64, height:64, borderRadius:"50%", background:"#fff", border:`2px solid ${G}`, color:G, fontSize:20, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>{n}</div>
                <h4 style={{ fontSize:15, fontWeight:700, marginBottom:8, color:TXT }}>{h}</h4>
                <p style={{ fontSize:13, color:TM, lineHeight:1.7 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voices ── */}
      <section id="voices" style={{ padding:"80px 24px", background:"#fff", scrollMarginTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>Reviews</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:16, letterSpacing:"-.02em", color:TXT }}>インスタ運用サブスク利用者の口コミ・評判</h2>
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

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding:"80px 24px", background:OW, scrollMarginTop:64 }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:C, textTransform:"uppercase", marginBottom:12 }}>FAQ</div>
          <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, marginBottom:40, letterSpacing:"-.02em", color:TXT }}>インスタ運用代行サブスクのよくある質問</h2>
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
      <section style={{ background:`linear-gradient(135deg,${G} 0%,#1a5c37 100%)`, textAlign:"center", padding:"80px 24px" }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", color:"rgba(255,255,255,.7)", textTransform:"uppercase", marginBottom:12 }}>Get started</div>
        <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:700, color:"#fff", marginBottom:16, lineHeight:1.3, letterSpacing:"-.02em" }}>まずは無料で相談してみませんか？</h2>
        <p style={{ fontSize:15, color:"rgba(255,255,255,.75)", marginBottom:36, lineHeight:1.8 }}>インスタ運用のお問い合わせ・ご相談はこちらから。<br />プラン選びに迷ったら気軽にフォームからどうぞ。翌営業日以内に返信します。</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button style={{ background:"#fff", color:G, border:"none", padding:"16px 36px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }} onClick={openModal}>無料で相談する →</button>
          <Link href="/subscription/diagnosis" style={{ background:"rgba(255,255,255,.12)", color:"#fff", border:"2px solid rgba(255,255,255,.6)", padding:"16px 30px", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none" }}>まずプラン診断する →</Link>
        </div>
      </section>

      {/* ── Modal ── */}
      {modal && (
        <div onClick={(e)=>{ if(e.target===e.currentTarget) closeModal(); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:480, padding:40, position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
            <button onClick={closeModal} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", fontSize:22, cursor:"pointer", color:TL, lineHeight:1 }}>×</button>
            {thanks ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8, color:TXT }}>送信完了しました</h3>
                <p style={{ fontSize:14, color:TM, lineHeight:1.8 }}>翌営業日以内にご連絡いたします。</p>
                <button style={{ ...btnPrimary, marginTop:24 }} onClick={closeModal}>閉じる</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize:20, fontWeight:700, marginBottom:6, color:TXT }}>無料相談・仮申し込み</h3>
                <p style={{ fontSize:13, color:TL, marginBottom:28 }}>翌営業日以内にご連絡します</p>
                <form ref={formRef} onSubmit={submitForm}>
                  <input type="text" name="website" style={{ display:"none" }} tabIndex={-1} autoComplete="off" />
                  {[
                    { label:"お名前", name:"name", type:"text", placeholder:"例：山田 太郎", required:true },
                    { label:"メールアドレス", name:"email", type:"email", placeholder:"example@email.com", required:true },
                    { label:"Instagram ID（@）", name:"instagram_id", type:"text", placeholder:"@your_account", required:false },
                  ].map((f)=>(
                    <div key={f.name} style={{ marginBottom:16 }}>
                      <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>{f.label}{f.required && <span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span>}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>ご希望のプラン</label>
                    <select name="inquiry_type" style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, background:"#fff", outline:"none" }}>
                      <option value="">選択してください</option>
                      {plans.map(p=><option key={p.name} value={p.name}>{p.name}（¥{p.price}/月）</option>)}
                      <option value="まだ決めていない">まだ決めていない（相談したい）</option>
                    </select>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:13, fontWeight:700, marginBottom:6, color:TXT }}>ご相談内容<span style={{ fontSize:10, color:C, background:CL, padding:"1px 6px", borderRadius:4, marginLeft:6 }}>必須</span></label>
                    <textarea name="message" placeholder="現在の状況・目標など" required rows={3} style={{ width:"100%", padding:"11px 14px", border:`1px solid ${BD}`, borderRadius:8, fontSize:14, fontFamily:"inherit", color:TXT, outline:"none", resize:"vertical" }} />
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

      {/* ── JEMIA Footer ── */}
      <footer className={styles.siteFooter}>
        <div style={{ marginBottom:12 }}>
          <span style={{ fontFamily:"Montserrat,sans-serif", fontWeight:900, fontSize:20, color:"#fff" }}>JEM<span style={{ color:C }}>I</span>A</span>
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:16 }}>
          Instagram運用を、もっと自由に。もっとスマートに。
        </div>
        <div style={{ marginBottom:16 }}>
          {([["特徴","#features"],["料金","#plans"],["実績","#voices"],["FAQ","#faq"]] as const).map(([label,href])=>(
            <a key={href} href={href} style={{ color:"rgba(255,255,255,0.6)", textDecoration:"none", margin:"0 12px", fontSize:13 }}>{label}</a>
          ))}
          <Link href="/subscription/corporate" style={{ color:"rgba(255,255,255,0.6)", textDecoration:"none", margin:"0 12px", fontSize:13 }}>法人のお客様</Link>
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
