import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as watchlistService from '@/services/watchlistService';
import type { Stock } from '@/types';

interface WatchlistContextValue {
  watchlist: Stock[];
  symbols: Set<string>;
  isLoading: boolean;
  isWatched: (symbol: string) => boolean;
  toggleWatch: (symbol: string) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    watchlistService
      .getWatchlist()
      .then(setWatchlist)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) watchlist service,
    // the textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const symbols = useMemo(() => new Set(watchlist.map((s) => s.symbol)), [watchlist]);
  const isWatched = useCallback((symbol: string) => symbols.has(symbol), [symbols]);

  const toggleWatch = useCallback(
    async (symbol: string) => {
      if (symbols.has(symbol)) {
        await watchlistService.removeFromWatchlist(symbol);
      } else {
        await watchlistService.addToWatchlist(symbol);
      }
      load();
    },
    [symbols, load],
  );

  const value = useMemo<WatchlistContextValue>(
    () => ({ watchlist, symbols, isLoading, isWatched, toggleWatch }),
    [watchlist, symbols, isLoading, isWatched, toggleWatch],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return ctx;
}
