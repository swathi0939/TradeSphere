import * as portfolioService from '@/services/portfolioService';
import * as aiService from '@/services/aiService';
import * as newsService from '@/services/newsService';
import { delay, formatCurrency, hashString, pick, seededRandom } from './mockUtils';
import type { DailyBrief, DailyBriefHighlight } from '@/types/dailyBrief';

/**
 * NOTE on determinism: `portfolioService.getPortfolioSummary`,
 * `aiService.getMarketSentiment`, `aiService.getAIInsights`, and
 * `newsService.getNews` all seed their PRNGs with FIXED, non-date seeds (e.g.
 * `seededRandom(6677)`) — that is pre-existing, intentional behavior elsewhere
 * in the app, so their numbers do NOT change day to day. This is out of scope
 * to change here: re-seeding those services by date would silently alter the
 * numbers shown on `AIInsightsPage`/`PortfolioPage`, breaking other pages.
 *
 * The date-based seed (`daySeed`) below is used ONLY for cosmetic variety in
 * THIS file — e.g. `pick()`-ing between a couple of alternate phrasings for
 * the greeting/summary sentence structure, or reordering the `highlights`
 * chips — never to alter any underlying fact or number, which always comes
 * straight from the real fetched data above.
 */

function getGreetingPrefix(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function getDailyBrief(userName?: string): Promise<DailyBrief> {
  const [summary, sentiment, news, insights] = await Promise.all([
    portfolioService.getPortfolioSummary(),
    aiService.getMarketSentiment(),
    newsService.getNews(3),
    aiService.getAIInsights(3),
  ]);

  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const daySeed = seededRandom(hashString(dateKey));

  const greeting = `${getGreetingPrefix(now.getHours())}${userName ? `, ${userName}` : ''}`;

  const topInsight = insights[0];
  const topNews = news[0];
  const isUp = summary.todayPnl >= 0;

  const performanceSentence = pick(daySeed, [
    `Your portfolio is ${isUp ? 'up' : 'down'} ${Math.abs(summary.todayPnlPercent).toFixed(2)}% today.`,
    `Today's portfolio move: ${isUp ? '+' : '-'}${Math.abs(summary.todayPnlPercent).toFixed(2)}%, now valued at ${formatCurrency(summary.totalValue)}.`,
  ]);

  const sentimentSentence = pick(daySeed, [
    `Market sentiment is currently ${sentiment.label.toLowerCase()}.`,
    `Overall market mood reads ${sentiment.label.toLowerCase()}, with a Fear & Greed reading of ${sentiment.fearGreedIndex}.`,
  ]);

  const insightSentence = topInsight
    ? pick(daySeed, [
        `Our model flags ${topInsight.symbol} as a ${topInsight.action} with ${topInsight.confidence}% confidence.`,
        `Top signal today: ${topInsight.action} ${topInsight.symbol} at ${topInsight.confidence}% confidence.`,
      ])
    : '';

  const newsSentence = topNews ? `In the news: "${topNews.headline}."` : '';

  const narrative = [performanceSentence, sentimentSentence, insightSentence, newsSentence].filter(Boolean).join(' ');

  const highlights: DailyBriefHighlight[] = [
    {
      label: "Today's P&L",
      value: formatCurrency(summary.todayPnl),
      tone: isUp ? 'positive' : 'negative',
    },
    {
      label: 'Market Sentiment',
      value: sentiment.label,
      tone: 'neutral',
    },
    {
      label: 'Top Pick',
      value: topInsight?.symbol ?? '—',
      tone: 'neutral',
    },
    {
      label: 'Portfolio Value',
      value: formatCurrency(summary.totalValue),
      tone: 'neutral',
    },
  ];

  // Cosmetic-only reordering of the highlight chips, seeded by date (see note above).
  const orderedHighlights = [...highlights].sort(() => daySeed() - 0.5);

  return delay({
    greeting,
    date: dateKey,
    summary: narrative,
    highlights: orderedHighlights,
  });
}
