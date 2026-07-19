import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { Card } from '@/components/Card';
import { BarChart } from '@/components/charts/BarChart';
import { ScenarioPicker } from '@/features/stress-testing/ScenarioPicker';
import { useStressTestResult } from '@/store/useStressTesting';
import { getStressScenarios } from '@/services/stressTestingService';
import { formatCurrency } from '@/services/mockUtils';
import type { StressScenarioId } from '@/types';

const SCENARIOS = getStressScenarios();

export default function StressTestingPage() {
  const [scenarioId, setScenarioId] = useState<StressScenarioId>('bull');
  const { data, isLoading } = useStressTestResult(scenarioId);

  return (
    <div>
      <PageHeader
        title="Scenario & Stress Testing"
        subtitle="See how your real portfolio would hold up under different macro conditions."
      />

      <ScenarioPicker scenarios={SCENARIOS} selectedId={scenarioId} onSelect={(s) => setScenarioId(s.id)} />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading || !data ? (
          Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Value Before" value={formatCurrency(data.totalValueBefore)} />
            <StatCard label="Value After" value={formatCurrency(data.totalValueAfter)} />
            <StatCard
              label="Total Impact"
              value={`${data.totalImpactPercent >= 0 ? '+' : ''}${data.totalImpactPercent.toFixed(1)}%`}
              changePercent={data.totalImpactPercent}
            />
          </>
        )}
      </div>

      <ChartWrapper title="Impact by Sector" className="mt-6">
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <BarChart data={data.sectorImpacts.map((s) => ({ label: s.sector, value: s.delta }))} />
        )}
      </ChartWrapper>

      <Card glass className="mt-6 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" aria-hidden />
          <h3 className="text-[0.95rem] font-bold text-text">AI Impact Summary</h3>
        </div>
        {isLoading || !data ? <SkeletonText lines={3} /> : <p className="text-[0.85rem] text-muted">{data.aiSummary}</p>}
      </Card>
    </div>
  );
}
