export type FilingFrequency = 'Monthly' | 'Quarterly' | 'Annual' | string;

export type PackagePlanId = 'free' | 'pro' | 'managed';

export interface PackageFiling {
  label: string;
  frequency: FilingFrequency;
}

export interface PackageDepartment {
  id: string;
  name: string;
  iconName: string;
  filings: PackageFiling[];
}

export interface EntityTypeOption {
  id: string;
  label: string;
  /** Compact label for narrow screens */
  shortLabel: string;
  description: string;
  defaultDepartmentIds: string[];
  weight: number;
}

export interface TurnoverBand {
  id: string;
  label: string;
  shortLabel: string;
  weight: number;
}

export const ENTITY_TYPES: EntityTypeOption[] = [
  {
    id: 'proprietorship',
    label: 'Sole Proprietorship',
    shortLabel: 'Proprietorship',
    description: 'Single-owner business with GST, IT and local licences as primary focus.',
    defaultDepartmentIds: ['gst', 'income-tax', 'state-local', 'licences'],
    weight: 1,
  },
  {
    id: 'partnership',
    label: 'Partnership Firm',
    shortLabel: 'Partnership',
    description: 'Partnership deed, ITR-5, GST and state labour where workforce applies.',
    defaultDepartmentIds: ['gst', 'income-tax', 'labour', 'state-local'],
    weight: 2,
  },
  {
    id: 'llp',
    label: 'Limited Liability Partnership (LLP)',
    shortLabel: 'LLP',
    description: 'MCA Form 8 & 11 plus GST, IT and books of account.',
    defaultDepartmentIds: ['mca', 'gst', 'income-tax', 'accounting'],
    weight: 3,
  },
  {
    id: 'private-limited',
    label: 'Private Limited Company',
    shortLabel: 'Pvt Ltd',
    description: 'Full MCA annual filings, GST, TDS, audit triggers and books.',
    defaultDepartmentIds: ['mca', 'gst', 'income-tax', 'labour', 'audit', 'accounting'],
    weight: 4,
  },
  {
    id: 'public-limited',
    label: 'Public Limited Company',
    shortLabel: 'Public Ltd',
    description: 'Heavier MCA / SEBI-adjacent disclosures, Ind AS books and statutory audit.',
    defaultDepartmentIds: ['mca', 'gst', 'income-tax', 'labour', 'audit', 'accounting'],
    weight: 5,
  },
  {
    id: 'ngo',
    label: 'NGO (Trust / Society / Section 8)',
    shortLabel: 'NGO',
    description: 'IT returns, FCRA where applicable, MCA for Section 8, and local registrations.',
    defaultDepartmentIds: ['income-tax', 'mca', 'state-local', 'accounting'],
    weight: 3,
  },
];

export const TURNOVER_BANDS: TurnoverBand[] = [
  { id: 'under-20l', label: 'Under ₹20 Lakhs', shortLabel: '< ₹20L', weight: 1 },
  { id: '20l-40l', label: '₹20 Lakhs - ₹40 Lakhs', shortLabel: '₹20–40L', weight: 2 },
  { id: '40l-1.5cr', label: '₹40L - ₹1.5 Cr', shortLabel: '₹40L–1.5Cr', weight: 3 },
  { id: '1.5cr-5cr', label: '₹1.5 Cr - ₹5 Cr', shortLabel: '₹1.5–5Cr', weight: 4 },
  { id: '5cr-50cr', label: '₹5 Cr - ₹50 Cr', shortLabel: '₹5–50Cr', weight: 5 },
  { id: 'above-50cr', label: 'Above ₹50 Cr', shortLabel: '> ₹50Cr', weight: 6 },
];

export const PACKAGE_DEPARTMENTS: PackageDepartment[] = [
  {
    id: 'mca',
    name: 'MCA / ROC',
    iconName: 'Building2',
    filings: [
      { label: 'AOC-4 Financial Statements', frequency: 'Annual' },
      { label: 'MGT-7 / MGT-7A Annual Return', frequency: 'Annual' },
      { label: 'DIR-3 KYC (per director)', frequency: 'Annual' },
      { label: 'DPT-3 Deposit Return', frequency: 'Annual' },
    ],
  },
  {
    id: 'gst',
    name: 'GST & Indirect Tax',
    iconName: 'Receipt',
    filings: [
      { label: 'GSTR-1 Outward Supplies', frequency: 'Monthly' },
      { label: 'GSTR-3B Tax Remittance', frequency: 'Monthly' },
      { label: 'GSTR-9 Annual Return', frequency: 'Annual' },
      { label: 'E-invoice / E-way bill monitoring', frequency: 'Continuous' },
    ],
  },
  {
    id: 'income-tax',
    name: 'Income Tax & TDS',
    iconName: 'Calculator',
    filings: [
      { label: 'Business / Corporate ITR', frequency: 'Annual' },
      { label: 'Advance Tax Installments', frequency: 'Quarterly' },
      { label: 'TDS Returns (24Q / 26Q)', frequency: 'Quarterly' },
      { label: 'Form 16 / 16A Issuance', frequency: 'Annual' },
    ],
  },
  {
    id: 'labour',
    name: 'Labour & Payroll',
    iconName: 'Users',
    filings: [
      { label: 'EPFO Monthly ECR', frequency: 'Monthly' },
      { label: 'ESIC Contribution Return', frequency: 'Monthly' },
      { label: 'Professional Tax Return', frequency: 'Monthly' },
      { label: 'Shops & Establishment Renewal', frequency: 'Annual' },
    ],
  },
  {
    id: 'licences',
    name: 'Business Licences',
    iconName: 'FileCheck2',
    filings: [
      { label: 'Trade Licence / COE', frequency: 'Annual' },
      { label: 'Udyam / MSME Update', frequency: 'Annual' },
      { label: 'Fire NOC Renewal', frequency: 'Annual' },
      { label: 'SPCB Consent to Operate', frequency: 'Conditional' },
    ],
  },
  {
    id: 'state-local',
    name: 'State & Local',
    iconName: 'MapPin',
    filings: [
      { label: 'State Shops & Establishment', frequency: 'State-dependent' },
      { label: 'Municipal Trade Licence', frequency: 'Annual' },
      { label: 'Labour Welfare Fund', frequency: 'Half-yearly' },
      { label: 'Local PT Enrolment', frequency: 'Annual' },
    ],
  },
  {
    id: 'food',
    name: 'Food / FSSAI',
    iconName: 'UtensilsCrossed',
    filings: [
      { label: 'FSSAI Licence / Registration', frequency: '1–5 Years' },
      { label: 'Annual Return Form D-1', frequency: 'Annual' },
      { label: 'FoSCoS Hygiene Schedule', frequency: 'Ongoing' },
    ],
  },
  {
    id: 'import-export',
    name: 'Import & Export',
    iconName: 'Ship',
    filings: [
      { label: 'IEC Annual Update', frequency: 'Annual' },
      { label: 'GST LUT Filing', frequency: 'Annual' },
      { label: 'RCMC / EPC Membership', frequency: 'Annual' },
    ],
  },
  {
    id: 'audit',
    name: 'Audit & Assurance',
    iconName: 'ShieldCheck',
    filings: [
      { label: 'Tax Audit (Section 44AB)', frequency: 'Annual' },
      { label: 'Statutory Audit Coordination', frequency: 'Annual' },
      { label: 'Form 3CD Workpapers', frequency: 'Annual' },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting & Books',
    iconName: 'BookOpen',
    filings: [
      { label: 'AS / Ind AS Monthly Close', frequency: 'Monthly' },
      { label: 'Bank & 2B Reconciliation', frequency: 'Monthly' },
      { label: 'Trial Balance / P&L Pack', frequency: 'Monthly' },
    ],
  },
];

function frequencyMultiplier(frequency: FilingFrequency): number {
  const normalized = frequency.toLowerCase();
  if (normalized.includes('month')) return 12;
  if (normalized.includes('quarter')) return 4;
  if (normalized.includes('half')) return 2;
  if (normalized.includes('annual') || normalized.includes('year')) return 1;
  // Continuous / conditional / ongoing — count as monitored obligations, not 12 filings
  return 1;
}

export function recommendPlanId(
  entityWeight: number,
  turnoverWeight: number,
  selectedCount: number
): PackagePlanId {
  const score = entityWeight * 2 + turnoverWeight * 2 + selectedCount;

  if (score <= 10) return 'free';
  if (score <= 18) return 'pro';
  return 'managed';
}

export function estimateAnnualFilings(selectedDepartmentIds: string[]): number {
  return PACKAGE_DEPARTMENTS.filter((dept) => selectedDepartmentIds.includes(dept.id)).reduce(
    (total, dept) =>
      total + dept.filings.reduce((sum, filing) => sum + frequencyMultiplier(filing.frequency), 0),
    0
  );
}

export function getDepartmentsByIds(ids: string[]): PackageDepartment[] {
  return PACKAGE_DEPARTMENTS.filter((dept) => ids.includes(dept.id));
}
