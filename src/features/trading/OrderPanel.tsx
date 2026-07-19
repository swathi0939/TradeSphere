import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { usePlaceOrder } from '@/store/useOrders';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { OrderKind, OrderSide } from '@/types';

interface OrderPanelProps {
  symbol: string;
  name: string;
  currentPrice: number;
  onOrderPlaced?: () => void;
}

const ORDER_KINDS: { key: OrderKind; label: string }[] = [
  { key: 'MARKET', label: 'Market' },
  { key: 'LIMIT', label: 'Limit' },
  { key: 'STOP_LOSS', label: 'Stop-Loss' },
];

/** Buy/Sell order entry panel — Market/Limit/Stop-Loss, quantity + price. */
export function OrderPanel({ symbol, name, currentPrice, onOrderPlaced }: OrderPanelProps) {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderKind, setOrderKind] = useState<OrderKind>('MARKET');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState(currentPrice.toFixed(2));
  const [triggerPrice, setTriggerPrice] = useState((currentPrice * 0.97).toFixed(2));
  const { place, isPlacing } = usePlaceOrder();
  const { showToast } = useToast();

  const qtyNum = Number(quantity) || 0;
  const priceNum = orderKind === 'MARKET' ? currentPrice : Number(price) || 0;
  const estimatedTotal = qtyNum * priceNum;

  async function handleSubmit() {
    if (qtyNum <= 0) {
      showToast('error', 'Invalid quantity', 'Enter a quantity of at least 1.');
      return;
    }
    const order = await place({
      symbol,
      name,
      side,
      orderKind,
      quantity: qtyNum,
      price: priceNum,
      triggerPrice: orderKind === 'STOP_LOSS' ? Number(triggerPrice) : undefined,
    });
    showToast('success', `${side === 'BUY' ? 'Buy' : 'Sell'} order placed`, `${qtyNum} shares of ${symbol} · ${order.status}`);
    onOrderPlaced?.();
  }

  return (
    <Card glass className="p-5">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={cn('rounded-md py-2.5 text-[0.9rem] font-bold transition-colors', side === 'BUY' ? 'bg-primary text-[#04140f]' : 'border border-border text-muted hover:text-text')}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={cn('rounded-md py-2.5 text-[0.9rem] font-bold transition-colors', side === 'SELL' ? 'bg-danger text-white' : 'border border-border text-muted hover:text-text')}
        >
          Sell
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {ORDER_KINDS.map((k) => (
          <button
            key={k.key}
            type="button"
            onClick={() => setOrderKind(k.key)}
            className={cn(
              'flex-1 rounded-full px-2 py-1.5 text-[0.76rem] font-semibold transition-colors',
              orderKind === k.key ? 'border border-primary text-primary-text' : 'border border-border text-muted hover:text-text',
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Input label="Quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        {orderKind !== 'MARKET' && <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />}
        {orderKind === 'STOP_LOSS' && <Input label="Trigger Price" type="number" step="0.01" value={triggerPrice} onChange={(e) => setTriggerPrice(e.target.value)} />}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md bg-surface-2 px-3 py-2.5 text-[0.85rem]">
        <span className="text-muted">Estimated {side === 'BUY' ? 'cost' : 'proceeds'}</span>
        <span className="tabular-figures font-semibold text-text">{formatCurrency(estimatedTotal)}</span>
      </div>

      <Button type="button" variant="primary" block className={cn('mt-4', side === 'SELL' && 'bg-danger shadow-none hover:shadow-none')} onClick={() => void handleSubmit()} disabled={isPlacing}>
        {isPlacing ? <Spinner size={18} /> : `${side === 'BUY' ? 'Buy' : 'Sell'} ${symbol}`}
      </Button>
    </Card>
  );
}
