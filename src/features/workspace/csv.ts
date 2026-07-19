import type { Holding } from '@/types';
import { STOCK_UNIVERSE } from '@/services/stockUniverse';

export function toCsv(holdings: Holding[]): string {
  const header = 'symbol,name,quantity,avgPrice,currentPrice';
  const rows = holdings.map((h) => `${h.symbol},"${h.name}",${h.quantity},${h.avgPrice},${h.currentPrice}`);
  return [header, ...rows].join('\n');
}

export interface ParsedCsvRow {
  symbol: string;
  quantity: number;
  avgPrice: number;
  matched: boolean;
}

export function parseCsv(text: string): ParsedCsvRow[] {
  const knownSymbols = new Set(STOCK_UNIVERSE.map((s) => s.symbol));
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  const hasHeader = lines.length > 0 && lines[0]!.toLowerCase().includes('symbol');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const [rawSymbol = '', rawQuantity = '', rawAvgPrice = ''] = line.split(',');
    const symbol = rawSymbol.trim().toUpperCase();
    const parsedQuantity = Number(rawQuantity.trim());
    const parsedAvgPrice = Number(rawAvgPrice.trim());
    return {
      symbol,
      quantity: Number.isNaN(parsedQuantity) ? 0 : parsedQuantity,
      avgPrice: Number.isNaN(parsedAvgPrice) ? 0 : parsedAvgPrice,
      matched: knownSymbols.has(symbol),
    };
  });
}
