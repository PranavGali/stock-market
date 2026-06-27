import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, TrendingUp, TrendingDown, Plus, Minus,
  ExternalLink, BarChart2,
} from 'lucide-react';
import { getStockBySymbol, getStockChartData, getAnalystRatings } from '@/services/stockService';
import { getNewsForSymbol } from '@/services/newsService';
import { executeTrade } from '@/services/portfolioService';
import { StockChart } from '@/components/charts/StockChart';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChartSkeleton } from '@/components/ui/Skeletons';
import { useWatchlist } from '@/context/WatchlistContext';
import { formatCurrency, formatPercent, formatNumber, cn, timeAgo } from '@/lib/utils';
import type { Stock, ChartDataPoint, NewsArticle } from '@/types';
import { toast } from 'sonner';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y'] as const;

export function StockDetails() {
  const { symbol = '' } = useParams();
  const navigate = useNavigate();
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [stock, setStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [ratings, setRatings] = useState<{ firm: string; rating: string; targetPrice: number; date: string }[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [range, setRange] = useState<typeof TIME_RANGES[number]>('1M');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(1);
  const [trading, setTrading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getStockBySymbol(symbol),
      getStockChartData(symbol, '1M'),
      getAnalystRatings(symbol),
      getNewsForSymbol(symbol),
    ]).then(([s, c, r, n]) => {
      setStock(s);
      setChartData(c);
      setRatings(r);
      setNews(n.length ? n : []);
      setLoading(false);
    });
  }, [symbol]);

  const handleRangeChange = async (r: typeof TIME_RANGES[number]) => {
    setRange(r);
    setChartLoading(true);
    const data = await getStockChartData(symbol, r);
    setChartData(data);
    setChartLoading(false);
  };

  const handleTrade = async () => {
    if (!stock) return;
    setTrading(true);
    const tx = await executeTrade(symbol, tradeType, qty, stock.price);
    setTrading(false);
    toast.success(`${tradeType} ${qty} shares of ${symbol} at ${formatCurrency(stock.price)}`);
    console.log('Trade executed:', tx);
  };

  if (!loading && !stock) {
    return (
      <div className="page-container py-16 text-center">
        <BarChart2 size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
        <h2 className="text-xl font-bold">Stock not found</h2>
        <Button variant="ghost" onClick={() => navigate('/explore')} className="mt-4">
          <ArrowLeft size={16} /> Back to Explorer
        </Button>
      </div>
    );
  }

  const positive = (stock?.changePercent ?? 0) >= 0;
  const watched = isWatched(symbol);

  return (
    <div className="page-container py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      {loading ? (
        <div className="animate-pulse mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--border)]" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-[var(--border)] rounded" />
              <div className="h-4 w-48 bg-[var(--border)] rounded" />
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <img
              src={stock!.logo} alt={stock!.symbol}
              className="w-16 h-16 rounded-2xl border border-[var(--border)] bg-white object-contain p-1"
              onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${symbol}`; }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">{stock!.symbol}</h1>
                <Badge variant={stock!.exchange === 'NASDAQ' ? 'brand' : 'neutral'}>{stock!.exchange}</Badge>
              </div>
              <p className="text-[var(--text-secondary)]">{stock!.name}</p>
              <span className="badge-brand mt-1 inline-flex">{stock!.sector}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-extrabold font-mono text-[var(--text-primary)]">
                {formatCurrency(stock!.price)}
              </p>
              <div className={cn('flex items-center gap-1.5 justify-end', positive ? 'text-success-500' : 'text-danger-500')}>
                {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="font-semibold">{formatChange(stock!.change)} ({formatPercent(stock!.changePercent)})</span>
              </div>
            </div>
            <button
              onClick={() => watched ? removeFromWatchlist(symbol) : addToWatchlist({
                symbol, name: stock!.name, logo: stock!.logo, price: stock!.price,
                change: stock!.change, changePercent: stock!.changePercent,
                sector: stock!.sector, addedAt: new Date().toISOString(),
              })}
              className={cn(
                'p-2.5 rounded-xl border transition-all',
                watched
                  ? 'border-warning-400 bg-warning-400/10 text-warning-400'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-warning-400 hover:text-warning-400'
              )}
            >
              <Star size={18} fill={watched ? 'currentColor' : 'none'} />
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
              <div className="flex gap-1">
                {TIME_RANGES.map(r => (
                  <button
                    key={r}
                    onClick={() => handleRangeChange(r)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
                      range === r
                        ? 'bg-brand-500 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            {loading || chartLoading ? (
              <ChartSkeleton height={320} />
            ) : (
              <StockChart data={chartData} positive={positive} height={320} />
            )}
          </Card>

          {/* Key Statistics */}
          {stock && (
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Market Cap', value: formatNumber(stock.marketCap, true) },
                  { label: 'Volume', value: formatNumber(stock.volume, true) },
                  { label: 'P/E Ratio', value: stock.pe.toFixed(1) },
                  { label: '52W High', value: formatCurrency(stock.week52High) },
                  { label: '52W Low', value: formatCurrency(stock.week52Low) },
                  { label: 'Exchange', value: stock.exchange },
                ].map(stat => (
                  <div key={stat.label} className="bg-[var(--bg-secondary)] rounded-xl p-3">
                    <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
                    <p className="text-sm font-bold font-mono text-[var(--text-primary)]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Company Overview */}
          {stock && (
            <Card>
              <CardHeader>
                <CardTitle>About {stock.name}</CardTitle>
                <a href="#" className="text-xs text-brand-500 flex items-center gap-1 hover:text-brand-400 transition-colors">
                  Website <ExternalLink size={12} />
                </a>
              </CardHeader>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{stock.description}</p>
            </Card>
          )}

          {/* Analyst Ratings */}
          <Card>
            <CardHeader><CardTitle>Analyst Ratings</CardTitle></CardHeader>
            <div className="space-y-3">
              {ratings.map(r => (
                <div key={r.firm} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{r.firm}</p>
                    <p className="text-xs text-[var(--text-muted)]">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {formatCurrency(r.targetPrice)}
                    </span>
                    <Badge
                      variant={
                        r.rating === 'Strong Buy' ? 'strong-buy' :
                        r.rating === 'Buy' ? 'buy' :
                        r.rating === 'Hold' ? 'hold' : 'sell'
                      }
                    >
                      {r.rating}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* News */}
          {news.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Related News</CardTitle></CardHeader>
              <div className="space-y-4">
                {news.map(article => (
                  <div key={article.id} className="flex gap-4 pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <img src={article.imageUrl} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={article.sentiment === 'Bullish' ? 'bullish' : article.sentiment === 'Bearish' ? 'bearish' : 'neutral'}>
                          {article.sentiment}
                        </Badge>
                        <span className="text-xs text-[var(--text-muted)]">{article.source}</span>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{article.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{timeAgo(article.publishedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Trade Panel */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Trade {symbol}</CardTitle>
            </CardHeader>

            {/* Buy/Sell Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-[var(--border)] mb-5">
              {(['BUY', 'SELL'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTradeType(t)}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-semibold transition-all',
                    tradeType === t
                      ? t === 'BUY' ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {stock && (
              <div className="space-y-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-3">
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Market Price</p>
                  <p className="text-xl font-bold font-mono text-[var(--text-primary)]">{formatCurrency(stock.price)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 text-center input-field py-2"
                    />
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Price per share</span>
                    <span className="font-semibold font-mono">{formatCurrency(stock.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Quantity</span>
                    <span className="font-semibold">{qty}</span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-2 flex justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">Total</span>
                    <span className="font-bold font-mono text-[var(--text-primary)]">{formatCurrency(stock.price * qty)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleTrade}
                  loading={trading}
                  variant={tradeType === 'BUY' ? 'success' : 'danger'}
                  size="lg"
                  className="w-full"
                >
                  {tradeType === 'BUY' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {tradeType} {qty} Share{qty > 1 ? 's' : ''}
                </Button>

                <p className="text-xs text-[var(--text-muted)] text-center">
                  Simulated trade — no real money involved
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
}
