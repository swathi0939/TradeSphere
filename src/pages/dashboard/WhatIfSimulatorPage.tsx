import { useDeferredValue, useState } from 'react';
import { Wallet, TrendingUp, CalendarRange, PiggyBank } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { SkeletonText } from '@/components/ui/Skeleton';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { WhatIfControls } from '@/features/what-if-simulator/WhatIfControls';
import { useWhatIfSimulation } from '@/store/useWhatIf';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { ReturnScenarioKey } from '@/utils/finance';

export default function WhatIfSimulatorPage() {
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [horizonYears, setHorizonYears] = useState(10);
  const [scenario, setScenario] = useState<ReturnScenarioKey>('moderate');

  const deferredMonthlyContribution = useDeferredValue(monthlyContribution);
  const deferredHorizonYears = useDeferredValue(horizonYears);
  const deferredScenario = useDeferredValue(scenario);

  const { data } = useWhatIfSimulation({
    monthlyContribution: deferredMonthlyContribution,
    horizonYears: deferredHorizonYears,
    scenario: deferredScenario,
  });

  const isStale = monthlyContribution !== deferredMonthlyContribution || horizonYears !== deferredHorizonYears || scenario !== deferredScenario;

  return (
    <div>
      <PageHeader
        title="What-If Simulator"
        subtitle="Adjust the levers below to see how different scenarios could reshape your portfolio."
      />

      <WhatIfControls
        monthlyContribution={monthlyContribution}
        onMonthlyContributionChange={setMonthlyContribution}
        horizonYears={horizonYears}
        onHorizonYearsChange={setHorizonYears}
        scenario={scenario}
        onScenarioChange={setScenario}
      />

      <div className={cn('mt-6 transition-opacity', isStale && 'opacity-60')}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {!data ? (
            Array.from({ length: 4 }, (_, i) => <SkeletonText key={i} lines={3} />)
          ) : (
            <>
              <StatCard label="Projected Value" value={formatCurrency(data.projectedValue)} icon={<Wallet size={17} aria-hidden />} hint="At end of horizon" />
              <StatCard
                label="Total Contributions"
                value={formatCurrency(data.totalContributions)}
                icon={<PiggyBank size={17} aria-hidden />}
                hint="Extra invested over time"
              />
              <StatCard label="Projected Growth" value={formatCurrency(data.totalGrowth)} icon={<TrendingUp size={17} aria-hidden />} hint="Investment gains" />
              <StatCard
                label="vs. Doing Nothing"
                value={formatCurrency(data.deltaVsBaseline)}
                icon={<CalendarRange size={17} aria-hidden />}
                hint="Extra value vs. no added investment"
              />
            </>
          )}
        </div>

        <ChartWrapper title="Projected Portfolio Growth" className="mt-6">
          {!data ? <SkeletonText lines={5} /> : <LineAreaChart data={data.projectedSeries} height={280} />}
        </ChartWrapper>
      </div>
    </div>
  );
}
