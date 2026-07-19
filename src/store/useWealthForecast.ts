import { useAsync } from '@/hooks/useAsync';
import { getWealthForecast } from '@/services/wealthForecastService';
import type { ForecastScenario } from '@/types';

export function useWealthForecast(scenario: ForecastScenario) {
  return useAsync(() => getWealthForecast(scenario), [scenario]);
}
