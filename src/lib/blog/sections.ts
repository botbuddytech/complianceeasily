export type BlogSectionDraft = {
  heading: string;
  anchor: string;
  level: 2 | 3;
  position: number;
};

export function slugifyHeading(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'section';
}

/** Headings in document order, with anchors that stay unique inside one post. */
export function extractBlogSections(markdown: string): BlogSectionDraft[] {
  const used = new Map<string, number>();
  const sections: BlogSectionDraft[] = [];

  for (const raw of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    const h3 = line.match(/^###\s+(.+)$/);
    const h2 = h3 ? null : line.match(/^##\s+(.+)$/);
    const match = h3 ? { level: 3 as const, text: h3[1] } : h2 ? { level: 2 as const, text: h2[1] } : null;
    if (!match) continue;

    const heading = match.text.replace(/\*\*/g, '').trim();
    let anchor = slugifyHeading(heading);
    const seen = (used.get(anchor) ?? 0) + 1;
    used.set(anchor, seen);
    if (seen > 1) anchor = `${anchor}-${seen}`;

    sections.push({
      heading,
      anchor,
      level: match.level,
      position: sections.length + 1,
    });
  }

  return sections;
}
