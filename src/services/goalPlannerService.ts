import * as portfolioService from '@/services/portfolioService';
import { clamp } from '@/utils/helpers';
import { projectCompoundGrowth, RETURN_SCENARIOS, solveMonthlyContribution, toYearlyPoints } from '@/utils/finance';
import { delay, formatCurrency } from './mockUtils';
import type { GoalPlan, GoalPlannerInput, GoalPreset } from '@/types';

const GOAL_PRESETS: GoalPreset[] = [
  { id: 'retirement', label: 'Retirement', defaultTargetAmount: 20000000, defaultYears: 25 },
  { id: 'home', label: 'Home Down Payment', defaultTargetAmount: 2000000, defaultYears: 5 },
  { id: 'education', label: "Child's Education", defaultTargetAmount: 5000000, defaultYears: 15 },
  { id: 'wealth', label: 'Wealth Building', defaultTargetAmount: 10000000, defaultYears: 10 },
];

export function getGoalPresets(): GoalPreset[] {
  return GOAL_PRESETS;
}

function computeGrade(feasibilityScore: number): GoalPlan['grade'] {
  if (feasibilityScore >= 85) return 'A';
  if (feasibilityScore >= 70) return 'B';
  if (feasibilityScore >= 55) return 'C';
  if (feasibilityScore >= 40) return 'D';
  return 'F';
}

function buildSuggestions(grade: GoalPlan['grade'], requiredMonthlyContribution: number, targetYears: number): string[] {
  const suggestions: string[] = [];

  if (grade === 'A' || grade === 'B') {
    suggestions.push("You're on track — this goal looks achievable at a realistic monthly contribution given your current portfolio.");
  } else {
    suggestions.push(
      `Reaching this goal requires ${formatCurrency(requiredMonthlyContribution)} per month — consider extending your timeline or increasing your monthly contribution to close the gap.`,
    );
  }

  if (targetYears < 3) {
    suggestions.push('A timeline under 3 years leaves little room to recover from a market downturn — a longer horizon reduces this risk.');
  }

  suggestions.push('Revisit this plan periodically as your income, expenses, and portfolio value change.');

  return suggestions;
}

/** Computes a real goal plan from the user's actual portfolio value — no random stubs. */
export async function planGoal(input: GoalPlannerInput): Promise<GoalPlan> {
  const summary = await portfolioService.getPortfolioSummary();

  const annualReturnPercent = RETURN_SCENARIOS[input.scenario].annualReturnPercent;
  const months = input.targetYears * 12;

  const requiredMonthlyContribution = solveMonthlyContribution({
    principal: summary.totalValue,
    targetAmount: input.targetAmount,
    annualReturnPercent,
    months,
  });

  const projectedSeries = toYearlyPoints(
    projectCompoundGrowth({
      principal: summary.totalValue,
      monthlyContribution: requiredMonthlyContribution,
      annualReturnPercent,
      months,
    }),
  );

  const affordabilityRatio = requiredMonthlyContribution / Math.max(summary.totalValue * 0.05, 1);
  const feasibilityScore = Math.round(clamp(100 - affordabilityRatio * 60, 0, 100));
  const grade = computeGrade(feasibilityScore);
  const targetYear = new Date().getFullYear() + input.targetYears;
  const suggestions = buildSuggestions(grade, requiredMonthlyContribution, input.targetYears);

  return delay({
    requiredMonthlyContribution,
    projectedSeries,
    feasibilityScore,
    grade,
    targetYear,
    suggestions,
  });
}
