export type InsightAction = 'BUY' | 'SELL' | 'HOLD';

export interface AIInsight {
  id: string;
  action: InsightAction;
  symbol: string;
  name: string;
  confidence: number;
  reason: string;
  targetPrice: number;
  currentPrice: number;
  horizon: 'Short-term' | 'Medium-term' | 'Long-term';
}

export interface MarketSentiment {
  score: number;
  label: 'Very Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Very Bullish';
  fearGreedIndex: number;
  summary: string;
}

export interface PortfolioHealth {
  score: number;
  diversificationScore: number;
  riskScore: number;
  concentrationWarning?: string;
  suggestions: string[];
}

export interface PricePrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  predictedChangePercent: number;
  confidence: number;
  timeframe: string;
}

export interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  beta: number;
  maxDrawdown: number;
  var95: number;
}

export interface MonthlyReturn {
  month: string;
  returnPercent: number;
}
