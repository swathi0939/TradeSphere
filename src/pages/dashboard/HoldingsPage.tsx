import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Table } from '@/components/ui/Table';
import { StatCard } from '@/components/ui/StatCard';
import { DonutChart } from '@/components/charts/DonutChart';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useHoldings, useSectorAllocation, usePortfolioSummary } from '@/store/usePortfolio';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import type { Holding, TableColumn } from '@/types';

export default function HoldingsPage() {
  const { data: holdings, isLoading } = useHoldings();
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();
  const { data: summary } = usePortfolioSummary();

  const winners = (holdings ?? []).filter((h) => h.pnl >= 0).length;
  const losers = (holdings ?? []).filter((h) => h.pnl < 0).length;

  const columns: TableColumn<Holding>[] = [
    {
      key: 'symbol',
      header: 'Stock',
      render: (h) => (
        <div>
          <p className="font-semibold">{h.symbol}</p>
          <p className="text-[0.76rem] text-muted">{h.name}</p>
        </div>
      ),
    },
    { key: 'sector', header: 'Sector', render: (h) => h.sector },
    { key: 'quantity', header: 'Qty', align: 'right', render: (h) => h.quantity },
    { key: 'avgPrice', header: 'Avg. Price', align: 'right', render: (h) => formatCurrency(h.avgPrice) },
    { key: 'currentPrice', header: 'LTP', align: 'right', render: (h) => formatCurrency(h.currentPrice) },
    { key: 'currentValue', header: 'Current Value', align: 'right', render: (h) => formatCurrency(h.currentValue) },
    {
      key: 'pnl',
      header: 'P&L',
      align: 'right',
      render: (h) => (
        <span className={cn('tabular-figures font-semibold', h.pnl >= 0 ? 'text-primary-text' : 'text-danger-text')}>
          {h.pnl >= 0 ? '+' : ''}
          {formatCurrency(h.pnl)}
        </span>
      ),
    },
    {
      key: 'pnlPercent',
      header: 'Returns',
      align: 'right',
      render: (h) => (
        <span className={cn('tabular-figures font-semibold', h.pnlPercent >= 0 ? 'text-primary-text' : 'text-danger-text')}>
          {h.pnlPercent >= 0 ? '+' : ''}
          {h.pnlPercent.toFixed(2)}%
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Holdings" subtitle="Every stock currently in your portfolio." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Holdings Value" value={summary ? formatCurrency(summary.totalValue) : '—'} icon={<Wallet size={17} aria-hidden />} />
        <StatCard label="Gaining Stocks" value={String(winners)} icon={<TrendingUp size={17} aria-hidden />} hint="Currently in profit" />
        <StatCard label="Losing Stocks" value={String(losers)} icon={<TrendingDown size={17} aria-hidden />} hint="Currently in loss" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartWrapper title="Holdings" subtitle="Sorted by current value" className="xl:col-span-2">
          <Table columns={columns} data={holdings ?? []} keyField={(h) => h.symbol} isLoading={isLoading} />
        </ChartWrapper>

        <ChartWrapper title="Allocation" subtitle="By sector weight">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart data={allocation.map((a) => ({ label: a.sector, value: a.value, percent: a.percent, color: a.color }))} size={150} strokeWidth={20} />
          )}
        </ChartWrapper>
      </div>
    </div>
  );
}
