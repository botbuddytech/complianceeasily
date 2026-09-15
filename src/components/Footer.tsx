import { ExternalLink } from 'lucide-react';
import { Link } from '@/components/nav/NextNav';
import { BrandMark } from '@/components/BrandMark';

interface FooterProps {
  onOpenChecker?: () => void;
  onOpenProtectionModal?: () => void;
}

const SUITE_LINK =
  'glass-pill glass-pill-dark hover:!text-white hover:!border-[#B89E6B] transition-colors text-[11px] font-mono uppercase';

export function Footer(_props: FooterProps) {
  return (
    <footer className="bg-[#0E1217] text-[#A8B0BA] text-left border-t border-[#1E2630]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <BrandMark size="xs" />
              <span className="font-display text-lg font-semibold text-white tracking-tight">
                Compliance<span className="text-[#B89E6B]">Easily</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#12161B] text-[#B89E6B] border border-[#B89E6B]/40 rounded-full tracking-widest uppercase">
                IN
              </span>
            </div>

            <p className="text-xs text-[#A8B0BA] leading-relaxed max-w-sm">
              AI speed. Regulated professional accountability. Empowering Indian business owners with
              autonomous WhatsApp compliance monitoring, living Business Compliance Passports, and
              verified statutory filing networks.
            </p>

            <div className="pt-2">
              <div className="text-[10px] font-mono font-bold text-[#6B7580] uppercase tracking-widest mb-2">
                Part of the Easily Enterprise Platform:
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <a
                  href="https://www.contracteasily.com"
                  target="_blank"
                  rel="noreferrer"
                  className={`${SUITE_LINK} items-center`}
                >
                  ContractEasily
                  <ExternalLink className="w-3 h-3 text-[#6B7580]" />
                </a>
                <a
                  href="https://www.findcaseseasily.com"
                  target="_blank"
                  rel="noreferrer"
                  className={`${SUITE_LINK} items-center`}
                >
                  FindCasesEasily
                  <ExternalLink className="w-3 h-3 text-[#6B7580]" />
                </a>
                <span className="glass-pill glass-pill-dark !bg-[#1E2630] !border-[#B89E6B]/40 !text-[#E8E4DC] font-bold">
                  ComplianceEasily
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
              Compliances
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  GST Returns (GSTR-1 &amp; 3B)
                </a>
              </li>
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  MCA Annual Filings (AOC-4, MGT-7)
                </a>
              </li>
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  Income Tax &amp; TDS Returns
                </a>
              </li>
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  EPFO &amp; ESIC Labour Filings
                </a>
              </li>
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  FSSAI Food Safety Licences
                </a>
              </li>
              <li>
                <a href="#professional-accounting" className="hover:text-white transition-colors">
                  Professional Accounting &amp; Books
                </a>
              </li>
              <li>
                <a href="#services-catalogue" className="hover:text-white transition-colors">
                  State Trade Licence &amp; PTax
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
              Industries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Restaurants &amp; Cloud Kitchens
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Manufacturing Plants &amp; Factories
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Logistics &amp; Transporters
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  SaaS &amp; Technology Startups
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Ecommerce &amp; D2C Brands
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-white transition-colors">
                  Healthcare &amp; Diagnostics
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
              Platform &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#professional-accounting" className="hover:text-white transition-colors">
                  Talk to an expert in one call
                </a>
              </li>
              <li>
                <a href="#compliance-passport" className="hover:text-white transition-colors">
                  Business Compliance Passport
                </a>
              </li>
              <li>
                <a href="#whatsapp-radar" className="hover:text-white transition-colors">
                  WhatsApp Radar Protocol
                </a>
              </li>
              <li>
                <a href="#risk-explorer" className="hover:text-white transition-colors">
                  Penalty Impact Matrix
                </a>
              </li>
              <li>
                <Link
                  to="/protection-guarantee"
                  className="hover:text-white text-[#B89E6B] font-semibold transition-colors"
                >
                  Compliance Protection Guarantee
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/confidentiality" className="hover:text-white transition-colors">
                  Confidentiality Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <a href="#for-professionals" className="hover:text-white transition-colors">
                  Practitioner Network (CA, CS, Adv)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Knowledge Base &amp; FAQ
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1E2630] text-[11px] text-[#6B7580] leading-relaxed space-y-3 font-sans">
          <p>
            <strong className="text-[#A8B0BA] uppercase font-mono text-[10px] tracking-wider block mb-1">
              Statutory Regulatory Disclaimer:
            </strong>
            ComplianceEasily is a technology workflow and coordination platform that provides
            automated calendar alerts, document intake pipelines, and direct integration with
            independent certified professionals—including Chartered Accountants, Company Secretaries,
            and Advocates. ComplianceEasily does not practice law or act as a chartered accountancy
            firm. Regulated statutory certifications, audits, opinions, and representations are
            rendered directly by certified professionals in good standing with ICAI, ICSI, or the Bar
            Council of India.
          </p>
          <p>
            All compliances indexed on this platform represent potential statutory obligations
            determined by variables such as turnover, headcount, jurisdiction, and industry
            classification. Always confirm specific applicability with a qualified practitioner.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1E2630] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6B7580]">
          <div>
            &copy; {new Date().getFullYear()} ComplianceEasily. Architectural Compliance Operating
            System.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/about" className="hover:text-[#E4E0D8] transition-colors">
              About
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/contact" className="hover:text-[#E4E0D8] transition-colors">
              Contact
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/terms" className="hover:text-[#E4E0D8] transition-colors">
              Terms
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/privacy" className="hover:text-[#E4E0D8] transition-colors">
              Privacy
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/refund-policy" className="hover:text-[#E4E0D8] transition-colors">
              Refunds
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/disclaimer" className="hover:text-[#E4E0D8] transition-colors">
              Disclaimer
            </Link>
            <span className="hidden sm:inline">&bull;</span>
            <Link to="/protection-guarantee" className="hover:text-[#E4E0D8] transition-colors">
              Protection Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
