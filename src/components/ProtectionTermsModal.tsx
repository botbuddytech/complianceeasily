import { X, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from '@/components/nav/NextNav';

interface ProtectionTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProtectionTermsModal({ isOpen, onClose }: ProtectionTermsModalProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0 bg-[#0E1217]/75 backdrop-blur-xs"
            initial={{ opacity: prefersReduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="bg-[#F4F2EE] rounded-t-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl border border-[#D5D0C6] text-left relative z-10"
            initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full text-[#6B7580] hover:text-[#0E1217] hover:bg-[#EBE8E2] transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-3 sm:space-x-3.5 pb-4 border-b border-[#D5D0C6] pr-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0E1217] tracking-tight leading-[1.15]">
                  Compliance Protection Guarantee Terms
                </h3>
                <p className="text-[11px] sm:text-xs text-[#6B7580] mt-0.5 font-mono leading-snug">
                  Contractual Service Performance Commitment &bull; Applicable on Managed Plans
                </p>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs text-[#5C6570] max-h-[min(58vh,28rem)] sm:max-h-[65vh] overflow-y-auto pr-1 sm:pr-2 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#EBE8E2] border border-[#D5D0C6] text-[#B89E6B] flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-[#B89E6B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0E1217]">Not an Insurance Policy:</strong> The Compliance Protection Guarantee is strictly
                  a contractual service performance warranty provided by ComplianceEasily as part of our Managed
                  and Protected service tier. We are not an insurance company, nor is this an underwritten insurance product.
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0E1217] font-mono uppercase">1. How The Guarantee Works</h4>
                <p>
                  When an eligible compliance task is assigned to ComplianceEasily under an active Managed
                  Plan, ComplianceEasily assumes the responsibility to file or complete that task before the
                  statutory deadline, subject to the client fulfilling prerequisite responsibilities.
                </p>
                <p>
                  If ComplianceEasily fails to submit the eligible filing by the statutory deadline solely
                  due to an internal operational failure or delay on our part, ComplianceEasily will reimburse
                  the direct eligible statutory late fee or penalty levied by the government department, up
                  to the plan limit (up to ₹50,000 per entity per year on standard Managed plans).
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0E1217] font-mono uppercase">2. Client Prerequisites (Cut-Off Rules)</h4>
                <p>To qualify for the guarantee, the client must fulfill the following prior to published cut-offs:</p>
                <ul className="space-y-1 list-disc list-inside text-[#5C6570] pl-1">
                  <li>Upload complete, uncorrupted, and accurate registers, invoices, and bank statements at least 3 business days before the statutory due date.</li>
                  <li>Provide digital signatures (DSC) or Aadhaar OTP authentication within 4 business hours of request during the filing window.</li>
                  <li>Ensure sufficient cleared bank balances or tax challan advance deposits for all statutory tax liabilities.</li>
                  <li>Promptly answer any factual queries raised by the reviewing CA or CS.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0E1217] font-mono uppercase">3. Specific Exclusions</h4>
                <p>The guarantee strictly excludes and does not cover:</p>
                <ul className="space-y-1 list-disc list-inside text-[#5C6570] pl-1">
                  <li>Underlying principal taxes, dues, cesses, or statutory employer contributions.</li>
                  <li>Interest accrued on delayed principal tax payments.</li>
                  <li>Penalties resulting from fraudulent, inaccurate, or incomplete client books or fake invoices.</li>
                  <li>Delays caused by prolonged government portal downtime (e.g., GSTN, MCA V3, TRACES system outages certified by government notices).</li>
                  <li>Retrospective amendments to statutory law or judicial pronouncements.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0E1217] font-mono uppercase">4. Claim &amp; Reimbursement Process</h4>
                <p>
                  In the rare event of a missed deadline caused solely by ComplianceEasily, our operations
                  desk flags the incident automatically. The official statutory late fee challan is paid or
                  credited to the client within 7 business days following departmental confirmation.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D5D0C6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Link
                to="/protection-guarantee"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B89E6B] hover:underline"
              >
                Read full Protection Guarantee Scheme
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-6 py-2.5 font-bold text-xs uppercase tracking-wider font-mono"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
