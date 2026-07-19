import type { WatchlistGroup } from '@/types/alerts';
import { delay, generateId } from './mockUtils';

const STORAGE_KEY = 'tradesphere-watchlist-groups';

function defaultGroups(): WatchlistGroup[] {
  return [{ id: generateId('wg'), name: 'My Favorites', symbols: ['RELIANCE', 'TCS'], createdAt: new Date().toISOString() }];
}

function readGroups(): WatchlistGroup[] {
  if (typeof window === 'undefined') return defaultGroups();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultGroups();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WatchlistGroup[]) : defaultGroups();
  } catch {
    return defaultGroups();
  }
}

function writeGroups(groups: WatchlistGroup[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export async function getWatchlistGroups(): Promise<WatchlistGroup[]> {
  return delay(readGroups());
}

export async function createWatchlistGroup(name: string): Promise<WatchlistGroup[]> {
  const groups = readGroups();
  groups.push({ id: generateId('wg'), name, symbols: [], createdAt: new Date().toISOString() });
  writeGroups(groups);
  return delay(groups, 150);
}

export async function deleteWatchlistGroup(id: string): Promise<WatchlistGroup[]> {
  const groups = readGroups().filter((g) => g.id !== id);
  writeGroups(groups);
  return delay(groups, 150);
}

export async function addSymbolToGroup(groupId: string, symbol: string): Promise<WatchlistGroup[]> {
  const groups = readGroups().map((g) => (g.id === groupId && !g.symbols.includes(symbol) ? { ...g, symbols: [...g.symbols, symbol] } : g));
  writeGroups(groups);
  return delay(groups, 150);
}

export async function removeSymbolFromGroup(groupId: string, symbol: string): Promise<WatchlistGroup[]> {
  const groups = readGroups().map((g) => (g.id === groupId ? { ...g, symbols: g.symbols.filter((s) => s !== symbol) } : g));
  writeGroups(groups);
  return delay(groups, 150);
}
