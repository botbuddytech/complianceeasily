import { useMemo } from 'react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { useProfessionalBooks } from '../../../context/ProfessionalBooksContext';
import { useBooksPeriod } from '../../../context/BooksPeriodContext';
import type { LedgerEntry } from '../../../types/dashboard';

const txnColumns: Column<LedgerEntry>[] = [
  {
    key: 'date',
    header: 'Date',
    render: (t) => <span className="font-mono text-xs">{t.date}</span>,
  },
  {
    key: 'particulars',
    header: 'Particulars',
    render: (t) => (
      <div>
        <div className="font-semibold text-admin-text">{t.particulars}</div>
        <div className="font-mono text-[11px] text-admin-muted">{t.ledgerName}</div>
      </div>
    ),
  },
  {
    key: 'voucher',
    header: 'Voucher',
    render: (t) => <StatusBadge status={t.voucherType} />,
  },
  {
    key: 'debit',
    header: 'Debit',
    render: (t) => <span className="font-mono text-xs">{t.debit}</span>,
  },
  {
    key: 'credit',
    header: 'Credit',
    render: (t) => <span className="font-mono text-xs">{t.credit}</span>,
  },
  {
    key: 'source',
    header: 'Source',
    render: (t) => <span className="font-mono text-[11px] text-admin-muted">{t.source}</span>,
  },
];

export function ProfessionalBooksTransactionsPage() {
  const { entity, entries } = useProfessionalBooks();
  const { period, periodLabel } = useBooksPeriod();

  const rows = useMemo(
    () => entries.filter((t) => t.date >= period.from && t.date <= period.to),
    [entries, period.from, period.to],
  );

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Transactions"
        description={
          entity
            ? `Vouchers for ${entity.shortName} · ${periodLabel}`
            : 'Select a client entity.'
        }
      />
      {entries.length === 0 ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No transactions for this entity.
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-admin-border bg-admin-surface px-4 py-10 text-center text-sm text-admin-muted">
          No transactions in this period. Widen the From / To dates or pick another preset.
        </div>
      ) : (
        <DataTable variant="admin" columns={txnColumns} rows={rows} rowKey={(r) => r.id} />
      )}
    </div>
  );
}
