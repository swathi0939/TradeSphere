import { useMemo, useState } from 'react';
import { Plus, Star, X } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table } from '@/components/ui/Table';
import { SearchBar } from '@/components/ui/SearchBar';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/Button';
import { MiniSparkline } from '@/components/charts/MiniSparkline';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useStocks } from '@/store/useMarketData';
import { formatCompactNumber, formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { Stock, TableColumn } from '@/types';

export default function WatchlistPage() {
  const { watchlist, isLoading, toggleWatch } = useWatchlist();
  const { data: allStocks } = useStocks();
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const watchedSymbols = useMemo(() => new Set(watchlist.map((s) => s.symbol)), [watchlist]);
  const addableStocks = useMemo(() => {
    const list = (allStocks ?? []).filter((s) => !watchedSymbols.has(s.symbol));
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [allStocks, watchedSymbols, query]);

  const columns: TableColumn<Stock>[] = [
    {
      key: 'symbol',
      header: 'Stock',
      render: (s) => (
        <div>
          <p className="font-semibold">{s.symbol}</p>
          <p className="text-[0.76rem] text-muted">{s.name}</p>
        </div>
      ),
    },
    { key: 'price', header: 'Price', align: 'right', render: (s) => formatCurrency(s.price) },
    {
      key: 'change',
      header: 'Change',
      align: 'right',
      render: (s) => (
        <span className={cn('tabular-figures font-semibold', s.change >= 0 ? 'text-primary-text' : 'text-danger-text')}>
          {s.change >= 0 ? '+' : ''}
          {s.change.toFixed(2)} ({s.changePercent.toFixed(2)}%)
        </span>
      ),
    },
    { key: 'volume', header: 'Volume', align: 'right', render: (s) => formatCompactNumber(s.volume) },
    { key: 'chart', header: 'Chart', align: 'right', render: (s) => <MiniSparkline data={s.sparkline} positive={s.change >= 0} width={90} height={28} className="ml-auto" /> },
    {
      key: 'remove',
      header: '',
      align: 'right',
      render: (s) => (
        <button
          type="button"
          onClick={() => void toggleWatch(s.symbol)}
          aria-label={`Remove ${s.symbol} from watchlist`}
          className="text-muted transition-colors hover:text-danger"
        >
          <X size={16} aria-hidden />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Watchlist"
        subtitle="Track your favorite stocks and ETFs."
        actions={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={15} aria-hidden />
            Add Stock
          </Button>
        }
      />

      {!isLoading && watchlist.length === 0 ? (
        <EmptyState
          icon={<Star size={28} aria-hidden />}
          title="Your watchlist is empty"
          description="Add stocks to track their price movements here."
          action={
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={15} aria-hidden />
              Add Stock
            </Button>
          }
        />
      ) : (
        <Table columns={columns} data={watchlist} keyField={(s) => s.symbol} isLoading={isLoading} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add to watchlist">
        <SearchBar value={query} onChange={setQuery} placeholder="Search stocks…" className="mb-4" />
        <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
          {addableStocks.length === 0 ? (
            <p className="py-6 text-center text-[0.85rem] text-muted">No matching stocks.</p>
          ) : (
            addableStocks.map((s) => (
              <button
                key={s.symbol}
                type="button"
                onClick={() => void toggleWatch(s.symbol)}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface-2"
              >
                <div>
                  <p className="text-[0.86rem] font-semibold text-text">{s.symbol}</p>
                  <p className="text-[0.76rem] text-muted">{s.name}</p>
                </div>
                <Plus size={16} className="text-primary" aria-hidden />
              </button>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
