export type StrategyTemplateId = 'growth' | 'value' | 'dividend' | 'momentum' | 'balanced';

export interface StrategyTemplate {
  id: StrategyTemplateId;
  label: string;
  description: string;
}

export interface StrategyBuilderInput {
  template: StrategyTemplateId;
  riskTolerance: number; // 1-10
  sectorFocus: string | 'all';
}

export interface StrategyMatch {
  symbol: string;
  name: string;
  sector: string;
  score: number;
  rationale: string;
}

export interface StrategyResult {
  matches: StrategyMatch[];
  summary: string;
}
