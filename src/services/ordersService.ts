import type { Order, OrderKind, OrderSide, OrderStatus } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { daysAgoISO, delay, generateId, pick, randomBetween, randomInt, seededRandom } from './mockUtils';

const ORDER_KINDS: OrderKind[] = ['MARKET', 'LIMIT', 'STOP_LOSS'];
const STATUSES: OrderStatus[] = ['OPEN', 'COMPLETED', 'CANCELLED', 'PENDING'];

let ORDER_STORE: Order[] | null = null;

function buildOrders(): Order[] {
  const rng = seededRandom(4242);
  const orders: Order[] = [];
  for (let i = 0; i < 34; i++) {
    const stock = pick(rng, STOCK_UNIVERSE);
    const side: OrderSide = rng() > 0.5 ? 'BUY' : 'SELL';
    const orderKind = pick(rng, ORDER_KINDS);
    const status = pick(rng, STATUSES);
    orders.push({
      id: generateId('ord'),
      symbol: stock.symbol,
      name: stock.name,
      side,
      orderKind,
      quantity: randomInt(rng, 1, 60),
      price: Number((stock.price * randomBetween(rng, 0.97, 1.03)).toFixed(2)),
      triggerPrice: orderKind === 'STOP_LOSS' ? Number((stock.price * randomBetween(rng, 0.9, 0.98)).toFixed(2)) : undefined,
      status,
      timestamp: daysAgoISO(randomInt(rng, 0, 21), randomInt(rng, 0, 23)),
    });
  }
  return orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getStore(): Order[] {
  if (!ORDER_STORE) ORDER_STORE = buildOrders();
  return ORDER_STORE;
}

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  const orders = getStore();
  return delay(status ? orders.filter((o) => o.status === status) : orders);
}

export interface PlaceOrderPayload {
  symbol: string;
  name: string;
  side: OrderSide;
  orderKind: OrderKind;
  quantity: number;
  price: number;
  triggerPrice?: number;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const order: Order = {
    id: generateId('ord'),
    status: payload.orderKind === 'MARKET' ? 'COMPLETED' : 'OPEN',
    timestamp: new Date().toISOString(),
    ...payload,
  };
  getStore().unshift(order);
  return delay(order, 500);
}

export async function cancelOrder(orderId: string): Promise<Order | null> {
  const order = getStore().find((o) => o.id === orderId);
  if (order && order.status === 'OPEN') order.status = 'CANCELLED';
  return delay(order ?? null, 300);
}
