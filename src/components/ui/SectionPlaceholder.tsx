export function SectionPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full border-b border-[#D5D0C6] bg-[#F4F2EE] px-4 py-16 sm:py-20 ${className}`}
      aria-hidden
    >
      <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <div className="mx-auto h-3 w-32 rounded-full bg-[#E4E0D8]" />
        <div className="mx-auto h-8 w-full max-w-xl rounded-lg bg-[#EBE8E2]" />
        <div className="mx-auto h-4 w-full max-w-lg rounded bg-[#E4E0D8]" />
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-36 rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2]/80" />
          <div className="h-36 rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2]/80" />
          <div className="hidden h-36 rounded-2xl border border-[#D5D0C6] bg-[#EBE8E2]/80 lg:block" />
        </div>
      </div>
    </div>
  );
}
