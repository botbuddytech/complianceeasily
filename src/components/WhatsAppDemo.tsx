import { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  Upload,
  Calendar,
  PhoneCall,
  MoreVertical,
} from 'lucide-react';

interface WhatsAppDemoProps {
  onOpenChecker?: () => void;
}

export function WhatsAppDemo({ onOpenChecker }: WhatsAppDemoProps) {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const messages = [
    {
      id: 'msg-1',
      title: 'Due Date & Missing Documents Alert',
      tag: '6 Days Remaining',
      bubble: (
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs bg-amber-50 p-2 rounded-lg border border-amber-200/80">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>⚠️ GSTR-3B due in 6 days</span>
          </div>

          <div className="text-xs text-gray-800 space-y-1.5 leading-relaxed">
            <p className="font-bold text-gray-900">ACME Retail Pvt Ltd</p>
            <p>
              <span className="text-gray-500">Statutory Due Date:</span>{' '}
              <strong className="text-gray-900">20 September</strong>
            </p>
            <p>
              <span className="text-gray-500">Filing Status:</span>{' '}
              <span className="text-amber-700 font-semibold">Documents pending</span>
            </p>
          </div>

          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-700 space-y-1">
            <p className="font-semibold text-gray-900">Still required to close calculation:</p>
            <ul className="space-y-0.5 list-disc list-inside text-gray-600">
              <li>Sales register (GSTR-1 summary)</li>
              <li>Purchase register (for 2B reconciliation)</li>
              <li>Bank statement for tax challan mapping</li>
            </ul>
          </div>

          {/* Interactive Button Simulation */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={onOpenChecker}
              className="w-full py-2 px-2 btn-primary rounded-lg text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Docs</span>
            </button>
            <button
              type="button"
              className="w-full py-2 px-2 bg-white hover:bg-[#F4F2EE] text-[#0E1217] border border-[#D5D0C6] rounded-lg text-center text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Remind Later
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'msg-2',
      title: 'Protection Guarantee Active',
      tag: 'Workflow Locked',
      bubble: (
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-[#B89E6B] font-bold text-xs bg-[#EBE8E2] p-2 rounded-lg border border-[#D5D0C6] font-mono">
            <ShieldCheck className="w-4 h-4 text-[#B89E6B] shrink-0" />
            <span>🛡 Your Compliance Protection is active</span>
          </div>

          <div className="text-xs text-slate-800 space-y-1.5">
            <p className="font-bold text-[#0E1217] font-mono uppercase">GSTR-3B (August Period)</p>
            <div className="space-y-1 pt-1 text-[#0E1217] font-medium font-mono">
              <div className="flex items-center text-[#B89E6B]">
                <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-[#B89E6B]" />
                <span>Documents received &bull; 11 Sep, 14:20</span>
              </div>
              <div className="flex items-center text-[#B89E6B]">
                <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-[#B89E6B]" />
                <span>Chartered Accountant review completed &bull; 12 Sep</span>
              </div>
              <div className="flex items-center text-[#B89E6B]">
                <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-[#B89E6B]" />
                <span>Client OTP &amp; tax approval authorized &bull; 13 Sep</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#5C6570] bg-[#F4F2EE] p-2.5 rounded-lg border border-[#D5D0C6]">
            Our Compliance Agent and designated CA will track this until government filing
            acknowledgement is verified and permanently archived.
          </p>

          <button
            type="button"
            onClick={onOpenChecker}
            className="w-full py-2 px-2 btn-primary rounded-lg text-center text-xs font-bold uppercase tracking-wider font-mono"
          >
            View Live Status &amp; Guarantee &rarr;
          </button>
        </div>
      ),
    },
    {
      id: 'msg-3',
      title: 'Business Event Trigger Alert',
      tag: 'Change Detected',
      bubble: (
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-[#B89E6B] font-bold text-xs bg-[#EBE8E2] p-2 rounded-lg border border-[#D5D0C6] font-mono">
            <Sparkles className="w-4 h-4 text-[#B89E6B] shrink-0" />
            <span>🔔 New compliance may apply</span>
          </div>

          <div className="text-xs text-gray-800 space-y-1.5 leading-relaxed font-mono">
            <p>
              You told us <strong>ACME Retail</strong> has opened a second commercial branch in{' '}
              <strong>Kolkata (West Bengal)</strong>.
            </p>
            <p className="text-gray-600">
              We identified 3 location-specific compliance checks that may now apply:
            </p>
          </div>

          <div className="bg-[#F4F2EE] p-2.5 rounded-lg border border-[#D5D0C6] text-xs text-[#0E1217] space-y-1 font-medium font-mono">
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B] mr-2" />
              <span>Shops &amp; Establishment WB Registration</span>
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B] mr-2" />
              <span>Kolkata Municipal Trade Licence (Enlistment)</span>
            </div>
            <div className="flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89E6B] mr-2" />
              <span>West Bengal Professional Tax branch review</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChecker}
            className="w-full py-1.5 px-2 btn-primary rounded text-center text-xs font-mono font-semibold"
          >
            Check Applicability for Kolkata &rarr;
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Tab Switcher on top for interactive preview */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 flex-wrap px-1">
        {messages.map((m, idx) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActiveMessageIndex(idx)}
            className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase rounded-full transition-all ${
              activeMessageIndex === idx
                ? 'bg-[#B89E6B] text-white shadow-2xs'
                : 'bg-[#F4F2EE] text-[#5C6570] hover:bg-[#EBE8E2] border border-[#D5D0C6]'
            }`}
          >
            Demo #{idx + 1}
          </button>
        ))}
      </div>

      {/* Realistic Mobile Device Mockup */}
      <div className="rounded-[2rem] p-2.5 sm:p-3 bg-gray-900 shadow-2xl border-4 border-gray-800 text-left max-w-full">
        {/* Smartphone Screen Canvas */}
        <div className="rounded-[1.75rem] sm:rounded-[2rem] bg-[#EFEAE2] overflow-hidden flex flex-col h-[min(68vh,480px)] sm:h-[520px] relative border border-gray-800">
          {/* WhatsApp Chat Header Bar */}
          <div className="bg-[#075E54] text-white px-3 sm:px-4 py-3 flex items-center justify-between gap-2 shadow-xs z-10 shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-bold tracking-tight truncate">ComplianceEasily</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-400 text-blue-950 flex items-center justify-center text-[9px] font-black shrink-0">
                    ✓
                  </span>
                </div>
                <div className="text-[10px] text-blue-100/90 font-medium truncate">
                  Official Statutory Radar Bot &bull; Verified
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-blue-100 shrink-0">
              <PhoneCall className="w-4 h-4 opacity-70" />
              <MoreVertical className="w-4 h-4 opacity-70" />
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp Wallpaper Pattern */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Timestamp Pill */}
            <div className="flex justify-center">
              <span className="bg-white/80 backdrop-blur-xs text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
                TODAY, 10:32 AM
              </span>
            </div>

            {/* Active Message Bubble */}
            <div className="max-w-[92%] bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-gray-200/60 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="text-[10px] font-mono text-blue-700 font-bold mb-1 flex items-center justify-between border-b border-gray-100 pb-1">
                <span>ComplianceEasily Radar</span>
                <span className="text-gray-400 text-[9px]">10:32 AM</span>
              </div>

              {messages[activeMessageIndex].bubble}

              <div className="flex justify-end items-center space-x-1 mt-2 text-[10px] text-gray-400">
                <span>10:32 AM</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            {/* Simulated Incoming Prompt */}
            <div className="flex justify-end">
              <div className="max-w-[75%] bg-[#E1FFC7] rounded-2xl rounded-tr-xs p-2.5 text-xs text-gray-900 shadow-2xs">
                <span>Acknowledged! Reviewing with my accountant now.</span>
                <div className="flex justify-end items-center space-x-1 text-[9px] text-gray-500 mt-0.5">
                  <span>10:33 AM</span>
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Fake WhatsApp Input Bar */}
          <div className="bg-[#F0F2F5] p-2.5 flex items-center space-x-2 border-t border-gray-200/80 shrink-0">
            <div className="flex-1 bg-white rounded-full px-3.5 py-2 text-xs text-gray-400 border border-gray-200 shadow-2xs">
              Reply &apos;YES&apos; or upload registers...
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Send className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtext under WhatsApp Demo */}
      <p className="text-xs text-gray-500 font-medium text-center mt-3">
        &ldquo;Not just calendar reminders. ComplianceEasily reacts when your business changes.&rdquo;
      </p>
    </div>
  );
}
