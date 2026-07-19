import { useAsync } from '@/hooks/useAsync';
import { getAITimeline } from '@/services/aiTimelineService';

export function useAITimeline(days = 45) {
  return useAsync(() => getAITimeline(days), [days]);
}
