import type {
  ComputationDoc,
  EntityTBooks,
  LedgerIndexEntry,
  TAccount,
  TSideRow,
} from '../../types/books';

export type { ComputationDoc, EntityTBooks, TAccount };

function L(id: string, label: string, amount?: string, ditto?: boolean): TSideRow {
  return { id, label, amount, ditto };
}

/** Closing balance from Balance c/d line (prefer credit side for Cr accounts). */
function closingFrom(led: TAccount): string {
  const cr = led.right.find((r) => /Balance [Cc]\/d/i.test(r.label))?.amount;
  const dr = led.left.find((r) => /Balance [Cc]\/d/i.test(r.label))?.amount;
  if (cr) return `${cr} Cr`;
  if (dr) return `${dr} Dr`;
  return led.leftTotal;
}

function withIndex(
  ledgers: TAccount[],
  sources: Record<string, string>,
): { ledgers: TAccount[]; ledgerIndex: LedgerIndexEntry[] } {
  return {
    ledgers,
    ledgerIndex: ledgers.map((led, i) => ({
      no: i + 1,
      ledgerId: led.id,
      name: led.title,
      source: sources[led.id] ?? 'Manual',
      closingBalance: closingFrom(led),
    })),
  };
}

// ——— ACME Retail (full set) ———

const ACME_PL: TAccount = {
  id: 't-pl-acme',
  entityId: 'ent-acme',
  entityLabel: 'ACME Retail Private Limited',
  title: 'Profit and Loss Account for the Year Ended 31st March, 2026',
  subtitle: 'F.Y. 2025-26',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [
    L('a1', 'To Opening Stock', '2,95,000'),
    L('a2', 'To Purchase — Trading Goods', '5,18,200'),
    L('a3', 'To Freight Inward', '24,800'),
    L('a4', 'To Gross Profit C/d', '3,89,600'),
    L('a5', '', ''),
    L('a6', 'To Office Rent', '45,000'),
    L('a7', 'To Depreciation', '2,40,000'),
    L('a8', 'To Other Expenses', '1,08,000'),
    L('a9', 'To Net Profit transferred to Capital', '12,48,600'),
  ],
  right: [
    L('b1', 'By Sales — Retail', '8,42,600'),
    L('b2', 'By Closing Stock', '3,85,000'),
    L('b3', '', ''),
    L('b4', '', ''),
    L('b5', 'By Gross Profit B/d', '3,89,600'),
    L('b6', 'By Other Income', '42,000'),
    L('b7', 'By Interest / Misc. Receipts', '18,000'),
    L('b8', 'By Excess Provision Written Back', '11,93,000'),
    L('b9', '', ''),
  ],
  // Trading 12,27,600 + P&L 16,41,600 = 28,69,200 both sides
  leftTotal: '28,69,200',
  rightTotal: '28,69,200',
};

const ACME_CAPITAL: TAccount = {
  id: 't-cap-acme',
  entityId: 'ent-acme',
  entityLabel: 'ACME Retail Private Limited',
  title: 'Capital Account',
  subtitle: 'As on 31st March, 2026',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [
    L('c1', 'To Drawings', '2,40,000'),
    L('c2', 'To Income Tax Paid', '1,45,000'),
    L('c3', 'To Balance C/d', '33,63,600'),
  ],
  right: [
    L('c4', 'By Balance B/d', '25,00,000'),
    L('c5', 'By Net Profit', '12,48,600'),
  ],
  leftTotal: '37,48,600',
  rightTotal: '37,48,600',
};

const ACME_BS: TAccount = {
  id: 't-bs-acme',
  entityId: 'ent-acme',
  entityLabel: 'ACME Retail Private Limited',
  title: 'Balance Sheet as on 31st March, 2026',
  leftHeader: 'Liabilities',
  rightHeader: 'Assets',
  left: [
    L('bl1', 'Capital Account', '33,63,600'),
    L('bl2', 'Sundry Creditors', '62,500'),
    L('bl3', 'Duties & Taxes (GST)', '46,000'),
    L('bl4', 'Axis Bank — CC/OD', '38,400'),
  ],
  right: [
    L('ba1', 'Fixed Assets (WDV)', '18,40,000'),
    L('ba2', 'Stock-in-trade', '3,85,000'),
    L('ba3', 'Sundry Debtors', '1,52,000'),
    L('ba4', 'HDFC Bank — Current A/c', '4,82,350'),
    L('ba5', 'ICICI Bank — Current A/c', '1,26,780'),
    L('ba6', 'Cash-in-Hand', '28,100'),
    L('ba7', 'Deposits & Advances', '4,96,270'),
  ],
  leftTotal: '35,10,500',
  rightTotal: '35,10,500',
};

const ACME_COMP: ComputationDoc = {
  entityId: 'ent-acme',
  assesseeName: 'ACME Retail Private Limited',
  address: '12, Market Road, Andheri East, Mumbai — 400069',
  pan: 'AABCA1234F',
  dob: '12/04/2014',
  fy: '2025-26',
  ay: '2026-27',
  incomeRows: [
    { id: 'i1', label: 'Income from House Property', kind: 'section' },
    { id: 'i2', label: 'Annual Value / Rent Received', workingAmount: '—', kind: 'line' },
    { id: 'i3', label: 'Income from House Property', finalAmount: 'Nil', kind: 'subtotal' },
    { id: 'i4', label: 'Profits and Gains of Business or Profession', kind: 'section' },
    {
      id: 'i5',
      label: 'Net Profit as per Profit & Loss A/c',
      workingAmount: '12,48,600',
      kind: 'line',
    },
    { id: 'i6', label: 'Add: Disallowances u/s 37 / 40A', workingAmount: '1,15,000', kind: 'line' },
    { id: 'i7', label: 'Add: Depreciation as per books', workingAmount: '2,40,000', kind: 'line' },
    {
      id: 'i8',
      label: 'Less: Depreciation as per Income-tax Act',
      workingAmount: '2,85,000',
      kind: 'line',
    },
    {
      id: 'i9',
      label: 'Income from Business',
      workingAmount: '13,18,600',
      finalAmount: '13,18,600',
      kind: 'subtotal',
    },
    { id: 'i10', label: 'Income from Other Sources', kind: 'section' },
    { id: 'i11', label: 'Interest / Misc. receipts', workingAmount: '42,000', kind: 'line' },
    {
      id: 'i12',
      label: 'Income from Other Sources',
      finalAmount: '42,000',
      kind: 'subtotal',
    },
    { id: 'i13', label: '', kind: 'spacer' },
    {
      id: 'i14',
      label: 'Gross Total Income',
      finalAmount: '13,60,600',
      kind: 'subtotal',
    },
    {
      id: 'i15',
      label: 'Less: Deductions under Chapter VI-A',
      workingAmount: '1,50,000',
      kind: 'line',
    },
    {
      id: 'i16',
      label: 'Total Income',
      finalAmount: '12,10,600',
      kind: 'total',
    },
  ],
  taxRows: [
    { id: 't1', label: 'Tax on Total Income', workingAmount: '1,89,180', kind: 'line' },
    { id: 't2', label: 'Add: Health & Education Cess @ 4%', workingAmount: '7,567', kind: 'line' },
    {
      id: 't3',
      label: 'Tax Payable',
      workingAmount: '1,96,747',
      finalAmount: '1,96,747',
      kind: 'subtotal',
    },
    { id: 't4', label: 'Less: TDS / TCS', workingAmount: '85,000', kind: 'line' },
    { id: 't5', label: 'Less: Advance Tax', workingAmount: '60,000', kind: 'line' },
    {
      id: 't6',
      label: 'Balance Tax Payable',
      finalAmount: '51,747',
      kind: 'subtotal',
    },
    { id: 't7', label: 'Add: Interest u/s 234B', workingAmount: '—', kind: 'line' },
    { id: 't8', label: 'Add: Interest u/s 234C', workingAmount: '—', kind: 'line' },
    {
      id: 't9',
      label: 'Net Tax Payable / (Refundable)',
      finalAmount: '51,747',
      kind: 'total',
    },
  ],
};

function acmeLedgers(): TAccount[] {
  const e = 'ACME Retail Private Limited';
  const eid = 'ent-acme';
  return [
    {
      id: 'tled-acme-sales',
      entityId: eid,
      entityLabel: e,
      title: 'Sales — Retail A/c',
      subtitle: 'F.Y. 2025-26',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('s1', 'To Balance C/d', '8,42,600'),
      ],
      right: [
        L('s2', 'By Sundries (as per sales register)', '6,10,000'),
        L('s3', 'By Bank / Cash sales', '2,32,600'),
      ],
      leftTotal: '8,42,600',
      rightTotal: '8,42,600',
    },
    {
      id: 'tled-acme-purchase',
      entityId: eid,
      entityLabel: e,
      title: 'Purchase — Trading Goods A/c',
      subtitle: 'F.Y. 2025-26',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('p1', 'To FreshFarm Supplies', '2,80,000'),
        L('p2', 'To Other suppliers', '2,38,200'),
      ],
      right: [
        L('p3', 'By Balance C/d', '5,18,200'),
      ],
      leftTotal: '5,18,200',
      rightTotal: '5,18,200',
    },
    {
      id: 'tled-acme-hdfc',
      entityId: eid,
      entityLabel: e,
      title: 'HDFC Bank — Current A/c',
      subtitle: 'A/c No. XXXXXX4521',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('h1', 'To Balance B/d', '4,10,000'),
        L('h2', 'To Metro Distributors (Receipt)', '95,000'),
        L('h3', 'To Sales / Collections', '1,50,800'),
      ],
      right: [
        L('h4', 'By FreshFarm Supplies (Payment)', '40,000'),
        L('h5', 'By Office Rent', '45,000'),
        L('h6', 'By Other payments', '88,450'),
        L('h7', 'By Balance C/d', '4,82,350'),
      ],
      leftTotal: '6,55,800',
      rightTotal: '6,55,800',
    },
    {
      id: 'tled-acme-icici',
      entityId: eid,
      entityLabel: e,
      title: 'ICICI Bank — Current A/c',
      subtitle: 'A/c No. XXXXXX8890',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('i1', 'To Balance B/d', '98,200'),
        L('i2', 'To Receipts', '54,600'),
      ],
      right: [
        L('i3', 'By Payments', '26,020'),
        L('i4', 'By Balance C/d', '1,26,780'),
      ],
      leftTotal: '1,52,800',
      rightTotal: '1,52,800',
    },
    {
      id: 'tled-acme-cash',
      entityId: eid,
      entityLabel: e,
      title: 'Cash A/c',
      subtitle: 'Cash-in-Hand',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('k1', 'To Balance B/d', '22,500'),
        L('k2', 'To Cash sales / receipts', '18,000'),
      ],
      right: [
        L('k3', 'By Petty expenses', '12,400'),
        L('k4', 'By Balance C/d', '28,100'),
      ],
      leftTotal: '40,500',
      rightTotal: '40,500',
    },
    {
      id: 'tled-acme-capital',
      entityId: eid,
      entityLabel: e,
      title: 'Capital A/c',
      subtitle: 'Proprietor / Company Capital',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('x1', 'To Drawings', '2,40,000'),
        L('x2', 'To Income Tax Paid', '1,45,000'),
        L('x3', 'To Balance C/d', '33,63,600'),
      ],
      right: [
        L('x4', 'By Balance B/d', '25,00,000'),
        L('x5', 'By Net Profit', '12,48,600'),
      ],
      leftTotal: '37,48,600',
      rightTotal: '37,48,600',
    },
    {
      id: 'tled-acme-debtors',
      entityId: eid,
      entityLabel: e,
      title: 'Metro Distributors Pvt Ltd',
      subtitle: 'Sundry Debtors',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('d1', 'To Balance B/d', '1,85,000'),
        L('d2', 'To Sales', '62,000'),
      ],
      right: [
        L('d3', 'By Bank (receipts)', '95,000'),
        L('d4', 'By Balance C/d', '1,52,000'),
      ],
      leftTotal: '2,47,000',
      rightTotal: '2,47,000',
    },
    {
      id: 'tled-acme-creditors',
      entityId: eid,
      entityLabel: e,
      title: 'FreshFarm Supplies',
      subtitle: 'Sundry Creditors',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('cr1', 'To Bank (payments)', '40,000'),
        L('cr2', 'To Balance C/d', '62,500'),
      ],
      right: [
        L('cr3', 'By Balance B/d', '74,000'),
        L('cr4', 'By Purchases', '28,500'),
      ],
      leftTotal: '1,02,500',
      rightTotal: '1,02,500',
    },
  ];
}

const ACME_LEDGER_SOURCES: Record<string, string> = {
  'tled-acme-sales': 'Sales register',
  'tled-acme-purchase': 'Purchase register',
  'tled-acme-hdfc': 'Bank feed',
  'tled-acme-icici': 'Bank feed',
  'tled-acme-cash': 'Cash book',
  'tled-acme-capital': 'Journal',
  'tled-acme-debtors': 'Sales / Bank',
  'tled-acme-creditors': 'Purchase / Bank',
};

// ——— MediCare (lighter) ———

const MC_PL: TAccount = {
  id: 't-pl-mc',
  entityId: 'ent-medicare',
  entityLabel: 'MediCare Clinics Pvt Ltd',
  title: 'Profit and Loss Account for the Year Ended 31st March, 2026',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [
    L('m1', 'To Medical Consumables', '1,12,000'),
    L('m2', 'To Staff Salaries', '2,40,000'),
    L('m3', 'To Clinic Rent & Utilities', '95,000'),
    L('m4', 'To Net Profit transferred to Capital', '1,58,000'),
  ],
  right: [
    L('m5', 'By Consultation Income', '4,85,000'),
    L('m6', 'By Diagnostics Income', '1,20,000'),
  ],
  leftTotal: '6,05,000',
  rightTotal: '6,05,000',
};

const MC_CAPITAL: TAccount = {
  id: 't-cap-mc',
  entityId: 'ent-medicare',
  entityLabel: 'MediCare Clinics Pvt Ltd',
  title: 'Capital Account',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [L('mc1', 'To Balance C/d', '11,58,000')],
  right: [
    L('mc2', 'By Balance B/d', '10,00,000'),
    L('mc3', 'By Net Profit', '1,58,000'),
  ],
  leftTotal: '11,58,000',
  rightTotal: '11,58,000',
};

const MC_BS: TAccount = {
  id: 't-bs-mc',
  entityId: 'ent-medicare',
  entityLabel: 'MediCare Clinics Pvt Ltd',
  title: 'Balance Sheet as on 31st March, 2026',
  leftHeader: 'Liabilities',
  rightHeader: 'Assets',
  left: [
    L('mbl1', 'Share Capital / Capital A/c', '11,58,000'),
    L('mbl2', 'Reserves & Surplus', '4,70,900'),
    L('mbl3', 'Sundry Creditors', '85,000'),
    L('mbl4', 'Duties & Taxes', '42,000'),
  ],
  right: [
    L('mba1', 'Medical Equipment (WDV)', '12,80,000'),
    L('mba2', 'Receivables — Insurers', '1,45,000'),
    L('mba3', 'HDFC Bank — Clinic A/c', '3,12,400'),
    L('mba4', 'Cash — Reception', '18,500'),
  ],
  leftTotal: '17,55,900',
  rightTotal: '17,55,900',
};

const MC_COMP: ComputationDoc = {
  entityId: 'ent-medicare',
  assesseeName: 'MediCare Clinics Pvt Ltd',
  address: 'Clinic Complex, Baner Road, Pune — 411045',
  pan: 'AADCM9087K',
  fy: '2025-26',
  ay: '2026-27',
  incomeRows: [
    { id: 'mc-i1', label: 'Profits and Gains of Business', kind: 'section' },
    {
      id: 'mc-i2',
      label: 'Net Profit as per P&L A/c',
      workingAmount: '1,58,000',
      finalAmount: '1,58,000',
      kind: 'subtotal',
    },
    {
      id: 'mc-i3',
      label: 'Gross Total Income / Total Income',
      finalAmount: '1,58,000',
      kind: 'total',
    },
  ],
  taxRows: [
    { id: 'mc-t1', label: 'Tax on Total Income (approx.)', workingAmount: '31,600', kind: 'line' },
    { id: 'mc-t2', label: 'Add: Cess @ 4%', workingAmount: '1,264', kind: 'line' },
    {
      id: 'mc-t3',
      label: 'Net Tax Payable',
      finalAmount: '32,864',
      kind: 'total',
    },
  ],
};

function mcLedgers(): TAccount[] {
  const e = 'MediCare Clinics Pvt Ltd';
  const eid = 'ent-medicare';
  return [
    {
      id: 'tled-mc-bank',
      entityId: eid,
      entityLabel: e,
      title: 'HDFC Bank — Clinic A/c',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('1', 'To Balance B/d', '2,80,000'),
        L('2', 'To Receipts', '95,400'),
      ],
      right: [
        L('3', 'By Payments', '63,000'),
        L('4', 'By Balance C/d', '3,12,400'),
      ],
      leftTotal: '3,75,400',
      rightTotal: '3,75,400',
    },
    {
      id: 'tled-mc-income',
      entityId: eid,
      entityLabel: e,
      title: 'Consultation Income A/c',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [L('1', 'To Balance C/d', '4,85,000')],
      right: [L('2', 'By Patients / Collections', '4,85,000')],
      leftTotal: '4,85,000',
      rightTotal: '4,85,000',
    },
    {
      id: 'tled-mc-cons',
      entityId: eid,
      entityLabel: e,
      title: 'Medical Consumables A/c',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [L('1', 'To Suppliers', '1,12,000')],
      right: [L('2', 'By Balance C/d', '1,12,000')],
      leftTotal: '1,12,000',
      rightTotal: '1,12,000',
    },
  ];
}

// ——— BrightPath (lighter) ———

const BP_PL: TAccount = {
  id: 't-pl-bp',
  entityId: 'ent-brightpath',
  entityLabel: 'BrightPath Education LLP',
  title: 'Profit and Loss Account for the Year Ended 31st March, 2026',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [
    L('b1', 'To Faculty Payouts', '1,08,000'),
    L('b2', 'To Platform & Content Costs', '42,000'),
    L('b3', 'To Net Profit transferred to Capital', '1,15,000'),
  ],
  right: [L('b4', 'By Course Fee Income', '2,65,000')],
  leftTotal: '2,65,000',
  rightTotal: '2,65,000',
};

const BP_CAPITAL: TAccount = {
  id: 't-cap-bp',
  entityId: 'ent-brightpath',
  entityLabel: 'BrightPath Education LLP',
  title: 'Capital Account',
  leftHeader: 'Particulars',
  rightHeader: 'Particulars',
  left: [L('1', 'To Balance C/d', '6,15,000')],
  right: [
    L('2', 'By Balance B/d', '5,00,000'),
    L('3', 'By Net Profit', '1,15,000'),
  ],
  leftTotal: '6,15,000',
  rightTotal: '6,15,000',
};

const BP_BS: TAccount = {
  id: 't-bs-bp',
  entityId: 'ent-brightpath',
  entityLabel: 'BrightPath Education LLP',
  title: 'Balance Sheet as on 31st March, 2026',
  leftHeader: 'Liabilities',
  rightHeader: 'Assets',
  left: [
    L('1', 'Partners’ Capital', '6,15,000'),
    L('2', 'Reserves & Surplus', '7,400'),
    L('3', 'Faculty Payables', '35,000'),
    L('4', 'Duties & Taxes', '18,200'),
  ],
  right: [
    L('5', 'Content & Platform Assets', '4,20,000'),
    L('6', 'Fee Receivables', '62,000'),
    L('7', 'ICICI Bank — Ops A/c', '1,85,200'),
    L('8', 'Cash', '8,400'),
  ],
  leftTotal: '6,75,600',
  rightTotal: '6,75,600',
};

const BP_COMP: ComputationDoc = {
  entityId: 'ent-brightpath',
  assesseeName: 'BrightPath Education LLP',
  address: '3rd Floor, EduHub, Koramangala, Bengaluru — 560034',
  pan: 'AAEFB4412P',
  fy: '2025-26',
  ay: '2026-27',
  incomeRows: [
    { id: 'bp-i1', label: 'Profits and Gains of Business', kind: 'section' },
    {
      id: 'bp-i2',
      label: 'Net Profit as per P&L A/c',
      workingAmount: '1,15,000',
      finalAmount: '1,15,000',
      kind: 'total',
    },
  ],
  taxRows: [
    { id: 'bp-t1', label: 'Tax on Total Income (approx.)', workingAmount: '23,000', kind: 'line' },
    { id: 'bp-t2', label: 'Add: Cess @ 4%', workingAmount: '920', kind: 'line' },
    {
      id: 'bp-t3',
      label: 'Net Tax Payable',
      finalAmount: '23,920',
      kind: 'total',
    },
  ],
};

function bpLedgers(): TAccount[] {
  const e = 'BrightPath Education LLP';
  const eid = 'ent-brightpath';
  return [
    {
      id: 'tled-bp-bank',
      entityId: eid,
      entityLabel: e,
      title: 'ICICI Bank — Ops A/c',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [
        L('1', 'To Balance B/d', '1,40,000'),
        L('2', 'To Fee collections', '72,200'),
      ],
      right: [
        L('3', 'By Faculty / expenses', '27,000'),
        L('4', 'By Balance C/d', '1,85,200'),
      ],
      leftTotal: '2,12,200',
      rightTotal: '2,12,200',
    },
    {
      id: 'tled-bp-fees',
      entityId: eid,
      entityLabel: e,
      title: 'Course Fee Income A/c',
      leftHeader: 'Date / Particulars',
      rightHeader: 'Date / Particulars',
      left: [L('1', 'To Balance C/d', '2,65,000')],
      right: [L('2', 'By Students / Batches', '2,65,000')],
      leftTotal: '2,65,000',
      rightTotal: '2,65,000',
    },
  ];
}

const acmeL = withIndex(acmeLedgers(), ACME_LEDGER_SOURCES);
const mcL = withIndex(mcLedgers(), {
  'tled-mc-bank': 'Bank feed',
  'tled-mc-income': 'Billing',
  'tled-mc-cons': 'Purchase',
});
const bpL = withIndex(bpLedgers(), {
  'tled-bp-bank': 'Bank feed',
  'tled-bp-fees': 'Fee register',
});

export const T_BOOKS_BY_ENTITY: Record<string, EntityTBooks> = {
  'ent-acme': {
    profitAndLoss: ACME_PL,
    capitalAccount: ACME_CAPITAL,
    balanceSheet: ACME_BS,
    computation: ACME_COMP,
    ledgers: acmeL.ledgers,
    ledgerIndex: acmeL.ledgerIndex,
  },
  'ent-medicare': {
    profitAndLoss: MC_PL,
    capitalAccount: MC_CAPITAL,
    balanceSheet: MC_BS,
    computation: MC_COMP,
    ledgers: mcL.ledgers,
    ledgerIndex: mcL.ledgerIndex,
  },
  'ent-brightpath': {
    profitAndLoss: BP_PL,
    capitalAccount: BP_CAPITAL,
    balanceSheet: BP_BS,
    computation: BP_COMP,
    ledgers: bpL.ledgers,
    ledgerIndex: bpL.ledgerIndex,
  },
};

/** Client bookkeeping default entity (ACME). */
export const T_CLIENT_ENTITY_ID = 'ent-acme';

export function getTBooks(entityId: string): EntityTBooks | undefined {
  return T_BOOKS_BY_ENTITY[entityId];
}
