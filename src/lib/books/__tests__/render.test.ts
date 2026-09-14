import { describe, it, expect } from 'vitest';
import {
  getTrialBalance,
  getLedgerTAccount,
  getProfitAndLoss,
  getBalanceSheet,
  type LedgerAccountRow,
  type LedgerEntryRow,
} from '../render';

const accounts: LedgerAccountRow[] = [
  { id: 'la-bank', entityId: 'e1', name: 'HDFC Bank', group: 'Bank Accounts', openingBalance: 100000 },
  { id: 'la-sales', entityId: 'e1', name: 'Sales', group: 'Sales Accounts', openingBalance: 0 },
  { id: 'la-purchase', entityId: 'e1', name: 'Purchases', group: 'Purchase Accounts', openingBalance: 0 },
  { id: 'la-creditor', entityId: 'e1', name: 'ABC Suppliers', group: 'Sundry Creditors', openingBalance: 0 },
];

const entries: LedgerEntryRow[] = [
  { id: 'le1', entityId: 'e1', ledgerAccountId: 'la-sales', date: '2025-05-01', particulars: 'Cash sales', voucherType: 'Sales', ledgerName: 'Sales', debit: 0, credit: 50000, source: 'Manual Upload' },
  { id: 'le2', entityId: 'e1', ledgerAccountId: 'la-bank', date: '2025-05-01', particulars: 'Cash sales', voucherType: 'Receipt', ledgerName: 'HDFC Bank', debit: 50000, credit: 0, source: 'Bank Feed' },
  { id: 'le3', entityId: 'e1', ledgerAccountId: 'la-purchase', date: '2025-05-10', particulars: 'Stock', voucherType: 'Purchase', ledgerName: 'Purchases', debit: 20000, credit: 0, source: 'Manual Upload' },
  { id: 'le4', entityId: 'e1', ledgerAccountId: 'la-creditor', date: '2025-05-10', particulars: 'Stock', voucherType: 'Purchase', ledgerName: 'ABC Suppliers', debit: 0, credit: 20000, source: 'Manual Upload' },
];

describe('books render', () => {
  it('builds trial balance from entries + opening', () => {
    const tb = getTrialBalance(accounts, entries, { from: '2025-04-01', to: '2026-03-31' });
    const bank = tb.find((l) => l.accountId === 'la-bank')!;
    expect(bank.debit).toBeGreaterThan(0);
    const sales = tb.find((l) => l.accountId === 'la-sales')!;
    expect(sales.credit).toBe(50000);
  });

  it('renders a balanced T-account', () => {
    const account = accounts[0];
    const t = getLedgerTAccount(account, entries, { from: '2025-04-01', to: '2026-03-31' }, 'FY 25-26');
    expect(t.left.length).toBeGreaterThan(0);
    expect(t.leftTotal).toBe(t.rightTotal);
  });

  it('derives P&L and balance sheet', () => {
    const pnl = getProfitAndLoss(accounts, entries, 'e1', { from: '2025-04-01', to: '2026-03-31' });
    expect(pnl.left.some((r) => r.label.includes('Net Profit') || r.label.includes('Purchases'))).toBe(true);
    const bs = getBalanceSheet(accounts, entries, 'e1', { from: '2025-04-01', to: '2026-03-31' }, '31 Mar 2026');
    expect(bs.leftHeader).toBe('Liabilities');
    expect(bs.rightHeader).toBe('Assets');
  });
});
