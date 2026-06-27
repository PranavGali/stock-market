import { simulateDelay } from './api';
import { mockNews } from '@/data/mock';
import type { NewsArticle } from '@/types';

export async function getAllNews(): Promise<NewsArticle[]> {
  await simulateDelay(300);
  return mockNews;
}

export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  await simulateDelay(250);
  if (category === 'All') return mockNews;
  return mockNews.filter(n => n.category === category);
}

export async function getNewsForSymbol(symbol: string): Promise<NewsArticle[]> {
  await simulateDelay(250);
  return mockNews.filter(n => n.relatedSymbols.includes(symbol));
}

export async function getTrendingNews(): Promise<NewsArticle[]> {
  await simulateDelay(200);
  return mockNews.slice(0, 4);
}
