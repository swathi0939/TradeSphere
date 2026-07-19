import { useEffect, useState } from 'react';
import { useAsync } from '@/hooks/useAsync';
import * as stocksService from '@/services/stocksService';
import type { Stock } from '@/types';

export function useStocks() {
  return useAsync(stocksService.getStocks, []);
}

export function useMarketIndices() {
  return useAsync(stocksService.getMarketIndices, []);
}

export function useTopGainers(limit = 5) {
  return useAsync(() => stocksService.getTopGainers(limit), [limit]);
}

export function useTopLosers(limit = 5) {
  return useAsync(() => stocksService.getTopLosers(limit), [limit]);
}

export function useCryptoAssets() {
  return useAsync(stocksService.getCryptoAssets, []);
}

export function useForexAssets() {
  return useAsync(stocksService.getForexAssets, []);
}

export function useCommodityAssets() {
  return useAsync(stocksService.getCommodityAssets, []);
}

export function useStockSearch(query: string) {
  return useAsync(() => stocksService.searchStocks(query), [query]);
}

/** Live-ticks a fixed set of symbols in place, for dashboard/markets/trading widgets. */
export function useLiveStocks(symbols: string[]): Map<string, Stock> {
  const [live, setLive] = useState<Map<string, Stock>>(new Map());

  useEffect(() => {
    const unsubscribe = stocksService.subscribeToLiveTicks(symbols, (updates) => {
      setLive((prev) => new Map([...prev, ...updates]));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(',')]);

  return live;
}
