import type { Exchange, MarketIndex, Stock } from '@/types';
import { generateSparkline, hashString, randomBetween, randomInt, seededRandom } from './mockUtils';

interface StockSeed {
  symbol: string;
  name: string;
  exchange: Exchange;
  sector: string;
  basePrice: number;
}

const STOCK_SEEDS: StockSeed[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', sector: 'Energy', basePrice: 2945 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'IT Services', basePrice: 3812 },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE', sector: 'IT Services', basePrice: 1512 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', sector: 'Banking', basePrice: 1648 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE', sector: 'Banking', basePrice: 1189 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Banking', basePrice: 812 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', exchange: 'NSE', sector: 'Telecom', basePrice: 1594 },
  { symbol: 'ITC', name: 'ITC Ltd.', exchange: 'NSE', sector: 'FMCG', basePrice: 462 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', exchange: 'NSE', sector: 'Infrastructure', basePrice: 3612 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', sector: 'FMCG', basePrice: 2384 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', sector: 'Banking', basePrice: 1756 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', exchange: 'NSE', sector: 'NBFC', basePrice: 7124 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', exchange: 'NSE', sector: 'Automobile', basePrice: 11842 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', exchange: 'NSE', sector: 'Consumer Goods', basePrice: 2894 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', exchange: 'NSE', sector: 'IT Services', basePrice: 486 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind.', exchange: 'NSE', sector: 'Pharma', basePrice: 1642 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', exchange: 'NSE', sector: 'Consumer Goods', basePrice: 3428 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', exchange: 'NSE', sector: 'Diversified', basePrice: 2942 },
  { symbol: 'NTPC', name: 'NTPC Ltd.', exchange: 'NSE', sector: 'Energy', basePrice: 362 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp.', exchange: 'NSE', sector: 'Energy', basePrice: 268 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', exchange: 'NSE', sector: 'Automobile', basePrice: 784 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', exchange: 'NSE', sector: 'Banking', basePrice: 1142 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', exchange: 'NSE', sector: 'Cement', basePrice: 11284 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp.', exchange: 'NSE', sector: 'Energy', basePrice: 324 },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', exchange: 'NSE', sector: 'FMCG', basePrice: 2246 },
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', sector: 'Technology', basePrice: 228 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', sector: 'Technology', basePrice: 421 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', sector: 'Technology', basePrice: 172 },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', sector: 'Automobile', basePrice: 248 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', sector: 'Technology', basePrice: 138 },
];

function buildStock(seed: StockSeed): Stock {
  const rng = seededRandom(hashString(seed.symbol));
  const changePercent = Number(randomBetween(rng, -3.2, 3.2).toFixed(2));
  const price = Number((seed.basePrice * (1 + changePercent / 100)).toFixed(2));
  const change = Number((price - seed.basePrice).toFixed(2));
  const dayHigh = Number((price * randomBetween(rng, 1.001, 1.02)).toFixed(2));
  const dayLow = Number((price * randomBetween(rng, 0.98, 0.999)).toFixed(2));

  return {
    symbol: seed.symbol,
    name: seed.name,
    exchange: seed.exchange,
    assetClass: 'equity',
    sector: seed.sector,
    price,
    change,
    changePercent,
    volume: randomInt(rng, 400_000, 18_000_000),
    marketCap: Number((price * randomInt(rng, 200_000_000, 6_000_000_000)).toFixed(0)),
    open: seed.basePrice,
    prevClose: seed.basePrice,
    dayHigh,
    dayLow,
    high52w: Number((price * randomBetween(rng, 1.15, 1.55)).toFixed(2)),
    low52w: Number((price * randomBetween(rng, 0.55, 0.85)).toFixed(2)),
    sparkline: generateSparkline(seed.symbol, 30, 0.018),
  };
}

export const STOCK_UNIVERSE: Stock[] = STOCK_SEEDS.map(buildStock);

interface IndexSeed {
  symbol: string;
  name: string;
  baseValue: number;
}

const INDEX_SEEDS: IndexSeed[] = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', baseValue: 22458.3 },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', baseValue: 48212.6 },
  { symbol: 'SENSEX', name: 'BSE SENSEX', baseValue: 73958.1 },
  { symbol: 'NASDAQ', name: 'NASDAQ Composite', baseValue: 17862.4 },
  { symbol: 'SP500', name: 'S&P 500', baseValue: 5464.2 },
];

function buildIndex(seed: IndexSeed): MarketIndex {
  const rng = seededRandom(hashString(seed.symbol));
  const changePercent = Number(randomBetween(rng, -1.6, 1.6).toFixed(2));
  const value = Number((seed.baseValue * (1 + changePercent / 100)).toFixed(2));
  const change = Number((value - seed.baseValue).toFixed(2));

  return {
    symbol: seed.symbol,
    name: seed.name,
    value,
    change,
    changePercent,
    sparkline: generateSparkline(seed.symbol, 30, 0.01),
  };
}

export const MARKET_INDICES: MarketIndex[] = INDEX_SEEDS.map(buildIndex);

interface CryptoForexSeed {
  symbol: string;
  name: string;
  baseValue: number;
  unit: string;
}

const CRYPTO_SEEDS: CryptoForexSeed[] = [
  { symbol: 'BTC', name: 'Bitcoin', baseValue: 97250, unit: '$' },
  { symbol: 'ETH', name: 'Ethereum', baseValue: 3412, unit: '$' },
  { symbol: 'SOL', name: 'Solana', baseValue: 198, unit: '$' },
];

const FOREX_SEEDS: CryptoForexSeed[] = [
  { symbol: 'USDINR', name: 'USD / INR', baseValue: 84.32, unit: '₹' },
  { symbol: 'EURINR', name: 'EUR / INR', baseValue: 91.14, unit: '₹' },
  { symbol: 'GBPINR', name: 'GBP / INR', baseValue: 106.72, unit: '₹' },
];

const COMMODITY_SEEDS: CryptoForexSeed[] = [
  { symbol: 'GOLD', name: 'Gold (10g)', baseValue: 74250, unit: '₹' },
  { symbol: 'SILVER', name: 'Silver (1kg)', baseValue: 91800, unit: '₹' },
  { symbol: 'CRUDEOIL', name: 'Crude Oil (bbl)', baseValue: 6842, unit: '₹' },
];

export interface TickerAsset {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  unit: string;
  sparkline: number[];
}

function buildTickerAsset(seed: CryptoForexSeed, volatility: number): TickerAsset {
  const rng = seededRandom(hashString(seed.symbol));
  const changePercent = Number(randomBetween(rng, -volatility, volatility).toFixed(2));
  const value = Number((seed.baseValue * (1 + changePercent / 100)).toFixed(2));
  const change = Number((value - seed.baseValue).toFixed(2));
  return {
    symbol: seed.symbol,
    name: seed.name,
    value,
    change,
    changePercent,
    unit: seed.unit,
    sparkline: generateSparkline(seed.symbol, 30, volatility / 100),
  };
}

export const CRYPTO_ASSETS: TickerAsset[] = CRYPTO_SEEDS.map((s) => buildTickerAsset(s, 6));
export const FOREX_ASSETS: TickerAsset[] = FOREX_SEEDS.map((s) => buildTickerAsset(s, 0.6));
export const COMMODITY_ASSETS: TickerAsset[] = COMMODITY_SEEDS.map((s) => buildTickerAsset(s, 1.4));
