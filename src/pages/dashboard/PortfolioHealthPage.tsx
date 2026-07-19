import { Link } from 'react-router-dom';
import { HeartPulse, Activity, Gauge, LineChart, TrendingDown, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { AllocationBar } from '@/components/ui/AllocationBar';
import { ConcentrationWarnings } from '@/features/portfolio-doctor/ConcentrationWarnings';
import { usePortfolioDiagnosis } from '@/store/usePortfolioDoctor';
import { useRiskMetrics, useMonthlyReturns } from '@/store/useAIInsights';
import { usePerformanceHistory, useSectorAllocation } from '@/store/usePortfolio';
import { computeIdealAllocation } from '@/utils/allocation';
import { ROUTES } from '@/constants/routes';
import type { PortfolioDiagnosis } from '@/types/portfolioDoctor';

const GRADE_BADGE_VARIANT: Record<PortfolioDiagnosis['grade'], 'solid' | 'outline-primary' | 'outline-accent'> = {
  A: 'solid',
  B: 'outline-primary',
  C: 'outline-primary',
  D: 'outline-accent',
  F: 'outline-accent',
};

export default function PortfolioHealthPage() {
  const { data: diagnosis, isLoading: diagnosisLoading } = usePortfolioDiagnosis();
  const { data: risk, isLoading: riskLoading } = useRiskMetrics();
  const { data: monthlyReturns, isLoading: returnsLoading } = useMonthlyReturns();
  const { data: performance, isLoading: perfLoading } = usePerformanceHistory(90);
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();

  const chartPoints =
    performance?.filter((_, i) => i % 4 === 0).map((p) => ({
      label: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: p.value,
    })) ?? [];

  const targets = allocation ? computeIdealAllocation(allocation.map((a) => ({ sector: a.sector, value: a.value }))) : [];
  const targetBySector = new Map(targets.map((t) => [t.sector, t.targetPercent]));

  return (
    <div>
      <PageHeader
        title="Portfolio Health Dashboard"
        subtitle="A single-glance rollup of your portfolio's risk, returns, and allocation health."
      />

      <Card glass className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <HeartPulse size={18} className="text-primary" aria-hidden />
          <h3 className="text-[0.95rem] font-bold text-text">Overall Health</h3>
        </div>
        {diagnosisLoading || !diagnosis ? (
          <SkeletonText lines={3} />
        ) : (
          <div>
            <div className="flex items-end gap-3">
              <p className="tabular-figures text-[2.4rem] font-extrabold text-text">{diagnosis.healthScore}</p>
              <span className="mb-2 text-[0.82rem] text-muted">/ 100 health score</span>
              <Badge variant={GRADE_BADGE_VARIANT[diagnosis.grade]} className="mb-2 ml-auto text-[0.9rem]">
                Grade {diagnosis.grade}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--danger),#f5c542,var(--primary))]"
                style={{ width: `${diagnosis.healthScore}%` }}
              />
            </div>
            <p className="mt-3 text-[0.82rem] text-muted">
              Diversification score: <span className="font-semibold text-text">{diagnosis.diversificationScore}/100</span>
            </p>
          </div>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {riskLoading || !risk ? (
          Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Volatility" value={`${risk.volatility.toFixed(1)}%`} icon={<Activity size={17} aria-hidden />} hint="Annualized" />
            <StatCard label="Sharpe Ratio" value={risk.sharpeRatio.toFixed(2)} icon={<Gauge size={17} aria-hidden />} hint="Risk-adjusted return" />
            <StatCard label="Beta" value={risk.beta.toFixed(2)} icon={<LineChart size={17} aria-hidden />} hint="vs. NIFTY 50" />
            <StatCard label="Max Drawdown" value={`${risk.maxDrawdown.toFixed(1)}%`} icon={<TrendingDown size={17} aria-hidden />} />
            <StatCard label="VaR 95%" value={`${Math.abs(risk.var95).toFixed(1)}%`} icon={<ShieldAlert size={17} aria-hidden />} hint="Est. max daily loss" />
          </>
        )}
      </div>

      <Link to={ROUTES.riskAnalytics} className="mt-3 inline-block text-[0.8rem] font-semibold text-primary-text hover:underline">
        View detailed risk analytics →
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Portfolio Performance" subtitle="Last 90 days">
          {perfLoading || chartPoints.length === 0 ? <SkeletonText lines={5} /> : <LineAreaChart data={chartPoints} height={260} />}
        </ChartWrapper>

        <ChartWrapper title="Monthly Returns" subtitle="Percentage return by month">
          {returnsLoading || !monthlyReturns ? (
            <SkeletonText lines={5} />
          ) : (
            <BarChart data={monthlyReturns.map((m) => ({ label: m.month, value: m.returnPercent }))} height={220} />
          )}
        </ChartWrapper>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Allocation vs. Ideal Target" subtitle="Current weight vs. an equal-weight reference target">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <div className="flex flex-col gap-4">
              {allocation.map((a) => (
                <AllocationBar key={a.sector} sector={a.sector} currentPercent={a.percent} targetPercent={targetBySector.get(a.sector) ?? a.percent} />
              ))}
            </div>
          )}
        </ChartWrapper>

        <ChartWrapper title="Sector Breakdown" subtitle="Current allocation by sector">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart
              data={allocation.map((a) => ({ label: a.sector, value: a.value, percent: a.percent, color: a.color }))}
              centerValue={String(allocation.length)}
              centerLabel="Sectors"
            />
          )}
        </ChartWrapper>
      </div>

      <ChartWrapper title="Concentration Warnings" subtitle="Sectors exceeding the 30% concentration limit" className="mt-6">
        {diagnosisLoading || !diagnosis ? <SkeletonText lines={4} /> : <ConcentrationWarnings warnings={diagnosis.concentrationWarnings} />}
      </ChartWrapper>
    </div>
  );
}
