import { useAsync } from '@/hooks/useAsync';
import { getRebalancePlan } from '@/services/rebalancerService';
import type { RebalanceTarget } from '@/types/rebalancer';

export function useRebalancePlan(targets?: RebalanceTarget[]) {
  return useAsync(() => getRebalancePlan(targets), [targets]);
}
