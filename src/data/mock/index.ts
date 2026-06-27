import type { Stock, Holding, Transaction, NewsArticle, WatchlistItem, SectorPerformance, AIPrediction, User } from '@/types';
import { generateChartData } from '@/lib/utils';

// ─── Stocks ─────────────────────────────────────────────────────────────────

export const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.30, change: 2.45, changePercent: 1.31, volume: 54_230_000, marketCap: 2_940_000_000_000, sector: 'Technology', pe: 29.4, week52High: 199.62, week52Low: 143.90, logo: 'https://logo.clearbit.com/apple.com', exchange: 'NASDAQ', description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: -1.20, changePercent: -0.32, volume: 22_100_000, marketCap: 2_820_000_000_000, sector: 'Technology', pe: 34.2, week52High: 430.82, week52Low: 309.45, logo: 'https://logo.clearbit.com/microsoft.com', exchange: 'NASDAQ', description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 165.72, change: 3.18, changePercent: 1.96, volume: 18_450_000, marketCap: 2_060_000_000_000, sector: 'Technology', pe: 24.8, week52High: 191.75, week52Low: 130.67, logo: 'https://logo.clearbit.com/google.com', exchange: 'NASDAQ', description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, and internationally.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.42, change: 4.67, changePercent: 2.57, volume: 32_780_000, marketCap: 1_940_000_000_000, sector: 'Consumer Cyclical', pe: 42.1, week52High: 201.20, week52Low: 118.35, logo: 'https://logo.clearbit.com/amazon.com', exchange: 'NASDAQ', description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 22.30, changePercent: 2.62, volume: 41_560_000, marketCap: 2_160_000_000_000, sector: 'Technology', pe: 68.5, week52High: 974.00, week52Low: 393.78, logo: 'https://logo.clearbit.com/nvidia.com', exchange: 'NASDAQ', description: 'NVIDIA Corporation provides graphics, and compute and networking solutions in the United States.' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 497.68, change: -3.42, changePercent: -0.68, volume: 14_320_000, marketCap: 1_280_000_000_000, sector: 'Communication', pe: 26.3, week52High: 531.49, week52Low: 279.40, logo: 'https://logo.clearbit.com/meta.com', exchange: 'NASDAQ', description: 'Meta Platforms, Inc. engages in the development of social media applications.' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.23, change: -8.55, changePercent: -3.33, volume: 98_420_000, marketCap: 792_000_000_000, sector: 'Consumer Cyclical', pe: 52.8, week52High: 300.0, week52Low: 138.80, logo: 'https://logo.clearbit.com/tesla.com', exchange: 'NASDAQ', description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 198.54, change: 1.28, changePercent: 0.65, volume: 9_870_000, marketCap: 574_000_000_000, sector: 'Financial', pe: 11.4, week52High: 210.00, week52Low: 148.82, logo: 'https://logo.clearbit.com/jpmorganchase.com', exchange: 'NYSE', description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.' },
  { symbol: 'V', name: 'Visa Inc.', price: 274.35, change: 0.89, changePercent: 0.33, volume: 7_240_000, marketCap: 565_000_000_000, sector: 'Financial', pe: 30.6, week52High: 290.96, week52Low: 220.07, logo: 'https://logo.clearbit.com/visa.com', exchange: 'NYSE', description: 'Visa Inc. operates as a payments technology company worldwide.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 161.22, change: -0.44, changePercent: -0.27, volume: 5_680_000, marketCap: 388_000_000_000, sector: 'Healthcare', pe: 14.2, week52High: 175.97, week52Low: 143.13, logo: 'https://logo.clearbit.com/jnj.com', exchange: 'NYSE', description: 'Johnson & Johnson researches and develops, manufactures, and sells various products in the health care field worldwide.' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 68.72, change: 0.54, changePercent: 0.79, volume: 8_920_000, marketCap: 556_000_000_000, sector: 'Consumer Defensive', pe: 32.4, week52High: 72.66, week52Low: 46.77, logo: 'https://logo.clearbit.com/walmart.com', exchange: 'NYSE', description: 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 453.28, change: 2.14, changePercent: 0.47, volume: 3_450_000, marketCap: 432_000_000_000, sector: 'Financial', pe: 34.8, week52High: 480.32, week52Low: 356.00, logo: 'https://logo.clearbit.com/mastercard.com', exchange: 'NYSE', description: 'Mastercard Incorporated, a technology company, provides transaction processing and other payment-related products.' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 488.12, change: 5.67, changePercent: 1.18, volume: 3_120_000, marketCap: 453_000_000_000, sector: 'Healthcare', pe: 20.1, week52High: 560.58, week52Low: 413.01, logo: 'https://logo.clearbit.com/unitedhealthgroup.com', exchange: 'NYSE', description: 'UnitedHealth Group Incorporated operates as a diversified health care company.' },
  { symbol: 'HD', name: 'The Home Depot Inc.', price: 338.74, change: 1.92, changePercent: 0.57, volume: 4_230_000, marketCap: 337_000_000_000, sector: 'Consumer Cyclical', pe: 23.7, week52High: 395.00, week52Low: 274.26, logo: 'https://logo.clearbit.com/homedepot.com', exchange: 'NYSE', description: 'The Home Depot, Inc. operates as a home improvement retailer.' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 163.48, change: -0.22, changePercent: -0.13, volume: 6_780_000, marketCap: 387_000_000_000, sector: 'Consumer Defensive', pe: 25.8, week52High: 169.00, week52Low: 141.45, logo: 'https://logo.clearbit.com/pg.com', exchange: 'NYSE', description: 'The Procter & Gamble Company provides branded consumer packaged goods worldwide.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 167.84, change: 5.42, changePercent: 3.34, volume: 62_300_000, marketCap: 272_000_000_000, sector: 'Technology', pe: 44.2, week52High: 227.30, week52Low: 120.47, logo: 'https://logo.clearbit.com/amd.com', exchange: 'NASDAQ', description: 'Advanced Micro Devices, Inc. operates as a semiconductor company worldwide.' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 628.72, change: 12.44, changePercent: 2.02, volume: 5_670_000, marketCap: 274_000_000_000, sector: 'Communication', pe: 43.2, week52High: 700.00, week52Low: 335.75, logo: 'https://logo.clearbit.com/netflix.com', exchange: 'NASDAQ', description: 'Netflix, Inc. provides entertainment services worldwide.' },
  { symbol: 'ORCL', name: 'Oracle Corporation', price: 124.68, change: -2.34, changePercent: -1.84, volume: 8_450_000, marketCap: 339_000_000_000, sector: 'Technology', pe: 32.1, week52High: 162.32, week52Low: 99.26, logo: 'https://logo.clearbit.com/oracle.com', exchange: 'NYSE', description: 'Oracle Corporation offers products and services that address enterprise information technology environments worldwide.' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 274.18, change: 3.56, changePercent: 1.31, volume: 6_230_000, marketCap: 267_000_000_000, sector: 'Technology', pe: 54.6, week52High: 318.71, week52Low: 196.05, logo: 'https://logo.clearbit.com/salesforce.com', exchange: 'NYSE', description: 'Salesforce, Inc. provides customer relationship management technology.' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 31.24, change: -1.18, changePercent: -3.64, volume: 45_680_000, marketCap: 132_000_000_000, sector: 'Technology', pe: 18.4, week52High: 51.28, week52Low: 18.84, logo: 'https://logo.clearbit.com/intel.com', exchange: 'NASDAQ', description: 'Intel Corporation designs, develops, manufactures, markets, and sells computing and related products worldwide.' },
];

// ─── Holdings ────────────────────────────────────────────────────────────────

export const mockHoldings: Holding[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com', quantity: 15, avgBuyPrice: 155.20, currentPrice: 189.30, sector: 'Technology', buyDate: '2023-03-15' },
  { id: '2', symbol: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com', quantity: 5, avgBuyPrice: 620.00, currentPrice: 875.40, sector: 'Technology', buyDate: '2023-07-22' },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', logo: 'https://logo.clearbit.com/microsoft.com', quantity: 8, avgBuyPrice: 320.50, currentPrice: 378.85, sector: 'Technology', buyDate: '2023-01-10' },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', logo: 'https://logo.clearbit.com/amazon.com', quantity: 12, avgBuyPrice: 142.30, currentPrice: 186.42, sector: 'Consumer Cyclical', buyDate: '2023-05-08' },
  { id: '5', symbol: 'JPM', name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/jpmorganchase.com', quantity: 20, avgBuyPrice: 165.40, currentPrice: 198.54, sector: 'Financial', buyDate: '2023-09-14' },
  { id: '6', symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com', quantity: 10, avgBuyPrice: 280.00, currentPrice: 248.23, sector: 'Consumer Cyclical', buyDate: '2023-11-20' },
  { id: '7', symbol: 'GOOGL', name: 'Alphabet Inc.', logo: 'https://logo.clearbit.com/google.com', quantity: 18, avgBuyPrice: 138.60, currentPrice: 165.72, sector: 'Technology', buyDate: '2023-04-05' },
];

// ─── Transactions ─────────────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  { id: 't1', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'BUY', quantity: 3, price: 620.00, total: 1860.00, date: '2024-01-15T10:30:00Z', status: 'COMPLETED' },
  { id: 't2', symbol: 'AAPL', name: 'Apple Inc.', type: 'BUY', quantity: 5, price: 155.20, total: 776.00, date: '2024-01-18T14:22:00Z', status: 'COMPLETED' },
  { id: 't3', symbol: 'TSLA', name: 'Tesla Inc.', type: 'SELL', quantity: 2, price: 265.40, total: 530.80, date: '2024-01-22T09:45:00Z', status: 'COMPLETED' },
  { id: 't4', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'BUY', quantity: 4, price: 310.50, total: 1242.00, date: '2024-01-25T11:15:00Z', status: 'COMPLETED' },
  { id: 't5', symbol: 'META', name: 'Meta Platforms', type: 'BUY', quantity: 6, price: 390.20, total: 2341.20, date: '2024-02-02T13:30:00Z', status: 'COMPLETED' },
  { id: 't6', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'BUY', quantity: 8, price: 142.30, total: 1138.40, date: '2024-02-10T10:00:00Z', status: 'COMPLETED' },
  { id: 't7', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'SELL', quantity: 5, price: 155.80, total: 779.00, date: '2024-02-15T15:45:00Z', status: 'COMPLETED' },
  { id: 't8', symbol: 'JPM', name: 'JPMorgan Chase', type: 'BUY', quantity: 10, price: 178.40, total: 1784.00, date: '2024-02-20T09:20:00Z', status: 'COMPLETED' },
  { id: 't9', symbol: 'AMD', name: 'AMD', type: 'BUY', quantity: 15, price: 155.20, total: 2328.00, date: '2024-03-01T14:10:00Z', status: 'PENDING' },
  { id: 't10', symbol: 'NFLX', name: 'Netflix Inc.', type: 'BUY', quantity: 2, price: 585.40, total: 1170.80, date: '2024-03-05T10:55:00Z', status: 'COMPLETED' },
];

// ─── News Articles ────────────────────────────────────────────────────────────

export const mockNews: NewsArticle[] = [
  { id: 'n1', title: 'NVIDIA Surges 8% as AI Chip Demand Reaches Record Highs', summary: 'NVIDIA Corporation saw its stock surge to new highs as enterprise AI spending continues to accelerate, with data center revenues up 427% year-over-year in the latest quarter.', source: 'Bloomberg', url: '#', imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600', publishedAt: '2024-03-06T08:30:00Z', category: 'Earnings', sentiment: 'Bullish', relatedSymbols: ['NVDA', 'AMD', 'INTC'] },
  { id: 'n2', title: 'Federal Reserve Signals Potential Rate Cuts in Q2 2024', summary: 'Fed Chair Jerome Powell indicated that the central bank may begin cutting interest rates as inflation continues to move toward its 2% target, sending markets higher.', source: 'Reuters', url: '#', imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600', publishedAt: '2024-03-06T06:15:00Z', category: 'Economy', sentiment: 'Bullish', relatedSymbols: ['SPY', 'QQQ'] },
  { id: 'n3', title: 'Apple Vision Pro Sales Disappoint, Stock Dips 2%', summary: 'Early sales data for Apple\'s Vision Pro headset fell short of analyst expectations, raising questions about the company\'s spatial computing strategy.', source: 'CNBC', url: '#', imageUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600', publishedAt: '2024-03-05T16:45:00Z', category: 'Tech', sentiment: 'Bearish', relatedSymbols: ['AAPL'] },
  { id: 'n4', title: 'Tesla Announces $25,000 Model 2, Stock Rallies 5%', summary: 'Tesla confirmed plans for a mass-market electric vehicle priced at $25,000, targeting a global market of first-time EV buyers and challenging traditional automakers.', source: 'WSJ', url: '#', imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600', publishedAt: '2024-03-05T14:20:00Z', category: 'Markets', sentiment: 'Bullish', relatedSymbols: ['TSLA'] },
  { id: 'n5', title: 'Bitcoin Breaks $70,000 for First Time After ETF Approval', summary: 'Bitcoin surged past $70,000 for the first time in history following strong inflows into newly launched spot Bitcoin ETFs, with daily volume exceeding $10 billion.', source: 'CoinDesk', url: '#', imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600', publishedAt: '2024-03-05T11:00:00Z', category: 'Crypto', sentiment: 'Bullish', relatedSymbols: ['MSTR', 'COIN'] },
  { id: 'n6', title: 'Microsoft Azure Growth Slows, Shares Fall 3%', summary: 'Microsoft reported slowing growth in its Azure cloud business, with revenue increasing 28% year-over-year versus the 31% expected by analysts.', source: 'FT', url: '#', imageUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600', publishedAt: '2024-03-04T18:30:00Z', category: 'Earnings', sentiment: 'Bearish', relatedSymbols: ['MSFT', 'AMZN', 'GOOGL'] },
  { id: 'n7', title: 'IPO Watch: Reddit Targets $6.4B Valuation in NYSE Debut', summary: 'Reddit Inc. is set to go public on the NYSE with a valuation of $6.4 billion, marking one of the most anticipated tech IPOs of 2024.', source: 'Bloomberg', url: '#', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', publishedAt: '2024-03-04T15:00:00Z', category: 'IPO', sentiment: 'Neutral', relatedSymbols: ['RDDT'] },
  { id: 'n8', title: 'Warren Buffett Increases Berkshire\'s Cash Pile to Record $163B', summary: 'Berkshire Hathaway reported a record cash position of $163 billion, with Warren Buffett\'s annual letter hinting at difficulty finding attractive acquisitions.', source: 'Yahoo Finance', url: '#', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', publishedAt: '2024-03-04T10:30:00Z', category: 'Markets', sentiment: 'Neutral', relatedSymbols: ['BRK.B'] },
  { id: 'n9', title: 'Global Markets Rally as China Announces Stimulus Package', summary: 'Asian and European markets surged following China\'s announcement of a $500 billion economic stimulus package aimed at boosting domestic consumption.', source: 'Reuters', url: '#', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', publishedAt: '2024-03-03T22:00:00Z', category: 'Global', sentiment: 'Bullish', relatedSymbols: ['FXI', 'KWEB'] },
];

// ─── Watchlist ────────────────────────────────────────────────────────────────

export const mockWatchlist: WatchlistItem[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com', price: 875.40, change: 22.30, changePercent: 2.62, alertPrice: 900, sector: 'Technology', addedAt: '2024-01-10T10:00:00Z' },
  { symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com', price: 189.30, change: 2.45, changePercent: 1.31, alertPrice: 200, sector: 'Technology', addedAt: '2024-01-12T10:00:00Z' },
  { symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com', price: 248.23, change: -8.55, changePercent: -3.33, alertPrice: 230, sector: 'Consumer Cyclical', addedAt: '2024-01-15T10:00:00Z' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', logo: 'https://logo.clearbit.com/amd.com', price: 167.84, change: 5.42, changePercent: 3.34, sector: 'Technology', addedAt: '2024-02-01T10:00:00Z' },
  { symbol: 'NFLX', name: 'Netflix Inc.', logo: 'https://logo.clearbit.com/netflix.com', price: 628.72, change: 12.44, changePercent: 2.02, alertPrice: 650, sector: 'Communication', addedAt: '2024-02-10T10:00:00Z' },
  { symbol: 'META', name: 'Meta Platforms', logo: 'https://logo.clearbit.com/meta.com', price: 497.68, change: -3.42, changePercent: -0.68, sector: 'Communication', addedAt: '2024-02-15T10:00:00Z' },
];

// ─── Sector Performance ───────────────────────────────────────────────────────

export const mockSectorPerformance: SectorPerformance[] = [
  { sector: 'Technology', change: 2.14, marketCap: 12_400_000_000_000, topStock: 'NVDA' },
  { sector: 'Healthcare', change: 0.87, marketCap: 4_200_000_000_000, topStock: 'UNH' },
  { sector: 'Financial', change: 0.45, marketCap: 6_800_000_000_000, topStock: 'JPM' },
  { sector: 'Communication', change: -0.32, marketCap: 3_900_000_000_000, topStock: 'META' },
  { sector: 'Consumer Cyclical', change: -1.24, marketCap: 5_100_000_000_000, topStock: 'AMZN' },
  { sector: 'Consumer Defensive', change: 0.18, marketCap: 3_200_000_000_000, topStock: 'WMT' },
  { sector: 'Energy', change: 1.56, marketCap: 2_800_000_000_000, topStock: 'XOM' },
  { sector: 'Real Estate', change: -0.78, marketCap: 1_200_000_000_000, topStock: 'AMT' },
  { sector: 'Utilities', change: -0.44, marketCap: 1_100_000_000_000, topStock: 'NEE' },
  { sector: 'Materials', change: 0.92, marketCap: 900_000_000_000, topStock: 'LIN' },
];

// ─── AI Predictions ───────────────────────────────────────────────────────────

export const mockAIPredictions: AIPrediction[] = [
  {
    symbol: 'NVDA', name: 'NVIDIA Corp.', logo: 'https://logo.clearbit.com/nvidia.com',
    currentPrice: 875.40, predictedPrice: 1050.00, confidence: 87, timeframe: '3 months',
    trend: 'Bullish', riskLevel: 'Medium',
    reasoning: 'Strong AI chip demand, data center growth, and upcoming Blackwell GPU launch support continued upside.',
    chartData: [
      { date: '2024-03', actual: 875.40, predicted: 875.40 },
      { date: '2024-04', predicted: 910 }, { date: '2024-05', predicted: 970 }, { date: '2024-06', predicted: 1050 },
    ],
  },
  {
    symbol: 'AAPL', name: 'Apple Inc.', logo: 'https://logo.clearbit.com/apple.com',
    currentPrice: 189.30, predictedPrice: 215.00, confidence: 74, timeframe: '3 months',
    trend: 'Bullish', riskLevel: 'Low',
    reasoning: 'iPhone 16 supercycle expected, Services revenue growth, and potential new product categories including AR headset expansion.',
    chartData: [
      { date: '2024-03', actual: 189.30, predicted: 189.30 },
      { date: '2024-04', predicted: 195 }, { date: '2024-05', predicted: 205 }, { date: '2024-06', predicted: 215 },
    ],
  },
  {
    symbol: 'TSLA', name: 'Tesla Inc.', logo: 'https://logo.clearbit.com/tesla.com',
    currentPrice: 248.23, predictedPrice: 210.00, confidence: 62, timeframe: '3 months',
    trend: 'Bearish', riskLevel: 'High',
    reasoning: 'Increasing EV competition, margin compression from price cuts, and slower-than-expected growth in China weigh on outlook.',
    chartData: [
      { date: '2024-03', actual: 248.23, predicted: 248.23 },
      { date: '2024-04', predicted: 235 }, { date: '2024-05', predicted: 220 }, { date: '2024-06', predicted: 210 },
    ],
  },
  {
    symbol: 'AMD', name: 'Advanced Micro Devices', logo: 'https://logo.clearbit.com/amd.com',
    currentPrice: 167.84, predictedPrice: 210.00, confidence: 79, timeframe: '3 months',
    trend: 'Bullish', riskLevel: 'Medium',
    reasoning: 'MI300X GPU gaining traction in AI training workloads, client recovery, and data center market share gains from Intel.',
    chartData: [
      { date: '2024-03', actual: 167.84, predicted: 167.84 },
      { date: '2024-04', predicted: 180 }, { date: '2024-05', predicted: 195 }, { date: '2024-06', predicted: 210 },
    ],
  },
  {
    symbol: 'META', name: 'Meta Platforms', logo: 'https://logo.clearbit.com/meta.com',
    currentPrice: 497.68, predictedPrice: 520.00, confidence: 71, timeframe: '3 months',
    trend: 'Neutral', riskLevel: 'Low',
    reasoning: 'Ad revenue recovery strong, Reels engagement improving, but metaverse spending remains a drag on profitability.',
    chartData: [
      { date: '2024-03', actual: 497.68, predicted: 497.68 },
      { date: '2024-04', predicted: 505 }, { date: '2024-05', predicted: 512 }, { date: '2024-06', predicted: 520 },
    ],
  },
  {
    symbol: 'MSFT', name: 'Microsoft Corp.', logo: 'https://logo.clearbit.com/microsoft.com',
    currentPrice: 378.85, predictedPrice: 420.00, confidence: 82, timeframe: '3 months',
    trend: 'Bullish', riskLevel: 'Low',
    reasoning: 'Copilot AI integration driving Office 365 pricing power, Azure growth re-acceleration expected, strong enterprise demand.',
    chartData: [
      { date: '2024-03', actual: 378.85, predicted: 378.85 },
      { date: '2024-04', predicted: 390 }, { date: '2024-05', predicted: 405 }, { date: '2024-06', predicted: 420 },
    ],
  },
];

// ─── Mock User ────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'u1',
  name: 'Pranav Reddy',
  email: 'pranav.reddy@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pranav',
  phone: '+91 98765 43210',
  joinedAt: '2023-01-15T00:00:00Z',
  plan: 'Pro',
  notifications: { email: true, push: true, priceAlerts: true, newsAlerts: false },
};

// ─── Portfolio Chart Data ─────────────────────────────────────────────────────

export const mockPortfolioHistory = generateChartData(42_000, 365, 0.018).map((d, i) => ({
  date: d.date,
  value: d.close + 40_000,
  invested: 38_000 + i * 15,
}));

// ─── Market Index Data ────────────────────────────────────────────────────────

export const mockMarketIndices = [
  { name: 'S&P 500', value: 5_234.18, change: 38.42, changePercent: 0.74 },
  { name: 'NASDAQ', value: 16_428.82, change: 246.50, changePercent: 1.52 },
  { name: 'Dow Jones', value: 38_996.39, change: -22.14, changePercent: -0.06 },
  { name: 'Russell 2000', value: 2_054.27, change: 12.88, changePercent: 0.63 },
  { name: 'VIX', value: 14.52, change: -0.38, changePercent: -2.55 },
];
