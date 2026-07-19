import * as portfolioService from '@/services/portfolioService';
import * as transactionsService from '@/services/transactionsService';
import { delay, formatCurrency, hashString, randomBetween, seededRandom } from './mockUtils';
import type { PerformanceAttribution, SectorContribution } from '@/types/performanceAttribution';

export async function getPerformanceAttribution(days = 180): Promise<PerformanceAttribution> {
  const [holdings, , performance, transactions] = await Promise.all([
    portfolioService.getHoldings(),
    portfolioService.getSectorAllocation(),
    portfolioService.getPerformanceHistory(days),
    transactionsService.getTransactions(40),
  ]);

  const sortedByPnlPercentDesc = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent);
  const bestPerformers = sortedByPnlPercentDesc.slice(0, 3).map((h) => ({
    symbol: h.symbol,
    name: h.name,
    pnlPercent: h.pnlPercent,
    pnl: h.pnl,
  }));
  const worstPerformers = [...sortedByPnlPercentDesc]
    .reverse()
    .slice(0, 3)
    .map((h) => ({ symbol: h.symbol, name: h.name, pnlPercent: h.pnlPercent, pnl: h.pnl }));

  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const sectorPnl = new Map<string, number>();
  holdings.forEach((h) => sectorPnl.set(h.sector, (sectorPnl.get(h.sector) ?? 0) + h.pnl));
  const sectorContribution: SectorContribution[] = Array.from(sectorPnl.entries())
    .map(([sector, pnl]) => ({
      sector,
      pnl,
      contributionPercent: totalPnl !== 0 ? (pnl / Math.abs(totalPnl)) * 100 : 0,
    }))
    .sort((a, b) => b.pnl - a.pnl);

  const unrealizedGains = holdings.reduce((sum, h) => sum + h.pnl, 0);

  const sellGains = transactions
    .filter((txn) => txn.type === 'SELL')
    .reduce((sum, txn) => {
      const rng = seededRandom(hashString(`realized-${txn.id}`));
      const returnPercent = randomBetween(rng, -0.08, 0.22);
      return sum + txn.amount * returnPercent;
    }, 0);
  const dividendGains = transactions.filter((txn) => txn.type === 'DIVIDEND').reduce((sum, txn) => sum + txn.amount, 0);
  const realizedGains = sellGains + dividendGains;

  const benchmarkRng = seededRandom(hashString('benchmark-nifty50'));
  let benchmarkValue = 22000;
  const benchmarkValues: number[] = performance.map(() => {
    benchmarkValue *= 1 + randomBetween(benchmarkRng, -0.011, 0.014);
    return Number(benchmarkValue.toFixed(2));
  });

  const portfolioStart = performance[0]!.value;
  const portfolioEnd = performance.at(-1)!.value;
  const portfolioReturnPercent = ((portfolioEnd - portfolioStart) / portfolioStart) * 100;

  const benchmarkStart = benchmarkValues[0]!;
  const benchmarkEnd = benchmarkValues.at(-1)!;
  const benchmarkReturnPercent = ((benchmarkEnd - benchmarkStart) / benchmarkStart) * 100;

  const alphaSeries = performance
    .map((p, i) => {
      const portfolioCumulativeReturn = ((p.value - portfolioStart) / portfolioStart) * 100;
      const benchmarkCumulativeReturn = ((benchmarkValues[i]! - benchmarkStart) / benchmarkStart) * 100;
      return {
        label: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        value: Number((portfolioCumulativeReturn - benchmarkCumulativeReturn).toFixed(2)),
      };
    })
    .filter((_, i) => i % 4 === 0);

  const finalAlpha = alphaSeries.at(-1)!.value;
  const topSector = sectorContribution[0];

  const summary = topSector
    ? `Your portfolio has ${finalAlpha >= 0 ? 'outperformed' : 'underperformed'} the benchmark by ${Math.abs(finalAlpha).toFixed(2)}% over the period, led by ${topSector.sector} (${topSector.pnl >= 0 ? '+' : ''}${formatCurrency(topSector.pnl)}) and ${bestPerformers[0]?.symbol ?? 'your top holding'}.`
    : `Your portfolio has ${finalAlpha >= 0 ? 'outperformed' : 'underperformed'} the benchmark by ${Math.abs(finalAlpha).toFixed(2)}% over the period.`;

  return delay({
    bestPerformers,
    worstPerformers,
    sectorContribution,
    realizedGains,
    unrealizedGains,
    benchmark: {
      alphaSeries,
      portfolioReturnPercent,
      benchmarkReturnPercent,
    },
    summary,
  });
}
