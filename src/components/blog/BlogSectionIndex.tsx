export type BlogIndexItem = {
  heading: string;
  anchor: string;
  level: number;
};

export function BlogSectionIndex({ sections }: { sections: BlogIndexItem[] }) {
  if (!sections.length) return null;

  return (
    <nav aria-label="Guide index" className="rounded-xl border border-[#E6E1D6] bg-[#F7F4EE] p-4 sm:p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A7344]">Index</p>
      <ol className="mt-3 space-y-1.5">
        {sections.map((section) => (
          <li key={section.anchor} className={section.level > 2 ? 'pl-3' : undefined}>
            <a
              href={`#${section.anchor}`}
              className="text-sm leading-snug text-[#3A424C] hover:text-[#8A7344] hover:underline"
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
