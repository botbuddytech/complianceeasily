import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Building2,
  ExternalLink,
  Landmark,
  Mail,
  Plug,
  RefreshCw,
  Shield,
  Unplug,
} from 'lucide-react';
import { StatusBadge } from '../dashboard/StatusBadge';
import {
  getIntegrationsForEntity,
  INTEGRATION_CATEGORY_META,
  type BooksIntegration,
  type IntegrationCategory,
  type IntegrationStatus,
} from '../../data/dashboard/booksIntegrations';

type Variant = 'client' | 'admin';

const CATEGORY_ORDER: IntegrationCategory[] = ['accounting', 'bank', 'email', 'portal'];

const CATEGORY_ICON: Record<IntegrationCategory, typeof Plug> = {
  accounting: BookOpen,
  bank: Landmark,
  email: Mail,
  portal: Shield,
};

interface BooksIntegrationsPanelProps {
  entityId: string;
  entityLabel?: string;
  variant?: Variant;
}

function primaryAction(status: IntegrationStatus, category: IntegrationCategory): string {
  if (status === 'coming_soon') return 'Coming soon';
  if (status === 'syncing') return 'Syncing…';
  if (status === 'action_required') {
    return category === 'portal' ? 'Re-login' : 'Reconnect';
  }
  if (status === 'connected') {
    return 'Disconnect';
  }
  return category === 'portal' ? 'Login' : 'Connect';
}

export function BooksIntegrationsPanel({
  entityId,
  entityLabel,
  variant = 'client',
}: BooksIntegrationsPanelProps) {
  const isAdmin = variant === 'admin';
  const [items, setItems] = useState<BooksIntegration[]>(() =>
    getIntegrationsForEntity(entityId),
  );

  useEffect(() => {
    setItems(getIntegrationsForEntity(entityId));
  }, [entityId]);

  const shell = isAdmin
    ? 'border-admin-border bg-admin-surface'
    : 'border-[#D5D0C6] bg-white';
  const muted = isAdmin ? 'text-admin-muted' : 'text-[#6B7580]';
  const ink = isAdmin ? 'text-admin-text' : 'text-[#0E1217]';
  const soft = isAdmin ? 'bg-admin-bg border-admin-border' : 'bg-[#F4F2EE] border-[#D5D0C6]';
  const btn =
    isAdmin
      ? 'border-admin-border bg-admin-bg text-admin-text hover:bg-admin-surface'
      : 'border-[#D5D0C6] bg-white text-[#5C6570] hover:border-[#B89E6B] hover:bg-[#EBE8E2]';
  const btnPrimary = isAdmin
    ? 'border-admin-accent bg-admin-accent text-white hover:opacity-90'
    : 'border-[#0E1217] bg-[#0E1217] text-white hover:bg-[#1E2630]';

  const toggle = (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current || current.status === 'coming_soon' || current.status === 'syncing') return;

    if (current.status === 'connected') {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'disconnected',
                lastSyncedAt: undefined,
                detail: undefined,
              }
            : item,
        ),
      );
      return;
    }

    if (current.category === 'portal') {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'connected',
                lastSyncedAt: 'Just now',
                detail: 'Secure session active (demo)',
              }
            : item,
        ),
      );
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'syncing', lastSyncedAt: 'Just now', detail: 'Connecting…' }
          : item,
      ),
    );
    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id && item.status === 'syncing'
            ? { ...item, status: 'connected', detail: 'Linked (demo)' }
            : item,
        ),
      );
    }, 900);
  };

  const connectedCount = useMemo(
    () => items.filter((i) => i.status === 'connected' || i.status === 'syncing').length,
    [items],
  );
  const actionableCount = useMemo(
    () => items.filter((i) => i.status !== 'coming_soon').length,
    [items],
  );

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${shell}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${soft} ${
              isAdmin ? 'text-admin-muted' : 'text-[#B89E6B]'
            }`}
          >
            <Plug className="h-4 w-4" />
          </div>
          <div>
            <div className={`text-sm font-semibold ${ink}`}>
              {entityLabel ? `${entityLabel} integrations` : 'Integrations'}
            </div>
            <p className={`mt-0.5 text-xs ${muted}`}>
              Connect accounting software, banks, email, and government portals. Demo UI only —
              no live credentials are stored.
            </p>
          </div>
        </div>
        <div className={`font-mono text-xs font-semibold ${ink}`}>
          {connectedCount} / {actionableCount} active
        </div>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const meta = INTEGRATION_CATEGORY_META[category];
        const Icon = CATEGORY_ICON[category];
        const group = items.filter((i) => i.category === category);
        return (
          <section key={category} className={`rounded-xl border ${shell}`}>
            <div
              className={`flex items-center gap-2 border-b px-4 py-3 sm:px-5 ${
                isAdmin ? 'border-admin-border bg-admin-bg' : 'border-[#D5D0C6] bg-[#EBE8E2]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isAdmin ? 'text-admin-muted' : 'text-[#B89E6B]'}`} />
              <div>
                <h3 className={`text-sm font-semibold ${ink}`}>{meta.label}</h3>
                <p className={`text-[11px] ${muted}`}>{meta.blurb}</p>
              </div>
            </div>
            <ul>
              {group.map((item) => {
                const isPrimary =
                  item.status === 'disconnected' || item.status === 'action_required';
                return (
                  <li
                    key={item.id}
                    className={`flex flex-col gap-3 border-b px-4 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                      isAdmin ? 'border-admin-border' : 'border-[#EBE8E2]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${muted}`}
                        >
                          {item.code}
                        </span>
                        <span className={`text-sm font-semibold ${ink}`}>{item.name}</span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className={`mt-1 text-xs ${muted}`}>{item.description}</p>
                      {(item.detail || item.lastSyncedAt) && (
                        <p className={`mt-1 font-mono text-[11px] ${muted}`}>
                          {item.detail}
                          {item.lastSyncedAt ? ` · Synced ${item.lastSyncedAt}` : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {item.portalUrl && item.status === 'connected' && (
                        <a
                          href={item.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${btn}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open portal
                        </a>
                      )}
                      <button
                        type="button"
                        disabled={item.status === 'coming_soon' || item.status === 'syncing'}
                        onClick={() => toggle(item.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          isPrimary ? btnPrimary : btn
                        }`}
                      >
                        {item.status === 'syncing' ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : item.status === 'connected' ? (
                          <Unplug className="h-3.5 w-3.5" />
                        ) : item.category === 'portal' ? (
                          <Building2 className="h-3.5 w-3.5" />
                        ) : (
                          <Plug className="h-3.5 w-3.5" />
                        )}
                        {primaryAction(item.status, item.category)}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
