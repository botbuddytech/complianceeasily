import Image from 'next/image';

type BrandMarkSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<BrandMarkSize, { box: string; px: number }> = {
  xs: { box: 'h-7 w-7', px: 28 },
  sm: { box: 'h-8 w-8 sm:h-9 sm:w-9', px: 36 },
  md: { box: 'h-10 w-10', px: 40 },
  lg: { box: 'h-14 w-14', px: 56 },
};

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
  /** Soft rounded frame — default true for nav chips */
  framed?: boolean;
  priority?: boolean;
}

/**
 * Official ComplianceEasily mark (document + shield + gold orbit).
 * Uses the optimized PNG from /public/brand.
 */
export function BrandMark({
  size = 'sm',
  className = '',
  framed = true,
  priority = false,
}: BrandMarkProps) {
  const { box, px } = SIZE_MAP[size];

  if (!framed) {
    return (
      <Image
        src="/brand/mark.png"
        alt="ComplianceEasily"
        width={px}
        height={px}
        priority={priority}
        className={`object-contain ${box} ${className}`}
      />
    );
  }

  return (
    <span
      className={`relative inline-flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black shadow-[0_4px_12px_-4px_rgba(213,170,109,0.45)] ring-1 ring-[#B89E6B]/30 ${className}`}
    >
      <Image
        src="/brand/mark.png"
        alt="ComplianceEasily"
        width={px}
        height={px}
        priority={priority}
        className="h-[92%] w-[92%] object-contain"
      />
    </span>
  );
}
