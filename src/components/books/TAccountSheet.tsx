import type { BooksVariant, TAccount, TSideRow } from '../../types/books';

interface TAccountSheetProps {
  account: TAccount;
  variant?: BooksVariant;
  className?: string;
}

function padRows(left: TSideRow[], right: TSideRow[]): { left: TSideRow[]; right: TSideRow[] } {
  const n = Math.max(left.length, right.length, 1);
  const fill = (rows: TSideRow[], side: 'L' | 'R') => {
    const out = [...rows];
    while (out.length < n) {
      out.push({ id: `${side}-pad-${out.length}`, label: '', amount: undefined });
    }
    return out;
  };
  return { left: fill(left, 'L'), right: fill(right, 'R') };
}

export function TAccountSheet({ account, variant = 'client', className = '' }: TAccountSheetProps) {
  const isAdmin = variant === 'admin';
  const border = isAdmin ? 'border-admin-border' : 'border-[#0E1217]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#5C6570]';
  const paper = isAdmin ? 'bg-admin-surface' : 'bg-white';
  const headBg = isAdmin ? 'bg-admin-bg' : 'bg-[#F4F2EE]';
  const { left, right } = padRows(account.left, account.right);

  return (
    <div className={`overflow-hidden rounded-sm border-2 ${border} ${paper} ${className}`}>
      <div className={`border-b ${border} px-4 py-3 text-center sm:px-6`}>
        <div className={`font-display text-sm font-semibold tracking-wide ${ink} sm:text-base`}>
          {account.entityLabel}
        </div>
        <div
          className={`mt-2 font-display text-base font-bold uppercase tracking-wide ${ink} sm:text-lg`}
        >
          {account.title}
        </div>
        {account.subtitle && (
          <div className={`mt-1 font-mono text-[11px] uppercase tracking-wider ${muted}`}>
            {account.subtitle}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className={`border-b ${border} ${headBg}`}>
              <th
                className={`w-[32%] border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                {account.leftHeader}
              </th>
              <th
                className={`w-[18%] border-r ${border} px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
              <th
                className={`w-[32%] border-r ${border} px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                {account.rightHeader}
              </th>
              <th
                className={`w-[18%] px-3 py-2 text-right font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
              >
                Amount (Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {left.map((lRow, i) => {
              const rRow = right[i];
              return (
                <tr key={`${lRow.id}-${rRow.id}`} className={`border-b ${border} last:border-0`}>
                  <td className={`border-r ${border} px-3 py-1.5 align-top ${ink}`}>
                    <span className={lRow.ditto ? `pl-4 ${muted}` : ''}>
                      {lRow.ditto ? `"   ${lRow.label}` : lRow.label}
                    </span>
                  </td>
                  <td
                    className={`border-r ${border} px-3 py-1.5 text-right align-top font-mono text-xs font-semibold tabular-nums ${ink}`}
                  >
                    {lRow.amount ?? ''}
                  </td>
                  <td className={`border-r ${border} px-3 py-1.5 align-top ${ink}`}>
                    <span className={rRow.ditto ? `pl-4 ${muted}` : ''}>
                      {rRow.ditto ? `"   ${rRow.label}` : rRow.label}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-1.5 text-right align-top font-mono text-xs font-semibold tabular-nums ${ink}`}
                  >
                    {rRow.amount ?? ''}
                  </td>
                </tr>
              );
            })}
            <tr className={`border-t-2 ${border} ${headBg}`}>
              <td className={`border-r ${border} px-3 py-2 font-semibold ${ink}`}>Total</td>
              <td
                className={`border-r ${border} px-3 py-2 text-right font-mono text-sm font-bold tabular-nums ${ink}`}
              >
                {account.leftTotal}
              </td>
              <td className={`border-r ${border} px-3 py-2 font-semibold ${ink}`}>Total</td>
              <td className={`px-3 py-2 text-right font-mono text-sm font-bold tabular-nums ${ink}`}>
                {account.rightTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
