import { ReactNode } from 'react';
import { useSectionTone } from './Section';

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const tone = useSectionTone();
  const isDark = tone === 'espresso';

  return (
    <div
      className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-3xl space-y-3 sm:space-y-4 px-0.5 ${className}`}
    >
      {eyebrow && (
        <div
          className={`${align === 'center' ? 'justify-center' : ''} flex ${
            isDark ? 'glass-pill glass-pill-dark' : 'glass-pill'
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`font-display text-[1.5rem] leading-[1.2] sm:text-4xl lg:text-5xl font-semibold tracking-tight sm:leading-[1.15] ${
          isDark ? 'text-white' : 'text-[#0E1217]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-[#A8B0BA]' : 'text-[#5C6570]'
          } ${align === 'center' ? 'max-w-2xl mx-auto' : ''}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
