import * as portfolioService from '@/services/portfolioService';
import { delay, formatCurrency } from './mockUtils';
import type { SectorImpact, StressScenario, StressScenarioId, StressTestResult } from '@/types';

const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'bull',
    label: 'Bull Market',
    description: 'Broad-based rally across risk assets.',
    sectorImpact: {
      'IT Services': 22,
      Technology: 25,
      Banking: 15,
      Automobile: 18,
      'Consumer Goods': 14,
      FMCG: 10,
      Pharma: 12,
      Energy: 16,
      Telecom: 13,
    },
    defaultImpactPercent: 15,
  },
  {
    id: 'bear',
    label: 'Bear Market',
    description: 'Broad-based selloff across risk assets.',
    sectorImpact: {
      'IT Services': -24,
      Technology: -28,
      Banking: -18,
      Automobile: -22,
      'Consumer Goods': -15,
      FMCG: -8,
      Pharma: -10,
      Energy: -16,
      Telecom: -14,
    },
    defaultImpactPercent: -20,
  },
  {
    id: 'inflation',
    label: 'High Inflation',
    description: 'Persistent inflation compresses margins in consumer-facing sectors while energy benefits.',
    sectorImpact: {
      FMCG: -12,
      'Consumer Goods': -10,
      Energy: 9,
      Banking: -4,
      Automobile: -8,
      Pharma: -3,
      'IT Services': -2,
      Technology: -2,
      Telecom: -3,
    },
    defaultImpactPercent: -5,
  },
  {
    id: 'recession',
    label: 'Recession',
    description: 'Economic contraction with defensive sectors holding up better than cyclicals.',
    sectorImpact: {
      Banking: -25,
      Automobile: -22,
      'IT Services': -14,
      Technology: -16,
      Energy: -12,
      FMCG: -6,
      Pharma: -5,
      'Consumer Goods': -18,
      Telecom: -10,
    },
    defaultImpactPercent: -15,
  },
  {
    id: 'rateShock',
    label: 'Interest Rate Shock',
    description: 'A sharp rate hike raises funding costs, hitting banks, autos, and real-estate-adjacent sectors hardest.',
    sectorImpact: {
      Banking: -16,
      Automobile: -13,
      'Consumer Goods': -9,
      'IT Services': -3,
      Technology: -4,
      FMCG: -2,
      Pharma: -2,
      Energy: -1,
      Telecom: -5,
    },
    defaultImpactPercent: -6,
  },
];

export function getStressScenarios(): StressScenario[] {
  return STRESS_SCENARIOS;
}

export async function runStressTest(scenarioId: StressScenarioId): Promise<StressTestResult> {
  const [sectorAllocation, summary] = await Promise.all([portfolioService.getSectorAllocation(), portfolioService.getPortfolioSummary()]);
  const scenario = getStressScenarios().find((s) => s.id === scenarioId) ?? getStressScenarios()[0]!;

  const sectorImpacts: SectorImpact[] = sectorAllocation.map((sector) => {
    const impactPercent = scenario.sectorImpact[sector.sector] ?? scenario.defaultImpactPercent;
    const newValue = sector.value * (1 + impactPercent / 100);
    return {
      sector: sector.sector,
      currentValue: sector.value,
      impactPercent,
      newValue,
      delta: newValue - sector.value,
    };
  });

  const totalValueBefore = summary.totalValue;
  const totalValueAfter = sectorImpacts.reduce((sum, s) => sum + s.newValue, 0);
  const totalImpactPercent = ((totalValueAfter - totalValueBefore) / totalValueBefore) * 100;

  const worstSector = sectorImpacts.reduce((worst, s) => (s.impactPercent < worst.impactPercent ? s : worst), sectorImpacts[0]!);

  const aiSummary = `Under a ${scenario.label.toLowerCase()} scenario, your portfolio could ${totalImpactPercent >= 0 ? 'gain' : 'lose'} approximately ${formatCurrency(Math.abs(totalValueAfter - totalValueBefore))} (${totalImpactPercent >= 0 ? '+' : ''}${totalImpactPercent.toFixed(1)}%), moving from ${formatCurrency(totalValueBefore)} to ${formatCurrency(totalValueAfter)}. ${worstSector.sector} would be hit hardest at ${worstSector.impactPercent}%.`;

  return delay({
    scenario: scenario.id,
    label: scenario.label,
    totalValueBefore,
    totalValueAfter,
    totalImpactPercent,
    sectorImpacts,
    aiSummary,
  });
}
