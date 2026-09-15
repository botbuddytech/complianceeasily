import type { ConditionExpression, ConditionNode } from '../../../types/complianceTriggers';

function isLeaf(
  node: ConditionNode,
): node is { field: string; op: string; value: string | number | boolean } {
  return 'field' in node && Boolean(node.field);
}

function NodeView({
  node,
  factStatus,
}: {
  node: ConditionNode;
  factStatus?: Record<string, 'known' | 'unknown' | 'failing'>;
}) {
  if (isLeaf(node)) {
    const status = factStatus?.[node.field] ?? 'unknown';
    const color =
      status === 'known'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : status === 'failing'
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-slate-200 bg-slate-50 text-slate-700';
    return (
      <li className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] ${color}`}>
        <span className="font-semibold">{node.field}</span> {node.op}{' '}
        <span>{String(node.value)}</span>
        <span className="ml-2 opacity-70">({status})</span>
      </li>
    );
  }
  const expr = node as ConditionExpression;
  const kind = expr.all ? 'ALL' : 'ANY';
  const children = expr.all || expr.any || [];
  return (
    <li className="space-y-1.5">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
        {kind} of
      </div>
      <ul className="ml-3 space-y-1.5 border-l border-admin-border pl-3">
        {children.map((child, i) => (
          <NodeView key={i} node={child} factStatus={factStatus} />
        ))}
      </ul>
    </li>
  );
}

export function ConditionTree({
  expression,
  factStatus,
}: {
  expression: ConditionExpression | null | undefined;
  factStatus?: Record<string, 'known' | 'unknown' | 'failing'>;
}) {
  if (!expression) {
    return (
      <p className="text-xs text-admin-muted">No structured condition expression for this rule.</p>
    );
  }
  return (
    <ul className="space-y-2">
      <NodeView node={expression} factStatus={factStatus} />
    </ul>
  );
}
