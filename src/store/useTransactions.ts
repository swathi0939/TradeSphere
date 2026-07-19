import { useAsync } from '@/hooks/useAsync';
import * as transactionsService from '@/services/transactionsService';

export function useTransactions(limit = 20) {
  return useAsync(() => transactionsService.getTransactions(limit), [limit]);
}
