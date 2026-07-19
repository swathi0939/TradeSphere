import { memo, useState } from 'react';
import { Star, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/Card';
import { MiniSparkline } from '@/components/charts/MiniSparkline';
import { MarketExplainerModal } from '@/features/market-explainer/MarketExplainerModal';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { formatCurrency } from '@/services/mockUtils';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/helpers';
import type { Stock } from '@/types';

interface MarketCardProps {
  stock: Stock;
  className?: string;
}

/** Stock card with price, change, sparkline, a watchlist star toggle, and an AI move-explainer trigger.
 * Memoized — rendered in grids of dozens re-rendered on every keystroke/tab switch elsewhere on the page. */
export const MarketCard = memo(function MarketCard({ stock, className }: MarketCardProps) {
  const { isWatched, toggleWatch } = useWatchlist();
  const [explainerOpen, setExplainerOpen] = useState(false);
  const isUp = stock.change >= 0;
  const watched = isWatched(stock.symbol);

  return (
    <Card glass spotlight className={cn('p-4 transition-transform duration-300 ease-brand hover:-translate-y-1', className)}>
      <div className="flex items-start justify-between gap-2">
        <Link to={`${ROUTES.markets}?symbol=${stock.symbol}`} className="min-w-0">
          <p className="truncate text-[0.94rem] font-bold text-text">{stock.symbol}</p>
          <p className="truncate text-[0.76rem] text-muted">{stock.name}</p>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setExplainerOpen(true)}
            aria-label={`Explain why ${stock.symbol} is moving`}
            className="shrink-0 text-muted transition-colors hover:text-primary-text"
          >
            <Wand2 size={16} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => void toggleWatch(stock.symbol)}
            aria-label={watched ? `Remove ${stock.symbol} from watchlist` : `Add ${stock.symbol} to watchlist`}
            aria-pressed={watched}
            className={cn('shrink-0 transition-colors', watched ? 'text-[#f5c542]' : 'text-muted hover:text-[#f5c542]')}
          >
            <Star size={17} fill={watched ? 'currentColor' : 'none'} aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="tabular-figures text-[1.1rem] font-extrabold text-text">{formatCurrency(stock.price)}</p>
          <p className={cn('tabular-figures text-[0.8rem] font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
            {isUp ? '+' : ''}
            {stock.change.toFixed(2)} ({isUp ? '+' : ''}
            {stock.changePercent.toFixed(2)}%)
          </p>
        </div>
        <MiniSparkline data={stock.sparkline} positive={isUp} width={80} height={32} />
      </div>

      <MarketExplainerModal symbol={stock.symbol} name={stock.name} open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </Card>
  );
});
