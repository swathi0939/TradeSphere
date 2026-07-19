import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { MarketCard } from '@/components/ui/MarketCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { AsyncError } from '@/components/ui/AsyncError';
import { Badge } from '@/components/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  useStocks,
  useTopGainers,
  useTopLosers,
  useMarketIndices,
  useCryptoAssets,
  useForexAssets,
  useCommodityAssets,
  useLiveStocks,
} from '@/store/useMarketData';
import { useInterval } from '@/hooks/useInterval';
import { getMarketStatus, type MarketStatusValue } from '@/utils/marketStatus';
import { cn } from '@/utils/helpers';

type Tab = 'all' | 'gainers' | 'losers' | 'indices' | 'crypto' | 'forex' | 'commodities';

const AUTO_REFRESH_SECONDS = 15;
const MARKET_STATUS_POLL_MS = 30000;

const MARKET_STATUS_BADGE: Record<MarketStatusValue, { variant: 'solid' | 'outline-primary' | 'outline-accent'; active: boolean }> = {
  open: { variant: 'solid', active: true },
  'pre-open': { variant: 'outline-accent', active: true },
  closed: { variant: 'outline-accent', active: false },
};

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Stocks' },
  { key: 'gainers', label: 'Top Gainers' },
  { key: 'losers', label: 'Top Losers' },
  { key: 'indices', label: 'Indices' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'forex', label: 'Forex' },
  { key: 'commodities', label: 'Commodities' },
];

export default function MarketsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(AUTO_REFRESH_SECONDS);
  const [marketStatus, setMarketStatus] = useState(() => getMarketStatus());

  const { data: allStocks, isLoading: stocksLoading, error: stocksError, refetch: refetchStocks } = useStocks();
  const { data: gainers, isLoading: gainersLoading, refetch: refetchGainers } = useTopGainers(12);
  const { data: losers, isLoading: losersLoading, refetch: refetchLosers } = useTopLosers(12);
  const { data: indices, isLoading: indicesLoading, refetch: refetchIndices } = useMarketIndices();
  const { data: crypto, isLoading: cryptoLoading, refetch: refetchCrypto } = useCryptoAssets();
  const { data: forex, isLoading: forexLoading, refetch: refetchForex } = useForexAssets();
  const { data: commodities, isLoading: commoditiesLoading, refetch: refetchCommodities } = useCommodityAssets();

  useInterval(() => setMarketStatus(getMarketStatus()), MARKET_STATUS_POLL_MS);

  useInterval(
    () => {
      refetchStocks();
      refetchGainers();
      refetchLosers();
      refetchIndices();
      refetchCrypto();
      refetchForex();
      refetchCommodities();
      setSecondsUntilRefresh(AUTO_REFRESH_SECONDS);
    },
    autoRefresh ? AUTO_REFRESH_SECONDS * 1000 : null,
  );

  useInterval(() => setSecondsUntilRefresh((s) => Math.max(0, s - 1)), autoRefresh ? 1000 : null);

  const filteredStocks = useMemo(() => {
    const source = tab === 'gainers' ? gainers : tab === 'losers' ? losers : allStocks;
    const list = source ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [tab, allStocks, gainers, losers, query]);

  const isLoading = tab === 'gainers' ? gainersLoading : tab === 'losers' ? losersLoading : stocksLoading;
  const showStockGrid = tab === 'all' || tab === 'gainers' || tab === 'losers';

  const liveSymbols = useMemo(() => (showStockGrid ? filteredStocks.map((s) => s.symbol) : []), [showStockGrid, filteredStocks]);
  const liveStocks = useLiveStocks(liveSymbols);

  const statusBadge = MARKET_STATUS_BADGE[marketStatus.status];

  return (
    <div>
      <PageHeader
        title="Markets"
        subtitle="Live prices across equities, indices, crypto, forex, and commodities."
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={statusBadge.variant} active={statusBadge.active}>
              {marketStatus.label}
            </Badge>
            <Checkbox
              label={
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={13} className={cn(autoRefresh && 'animate-spin')} aria-hidden />
                  Auto-refresh{autoRefresh ? ` (${secondsUntilRefresh}s)` : ''}
                </span>
              }
              checked={autoRefresh}
              onChange={(e) => {
                setAutoRefresh(e.target.checked);
                setSecondsUntilRefresh(AUTO_REFRESH_SECONDS);
              }}
            />
          </div>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
                tab === t.key ? 'bg-primary text-[#04140f]' : 'border border-border text-muted hover:text-text',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {showStockGrid && <SearchBar value={query} onChange={setQuery} placeholder="Search symbol or name…" className="sm:w-64" />}
      </div>

      {tab === 'all' && (gainersLoading || losersLoading || (gainers && gainers.length > 0) || (losers && losers.length > 0)) && (
        <ChartWrapper title="Market Movers" subtitle="Today's biggest gainers and losers" className="mb-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[0.78rem] font-semibold text-primary-text">Top Gainers</p>
              <div className="flex flex-col gap-2">
                {(gainers ?? []).slice(0, 5).map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between text-[0.85rem]">
                    <span className="font-semibold text-text">{s.symbol}</span>
                    <span className="tabular-figures font-semibold text-primary-text">
                      +{s.changePercent.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[0.78rem] font-semibold text-danger-text">Top Losers</p>
              <div className="flex flex-col gap-2">
                {(losers ?? []).slice(0, 5).map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between text-[0.85rem]">
                    <span className="font-semibold text-text">{s.symbol}</span>
                    <span className="tabular-figures font-semibold text-danger-text">{s.changePercent.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartWrapper>
      )}

      {tab === 'indices' && (
        <ChartWrapper title="Market Indices" subtitle="NIFTY, BANK NIFTY, SENSEX, NASDAQ, S&P 500" className="mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indicesLoading || !indices
              ? Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
              : indices.map((idx) => {
                  const isUp = idx.change >= 0;
                  return (
                    <div key={idx.symbol} className="rounded-lg border border-border p-4">
                      <p className="font-semibold text-text">{idx.name}</p>
                      <p className="tabular-figures mt-1 text-[1.2rem] font-bold text-text">{idx.value.toLocaleString('en-IN')}</p>
                      <p className={cn('tabular-figures text-[0.82rem] font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
                        {isUp ? '+' : ''}
                        {idx.change.toFixed(2)} ({isUp ? '+' : ''}
                        {idx.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  );
                })}
          </div>
        </ChartWrapper>
      )}

      {(tab === 'crypto' || tab === 'forex' || tab === 'commodities') && (
        <ChartWrapper
          title={tab === 'crypto' ? 'Cryptocurrency' : tab === 'forex' ? 'Forex' : 'Commodities'}
          subtitle="Indicative prices, updated periodically"
          className="mb-6"
        >
          {(() => {
            const assets = tab === 'crypto' ? crypto : tab === 'forex' ? forex : commodities;
            const loading = tab === 'crypto' ? cryptoLoading : tab === 'forex' ? forexLoading : commoditiesLoading;
            return (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading || !assets
                  ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
                  : assets.map((asset) => {
                      const isUp = asset.change >= 0;
                      return (
                        <div key={asset.symbol} className="rounded-lg border border-border p-4">
                          <p className="font-semibold text-text">{asset.name}</p>
                          <p className="tabular-figures mt-1 text-[1.2rem] font-bold text-text">
                            {asset.unit}
                            {asset.value.toLocaleString('en-IN')}
                          </p>
                          <p className={cn('tabular-figures text-[0.82rem] font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
                            {isUp ? '+' : ''}
                            {asset.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      );
                    })}
              </div>
            );
          })()}
        </ChartWrapper>
      )}

      {showStockGrid && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stocksError ? (
            <AsyncError message={stocksError} onRetry={refetchStocks} className="col-span-full" />
          ) : isLoading ? (
            Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          ) : filteredStocks.length === 0 ? (
            <p className="col-span-full py-10 text-center text-muted">No stocks match your search.</p>
          ) : (
            filteredStocks.map((stock) => <MarketCard key={stock.symbol} stock={liveStocks.get(stock.symbol) ?? stock} />)
          )}
        </div>
      )}
    </div>
  );
}
