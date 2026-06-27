import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { StatCardSkeleton, ChartSkeleton } from '@/components/ui/Skeletons';
import { useAuth } from '@/context/AuthContext';
import { getPortfolioSummary, getHoldings, getPortfolioHistory } from '@/services/portfolioService';
import { getTopGainers, getTopLosers, getMarketIndices } from '@/services/stockService';
import { formatCurrency, formatPercent, cn, timeAgo } from '@/lib/utils';
import type { PortfolioSummary, Holding, Stock } from '@/types';
import { mockTransactions } from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [chartData, setChartData] = useState<{ date: string; value: number; invested: number }[]>([]);
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [indices, setIndices] = useState<typeof mockTransactions>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPortfolioSummary(),
      getHoldings(),
      getPortfolioHistory(),
      getTopGainers(),
      getTopLosers(),
    ]).then(([sum, hold, chart, g, l]) => {
      setSummary(sum);
      setHoldings(hold.slice(0, 5));
      setChartData(chart);
      setGainers(g);
      setLosers(l);
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-[var(--text-primary)]"
        >
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </motion.h1>
        <p className="text-[var(--text-secondary)] mt-1">Here's your portfolio overview for today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Invested"
              value={summary?.totalInvested ?? 0}
              isCurrency
              icon={<DollarSign size={18} />}
              accent="brand"
              index={0}
            />
            <StatCard
              label="Current Value"
              value={summary?.currentValue ?? 0}
              isCurrency
              icon={<Activity size={18} />}
              accent="success"
              index={1}
            />
            <StatCard
              label="Total P&L"
              value={summary?.totalPnL ?? 0}
              change={summary?.totalPnLPercent}
              isCurrency
              icon={<TrendingUp size={18} />}
              accent={(summary?.totalPnL ?? 0) >= 0 ? 'success' : 'danger'}
              index={2}
            />
            <StatCard
              label="Day Change"
              value={summary?.dayChange ?? 0}
              change={summary?.dayChangePercent}
              isCurrency
              changeLabel="today"
              icon={<Clock size={18} />}
              accent={(summary?.dayChange ?? 0) >= 0 ? 'success' : 'danger'}
              index={3}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <span className="badge-success">+12.4% all time</span>
          </CardHeader>
          {loading ? <ChartSkeleton height={280} /> : <PortfolioChart data={chartData} height={280} />}
        </Card>

        {/* Holdings Mini */}
        <Card>
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
            <button onClick={() => navigate('/portfolio')} className="text-xs text-brand-500 hover:text-brand-400 transition-colors">
              View All
            </button>
          </CardHeader>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-[var(--border)]" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-16 bg-[var(--border)] rounded" />
                      <div className="h-2 w-24 bg-[var(--border)] rounded" />
                    </div>
                    <div className="h-4 w-16 bg-[var(--border)] rounded" />
                  </div>
                ))
              : holdings.map(h => {
                  const pnl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                  const pnlPct = ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100;
                  return (
                    <div
                      key={h.id}
                      onClick={() => navigate(`/stock/${h.symbol}`)}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-secondary)] rounded-xl p-2 -mx-2 transition-colors"
                    >
                      <img
                        src={h.logo} alt={h.symbol}
                        className="w-8 h-8 rounded-full border border-[var(--border)] bg-white object-contain"
                        onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${h.symbol}`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{h.symbol}</p>
                        <p className="text-xs text-[var(--text-muted)]">{h.quantity} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono text-[var(--text-primary)]">
                          {formatCurrency(h.currentPrice * h.quantity)}
                        </p>
                        <p className={cn('text-xs font-semibold', pnl >= 0 ? 'text-success-500' : 'text-danger-500')}>
                          {pnl >= 0 ? '+' : ''}{formatPercent(pnlPct)}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Gainers</CardTitle>
            <TrendingUp size={16} className="text-success-500" />
          </CardHeader>
          <div className="space-y-3">
            {gainers.slice(0, 4).map(s => (
              <div
                key={s.symbol}
                onClick={() => navigate(`/stock/${s.symbol}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-[var(--bg-secondary)] rounded-xl p-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={s.logo} alt={s.symbol} className="w-7 h-7 rounded-full border border-[var(--border)] bg-white object-contain"
                    onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${s.symbol}`; }} />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{s.symbol}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatCurrency(s.price)}</p>
                  </div>
                </div>
                <span className="badge-success">{formatPercent(s.changePercent)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Losers</CardTitle>
            <TrendingDown size={16} className="text-danger-500" />
          </CardHeader>
          <div className="space-y-3">
            {losers.slice(0, 4).map(s => (
              <div
                key={s.symbol}
                onClick={() => navigate(`/stock/${s.symbol}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-[var(--bg-secondary)] rounded-xl p-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <img src={s.logo} alt={s.symbol} className="w-7 h-7 rounded-full border border-[var(--border)] bg-white object-contain"
                    onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${s.symbol}`; }} />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{s.symbol}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatCurrency(s.price)}</p>
                  </div>
                </div>
                <span className="badge-danger">{formatPercent(s.changePercent)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <button onClick={() => navigate('/portfolio')} className="text-xs text-brand-500 hover:text-brand-400 transition-colors">View All</button>
          </CardHeader>
          <div className="space-y-3">
            {mockTransactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    t.type === 'BUY' ? 'bg-success-500/15 text-success-500' : 'bg-danger-500/15 text-danger-500'
                  )}>
                    {t.type === 'BUY' ? 'B' : 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.symbol}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.quantity} shares · {timeAgo(t.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-[var(--text-primary)]">{formatCurrency(t.total)}</p>
                  <p className={cn('text-xs font-semibold', t.status === 'COMPLETED' ? 'text-success-500' : t.status === 'PENDING' ? 'text-warning-400' : 'text-danger-500')}>
                    {t.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
