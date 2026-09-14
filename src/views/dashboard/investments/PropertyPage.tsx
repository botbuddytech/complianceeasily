import { MapPin, FileText } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import {
  getClientPropertyAssets,
  getClientInvestmentCompliances,
  formatInr,
} from '../../../data/dashboard/investments';

export function InvestmentsPropertyPage() {
  const properties = getClientPropertyAssets();
  const compliances = getClientInvestmentCompliances().filter((c) => c.domain === 'Property');

  return (
    <div>
      <PageHeader
        title="Property & Land"
        description="Land and property documents, ownership records, and related compliances."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => {
          const linked = compliances.filter((c) => c.assetLabel === p.name);
          return (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl border border-[#D5D0C6] bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-semibold text-[#0E1217]">{p.name}</h2>
                  <p className="mt-0.5 font-mono text-[11px] text-[#6B7580]">
                    {p.type} · {p.ownershipType}
                  </p>
                </div>
                <StatusBadge status={p.type.toLowerCase()} />
              </div>

              <dl className="space-y-2 font-mono text-xs text-[#5C6570]">
                <div className="flex items-start justify-between gap-2">
                  <dt className="flex items-center gap-1 text-[#6B7580]">
                    <MapPin className="h-3 w-3" /> Location
                  </dt>
                  <dd className="max-w-[60%] text-right font-semibold text-[#0E1217]">
                    {p.address}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#6B7580]">Registration</dt>
                  <dd className="font-semibold text-[#0E1217]">{p.registrationNo}</dd>
                </div>
                {p.areaSqft != null && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-[#6B7580]">Area</dt>
                    <dd className="font-semibold text-[#0E1217]">
                      {p.areaSqft.toLocaleString('en-IN')} sqft
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <dt className="text-[#6B7580]">Purchased</dt>
                  <dd className="font-semibold text-[#0E1217]">
                    {p.purchaseDate} · {formatInr(p.purchaseValueInr)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#6B7580]">Current value</dt>
                  <dd className="font-semibold text-[#B89E6B]">{formatInr(p.currentValueInr)}</dd>
                </div>
              </dl>

              {linked.length > 0 && (
                <div className="mt-4 border-t border-[#EBE8E2] pt-3">
                  <div className="mb-2 flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#6B7580]">
                    <FileText className="h-3 w-3" /> Linked compliances
                  </div>
                  <ul className="space-y-2">
                    {linked.map((c) => (
                      <li key={c.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate text-[#0E1217]">{c.name}</span>
                        <StatusBadge status={c.status} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
