import { useDeferredValue, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { AllocationBar } from '@/components/ui/AllocationBar';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { Badge } from '@/components/Badge';
import { SectorTargetSliders } from '@/features/rebalancer/SectorTargetSliders';
import { useSectorAllocation } from '@/store/usePortfolio';
import { useRebalancePlan } from '@/store/useRebalancer';
import { computeIdealAllocation } from '@/utils/allocation';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { RebalanceAction, RebalanceTarget } from '@/types/rebalancer';

const ACTION_VARIANT: Record<RebalanceAction['action'], 'solid' | 'outline-primary' | 'outline-accent'> = {
  BUY: 'solid',
  SELL: 'outline-accent',
  HOLD: 'outline-accent',
};

export default function RebalancerPage() {
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();
  const [targets, setTargets] = useState<RebalanceTarget[] | null>(null);

  useEffect(() => {
    if (allocation && !targets) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargets(computeIdealAllocation(allocation.map((a) => ({ sector: a.sector, value: a.value }))));
    }
  }, [allocation, targets]);

  const deferredTargets = useDeferredValue(targets);
  const { data } = useRebalancePlan(deferredTargets ?? undefined);
  const isStale = targets !== deferredTargets;

  function handleTargetChange(sector: string, value: number) {
    setTargets((prev) => (prev ? prev.map((t) => (t.sector === sector ? { ...t, targetPercent: value } : t)) : prev));
  }

  if (allocationLoading || !allocation || !targets) {
    return (
      <div>
        <PageHeader
          title="AI Portfolio Rebalancer"
          subtitle="Adjust your target sector weights and see exactly what to buy or sell to get there."
        />
        <SkeletonCard />
        <div className="mt-6">
          <SkeletonText lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="AI Portfolio Rebalancer"
        subtitle="Adjust your target sector weights and see exactly what to buy or sell to get there."
      />

      <SectorTargetSliders
        sectors={allocation.map((a) => ({ sector: a.sector, currentPercent: a.percent }))}
        targets={targets}
        onTargetChange={handleTargetChange}
      />

      <div className={cn('mt-6 transition-opacity', isStale && 'opacity-60')}>
        {!data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total to Buy" value={formatCurrency(data.totalBuyValue)} />
            <StatCard label="Total to Sell" value={formatCurrency(data.totalSellValue)} />
            <StatCard label="Rebalance Score" value={`${data.rebalanceScore}/100`} />
          </div>
        )}

        <ChartWrapper title="Current vs. Target Allocation" className="mt-6">
          {!data ? (
            <SkeletonText lines={5} />
          ) : (
            <div className="flex flex-col gap-4">
              {data.actions.map((action) => (
                <AllocationBar
                  key={action.sector}
                  sector={action.sector}
                  currentPercent={action.currentPercent}
                  targetPercent={action.targetPercent}
                  deltaValue={action.deltaValue}
                />
              ))}
            </div>
          )}
        </ChartWrapper>

        <ChartWrapper title="Suggested Actions" className="mt-6">
          {!data ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.actions.map((action) => (
                <div key={action.sector} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">{action.sector}</span>
                    <Badge variant={ACTION_VARIANT[action.action]} active={action.action !== 'HOLD'}>
                      {action.action}
                    </Badge>
                  </div>
                  <p className="mt-2.5 text-[0.85rem] text-muted">{formatCurrency(action.deltaValue)}</p>
                </div>
              ))}
            </div>
          )}
        </ChartWrapper>
      </div>
    </div>
  );
}
