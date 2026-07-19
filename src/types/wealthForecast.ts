import type { ReturnScenarioKey, YearlyPoint } from '@/utils/finance';

export type ForecastScenario = ReturnScenarioKey;

export interface WealthMilestone {
  year: number;
  value: number;
}

export interface WealthHorizonValue {
  years: number;
  value: number;
}

export interface WealthForecast {
  scenario: ForecastScenario;
  label: string;
  annualReturnPercent: number;
  projectedSeries: YearlyPoint[];
  milestones: WealthMilestone[];
  valueAtHorizons: WealthHorizonValue[];
  narrative: string;
}
