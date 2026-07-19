import { useAsync } from '@/hooks/useAsync';
import * as aiService from '@/services/aiService';

export function useAIInsights(limit = 6) {
  return useAsync(() => aiService.getAIInsights(limit), [limit]);
}

export function useMarketSentiment() {
  return useAsync(aiService.getMarketSentiment, []);
}

export function usePortfolioHealth() {
  return useAsync(aiService.getPortfolioHealth, []);
}

export function usePricePredictions(limit = 5) {
  return useAsync(() => aiService.getPricePredictions(limit), [limit]);
}

export function useRiskMetrics() {
  return useAsync(aiService.getRiskMetrics, []);
}

export function useMonthlyReturns() {
  return useAsync(aiService.getMonthlyReturns, []);
}
