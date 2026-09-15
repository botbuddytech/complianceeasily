export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  effectiveDate: string;
  version: string;
  sections: LegalSection[];
};

export const LEGAL_NAV = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/refund-policy', label: 'Refund Policy' },
  { href: '/confidentiality', label: 'Confidentiality Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/protection-guarantee', label: 'Protection Guarantee' },
] as const;

export const TERMS_DOCUMENT: LegalDocument = {
  slug: 'terms',
  title: 'Terms & Conditions',
  shortTitle: 'Terms',
  eyebrow: 'Legal · Platform terms',
  summary:
    'These Terms govern your access to and use of ComplianceEasily — a technology workflow and coordination platform for Indian business compliance.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of terms',
      paragraphs: [
        'By accessing ComplianceEasily websites, WhatsApp workflows, dashboards, or related services (“Services”), you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, do not use the Services.',
        'If you use the Services on behalf of an entity, you represent that you are authorised to bind that entity.',
      ],
    },
    {
      id: 'nature',
      title: '2. Nature of the platform',
      paragraphs: [
        'ComplianceEasily is a technology-enabled compliance coordination platform. It provides statutory calendars, reminders, document pipelines, bookkeeping tools, and connections to independent practising professionals.',
        'ComplianceEasily does not practise law, does not operate as a chartered accountancy firm, and does not replace ICAI / ICSI / Bar Council regulated services. Certifications, audits, opinions, DSC filings and representations are performed by independent professionals in their own professional capacity.',
      ],
    },
    {
      id: 'accounts',
      title: '3. Accounts & eligibility',
      paragraphs: [
        'You must provide accurate registration details and keep credentials confidential. You are responsible for activity under your account.',
        'You must be at least 18 years of age and competent to contract under Indian law.',
      ],
      bullets: [
        'One free entity reminder tier may be offered subject to fair-use limits.',
        'Paid plans (Pro / Managed) are billed as disclosed at checkout.',
        'We may suspend accounts for fraud, abuse, or unpaid dues.',
      ],
    },
    {
      id: 'client-duties',
      title: '4. Your responsibilities',
      paragraphs: [
        'You remain the principal for all statutory obligations of your business. You must provide complete, accurate, and timely information, documents, DSC / OTP access, and tax funds.',
      ],
      bullets: [
        'Upload registers, invoices and bank statements before published cut-offs.',
        'Respond promptly to professional queries during filing windows.',
        'Ensure bank balances for challans and tax remittances.',
        'Verify applicability of laws with a qualified practitioner where needed.',
      ],
    },
    {
      id: 'fees',
      title: '5. Fees, government challans & taxes',
      paragraphs: [
        'Platform and professional fees are disclosed in-product. Government fees, taxes, cesses and challans are pass-through amounts payable to the relevant authority and are not marked up by ComplianceEasily.',
        'Unless stated otherwise, prices are in Indian Rupees and may attract GST.',
      ],
    },
    {
      id: 'ip',
      title: '6. Intellectual property',
      paragraphs: [
        'The ComplianceEasily name, interface, content, software and trademarks are owned by us or our licensors. You receive a limited, non-exclusive, non-transferable licence to use the Services for your internal business compliance.',
        'You retain ownership of your business data. You grant us a licence to process that data solely to provide the Services.',
      ],
    },
    {
      id: 'acceptable-use',
      title: '7. Acceptable use',
      bullets: [
        'No uploading of forged, fraudulent or knowingly false documents.',
        'No reverse engineering, scraping, or interfering with platform security.',
        'No use of the Services for unlawful activity or to mislead regulators.',
        'No resale of free-tier access as a white-label service without written consent.',
      ],
    },
    {
      id: 'liability',
      title: '8. Limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by law, ComplianceEasily is not liable for indirect, incidental, special or consequential damages, or for principal tax, interest, or penalties arising from incomplete client data, portal downtime, or third-party professional judgment.',
        'Where a Managed plan includes the Compliance Protection Guarantee, reimbursement is governed exclusively by the Protection Guarantee Scheme terms.',
      ],
    },
    {
      id: 'termination',
      title: '9. Suspension & termination',
      paragraphs: [
        'You may stop using the Services at any time. We may suspend or terminate access for breach of these Terms, non-payment, or legal requirement. Provisions that by nature should survive (IP, confidentiality, liability, indemnity) will survive termination.',
      ],
    },
    {
      id: 'law',
      title: '10. Governing law & disputes',
      paragraphs: [
        'These Terms are governed by the laws of India. Courts at Kolkata, West Bengal shall have exclusive jurisdiction, subject to mandatory consumer protections where applicable.',
        'Before litigation, parties shall attempt good-faith resolution via our support desk at hello@complianceeasily.com.',
      ],
    },
    {
      id: 'changes',
      title: '11. Changes to these terms',
      paragraphs: [
        'We may update these Terms periodically. Material changes will be indicated by updating the effective date and version on this page. Continued use after changes constitutes acceptance.',
      ],
    },
  ],
};

export const PRIVACY_DOCUMENT: LegalDocument = {
  slug: 'privacy',
  title: 'Privacy Policy',
  shortTitle: 'Privacy',
  eyebrow: 'Legal · Data protection',
  summary:
    'How ComplianceEasily collects, uses, stores and shares personal and business information when you use our platform, WhatsApp workflows and professional network.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'controller',
      title: '1. Who we are',
      paragraphs: [
        'ComplianceEasily (“we”, “us”) operates complianceeasily.com and related apps. For questions about this policy, contact hello@complianceeasily.com.',
        'We process data to deliver statutory reminders, passports, bookkeeping tools and coordination with independent professionals you engage through the platform.',
      ],
    },
    {
      id: 'collect',
      title: '2. Information we collect',
      bullets: [
        'Identity & contact: name, email, phone / WhatsApp number, business designation.',
        'Business profile: entity type, GSTIN / CIN where provided, industry, turnover band, headcount, state of operations.',
        'Documents & books: invoices, registers, bank statements, ledgers and filings you upload or sync.',
        'Usage data: device, browser, IP (approximate), log events, and product interactions.',
        'Communications: support tickets, WhatsApp message metadata required to deliver alerts.',
      ],
    },
    {
      id: 'use',
      title: '3. How we use information',
      bullets: [
        'Provide and improve the Services (calendars, reminders, passports, filings workflows).',
        'Route documents to assigned practising professionals for review and filing.',
        'Process payments, invoices and guarantee claims.',
        'Detect fraud, secure accounts, and comply with law.',
        'Send service messages; marketing only with consent or as permitted by law.',
      ],
    },
    {
      id: 'lawful',
      title: '4. Legal bases (where applicable)',
      paragraphs: [
        'We process data for performance of a contract, legitimate interests in operating a secure compliance platform, consent where required (e.g., certain marketing), and legal obligations.',
      ],
    },
    {
      id: 'sharing',
      title: '5. Sharing & processors',
      paragraphs: [
        'We do not sell personal data. We share data only as needed with:',
      ],
      bullets: [
        'Independent CAs, CSs, Advocates and specialists you engage for filings.',
        'Infrastructure, messaging, payment and analytics providers under contract.',
        'Authorities when required by law or to protect rights and safety.',
        'Affiliates in the Easily ecosystem where you opt into integrated products.',
      ],
    },
    {
      id: 'retention',
      title: '6. Retention',
      paragraphs: [
        'We retain account, filing and document records for as long as your account is active and thereafter as needed for audits, disputes, tax and legal retention (typically up to 8 years for statutory records unless a longer period is required).',
      ],
    },
    {
      id: 'security',
      title: '7. Security',
      paragraphs: [
        'We use administrative, technical and organisational measures appropriate to the sensitivity of compliance data, including access controls and encrypted transit. No method of transmission is 100% secure; please protect your credentials.',
      ],
    },
    {
      id: 'rights',
      title: '8. Your choices & rights',
      paragraphs: [
        'Subject to Indian law, you may request access, correction, or deletion of personal data, or withdraw consent where processing is consent-based. Contact hello@complianceeasily.com. We may need to retain certain records for legal compliance.',
      ],
    },
    {
      id: 'cookies',
      title: '9. Cookies & similar tech',
      paragraphs: [
        'We use essential cookies for authentication and security, and optional analytics to improve the product. You can control non-essential cookies via browser settings where available.',
      ],
    },
    {
      id: 'children',
      title: '10. Children',
      paragraphs: [
        'The Services are intended for business users and are not directed to children under 18.',
      ],
    },
    {
      id: 'updates',
      title: '11. Updates',
      paragraphs: [
        'We may update this Privacy Policy from time to time. The effective date and version on this page will change when we do.',
      ],
    },
  ],
};

export const REFUND_DOCUMENT: LegalDocument = {
  slug: 'refund-policy',
  title: 'Refund Policy',
  shortTitle: 'Refunds',
  eyebrow: 'Legal · Billing',
  summary:
    'When ComplianceEasily subscription fees, professional service fees, and government pass-through amounts are refundable — and when they are not.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'scope',
      title: '1. Scope',
      paragraphs: [
        'This Refund Policy applies to fees paid to ComplianceEasily for platform subscriptions and coordination services. Government challans, taxes and third-party professional retainers may be subject to separate rules.',
      ],
    },
    {
      id: 'subscriptions',
      title: '2. Subscription (Pro / Managed) fees',
      bullets: [
        'Monthly plans: cancel anytime; access continues until the end of the paid period. No partial-month refunds unless required by law.',
        'Annual plans: within 7 days of first purchase, unused annual fees may be refunded minus any professional work already delivered.',
        'After 7 days, annual fees are non-refundable except for proven duplicate charges or billing errors.',
        'Free tier has no fees and therefore no refunds.',
      ],
    },
    {
      id: 'professional',
      title: '3. Professional & filing service fees',
      paragraphs: [
        'Fees for CA / CS / Advocate review and filing are earned as work progresses.',
      ],
      bullets: [
        'If work has not started, you may cancel for a full refund of that service line item.',
        'If work has started (document review, draft returns, reconciliations), fees are proportionate to work completed and non-refundable for completed stages.',
        'Once a return is filed or a certificate is issued, related professional fees are non-refundable.',
      ],
    },
    {
      id: 'government',
      title: '4. Government fees & challans',
      paragraphs: [
        'Amounts paid to government departments (GST, MCA, income tax, labour, licences) are pass-through and not refundable by ComplianceEasily. Any refund must be sought from the relevant authority under their rules.',
      ],
    },
    {
      id: 'guarantee',
      title: '5. Protection Guarantee reimbursements',
      paragraphs: [
        'Eligible late-fee reimbursements under the Compliance Protection Guarantee Scheme are not “refunds” of subscription fees; they are performance reimbursements processed under that scheme’s claim procedure.',
      ],
    },
    {
      id: 'process',
      title: '6. How to request a refund',
      paragraphs: [
        'Email hello@complianceeasily.com with your account email, invoice ID, and reason. Approved refunds are credited to the original payment method within 7–10 business days after approval.',
      ],
    },
    {
      id: 'chargebacks',
      title: '7. Chargebacks',
      paragraphs: [
        'Please contact us before raising a chargeback so we can resolve billing issues. Unfounded chargebacks may result in suspension of Services.',
      ],
    },
  ],
};

export const CONFIDENTIALITY_DOCUMENT: LegalDocument = {
  slug: 'confidentiality',
  title: 'Confidentiality Policy',
  shortTitle: 'Confidentiality',
  eyebrow: 'Legal · Information security',
  summary:
    'How ComplianceEasily and networked professionals treat confidential business, financial and statutory information entrusted to the platform.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'definition',
      title: '1. Confidential information',
      paragraphs: [
        '“Confidential Information” includes business financials, GST and tax data, employee registers, bank statements, contracts, board documents, credentials, and any non-public information shared via the Services.',
      ],
    },
    {
      id: 'obligations',
      title: '2. Our obligations',
      bullets: [
        'Use Confidential Information only to provide the Services.',
        'Limit access to personnel and professionals with a need to know.',
        'Require contractors and networked professionals to maintain confidentiality.',
        'Not disclose to third parties except as described in the Privacy Policy or with your instruction.',
      ],
    },
    {
      id: 'professionals',
      title: '3. Independent professionals',
      paragraphs: [
        'Practising CAs, CSs and Advocates engaged through ComplianceEasily remain bound by their professional codes (including ICAI / ICSI / Bar Council confidentiality duties) in addition to platform terms.',
      ],
    },
    {
      id: 'exceptions',
      title: '4. Exceptions',
      paragraphs: [
        'Confidentiality does not apply to information that is public (other than by breach), independently developed, rightfully received from a third party without duty, or required to be disclosed by law, regulation or court order (with notice where legally permitted).',
      ],
    },
    {
      id: 'duration',
      title: '5. Duration',
      paragraphs: [
        'Confidentiality obligations continue during your use of the Services and for five (5) years thereafter, or longer where professional or statutory secrecy rules require.',
      ],
    },
    {
      id: 'breach',
      title: '6. Suspected breach',
      paragraphs: [
        'Report suspected unauthorised access or disclosure immediately to hello@complianceeasily.com. We will investigate and take appropriate remedial steps.',
      ],
    },
  ],
};

export const DISCLAIMER_DOCUMENT: LegalDocument = {
  slug: 'disclaimer',
  title: 'Disclaimer Policy',
  shortTitle: 'Disclaimer',
  eyebrow: 'Legal · Important notices',
  summary:
    'Important limitations on advice, applicability of laws, AI outputs, and third-party portals when using ComplianceEasily.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'no-advice',
      title: '1. Not legal, tax or audit advice',
      paragraphs: [
        'Content on ComplianceEasily — including calendars, checklists, risk estimates, AI suggestions and educational material — is for general informational and workflow purposes only. It is not legal advice, tax advice, audit opinion or a substitute for professional judgment.',
      ],
    },
    {
      id: 'applicability',
      title: '2. Applicability of compliances',
      paragraphs: [
        'Whether a statute, return or licence applies depends on facts such as entity type, turnover, headcount, industry, and State. Maps and catalogues on the platform are indicative. Always confirm with a qualified practitioner before acting.',
      ],
    },
    {
      id: 'ai',
      title: '3. AI-generated outputs',
      paragraphs: [
        'AI agents may draft reconciliations, classifications and checklists. Outputs can contain errors. Final filings requiring certification must be reviewed and signed by a qualified professional where required by law.',
      ],
    },
    {
      id: 'portals',
      title: '4. Government portals & third parties',
      paragraphs: [
        'GSTN, MCA, income-tax, labour and other portals are operated by government or third parties. We are not responsible for portal downtime, rule changes, or authentication failures outside our control.',
      ],
    },
    {
      id: 'professionals',
      title: '5. Independent professionals',
      paragraphs: [
        'Network professionals are independent. Their opinions and filings are their professional responsibility. ComplianceEasily coordinates workflow; it does not employ every practitioner as an employee of a firm practising under a single ICAI / ICSI registration unless expressly stated.',
      ],
    },
    {
      id: 'no-warranty',
      title: '6. No warranty of outcomes',
      paragraphs: [
        'Except for obligations expressly stated in a paid plan or the Protection Guarantee Scheme, Services are provided on an “as available” basis without warranties of uninterrupted operation or freedom from error.',
      ],
    },
    {
      id: 'reliance',
      title: '7. Your reliance',
      paragraphs: [
        'You remain solely responsible for statutory compliance of your entity. Use of the Services does not create a fiduciary relationship beyond the contractual terms you accept.',
      ],
    },
  ],
};

export const PROTECTION_GUARANTEE_DOCUMENT: LegalDocument = {
  slug: 'protection-guarantee',
  title: 'Compliance Protection Guarantee Scheme',
  shortTitle: 'Protection Guarantee',
  eyebrow: 'Legal · Service performance warranty',
  summary:
    'Contractual service performance commitment on eligible Managed plans: if we miss a covered filing deadline due to our operational failure, we reimburse eligible statutory late fees — up to plan limits. This is not an insurance policy.',
  effectiveDate: '1 April 2026',
  version: 'v2.4',
  sections: [
    {
      id: 'not-insurance',
      title: '1. Not an insurance product',
      paragraphs: [
        'The Compliance Protection Guarantee is a contractual service performance warranty offered by ComplianceEasily on eligible Managed / Protected plans. We are not an insurance company, and this scheme is not an underwritten insurance policy regulated as such.',
      ],
    },
    {
      id: 'how',
      title: '2. How the guarantee works',
      paragraphs: [
        'When an eligible compliance task is assigned to ComplianceEasily under an active Managed plan, we take responsibility to complete or file that task before the statutory deadline, subject to your prerequisites.',
        'If ComplianceEasily fails to submit an eligible filing by the statutory deadline solely due to our internal operational failure or delay, we will reimburse the direct eligible statutory late fee or penalty levied by the department, up to the plan limit (typically up to ₹50,000 per entity per year on standard Managed plans, or as stated in your order form).',
      ],
    },
    {
      id: 'eligibility',
      title: '3. Eligible filings',
      paragraphs: [
        'Coverage applies only to filings expressly marked as Protection-eligible in your plan catalogue (commonly recurring GST, TDS, MCA annual filings and similar monitored obligations). Ad-hoc litigation, notices and non-catalogued work are excluded unless added in writing.',
      ],
    },
    {
      id: 'prerequisites',
      title: '4. Client prerequisites (cut-off rules)',
      paragraphs: ['To qualify, you must, before published cut-offs:'],
      bullets: [
        'Upload complete, uncorrupted and accurate registers, invoices and bank statements at least 3 business days before the statutory due date.',
        'Provide DSC or Aadhaar OTP authentication within 4 business hours of request during the filing window.',
        'Ensure sufficient cleared balances or challan advances for statutory tax liabilities.',
        'Promptly answer factual queries raised by the reviewing CA, CS or specialist.',
      ],
    },
    {
      id: 'exclusions',
      title: '5. Specific exclusions',
      bullets: [
        'Underlying principal taxes, dues, cesses or employer contributions.',
        'Interest on delayed principal tax payments.',
        'Penalties from fraudulent, inaccurate or incomplete client books or fake invoices.',
        'Delays from prolonged government portal downtime certified by official notices.',
        'Retrospective law changes or judicial pronouncements.',
        'Filings outside the eligible catalogue or performed after plan lapse.',
      ],
    },
    {
      id: 'claims',
      title: '6. Claim & reimbursement process',
      paragraphs: [
        'In the rare event of a missed deadline caused solely by ComplianceEasily, our operations desk flags the incident. After departmental confirmation of the late fee, the eligible amount is paid or credited within 7 business days, subject to annual caps and documentation.',
        'You may also open a claim from your dashboard Protection page or by emailing hello@complianceeasily.com with the challan and entity details.',
      ],
    },
    {
      id: 'caps',
      title: '7. Caps & stacking',
      paragraphs: [
        'Annual reimbursement caps apply per entity as stated in your plan. Multiple incidents in a year share the same cap. The scheme does not increase because of affiliate products unless expressly bundled.',
      ],
    },
    {
      id: 'changes',
      title: '8. Changes to the scheme',
      paragraphs: [
        'We may update this scheme for new subscription periods. Changes will not reduce coverage already earned for an active prepaid term except as required by law.',
      ],
    },
  ],
};

export const ALL_LEGAL_DOCUMENTS: LegalDocument[] = [
  TERMS_DOCUMENT,
  PRIVACY_DOCUMENT,
  REFUND_DOCUMENT,
  CONFIDENTIALITY_DOCUMENT,
  DISCLAIMER_DOCUMENT,
  PROTECTION_GUARANTEE_DOCUMENT,
];
