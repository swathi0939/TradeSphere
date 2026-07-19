import * as portfolioService from '@/services/portfolioService';
import { clamp } from '@/utils/helpers';
import { delay } from './mockUtils';
import type { PortfolioDiagnosis, SectorConcentration } from '@/types/portfolioDoctor';

const OVER_CONCENTRATION_THRESHOLD = 30;

function computeDiversificationScore(sectorAllocation: { percent: number }[]): number {
  const hhi = sectorAllocation.reduce((sum, s) => sum + Math.pow(s.percent / 100, 2), 0);
  return Math.round(clamp((1 - hhi) * 100, 0, 100));
}

function computeGrade(healthScore: number): PortfolioDiagnosis['grade'] {
  if (healthScore >= 85) return 'A';
  if (healthScore >= 70) return 'B';
  if (healthScore >= 55) return 'C';
  if (healthScore >= 40) return 'D';
  return 'F';
}

function buildSuggestions(concentrationWarnings: SectorConcentration[], diversificationScore: number, holdingsCount: number): string[] {
  const suggestions = concentrationWarnings.map(
    (w) =>
      `${w.sector} makes up ${w.percent.toFixed(0)}% of your portfolio — consider trimming exposure below 30% for better diversification.`,
  );

  if (diversificationScore < 60) {
    suggestions.push('Your portfolio could benefit from spreading investments across more sectors.');
  } else if (concentrationWarnings.length === 0) {
    suggestions.push('Your portfolio is well diversified across sectors — nice work.');
  }

  if (holdingsCount < 5) {
    suggestions.push(
      `You currently hold only ${holdingsCount} stock${holdingsCount === 1 ? '' : 's'} — adding a few more positions can further reduce single-stock risk.`,
    );
  }

  return suggestions;
}

/** Computes a real portfolio health diagnosis from actual holdings/sector allocation — no random stubs. */
export async function getPortfolioDiagnosis(): Promise<PortfolioDiagnosis> {
  const [holdings, sectorAllocation] = await Promise.all([portfolioService.getHoldings(), portfolioService.getSectorAllocation()]);

  const diversificationScore = computeDiversificationScore(sectorAllocation);

  const concentrationWarnings: SectorConcentration[] = sectorAllocation
    .filter((s) => s.percent > OVER_CONCENTRATION_THRESHOLD)
    .map((s) => ({ sector: s.sector, percent: s.percent, isOverConcentrated: true }));

  const healthScore = Math.round(clamp(diversificationScore - concentrationWarnings.length * 8, 0, 100));
  const grade = computeGrade(healthScore);
  const suggestions = buildSuggestions(concentrationWarnings, diversificationScore, holdings.length);

  return delay({
    healthScore,
    grade,
    diversificationScore,
    concentrationWarnings,
    suggestions,
    sectorBreakdown: sectorAllocation,
  });
}
