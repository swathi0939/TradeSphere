import type { NewsIntelligence, SentimentBreakdown, TrendingTopic } from '@/types';
import * as newsService from './newsService';
import { STOCK_UNIVERSE } from './stockUniverse';
import { delay } from './mockUtils';

export async function getNewsIntelligence(limit = 20): Promise<NewsIntelligence> {
  const items = await newsService.getNews(limit);

  const sentimentBreakdown: SentimentBreakdown = { positive: 0, negative: 0, neutral: 0 };
  for (const item of items) {
    sentimentBreakdown[item.sentiment] += 1;
  }

  const mentionCounts = new Map<string, number>();
  for (const item of items) {
    for (const symbol of item.relatedSymbols) {
      mentionCounts.set(symbol, (mentionCounts.get(symbol) ?? 0) + 1);
    }
  }

  const trendingTopics: TrendingTopic[] = Array.from(mentionCounts.entries())
    .map(([symbol, mentionCount]): TrendingTopic | null => {
      const stock = STOCK_UNIVERSE.find((s) => s.symbol === symbol);
      if (!stock) return null;
      return { symbol, name: stock.name, sector: stock.sector, mentionCount };
    })
    .filter((topic): topic is TrendingTopic => topic !== null)
    .sort((a, b) => b.mentionCount - a.mentionCount)
    .slice(0, 6);

  const dominantSentiment = (Object.keys(sentimentBreakdown) as Array<keyof SentimentBreakdown>).reduce((a, b) =>
    sentimentBreakdown[b] > sentimentBreakdown[a] ? b : a,
  );

  const topTopic = trendingTopics[0];

  const digest = `Today's coverage skews ${dominantSentiment}, with ${items.length} stories tracked across the market.${
    topTopic ? ` ${topTopic.symbol} is the most-mentioned name, appearing in ${topTopic.mentionCount} ${topTopic.mentionCount === 1 ? 'story' : 'stories'}.` : ''
  }`;

  return delay({ items, sentimentBreakdown, trendingTopics, digest });
}
