import type { Transaction, TransactionType } from '@/types';
import { STOCK_UNIVERSE } from './stockUniverse';
import { daysAgoISO, delay, generateId, pick, randomBetween, randomInt, seededRandom } from './mockUtils';

const TYPES: TransactionType[] = ['DEPOSIT', 'WITHDRAWAL', 'BUY', 'SELL', 'DIVIDEND'];

export async function getTransactions(limit = 20): Promise<Transaction[]> {
  const rng = seededRandom(9911);
  const transactions: Transaction[] = Array.from({ length: limit }, () => {
    const type = pick(rng, TYPES);
    const needsSymbol = type === 'BUY' || type === 'SELL' || type === 'DIVIDEND';
    const stock = needsSymbol ? pick(rng, STOCK_UNIVERSE) : null;
    const amount =
      type === 'DEPOSIT' || type === 'WITHDRAWAL'
        ? randomInt(rng, 5000, 100000)
        : Number((randomBetween(rng, 1000, 85000)).toFixed(2));

    return {
      id: generateId('txn'),
      type,
      amount,
      symbol: stock?.symbol,
      timestamp: daysAgoISO(randomInt(rng, 0, 45), randomInt(rng, 0, 23)),
      status: rng() > 0.08 ? 'SUCCESS' : 'PENDING',
    } as Transaction;
  });

  return delay(transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
}
