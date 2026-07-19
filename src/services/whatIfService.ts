import * as portfolioService from '@/services/portfolioService';
import { projectCompoundGrowth, toYearlyPoints, RETURN_SCENARIOS } from '@/utils/finance';
import { delay } from './mockUtils';
import type { WhatIfInput, WhatIfResult } from '@/types';

export async function simulateWhatIf(input: WhatIfInput): Promise<WhatIfResult> {
  const summary = await portfolioService.getPortfolioSummary();
  const principal = summary.totalValue;
  const annualReturnPercent = RETURN_SCENARIOS[input.scenario].annualReturnPercent;
  const months = input.horizonYears * 12;

  const projectedSeriesMonthly = projectCompoundGrowth({
    principal,
    monthlyContribution: input.monthlyContribution,
    annualReturnPercent,
    months,
  });
  const baselineSeriesMonthly = projectCompoundGrowth({
    principal,
    monthlyContribution: 0,
    annualReturnPercent,
    months,
  });

  const projectedSeries = toYearlyPoints(projectedSeriesMonthly);
  const projectedValue = projectedSeriesMonthly.at(-1)?.value ?? principal;
  const baselineValue = baselineSeriesMonthly.at(-1)?.value ?? principal;
  const deltaVsBaseline = projectedValue - baselineValue;
  const totalContributions = input.monthlyContribution * months;
  const totalGrowth = projectedValue - principal - totalContributions;

  return delay({
    projectedSeries,
    projectedValue,
    baselineValue,
    totalContributions,
    totalGrowth,
    deltaVsBaseline,
  });
}
