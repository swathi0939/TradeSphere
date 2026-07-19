import { useAsync } from '@/hooks/useAsync';
import { getRiskAnalytics } from '@/services/riskAnalyticsService';

export function useRiskAnalytics(days = 180) {
  return useAsync(() => getRiskAnalytics(days), [days]);
}
