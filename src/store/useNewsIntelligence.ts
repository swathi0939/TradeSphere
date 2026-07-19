import { useAsync } from '@/hooks/useAsync';
import { getNewsIntelligence } from '@/services/newsIntelligenceService';

export function useNewsIntelligence(limit = 20) {
  return useAsync(() => getNewsIntelligence(limit), [limit]);
}
