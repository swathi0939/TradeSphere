export type OrderSide = 'BUY' | 'SELL';
export type OrderKind = 'MARKET' | 'LIMIT' | 'STOP_LOSS';
export type OrderStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

export interface Order {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  orderKind: OrderKind;
  quantity: number;
  price: number;
  triggerPrice?: number;
  status: OrderStatus;
  timestamp: string;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'BUY' | 'SELL' | 'DIVIDEND';
export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  symbol?: string;
  timestamp: string;
  status: TransactionStatus;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: string;
}
