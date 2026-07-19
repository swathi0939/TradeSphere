import type { ReturnScenarioKey, YearlyPoint } from '@/utils/finance';

export interface WhatIfInput {
  monthlyContribution: number;
  horizonYears: number;
  scenario: ReturnScenarioKey;
}

export interface WhatIfResult {
  projectedSeries: YearlyPoint[];
  projectedValue: number;
  baselineValue: number;
  totalContributions: number;
  totalGrowth: number;
  deltaVsBaseline: number;
}
