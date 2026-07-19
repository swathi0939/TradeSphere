import type { TickerRow } from '@/types';

export const DASHBOARD_TICKERS: TickerRow[] = [
  {
    symbol: 'RELIANCE',
    price: '2,945.10',
    direction: 'up',
    sparkline: '0,25 15,20 30,22 45,12 60,15 75,6 100,4',
  },
  {
    symbol: 'TCS',
    price: '3,812.55',
    direction: 'down',
    sparkline: '0,5 15,10 30,8 45,18 60,16 75,24 100,26',
  },
  {
    symbol: 'INFY',
    price: '1,512.40',
    direction: 'up',
    sparkline: '0,22 15,18 30,19 45,10 60,13 75,8 100,3',
  },
];

export const PORTFOLIO_VALUE = '₹3,84,210';
export const PORTFOLIO_ALLOCATION_PCT = 68;
