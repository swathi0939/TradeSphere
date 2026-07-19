import { Activity, AlertTriangle, Gauge, ShieldAlert, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { useRiskMetrics } from '@/store/useAIInsights';
import { useRiskAnalytics } from '@/store/useRiskAnalytics';

const PERCENT_FORMATTER = (v: number) => `${v.toFixed(1)}%`;

export default function RiskAnalyticsPage() {
  const { data: risk, isLoading: riskLoading } = useRiskMetrics();
  const { data, isLoading } = useRiskAnalytics();

  return (
    <div>
      <PageHeader
        title="Portfolio Risk Analytics"
        subtitle="Rolling volatility, drawdown, Value-at-Risk, and per-asset risk contribution."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {riskLoading || !risk ? (
          Array.from({ length: 2 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Volatility" value={`${risk.volatility.toFixed(1)}%`} icon={<Activity size={17} aria-hidden />} hint="Annualized" />
            <StatCard label="Sharpe Ratio" value={risk.sharpeRatio.toFixed(2)} icon={<Gauge size={17} aria-hidden />} hint="Risk-adjusted return" />
          </>
        )}
        {isLoading || !data ? (
          Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Historical VaR 95%"
              value={`${data.historicalVaR95.toFixed(2)}%`}
              icon={<AlertTriangle size={17} aria-hidden />}
              hint="Est. max daily loss"
            />
            <StatCard
              label="Historical VaR 99%"
              value={`${data.historicalVaR99.toFixed(2)}%`}
              icon={<ShieldAlert size={17} aria-hidden />}
              hint="Est. max daily loss"
            />
            <StatCard label="Max Drawdown" value={`${data.maxDrawdown.percent.toFixed(1)}%`} icon={<TrendingDown size={17} aria-hidden />} />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Rolling Volatility" subtitle="30-day rolling, annualized">
          {isLoading || !data ? (
            <SkeletonText lines={5} />
          ) : (
            <LineAreaChart data={data.rollingVolatility} valueFormatter={PERCENT_FORMATTER} />
          )}
        </ChartWrapper>

        <ChartWrapper title="Drawdown" subtitle="Decline from running peak">
          {isLoading || !data ? <SkeletonText lines={5} /> : <LineAreaChart data={data.drawdownSeries} valueFormatter={PERCENT_FORMATTER} />}
        </ChartWrapper>
      </div>

      <ChartWrapper title="Risk Contribution by Asset" subtitle="Share of total portfolio risk, not portfolio value" className="mt-6">
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <div className="flex flex-col gap-4">
            {data.riskContributions.map((c) => (
              <div key={c.symbol} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-[0.82rem]">
                  <span className="font-semibold text-text">
                    {c.symbol} <span className="font-normal text-muted">{c.name}</span>
                  </span>
                  <span className="tabular-figures text-muted">{c.riskContributionPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.riskContributionPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartWrapper>
    </div>
  );
}
