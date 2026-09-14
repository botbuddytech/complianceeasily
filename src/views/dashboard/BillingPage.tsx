import { PageHeader } from '../../components/dashboard/PageHeader';
import { StatusBadge } from '../../components/dashboard/StatusBadge';
import { DataTable, type Column } from '../../components/dashboard/DataTable';
import { SUBSCRIPTION } from '../../data/dashboard/subscription';
import type { Invoice } from '../../types/dashboard';
import { PRICING_PLANS } from '../../data/pricing';

const invoiceColumns: Column<Invoice>[] = [
  {
    key: 'id',
    header: 'Invoice',
    render: (i) => <span className="font-mono text-xs font-semibold">{i.id}</span>,
  },
  {
    key: 'date',
    header: 'Date',
    render: (i) => <span className="font-mono text-xs">{i.date}</span>,
  },
  {
    key: 'desc',
    header: 'Description',
    render: (i) => <span className="text-sm">{i.description}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (i) => <span className="font-mono text-sm font-semibold">{i.amount}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (i) => <StatusBadge status={i.status} />,
  },
];

export function BillingPage() {
  const sub = SUBSCRIPTION;

  return (
    <div>
      <PageHeader
        title="Billing & Plan"
        description="Subscription, renewals, and invoice history for your workspace."
        actions={
          <button type="button" className="btn-primary text-sm py-2 px-4">
            Upgrade plan
          </button>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D5D0C6] bg-gradient-to-br from-[#0E1217] to-[#1E2630] p-6 text-white lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={sub.planId} />
            <StatusBadge status={sub.status} />
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold">{sub.planName}</h2>
          <p className="mt-1 font-mono text-[#C9B483]">
            {sub.priceDisplay} {sub.period} · {sub.entityCount} entities
          </p>
          <p className="mt-3 font-mono text-xs text-[#A8B0BA]">
            Renews on {sub.renewalDate}
          </p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {sub.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-[#D5D0C6]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B89E6B]" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <h3 className="text-sm font-semibold text-[#0E1217]">Available plans</h3>
          <ul className="mt-3 space-y-3">
            {PRICING_PLANS.map((p) => (
              <li
                key={p.id}
                className={`rounded-xl border px-3 py-2.5 ${
                  p.id === sub.planId
                    ? 'border-[#B89E6B] bg-[#EBE8E2]'
                    : 'border-[#D5D0C6]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="font-mono text-xs font-bold text-[#B89E6B]">
                    {p.priceDisplay}
                  </span>
                </div>
                {p.id === sub.planId && (
                  <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-wider text-[#B89E6B]">
                    Current
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold text-[#0E1217]">Invoice history</h3>
      <DataTable columns={invoiceColumns} rows={sub.invoices} rowKey={(r) => r.id} />
    </div>
  );
}
