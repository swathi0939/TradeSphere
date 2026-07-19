import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/Badge';
import { useToast } from '@/contexts/ToastContext';
import { useOrders, useCancelOrder } from '@/store/useOrders';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { Order, OrderStatus, TableColumn } from '@/types';

type Tab = 'ALL' | OrderStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'OPEN', label: 'Open' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const PAGE_SIZE = 8;

const STATUS_VARIANT: Record<OrderStatus, 'solid' | 'outline-primary' | 'outline-accent'> = {
  COMPLETED: 'solid',
  OPEN: 'outline-primary',
  PENDING: 'outline-accent',
  CANCELLED: 'outline-accent',
};

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data: orders, isLoading, refetch } = useOrders(tab === 'ALL' ? undefined : tab);
  const { cancel } = useCancelOrder();
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const list = orders ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((o) => o.symbol.toLowerCase().includes(q) || o.name.toLowerCase().includes(q));
  }, [orders, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleCancel(order: Order) {
    await cancel(order.id);
    showToast('info', 'Order cancelled', `${order.side} order for ${order.symbol} was cancelled.`);
    refetch();
  }

  const columns: TableColumn<Order>[] = [
    {
      key: 'symbol',
      header: 'Symbol',
      render: (o) => (
        <div>
          <p className="font-semibold">{o.symbol}</p>
          <p className="text-[0.76rem] text-muted">{o.name}</p>
        </div>
      ),
    },
    {
      key: 'side',
      header: 'Side',
      render: (o) => <span className={cn('font-semibold', o.side === 'BUY' ? 'text-primary-text' : 'text-danger-text')}>{o.side}</span>,
    },
    { key: 'orderKind', header: 'Type', render: (o) => o.orderKind.replace('_', ' ') },
    { key: 'quantity', header: 'Qty', align: 'right', render: (o) => o.quantity },
    { key: 'price', header: 'Price', align: 'right', render: (o) => formatCurrency(o.price) },
    { key: 'timestamp', header: 'Date', render: (o) => new Date(o.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (o) => (
        <Badge variant={STATUS_VARIANT[o.status]} active className="text-[0.68rem]">
          {o.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (o) =>
        o.status === 'OPEN' ? (
          <button type="button" onClick={() => void handleCancel(o)} aria-label={`Cancel order for ${o.symbol}`} className="text-muted transition-colors hover:text-danger">
            <X size={16} aria-hidden />
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader title="Orders" subtitle="Review and manage all your trade orders." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
                tab === t.key ? 'bg-primary text-[#04140f]' : 'border border-border text-muted hover:text-text',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search orders…" className="sm:w-64" />
      </div>

      <Table columns={columns} data={pageItems} keyField={(o) => o.id} isLoading={isLoading} emptyMessage="No orders in this category." />

      <div className="mt-5">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
