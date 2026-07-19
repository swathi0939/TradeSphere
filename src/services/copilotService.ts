import type { MarketSentiment, PortfolioSummary, Stock } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { getStockBySymbol } from './stocksService';
import { getPortfolioSummary } from './portfolioService';
import { getMarketSentiment } from './aiService';
import { delay, formatCurrency } from './mockUtils';

/** Escapes regex metacharacters so a stock symbol/name can be embedded literally in a RegExp. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * True when `term` appears in `text` as a whole word/phrase — a lookbehind/lookahead
 * boundary rather than `\b`, since `\b` misbehaves at trailing punctuation (e.g. "Ltd.").
 */
function mentionsTerm(text: string, term: string): boolean {
  const pattern = new RegExp(`(?<=^|\\W)${escapeRegExp(term)}(?=\\W|$)`, 'i');
  return pattern.test(text);
}

function findMentionedStock(message: string): Stock | undefined {
  return STOCK_UNIVERSE.find((stock) => mentionsTerm(message, stock.symbol) || mentionsTerm(message, stock.name));
}

function buildStockReply(stock: Stock): string {
  const direction = stock.change >= 0 ? 'up' : 'down';
  return `${stock.name} (${stock.symbol}) is currently trading at ${formatCurrency(stock.price)}, ${direction} ${Math.abs(stock.changePercent).toFixed(2)}% today.`;
}

function buildPortfolioReply(summary: PortfolioSummary): string {
  const pnlSign = summary.todayPnl >= 0 ? '+' : '-';
  const pnlPercentSign = summary.todayPnlPercent >= 0 ? '+' : '-';
  return `Your portfolio is currently worth ${formatCurrency(summary.totalValue)}. Today's P&L is ${pnlSign}${formatCurrency(Math.abs(summary.todayPnl))} (${pnlPercentSign}${Math.abs(summary.todayPnlPercent).toFixed(2)}%).`;
}

function buildSentimentReply(sentiment: MarketSentiment): string {
  return `Market sentiment is currently ${sentiment.label} (score ${sentiment.score}/100). ${sentiment.summary}`;
}

const FALLBACK_REPLY =
  'I can help with questions about your portfolio, specific stocks, or overall market sentiment — try asking about a stock symbol, your holdings, or how the market is doing today.';

/** Simulated AI Copilot reply — pattern-matches the message against real mock service data. */
export async function getResponse(message: string): Promise<string> {
  const mentionedStock = findMentionedStock(message);
  if (mentionedStock) {
    const stock = await getStockBySymbol(mentionedStock.symbol);
    if (stock) return delay(buildStockReply(stock), 700);
  }

  const lower = message.toLowerCase();

  if (lower.includes('portfolio') || lower.includes('holdings') || lower.includes('how am i doing')) {
    const summary = await getPortfolioSummary();
    return delay(buildPortfolioReply(summary), 700);
  }

  if (lower.includes('market') || lower.includes('sentiment')) {
    const sentiment = await getMarketSentiment();
    return delay(buildSentimentReply(sentiment), 700);
  }

  return delay(FALLBACK_REPLY, 700);
}
