import type { Holding, PerformancePoint, PortfolioSummary, Position, SectorAllocation } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { daysAgoISO, delay, hashString, randomBetween, randomInt, seededRandom } from './mockUtils';

const HOLDING_SYMBOLS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'MARUTI', 'TITAN', 'SUNPHARMA', 'AAPL'];

const SECTOR_COLORS: Record<string, string> = {
  'IT Services': '#3B82F6',
  Banking: '#00C896',
  Energy: '#F5C542',
  Telecom: '#A855F7',
  Automobile: '#FF4D4F',
  'Consumer Goods': '#EC4899',
  Pharma: '#14B8A6',
  Technology: '#6366F1',
  FMCG: '#F97316',
  Other: '#8B949E',
};

function buildHoldings(): Holding[] {
  return HOLDING_SYMBOLS.map((symbol) => {
    const stock = STOCK_UNIVERSE.find((s) => s.symbol === symbol);
    if (!stock) throw new Error(`Unknown holding symbol: ${symbol}`);
    const rng = seededRandom(hashString(`holding-${symbol}`));
    const quantity = randomInt(rng, 5, 120);
    const avgPrice = Number((stock.price * randomBetween(rng, 0.82, 1.08)).toFixed(2));
    const investedValue = Number((avgPrice * quantity).toFixed(2));
    const currentValue = Number((stock.price * quantity).toFixed(2));
    const pnl = Number((currentValue - investedValue).toFixed(2));
    const pnlPercent = Number(((pnl / investedValue) * 100).toFixed(2));

    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      quantity,
      avgPrice,
      currentPrice: stock.price,
      investedValue,
      currentValue,
      pnl,
      pnlPercent,
      dayChangePercent: stock.changePercent,
    };
  });
}

export async function getHoldings(): Promise<Holding[]> {
  return delay(buildHoldings());
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const holdings = buildHoldings();
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalReturns = totalValue - totalInvested;
  const rng = seededRandom(hashString('portfolio-summary'));
  const todayPnl = Number(randomBetween(rng, -8500, 14200).toFixed(2));
  const monthlyPnl = Number((totalReturns * randomBetween(rng, 0.25, 0.55)).toFixed(2));

  return delay({
    totalValue: Number(totalValue.toFixed(2)),
    todayPnl,
    todayPnlPercent: Number(((todayPnl / totalValue) * 100).toFixed(2)),
    monthlyPnl,
    monthlyPnlPercent: Number(((monthlyPnl / totalValue) * 100).toFixed(2)),
    totalInvested: Number(totalInvested.toFixed(2)),
    availableBalance: 184320.55,
    totalReturns: Number(totalReturns.toFixed(2)),
    returnsPercent: Number(((totalReturns / totalInvested) * 100).toFixed(2)),
    openPositionsCount: randomInt(rng, 3, 9),
  });
}

export async function getSectorAllocation(): Promise<SectorAllocation[]> {
  const holdings = buildHoldings();
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const bySector = new Map<string, number>();
  holdings.forEach((h) => bySector.set(h.sector, (bySector.get(h.sector) ?? 0) + h.currentValue));

  const allocation = Array.from(bySector.entries()).map(([sector, value]) => ({
    sector,
    value: Number(value.toFixed(2)),
    percent: Number(((value / totalValue) * 100).toFixed(1)),
    color: SECTOR_COLORS[sector] ?? SECTOR_COLORS.Other!,
  }));

  return delay(allocation.sort((a, b) => b.value - a.value));
}

export async function getPerformanceHistory(days = 90): Promise<PerformancePoint[]> {
  const rng = seededRandom(hashString(`performance-${days}`));
  const points: PerformancePoint[] = [];
  let value = 620000;
  for (let i = days; i >= 0; i--) {
    value *= 1 + randomBetween(rng, -0.012, 0.016);
    points.push({ date: daysAgoISO(i), value: Number(value.toFixed(2)) });
  }
  return delay(points);
}

export async function getOpenPositions(): Promise<Position[]> {
  const rng = seededRandom(hashString('open-positions'));
  const symbols = ['NIFTY50', 'BANKNIFTY', 'TATAMOTORS', 'WIPRO', 'ADANIENT'];
  const positions: Position[] = symbols.map((symbol) => {
    const stock = STOCK_UNIVERSE.find((s) => s.symbol === symbol);
    const basePrice = stock?.price ?? randomBetween(rng, 200, 3000);
    const avgPrice = Number((basePrice * randomBetween(rng, 0.95, 1.05)).toFixed(2));
    const currentPrice = Number((basePrice * randomBetween(rng, 0.97, 1.03)).toFixed(2));
    const quantity = randomInt(rng, 1, 40);
    const side = rng() > 0.3 ? 'LONG' : 'SHORT';
    const pnl = Number(((currentPrice - avgPrice) * quantity * (side === 'LONG' ? 1 : -1)).toFixed(2));
    return {
      id: `pos_${symbol}`,
      symbol,
      name: stock?.name ?? symbol,
      side,
      quantity,
      avgPrice,
      currentPrice,
      pnl,
      pnlPercent: Number(((pnl / (avgPrice * quantity)) * 100).toFixed(2)),
    };
  });
  return delay(positions);
}
