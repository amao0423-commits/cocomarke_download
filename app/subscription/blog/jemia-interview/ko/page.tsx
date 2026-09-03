import type { Metadata } from "next";
import Image from "next/image";
import { JemiaHeader, JemiaFooter } from "../../../_components/JemiaChrome";
import ArticleDiagnosisBanners from "../../../_components/ArticleDiagnosisBanners";

// ────────────────────────────────────────────────────────────────
// 運営者インタビュー記事の韓国語版。/subscription/blog/jemia-interview/ko
// 日本語版（../page.tsx）の翻訳。海外（韓国語圏）ユーザー向け。
// ────────────────────────────────────────────────────────────────

const PUBLISHED = "2026-07-07";
const MODIFIED = "2026-07-07";
const URL = "https://www.cocomake-guide.com/subscription/blog/jemia-interview/ko";
const JA_URL = "https://www.cocomake-guide.com/subscription/blog/jemia-interview";
const SUBSCRIPTION_URL = "/subscription";
const BLOG_URL = "/subscription/blog";
const MEDIA_URL = "/subscription/media";
const DIAGNOSIS_URL =
  "https://www.cocomake-guide.com/shindan.html?utm_source=blog&utm_medium=referral&utm_campaign=interview";

const AUTHOR = { name: "JEMIA 편집부", org: "JEMIA 운영국" };

export const metadata: Metadata = {
  title:
    "'열심히 해도 늘지 않는다'는 고민을 끝내고 싶다——인스타그램 운영대행 JEMIA 운영 책임자 인터뷰",
  description:
    "왜 인스타그램은 열심히 게시해도 성장하지 않을까? 추천・탐색 탭 중심의 운영을 고집하는 인스타그램 운영대행 구독 서비스 'JEMIA'의 운영 책임자에게 서비스에 담은 생각과, 성과를 내는 계정의 공통점, 어떤 분에게 맞는지를 물었습니다.",
  keywords: [
    "인스타그램 운영대행",
    "Instagram 운영대행",
    "추천・탐색 탭",
    "인스타그램 마케팅",
    "SNS 마케팅",
    "운영대행 구독",
  ],
  alternates: { canonical: URL, languages: { "ja-JP": JA_URL, "ko-KR": URL } },
  openGraph: {
    title:
      "'열심히 해도 늘지 않는다'는 고민을 끝내고 싶다——인스타그램 운영대행 JEMIA 운영 책임자 인터뷰",
    description:
      "추천・탐색 탭 중심의 운영을 고집하는 인스타그램 운영대행 구독 서비스 'JEMIA'. 운영 책임자가 서비스에 대한 생각과 성과를 내는 계정의 공통점을 이야기합니다.",
    url: URL,
    type: "article",
    publishedTime: PUBLISHED,
    images: ["https://www.cocomake-guide.com/images/interview/interview-1.png"],
  },
};

const toc = [
  { id: "start", label: "'열심히 하는데 보상받지 못하는' 상황을 없애고 싶었다" },
  { id: "discover", label: "왜 추천・탐색 탭을 고집하는가" },
  { id: "cases", label: "이용자에게 일어난 변화" },
  { id: "who", label: "JEMIA가 맞는 사람" },
  { id: "future", label: "앞으로 지향하는 것" },
  { id: "cta", label: "먼저, 계정의 현재 상태를 아는 것부터" },
];

// 構造化データ（Article）
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "'열심히 해도 늘지 않는다'는 고민을 끝내고 싶다——인스타그램 운영대행 JEMIA 운영 책임자 인터뷰",
  description:
    "추천・탐색 탭 중심의 운영을 고집하는 인스타그램 운영대행 구독 서비스 'JEMIA'의 운영 책임자 인터뷰.",
  image: ["https://www.cocomake-guide.com/images/interview/interview-1.png"],
  datePublished: PUBLISHED,
  dateModified: MODIFIED,
  author: { "@type": "Person", name: AUTHOR.name, affiliation: { "@type": "Organization", name: "JEMIA（株式会社ホットセラー）" } },
  publisher: {
    "@type": "Organization",
    name: "株式会社ホットセラー",
    url: "https://www.cocomake-guide.com",
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

// Q&Aブロック
function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="flex gap-3 text-base font-bold text-slate-900">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm text-white">Q</span>
        <span className="pt-0.5">{q}</span>
      </p>
      <div className="mt-4 flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D7A4F] text-sm font-bold text-white">A</span>
        <div className="space-y-4 pt-0.5 leading-loose text-slate-700">{children}</div>
      </div>
    </div>
  );
}

// 記事内の画像
function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={1448}
        height={1086}
        sizes="(max-width: 768px) 100vw, 768px"
        className="h-auto w-full rounded-2xl border border-slate-100"
      />
      <figcaption className="mt-2 text-center text-xs text-slate-400">{caption}</figcaption>
    </figure>
  );
}

export default function JemiaInterviewKoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <JemiaHeader />

      <div className="bg-white text-slate-800 [text-wrap:pretty]">
        {/* Hero */}
        <header className="bg-gradient-to-b from-[#E8F5ED] to-white">
          <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
            <nav aria-label="브레드크럼" className="mb-6 text-xs text-slate-400">
              <a href={SUBSCRIPTION_URL} className="hover:text-slate-600">홈</a>
              <span className="mx-1.5">/</span>
              <a href={BLOG_URL} className="hover:text-slate-600">유용한 정보</a>
              <span className="mx-1.5">/</span>
              <span className="text-slate-500">운영자 인터뷰</span>
            </nav>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-block rounded-full bg-[#E8F5ED] px-3 py-1 text-xs font-medium tracking-wide text-[#2D7A4F]">
                운영자 인터뷰
              </span>
              <a href="/subscription/blog/jemia-interview" className="text-xs font-medium text-slate-400 underline underline-offset-4 hover:text-slate-600">
                日本語で見る →
              </a>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
              '열심히 해도 늘지 않는다'는 고민을 끝내고 싶다
            </h1>
            <p className="mt-3 text-lg font-medium text-[#1A5C37]">
              인스타그램 운영대행 구독 서비스 'JEMIA' 운영 책임자 인터뷰
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
              <time dateTime={PUBLISHED}>2026년 7월 7일</time>
              <span aria-hidden>・</span>
              <span>글쓴이: {AUTHOR.name}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          {/* リード */}
          <p className="leading-loose text-slate-700">
            '매일 게시하는데도 성장하지 않는다', '팔로워는 늘어도 집객으로 이어지지 않는다'——인스타그램 운영의 이런 고민에, 추천・탐색 탭 중심의 운영으로 답하는 구독형 운영대행 서비스가 'JEMIA'입니다. 이번에는 서비스를 시작하게 된 배경과 고집하는 부분, 어떤 분에게 맞는지를 JEMIA의 운영 책임자에게 물었습니다.
          </p>

          {/* 目次 */}
          <nav aria-label="목차" className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-900">목차</p>
            <ol className="mt-3 space-y-2 text-sm">
              {toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 本文 */}
          <article className="mt-12">
            {/* 1 */}
            <section id="start" className="scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                '열심히 하는데 보상받지 못하는' 상황을 없애고 싶었다
              </h2>

              <QA q="먼저 JEMIA를 시작하게 된 이유부터 말씀해 주세요.">
                <p>
                  인스타그램 운영 현장에 오래 관여하면서 가장 많이 봐온 것이 '열심히 하는데도 보상받지 못하는' 가게나 개인분들이었습니다. 매일 빠짐없이 게시하는데도 반응은 늘 오시던 단골분의 좋아요뿐. 팔로워는 조금씩 늘어나지만 방문이나 문의로는 이어지지 않는다. 아주 좋은 상품이나 서비스를 가지고 있는데도 그것이 전해지지 않고 있는 겁니다.
                </p>
                <p>
                  너무 아깝다고 강하게 느꼈습니다. 성장하지 않는 원인의 대부분은 상품력이 아니라 '보여주는 방식'과 '전달하는 방식'에 있습니다. 그 부분만 정리하면 결과는 달라집니다. 하지만 그 구조를 혼자서 계속 돌리는 것은 정말 힘든 일입니다. 그렇다면 저희가 전문가로서 맡아보자, 라는 것이 JEMIA의 출발점이었습니다.
                </p>
              </QA>

              <Figure
                src="/images/interview/interview-1.png"
                alt="인스타그램 운영대행 JEMIA 운영 책임자 인터뷰 모습"
                caption="'좋은 것이 제대로 발견되는 상태를 만들고 싶다'고 말하는 모습"
              />

              <QA q="서비스명 'JEMIA'에는 어떤 의미가 있나요?">
                <p>
                  세세한 유래는 여러 가지가 있지만, 근본에 있는 것은 '묻혀 있는 좋은 것이 제대로 발견되는 세상을 만들고 싶다'는 마음입니다. 운영대행이라고 하면 '게시물을 대신 만들어주는' 이미지가 강하지만, 저희가 진짜로 전하고 싶은 것은 게시물을 만드는 것이 아니라 '보여지는 상태를 만드는' 것입니다.
                </p>
              </QA>
            </section>

            {/* 2 */}
            <section id="discover" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                왜 추천・탐색 탭을 고집하는가
              </h2>

              <QA q="JEMIA는 '추천・탐색 탭'을 중시한다고 들었습니다. 이유가 무엇인가요?">
                <p>
                  지금의 인스타그램은 사용자가 직접 가게를 찾기 전에, 추천으로 흘러들어오는 게시물을 통해 가게를 알게 되는 시대가 되었습니다. 이 '추천'의 입구가 바로 추천・탐색 탭입니다. 여기에 노출된다는 것은 아직 당신을 모르는 새로운 사람에게 게시물이 도달한다는 뜻입니다. 팔로워만을 향해 게시하는 한, 도달 범위는 팔로워 수에서 한계에 부딪히고 맙니다.
                </p>
                <p>
                  그렇기 때문에 저희는 '팔로워를 늘리는 것' 자체보다도 '반응을 이끄는 게시물을 만들어 추천・탐색 탭에 노출시켜 신규 사용자에게 전달하는 것'을 중시하고 있습니다. 순서가 반대가 되면 아무리 게시해도 집객으로 이어지지 않습니다.
                </p>
              </QA>

              <QA q="구체적으로는 어떤 운영을 하고 있나요?">
                <p>
                  크게 세 가지가 있습니다. 게시 직후 초기 반응을 만들기 위한 집중 부스트, 타겟 사용자와 효율적으로 소통을 이어가기 위한 액션 활동(좋아요・스토리 열람 등 다양한 기능), 그리고 반응이 늘어나기 쉬운 시간대를 분석한 게시 타이밍 설계입니다. 이것들을 조합해 '추천・탐색 탭에 노출 → 신규 사용자에게 도달 → 반응 증가'라는 흐름을 만들어 갑니다.
                </p>
                <p>
                  자체적으로 축적한 데이터를 바탕으로 알고리즘을 분석하고 있기 때문에, 감이 아니라 데이터에 근거해 시책을 선택할 수 있는 것이 강점입니다. 목적에 맞춰 추천・탐색 탭 노출을 최대화하는 플랜이나, 원하는 키워드로 검색 상위를 노리는 플랜 등을 선택할 수 있도록 하고 있습니다.
                </p>
                <p className="rounded-xl bg-[#E8F5ED] px-5 py-4 text-sm not-italic text-[#1A5C37]">
                  JEMIA의 서비스 내용・요금 플랜은{" "}
                  <a href={SUBSCRIPTION_URL} className="font-bold underline underline-offset-4">이 페이지</a>
                  에서 자세히 확인하실 수 있습니다.
                </p>
              </QA>
            </section>

            {/* 3 */}
            <section id="cases" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                이용자에게 일어난 변화
              </h2>

              <QA q="실제로 이용자에게는 어떤 변화가 있었나요?">
                <p>
                  흔히 있는 것은 '팔로워에게만 도달하던 게시물이, 추천・탐색 탭을 통해 단숨에 새로운 사람들에게 도달하게 되었다'는 사례입니다. 도입 전에는 좋아요가 십여 건, 저장은 0건이었던 게시물이 추천・탐색 탭에 노출되면서 수천~수만 명의 눈에 띄고, 프로필 방문이나 팔로우로 이어져 갑니다.
                </p>
                <p>
                  한 매장에서는 '지역×업종' 검색에서 자신의 게시물이 상위에 표시되게 되어, DM으로 예약 문의가 들어오게 되었습니다. 수치가 움직이면 운영이 즐거워지고, 게시물을 대하는 태도까지 달라지게 됩니다. 그런 변화를 보는 것이 가장 기쁜 순간이죠.
                </p>
              </QA>

              <Figure
                src="/images/interview/interview-2.png"
                alt="성과를 내는 계정의 공통점에 대해 이야기하는 JEMIA 운영 책임자"
                caption="'목적을 정하고, 결과를 보고, 다음 수를 생각한다. 그 사고방식을 저희가 담당합니다'"
              />

              <QA q="잘되는 계정에는 공통점이 있나요?">
                <p>
                  '목적을 정하고, 결과를 보고, 다음 수를 생각한다'는 사이클을 돌릴 수 있는 계정은 강합니다. '유행이니까 해본다'가 아니라 '이 타겟층에게 전달하고 싶으니까 이 시책을 시도한다'는 사고방식이죠. JEMIA에서는 그 사고 부분을 저희가 담당하기 때문에, 사장님은 본업에 집중한 채로 성과로 이어지는 운영을 계속하실 수 있습니다.
                </p>
              </QA>
            </section>

            {/* 4 */}
            <section id="who" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                JEMIA가 맞는 사람
              </h2>

              <QA q="어떤 분에게 JEMIA가 맞을까요?">
                <p>
                  가장 많은 것은 '인스타그램이 집객에 중요하다는 건 알지만 계속할 시간이 없다'는 매장 사장님이나 개인사업자분들입니다. 게시물 기획, 사진 준비, 해시태그 선정, 분석과 개선——하나하나는 소소해 보여도 매일 본업과 병행해서 계속하는 것은 정말 힘든 일입니다. 이 부분을 통째로 맡기고 싶으신 분에게는 아주 잘 맞는다고 생각합니다.
                </p>
                <p>
                  그리고 '직접 해봤지만 성장이 정체되어 있다'는 분. 이미 열심히 해오신 분일수록 보여주는 방식과 전달하는 방식만 정리해도 결과가 쉽게 달라집니다. 반대로 운영을 완전히 직접 컨트롤하고 싶으신 분에게는 저희 방식이 맞지 않을 수도 있습니다. 그 점은 솔직하게 말씀드리고 있습니다.
                </p>
              </QA>

              <QA q="시작하기 편한지는 어떤가요?">
                <p>
                  초기 비용은 0엔, 월 정액이며 계약 구속도 없습니다. 성과가 맞지 않다고 느끼시면 언제든 해지하실 수 있습니다. '일단 시도해 보고 맞지 않으면 그만둘 수 있는' 상태로 만든 것은 편하게 첫걸음을 내디디셨으면 하는 마음 때문입니다. 운영대행은 진입장벽이 높다고 여겨지기 쉽지만, 그 이미지를 바꾸고 싶습니다.
                </p>
              </QA>
            </section>

            {/* 5 */}
            <section id="future" className="mt-14 scroll-mt-20">
              <h2 className="border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">
                앞으로 지향하는 것
              </h2>

              <QA q="마지막으로 앞으로 지향하고 싶은 것을 말씀해 주세요.">
                <p>
                  대기업이나 도심의 인기 매장은 그동안 지식과 자원을 무기로 SNS 집객을 유리하게 진행해 왔습니다. 하지만 본래 가게나 서비스는 '상품력'으로 평가받아야 합니다. 좋은 상품을 가지고 있는데도 묻혀버리는 것은 너무나 아깝습니다. 이 '마케팅 격차'를 저희 서비스로 조금이라도 메워가고 싶습니다.
                </p>
                <p>
                  지방의 숨은 맛집이나 신념을 가진 개인 매장이 정당하게 평가받아 집객으로 이어지는. 그런 미래를 만드는 것이 JEMIA의 목표입니다. 인스타그램을 열심히 하는 모든 분들이 그 노력을 제대로 결과로 바꿀 수 있도록, 앞으로도 함께하고 싶습니다.
                </p>
              </QA>
            </section>

            {/* CTA */}
            <section id="cta" className="mt-16 scroll-mt-20 rounded-3xl bg-[#123524] px-7 py-12 text-center text-white">
              <h2 className="text-xl font-bold text-white sm:text-2xl">먼저, 계정의 현재 상태를 아는 것부터</h2>
              <p className="mx-auto mt-4 max-w-md leading-loose text-[#E8F5ED]">
                60초 만에 가능한 무료 계정 진단으로, 내 계정의 성장 가능성과 지금 힘써야 할 포인트를 알 수 있습니다.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={DIAGNOSIS_URL} target="_blank" rel="noopener" className="rounded-xl bg-[#2D7A4F] px-7 py-3 font-bold text-white transition hover:bg-[#4CAF75]">
                  60초 만에 무료 진단하기 →
                </a>
                <a href={SUBSCRIPTION_URL} className="rounded-xl bg-white px-7 py-3 font-bold text-[#1A5C37] transition hover:bg-[#E8F5ED]">
                  JEMIA 서비스 보기
                </a>
              </div>
            </section>
          </article>

          {/* 執筆者プロフィール */}
          <aside className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
            <p className="text-xs font-medium text-[#2D7A4F]">글쓴이</p>
            <p className="mt-1 text-base font-bold text-slate-900">{AUTHOR.name}</p>
            <p className="mt-3 text-sm leading-loose text-slate-600">
              JEMIA 운영국의 편집・콘텐츠 담당 팀. 인스타그램을 중심으로 한 SNS 운영 지원 현장에 몸담으며, 매장・개인사업자의 계정 개선과 추천・탐색 탭 공략 기획・분석을 담당. '좋은 것이 올바르게 발견되는' 운영의 사고방식을 최대한 알기 쉽게 전달하는 것을 소중히 여기고 있습니다.
            </p>
          </aside>

          <ArticleDiagnosisBanners campaign="interview" />

          {/* 関連リンク（内部リンクでSEO回遊） */}
          <aside className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-bold text-slate-900">관련 페이지</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={SUBSCRIPTION_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  구독형 인스타그램 운영대행 'JEMIA'의 요금 플랜 보기
                </a>
              </li>
              <li>
                <a href={BLOG_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  인스타그램 운영 팁 기사 목록
                </a>
              </li>
              <li>
                <a href={MEDIA_URL} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
                  미디어 소개 실적
                </a>
              </li>
            </ul>
          </aside>
        </main>
      </div>

      <JemiaFooter />
    </>
  );
}
