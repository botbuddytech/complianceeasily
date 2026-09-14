import { useEffect, useMemo, useState } from 'react';
import { ReturnPreviewSheet } from './ReturnPreviewSheet';
import { StatusBadge } from '../dashboard/StatusBadge';
import { filterItrReturns } from '../../data/dashboard/itrBooks';
import type { BooksVariant, EntityItrBooks } from '../../types/books';

interface ItrReturnsPanelProps {
  itr: EntityItrBooks;
  periodFrom: string;
  periodTo: string;
  periodLabel: string;
  variant?: BooksVariant;
}

export function ItrReturnsPanel({
  itr,
  periodFrom,
  periodTo,
  periodLabel,
  variant = 'client',
}: ItrReturnsPanelProps) {
  const isAdmin = variant === 'admin';
  const returns = useMemo(
    () => filterItrReturns(itr.returns, periodFrom, periodTo),
    [itr.returns, periodFrom, periodTo],
  );
  const firstId = returns[0]?.id ?? '';
  const [selectedId, setSelectedId] = useState(firstId);

  useEffect(() => {
    setSelectedId(firstId);
  }, [itr.entityId, firstId]);

  const selected = useMemo(
    () => returns.find((r) => r.id === selectedId) ?? returns[0],
    [returns, selectedId],
  );

  const shell = isAdmin
    ? 'border-admin-border bg-admin-surface'
    : 'border-[#D5D0C6] bg-white';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#6B7580]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const head = isAdmin ? 'bg-admin-bg' : 'bg-[#EBE8E2]';
  const border = isAdmin ? 'border-admin-border' : 'border-[#D5D0C6]';
  const activeRow = isAdmin ? 'bg-admin-bg' : 'bg-[#EBE8E2]';

  return (
    <section className="space-y-4">
      <div>
        <h2 className={`font-display text-lg font-semibold ${ink}`}>Income-tax returns (ITR)</h2>
        <p className={`mt-0.5 text-sm ${muted}`}>
          Click a row to preview ITR for {periodLabel}. PAN {itr.pan}.
        </p>
      </div>
      {returns.length === 0 ? (
        <div className={`rounded-xl border px-4 py-10 text-center text-sm ${shell} ${muted}`}>
          No ITR filings in this reporting period. Try FY 2025-26 or FY 2024-25 presets.
        </div>
      ) : (
        <>
          <div className={`overflow-hidden rounded-xl border ${shell}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className={`border-b ${border} ${head}`}>
                    {['Form', 'A.Y.', 'F.Y.', 'Due', 'Status', 'Total income', 'Tax', 'Ack'].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-3 py-2.5 text-left font-mono text-[10px] font-bold uppercase tracking-wider ${muted} ${
                            h === 'Total income' || h === 'Tax' ? 'text-right' : ''
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {returns.map((r) => {
                    const active = r.id === selected?.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`cursor-pointer border-b ${border} last:border-0 ${
                          active
                            ? activeRow
                            : isAdmin
                              ? 'hover:bg-admin-bg/60'
                              : 'hover:bg-[#F4F2EE]'
                        }`}
                      >
                        <td className={`px-3 py-2.5 font-semibold ${ink}`}>{r.formType}</td>
                        <td className={`px-3 py-2.5 font-mono text-xs ${muted}`}>{r.ay}</td>
                        <td className={`px-3 py-2.5 font-mono text-xs ${muted}`}>{r.fy}</td>
                        <td className={`px-3 py-2.5 font-mono text-xs ${muted}`}>{r.dueDate}</td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className={`px-3 py-2.5 text-right font-mono text-xs font-semibold ${ink}`}>
                          {r.totalIncome}
                        </td>
                        <td className={`px-3 py-2.5 text-right font-mono text-xs ${ink}`}>
                          {r.taxPayable}
                        </td>
                        <td className={`px-3 py-2.5 font-mono text-[11px] ${muted}`}>
                          {r.acknowledgement ?? '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className={`mb-2 font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}>
              ITR preview
              {selected ? ` · ${selected.formType} · A.Y. ${selected.ay}` : ''}
            </h3>
            <ReturnPreviewSheet doc={selected?.preview} variant={variant} />
          </div>
        </>
      )}
    </section>
  );
}
