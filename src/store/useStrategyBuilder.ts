import { useAsync } from '@/hooks/useAsync';
import { buildStrategy } from '@/services/strategyBuilderService';
import type { StrategyBuilderInput } from '@/types/strategyBuilder';

export function useStrategyResult(input: StrategyBuilderInput) {
  return useAsync(() => buildStrategy(input), [input.template, input.riskTolerance, input.sectorFocus]);
}
