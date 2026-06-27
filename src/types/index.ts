// ─── Core Entities ──────────────────────────────────────────────────────────

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  pe: number;
  week52High: number;
  week52Low: number;
  logo: string;
  exchange: string;
  description: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: string;
}

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  sector: string;
  buyDate: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  category: 'Markets' | 'Economy' | 'Tech' | 'Earnings' | 'IPO' | 'Crypto' | 'Global';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  relatedSymbols: string[];
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  changePercent: number;
  alertPrice?: number;
  sector: string;
  addedAt: string;
}

export interface SectorPerformance {
  sector: string;
  change: number;
  marketCap: number;
  topStock: string;
}

export interface AnalystRating {
  firm: string;
  rating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  targetPrice: number;
  date: string;
}

export interface AIPrediction {
  symbol: string;
  name: string;
  logo: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  riskLevel: 'Low' | 'Medium' | 'High';
  reasoning: string;
  chartData: { date: string; actual?: number; predicted: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinedAt: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  role?: 'user' | 'admin';
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    newsAlerts: boolean;
  };
}

export interface AdminStat {
  label: string;
  value: string | number;
  change: number;
  icon: string;
}

export interface TimeRange {
  label: string;
  value: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

export type Theme = 'light' | 'dark';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
