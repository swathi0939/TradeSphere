export interface WatchlistGroup {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
}

export type AlertDirection = 'above' | 'below';

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: AlertDirection;
  createdAt: string;
  triggered: boolean;
}

export type PortfolioAlertMetric = 'totalValue' | 'todayPnlPercent';

export interface PortfolioAlert {
  id: string;
  metric: PortfolioAlertMetric;
  threshold: number;
  direction: AlertDirection;
  createdAt: string;
  triggered: boolean;
}
