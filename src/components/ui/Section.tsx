import { createContext, useContext, ReactNode } from 'react';

export type SectionTone = 'cream' | 'sand' | 'espresso';

const SectionToneContext = createContext<SectionTone>('cream');

export function useSectionTone() {
  return useContext(SectionToneContext);
}

const TONE_STYLES: Record<
  SectionTone,
  { bg: string; border: string; text: string; muted: string }
> = {
  cream: {
    bg: 'bg-[#F4F2EE]',
    border: 'border-[#D5D0C6]',
    text: 'text-[#0E1217]',
    muted: 'text-[#5C6570]',
  },
  sand: {
    bg: 'bg-[#EBE8E2]',
    border: 'border-[#D5D0C6]',
    text: 'text-[#0E1217]',
    muted: 'text-[#5C6570]',
  },
  espresso: {
    bg: 'bg-[#12161B]',
    border: 'border-[#1E2630]',
    text: 'text-[#FFFFFF]',
    muted: 'text-[#A8B0BA]',
  },
};

interface SectionProps {
  tone?: SectionTone;
  id?: string;
  className?: string;
  withGrid?: boolean;
  withGlow?: boolean;
  /** Full-bleed layer behind content (outside max-width container) */
  backdrop?: ReactNode;
  children: ReactNode;
}

export function Section({
  tone = 'cream',
  id,
  className = '',
  withGrid = false,
  withGlow = false,
  backdrop,
  children,
}: SectionProps) {
  const styles = TONE_STYLES[tone];
  const isDark = tone === 'espresso';
  const hasCustomBackdrop = Boolean(backdrop);

  // `space-y-*` must live on the inner content wrapper — the <section> shell
  // also hosts absolute backdrop/grid/glow siblings, so spacing there never
  // reaches the actual page blocks and stacked cards/disclaimers collide.
  const tokens = className.split(/\s+/).filter(Boolean);
  const contentSpace = tokens.filter((t) => t.startsWith('space-y-')).join(' ');
  const shellClass = tokens.filter((t) => !t.startsWith('space-y-')).join(' ');

  return (
    <SectionToneContext.Provider value={tone}>
      <section
        id={id}
        className={`relative py-12 sm:py-16 lg:py-24 border-b overflow-hidden ${
          // Anchor-linked sections (Navbar / in-page links) must offset for
          // the sticky header, otherwise the smooth-scroll target lands
          // right under the nav bar and clips the section heading.
          id ? 'scroll-mt-20 sm:scroll-mt-24' : ''
        } ${hasCustomBackdrop ? 'bg-transparent' : styles.bg} ${styles.border} ${styles.text} ${shellClass}`}
      >
        {backdrop}
        {!hasCustomBackdrop && withGrid && (
          <div
            className={`absolute inset-0 pointer-events-none ${
              isDark ? 'dot-grid-dark opacity-60' : 'bg-dot-grid-light opacity-30'
            }`}
          />
        )}
        {!hasCustomBackdrop && withGlow && (
          <>
            <div className="glow-orb w-80 h-80 -top-20 -right-16 opacity-70" />
            {isDark && (
              <div
                className="glow-orb w-64 h-64 bottom-0 -left-10 opacity-40"
                style={{
                  background:
                    'radial-gradient(circle, rgba(184,158,107,0.35) 0%, transparent 70%)',
                }}
              />
            )}
          </>
        )}
        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0 ${contentSpace}`}
        >
          {children}
        </div>
      </section>
    </SectionToneContext.Provider>
  );
}
