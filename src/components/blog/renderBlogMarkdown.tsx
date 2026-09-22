import type { ReactNode } from 'react';
import { extractBlogSections } from '@/lib/blog/sections';

/** Minimal Markdown for catalogue blogs: headings, paragraphs, bullets, bold, links. */
export function renderBlogMarkdown(source: string): ReactNode[] {
  const sections = extractBlogSections(source);
  let sectionIdx = 0;
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim();
    para = [];
    if (!text) return;
    blocks.push(
      <p key={key++} className="text-sm sm:text-[15px] leading-relaxed text-[#3A424C]">
        {inline(text)}
      </p>,
    );
  };

  const flushList = () => {
    if (!list.length) return;
    const items = list;
    list = [];
    blocks.push(
      <ul key={key++} className="list-disc space-y-1.5 pl-5 text-sm sm:text-[15px] leading-relaxed text-[#3A424C]">
        {items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushPara();
      flushList();
      const section = sections[sectionIdx++];
      blocks.push(
        <h3
          key={key++}
          id={section?.anchor}
          className="scroll-mt-24 font-display text-lg font-semibold text-[#0E1217] pt-2"
        >
          {inline(line.slice(4))}
        </h3>,
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara();
      flushList();
      const section = sections[sectionIdx++];
      blocks.push(
        <h2
          key={key++}
          id={section?.anchor}
          className="scroll-mt-24 font-display text-xl sm:text-2xl font-semibold text-[#0E1217] pt-4"
        >
          {inline(line.slice(3))}
        </h2>,
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushPara();
      flushList();
      continue;
    }
    if (line.trimStart().startsWith('- ')) {
      flushPara();
      list.push(line.trimStart().slice(2));
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return blocks;
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={i++} className="font-semibold text-[#0E1217]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2];
        const external = href.startsWith('http');
        nodes.push(
          <a
            key={i++}
            href={href}
            className="text-[#8A7344] underline underline-offset-2 hover:text-[#0E1217]"
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {link[1]}
          </a>,
        );
      }
    }
    last = start + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
