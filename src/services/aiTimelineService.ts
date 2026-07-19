import type { TimelineEvent } from '@/types';
import * as portfolioService from '@/services/portfolioService';
import * as aiService from '@/services/aiService';
import * as ordersService from '@/services/ordersService';
import * as newsService from '@/services/newsService';
import { daysAgoISO, delay, formatCurrency } from './mockUtils';

export async function getAITimeline(days = 45): Promise<TimelineEvent[]> {
  const [performance, insights, orders, news] = await Promise.all([
    portfolioService.getPerformanceHistory(days),
    aiService.getAIInsights(8),
    ordersService.getOrders(),
    newsService.getNews(6),
  ]);

  const milestoneEvents: TimelineEvent[] = performance
    .map((point, i) => {
      if (i === 0) return null;
      const prev = performance[i - 1];
      if (!prev) return null;
      const changePercent = ((point.value - prev.value) / prev.value) * 100;
      return { point, changePercent };
    })
    .filter((entry): entry is { point: (typeof performance)[number]; changePercent: number } => entry !== null && Math.abs(entry.changePercent) > 1.5)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 6)
    .map(({ point, changePercent }) => ({
      id: `timeline-milestone-${point.date}`,
      date: point.date,
      type: 'milestone',
      title: `Portfolio ${changePercent >= 0 ? 'jumped' : 'dropped'} ${Math.abs(changePercent).toFixed(2)}%`,
      description: `Portfolio value moved to ${formatCurrency(point.value)}.`,
      tone: changePercent >= 0 ? 'positive' : 'negative',
    }));

  const insightEvents: TimelineEvent[] = insights.map((insight, index) => ({
    id: `timeline-insight-${insight.id}`,
    date: daysAgoISO(index * 3 + 1),
    type: 'insight',
    title: `AI flagged ${insight.symbol} as a ${insight.action}`,
    description: insight.reason,
    tone: insight.action === 'SELL' ? 'negative' : insight.action === 'BUY' ? 'positive' : 'neutral',
  }));

  const tradeEvents: TimelineEvent[] = orders
    .filter((order) => order.status === 'COMPLETED')
    .slice(0, 8)
    .map((order) => ({
      id: `timeline-trade-${order.id}`,
      date: order.timestamp,
      type: 'trade',
      title: `${order.side === 'BUY' ? 'Bought' : 'Sold'} ${order.quantity} ${order.symbol}`,
      description: `${order.orderKind} order at ${formatCurrency(order.price)}.`,
      tone: order.side === 'BUY' ? 'positive' : 'neutral',
    }));

  const newsEvents: TimelineEvent[] = news.map((item) => ({
    id: `timeline-news-${item.id}`,
    date: item.timestamp,
    type: 'news',
    title: item.headline,
    description: item.summary,
    tone: item.sentiment === 'positive' ? 'positive' : item.sentiment === 'negative' ? 'negative' : 'neutral',
  }));

  const cutoff = Date.now() - days * 86400000;
  const events = [...milestoneEvents, ...insightEvents, ...tradeEvents, ...newsEvents]
    .filter((event) => new Date(event.date).getTime() >= cutoff)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return delay(events);
}
