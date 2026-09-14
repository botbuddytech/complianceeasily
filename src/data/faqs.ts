import { FAQItem } from '../types';

export const FAQS_DATA: FAQItem[] = [
  {
    question: 'What is ComplianceEasily?',
    answer:
      'ComplianceEasily is a technology-enabled business compliance platform for India. It analyzes your business structure, industry, location, turnover, and workforce to build a tailored compliance roadmap. It alerts you to upcoming statutory deadlines on WhatsApp for free, and connects you with AI workflow tools alongside qualified Chartered Accountants, Company Secretaries, Advocates, and compliance specialists to complete required filings safely.',
    category: 'General',
  },
  {
    question: 'Is the WhatsApp compliance reminder really free?',
    answer:
      'Yes, 100% free forever for one business entity. We believe every Indian business owner deserves clarity on their statutory deadlines without having to buy expensive software. Basic due-date reminders, licence expiry notifications, and compliance alerts are completely free. You only pay if you upgrade to automated document prep tools or choose to hire our professional team to handle filings.',
    category: 'Pricing',
  },
  {
    question: 'How does ComplianceEasily know which compliances apply to me?',
    answer:
      'During your 2-minute onboarding, you tell us your entity type (e.g. Private Limited, LLP, Proprietorship), location(s), turnover band, employee count, and industry activity. Our compliance engine cross-references these parameters against Central, State, municipal, and industry-specific regulations to establish your customized Business Compliance Passport.',
    category: 'Product',
  },
  {
    question: 'Does every listed compliance apply to my business?',
    answer:
      'No. Many statutory compliances depend on specific legal thresholds—such as whether you employ 10 or 20 workers, cross ₹20 Lakhs or ₹40 Lakhs turnover, manufacture physical goods, or operate across multiple States. ComplianceEasily always categorizes items as "Potential compliances" or "May apply" until our professionals perform a factual applicability verification.',
    category: 'Legal & Applicability',
  },
  {
    question: 'Can ComplianceEasily file my compliances?',
    answer:
      'Yes. On our Pro and Managed plans, you can choose to have ComplianceEasily handle preparation and execution. AI agents assist with document extraction and preliminary reconciliations, while qualified Chartered Accountants, Company Secretaries, Advocates, or certified compliance professionals review the paperwork, verify calculations, and execute the statutory filing or submission on government portals.',
    category: 'Services',
  },
  {
    question: 'Are filings completely automated by AI?',
    answer:
      'No, and they should not be. Regulatory filings in India require legal certifications, digital signatures (DSC), Aadhaar OTP authentications, and professional judgment. AI does the busywork—document classification, reconciliation, first-level error checks, and workflow reminders. Certified professionals (CAs, CSs, and Advocates) perform review, certification, and portal submissions wherever statutory or regulatory oversight is required.',
    category: 'AI & Workflow',
  },
  {
    question: 'What is the Compliance Protection Guarantee?',
    answer:
      'The Compliance Protection Guarantee is our service commitment for eligible managed compliances. If an eligible statutory task is explicitly entrusted to ComplianceEasily, and you provided all required documents, approvals, and information before our published cut-off deadline, but ComplianceEasily fails to file it on time, we reimburse the resulting eligible statutory late fee or penalty—up to the applicable plan limit.',
    category: 'Protection',
  },
  {
    question: 'Is Compliance Protection insurance?',
    answer:
      'No. Compliance Protection is strictly a contractual service performance guarantee, not an insurance policy or underwritten financial product. We do not provide insurance, nor do we represent ourselves as an insurer. It represents our commercial confidence in our workflow discipline and accountability.',
    category: 'Protection',
  },
  {
    question: 'What happens if I do not provide documents on time?',
    answer:
      'To guarantee on-time filing, every compliance workflow has a clear cut-off date (e.g., uploading sales registers at least 3 business days before the GSTR-3B due date). If documents, clarifications, OTPs, or DSC approvals are provided after the cut-off, our team still works diligently to complete the filing as quickly as possible, but the Compliance Protection Guarantee does not apply to client-caused delays.',
    category: 'Protection',
  },
  {
    question: 'Does the guarantee cover underlying tax demands or assessments?',
    answer:
      'No. The Compliance Protection Guarantee covers eligible direct late fees or late filing penalties resulting solely from our procedural delay in filing an entrusted task. It strictly excludes underlying tax liabilities, interest on your actual tax dues, disputed assessments, penalties resulting from incorrect client data, or changes in statutory law.',
    category: 'Protection',
  },
  {
    question: 'Does ComplianceEasily support State-level compliance?',
    answer:
      'Yes. India is not a single uniform jurisdiction. A commercial office in Kolkata faces different Shops & Establishment, Professional Tax, and municipal trade rules compared to an office in Mumbai or Bengaluru. ComplianceEasily includes State and municipal compliance layers and is actively expanding dedicated State packs across the country.',
    category: 'Coverage',
  },
  {
    question: 'Can I manage more than one business entity?',
    answer:
      'Yes. While our Free tier includes one business entity forever, our Pro and Managed plans allow you to monitor and manage multiple companies, LLPs, or group subsidiaries within a unified dashboard, making it ideal for founders running serial ventures or holding companies.',
    category: 'Product',
  },
  {
    question: 'Can my own CA, CS or lawyer use ComplianceEasily?',
    answer:
      'Absolutely! We built ComplianceEasily to give professionals better technology, not to replace them. Your existing CA or CS can join as an authorized collaborator on your account to view documents, download AI reconciliations, track deadlines, and certify forms with far less administrative chasing.',
    category: 'Professionals',
  },
  {
    question: 'Do government fees form part of the displayed price?',
    answer:
      'No. We maintain strict price transparency. Professional service fees and statutory government fees (challans, stamp duties, MCA portal fees, municipal charges) are always separated. Government statutory fees are collected and paid directly at actuals with authentic government challan receipts provided for every rupee.',
    category: 'Pricing',
  },
  {
    question: 'Do you support statutory and tax audits?',
    answer:
      'Yes. Independent statutory audits under the Companies Act and tax audits under Section 44AB are coordinated through practicing independent Chartered Accountants. ComplianceEasily prepares the underlying audit dossiers, ledger reconciliations, and schedules, saving substantial time for both the business and the certifying auditor.',
    category: 'Audit',
  },
  {
    question: 'Do you maintain professional books of account?',
    answer:
      'Yes. ComplianceEasily prepares monthly books to the accounting standard that applies to your entity — ICAI Accounting Standards (AS), Ind AS, Schedule III formats, ICDS for tax computation, and GST books of account under Section 35. A practising Chartered Accountant reviews and verifies each close. You will see a CA Verified or AS / Ind AS Aligned badge on that work.',
    category: 'Accounting',
  },
  {
    question: 'Can you fetch data from my bank accounts and emails automatically?',
    answer:
      'Yes. With your consent we pull bank and UPI statements through Account Aggregator or uploaded net-banking statements, and pick invoices from Gmail or Outlook. WhatsApp bills can land in the same month-end pack. Nothing is posted as final until a CA reviews exceptions and certifies the books.',
    category: 'Accounting',
  },
  {
    question: 'Do you integrate with Tally, Zoho Books or QuickBooks?',
    answer:
      'Yes. We sync masters and vouchers from Tally Prime, Zoho Books, QuickBooks, Busy, Marg, SAP Business One and Excel. You keep the software your team already uses. We map those ledgers to AS / Ind AS and GST registers, then a practising CA signs off the close.',
    category: 'Accounting',
  },
  {
    question: 'Can I talk to an expert in one phone call?',
    answer:
      'Yes. Book a 15-minute slot with a practising CA, CS or Advocate. They can already see your bank feeds, email invoices and Tally or Zoho ledgers, so the call is about judgment — not collecting files. Use Talk to an expert on the homepage or in the Professional Accounting section.',
    category: 'Professionals',
  },
  {
    question: 'Who performs professional or certified work?',
    answer:
      'All services requiring attestation, certification, statutory representation, tax audit reports, or legal counsel are handled exclusively by registered, qualified professionals—including practicing Chartered Accountants (ICAI members), practicing Company Secretaries (ICSI members), and Advocates enrolled with State Bar Councils.',
    category: 'Professionals',
  },
];
