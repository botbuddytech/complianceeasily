import { Receipt, Check, ShieldCheck } from 'lucide-react';
import { Card } from './ui/Card';

export function PricingTransparencyCallout() {
  return (
    <Card hover={false} className="overflow-visible p-5 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start min-w-0">
        <div className="lg:col-span-7 space-y-4 min-w-0">
          <div className="glass-pill">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
              PRICE TRANSPARENCY PROTOCOL
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0E1217] tracking-tight leading-snug">
            No surprise government-fee markups.{' '}
            <span className="text-[#B89E6B]">Ever.</span>
          </h3>

          <p className="text-sm sm:text-base text-[#5C6570] leading-relaxed">
            In India, compliance services are notoriously opaque, with hidden fees, arbitrary markups on
            government challans, and surprise renewal bills. At ComplianceEasily, professional
            service fees and official statutory government fees are separated transparently on every quote.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2 text-xs text-[#5C6570] font-medium">
              <Check className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#0E1217] font-mono">Government Challans at 100% Actuals:</strong> You pay the exact government
                prescribed portal fees, stamp duties, and registration charges without a single rupee markup.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#5C6570] font-medium">
              <Check className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#0E1217] font-mono">Direct Treasury Receipts:</strong> Every statutory fee is backed by the
                official GSTN, MCA V3, or State Treasury receipt issued directly in your company&rsquo;s name.
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#5C6570] font-medium">
              <Check className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#0E1217] font-mono">Published Scope &amp; Fee Before Work Begins:</strong> You always approve the
                fee breakdown before any filing is initiated.
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 min-w-0 w-full">
          <div className="card-static p-4 sm:p-5 space-y-4 min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#D5D0C6]">
              <div className="flex items-center gap-2 min-w-0">
                <Receipt className="w-4 h-4 text-[#B89E6B] shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#0E1217] uppercase tracking-wider font-mono leading-snug">
                  Sample Billing Transparency
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-[#B89E6B] bg-[#EBE8E2] px-2.5 py-1 rounded-full border border-[#D5D0C6] font-bold uppercase tracking-wider">
                Itemized Quote
              </span>
            </div>

            <div className="space-y-3 text-xs min-w-0">
              <div className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-wider leading-relaxed">
                Service: MCA Annual Return Filing (AOC-4)
              </div>

              <div className="p-3.5 sm:p-4 bg-[#EBE8E2] rounded-xl border border-[#D5D0C6] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 text-[#5C6570] leading-snug">
                    Company Secretary Professional Review &amp; Prep
                  </span>
                  <span className="shrink-0 font-mono font-bold text-[#0E1217]">₹1,500</span>
                </div>
                <div className="flex items-start justify-between gap-3 pt-3 border-t border-[#D5D0C6]">
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <span className="text-[#5C6570] leading-snug">Statutory MCA V3 Portal Challan Fee</span>
                    <span className="text-[10px] text-[#6B7580] font-mono">
                      (Exact govt tariff based on capital)
                    </span>
                  </div>
                  <span className="shrink-0 font-mono font-bold text-[#B89E6B]">₹300*</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#0E1217] text-white font-bold font-mono">
                <span className="uppercase text-[11px] sm:text-xs tracking-wider">Total Payable</span>
                <span className="shrink-0 font-mono text-sm text-[#F4F2EE]">₹1,800</span>
              </div>
            </div>

            <p className="text-[10px] text-[#6B7580] italic text-center font-mono leading-relaxed px-1">
              *Official MCA challan PDF receipt sent immediately to your WhatsApp vault upon submission.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
