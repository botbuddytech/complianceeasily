/**
 * Books render layer — ledger_entries are the source of truth.
 * T-accounts, trial balance, P&L and balance sheet are derived views.
 */

export type LedgerGroup =
  | 'Bank Accounts'
  | 'Cash-in-Hand'
  | 'Sundry Debtors'
  | 'Sundry Creditors'
  | 'Sales Accounts'
  | 'Purchase Accounts'
  | 'Direct Expenses'
  | 'Indirect Expenses'
  | 'Duties & Taxes';

export interface LedgerAccountRow {
  id: string;
  entityId: string;
  name: string;
  group: LedgerGroup;
  openingBalance: number;
}

export interface LedgerEntryRow {
  id: string;
  entityId: string;
  ledgerAccountId?: string | null;
  date: string;
  particulars: string;
  voucherType: string;
  ledgerName: string;
  debit: number;
  credit: number;
  source: string;
}

export interface Period {
  from: string;
  to: string;
}

export interface TrialBalanceLine {
  accountId: string;
  name: string;
  group: LedgerGroup;
  debit: number;
  credit: number;
}

export interface TSideRow {
  id: string;
  label: string;
  amount?: string;
  isTotal?: boolean;
}

export interface DerivedTAccount {
  id: string;
  entityId: string;
  title: string;
  subtitle?: string;
  leftHeader: string;
  rightHeader: string;
  left: TSideRow[];
  right: TSideRow[];
  leftTotal: string;
  rightTotal: string;
}

function inPeriod(date: string, period?: Period): boolean {
  if (!period) return true;
  return date >= period.from && date <= period.to;
}

function fmt(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function getTrialBalance(
  accounts: LedgerAccountRow[],
  entries: LedgerEntryRow[],
  period?: Period,
): TrialBalanceLine[] {
  return accounts.map((account) => {
    const rows = entries.filter(
      (e) =>
        (e.ledgerAccountId === account.id || e.ledgerName === account.name) &&
        inPeriod(e.date, period),
    );
    const debit = account.openingBalance > 0
      ? account.openingBalance + rows.reduce((s, r) => s + r.debit, 0)
      : rows.reduce((s, r) => s + r.debit, 0);
    const credit = account.openingBalance < 0
      ? Math.abs(account.openingBalance) + rows.reduce((s, r) => s + r.credit, 0)
      : rows.reduce((s, r) => s + r.credit, 0);
    const netDebit = Math.max(0, debit - credit);
    const netCredit = Math.max(0, credit - debit);
    return {
      accountId: account.id,
      name: account.name,
      group: account.group,
      debit: netDebit,
      credit: netCredit,
    };
  });
}

export function getLedgerTAccount(
  account: LedgerAccountRow,
  entries: LedgerEntryRow[],
  period?: Period,
  periodLabel?: string,
): DerivedTAccount {
  const rows = entries
    .filter(
      (e) =>
        (e.ledgerAccountId === account.id || e.ledgerName === account.name) &&
        inPeriod(e.date, period),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const left: TSideRow[] = [];
  const right: TSideRow[] = [];

  if (account.openingBalance > 0) {
    left.push({ id: 'ob-dr', label: 'To Balance B/d', amount: fmt(account.openingBalance) });
  } else if (account.openingBalance < 0) {
    right.push({ id: 'ob-cr', label: 'By Balance B/d', amount: fmt(Math.abs(account.openingBalance)) });
  }

  for (const e of rows) {
    if (e.debit > 0) {
      left.push({ id: `${e.id}-dr`, label: `To ${e.particulars}`, amount: fmt(e.debit) });
    }
    if (e.credit > 0) {
      right.push({ id: `${e.id}-cr`, label: `By ${e.particulars}`, amount: fmt(e.credit) });
    }
  }

  const leftSum = left.reduce((s, r) => s + (r.amount ? Number(r.amount.replace(/[₹,]/g, '')) : 0), 0);
  const rightSum = right.reduce((s, r) => s + (r.amount ? Number(r.amount.replace(/[₹,]/g, '')) : 0), 0);
  const closing = leftSum - rightSum;

  if (closing > 0) {
    right.push({ id: 'cd', label: 'By Balance C/d', amount: fmt(closing) });
  } else if (closing < 0) {
    left.push({ id: 'cd', label: 'To Balance C/d', amount: fmt(Math.abs(closing)) });
  }

  const leftTotal = left.reduce((s, r) => s + (r.amount ? Number(r.amount.replace(/[₹,]/g, '')) : 0), 0);
  const rightTotal = right.reduce((s, r) => s + (r.amount ? Number(r.amount.replace(/[₹,]/g, '')) : 0), 0);

  return {
    id: account.id,
    entityId: account.entityId,
    title: account.name,
    subtitle: periodLabel,
    leftHeader: 'Dr',
    rightHeader: 'Cr',
    left,
    right,
    leftTotal: fmt(leftTotal),
    rightTotal: fmt(rightTotal),
  };
}

const INCOME_GROUPS: LedgerGroup[] = ['Sales Accounts'];
const EXPENSE_GROUPS: LedgerGroup[] = ['Purchase Accounts', 'Direct Expenses', 'Indirect Expenses'];
const ASSET_GROUPS: LedgerGroup[] = ['Bank Accounts', 'Cash-in-Hand', 'Sundry Debtors', 'Duties & Taxes'];
const LIABILITY_GROUPS: LedgerGroup[] = ['Sundry Creditors'];

export function getProfitAndLoss(
  accounts: LedgerAccountRow[],
  entries: LedgerEntryRow[],
  entityId: string,
  period?: Period,
  periodLabel?: string,
): DerivedTAccount {
  const tb = getTrialBalance(accounts, entries, period);
  const left: TSideRow[] = [];
  const right: TSideRow[] = [];

  for (const line of tb.filter((l) => EXPENSE_GROUPS.includes(l.group) && (l.debit > 0 || l.credit > 0))) {
    left.push({ id: line.accountId, label: `To ${line.name}`, amount: fmt(line.debit || line.credit) });
  }
  for (const line of tb.filter((l) => INCOME_GROUPS.includes(l.group) && (l.debit > 0 || l.credit > 0))) {
    right.push({ id: line.accountId, label: `By ${line.name}`, amount: fmt(line.credit || line.debit) });
  }

  const expense = left.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);
  const income = right.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);
  const net = income - expense;
  if (net >= 0) {
    left.push({ id: 'np', label: 'To Net Profit c/d', amount: fmt(net) });
  } else {
    right.push({ id: 'nl', label: 'By Net Loss c/d', amount: fmt(Math.abs(net)) });
  }

  const leftTotal = left.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);
  const rightTotal = right.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);

  return {
    id: `pnl-${entityId}`,
    entityId,
    title: `Profit and Loss Account${period?.to ? ` for the Year Ended ${period.to}` : ''}`,
    subtitle: periodLabel,
    leftHeader: 'Dr',
    rightHeader: 'Cr',
    left,
    right,
    leftTotal: fmt(leftTotal),
    rightTotal: fmt(rightTotal),
  };
}

export function getBalanceSheet(
  accounts: LedgerAccountRow[],
  entries: LedgerEntryRow[],
  entityId: string,
  period?: Period,
  asOnLabel?: string,
): DerivedTAccount {
  const tb = getTrialBalance(accounts, entries, period);
  const left: TSideRow[] = [];
  const right: TSideRow[] = [];

  for (const line of tb.filter((l) => LIABILITY_GROUPS.includes(l.group))) {
    const amt = line.credit || line.debit;
    if (amt > 0) left.push({ id: line.accountId, label: line.name, amount: fmt(amt) });
  }
  for (const line of tb.filter((l) => ASSET_GROUPS.includes(l.group))) {
    const amt = line.debit || line.credit;
    if (amt > 0) right.push({ id: line.accountId, label: line.name, amount: fmt(amt) });
  }

  const leftTotal = left.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);
  const rightTotal = right.reduce((s, r) => s + Number((r.amount ?? '0').replace(/[₹,]/g, '')), 0);

  return {
    id: `bs-${entityId}`,
    entityId,
    title: `Balance Sheet${asOnLabel ? ` as on ${asOnLabel}` : ''}`,
    subtitle: asOnLabel,
    leftHeader: 'Liabilities',
    rightHeader: 'Assets',
    left,
    right,
    leftTotal: fmt(leftTotal),
    rightTotal: fmt(rightTotal),
  };
}
