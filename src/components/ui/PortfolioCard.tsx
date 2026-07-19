import { Card } from '@/components/Card';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { Holding } from '@/types';

interface PortfolioCardProps {
  holding: Holding;
  className?: string;
}

/** Compact holding summary card — quantity, avg price, current value, P&L. */
export function PortfolioCard({ holding, className }: PortfolioCardProps) {
  const isProfit = holding.pnl >= 0;

  return (
    <Card glass spotlight className={cn('p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[0.94rem] font-bold text-text">{holding.symbol}</p>
          <p className="truncate text-[0.76rem] text-muted">{holding.sector}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[0.72rem] font-semibold',
            isProfit ? 'bg-[rgba(var(--primary-rgb),0.12)] text-primary-text' : 'bg-[rgba(255,77,79,0.12)] text-danger-text',
          )}
        >
          {isProfit ? '+' : ''}
          {holding.pnlPercent.toFixed(2)}%
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-[0.8rem]">
        <div>
          <p className="text-muted">Qty</p>
          <p className="tabular-figures font-semibold text-text">{holding.quantity}</p>
        </div>
        <div className="text-right">
          <p className="text-muted">Avg. Price</p>
          <p className="tabular-figures font-semibold text-text">{formatCurrency(holding.avgPrice)}</p>
        </div>
        <div>
          <p className="text-muted">Current Value</p>
          <p className="tabular-figures font-semibold text-text">{formatCurrency(holding.currentValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-muted">P&amp;L</p>
          <p className={cn('tabular-figures font-semibold', isProfit ? 'text-primary-text' : 'text-danger-text')}>
            {isProfit ? '+' : ''}
            {formatCurrency(holding.pnl)}
          </p>
        </div>
      </div>
    </Card>
  );
}
