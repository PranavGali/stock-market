import { simulateDelay } from './api';
import { mockStocks, mockSectorPerformance, mockMarketIndices } from '@/data/mock';
import { generateChartData } from '@/lib/utils';
import type { Stock, ChartDataPoint, SectorPerformance } from '@/types';

export async function getAllStocks(): Promise<Stock[]> {
  await simulateDelay(300);
  return mockStocks;
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
  await simulateDelay(200);
  return mockStocks.find(s => s.symbol === symbol) ?? null;
}

export async function searchStocks(query: string): Promise<Stock[]> {
  await simulateDelay(150);
  const q = query.toLowerCase();
  return mockStocks.filter(
    s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  );
}

export async function getStocksBysector(sector: string): Promise<Stock[]> {
  await simulateDelay(200);
  return mockStocks.filter(s => s.sector === sector);
}

export async function getStockChartData(
  symbol: string,
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
): Promise<ChartDataPoint[]> {
  await simulateDelay(350);
  const stock = mockStocks.find(s => s.symbol === symbol);
  const basePrice = stock?.price ?? 100;
  const daysMap: Record<string, number> = {
    '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 730,
  };
  return generateChartData(basePrice * 0.7, daysMap[period], 0.025);
}

export async function getTopGainers(): Promise<Stock[]> {
  await simulateDelay(200);
  return [...mockStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
}

export async function getTopLosers(): Promise<Stock[]> {
  await simulateDelay(200);
  return [...mockStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
}

export async function getMostActive(): Promise<Stock[]> {
  await simulateDelay(200);
  return [...mockStocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  await simulateDelay(250);
  return mockSectorPerformance;
}

export async function getMarketIndices() {
  await simulateDelay(200);
  return mockMarketIndices;
}

export async function getAnalystRatings(symbol: string) {
  await simulateDelay(300);
  const firms = ['Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Citi', 'Deutsche Bank'];
  const ratings = ['Strong Buy', 'Buy', 'Hold'] as const;
  const stock = mockStocks.find(s => s.symbol === symbol);
  const base = stock?.price ?? 100;
  return firms.map((firm, i) => ({
    firm,
    rating: ratings[i % 3],
    targetPrice: +(base * (1 + (Math.random() * 0.3))).toFixed(2),
    date: new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0],
  }));
}

export async function getTrendingStocks(): Promise<Stock[]> {
  await simulateDelay(200);
  return [mockStocks[4], mockStocks[0], mockStocks[6], mockStocks[16], mockStocks[15]];
}
