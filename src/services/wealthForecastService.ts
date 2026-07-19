import * as portfolioService from '@/services/portfolioService';
import { RETURN_SCENARIOS, projectCompoundGrowth, toYearlyPoints } from '@/utils/finance';
import { delay, formatCurrency } from './mockUtils';
import type { ForecastScenario, WealthForecast, WealthHorizonValue, WealthMilestone } from '@/types/wealthForecast';

const MILESTONE_THRESHOLDS = [1000000, 2500000, 5000000, 10000000, 25000000];
const HORIZON_YEARS = [5, 10, 20, 30];

export async function getWealthForecast(scenario: ForecastScenario = 'moderate'): Promise<WealthForecast> {
  const summary = await portfolioService.getPortfolioSummary();
  const { label, annualReturnPercent } = RETURN_SCENARIOS[scenario];

  const monthlyContribution = Number((summary.totalInvested * 0.015).toFixed(2));
  const months = 30 * 12;
  const monthly = projectCompoundGrowth({ principal: summary.totalValue, monthlyContribution, annualReturnPercent, months });
  const projectedSeries = toYearlyPoints(monthly);

  const currentYear = new Date().getFullYear();
  const milestones: WealthMilestone[] = [];
  for (const threshold of MILESTONE_THRESHOLDS) {
    const hit = monthly.find((point) => point.value >= threshold);
    if (hit) milestones.push({ year: currentYear + Math.ceil(hit.month / 12), value: threshold });
  }

  const valueAtHorizons: WealthHorizonValue[] = HORIZON_YEARS.map((years) => ({
    years,
    value: monthly[years * 12]?.value ?? monthly.at(-1)!.value,
  }));

  const narrative = `Starting from your current portfolio value of ${formatCurrency(summary.totalValue)}, a ${label.toLowerCase()} ${annualReturnPercent}% average annual return with continued reinvestment could grow to roughly ${formatCurrency(valueAtHorizons.find((v) => v.years === 10)!.value)} in 10 years and ${formatCurrency(valueAtHorizons.find((v) => v.years === 30)!.value)} in 30 years.`;

  return delay({
    scenario,
    label,
    annualReturnPercent,
    projectedSeries,
    milestones,
    valueAtHorizons,
    narrative,
  });
}
