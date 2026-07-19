import type { NewsItem } from './market';

export interface MarketMoveExplanation {
  symbol: string;
  name: string;
  changePercent: number;
  direction: 'up' | 'down' | 'flat';
  sectorContext: string; // e.g. a sentence comparing the stock's move to its sector average
  relatedNews: NewsItem[];
  narrative: string; // the main plain-English explanation paragraph
}
