import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { BarChart } from '@/components/charts/BarChart';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { usePerformanceAttribution } from '@/store/usePerformanceAttribution';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { PerformerEntry } from '@/types/performanceAttribution';

function PerformerRow({ performer }: { performer: PerformerEntry }) {
  const isUp = performer.pnlPercent >= 0;
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
      <div>
        <p className="font-semibold text-text">{performer.symbol}</p>
        <p className="text-[0.76rem] text-muted">{performer.name}</p>
      </div>
      <div className="text-right">
        <p className={cn('tabular-figures font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
          {isUp ? '+' : ''}
          {performer.pnlPercent.toFixed(2)}%
        </p>
        <p className="text-[0.74rem] text-muted">{formatCurrency(performer.pnl)}</p>
      </div>
    </div>
  );
}

export default function PerformanceAttributionPage() {
  const { data, isLoading } = usePerformanceAttribution();

  return (
    <div>
      <PageHeader
        title="Performance Attribution"
        subtitle="What's actually driving your returns — by stock, by sector, and against the benchmark."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Best Performers">
          <div className="flex flex-col gap-3">
            {isLoading || !data
              ? Array.from({ length: 3 }, (_, i) => <SkeletonText key={i} lines={1} />)
              : data.bestPerformers.map((p) => <PerformerRow key={p.symbol} performer={p} />)}
          </div>
        </ChartWrapper>

        <ChartWrapper title="Worst Performers">
          <div className="flex flex-col gap-3">
            {isLoading || !data
              ? Array.from({ length: 3 }, (_, i) => <SkeletonText key={i} lines={1} />)
              : data.worstPerformers.map((p) => <PerformerRow key={p.symbol} performer={p} />)}
          </div>
        </ChartWrapper>
      </div>

      <ChartWrapper title="Sector Contribution" className="mt-6">
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <BarChart data={data.sectorContribution.map((s) => ({ label: s.sector, value: s.pnl }))} />
        )}
      </ChartWrapper>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        {isLoading || !data ? (
          Array.from({ length: 2 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Realized Gains" value={formatCurrency(data.realizedGains)} />
            <StatCard label="Unrealized Gains" value={formatCurrency(data.unrealizedGains)} />
          </>
        )}
      </div>

      <ChartWrapper
        title="Performance vs. Benchmark"
        subtitle="Cumulative return advantage over a synthetic NIFTY 50 series"
        className="mt-6"
      >
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <LineAreaChart data={data.benchmark.alphaSeries} valueFormatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`} />
        )}
      </ChartWrapper>

      <Card glass className="mt-6 p-5">
        {isLoading || !data ? <SkeletonText lines={2} /> : <p className="text-[0.85rem] text-muted">{data.summary}</p>}
      </Card>
    </div>
  );
}
