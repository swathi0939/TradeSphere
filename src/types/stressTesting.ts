export type StressScenarioId = 'bull' | 'bear' | 'inflation' | 'recession' | 'rateShock';

export interface StressScenario {
  id: StressScenarioId;
  label: string;
  description: string;
  sectorImpact: Record<string, number>;
  defaultImpactPercent: number;
}

export interface SectorImpact {
  sector: string;
  currentValue: number;
  impactPercent: number;
  newValue: number;
  delta: number;
}

export interface StressTestResult {
  scenario: StressScenarioId;
  label: string;
  totalValueBefore: number;
  totalValueAfter: number;
  totalImpactPercent: number;
  sectorImpacts: SectorImpact[];
  aiSummary: string;
}
