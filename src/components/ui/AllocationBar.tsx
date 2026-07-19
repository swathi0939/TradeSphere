import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';

interface AllocationBarProps {
  sector: string;
  currentPercent: number;
  targetPercent: number;
  deltaValue?: number;
  className?: string;
}

const ON_TARGET_THRESHOLD_PP = 1.5; // percentage-point gap below which we call it "on target"

/** One labeled row comparing a sector's current allocation against a target —
 * a filled bar for the current weight plus a marker notch for the target,
 * used read-only by the Portfolio Health Dashboard (vs. a computed "ideal"
 * reference) and interactively by the Rebalancer (vs. a user-adjustable
 * target). */
export function AllocationBar({ sector, currentPercent, targetPercent, deltaValue, className }: AllocationBarProps) {
  const gap = currentPercent - targetPercent;
  const isOnTarget = Math.abs(gap) <= ON_TARGET_THRESHOLD_PP;
  const isOverweight = gap > 0;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3 text-[0.82rem]">
        <span className="font-semibold text-text">{sector}</span>
        <span className="tabular-figures text-muted">
          {currentPercent.toFixed(1)}% <span className="text-[0.72rem]">of {targetPercent.toFixed(1)}% target</span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', isOverweight ? 'bg-danger' : 'bg-primary')}
          style={{ width: `${Math.min(currentPercent, 100)}%` }}
        />
        <div className="absolute top-0 h-full w-0.5 bg-text/60" style={{ left: `${Math.min(targetPercent, 100)}%` }} aria-hidden />
      </div>
      <p className={cn('text-[0.74rem]', isOnTarget ? 'text-primary-text' : isOverweight ? 'text-danger-text' : 'text-accent-text')}>
        {isOnTarget
          ? 'On target'
          : deltaValue !== undefined
            ? `${isOverweight ? 'Trim' : 'Add'} ${formatCurrency(Math.abs(deltaValue), { maximumFractionDigits: 0 })} to reach target`
            : isOverweight
              ? `${gap.toFixed(1)}pp overweight`
              : `${Math.abs(gap).toFixed(1)}pp underweight`}
      </p>
    </div>
  );
}
