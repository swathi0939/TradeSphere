export interface RiskSeriesPoint {
  label: string;
  value: number;
}

export interface AssetRiskContribution {
  symbol: string;
  name: string;
  weight: number;
  volatility: number;
  riskContributionPercent: number;
}

export interface RiskAnalytics {
  rollingVolatility: RiskSeriesPoint[];
  drawdownSeries: RiskSeriesPoint[];
  maxDrawdown: { percent: number; date: string };
  historicalVaR95: number;
  historicalVaR99: number;
  riskContributions: AssetRiskContribution[];
}
