import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { LEDGER_ENTRIES } from '../../../data/dashboard/bookkeeping';
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
        <div className="font-semibold text-[#0E1217]">{t.particulars}</div>
        <div className="font-mono text-[11px] text-[#6B7580]">{t.ledgerName}</div>
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
    render: (t) => (
      <span className="font-mono text-[11px] text-[#6B7580]">{t.source}</span>
    ),
  },
];

export function BookkeepingTransactionsPage() {
  const { period, periodLabel } = useBooksPeriod();
  const rows = LEDGER_ENTRIES.filter(
    (t) => t.date >= period.from && t.date <= period.to,
  );

  return (
    <div>
      <PageHeader
        title="Transactions"
        description={`Vouchers in selected period · ${periodLabel}`}
      />
      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#D5D0C6] bg-white px-4 py-10 text-center text-sm text-[#5C6570]">
          No transactions in this period. Widen the From / To dates or pick another preset.
        </div>
      ) : (
        <DataTable columns={txnColumns} rows={rows} rowKey={(r) => r.id} />
      )}
    </div>
  );
}
