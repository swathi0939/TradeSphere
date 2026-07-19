import type { Stock } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { delay } from './mockUtils';

const STORAGE_KEY = 'tradesphere-watchlist';
const DEFAULT_SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'TATAMOTORS', 'NVDA'];

function readSymbols(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SYMBOLS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SYMBOLS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : DEFAULT_SYMBOLS;
  } catch {
    return DEFAULT_SYMBOLS;
  }
}

function writeSymbols(symbols: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
}

export async function getWatchlist(): Promise<Stock[]> {
  const symbols = readSymbols();
  const stocks = symbols.map((s) => STOCK_UNIVERSE.find((stock) => stock.symbol === s)).filter((s): s is Stock => Boolean(s));
  return delay(stocks);
}

export async function addToWatchlist(symbol: string): Promise<string[]> {
  const symbols = readSymbols();
  if (!symbols.includes(symbol)) symbols.push(symbol);
  writeSymbols(symbols);
  return delay(symbols, 150);
}

export async function removeFromWatchlist(symbol: string): Promise<string[]> {
  const symbols = readSymbols().filter((s) => s !== symbol);
  writeSymbols(symbols);
  return delay(symbols, 150);
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  return delay(readSymbols().includes(symbol), 50);
}
