import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/Badge';
import { TradingChart } from '@/components/charts/TradingChart';
import { OrderPanel } from '@/features/trading/OrderPanel';
import { OrderBookPanel } from '@/features/trading/OrderBookPanel';
import { useStocks } from '@/store/useMarketData';
import { useOpenPositions } from '@/store/usePortfolio';
import { useOrders } from '@/store/useOrders';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { Order, Position, TableColumn } from '@/types';

type Tab = 'positions' | 'open-orders' | 'history';

export default function TradingPage() {
  const { data: stocks } = useStocks();
  const [symbol, setSymbol] = useState('RELIANCE');
  const [livePrice, setLivePrice] = useState<{ price: number; up: boolean } | null>(null);
  const [tab, setTab] = useState<Tab>('positions');

  const { data: positions, isLoading: positionsLoading } = useOpenPositions();
  const { data: openOrders, isLoading: openOrdersLoading, refetch: refetchOrders } = useOrders('OPEN');
  const { data: allOrders, isLoading: historyLoading } = useOrders();

  const selectedStock = useMemo(() => stocks?.find((s) => s.symbol === symbol), [stocks, symbol]);
  const currentPrice = livePrice?.price ?? selectedStock?.price ?? 0;

  const positionColumns: TableColumn<Position>[] = [
    { key: 'symbol', header: 'Symbol', render: (p) => <span className="font-semibold">{p.symbol}</span> },
    { key: 'side', header: 'Side', render: (p) => <span className={cn('font-semibold', p.side === 'LONG' ? 'text-primary-text' : 'text-danger-text')}>{p.side}</span> },
    { key: 'quantity', header: 'Qty', align: 'right', render: (p) => p.quantity },
    { key: 'avgPrice', header: 'Avg. Price', align: 'right', render: (p) => formatCurrency(p.avgPrice) },
    { key: 'currentPrice', header: 'LTP', align: 'right', render: (p) => formatCurrency(p.currentPrice) },
    {
      key: 'pnl',
      header: 'P&L',
      align: 'right',
      render: (p) => (
        <span className={cn('tabular-figures font-semibold', p.pnl >= 0 ? 'text-primary-text' : 'text-danger-text')}>
          {p.pnl >= 0 ? '+' : ''}
          {formatCurrency(p.pnl)}
        </span>
      ),
    },
  ];

  const orderColumns: TableColumn<Order>[] = [
    { key: 'symbol', header: 'Symbol', render: (o) => <span className="font-semibold">{o.symbol}</span> },
    { key: 'side', header: 'Side', render: (o) => <span className={cn('font-semibold', o.side === 'BUY' ? 'text-primary-text' : 'text-danger-text')}>{o.side}</span> },
    { key: 'orderKind', header: 'Type', render: (o) => o.orderKind.replace('_', ' ') },
    { key: 'quantity', header: 'Qty', align: 'right', render: (o) => o.quantity },
    { key: 'price', header: 'Price', align: 'right', render: (o) => formatCurrency(o.price) },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (o) => (
        <Badge variant={o.status === 'COMPLETED' ? 'solid' : 'outline-accent'} active className="text-[0.68rem]">
          {o.status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Trading" subtitle="Live chart, order entry, and market depth." />

      <div className="mb-5 flex items-center gap-3">
        <label htmlFor="trading-symbol" className="sr-only">
          Select stock
        </label>
        <select
          id="trading-symbol"
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            setLivePrice(null);
          }}
          className="rounded-md border border-border bg-surface px-3 py-2 text-[0.9rem] font-semibold text-text focus-visible:border-primary focus-visible:outline-none"
        >
          {(stocks ?? []).map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} — {s.name}
            </option>
          ))}
        </select>
        {selectedStock && (
          <span className={cn('tabular-figures text-[1.1rem] font-bold', (livePrice?.up ?? selectedStock.change >= 0) ? 'text-primary-text' : 'text-danger-text')}>
            {formatCurrency(currentPrice)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <ChartWrapper title={symbol} subtitle="Simulated live candlestick chart">
            {selectedStock && <TradingChart symbol={symbol} basePrice={selectedStock.price} onPriceUpdate={(price, up) => setLivePrice({ price, up })} />}
          </ChartWrapper>

          <ChartWrapper
            title="Activity"
            actions={
              <div className="flex gap-1.5">
                {(
                  [
                    { key: 'positions', label: 'Positions' },
                    { key: 'open-orders', label: 'Open Orders' },
                    { key: 'history', label: 'Trade History' },
                  ] as { key: Tab; label: string }[]
                ).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[0.78rem] font-semibold transition-colors',
                      tab === t.key ? 'bg-primary text-[#04140f]' : 'border border-border text-muted hover:text-text',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            }
          >
            {tab === 'positions' && <Table columns={positionColumns} data={positions ?? []} keyField={(p) => p.id} isLoading={positionsLoading} emptyMessage="No open positions." />}
            {tab === 'open-orders' && (
              <Table columns={orderColumns} data={openOrders ?? []} keyField={(o) => o.id} isLoading={openOrdersLoading} emptyMessage="No open orders." />
            )}
            {tab === 'history' && <Table columns={orderColumns} data={(allOrders ?? []).slice(0, 10)} keyField={(o) => o.id} isLoading={historyLoading} />}
          </ChartWrapper>
        </div>

        <div className="flex flex-col gap-6">
          {selectedStock && <OrderPanel symbol={symbol} name={selectedStock.name} currentPrice={currentPrice} onOrderPlaced={refetchOrders} />}
          {selectedStock && <OrderBookPanel symbol={symbol} currentPrice={currentPrice} />}
        </div>
      </div>
    </div>
  );
}
