import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import {
  getClientStockLedger,
  formatInrPrecise,
} from '../../../data/dashboard/investments';
import type { StockLedgerEntry } from '../../../types/investments';

export function InvestmentsLedgerPage() {
  const entries = [...getClientStockLedger()].sort((a, b) => b.date.localeCompare(a.date));

  const columns: Column<StockLedgerEntry>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (e) => <span className="font-mono text-xs">{e.date}</span>,
    },
    {
      key: 'txn',
      header: 'Type',
      render: (e) => <StatusBadge status={e.txnType} />,
    },
    {
      key: 'symbol',
      header: 'Symbol',
      render: (e) => (
        <div>
          <div className="font-semibold text-[#0E1217]">{e.symbol}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">{e.companyName}</div>
        </div>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      render: (e) => (
        <span className="font-mono text-xs">{e.quantity.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (e) => (
        <span className="font-mono text-xs">
          {e.priceInr === 0 ? '—' : formatInrPrecise(e.priceInr)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (e) => (
        <span className="font-mono text-xs font-semibold">
          {e.amountInr === 0 ? '—' : formatInrPrecise(e.amountInr)}
        </span>
      ),
    },
    {
      key: 'broker',
      header: 'Broker',
      render: (e) => <span className="font-mono text-xs text-[#5C6570]">{e.brokerName}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Investment Ledger"
        description="Buy, sell, dividend, and bonus transactions across your demat accounts."
      />
      <DataTable columns={columns} rows={entries} rowKey={(r) => r.id} />
    </div>
  );
}
