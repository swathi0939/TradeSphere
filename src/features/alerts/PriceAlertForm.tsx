import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { Stock } from '@/types';
import type { AlertDirection } from '@/types/alerts';

interface PriceAlertFormProps {
  stocks: Stock[];
  onCreate: (symbol: string, targetPrice: number, direction: AlertDirection) => void;
}

const DIRECTION_OPTIONS: { value: AlertDirection; label: string }[] = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' },
];

export function PriceAlertForm({ stocks, onCreate }: PriceAlertFormProps) {
  const [symbolQuery, setSymbolQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<AlertDirection>('above');

  const matchedStock = useMemo(() => stocks.find((s) => s.symbol.toLowerCase() === symbolQuery.trim().toLowerCase()), [stocks, symbolQuery]);

  const suggestions = useMemo(() => {
    if (!symbolQuery.trim()) return [];
    const q = symbolQuery.toLowerCase();
    return stocks.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [stocks, symbolQuery]);

  const parsedPrice = Number(targetPrice);
  const canSubmit = Boolean(matchedStock) && Number.isFinite(parsedPrice) && parsedPrice > 0;

  function handleSubmit() {
    if (!matchedStock || !canSubmit) return;
    onCreate(matchedStock.symbol, parsedPrice, direction);
    setSymbolQuery('');
    setTargetPrice('');
    setDirection('above');
  }

  return (
    <Card glass className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <Input
            label="Symbol"
            placeholder="e.g. RELIANCE"
            value={symbolQuery}
            onChange={(e) => {
              setSymbolQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s.symbol}
                  type="button"
                  onMouseDown={() => {
                    setSymbolQuery(s.symbol);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-surface-2"
                >
                  <span className="text-[0.82rem] font-semibold text-text">{s.symbol}</span>
                  <span className="text-[0.72rem] text-muted">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Target price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          containerClassName="sm:w-40"
        />

        <SegmentedControl label="Alert direction" options={DIRECTION_OPTIONS} value={direction} onChange={setDirection} />

        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit}>
          Create alert
        </Button>
      </div>
    </Card>
  );
}
