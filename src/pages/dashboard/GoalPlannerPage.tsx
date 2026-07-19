import { useDeferredValue, useState } from 'react';
import { Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { GoalPresetPicker } from '@/features/goal-planner/GoalPresetPicker';
import { useGoalPlan } from '@/store/useGoalPlanner';
import { getGoalPresets } from '@/services/goalPlannerService';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import { RETURN_SCENARIOS, type ReturnScenarioKey } from '@/utils/finance';
import type { GoalPlan, GoalPreset } from '@/types';

const PRESETS = getGoalPresets();
const FIRST_PRESET = PRESETS[0]!;

const SCENARIO_OPTIONS = Object.entries(RETURN_SCENARIOS).map(([value, scenario]) => ({
  value: value as ReturnScenarioKey,
  label: scenario.label,
}));

const GRADE_BADGE_VARIANT: Record<GoalPlan['grade'], 'solid' | 'outline-primary' | 'outline-accent'> = {
  A: 'solid',
  B: 'outline-primary',
  C: 'outline-primary',
  D: 'outline-accent',
  F: 'outline-accent',
};

export default function GoalPlannerPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(FIRST_PRESET.id);
  const [targetAmount, setTargetAmount] = useState(FIRST_PRESET.defaultTargetAmount);
  const [targetYears, setTargetYears] = useState(FIRST_PRESET.defaultYears);
  const [scenario, setScenario] = useState<ReturnScenarioKey>('moderate');

  const deferredTargetAmount = useDeferredValue(targetAmount);
  const deferredTargetYears = useDeferredValue(targetYears);
  const deferredScenario = useDeferredValue(scenario);

  const { data } = useGoalPlan({ targetAmount: deferredTargetAmount, targetYears: deferredTargetYears, scenario: deferredScenario });

  const isStale = targetAmount !== deferredTargetAmount || targetYears !== deferredTargetYears || scenario !== deferredScenario;

  function handleSelectPreset(preset: GoalPreset) {
    setSelectedPresetId(preset.id);
    setTargetAmount(preset.defaultTargetAmount);
    setTargetYears(preset.defaultYears);
  }

  return (
    <div>
      <PageHeader title="AI Goal Planner" subtitle="Set a goal and see exactly what it takes to get there." />

      <div className="mb-6">
        <GoalPresetPicker presets={PRESETS} selectedId={selectedPresetId} onSelect={handleSelectPreset} />
      </div>

      <Card glass className="p-5">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Target Amount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              hint={formatCurrency(targetAmount)}
            />
            <Slider
              label="Years to Goal"
              min={1}
              max={40}
              step={1}
              value={targetYears}
              onChange={setTargetYears}
              formatValue={(v) => `${v} yr${v === 1 ? '' : 's'}`}
            />
          </div>

          <SegmentedControl label="Market Scenario" options={SCENARIO_OPTIONS} value={scenario} onChange={setScenario} />
        </div>
      </Card>

      <div className={cn('mt-6 transition-opacity', isStale && 'opacity-60')}>
        {!data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <StatCard
              label="Required Monthly Contribution"
              value={formatCurrency(data.requiredMonthlyContribution)}
              icon={<Target size={17} aria-hidden />}
              hint={`To reach your goal by ${data.targetYear}`}
            />

            <Card glass className="p-5">
              <div className="flex items-end gap-3">
                <p className="tabular-figures text-[2.4rem] font-extrabold text-text">{data.feasibilityScore}</p>
                <span className="mb-2 text-[0.82rem] text-muted">/ 100 feasibility score</span>
                <Badge variant={GRADE_BADGE_VARIANT[data.grade]} className="mb-2 ml-auto text-[0.9rem]">
                  Grade {data.grade}
                </Badge>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--danger),#f5c542,var(--primary))]"
                  style={{ width: `${data.feasibilityScore}%` }}
                />
              </div>
            </Card>
          </div>
        )}

        <ChartWrapper title="Projected Growth" subtitle="Portfolio value if you contribute the required monthly amount" className="mt-6">
          {!data ? <SkeletonText lines={5} /> : <LineAreaChart data={data.projectedSeries} height={280} />}
        </ChartWrapper>

        <ChartWrapper title="Suggestions" subtitle="Ways to improve your odds of hitting this goal" className="mt-6">
          {!data ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5 text-[0.85rem] text-muted">
              {data.suggestions.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="text-primary-text">•</span>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </ChartWrapper>
      </div>
    </div>
  );
}
