import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { getMyStockLedger, getMyClients } from '../../../lib/professionalSession';
import { formatInrPrecise } from '../../../data/dashboard/investments';
import type { StockLedgerEntry } from '../../../types/investments';

export function ProfessionalInvestmentsLedgerPage() {
  const entries = [...getMyStockLedger()].sort((a, b) => b.date.localeCompare(a.date));
  const clients = getMyClients();
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.businessName ?? clientId;

  const columns: Column<StockLedgerEntry>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (e) => <span className="font-mono text-xs">{e.date}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      render: (e) => (
        <span className="font-mono text-xs text-admin-muted">{clientName(e.clientId)}</span>
      ),
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
          <div className="font-semibold text-admin-text">{e.symbol}</div>
          <div className="font-mono text-[11px] text-admin-muted">{e.companyName}</div>
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
      render: (e) => <span className="font-mono text-xs text-admin-muted">{e.brokerName}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Investment Ledgers"
        description="Client buy, sell, dividend, and bonus transactions. Read-only."
      />
      <DataTable variant="admin" columns={columns} rows={entries} rowKey={(r) => r.id} />
    </div>
  );
}
