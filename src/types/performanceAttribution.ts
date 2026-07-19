export interface PerformerEntry {
  symbol: string;
  name: string;
  pnlPercent: number;
  pnl: number;
}

export interface SectorContribution {
  sector: string;
  pnl: number;
  contributionPercent: number;
}

export interface BenchmarkComparison {
  alphaSeries: { label: string; value: number }[];
  portfolioReturnPercent: number;
  benchmarkReturnPercent: number;
}

export interface PerformanceAttribution {
  bestPerformers: PerformerEntry[];
  worstPerformers: PerformerEntry[];
  sectorContribution: SectorContribution[];
  realizedGains: number;
  unrealizedGains: number;
  benchmark: BenchmarkComparison;
  summary: string;
}
