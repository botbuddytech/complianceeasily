import type {
  EntityTdsBooks,
  LedgerIndexEntry,
  TAccount,
  TdsReturn,
  TSideRow,
} from '../../types/books';
import { withTdsPreview } from './returnPreviews';

function L(id: string, label: string, amount?: string): TSideRow {
  return { id, label, amount };
}

function bal(n: number): string {
  return n.toLocaleString('en-IN');
}

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
      source: sources[led.id] ?? 'TDS/TCS',
      closingBalance: closingFrom(led),
    })),
  };
}

/** TDS payable — credit nature */
function tdsPayableLedger(
  id: string,
  entityId: string,
  entityLabel: string,
  title: string,
  section: string,
  opening: number,
  deducted: number,
  deposited: number,
): TAccount {
  const closing = opening + deducted - deposited;
  return {
    id,
    entityId,
    entityLabel,
    title,
    subtitle: `TDS Payable · ${section}`,
    leftHeader: 'Date / Particulars',
    rightHeader: 'Date / Particulars',
    left: [
      L('l1', 'To Challan / Bank (deposited)', bal(deposited)),
      L('l2', 'To Balance C/d', bal(closing)),
    ],
    right: [
      L('r1', 'By Balance B/d', bal(opening)),
      L('r2', 'By Deduction from payments', bal(deducted)),
    ],
    leftTotal: bal(opening + deducted),
    rightTotal: bal(opening + deducted),
  };
}

/** TCS payable — credit nature */
function tcsPayableLedger(
  id: string,
  entityId: string,
  entityLabel: string,
  title: string,
  section: string,
  opening: number,
  collected: number,
  deposited: number,
): TAccount {
  const closing = opening + collected - deposited;
  return {
    id,
    entityId,
    entityLabel,
    title,
    subtitle: `TCS Payable · ${section}`,
    leftHeader: 'Date / Particulars',
    rightHeader: 'Date / Particulars',
    left: [
      L('l1', 'To Challan / Bank (deposited)', bal(deposited)),
      L('l2', 'To Balance C/d', bal(closing)),
    ],
    right: [
      L('r1', 'By Balance B/d', bal(opening)),
      L('r2', 'By Collection on receipts', bal(collected)),
    ],
    leftTotal: bal(opening + collected),
    rightTotal: bal(opening + collected),
  };
}

/** TDS receivable / recoverable — debit */
function tdsReceivableLedger(
  id: string,
  entityId: string,
  entityLabel: string,
  title: string,
  opening: number,
  deductedByOthers: number,
  claimed: number,
): TAccount {
  const closing = opening + deductedByOthers - claimed;
  return {
    id,
    entityId,
    entityLabel,
    title,
    subtitle: 'TDS Receivable · Form 26AS / AIS',
    leftHeader: 'Date / Particulars',
    rightHeader: 'Date / Particulars',
    left: [
      L('l1', 'To Balance B/d', bal(opening)),
      L('l2', 'To TDS deducted by parties', bal(deductedByOthers)),
    ],
    right: [
      L('r1', 'By Claimed in ITR / refund adjusted', bal(claimed)),
      L('r2', 'By Balance C/d', bal(closing)),
    ],
    leftTotal: bal(opening + deductedByOthers),
    rightTotal: bal(opening + deductedByOthers),
  };
}

function acmeTds(): EntityTdsBooks {
  const entityId = 'ent-acme';
  const entityLabel = 'ACME Retail Private Limited';
  const ledgers = [
    tdsPayableLedger(
      'tds-acme-194c',
      entityId,
      entityLabel,
      'TDS Payable — u/s 194C (Contractors)',
      'u/s 194C',
      12500,
      48200,
      42000,
    ),
    tdsPayableLedger(
      'tds-acme-194j',
      entityId,
      entityLabel,
      'TDS Payable — u/s 194J (Professional)',
      'u/s 194J',
      8000,
      31500,
      28000,
    ),
    tdsPayableLedger(
      'tds-acme-192',
      entityId,
      entityLabel,
      'TDS Payable — u/s 192 (Salaries)',
      'u/s 192',
      45000,
      186000,
      186000,
    ),
    tdsPayableLedger(
      'tds-acme-194a',
      entityId,
      entityLabel,
      'TDS Payable — u/s 194A (Interest)',
      'u/s 194A',
      0,
      8400,
      8400,
    ),
    tcsPayableLedger(
      'tcs-acme-206c',
      entityId,
      entityLabel,
      'TCS Payable — u/s 206C',
      'u/s 206C',
      2200,
      15600,
      14200,
    ),
    tdsReceivableLedger(
      'tds-acme-recv',
      entityId,
      entityLabel,
      'TDS Receivable A/c',
      28500,
      62000,
      45000,
    ),
  ];
  const indexed = withIndex(ledgers, {
    'tds-acme-194c': 'Vendor payments',
    'tds-acme-194j': 'Professional fees',
    'tds-acme-192': 'Payroll',
    'tds-acme-194a': 'Interest',
    'tcs-acme-206c': 'TCS collections',
    'tds-acme-recv': '26AS / AIS',
  });

  const returns: TdsReturn[] = [
    {
      id: 'tds-acme-26q-q1',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q1 FY 2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2025-06-30',
      dueDate: '2025-07-31',
      status: 'filed',
      deductees: 42,
      taxableAmount: '₹48,20,000',
      tdsAmount: '₹1,42,600',
      challanPaid: '₹1,42,600',
      acknowledgement: 'QRN2607260001122',
      filedAt: '2025-07-28',
    },
    {
      id: 'tds-acme-24q-q1',
      entityId,
      returnType: 'Form 24Q',
      nature: 'TDS',
      periodLabel: 'Q1 FY 2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2025-06-30',
      dueDate: '2025-07-31',
      status: 'filed',
      deductees: 28,
      taxableAmount: '₹32,40,000',
      tdsAmount: '₹1,86,000',
      challanPaid: '₹1,86,000',
      acknowledgement: 'QRN2407260002233',
      filedAt: '2025-07-29',
    },
    {
      id: 'tds-acme-26q-q2',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2025-26',
      periodFrom: '2025-07-01',
      periodTo: '2025-09-30',
      dueDate: '2025-10-31',
      status: 'filed',
      deductees: 38,
      taxableAmount: '₹41,15,000',
      tdsAmount: '₹1,18,400',
      challanPaid: '₹1,18,400',
      acknowledgement: 'QRN2609250003344',
      filedAt: '2025-10-25',
    },
    {
      id: 'tds-acme-27eq-q2',
      entityId,
      returnType: 'Form 27EQ',
      nature: 'TCS',
      periodLabel: 'Q2 FY 2025-26',
      periodFrom: '2025-07-01',
      periodTo: '2025-09-30',
      dueDate: '2025-10-15',
      status: 'filed',
      deductees: 12,
      taxableAmount: '₹18,40,000',
      tdsAmount: '₹15,600',
      challanPaid: '₹14,200',
      interestLateFee: '₹400',
      acknowledgement: 'QRN27E9250004455',
      filedAt: '2025-10-12',
    },
    {
      id: 'tds-acme-26q-q1-26',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q1 FY 2026-27',
      periodFrom: '2026-04-01',
      periodTo: '2026-06-30',
      dueDate: '2026-07-31',
      status: 'filed',
      deductees: 44,
      taxableAmount: '₹52,10,000',
      tdsAmount: '₹1,55,800',
      challanPaid: '₹1,55,800',
      acknowledgement: 'QRN2607260015566',
      filedAt: '2026-07-26',
    },
    {
      id: 'tds-acme-26q-q2-26',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-31',
      status: 'draft',
      deductees: 31,
      taxableAmount: '₹28,60,000',
      tdsAmount: '₹88,100',
      challanPaid: '₹72,000',
    },
    {
      id: 'tds-acme-24q-q2-26',
      entityId,
      returnType: 'Form 24Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-31',
      status: 'due',
      deductees: 28,
      taxableAmount: '₹34,20,000',
      tdsAmount: '₹1,92,400',
      challanPaid: '₹1,28,000',
    },
    {
      id: 'tds-acme-27eq-q2-26',
      entityId,
      returnType: 'Form 27EQ',
      nature: 'TCS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-15',
      status: 'overdue',
      deductees: 8,
      taxableAmount: '₹9,40,000',
      tdsAmount: '₹9,400',
      challanPaid: '₹6,000',
      interestLateFee: '—',
    },
    {
      id: 'tds-acme-16a',
      entityId,
      returnType: 'Form 16A',
      nature: 'TDS',
      periodLabel: 'FY 2025-26',
      periodFrom: '2025-04-01',
      periodTo: '2026-03-31',
      dueDate: '2026-06-15',
      status: 'generated',
      deductees: 86,
      taxableAmount: '₹1,82,40,000',
      tdsAmount: '₹5,48,200',
      acknowledgement: 'CERT-16A-ACME-2526',
      filedAt: '2026-05-28',
    },
  ];

  return {
    entityId,
    tan: 'CALA12345B',
    legalName: entityLabel,
    pan: 'AAACA8899P',
    ay: '2026-27',
    ...indexed,
    returns: returns.map((r) =>
      withTdsPreview(r, entityLabel, 'CALA12345B', 'AAACA8899P'),
    ),
  };
}

function medicareTds(): EntityTdsBooks {
  const entityId = 'ent-medicare';
  const entityLabel = 'MediCare Clinics Pvt Ltd';
  const ledgers = [
    tdsPayableLedger(
      'tds-mc-194j',
      entityId,
      entityLabel,
      'TDS Payable — u/s 194J',
      'u/s 194J',
      4500,
      22400,
      18000,
    ),
    tdsPayableLedger(
      'tds-mc-192',
      entityId,
      entityLabel,
      'TDS Payable — u/s 192',
      'u/s 192',
      22000,
      96000,
      96000,
    ),
    tdsReceivableLedger('tds-mc-recv', entityId, entityLabel, 'TDS Receivable A/c', 12000, 28500, 20000),
  ];
  const indexed = withIndex(ledgers, {
    'tds-mc-194j': 'Consultant fees',
    'tds-mc-192': 'Payroll',
    'tds-mc-recv': '26AS / AIS',
  });

  const returns: TdsReturn[] = [
    {
      id: 'tds-mc-26q-q2',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-31',
      status: 'due',
      deductees: 14,
      taxableAmount: '₹8,40,000',
      tdsAmount: '₹22,400',
      challanPaid: '₹18,000',
    },
    {
      id: 'tds-mc-24q-q2',
      entityId,
      returnType: 'Form 24Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-31',
      status: 'draft',
      deductees: 18,
      taxableAmount: '₹18,60,000',
      tdsAmount: '₹96,000',
      challanPaid: '₹64,000',
    },
  ];

  return {
    entityId,
    tan: 'PNEM9087C',
    legalName: entityLabel,
    pan: 'AADCM9087K',
    ay: '2026-27',
    ...indexed,
    returns: returns.map((r) =>
      withTdsPreview(r, entityLabel, 'PNEM9087C', 'AADCM9087K'),
    ),
  };
}

function brightpathTds(): EntityTdsBooks {
  const entityId = 'ent-brightpath';
  const entityLabel = 'BrightPath Education LLP';
  const ledgers = [
    tdsPayableLedger(
      'tds-bp-194j',
      entityId,
      entityLabel,
      'TDS Payable — u/s 194J (Faculty)',
      'u/s 194J',
      2100,
      10800,
      9000,
    ),
    tdsReceivableLedger('tds-bp-recv', entityId, entityLabel, 'TDS Receivable A/c', 4500, 8200, 6000),
  ];
  const indexed = withIndex(ledgers, {
    'tds-bp-194j': 'Faculty payouts',
    'tds-bp-recv': '26AS / AIS',
  });

  const returns: TdsReturn[] = [
    {
      id: 'tds-bp-26q-q2',
      entityId,
      returnType: 'Form 26Q',
      nature: 'TDS',
      periodLabel: 'Q2 FY 2026-27',
      periodFrom: '2026-07-01',
      periodTo: '2026-09-30',
      dueDate: '2026-10-31',
      status: 'due',
      deductees: 9,
      taxableAmount: '₹2,65,000',
      tdsAmount: '₹10,800',
      challanPaid: '₹9,000',
    },
  ];

  return {
    entityId,
    tan: 'BLRB4412D',
    legalName: entityLabel,
    pan: 'AAEFB4412P',
    ay: '2026-27',
    ...indexed,
    returns: returns.map((r) =>
      withTdsPreview(r, entityLabel, 'BLRB4412D', 'AAEFB4412P'),
    ),
  };
}

export const TDS_BOOKS_BY_ENTITY: Record<string, EntityTdsBooks> = {
  'ent-acme': acmeTds(),
  'ent-medicare': medicareTds(),
  'ent-brightpath': brightpathTds(),
};

export const TDS_CLIENT_ENTITY_ID = 'ent-acme';

export function getTdsBooks(entityId: string): EntityTdsBooks | undefined {
  return TDS_BOOKS_BY_ENTITY[entityId];
}

export function filterTdsReturns(
  returns: TdsReturn[],
  from: string,
  to: string,
): TdsReturn[] {
  return returns.filter((r) => r.periodFrom <= to && r.periodTo >= from);
}
