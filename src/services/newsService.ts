import type { NewsItem } from '@/types';
import { daysAgoISO, delay, generateId, pick, randomInt, seededRandom } from './mockUtils';

const HEADLINES: Array<{ headline: string; summary: string; sentiment: NewsItem['sentiment']; symbols: string[] }> = [
  {
    headline: 'RBI holds repo rate steady, signals cautious optimism on inflation',
    summary: 'The central bank kept rates unchanged for the fourth straight meeting, citing stable inflation trends and steady growth momentum.',
    sentiment: 'positive',
    symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
  },
  {
    headline: 'IT majors report stronger-than-expected deal wins in Q3',
    summary: 'Large-cap IT services firms posted robust order books, driven by renewed enterprise spending on cloud migration and AI adoption.',
    sentiment: 'positive',
    symbols: ['TCS', 'INFY', 'WIPRO'],
  },
  {
    headline: 'Crude oil prices climb on tighter supply outlook',
    summary: 'Global crude benchmarks rose over 2% as OPEC+ signaled extended production cuts, pressuring energy-import-heavy sectors.',
    sentiment: 'negative',
    symbols: ['ONGC', 'NTPC'],
  },
  {
    headline: 'Reliance announces new energy vertical expansion plans',
    summary: 'The conglomerate outlined a multi-year investment roadmap into green hydrogen and battery storage infrastructure.',
    sentiment: 'positive',
    symbols: ['RELIANCE'],
  },
  {
    headline: 'Auto sector sees mixed sales data for the festive quarter',
    summary: 'Passenger vehicle sales grew modestly while two-wheeler demand remained soft amid elevated financing costs.',
    sentiment: 'neutral',
    symbols: ['MARUTI', 'TATAMOTORS'],
  },
  {
    headline: 'Banking sector NPAs hit multi-year low, RBI data shows',
    summary: 'Asset quality across scheduled commercial banks continued to improve, supporting a positive credit growth outlook.',
    sentiment: 'positive',
    symbols: ['HDFCBANK', 'ICICIBANK', 'AXISBANK', 'KOTAKBANK'],
  },
  {
    headline: 'Global chipmakers rally on AI infrastructure demand',
    summary: 'Semiconductor stocks extended gains as hyperscalers raised capex guidance for AI data center buildouts.',
    sentiment: 'positive',
    symbols: ['NVDA'],
  },
  {
    headline: 'FMCG volumes soften in rural markets amid pricing pressure',
    summary: 'Consumer staples companies flagged slower rural demand recovery, though urban consumption stayed resilient.',
    sentiment: 'negative',
    symbols: ['ITC', 'HINDUNILVR', 'NESTLEIND'],
  },
  {
    headline: 'Pharma exports rise as US generics pricing stabilizes',
    summary: 'Indian pharmaceutical exporters benefited from firmer pricing in the US generics market after two years of erosion.',
    sentiment: 'positive',
    symbols: ['SUNPHARMA'],
  },
  {
    headline: 'Telecom ARPU expected to rise on tariff hike rollout',
    summary: 'Analysts project average revenue per user to climb over the next two quarters as tariff hikes fully filter through.',
    sentiment: 'positive',
    symbols: ['BHARTIARTL'],
  },
];

export async function getNews(limit = 8): Promise<NewsItem[]> {
  const rng = seededRandom(7788);
  const items: NewsItem[] = Array.from({ length: limit }, (_, i) => {
    const source = pick(rng, HEADLINES);
    return {
      id: generateId('news'),
      headline: source.headline,
      summary: source.summary,
      source: pick(rng, ['Economic Times', 'Moneycontrol', 'Bloomberg', 'Reuters', 'LiveMint']),
      timestamp: daysAgoISO(0, i * 2 + randomInt(rng, 0, 3)),
      sentiment: source.sentiment,
      relatedSymbols: source.symbols,
    };
  });
  return delay(items);
}
