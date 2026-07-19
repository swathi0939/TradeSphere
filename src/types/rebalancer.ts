export interface RebalanceTarget {
  sector: string;
  targetPercent: number;
}

export interface RebalanceAction {
  sector: string;
  currentPercent: number;
  targetPercent: number;
  currentValue: number;
  deltaValue: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

export interface RebalancePlan {
  totalValue: number;
  actions: RebalanceAction[];
  totalBuyValue: number;
  totalSellValue: number;
  rebalanceScore: number;
}
