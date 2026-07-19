import { useAsync } from '@/hooks/useAsync';
import * as newsService from '@/services/newsService';

export function useNews(limit = 8) {
  return useAsync(() => newsService.getNews(limit), [limit]);
}
