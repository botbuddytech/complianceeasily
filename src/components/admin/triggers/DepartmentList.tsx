import type { GovDepartment, TriggerCategory } from '../../../types/complianceTriggers';

interface DepartmentListProps {
  items: Array<
    (GovDepartment | (TriggerCategory & { level?: string; portalUrl?: string; shortName?: string })) & {
      triggerCount: number;
    }
  >;
  selectedId: string;
  onSelect: (id: string) => void;
  mode: 'department' | 'category';
}

export function DepartmentList({ items, selectedId, onSelect, mode }: DepartmentListProps) {
  return (
    <div className="space-y-2">
      <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
        <span>{mode === 'department' ? 'Departments' : 'Categories'}</span>
        <span>{items.length}</span>
      </div>
      <div className="space-y-1.5 pr-1">
        {items.map((item) => {
          const selected = selectedId === item.id;
          const title =
            mode === 'department'
              ? ('shortName' in item && item.shortName) || item.name
              : item.name;
          const subtitle =
            mode === 'department' && 'level' in item
              ? String(item.level ?? '')
              : 'code' in item
                ? String((item as TriggerCategory).code)
                : '';
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                selected
                  ? 'border-admin-accent bg-admin-accent text-white'
                  : 'border-admin-border bg-admin-surface text-admin-text hover:bg-admin-bg'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className={`truncate text-sm font-semibold ${selected ? 'text-white' : ''}`}>
                    {title}
                  </div>
                  <div
                    className={`mt-0.5 font-mono text-[10px] uppercase tracking-wide ${
                      selected ? 'text-white/70' : 'text-admin-muted'
                    }`}
                  >
                    {subtitle}
                    {mode === 'department' && 'portalUrl' in item && item.portalUrl ? ' · portal' : ''}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    selected ? 'bg-white/20 text-white' : 'bg-admin-bg text-admin-muted'
                  }`}
                >
                  {item.triggerCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
