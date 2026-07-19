import { useAsync } from '@/hooks/useAsync';
import { getPerformanceAttribution } from '@/services/performanceAttributionService';

export function usePerformanceAttribution(days = 180) {
  return useAsync(() => getPerformanceAttribution(days), [days]);
}
