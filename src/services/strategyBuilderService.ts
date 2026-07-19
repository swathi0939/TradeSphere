import type { Stock } from '@/types';
import type { StrategyBuilderInput, StrategyMatch, StrategyResult, StrategyTemplate, StrategyTemplateId } from '@/types/strategyBuilder';
import { STOCK_UNIVERSE } from '@/services/stockUniverse';
import { delay } from '@/services/mockUtils';

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  { id: 'growth', label: 'Growth', description: 'High-momentum stocks with strong recent price appreciation.' },
  { id: 'value', label: 'Value', description: 'Stocks trading well below their 52-week high, potentially undervalued.' },
  { id: 'dividend', label: 'Dividend', description: 'Large-cap, stable-sector stocks suited for steady income.' },
  { id: 'momentum', label: 'Momentum', description: 'Stocks showing consistent upward movement over the last 30 days.' },
  { id: 'balanced', label: 'Balanced', description: 'A blended mix of growth, value, and stability factors.' },
];

const STABLE_SECTORS = ['Banking', 'Energy', 'FMCG', 'Telecom'];

export function getStrategyTemplates(): StrategyTemplate[] {
  return STRATEGY_TEMPLATES;
}

interface Scored {
  stock: Stock;
  score: number;
  rationale: string;
}

/** Scores a stock against the chosen template using only its real fields — every rationale is derived from the same numbers used to score it. */
function scoreStock(s: Stock, template: StrategyTemplateId): Scored {
  const volatility = Math.abs(s.changePercent);
  const growthScore = s.changePercent * 3 + Math.log10(s.marketCap) * 2;
  const valueScore = ((s.high52w - s.price) / s.high52w) * 100;
  const trend = s.sparkline.at(-1)! - s.sparkline[0]!;
  const trendPercent = (trend / s.sparkline[0]!) * 100;

  if (template === 'growth') {
    return {
      stock: s,
      score: growthScore,
      rationale: `Up ${s.changePercent.toFixed(2)}% with a market cap of ₹${(s.marketCap / 1e7).toFixed(0)} Cr.`,
    };
  }

  if (template === 'value') {
    return {
      stock: s,
      score: valueScore,
      rationale: `Trading ${valueScore.toFixed(1)}% below its 52-week high of ₹${s.high52w.toFixed(2)}.`,
    };
  }

  if (template === 'dividend') {
    const score = (STABLE_SECTORS.includes(s.sector) ? 50 : 0) + (10 - volatility) * 3 + Math.log10(s.marketCap) * 2;
    return {
      stock: s,
      score,
      rationale: `${s.sector} sector stability with modest ${volatility.toFixed(2)}% daily volatility.`,
    };
  }

  if (template === 'momentum') {
    return {
      stock: s,
      score: trendPercent,
      rationale: `${trend >= 0 ? 'Up' : 'Down'} ${Math.abs(trendPercent).toFixed(2)}% over the last 30 sessions.`,
    };
  }

  const score = (growthScore + valueScore + (10 - volatility) * 5) / 3;
  return {
    stock: s,
    score,
    rationale: `${s.sector} pick with a ${s.changePercent.toFixed(2)}% daily change, blending growth, value, and stability signals.`,
  };
}

/** Screens the mock stock universe for a strategy template + risk tolerance + optional sector focus — a deterministic, explainable shortlist, never random. */
export async function buildStrategy(input: StrategyBuilderInput): Promise<StrategyResult> {
  let candidates = STOCK_UNIVERSE;
  if (input.sectorFocus !== 'all') {
    candidates = candidates.filter((s) => s.sector === input.sectorFocus);
  }
  const sectorScoped = candidates;

  const maxVolatility = 1 + input.riskTolerance * 1.5;
  candidates = candidates.filter((s) => Math.abs(s.changePercent) <= maxVolatility);
  if (candidates.length === 0) candidates = sectorScoped;

  const scored = candidates.map((s) => scoreStock(s, input.template)).sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 8);

  const matches: StrategyMatch[] = top.map(({ stock, score, rationale }) => ({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    score: Math.round(score),
    rationale,
  }));

  const templateLabel = getStrategyTemplates().find((t) => t.id === input.template)?.label ?? input.template;
  const summary = `Found ${matches.length} ${templateLabel}-fit stocks${
    input.sectorFocus !== 'all' ? ` in ${input.sectorFocus}` : ''
  } at a risk tolerance of ${input.riskTolerance}/10.`;

  return delay({ matches, summary });
}
