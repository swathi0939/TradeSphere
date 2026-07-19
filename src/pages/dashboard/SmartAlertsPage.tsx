import { useMemo, useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { WatchlistGroupPanel } from '@/features/alerts/WatchlistGroupPanel';
import { PriceAlertForm } from '@/features/alerts/PriceAlertForm';
import { useStocks, useLiveStocks } from '@/store/useMarketData';
import { usePortfolioSummary } from '@/store/usePortfolio';
import { useWatchlistGroups } from '@/store/useWatchlistGroups';
import { useAlerts } from '@/store/useAlerts';
import { useAIInsights } from '@/store/useAIInsights';
import { useInterval } from '@/hooks/useInterval';
import { evaluateAlerts } from '@/services/alertsService';
import { formatCurrency } from '@/services/mockUtils';
import { getMarketStatus } from '@/utils/marketStatus';
import type { InsightAction, Stock } from '@/types';
import type { AlertDirection, PortfolioAlertMetric } from '@/types/alerts';

const ACTION_VARIANT: Record<InsightAction, 'solid' | 'outline-primary' | 'outline-accent'> = {
  BUY: 'solid',
  SELL: 'outline-accent',
  HOLD: 'outline-accent',
};

const METRIC_LABEL: Record<PortfolioAlertMetric, string> = {
  totalValue: 'Total portfolio value',
  todayPnlPercent: "Today's P&L %",
};

const DIRECTION_OPTIONS: { value: AlertDirection; label: string }[] = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' },
];

export default function SmartAlertsPage() {
  const { data: allStocks, isLoading: stocksLoading } = useStocks();
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();
  const { groups, isLoading: groupsLoading, createGroup, deleteGroup, addSymbol, removeSymbol } = useWatchlistGroups();
  const {
    priceAlerts,
    portfolioAlerts,
    isLoading: alertsLoading,
    createPriceAlert,
    deletePriceAlert,
    createPortfolioAlert,
    deletePortfolioAlert,
    refetch,
  } = useAlerts();
  const { data: insights, isLoading: insightsLoading } = useAIInsights(6);

  const [metric, setMetric] = useState<PortfolioAlertMetric>('totalValue');
  const [threshold, setThreshold] = useState('');
  const [portfolioDirection, setPortfolioDirection] = useState<AlertDirection>('above');

  useInterval(() => refetch(), 10000);

  const alertSymbols = useMemo(() => Array.from(new Set(priceAlerts.map((a) => a.symbol))), [priceAlerts]);
  const liveStocks = useLiveStocks(alertSymbols);

  const mergedStocks = useMemo<Stock[]>(() => (allStocks ?? []).map((s) => liveStocks.get(s.symbol) ?? s), [allStocks, liveStocks]);

  const { triggeredPriceAlerts, triggeredPortfolioAlerts } = useMemo(() => {
    if (!summary) return { triggeredPriceAlerts: priceAlerts, triggeredPortfolioAlerts: portfolioAlerts };
    return evaluateAlerts(priceAlerts, mergedStocks, portfolioAlerts, summary);
  }, [priceAlerts, mergedStocks, portfolioAlerts, summary]);

  function handleCreatePortfolioAlert() {
    const parsed = Number(threshold);
    if (!Number.isFinite(parsed)) return;
    createPortfolioAlert(metric, parsed, portfolioDirection);
    setThreshold('');
  }

  const marketStatusLabel = getMarketStatus().label.toLowerCase();

  return (
    <div>
      <PageHeader
        title="Watchlists & Smart Alerts"
        subtitle="Multiple watchlists, price and portfolio alerts, and AI-flagged opportunities — all in one place."
      />

      <ChartWrapper title="Watchlist Groups" subtitle="Organize stocks into named groups.">
        {groupsLoading || stocksLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <WatchlistGroupPanel
            groups={groups}
            allStocks={allStocks ?? []}
            onCreateGroup={createGroup}
            onDeleteGroup={deleteGroup}
            onAddSymbol={addSymbol}
            onRemoveSymbol={removeSymbol}
          />
        )}
      </ChartWrapper>

      <ChartWrapper title="Price Alerts" subtitle="Get notified when a stock crosses a target price." className="mt-6">
        {stocksLoading ? (
          <SkeletonText lines={2} />
        ) : (
          <PriceAlertForm stocks={allStocks ?? []} onCreate={createPriceAlert} />
        )}

        <p className="mt-3 text-[0.78rem] text-muted">Prices last checked while the market is {marketStatusLabel}.</p>

        <div className="mt-4 flex flex-col gap-2">
          {alertsLoading ? (
            <SkeletonText lines={3} />
          ) : triggeredPriceAlerts.length === 0 ? (
            <p className="py-4 text-center text-[0.85rem] text-muted">No price alerts yet.</p>
          ) : (
            triggeredPriceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5">
                <div className="flex items-center gap-3">
                  <Bell size={15} className="text-muted" aria-hidden />
                  <div>
                    <p className="text-[0.86rem] font-semibold text-text">{alert.symbol}</p>
                    <p className="text-[0.76rem] text-muted">
                      {alert.direction === 'above' ? 'Above' : 'Below'} {formatCurrency(alert.targetPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={alert.triggered ? 'solid' : 'outline-accent'} active={alert.triggered}>
                    {alert.triggered ? 'Triggered' : 'Watching'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => void deletePriceAlert(alert.id)}
                    aria-label={`Delete alert for ${alert.symbol}`}
                    className="text-muted transition-colors hover:text-danger"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </ChartWrapper>

      <ChartWrapper title="Portfolio Alerts" subtitle="Get notified when your portfolio crosses a threshold." className="mt-6">
        <Card glass className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="portfolio-alert-metric" className="text-[0.85rem] font-medium text-text">
              Metric
            </label>
            <select
              id="portfolio-alert-metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value as PortfolioAlertMetric)}
              className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.9rem] text-text focus-visible:border-primary focus-visible:outline-none"
            >
              <option value="totalValue">Total portfolio value</option>
              <option value="todayPnlPercent">Today&apos;s P&amp;L %</option>
            </select>
          </div>

          <Input
            label="Threshold"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            containerClassName="sm:w-40"
          />

          <SegmentedControl label="Alert direction" options={DIRECTION_OPTIONS} value={portfolioDirection} onChange={setPortfolioDirection} />

          <Button variant="primary" size="sm" onClick={handleCreatePortfolioAlert} disabled={!threshold.trim()}>
            Create alert
          </Button>
        </Card>

        <div className="mt-4 flex flex-col gap-2">
          {alertsLoading || summaryLoading ? (
            <SkeletonText lines={3} />
          ) : triggeredPortfolioAlerts.length === 0 ? (
            <p className="py-4 text-center text-[0.85rem] text-muted">No portfolio alerts yet.</p>
          ) : (
            triggeredPortfolioAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5">
                <div className="flex items-center gap-3">
                  <Bell size={15} className="text-muted" aria-hidden />
                  <div>
                    <p className="text-[0.86rem] font-semibold text-text">{METRIC_LABEL[alert.metric]}</p>
                    <p className="text-[0.76rem] text-muted">
                      {alert.direction === 'above' ? 'Above' : 'Below'} {alert.metric === 'totalValue' ? formatCurrency(alert.threshold) : `${alert.threshold}%`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={alert.triggered ? 'solid' : 'outline-accent'} active={alert.triggered}>
                    {alert.triggered ? 'Triggered' : 'Watching'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => void deletePortfolioAlert(alert.id)}
                    aria-label={`Delete ${METRIC_LABEL[alert.metric]} alert`}
                    className="text-muted transition-colors hover:text-danger"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </ChartWrapper>

      <ChartWrapper title="AI Recommendations" subtitle="Model-flagged opportunities across your universe." className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insightsLoading || !insights
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : insights.map((insight) => (
                <div key={insight.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-text">{insight.symbol}</p>
                      <p className="text-[0.76rem] text-muted">{insight.name}</p>
                    </div>
                    <Badge variant={ACTION_VARIANT[insight.action]} active className="text-[0.68rem]">
                      {insight.action}
                    </Badge>
                  </div>
                  <p className="mt-2.5 text-[0.8rem] text-muted">{insight.reason}</p>
                  <p className="mt-3 text-[0.8rem] font-semibold text-primary-text">{insight.confidence}% confidence</p>
                </div>
              ))}
        </div>
      </ChartWrapper>
    </div>
  );
}
