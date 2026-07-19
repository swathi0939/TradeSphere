import type { MarketIndex, Stock } from '@/types';
import { CRYPTO_ASSETS, COMMODITY_ASSETS, FOREX_ASSETS, MARKET_INDICES, STOCK_UNIVERSE, type TickerAsset } from './stockUniverse';
import { delay } from './mockUtils';

export async function getStocks(): Promise<Stock[]> {
  return delay(STOCK_UNIVERSE);
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
  return delay(STOCK_UNIVERSE.find((s) => s.symbol === symbol) ?? null, 200);
}

export async function searchStocks(query: string): Promise<Stock[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay([], 150);
  return delay(
    STOCK_UNIVERSE.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)),
    200,
  );
}

export async function getTopGainers(limit = 5): Promise<Stock[]> {
  const sorted = [...STOCK_UNIVERSE].sort((a, b) => b.changePercent - a.changePercent);
  return delay(sorted.slice(0, limit));
}

export async function getTopLosers(limit = 5): Promise<Stock[]> {
  const sorted = [...STOCK_UNIVERSE].sort((a, b) => a.changePercent - b.changePercent);
  return delay(sorted.slice(0, limit));
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  return delay(MARKET_INDICES);
}

export async function getCryptoAssets(): Promise<TickerAsset[]> {
  return delay(CRYPTO_ASSETS);
}

export async function getForexAssets(): Promise<TickerAsset[]> {
  return delay(FOREX_ASSETS);
}

export async function getCommodityAssets(): Promise<TickerAsset[]> {
  return delay(COMMODITY_ASSETS);
}

export async function getStocksBySector(sector: string): Promise<Stock[]> {
  return delay(STOCK_UNIVERSE.filter((s) => s.sector === sector));
}

export function getAllSectors(): string[] {
  return Array.from(new Set(STOCK_UNIVERSE.map((s) => s.sector)));
}

/**
 * Subscribes to a lightweight live-tick simulation for a set of stocks,
 * nudging price/change values at random intervals. Mirrors the landing
 * page's live-ticker approach for a consistent "real-time" feel.
 */
export function subscribeToLiveTicks(symbols: string[], onTick: (updates: Map<string, Stock>) => void, intervalMs = 2500): () => void {
  const id = setInterval(() => {
    const updates = new Map<string, Stock>();
    symbols.forEach((symbol) => {
      const stock = STOCK_UNIVERSE.find((s) => s.symbol === symbol);
      if (!stock) return;
      const drift = (Math.random() - 0.5) * (stock.price * 0.004);
      const newPrice = Number((stock.price + drift).toFixed(2));
      const change = Number((newPrice - stock.prevClose).toFixed(2));
      const changePercent = Number(((change / stock.prevClose) * 100).toFixed(2));
      stock.price = newPrice;
      stock.change = change;
      stock.changePercent = changePercent;
      stock.sparkline = [...stock.sparkline.slice(1), newPrice];
      updates.set(symbol, { ...stock });
    });
    onTick(updates);
  }, intervalMs);

  return () => clearInterval(id);
}
