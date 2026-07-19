import type { AIInsight, InsightAction, MarketSentiment, MonthlyReturn, PortfolioHealth, PricePrediction, RiskMetrics } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { delay, generateId, pick, randomBetween, randomInt, seededRandom } from './mockUtils';

const REASONS: Record<InsightAction, string[]> = {
  BUY: [
    'Strong quarterly earnings beat with expanding margins.',
    'Technical breakout above key resistance with rising volume.',
    'Positive analyst revisions following sector tailwinds.',
    'Undervalued relative to sector peers on forward P/E.',
  ],
  SELL: [
    'Overbought on RSI with bearish divergence forming.',
    'Weakening fundamentals amid rising input costs.',
    'Approaching 52-week high with declining momentum.',
    'Sector headwinds likely to compress near-term margins.',
  ],
  HOLD: [
    'Trading within a stable range, awaiting earnings catalyst.',
    'Fair valuation with balanced risk-reward at current levels.',
    'Mixed technical signals suggest waiting for confirmation.',
  ],
};

export async function getAIInsights(limit = 6): Promise<AIInsight[]> {
  const rng = seededRandom(5566);
  const shuffled = [...STOCK_UNIVERSE].sort(() => rng() - 0.5).slice(0, limit);

  const insights: AIInsight[] = shuffled.map((stock) => {
    const action = pick(rng, ['BUY', 'SELL', 'HOLD'] as InsightAction[]);
    const direction = action === 'SELL' ? -1 : action === 'BUY' ? 1 : rng() > 0.5 ? 1 : -1;
    const targetPrice = Number((stock.price * (1 + (direction * randomBetween(rng, 2, 12)) / 100)).toFixed(2));

    return {
      id: generateId('insight'),
      action,
      symbol: stock.symbol,
      name: stock.name,
      confidence: randomInt(rng, 62, 96),
      reason: pick(rng, REASONS[action] ?? REASONS.HOLD),
      targetPrice,
      currentPrice: stock.price,
      horizon: pick(rng, ['Short-term', 'Medium-term', 'Long-term']),
    };
  });

  return delay(insights);
}

export async function getMarketSentiment(): Promise<MarketSentiment> {
  const rng = seededRandom(6677);
  const score = randomInt(rng, 35, 82);
  const label: MarketSentiment['label'] = score > 70 ? 'Very Bullish' : score > 58 ? 'Bullish' : score > 42 ? 'Neutral' : score > 28 ? 'Bearish' : 'Very Bearish';

  return delay({
    score,
    label,
    fearGreedIndex: randomInt(rng, 20, 85),
    summary:
      score > 55
        ? 'Broad-based buying interest across large caps, with institutional flows turning net positive over the past week.'
        : 'Markets remain range-bound as investors await macro cues; volatility has ticked up in mid-cap names.',
  });
}

export async function getPortfolioHealth(): Promise<PortfolioHealth> {
  const rng = seededRandom(7799);
  const diversificationScore = randomInt(rng, 55, 92);
  const riskScore = randomInt(rng, 30, 75);

  return delay({
    score: Math.round((diversificationScore + (100 - riskScore)) / 2),
    diversificationScore,
    riskScore,
    concentrationWarning: diversificationScore < 65 ? 'Over 40% of your portfolio is concentrated in IT & Banking sectors.' : undefined,
    suggestions: [
      'Consider adding exposure to Healthcare or Pharma to improve diversification.',
      'Your Banking allocation is above the recommended threshold — consider partial rebalancing.',
      'Rising volatility detected in 2 holdings — review stop-loss levels.',
    ],
  });
}

export async function getPricePredictions(limit = 5): Promise<PricePrediction[]> {
  const rng = seededRandom(8811);
  const shuffled = [...STOCK_UNIVERSE].sort(() => rng() - 0.5).slice(0, limit);

  const predictions: PricePrediction[] = shuffled.map((stock) => {
    const predictedChangePercent = Number(randomBetween(rng, -8, 14).toFixed(2));
    return {
      symbol: stock.symbol,
      currentPrice: stock.price,
      predictedPrice: Number((stock.price * (1 + predictedChangePercent / 100)).toFixed(2)),
      predictedChangePercent,
      confidence: randomInt(rng, 58, 91),
      timeframe: '30 days',
    };
  });

  return delay(predictions);
}

export async function getRiskMetrics(): Promise<RiskMetrics> {
  const rng = seededRandom(9922);
  return delay({
    volatility: Number(randomBetween(rng, 12, 28).toFixed(1)),
    sharpeRatio: Number(randomBetween(rng, 0.8, 2.4).toFixed(2)),
    beta: Number(randomBetween(rng, 0.7, 1.4).toFixed(2)),
    maxDrawdown: Number(randomBetween(rng, -22, -6).toFixed(1)),
    var95: Number(randomBetween(rng, -5.5, -1.5).toFixed(2)),
  });
}

export async function getMonthlyReturns(): Promise<MonthlyReturn[]> {
  const rng = seededRandom(1122);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return delay(months.map((month) => ({ month, returnPercent: Number(randomBetween(rng, -6, 9).toFixed(2)) })));
}
