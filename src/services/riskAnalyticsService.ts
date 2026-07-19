import * as portfolioService from '@/services/portfolioService';
import { STOCK_UNIVERSE } from '@/services/stockUniverse';
import { computeDrawdownSeries, computeHistoricalVaR, computeReturns, computeRollingVolatility, computeStdDev } from '@/utils/statistics';
import { delay } from './mockUtils';
import type { AssetRiskContribution, RiskAnalytics, RiskSeriesPoint } from '@/types/riskAnalytics';

const ROLLING_VOLATILITY_WINDOW = 30;
const DRAWDOWN_DOWNSAMPLE_STRIDE = 3;

function formatLabel(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function buildRollingVolatility(values: number[], performance: { date: string }[]): RiskSeriesPoint[] {
  const rolling = computeRollingVolatility(values, ROLLING_VOLATILITY_WINDOW);
  const alignedDates = performance.slice(performance.length - rolling.length);
  return rolling.map((value, i) => ({ label: formatLabel(alignedDates[i]!.date), value }));
}

function buildRiskContributions(holdings: Awaited<ReturnType<typeof portfolioService.getHoldings>>): AssetRiskContribution[] {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  const rawContributions = holdings
    .map((holding) => {
      const stock = STOCK_UNIVERSE.find((s) => s.symbol === holding.symbol);
      if (!stock) return null;
      const volatility = computeStdDev(computeReturns(stock.sparkline));
      const weight = holding.currentValue / totalValue;
      return { symbol: holding.symbol, name: holding.name, weight, volatility, rawScore: weight * volatility };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const totalRawScore = rawContributions.reduce((sum, c) => sum + c.rawScore, 0);

  return rawContributions
    .map((c) => ({
      symbol: c.symbol,
      name: c.name,
      weight: c.weight,
      volatility: c.volatility,
      riskContributionPercent: totalRawScore === 0 ? 0 : (c.rawScore / totalRawScore) * 100,
    }))
    .sort((a, b) => b.riskContributionPercent - a.riskContributionPercent);
}

/** Computes real portfolio risk analytics — volatility, drawdown, historical VaR, and
 * per-asset risk contribution — from actual performance history and holdings. */
export async function getRiskAnalytics(days = 180): Promise<RiskAnalytics> {
  const [performance, holdings] = await Promise.all([portfolioService.getPerformanceHistory(days), portfolioService.getHoldings()]);

  const values = performance.map((p) => p.value);
  const rollingVolatility = buildRollingVolatility(values, performance);

  const fullDrawdown = computeDrawdownSeries(values);
  const drawdownSeries: RiskSeriesPoint[] = fullDrawdown
    .map((value, i) => ({ label: formatLabel(performance[i]!.date), value }))
    .filter((_, i) => i % DRAWDOWN_DOWNSAMPLE_STRIDE === 0);

  const maxDrawdownIndex = fullDrawdown.reduce((minIdx, v, i, arr) => (v < arr[minIdx]! ? i : minIdx), 0);
  const maxDrawdown = { percent: fullDrawdown[maxDrawdownIndex]!, date: performance[maxDrawdownIndex]!.date };

  const returns = computeReturns(values);
  const historicalVaR95 = computeHistoricalVaR(returns, 0.95);
  const historicalVaR99 = computeHistoricalVaR(returns, 0.99);

  const riskContributions = buildRiskContributions(holdings);

  return delay({ rollingVolatility, drawdownSeries, maxDrawdown, historicalVaR95, historicalVaR99, riskContributions });
}
