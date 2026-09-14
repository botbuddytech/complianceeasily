export type IntegrationCategory =
  | 'accounting'
  | 'bank'
  | 'portal'
  | 'email';

export type IntegrationStatus =
  | 'connected'
  | 'disconnected'
  | 'syncing'
  | 'action_required'
  | 'coming_soon';

export interface BooksIntegration {
  id: string;
  category: IntegrationCategory;
  name: string;
  shortName: string;
  description: string;
  /** Mock vendor / portal code */
  code: string;
  status: IntegrationStatus;
  lastSyncedAt?: string;
  detail?: string;
  /** External portal URL (demo link) */
  portalUrl?: string;
  entityScoped?: boolean;
}

/** Default catalogue — status overridden per entity where needed. */
export const BOOKS_INTEGRATIONS_CATALOGUE: BooksIntegration[] = [
  // Accounting
  {
    id: 'int-tally',
    category: 'accounting',
    name: 'TallyPrime / Tally ERP 9',
    shortName: 'Tally',
    description: 'Sync masters, vouchers, and ledgers via XML / ODBC bridge.',
    code: 'TALLY',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-zoho',
    category: 'accounting',
    name: 'Zoho Books',
    shortName: 'Zoho',
    description: 'Pull chart of accounts, invoices, and bills via API.',
    code: 'ZOHO',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-qb',
    category: 'accounting',
    name: 'QuickBooks Online',
    shortName: 'QuickBooks',
    description: 'Connect QBO company file for P&L and balance sheet sync.',
    code: 'QBO',
    status: 'coming_soon',
    entityScoped: true,
  },
  {
    id: 'int-excel',
    category: 'accounting',
    name: 'Excel / CSV ledgers',
    shortName: 'Excel',
    description: 'Upload trial balance or voucher export workbooks.',
    code: 'XLSX',
    status: 'disconnected',
    entityScoped: true,
  },
  // Banks
  {
    id: 'int-hdfc',
    category: 'bank',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    description: 'Account Aggregator / corporate netbanking feed.',
    code: 'HDFC',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-icici',
    category: 'bank',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    description: 'Current account statement sync.',
    code: 'ICICI',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-axis',
    category: 'bank',
    name: 'Axis Bank',
    shortName: 'Axis',
    description: 'CC/OD and current account feeds.',
    code: 'AXIS',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-sbi',
    category: 'bank',
    name: 'State Bank of India',
    shortName: 'SBI',
    description: 'Connect via Account Aggregator.',
    code: 'SBI',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-kotak',
    category: 'bank',
    name: 'Kotak Mahindra Bank',
    shortName: 'Kotak',
    description: 'Corporate banking feed.',
    code: 'KOTAK',
    status: 'disconnected',
    entityScoped: true,
  },
  // Email
  {
    id: 'int-gmail',
    category: 'email',
    name: 'Gmail invoices',
    shortName: 'Gmail',
    description: 'Fetch vendor invoices and GST bills from mailbox.',
    code: 'GMAIL',
    status: 'disconnected',
    entityScoped: true,
  },
  {
    id: 'int-outlook',
    category: 'email',
    name: 'Outlook / Microsoft 365',
    shortName: 'Outlook',
    description: 'Sync accounts@ mailbox for purchase bills.',
    code: 'OUTLOOK',
    status: 'disconnected',
    entityScoped: true,
  },
  // Government portals
  {
    id: 'int-gst',
    category: 'portal',
    name: 'GST portal (GSTN)',
    shortName: 'GST',
    description: 'Login for GSTR-1 / 3B filing, 2B, and cash & credit ledgers.',
    code: 'GSTN',
    status: 'disconnected',
    portalUrl: 'https://www.gst.gov.in/',
    entityScoped: true,
  },
  {
    id: 'int-it',
    category: 'portal',
    name: 'Income Tax e-Filing',
    shortName: 'Income Tax',
    description: 'e-Filing portal login for ITR, AIS, and Form 26AS.',
    code: 'ITDF',
    status: 'disconnected',
    portalUrl: 'https://www.incometax.gov.in/iec/foportal/',
    entityScoped: true,
  },
  {
    id: 'int-traces',
    category: 'portal',
    name: 'TRACES (TDS)',
    shortName: 'TDS / TRACES',
    description: 'Form 26Q / 24Q statements, challans, and Form 16/16A.',
    code: 'TRACES',
    status: 'disconnected',
    portalUrl: 'https://www.tdscpc.gov.in/',
    entityScoped: true,
  },
  {
    id: 'int-mca',
    category: 'portal',
    name: 'MCA21',
    shortName: 'MCA',
    description: 'Company filings — AOC-4, MGT-7, and DIN services.',
    code: 'MCA',
    status: 'disconnected',
    portalUrl: 'https://www.mca.gov.in/',
    entityScoped: true,
  },
  {
    id: 'int-epfo',
    category: 'portal',
    name: 'EPFO / Unified Portal',
    shortName: 'EPFO',
    description: 'ECR filing and PF remittance status.',
    code: 'EPFO',
    status: 'disconnected',
    portalUrl: 'https://unifiedportal-emp.epfindia.gov.in/',
    entityScoped: true,
  },
  {
    id: 'int-esic',
    category: 'portal',
    name: 'ESIC employer portal',
    shortName: 'ESIC',
    description: 'Monthly contribution and challan downloads.',
    code: 'ESIC',
    status: 'disconnected',
    portalUrl: 'https://www.esic.in/',
    entityScoped: true,
  },
];

export const INTEGRATION_CATEGORY_META: Record<
  IntegrationCategory,
  { label: string; blurb: string }
> = {
  accounting: {
    label: 'Accounting software',
    blurb: 'Tally, Zoho, QuickBooks, and spreadsheet ledgers.',
  },
  bank: {
    label: 'Bank accounts',
    blurb: 'Link corporate current / CC accounts for auto statement sync.',
  },
  email: {
    label: 'Email invoices',
    blurb: 'Pull GST invoices from Gmail or Outlook.',
  },
  portal: {
    label: 'Government portals',
    blurb: 'Secure login sessions for GST, Income Tax, TDS, MCA, and labour portals.',
  },
};

/** Seeded connected state per entity (demo). */
const ENTITY_OVERRIDES: Record<string, Partial<Record<string, Partial<BooksIntegration>>>> = {
  'ent-acme': {
    'int-tally': {
      status: 'connected',
      lastSyncedAt: '2026-09-08 18:22',
      detail: 'Company: ACME Retail · Godown: HO',
    },
    'int-hdfc': {
      status: 'connected',
      lastSyncedAt: '2026-09-05 09:14',
      detail: 'Current · XXXXXX4521 · ₹4,82,350',
    },
    'int-icici': {
      status: 'connected',
      lastSyncedAt: '2026-09-05 08:42',
      detail: 'Current · XXXXXX8890 · ₹1,26,780',
    },
    'int-axis': {
      status: 'action_required',
      lastSyncedAt: '2026-08-28 16:20',
      detail: 'Re-authorise netbanking consent',
    },
    'int-gmail': {
      status: 'connected',
      lastSyncedAt: '2026-09-05 07:30',
      detail: 'accounts@acmeretail.in · 24 invoices',
    },
    'int-gst': {
      status: 'connected',
      lastSyncedAt: '2026-09-07 11:05',
      detail: 'GSTIN 19AAACA8899P1Z3 · session active',
    },
    'int-it': {
      status: 'connected',
      lastSyncedAt: '2026-09-01 14:40',
      detail: 'PAN AAACA8899P · DSC linked',
    },
    'int-traces': {
      status: 'action_required',
      detail: 'TAN session expired — re-login required',
    },
  },
  'ent-medicare': {
    'int-zoho': {
      status: 'connected',
      lastSyncedAt: '2026-09-06 10:12',
      detail: 'Org: MediCare Clinics',
    },
    'int-hdfc': {
      status: 'connected',
      lastSyncedAt: '2026-09-04 16:00',
      detail: 'Clinic A/c · ₹3,12,400',
    },
    'int-gst': {
      status: 'connected',
      lastSyncedAt: '2026-09-07 09:30',
      detail: 'GSTIN 27AADCM9087K1Z5',
    },
  },
  'ent-brightpath': {
    'int-excel': {
      status: 'connected',
      lastSyncedAt: '2026-09-03 12:00',
      detail: 'Last upload: BrightPath_TB_Aug.xlsx',
    },
    'int-icici': {
      status: 'connected',
      lastSyncedAt: '2026-09-05 11:20',
      detail: 'Ops A/c · ₹1,85,200',
    },
    'int-gst': {
      status: 'syncing',
      detail: 'OTP verification in progress',
    },
  },
};

export function getIntegrationsForEntity(entityId: string): BooksIntegration[] {
  const overrides = ENTITY_OVERRIDES[entityId] ?? {};
  return BOOKS_INTEGRATIONS_CATALOGUE.map((item) => {
    const o = overrides[item.id];
    return o ? { ...item, ...o } : { ...item };
  });
}
