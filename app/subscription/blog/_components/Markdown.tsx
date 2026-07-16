import React from "react";

// 依存なしの軽量Markdownレンダラ（見出し/段落/太字/リンク/コード/引用/表/リスト/hr）。
// AI生成のクリーンなMarkdownを想定。ビルド時に静的レンダリングされる。

function inline(text: string, kp: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)）]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) {
      out.push(<strong key={kp + i} className="font-bold text-slate-900">{inline(t.slice(2, -2), kp + i + "s")}</strong>);
    } else if (t.startsWith("`")) {
      out.push(<code key={kp + i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-[#1A5C37]">{t.slice(1, -1)}</code>);
    } else if (t.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(t);
      if (lm) {
        const ext = /^https?:/.test(lm[2]);
        out.push(
          <a key={kp + i} href={lm[2]} className="text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]" {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
            {lm[1]}
          </a>,
        );
      } else out.push(t);
    } else {
      out.push(
        <a key={kp + i} href={t} target="_blank" rel="noopener" className="break-all text-[#2D7A4F] underline underline-offset-4 hover:text-[#1A5C37]">
          {t}
        </a>,
      );
    }
    last = m.index + t.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => "b" + k++;
  const parseRow = (r: string) => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // 水平線
    if (/^---+\s*$/.test(line.trim())) { blocks.push(<hr key={key()} className="my-10 border-slate-200" />); i++; continue; }

    // コードブロック
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(
        <pre key={key()} className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-100">
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // 見出し
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const lv = h[1].length;
      const txt = h[2];
      if (lv <= 2) blocks.push(<h2 key={key()} className="mt-12 mb-3 scroll-mt-20 border-l-4 border-[#2D7A4F] pl-3 text-xl font-bold text-slate-900 sm:text-2xl">{inline(txt, key())}</h2>);
      else if (lv === 3) blocks.push(<h3 key={key()} className="mt-8 mb-2 text-lg font-bold text-slate-900">{inline(txt, key())}</h3>);
      else blocks.push(<h4 key={key()} className="mt-6 mb-2 text-base font-bold text-slate-800">{inline(txt, key())}</h4>);
      i++;
      continue;
    }

    // 引用（連続する > 行）→ 緑のコールアウト
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      const inner = buf.filter((b) => b.trim() !== "").map((b, pi) => (
        <p key={pi} className={pi > 0 ? "mt-1.5" : ""}>{inline(b, key())}</p>
      ));
      blocks.push(
        <blockquote key={key()} className="my-6 rounded-xl border-l-4 border-[#4CAF75] bg-[#E8F5ED] px-5 py-4 text-sm leading-relaxed text-slate-700">
          {inner}
        </blockquote>,
      );
      continue;
    }

    // 表（| で始まる連続行。2行目は区切り）
    if (line.trim().startsWith("|")) {
      const tbl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tbl.push(lines[i]); i++; }
      if (tbl.length >= 2) {
        const header = parseRow(tbl[0]);
        const rows = tbl.slice(2).map(parseRow);
        blocks.push(
          <div key={key()} className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#E8F5ED]">
                  {header.map((c, ci) => (
                    <th key={ci} className="border border-slate-200 px-3 py-2 text-left font-bold text-slate-800">{inline(c, key())}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 ? "bg-slate-50/60" : ""}>
                    {row.map((c, ci) => (
                      <td key={ci} className="border border-slate-200 px-3 py-2 align-top text-slate-700">{inline(c, key())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    // リスト
    const isUl = /^\s*[-*]\s+/.test(line);
    const isOl = /^\s*\d+\.\s+/.test(line);
    if (isUl || isOl) {
      const items: React.ReactNode[] = [];
      const reItem = isUl ? /^\s*[-*]\s+(.*)$/ : /^\s*\d+\.\s+(.*)$/;
      const test = (l: string) => (isUl ? /^\s*[-*]\s+/.test(l) : /^\s*\d+\.\s+/.test(l));
      while (i < lines.length && test(lines[i])) {
        let itxt = reItem.exec(lines[i])![1];
        itxt = itxt.replace(/^\[( |x|X)\]\s*/, (_m, c) => (String(c).trim() ? "☑ " : "☐ "));
        items.push(<li key={items.length} className="pl-1">{inline(itxt, key())}</li>);
        i++;
      }
      blocks.push(
        isOl ? (
          <ol key={key()} className="my-4 list-decimal space-y-2 pl-6 leading-relaxed text-slate-700">{items}</ol>
        ) : (
          <ul key={key()} className="my-4 list-disc space-y-2 pl-6 leading-relaxed text-slate-700">{items}</ul>
        ),
      );
      continue;
    }

    // 段落
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6}\s|>|\s*[-*]\s|\s*\d+\.\s|```)/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("|")
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key()} className="my-4 leading-loose text-slate-700">{inline(buf.join(" "), key())}</p>);
  }

  return <div className="[text-wrap:pretty]">{blocks}</div>;
}
