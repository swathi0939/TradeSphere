import type { NewsItem } from './market';

export interface SentimentBreakdown {
  positive: number;
  negative: number;
  neutral: number;
}

export interface TrendingTopic {
  symbol: string;
  name: string;
  sector: string;
  mentionCount: number;
}

export interface NewsIntelligence {
  items: NewsItem[];
  sentimentBreakdown: SentimentBreakdown;
  trendingTopics: TrendingTopic[];
  digest: string;
}
