interface HealthScoreRingProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'client' | 'admin';
}

export function HealthScoreRing({
  score,
  label,
  size = 'md',
  variant = 'client',
}: HealthScoreRingProps) {
  const dims = size === 'sm' ? 56 : size === 'lg' ? 96 : 72;
  const stroke = size === 'sm' ? 5 : 6;
  const r = (dims - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  const color =
    score >= 85
      ? '#B89E6B'
      : score >= 70
        ? '#F79009'
        : '#F04438';

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            stroke="#D5D0C6"
            strokeWidth={stroke}
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-mono font-black ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
            } ${variant === 'admin' ? 'text-admin-text' : 'text-[#0E1217]'}`}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <div>
          <div
            className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
              variant === 'admin' ? 'text-admin-muted' : 'text-[#B89E6B]'
            }`}
          >
            Health Score
          </div>
          <div
            className={`text-sm font-medium ${
              variant === 'admin' ? 'text-admin-text' : 'text-[#5C6570]'
            }`}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
