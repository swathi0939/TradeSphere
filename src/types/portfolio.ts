export interface PortfolioSummary {
  totalValue: number;
  todayPnl: number;
  todayPnlPercent: number;
  monthlyPnl: number;
  monthlyPnlPercent: number;
  totalInvested: number;
  availableBalance: number;
  totalReturns: number;
  returnsPercent: number;
  openPositionsCount: number;
}

export interface Holding {
  symbol: string;
  name: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayChangePercent: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percent: number;
  color: string;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}
