import { useAsync } from '@/hooks/useAsync';
import { simulateWhatIf } from '@/services/whatIfService';
import type { WhatIfInput } from '@/types';

export function useWhatIfSimulation(input: WhatIfInput) {
  return useAsync(() => simulateWhatIf(input), [input.monthlyContribution, input.horizonYears, input.scenario]);
}
