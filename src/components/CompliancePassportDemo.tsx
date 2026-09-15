import { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  MapPin,
  ChevronRight,
  Building2,
  Store,
} from 'lucide-react';

interface CompliancePassportDemoProps {
  onOpenChecker?: () => void;
  onOpenProtectionModal?: () => void;
}

export function CompliancePassportDemo({
  onOpenChecker,
  onOpenProtectionModal,
}: CompliancePassportDemoProps) {
  const [filedDemo, setFiledDemo] = useState(false);

  return (
    <div className="relative rounded-2xl bg-[#FFFFFF] border border-[#D5D0C6] shadow-xl shadow-[#0E1217]/25 overflow-hidden text-left">
      {/* Friendly status bar */}
      <div className="bg-[#0E1217] text-white px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B89E6B] to-[#B89E6B] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight truncate">Your Compliance Passport</div>
            <div className="text-[11px] text-[#A8B0BA] truncate">Live demo · sample business</div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 shrink-0 px-2 py-1 sm:px-2.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#1E2630] text-[#B89E6B] border border-[#B89E6B]/35">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B] animate-pulse" />
          <span className="sm:hidden">Live</span>
          <span className="hidden sm:inline">Watching deadlines</span>
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Business identity */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-[#D5D0C6]">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0E1217] tracking-tight leading-snug">
                Acme Retail Pvt. Ltd.
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EBE8E2] text-[#B89E6B] border border-[#D5D0C6] rounded-full">
                Private Limited
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-[#5C6570]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B7580]" />
                Kolkata &amp; Howrah · 2 stores
              </span>
              <span className="inline-flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#6B7580]" />
                Food &amp; retail
              </span>
            </div>
            <p className="text-[11px] text-[#6B7580]">
              GST registered · West Bengal
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#EBE8E2] border border-[#D5D0C6] px-3.5 py-2.5 shrink-0 self-start">
            <div className="text-center leading-none">
              <div className="font-display text-2xl font-semibold text-[#B89E6B]">86</div>
              <div className="text-[10px] font-medium text-[#6B7580] mt-0.5">out of 100</div>
            </div>
            <div className="border-l border-[#D5D0C6] pl-3 text-left">
              <div className="text-xs font-semibold text-[#0E1217]">Looking healthy</div>
              <div className="text-[11px] text-[#5C6570] mt-0.5">Most filings are on track</div>
            </div>
          </div>
        </div>

        {/* Plain-language status tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              value: '31',
              label: 'Done & filed',
              hint: 'Nothing pending',
              icon: CheckCircle2,
              valueClass: 'text-[#B89E6B]',
              iconClass: 'text-[#B89E6B]',
            },
            {
              value: '6',
              label: 'Coming up',
              hint: 'Next few weeks',
              icon: Clock,
              valueClass: 'text-[#B89E6B]',
              iconClass: 'text-[#B89E6B]',
            },
            {
              value: '3',
              label: 'Needs you',
              hint: 'Review or approve',
              icon: AlertTriangle,
              valueClass: 'text-amber-700',
              iconClass: 'text-amber-600',
            },
            {
              value: '2',
              label: 'Docs missing',
              hint: 'Upload to continue',
              icon: FileText,
              valueClass: 'text-[#6B7580]',
              iconClass: 'text-[#6B7580]',
            },
          ].map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                className="rounded-xl p-3 bg-[#F4F2EE] border border-[#D5D0C6] space-y-1"
              >
                <div className={`text-xl font-semibold tracking-tight ${tile.valueClass}`}>
                  {tile.value}
                </div>
                <div className="text-xs font-semibold text-[#0E1217] flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${tile.iconClass}`} />
                  {tile.label}
                </div>
                <div className="text-[10px] text-[#6B7580] leading-snug">{tile.hint}</div>
              </div>
            );
          })}
        </div>

        {/* Next thing to do */}
        <div className="rounded-2xl border border-[#D5D0C6] bg-gradient-to-br from-[#EBE8E2] to-[#FFFFFF] p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0E1217] text-[#F4F2EE] px-2.5 py-1 rounded-full">
              Do this next
            </span>
            <button
              type="button"
              onClick={onOpenProtectionModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B89E6B] bg-white border border-[#D5D0C6] px-2.5 py-1 rounded-full hover:bg-[#EBE8E2] transition-colors"
            >
              <Shield className="w-3 h-3" />
              Penalty cover on
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="font-display text-base sm:text-lg font-semibold text-[#0E1217] tracking-tight">
              August GST return ready for your OK
            </h4>
            <p className="text-sm text-[#5C6570] leading-relaxed">
              Your CA has prepared GSTR-3B. Approve it so we can file before the deadline.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C6570]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#B89E6B]">
                <Calendar className="w-3.5 h-3.5" />
                Due 20 Sep · 6 days left
              </span>
              <span className="text-[#6B7580]">
                {filedDemo ? 'Filed · acknowledgement saved' : 'Waiting for your review'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setFiledDemo(!filedDemo)}
              className={`w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-full transition-all ${
                filedDemo
                  ? 'bg-[#E4E0D8] text-[#B89E6B] border border-[#D5D0C6]'
                  : 'btn-primary !py-2.5 !px-4 !text-sm'
              }`}
            >
              {filedDemo ? '✓ Saved in your passport' : 'Review & approve →'}
            </button>
          </div>
        </div>

        {/* Second reminder */}
        <div className="rounded-2xl border border-[#D5D0C6] p-4 bg-white hover:border-[#D5D0C6] transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F7F5F1] border border-[#E4E0D8] flex items-center justify-center text-[#8A7349] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <h5 className="text-sm font-semibold text-[#0E1217] leading-snug">
                  Shop licence renews soon
                </h5>
                <p className="text-xs text-[#5C6570] leading-relaxed">
                  West Bengal Shops &amp; Establishment — needed for your commercial premises.
                </p>
                <span className="inline-flex text-[11px] font-semibold text-[#8A7349] bg-[#F7F5F1] border border-[#E4E0D8] px-2 py-0.5 rounded-full">
                  Expires in 32 days
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenChecker}
              className="shrink-0 self-start sm:self-center text-xs font-semibold text-[#0E1217] px-3 py-2 rounded-full border border-[#D5D0C6] hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors"
            >
              See what&apos;s needed
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 border-t border-[#D5D0C6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C6570]">
          <span className="flex items-start sm:items-center gap-1.5 leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89E6B] shrink-0 mt-0.5 sm:mt-0" />
            <span>42 rules tracked for this business — Central, State &amp; local</span>
          </span>
          <button
            type="button"
            onClick={onOpenChecker}
            className="font-semibold text-[#B89E6B] hover:text-[#8A7349] inline-flex items-center group shrink-0 self-start sm:self-auto"
          >
            Open full passport
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
