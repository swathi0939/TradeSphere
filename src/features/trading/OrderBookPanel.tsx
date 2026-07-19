import { useMemo } from 'react';
import { Card } from '@/components/Card';
import { formatCurrency, randomInt, seededRandom } from '@/services/mockUtils';

interface OrderBookPanelProps {
  symbol: string;
  currentPrice: number;
}

/** Simulated bid/ask order book depth for the selected symbol. */
export function OrderBookPanel({ symbol, currentPrice }: OrderBookPanelProps) {
  const { bids, asks, maxQty } = useMemo(() => {
    const rng = seededRandom(Math.floor(currentPrice * 100) + symbol.length);
    const bidLevels = Array.from({ length: 6 }, (_, i) => ({
      price: Number((currentPrice * (1 - (i + 1) * 0.0015)).toFixed(2)),
      quantity: randomInt(rng, 20, 800),
    }));
    const askLevels = Array.from({ length: 6 }, (_, i) => ({
      price: Number((currentPrice * (1 + (i + 1) * 0.0015)).toFixed(2)),
      quantity: randomInt(rng, 20, 800),
    }));
    const max = Math.max(...bidLevels.map((b) => b.quantity), ...askLevels.map((a) => a.quantity));
    return { bids: bidLevels, asks: askLevels, maxQty: max };
  }, [symbol, currentPrice]);

  return (
    <Card glass className="p-5">
      <h3 className="mb-3 text-[0.95rem] font-bold text-text">Order Book</h3>
      <div className="grid grid-cols-2 gap-4 text-[0.78rem]">
        <div>
          <div className="mb-1.5 flex justify-between text-muted">
            <span>Bid Qty</span>
            <span>Price</span>
          </div>
          <div className="flex flex-col gap-1">
            {bids.map((level, i) => (
              <div key={i} className="relative flex justify-between overflow-hidden rounded-sm px-1.5 py-1">
                <div className="absolute inset-y-0 right-0 bg-[rgba(var(--primary-rgb),0.1)]" style={{ width: `${(level.quantity / maxQty) * 100}%` }} aria-hidden="true" />
                <span className="relative tabular-figures text-muted">{level.quantity}</span>
                <span className="relative tabular-figures font-semibold text-primary-text">{formatCurrency(level.price, { maximumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-muted">
            <span>Price</span>
            <span>Ask Qty</span>
          </div>
          <div className="flex flex-col gap-1">
            {asks.map((level, i) => (
              <div key={i} className="relative flex justify-between overflow-hidden rounded-sm px-1.5 py-1">
                <div className="absolute inset-y-0 left-0 bg-[rgba(255,77,79,0.1)]" style={{ width: `${(level.quantity / maxQty) * 100}%` }} aria-hidden="true" />
                <span className="relative tabular-figures font-semibold text-danger-text">{formatCurrency(level.price, { maximumFractionDigits: 2 })}</span>
                <span className="relative tabular-figures text-muted">{level.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
