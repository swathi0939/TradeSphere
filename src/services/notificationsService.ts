import type { AppNotification, NotificationCategory } from '@/types';
import { daysAgoISO, delay, generateId, pick, randomInt, seededRandom } from './mockUtils';

const TEMPLATES: Array<{ category: NotificationCategory; title: string; message: string; priority: AppNotification['priority'] }> = [
  { category: 'trade', title: 'Order executed', message: 'Your BUY order for 25 shares of RELIANCE was filled at ₹2,945.10.', priority: 'medium' },
  { category: 'trade', title: 'Stop-loss triggered', message: 'Stop-loss for TATAMOTORS was triggered at ₹762.40.', priority: 'high' },
  { category: 'market', title: 'NIFTY 50 crosses 22,500', message: 'The index is up 1.2% in early trade, led by banking and IT stocks.', priority: 'low' },
  { category: 'market', title: 'High volatility alert', message: 'BANKNIFTY volatility has increased sharply in the last hour.', priority: 'medium' },
  { category: 'ai', title: 'New AI recommendation', message: 'Our model flagged a BUY signal for INFY with 87% confidence.', priority: 'medium' },
  { category: 'ai', title: 'Portfolio health update', message: 'Your diversification score improved to 78/100 this week.', priority: 'low' },
  { category: 'news', title: 'Breaking: RBI policy update', message: 'RBI keeps repo rate unchanged, signals steady growth outlook.', priority: 'low' },
  { category: 'portfolio', title: 'Portfolio milestone', message: 'Your portfolio crossed ₹6,00,000 in total value.', priority: 'low' },
  { category: 'portfolio', title: 'Dividend credited', message: 'You received ₹1,240 dividend from HDFCBANK.', priority: 'low' },
  { category: 'trade', title: 'Order cancelled', message: 'Your LIMIT order for WIPRO was cancelled due to expiry.', priority: 'low' },
];

let STORE: AppNotification[] | null = null;

function buildNotifications(): AppNotification[] {
  const rng = seededRandom(3344);
  const items = TEMPLATES.map((t, i) => ({
    id: generateId('notif'),
    category: t.category,
    title: t.title,
    message: t.message,
    priority: t.priority,
    timestamp: daysAgoISO(0, i * 3 + randomInt(rng, 0, 4)),
    read: rng() > 0.55,
  }));
  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function getStore(): AppNotification[] {
  if (!STORE) STORE = buildNotifications();
  return STORE;
}

export async function getNotifications(category?: NotificationCategory): Promise<AppNotification[]> {
  const items = getStore();
  return delay(category ? items.filter((n) => n.category === category) : items);
}

export async function getUnreadCount(): Promise<number> {
  return delay(getStore().filter((n) => !n.read).length, 100);
}

export async function markAsRead(id: string): Promise<void> {
  const item = getStore().find((n) => n.id === id);
  if (item) item.read = true;
  return delay(undefined, 100);
}

export async function markAllAsRead(): Promise<void> {
  getStore().forEach((n) => (n.read = true));
  return delay(undefined, 150);
}

export function pickRandomTemplate() {
  const rng = seededRandom(Date.now());
  return pick(rng, TEMPLATES);
}
