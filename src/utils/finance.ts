import { clamp } from './helpers';

export type ReturnScenarioKey = 'conservative' | 'moderate' | 'aggressive';

export interface ReturnScenario {
  label: string;
  annualReturnPercent: number;
}

/** Shared Conservative/Moderate/Aggressive return assumptions — the same three
 * tiers back the What-If Simulator, Goal Planner, and Wealth Forecast so the
 * app speaks one consistent scenario language everywhere. */
export const RETURN_SCENARIOS: Record<ReturnScenarioKey, ReturnScenario> = {
  conservative: { label: 'Conservative', annualReturnPercent: 6 },
  moderate: { label: 'Moderate', annualReturnPercent: 10 },
  aggressive: { label: 'Aggressive', annualReturnPercent: 15 },
};

export interface CompoundGrowthPoint {
  month: number;
  value: number;
}

interface ProjectCompoundGrowthParams {
  principal: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  months: number;
}

/** Month-by-month compounding: each month grows by the monthly rate, then the
 * contribution lands at month-end. Month 0 is the starting principal. */
export function projectCompoundGrowth({ principal, monthlyContribution, annualReturnPercent, months }: ProjectCompoundGrowthParams): CompoundGrowthPoint[] {
  const monthlyRate = annualReturnPercent / 100 / 12;
  const series: CompoundGrowthPoint[] = [{ month: 0, value: Number(principal.toFixed(2)) }];

  let value = principal;
  for (let month = 1; month <= months; month++) {
    value = value * (1 + monthlyRate) + monthlyContribution;
    series.push({ month, value: Number(value.toFixed(2)) });
  }

  return series;
}

interface SolveMonthlyContributionParams {
  principal: number;
  targetAmount: number;
  annualReturnPercent: number;
  months: number;
}

/** Rearranges the future-value-of-annuity formula to solve for the monthly
 * contribution needed so `principal`, compounding at `annualReturnPercent`,
 * reaches `targetAmount` after `months`. Never returns a negative number —
 * a target already met by the principal alone needs no further contribution. */
export function solveMonthlyContribution({ principal, targetAmount, annualReturnPercent, months }: SolveMonthlyContributionParams): number {
  const monthlyRate = annualReturnPercent / 100 / 12;
  const principalFutureValue = principal * Math.pow(1 + monthlyRate, months);
  const shortfall = targetAmount - principalFutureValue;

  if (shortfall <= 0) return 0;

  const contribution = monthlyRate === 0 ? shortfall / months : (shortfall * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

  return Number(clamp(contribution, 0, Number.MAX_SAFE_INTEGER).toFixed(2));
}

export interface YearlyPoint {
  label: string;
  value: number;
}

/** Downsamples a monthly compound-growth series to one point per year (plus
 * the final month if it doesn't land on a year boundary), in the exact
 * `{ label, value }` shape `LineAreaChart` already accepts. */
export function toYearlyPoints(series: CompoundGrowthPoint[], startYear: number = new Date().getFullYear()): YearlyPoint[] {
  const points = series.filter((p) => p.month % 12 === 0);
  const last = series.at(-1);
  if (last && last.month % 12 !== 0) points.push(last);

  return points.map((p) => ({
    label: `${startYear + Math.round(p.month / 12)}`,
    value: p.value,
  }));
}
