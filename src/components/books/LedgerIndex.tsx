import type { BooksVariant, LedgerIndexEntry } from '../../types/books';

interface LedgerIndexProps {
  entries: LedgerIndexEntry[];
  selectedId?: string;
  onSelect: (ledgerId: string) => void;
  variant?: BooksVariant;
}

export function LedgerIndex({
  entries,
  selectedId,
  onSelect,
  variant = 'client',
}: LedgerIndexProps) {
  const isAdmin = variant === 'admin';
  const border = isAdmin ? 'border-admin-border' : 'border-[#0E1217]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#5C6570]';
  const paper = isAdmin ? 'bg-admin-surface' : 'bg-white';
  const headBg = isAdmin ? 'bg-admin-bg' : 'bg-[#F4F2EE]';
  const active = isAdmin ? 'bg-admin-bg' : 'bg-[#EBE8E2]';

  return (
    <div className={`overflow-hidden rounded-sm border-2 ${border} ${paper}`}>
      <div className={`border-b ${border} px-4 py-3 text-center`}>
        <div className={`font-display text-sm font-bold uppercase tracking-wide ${ink}`}>
          Ledger Index
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className={`border-b ${border} ${headBg}`}>
              <th
                className={`w-14 border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                No.
              </th>
              <th
                className={`border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Ledger
              </th>
              <th
                className={`border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Source
              </th>
              <th
                className={`px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Closing (Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const selected = e.ledgerId === selectedId;
              return (
                <tr
                  key={e.ledgerId}
                  onClick={() => onSelect(e.ledgerId)}
                  className={`cursor-pointer border-b ${border} last:border-0 ${
                    selected ? active : isAdmin ? 'hover:bg-admin-bg/60' : 'hover:bg-[#F4F2EE]'
                  }`}
                >
                  <td className={`border-r ${border} px-3 py-2 font-mono text-xs ${muted}`}>
                    {e.no}
                  </td>
                  <td className={`border-r ${border} px-3 py-2 font-semibold ${ink}`}>{e.name}</td>
                  <td className={`border-r ${border} px-3 py-2 font-mono text-[11px] ${muted}`}>
                    {e.source}
                  </td>
                  <td className={`px-3 py-2 text-right font-mono text-xs font-semibold tabular-nums ${ink}`}>
                    {e.closingBalance}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
