import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonText } from '@/components/ui/Skeleton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { MilestoneList } from '@/features/wealth-forecast/MilestoneList';
import { useWealthForecast } from '@/store/useWealthForecast';
import { formatCurrency } from '@/services/mockUtils';
import { RETURN_SCENARIOS } from '@/utils/finance';
import type { ForecastScenario } from '@/types';

const SCENARIO_OPTIONS = (Object.keys(RETURN_SCENARIOS) as ForecastScenario[]).map((key) => ({
  value: key,
  label: RETURN_SCENARIOS[key].label,
}));

export default function FutureWealthForecastPage() {
  const [scenario, setScenario] = useState<ForecastScenario>('moderate');
  const { data, isLoading } = useWealthForecast(scenario);

  return (
    <div>
      <PageHeader
        title="Future Wealth Forecast"
        subtitle="Long-range projections of your portfolio's growth under different market conditions."
        actions={<SegmentedControl label="Market scenario" options={SCENARIO_OPTIONS} value={scenario} onChange={setScenario} />}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }, (_, i) => <SkeletonText key={i} lines={3} />)
          : data.valueAtHorizons.map((v) => <StatCard key={v.years} label={`In ${v.years} Years`} value={formatCurrency(v.value)} />)}
      </div>

      <ChartWrapper title="30-Year Projection" subtitle={data ? `${data.label} scenario at ${data.annualReturnPercent}% annually` : undefined} className="mt-6">
        {isLoading || !data ? <SkeletonText lines={5} /> : <LineAreaChart data={data.projectedSeries} height={280} />}
      </ChartWrapper>

      <ChartWrapper title="Milestones Along the Way" subtitle="Projected net-worth thresholds reached over time" className="mt-6">
        {isLoading || !data ? <SkeletonText lines={4} /> : <MilestoneList milestones={data.milestones} />}
      </ChartWrapper>

      <Card glass className="mt-6 p-5">
        {isLoading || !data ? <SkeletonText lines={3} /> : <p className="text-[0.85rem] text-muted">{data.narrative}</p>}
      </Card>
    </div>
  );
}
