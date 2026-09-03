import { Fragment } from "react";

/** Lightweight markdown-lite renderer for blog content (safe, no raw HTML). */

function renderInline(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  // code `x`
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(
        <code key={`${keyPrefix}-${i}`} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-fuchsia-600 dark:bg-white/10 dark:text-fuchsia-300">
          {m[1].slice(1, -1)}
        </code>,
      );
    } else if (m[2]) {
      parts.push(<strong key={`${keyPrefix}-${i}`}>{m[2].slice(2, -2)}</strong>);
    } else if (m[3]) {
      parts.push(<em key={`${keyPrefix}-${i}`}>{m[3].slice(1, -1)}</em>);
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function RichText({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let blockquote: string[] = [];
  let para: string[] = [];
  let idx = 0;

  const flushPara = () => {
    if (para.length) {
      blocks.push(
        <p key={`p-${idx++}`} className="leading-8 text-slate-600 dark:text-slate-300">
          {para.map((l, li) => (
            <Fragment key={li}>
              {renderInline(l, `p-${idx}-${li}`)}
              {li < para.length - 1 && <br />}
            </Fragment>
          ))}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list && list.items.length) {
      const Tag = list.ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={`l-${idx++}`} className={`my-4 space-y-2 pr-6 ${list.ordered ? "list-decimal" : "list-disc"} text-slate-600 dark:text-slate-300`}>
          {list.items.map((item, li) => (
            <li key={li} className="leading-8">{renderInline(item, `l-${idx}-${li}`)}</li>
          ))}
        </Tag>,
      );
      list = null;
    }
  };
  const flushQuote = () => {
    if (blockquote.length) {
      blocks.push(
        <blockquote key={`q-${idx++}`} className="my-4 rounded-r-2xl border-r-4 border-indigo-500 bg-indigo-500/5 px-5 py-3 text-slate-600 dark:text-slate-300">
          {blockquote.map((l, li) => (
            <p key={li} className="leading-8">{renderInline(l, `q-${idx}-${li}`)}</p>
          ))}
        </blockquote>,
      );
      blockquote = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushPara();
      flushList();
      flushQuote();
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushPara(); flushList(); flushQuote();
      blocks.push(<h3 key={`h3-${idx++}`} className="mt-8 text-xl font-bold">{renderInline(trimmed.slice(4), `h3-${idx}`)}</h3>);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushPara(); flushList(); flushQuote();
      blocks.push(<h2 key={`h2-${idx++}`} className="mt-10 text-2xl font-extrabold">{renderInline(trimmed.slice(3), `h2-${idx}`)}</h2>);
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushPara(); flushList();
      blockquote.push(trimmed.slice(2));
      continue;
    }
    if (/^[-*] /.test(trimmed)) {
      flushPara(); flushQuote();
      if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] }; }
      list.items.push(trimmed.slice(2));
      continue;
    }
    if (/^\d+\. /.test(trimmed)) {
      flushPara(); flushQuote();
      if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] }; }
      list.items.push(trimmed.replace(/^\d+\. /, ""));
      continue;
    }
    flushList(); flushQuote();
    para.push(line);
  }
  flushPara();
  flushList();
  flushQuote();

  return <div className="space-y-4">{blocks}</div>;
}
