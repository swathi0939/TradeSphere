import * as portfolioService from '@/services/portfolioService';
import * as portfolioDoctorService from '@/services/portfolioDoctorService';
import { STOCK_UNIVERSE } from '@/services/stockUniverse';
import { computeCorrelation, computeReturns } from '@/utils/statistics';
import { delay } from './mockUtils';
import type { Holding } from '@/types';
import type { CorrelationMatrix, DiversificationAnalysis, SectorExposure } from '@/types/diversification';

const MAX_MATRIX_HOLDINGS = 8;

function buildCorrelationMatrix(holdings: Holding[]): CorrelationMatrix {
  const matched = holdings
    .map((h) => ({ holding: h, stock: STOCK_UNIVERSE.find((s) => s.symbol === h.symbol) }))
    .filter((entry): entry is { holding: Holding; stock: (typeof STOCK_UNIVERSE)[number] } => entry.stock !== undefined)
    .sort((a, b) => b.holding.currentValue - a.holding.currentValue)
    .slice(0, MAX_MATRIX_HOLDINGS);

  const symbols = matched.map((entry) => entry.holding.symbol);
  const returns = matched.map((entry) => computeReturns(entry.stock.sparkline));

  const values = symbols.map((_, i) =>
    symbols.map((_, j) => {
      if (i === j) return 1;
      return Number(computeCorrelation(returns[i]!, returns[j]!).toFixed(2));
    }),
  );

  return { symbols, values };
}

function buildSectorExposure(sectorAllocation: { sector: string; percent: number }[]): SectorExposure[] {
  return sectorAllocation.map((s) => ({
    sector: s.sector,
    percent: s.percent,
    riskLevel: s.percent > 30 ? 'high' : s.percent > 15 ? 'medium' : 'low',
  }));
}

/** Reuses `getPortfolioDiagnosis()`'s diversification score/concentration-warning math rather than
 * recomputing it — this service only adds the correlation matrix and sector-exposure view on top. */
export async function getDiversificationAnalysis(): Promise<DiversificationAnalysis> {
  const [holdings, sectorAllocation, diagnosis] = await Promise.all([
    portfolioService.getHoldings(),
    portfolioService.getSectorAllocation(),
    portfolioDoctorService.getPortfolioDiagnosis(),
  ]);

  return delay({
    correlationMatrix: buildCorrelationMatrix(holdings),
    diversificationScore: diagnosis.diversificationScore,
    concentrationWarnings: diagnosis.concentrationWarnings,
    sectorExposure: buildSectorExposure(sectorAllocation),
  });
}
