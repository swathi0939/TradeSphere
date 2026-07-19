import { useAsync } from '@/hooks/useAsync';
import * as portfolioService from '@/services/portfolioService';

export function usePortfolioSummary() {
  return useAsync(portfolioService.getPortfolioSummary, []);
}

export function useHoldings() {
  return useAsync(portfolioService.getHoldings, []);
}

export function useSectorAllocation() {
  return useAsync(portfolioService.getSectorAllocation, []);
}

export function usePerformanceHistory(days = 90) {
  return useAsync(() => portfolioService.getPerformanceHistory(days), [days]);
}

export function useOpenPositions() {
  return useAsync(portfolioService.getOpenPositions, []);
}
