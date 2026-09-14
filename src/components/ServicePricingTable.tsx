import { useState } from 'react';
import { Search, Info, ArrowRight } from 'lucide-react';
import { INDIVIDUAL_SERVICES_PRICING } from '../data/pricing';
import { Card } from './ui/Card';

interface ServicePricingTableProps {
  onOpenChecker: () => void;
}

export function ServicePricingTable({ onOpenChecker }: ServicePricingTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = INDIVIDUAL_SERVICES_PRICING.filter((svc) => {
    const term = searchTerm.toLowerCase();
    return (
      svc.service.toLowerCase().includes(term) ||
      svc.category.toLowerCase().includes(term)
    );
  });

  return (
    <Card hover={false} className="overflow-visible p-4 sm:p-6 lg:p-10 space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-[#D5D0C6] min-w-0">
        <div className="min-w-0">
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0E1217] tracking-tight leading-snug">
            Standalone Compliance &amp; Filing Tariffs
          </h3>
          <p className="text-xs sm:text-sm text-[#5C6570] mt-1 leading-relaxed">
            Need an individual filing, annual audit, or notice response without a monthly subscription?
          </p>
        </div>

        <div className="inline-flex items-start sm:items-center gap-1.5 px-3 py-2 rounded-full bg-[#EBE8E2] border border-[#D5D0C6] text-[#5C6570] text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 max-w-full sm:max-w-xs">
          <Info className="w-3.5 h-3.5 text-[#B89E6B] shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-snug">Provisional launch tariffs. Exact scope verified before work begins.</span>
        </div>
      </div>

      <div className="max-w-md relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7580]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter: Incorporation, GST, FSSAI, Tax Audit..."
          className="input-elevated w-full pl-10 pr-4 py-2.5 rounded-full text-xs text-[#0E1217] font-mono placeholder:text-[#6B7580]"
        />
      </div>

      {/* Mobile: stacked cards (no horizontal scroll) */}
      <div className="md:hidden space-y-3">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="card-static p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-[#0E1217] text-sm uppercase tracking-tight font-mono leading-snug">
                  {svc.service}
                </div>
                <span className="inline-flex mt-1.5 px-2 py-0.5 rounded bg-[#EBE8E2] border border-[#D5D0C6] text-[#5C6570] font-mono text-[10px] font-bold uppercase">
                  {svc.category}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-[#B89E6B] text-sm">{svc.professionalFee}</div>
                <div className="text-[10px] text-[#6B7580] mt-0.5">{svc.typicalFrequency}</div>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7580] italic leading-snug">{svc.governmentFee}</p>
            <button
              type="button"
              onClick={onOpenChecker}
              className="w-full btn-primary !flex-nowrap px-3.5 py-2.5 font-mono font-bold text-[10px] uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
            >
              <span className="whitespace-nowrap">{svc.action}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop / tablet: scrollable table */}
      <div className="hidden md:block rounded-2xl border border-[#D5D0C6] bg-white overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-xs font-mono">
          <thead className="sticky top-0 z-10 bg-[#EBE8E2] text-[#6B7580] uppercase tracking-widest font-mono font-bold text-[10px]">
            <tr className="border-b border-[#D5D0C6]">
              <th scope="col" className="px-4 py-3">Service Name</th>
              <th scope="col" className="px-4 py-3">Department</th>
              <th scope="col" className="px-4 py-3">Professional Service Fee</th>
              <th scope="col" className="px-4 py-3">Government Fees</th>
              <th scope="col" className="px-4 py-3">Frequency</th>
              <th scope="col" className="px-4 py-3 text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="font-medium text-[#0E1217]">
            {filteredServices.map((svc, index) => (
              <tr
                key={svc.id}
                className={`border-b border-[#EBE8E2] last:border-b-0 border-l-2 border-l-transparent hover:border-l-[#B89E6B] hover:bg-[#EBE8E2] transition-colors ${
                  index % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#F4F2EE]'
                }`}
              >
                <td className="px-4 py-3.5 max-w-[14rem]">
                  <div className="font-bold text-[#0E1217] text-xs sm:text-sm uppercase tracking-tight leading-snug">
                    {svc.service}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex px-2 py-0.5 rounded bg-[#EBE8E2] border border-[#D5D0C6] text-[#5C6570] font-mono text-[10px] font-bold uppercase whitespace-nowrap">
                    {svc.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono font-bold text-[#B89E6B] text-sm">
                    {svc.professionalFee}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[#6B7580] italic text-[11px] max-w-[12rem] leading-snug">
                  {svc.governmentFee}
                </td>
                <td className="px-4 py-3.5 text-[#5C6570] font-mono text-xs whitespace-nowrap">
                  {svc.typicalFrequency}
                </td>
                <td className="px-4 py-3.5 text-right align-middle whitespace-nowrap">
                  <button
                    type="button"
                    onClick={onOpenChecker}
                    className="btn-primary !flex-nowrap whitespace-nowrap shrink-0 px-3 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
                  >
                    <span className="whitespace-nowrap">{svc.action}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6B7580] pt-2 font-mono">
        <span className="text-[11px]">
          Showing {filteredServices.length} individual compliance execution services
        </span>
        <button
          type="button"
          onClick={onOpenChecker}
          className="font-bold text-[#B89E6B] hover:text-[#8A7349] uppercase tracking-wider text-[11px]"
        >
          Custom enterprise package? Inquire with desk &rarr;
        </button>
      </div>
    </Card>
  );
}
