export type Exchange = 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
export type AssetClass = 'equity' | 'index' | 'forex' | 'crypto' | 'commodity';

export interface Stock {
  symbol: string;
  name: string;
  exchange: Exchange;
  assetClass: AssetClass;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  open: number;
  prevClose: number;
  dayHigh: number;
  dayLow: number;
  high52w: number;
  low52w: number;
  sparkline: number[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
}
