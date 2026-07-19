import { getStockBySymbol, getStocksBySector } from './stocksService';
import { getNews } from './newsService';
import { delay } from './mockUtils';
import type { MarketMoveExplanation } from '@/types/marketExplainer';

/**
 * Builds a rule-based, data-grounded explanation for why a stock's price
 * moved: its own change%, how that compares to its sector's average
 * change% (computed from the same mock stock universe), and any recent
 * mock news headlines that mention the symbol.
 */
export async function explainMove(symbol: string): Promise<MarketMoveExplanation | null> {
  const stock = await getStockBySymbol(symbol);
  if (!stock) return null;

  const sectorStocks = await getStocksBySector(stock.sector);
  const sectorAverage = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
  const delta = Number((stock.changePercent - sectorAverage).toFixed(2));

  let sectorContext: string;
  if (Math.abs(delta) < 0.05) {
    sectorContext = `This is in line with its ${stock.sector} sector average of ${sectorAverage.toFixed(2)}% today.`;
  } else if (delta > 0) {
    sectorContext = `This is ${delta.toFixed(2)} points better than its ${stock.sector} sector average of ${sectorAverage.toFixed(2)}% today.`;
  } else {
    sectorContext = `This is ${Math.abs(delta).toFixed(2)} points worse than its ${stock.sector} sector average of ${sectorAverage.toFixed(2)}% today.`;
  }

  const news = await getNews(10);
  const relatedNews = news.filter((n) => n.relatedSymbols.includes(symbol));

  const direction: MarketMoveExplanation['direction'] = stock.changePercent > 0.05 ? 'up' : stock.changePercent < -0.05 ? 'down' : 'flat';
  const moveVerb = direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'flat';

  const newsSentence =
    relatedNews.length > 0
      ? `The most relevant headline: "${relatedNews[0]!.headline}" (${relatedNews[0]!.source}).`
      : 'No major company-specific news was found for this move.';

  const narrative = `${stock.name} is ${moveVerb} ${Math.abs(stock.changePercent).toFixed(2)}% today. ${sectorContext} ${newsSentence}`;

  const explanation: MarketMoveExplanation = {
    symbol: stock.symbol,
    name: stock.name,
    changePercent: stock.changePercent,
    direction,
    sectorContext,
    relatedNews,
    narrative,
  };

  return delay(explanation);
}
