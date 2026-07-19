import { useAsync } from '@/hooks/useAsync';
import { planGoal } from '@/services/goalPlannerService';
import type { GoalPlannerInput } from '@/types';

export function useGoalPlan(input: GoalPlannerInput) {
  return useAsync(() => planGoal(input), [input.targetAmount, input.targetYears, input.scenario]);
}
