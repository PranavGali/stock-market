import { simulateDelay } from './api';
import { mockHoldings, mockTransactions, mockPortfolioHistory } from '@/data/mock';
import type { Holding, Transaction, PortfolioSummary } from '@/types';

export async function getHoldings(): Promise<Holding[]> {
  await simulateDelay(300);
  return mockHoldings;
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  await simulateDelay(200);
  const totalInvested = mockHoldings.reduce(
    (acc, h) => acc + h.avgBuyPrice * h.quantity, 0
  );
  const currentValue = mockHoldings.reduce(
    (acc, h) => acc + h.currentPrice * h.quantity, 0
  );
  const totalPnL = currentValue - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;
  const dayChange = currentValue * 0.0043;
  const dayChangePercent = 0.43;
  return { totalInvested, currentValue, totalPnL, totalPnLPercent, dayChange, dayChangePercent };
}

export async function getTransactions(): Promise<Transaction[]> {
  await simulateDelay(300);
  return mockTransactions;
}

export async function getPortfolioHistory() {
  await simulateDelay(350);
  return mockPortfolioHistory;
}

export async function executeTrade(
  symbol: string,
  type: 'BUY' | 'SELL',
  quantity: number,
  price: number
): Promise<Transaction> {
  await simulateDelay(800);
  const newTransaction: Transaction = {
    id: `t${Date.now()}`,
    symbol,
    name: symbol,
    type,
    quantity,
    price,
    total: price * quantity,
    date: new Date().toISOString(),
    status: 'COMPLETED',
  };
  return newTransaction;
}
