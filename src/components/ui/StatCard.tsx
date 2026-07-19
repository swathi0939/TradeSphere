import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/Card';
import { cn } from '@/utils/helpers';

interface StatCardProps {
  label: string;
  value: string;
  changePercent?: number;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}

/** KPI stat card — value, optional up/down change badge, icon. Used across Dashboard/Portfolio/Analytics. */
export function StatCard({ label, value, changePercent, icon, hint, className }: StatCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <Card glass spotlight className={cn('p-4 transition-transform duration-300 ease-brand hover:-translate-y-1 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.82rem] font-medium text-muted">{label}</p>
        {icon && <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[rgba(var(--primary-rgb),0.1)] text-primary">{icon}</div>}
      </div>
      {/* Truncates with an ellipsis as a safety net — without it, text that overflows
          its grid cell isn't clipped by anything, so the next card's opaque
          background silently paints over it instead of visibly wrapping/hiding it. */}
      <p className="tabular-figures mt-3 truncate text-[1.05rem] font-extrabold tracking-[-0.02em] text-text sm:text-[1.4rem] lg:text-[1.65rem]">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        {changePercent !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.76rem] font-semibold',
              isPositive ? 'bg-[rgba(var(--primary-rgb),0.12)] text-primary-text' : 'bg-[rgba(255,77,79,0.12)] text-danger-text',
            )}
          >
            {isPositive ? <TrendingUp size={13} aria-hidden /> : <TrendingDown size={13} aria-hidden />}
            {isPositive ? '+' : ''}
            {changePercent.toFixed(2)}%
          </span>
        )}
        {hint && <span className="text-[0.76rem] text-muted">{hint}</span>}
      </div>
    </Card>
  );
}
