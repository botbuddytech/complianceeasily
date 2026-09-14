import { useState } from 'react';
import { Upload, Mail, Landmark, Link2 } from 'lucide-react';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import {
  BANK_CONNECTIONS,
  AVAILABLE_BANKS,
  EMAIL_CONNECTIONS,
  STATEMENT_UPLOADS,
} from '../../../data/dashboard/bookkeeping';
import type {
  BankConnection,
  BankCode,
  EmailConnection,
  StatementUpload,
} from '../../../types/dashboard';

const outlineBtn =
  'inline-flex items-center gap-1.5 rounded-full border border-[#D5D0C6] bg-white px-3 py-2 text-xs font-semibold text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2] transition-colors';

export function BookkeepingConnectionsPage() {
  const [banks, setBanks] = useState<BankConnection[]>(BANK_CONNECTIONS);
  const [available, setAvailable] = useState(AVAILABLE_BANKS);
  const [emails, setEmails] = useState<EmailConnection[]>(EMAIL_CONNECTIONS);
  const [uploads] = useState<StatementUpload[]>(STATEMENT_UPLOADS);

  const connectBank = (bankCode: BankCode, bankName: string) => {
    setAvailable((prev) => prev.filter((b) => b.bankCode !== bankCode));
    setBanks((prev) => [
      ...prev,
      {
        id: `bank-${bankCode.toLowerCase()}`,
        entityId: 'ent-acme',
        bankName,
        bankCode,
        accountNumberMasked: 'XXXXXX0000',
        accountType: 'Current',
        status: 'syncing',
        lastSyncedAt: 'Just now',
        balance: '₹0',
      },
    ]);
  };

  const connectEmail = (provider: 'gmail' | 'outlook') => {
    setEmails((prev) => {
      if (prev.some((e) => e.provider === provider && e.status === 'connected')) return prev;
      const next: EmailConnection = {
        id: `email-${provider}`,
        provider,
        email: provider === 'gmail' ? 'accounts@acmeretail.in' : 'books@acmeretail.in',
        status: 'connected',
        lastSyncedAt: 'Just now',
        invoicesFetched: 0,
      };
      return [...prev.filter((e) => e.provider !== provider), next];
    });
  };

  const gmail = emails.find((e) => e.provider === 'gmail');
  const outlook = emails.find((e) => e.provider === 'outlook');

  return (
    <div>
      <PageHeader
        title="Connections"
        description="Link bank accounts, sync email invoices, or upload statements."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] text-[#B89E6B]">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0E1217]">Bank accounts</h3>
              <p className="text-[11px] text-[#6B7580]">HDFC, ICICI, Axis &amp; more</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {banks.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-[#D5D0C6] bg-[#F4F2EE] px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0E1217]">
                        {b.bankCode}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[#6B7580]">
                      {b.accountType} · {b.accountNumberMasked}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold text-[#B89E6B]">
                    {b.balance}
                  </span>
                </div>
                {b.lastSyncedAt && (
                  <div className="mt-1 font-mono text-[10px] text-[#6B7580]">
                    Synced {b.lastSyncedAt}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {available.length > 0 && (
            <div className="mt-3 border-t border-[#EBE8E2] pt-3">
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B7580]">
                Connect another bank
              </div>
              <div className="flex flex-wrap gap-2">
                {available.map((b) => (
                  <button
                    key={b.bankCode}
                    type="button"
                    onClick={() => connectBank(b.bankCode, b.bankName)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#D5D0C6] bg-white px-2.5 py-1 text-[11px] font-mono font-semibold text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]"
                  >
                    <Link2 className="h-3 w-3" />
                    {b.bankCode}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] text-[#B89E6B]">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0E1217]">Email sync</h3>
              <p className="text-[11px] text-[#6B7580]">Pull invoices from inbox</p>
            </div>
          </div>

          <div className="space-y-3">
            {(['gmail', 'outlook'] as const).map((provider) => {
              const conn = provider === 'gmail' ? gmail : outlook;
              const label = provider === 'gmail' ? 'Gmail' : 'Outlook';
              return (
                <div
                  key={provider}
                  className="rounded-xl border border-[#D5D0C6] bg-[#F4F2EE] px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#0E1217]">{label}</span>
                    {conn?.status === 'connected' ? (
                      <StatusBadge status="connected" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => connectEmail(provider)}
                        className="rounded-full bg-[#0E1217] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#1E2630]"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                  {conn?.status === 'connected' && (
                    <p className="mt-1.5 font-mono text-[11px] text-[#6B7580]">
                      {conn.email} · {conn.invoicesFetched} invoices · synced{' '}
                      {conn.lastSyncedAt}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D5D0C6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5D0C6] bg-[#EBE8E2] text-[#B89E6B]">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0E1217]">Upload statement</h3>
              <p className="text-[11px] text-[#6B7580]">PDF, CSV or Excel</p>
            </div>
          </div>

          <div className="mb-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D0C6] bg-[#F4F2EE] px-4 py-6 text-center">
            <Upload className="mb-2 h-5 w-5 text-[#6B7580]" />
            <p className="text-xs text-[#5C6570]">Drop bank statement here</p>
            <button type="button" className={`${outlineBtn} mt-3`}>
              Browse files
            </button>
          </div>

          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="flex items-start justify-between gap-2 border-b border-[#EBE8E2] pb-2 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-[#0E1217]">{u.fileName}</div>
                  <div className="font-mono text-[10px] text-[#6B7580]">
                    {u.bankName} · {u.periodLabel} · {u.transactionsFound} txns
                  </div>
                </div>
                <StatusBadge status={u.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
