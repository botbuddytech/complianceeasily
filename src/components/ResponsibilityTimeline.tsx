import {
  FileText,
  MessageSquare,
  Upload,
  Cpu,
  Award,
  Send,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card } from './ui/Card';

interface ResponsibilityTimelineProps {
  onOpenChecker: () => void;
}

export function ResponsibilityTimeline({ onOpenChecker }: ResponsibilityTimelineProps) {
  const events = [
    {
      date: '04 Sep, 10:00 AM',
      actor: 'ComplianceEasily System',
      action: 'ComplianceEasily requested sales and purchase registers for August tax period.',
      badge: 'Request Opened',
    },
    {
      date: '06 Sep, 02:30 PM',
      actor: 'WhatsApp Bot',
      action: 'Automated checklist reminder sent to business owner on WhatsApp with 1-click upload link.',
      badge: 'Radar Ping',
    },
    {
      date: '09 Sep, 05:15 PM',
      actor: 'Client (ACME Retail)',
      action: 'Client uploaded sales ledger, purchase invoices & preliminary bank statement to vault.',
      badge: 'Documents Received',
    },
    {
      date: '10 Sep, 11:20 AM',
      actor: 'AI Compliance Agent',
      action: 'AI agent completed automated line-item reconciliation of purchase register against GSTR-2B.',
      badge: '2B Reconciled',
    },
    {
      date: '11 Sep, 04:45 PM',
      actor: 'Chartered Accountant (Partner CA)',
      action: 'Assigned Chartered Accountant completed statutory review and prepared draft GSTR-3B schedule.',
      badge: 'CA Certified Draft',
    },
    {
      date: '12 Sep, 10:00 AM',
      actor: 'ComplianceEasily',
      action: 'Draft return summary and exact net cash tax liability sent to client for final sign-off.',
      badge: 'Approval Requested',
    },
    {
      date: '13 Sep, 01:10 PM',
      actor: 'Client (ACME Retail)',
      action: 'Client reviewed tax computation, approved draft and authorized filing via EVC OTP.',
      badge: 'Client Signed Off',
    },
    {
      date: '14 Sep, 03:25 PM',
      actor: 'GST Portal & Compliance Agent',
      action: 'Return successfully filed on GST portal • ARN AA190826001928K generated • Compliance Protected status: Fulfilled.',
      badge: 'Filing Fulfilled ✓',
    },
  ];

  return (
    <div className="text-left space-y-10">
      <div className="max-w-3xl space-y-2">
        <div className="glass-pill glass-pill-dark">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
            TAMPER-EVIDENT AUDIT TRAIL
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#F4F2EE] tracking-tight leading-[1.15]">
          Everyone knows who had to do what — and when.
        </h3>

        <p className="text-sm sm:text-base text-[#A8B0BA] leading-relaxed">
          Every managed compliance maintains an immutable audit trail. If there is ever an inquiry,
          you, your CA, and our team have a complete record of every document upload, review note,
          and government acknowledgment.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2630]">
        {events.map((ev) => (
          <div key={ev.date} className="relative group">
            <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#0E1217] border-2 border-[#B89E6B] flex items-center justify-center text-[#B89E6B] shadow-2xs group-hover:scale-110 transition-transform">
              <div className="w-2 h-2 rounded-full bg-[#B89E6B]" />
            </div>

            <Card className="p-4 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#0E1217] uppercase tracking-tight font-mono">
                    {ev.actor}
                  </span>
                  <span className="text-[#D5A77B]">&bull;</span>
                  <span className="text-[10px] font-mono text-[#6B7580]">{ev.date}</span>
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B]">
                  {ev.badge}
                </span>
              </div>

              <p className="text-xs text-[#5C6570] leading-relaxed">{ev.action}</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-[#1E2630] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8B0BA] font-mono">
        <span className="text-[11px]">
          Permanent cryptographic archive maintained in your Business Compliance Vault.
        </span>
        <button
          type="button"
          onClick={onOpenChecker}
          className="font-bold text-[#B89E6B] hover:text-[#E4E0D8] flex items-center uppercase tracking-wider text-[11px] font-mono"
        >
          <span>View Live Timeline Demo</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}
