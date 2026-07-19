import { Wallet, TrendingUp, PiggyBank, Percent } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Table } from '@/components/ui/Table';
import { SkeletonText } from '@/components/ui/Skeleton';
import { LineAreaChart } from '@/components/charts/LineAreaChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { usePortfolioSummary, usePerformanceHistory, useSectorAllocation, useHoldings } from '@/store/usePortfolio';
import { useTransactions } from '@/store/useTransactions';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { Holding, TableColumn, Transaction } from '@/types';

const HOLDING_COLUMNS: TableColumn<Holding>[] = [
  {
    key: 'symbol',
    header: 'Stock',
    render: (h) => (
      <div>
        <p className="font-semibold">{h.symbol}</p>
        <p className="text-[0.76rem] text-muted">{h.sector}</p>
      </div>
    ),
  },
  { key: 'quantity', header: 'Qty', align: 'right', render: (h) => h.quantity },
  { key: 'avgPrice', header: 'Avg. Price', align: 'right', render: (h) => formatCurrency(h.avgPrice) },
  { key: 'currentValue', header: 'Current Value', align: 'right', render: (h) => formatCurrency(h.currentValue) },
  {
    key: 'pnl',
    header: 'P&L',
    align: 'right',
    render: (h) => (
      <span className={cn('tabular-figures font-semibold', h.pnl >= 0 ? 'text-primary-text' : 'text-danger-text')}>
        {h.pnl >= 0 ? '+' : ''}
        {formatCurrency(h.pnl)} ({h.pnlPercent.toFixed(2)}%)
      </span>
    ),
  },
];

const TRANSACTION_LABEL: Record<Transaction['type'], string> = {
  BUY: 'Bought',
  SELL: 'Sold',
  DIVIDEND: 'Dividend',
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdrawal',
};

export default function PortfolioPage() {
  const { data: summary, isLoading: summaryLoading } = usePortfolioSummary();
  const { data: performance, isLoading: perfLoading } = usePerformanceHistory(90);
  const { data: allocation, isLoading: allocationLoading } = useSectorAllocation();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: transactions, isLoading: txLoading } = useTransactions(6);

  const chartPoints =
    performance?.filter((_, i) => i % 4 === 0).map((p) => ({
      label: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      value: p.value,
    })) ?? [];

  const investments = (transactions ?? []).filter((t) => t.type === 'BUY' || t.type === 'SELL');

  return (
    <div>
      <PageHeader title="Portfolio" subtitle="A complete view of your investments and returns." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryLoading || !summary ? null : (
          <>
            <StatCard label="Total Value" value={formatCurrency(summary.totalValue)} icon={<Wallet size={17} aria-hidden />} />
            <StatCard label="Total Invested" value={formatCurrency(summary.totalInvested)} icon={<PiggyBank size={17} aria-hidden />} />
            <StatCard label="Total Returns" value={formatCurrency(summary.totalReturns)} changePercent={summary.returnsPercent} icon={<TrendingUp size={17} aria-hidden />} />
            <StatCard label="Day's Change" value={formatCurrency(summary.todayPnl)} changePercent={summary.todayPnlPercent} icon={<Percent size={17} aria-hidden />} />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartWrapper title="Performance" subtitle="Portfolio value, last 90 days" className="xl:col-span-2">
          {perfLoading || chartPoints.length === 0 ? <SkeletonText lines={5} /> : <LineAreaChart data={chartPoints} height={260} />}
        </ChartWrapper>

        <ChartWrapper title="Sector Allocation" subtitle="Current weighting">
          {allocationLoading || !allocation ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart
              data={allocation.map((a) => ({ label: a.sector, value: a.value, percent: a.percent, color: a.color }))}
              size={150}
              strokeWidth={20}
            />
          )}
        </ChartWrapper>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartWrapper title="Holdings" subtitle="Your current stock positions" className="xl:col-span-2">
          <Table columns={HOLDING_COLUMNS} data={holdings ?? []} keyField={(h) => h.symbol} isLoading={holdingsLoading} />
        </ChartWrapper>

        <ChartWrapper title="Recent Investments" subtitle="Latest buy/sell activity">
          <div className="flex flex-col gap-3">
            {txLoading || investments.length === 0
              ? Array.from({ length: 5 }, (_, i) => <SkeletonText key={i} lines={1} />)
              : investments.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b border-border pb-3 text-[0.85rem] last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-text">
                        {TRANSACTION_LABEL[tx.type]} {tx.symbol}
                      </p>
                      <p className="text-[0.76rem] text-muted">{new Date(tx.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className={cn('tabular-figures font-semibold', tx.type === 'BUY' ? 'text-danger-text' : 'text-primary-text')}>
                      {tx.type === 'BUY' ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}
