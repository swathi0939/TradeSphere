import { useAsync } from '@/hooks/useAsync';
import { runStressTest } from '@/services/stressTestingService';
import type { StressScenarioId } from '@/types';

export function useStressTestResult(scenarioId: StressScenarioId) {
  return useAsync(() => runStressTest(scenarioId), [scenarioId]);
}
