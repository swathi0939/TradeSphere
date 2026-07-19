import { useAsync } from '@/hooks/useAsync';
import { getDailyBrief } from '@/services/dailyBriefService';

export function useDailyBrief(userName?: string) {
  return useAsync(() => getDailyBrief(userName), [userName]);
}
