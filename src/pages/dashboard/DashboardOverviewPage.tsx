import { Wallet, TrendingUp, CalendarRange, Layers, PiggyBank, ChartCandlestick, Percent, Plus, ArrowDownToLine } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { MarketCard } from '@/components/ui/MarketCard';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';
import { AsyncError } from '@/components/ui/AsyncError';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { DailyBriefCard } from '@/features/daily-brief/DailyBriefCard';
import { usePortfolioSummary, usePerformanceHistory, useSectorAllocation } from '@/store/usePortfolio';
import { useMarketIndices, useTopGainers } from '@/store/useMarketData';
import { useNews } from '@/store/useNews';
import { useOrders } from '@/store/useOrders';
import { formatCurrency } from '@/services/mockUtils';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/helpers';
import type { Order, TableColumn } from '@/types';

const ORDER_COLUMNS: TableColumn<Order>[] = [
  {
    key: 'symbol',
    header: 'Symbol',
    render: (o) => (
      <div>
        <p className="font-semibold">{o.symbol}</p>
        <p className="text-[0.76rem] text-muted">{o.side === 'BUY' ? 'Buy' : 'Sell'} · {o.orderKind}</p>
      </div>
    ),
  },
  { key: 'quantity', header: 'Qty', align: 'right', render: (o) => o.quantity },
  { key: 'price', header: 'Price', align: 'right', render: (o) => formatCurrency(o.price) },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (o) => (
      <Badge variant={o.status === 'COMPLETED' ? 'solid' : o.status === 'OPEN' ? 'outline-primary' : 'outline-accent'} active className="text-[0.68rem]">
        {o.status}
      </Badge>
    ),
  },
];

export default function DashboardOverviewPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = usePortfolioSummary();
  const { data: performance, isLoading: perfLoading } = usePerformanceHistory(90);
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();
  const { data: indices, isLoading: indicesLoading } = useMarketIndices();
  const { data: trending, isLoading: trendingLoading } = useTopGainers(4);
  const { data: news, isLoading: newsLoading } = useNews(4);
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const chartPoints =
    performance?.filter((_, i) => i % 4 === 0).map((p) => ({
      label: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: p.value,
    })) ?? [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Here's what's happening with your portfolio today."
        actions={
          <>
            <Button href={ROUTES.trading} variant="primary" size="sm">
              <Plus size={15} aria-hidden />
              Quick Trade
            </Button>
            <Button href={ROUTES.portfolio} variant="ghost" size="sm">
              <ArrowDownToLine size={15} aria-hidden />
              Add Funds
            </Button>
          </>
        }
      />

      <DailyBriefCard />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {summaryError ? (
          <AsyncError message={summaryError} onRetry={refetchSummary} className="col-span-full" />
        ) : summaryLoading || !summary ? (
          Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Portfolio Value" value={formatCurrency(summary.totalValue)} icon={<Wallet size={17} aria-hidden />} hint="Total holdings" />
            <StatCard label="Today's Profit" value={formatCurrency(summary.todayPnl)} changePercent={summary.todayPnlPercent} icon={<TrendingUp size={17} aria-hidden />} />
            <StatCard label="Monthly Profit" value={formatCurrency(summary.monthlyPnl)} changePercent={summary.monthlyPnlPercent} icon={<CalendarRange size={17} aria-hidden />} />
            <StatCard label="Open Positions" value={String(summary.openPositionsCount)} icon={<Layers size={17} aria-hidden />} hint="Across markets" />
            <StatCard label="Available Balance" value={formatCurrency(summary.availableBalance)} icon={<PiggyBank size={17} aria-hidden />} />
            <StatCard label="Total Investments" value={formatCurrency(summary.totalInvested)} icon={<ChartCandlestick size={17} aria-hidden />} />
            <StatCard label="ROI" value={`${summary.returnsPercent.toFixed(2)}%`} changePercent={summary.returnsPercent} icon={<Percent size={17} aria-hidden />} hint="Since inception" />
          </>
        )}
      </div>

      {/* Performance + Allocation */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartWrapper title="Portfolio Performance" subtitle="Last 90 days" className="xl:col-span-2">
          {perfLoading || chartPoints.length === 0 ? <SkeletonText lines={5} /> : <LineAreaChart data={chartPoints} height={260} />}
        </ChartWrapper>

        <ChartWrapper title="Portfolio Distribution" subtitle="By sector">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart
              data={allocation.map((a) => ({ label: a.sector, value: a.value, percent: a.percent, color: a.color }))}
              centerValue={`${allocation.length}`}
              centerLabel="Sectors"
              size={150}
              strokeWidth={20}
            />
          )}
        </ChartWrapper>
      </div>

      {/* Market overview strip */}
      <ChartWrapper title="Market Overview" subtitle="Major indices" className="mt-6">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {indicesLoading || !indices
            ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-20 w-44 shrink-0" />)
            : indices.map((index) => {
                const isUp = index.change >= 0;
                return (
                  <div key={index.symbol} className="w-44 shrink-0 rounded-md border border-border p-3">
                    <p className="truncate text-[0.8rem] font-semibold text-text">{index.name}</p>
                    <p className="tabular-figures mt-1 text-[1.05rem] font-bold text-text">{index.value.toLocaleString('en-IN')}</p>
                    <p className={cn('tabular-figures text-[0.78rem] font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
                      {isUp ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </p>
                  </div>
                );
              })}
        </div>
      </ChartWrapper>

      {/* Trending stocks + news */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-[1rem] font-bold text-text">Trending Stocks</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {trendingLoading || !trending
              ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
              : trending.map((stock) => <MarketCard key={stock.symbol} stock={stock} />)}
          </div>
        </div>

        <ChartWrapper title="Latest News" subtitle="Market headlines">
          <div className="flex flex-col gap-4">
            {newsLoading || !news
              ? Array.from({ length: 4 }, (_, i) => <SkeletonText key={i} lines={2} />)
              : news.map((item) => (
                  <div key={item.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="text-[0.84rem] font-semibold text-text">{item.headline}</p>
                    <p className="mt-1 text-[0.76rem] text-muted">
                      {item.source} · {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
          </div>
        </ChartWrapper>
      </div>

      {/* Recent orders */}
      <ChartWrapper
        title="Recent Orders"
        subtitle="Your latest activity"
        actions={
          <Button href={ROUTES.orders} variant="ghost" size="sm">
            View all
          </Button>
        }
        className="mt-6"
      >
        <Table columns={ORDER_COLUMNS} data={(orders ?? []).slice(0, 5)} keyField={(o) => o.id} isLoading={ordersLoading} />
      </ChartWrapper>
    </div>
  );
}
