export interface PortfolioSnapshot {
  id: string;
  name: string;
  createdAt: string;
  totalValue: number;
  totalInvested: number;
  holdingsCount: number;
}

export type SavedReportType = 'dailyBrief' | 'portfolioDiagnosis' | 'wealthForecast' | 'stressTest';

export interface SavedReport {
  id: string;
  type: SavedReportType;
  title: string;
  content: string;
  createdAt: string;
}
