import type { ReturnScenarioKey, YearlyPoint } from '@/utils/finance';

export interface GoalPreset {
  id: string;
  label: string;
  defaultTargetAmount: number;
  defaultYears: number;
}

export interface GoalPlannerInput {
  targetAmount: number;
  targetYears: number;
  scenario: ReturnScenarioKey;
}

export interface GoalPlan {
  requiredMonthlyContribution: number;
  projectedSeries: YearlyPoint[];
  feasibilityScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  targetYear: number;
  suggestions: string[];
}
