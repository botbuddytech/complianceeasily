import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import { getMyStockHoldings, getMyClients } from '../../../lib/professionalSession';
import { formatInr, formatInrPrecise } from '../../../data/dashboard/investments';
import type { StockHolding } from '../../../types/investments';

export function ProfessionalInvestmentsStocksPage() {
  const holdings = getMyStockHoldings();
  const clients = getMyClients();
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.businessName ?? clientId;

  const columns: Column<StockHolding>[] = [
    {
      key: 'client',
      header: 'Client',
      render: (h) => (
        <span className="font-mono text-xs text-admin-muted">{clientName(h.clientId)}</span>
      ),
    },
    {
      key: 'symbol',
      header: 'Holding',
      render: (h) => (
        <div>
          <div className="font-semibold text-admin-text">{h.symbol}</div>
          <div className="font-mono text-[11px] text-admin-muted">
            {h.companyName} · {h.exchange}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (h) => <StatusBadge status={h.holdingType} />,
    },
    {
      key: 'qty',
      header: 'Qty',
      render: (h) => (
        <span className="font-mono text-xs">{h.quantity.toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      render: (h) => {
        const value = h.quantity * h.currentPriceInr;
        return (
          <div className="font-mono text-xs">
            <div className="font-semibold text-admin-text">{formatInr(value)}</div>
            <div className="text-admin-muted">{formatInrPrecise(h.currentPriceInr)} /u</div>
          </div>
        );
      },
    },
    {
      key: 'broker',
      header: 'Broker',
      render: (h) => <span className="font-mono text-xs text-admin-muted">{h.brokerName}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        variant="admin"
        title="Stock Portfolios"
        description="Client equity, ETF, and mutual fund holdings. Read-only."
      />
      <DataTable variant="admin" columns={columns} rows={holdings} rowKey={(r) => r.id} />
    </div>
  );
}
