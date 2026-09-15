import { Scale } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

interface PageLoaderProps {
  /** Short status line under the brand */
  label?: string;
  /** Compact variant for nested segment loading */
  compact?: boolean;
}

/**
 * Shared legal-styled suspense / route loading state.
 * Full variant frosts the viewport so the page behind feels blurred.
 */
export function PageLoader({
  label = 'Loading statutory workspace…',
  compact = false,
}: PageLoaderProps) {
  if (compact) {
    return (
      <div
        className="relative flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 overflow-hidden px-4 py-12"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[#F4F2EE]/55 backdrop-blur-md"
          style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#E4E0D8]" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#B89E6B]" />
            <Scale className="absolute inset-0 m-auto h-4 w-4 text-[#B89E6B]" strokeWidth={2} />
          </div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7580]">
            {label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex w-full flex-col items-center justify-center px-4 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#F4F2EE]/50 backdrop-blur-lg supports-[backdrop-filter]:bg-[#F4F2EE]/35"
        style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-[#D5D0C6]/80 bg-[#F4F2EE]/90 px-6 py-8 text-center shadow-[0_16px_48px_-24px_rgba(14,18,23,0.4)] backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center">
          <BrandMark size="lg" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#0E1217]">
            ComplianceEasily
          </h1>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7580]">
            {label}
          </p>
        </div>

        <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-[#E4E0D8]">
          <div className="nav-progress-fill h-full rounded-full bg-[#B89E6B]" />
        </div>

        <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-[#D5D0C6] bg-[#EBE8E2]/70 animate-pulse"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
