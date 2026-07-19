import { Activity, Gauge, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { SkeletonText } from '@/components/ui/Skeleton';
import { BarChart } from '@/components/charts/BarChart';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useRiskMetrics, useMonthlyReturns } from '@/store/useAIInsights';
import { usePerformanceHistory, useSectorAllocation } from '@/store/usePortfolio';

export default function AnalyticsPage() {
  const { data: risk, isLoading: riskLoading } = useRiskMetrics();
  const { data: monthlyReturns, isLoading: returnsLoading } = useMonthlyReturns();
  const { data: performance, isLoading: perfLoading } = usePerformanceHistory(365);
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();

  const annualReturn = monthlyReturns?.reduce((sum, m) => sum + m.returnPercent, 0) ?? 0;

  const chartPoints =
    performance?.filter((_, i) => i % 14 === 0).map((p) => ({
      label: new Date(p.date).toLocaleDateString('en-IN', { month: 'short' }),
      value: p.value,
    })) ?? [];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Deep-dive into risk, returns, and portfolio composition." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {riskLoading || !risk ? null : (
          <>
            <StatCard label="Volatility" value={`${risk.volatility.toFixed(1)}%`} icon={<Activity size={17} aria-hidden />} hint="Annualized" />
            <StatCard label="Sharpe Ratio" value={risk.sharpeRatio.toFixed(2)} icon={<Gauge size={17} aria-hidden />} hint="Risk-adjusted return" />
            <StatCard label="Beta" value={risk.beta.toFixed(2)} icon={<LineChart size={17} aria-hidden />} hint="vs. NIFTY 50" />
            <StatCard label="Max Drawdown" value={`${risk.maxDrawdown.toFixed(1)}%`} icon={<TrendingDown size={17} aria-hidden />} />
            <StatCard label="Annual Return" value={`${annualReturn.toFixed(1)}%`} changePercent={annualReturn} icon={<TrendingUp size={17} aria-hidden />} />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartWrapper title="Performance" subtitle="Portfolio value, trailing 12 months" className="xl:col-span-2">
          {perfLoading || chartPoints.length === 0 ? <SkeletonText lines={5} /> : <LineAreaChart data={chartPoints} height={260} />}
        </ChartWrapper>

        <ChartWrapper title="Sector Exposure" subtitle="Concentration by sector">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart data={allocation.map((a) => ({ label: a.sector, value: a.value, percent: a.percent, color: a.color }))} size={150} strokeWidth={20} />
          )}
        </ChartWrapper>
      </div>

      <ChartWrapper title="Monthly Returns" subtitle="Percentage return by month" className="mt-6">
        {returnsLoading || !monthlyReturns ? <SkeletonText lines={5} /> : <BarChart data={monthlyReturns.map((m) => ({ label: m.month, value: m.returnPercent }))} height={200} />}
      </ChartWrapper>

      <ChartWrapper title="Value at Risk (95%)" subtitle="Estimated maximum daily loss at 95% confidence" className="mt-6">
        {riskLoading || !risk ? (
          <SkeletonText lines={2} />
        ) : (
          <p className="text-[0.9rem] text-muted">
            At a 95% confidence level, your portfolio is not expected to lose more than{' '}
            <span className="font-bold text-danger-text">{Math.abs(risk.var95).toFixed(2)}%</span> of its value in a single day, based on historical volatility.
          </p>
        )}
      </ChartWrapper>
    </div>
  );
}
