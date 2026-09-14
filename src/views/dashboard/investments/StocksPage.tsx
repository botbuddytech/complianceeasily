import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../../components/dashboard/DataTable';
import {
  getClientStockHoldings,
  formatInr,
  formatInrPrecise,
} from '../../../data/dashboard/investments';
import type { StockHolding } from '../../../types/investments';

export function InvestmentsStocksPage() {
  const holdings = getClientStockHoldings();

  const columns: Column<StockHolding>[] = [
    {
      key: 'symbol',
      header: 'Holding',
      render: (h) => (
        <div>
          <div className="font-semibold text-[#0E1217]">{h.symbol}</div>
          <div className="font-mono text-[11px] text-[#6B7580]">
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
      key: 'avg',
      header: 'Avg / Current',
      render: (h) => (
        <div className="font-mono text-xs">
          <div>{formatInrPrecise(h.avgBuyPriceInr)}</div>
          <div className="text-[#6B7580]">{formatInrPrecise(h.currentPriceInr)}</div>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Invested / Value',
      render: (h) => {
        const invested = h.quantity * h.avgBuyPriceInr;
        const value = h.quantity * h.currentPriceInr;
        return (
          <div className="font-mono text-xs">
            <div>{formatInr(invested)}</div>
            <div className="font-semibold text-[#0E1217]">{formatInr(value)}</div>
          </div>
        );
      },
    },
    {
      key: 'pnl',
      header: 'P&L',
      render: (h) => {
        const invested = h.quantity * h.avgBuyPriceInr;
        const value = h.quantity * h.currentPriceInr;
        const pnl = value - invested;
        const pct = invested === 0 ? 0 : (pnl / invested) * 100;
        const positive = pnl >= 0;
        return (
          <div className={`font-mono text-xs font-semibold ${positive ? 'text-emerald-700' : 'text-red-700'}`}>
            {positive ? '+' : ''}
            {formatInr(pnl)}
            <div className="font-normal">
              {positive ? '+' : ''}
              {pct.toFixed(1)}%
            </div>
          </div>
        );
      },
    },
    {
      key: 'broker',
      header: 'Broker',
      render: (h) => <span className="font-mono text-xs text-[#5C6570]">{h.brokerName}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Portfolio"
        description="Equity, ETF, and mutual fund holdings synced from your brokers."
      />
      <DataTable columns={columns} rows={holdings} rowKey={(r) => r.id} />
    </div>
  );
}
