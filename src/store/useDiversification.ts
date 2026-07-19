import { useAsync } from '@/hooks/useAsync';
import { getDiversificationAnalysis } from '@/services/diversificationService';

export function useDiversification() {
  return useAsync(getDiversificationAnalysis, []);
}
