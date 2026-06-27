import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { SectorPieChart, SECTOR_COLORS } from '@/components/charts/SectorChart';
import { StatCard } from '@/components/shared/StatCard';
import { ChartSkeleton, StatCardSkeleton } from '@/components/ui/Skeletons';
import { getHoldings, getPortfolioSummary, getTransactions, getPortfolioHistory } from '@/services/portfolioService';
import { formatCurrency, formatPercent, cn, timeAgo } from '@/lib/utils';
import type { Holding, Transaction, PortfolioSummary } from '@/types';

export function Portfolio() {
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [chartData, setChartData] = useState<{ date: string; value: number; invested: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHoldings(), getPortfolioSummary(), getTransactions(), getPortfolioHistory(),
    ]).then(([h, s, t, c]) => {
      setHoldings(h); setSummary(s); setTransactions(t); setChartData(c);
      setLoading(false);
    });
  }, []);

  const sectorData = holdings.reduce<Record<string, number>>((acc, h) => {
    const val = h.currentPrice * h.quantity;
    acc[h.sector] = (acc[h.sector] ?? 0) + val;
    return acc;
  }, {});

  const totalValue = Object.values(sectorData).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(sectorData).map(([name, value]) => ({
    name,
    value: +((value / totalValue) * 100).toFixed(1),
  }));

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Portfolio</h1>
          <p className="text-[var(--text-secondary)] mt-1">Track your investments and performance</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
          <>
            <StatCard label="Invested" value={summary?.totalInvested ?? 0} isCurrency accent="brand" index={0} />
            <StatCard label="Current Value" value={summary?.currentValue ?? 0} isCurrency accent="success" index={1} />
            <StatCard label="Total P&L" value={summary?.totalPnL ?? 0} change={summary?.totalPnLPercent} isCurrency accent={(summary?.totalPnL ?? 0) >= 0 ? 'success' : 'danger'} index={2} />
            <StatCard label="Day Change" value={summary?.dayChange ?? 0} change={summary?.dayChangePercent} isCurrency changeLabel="today" accent={(summary?.dayChange ?? 0) >= 0 ? 'success' : 'danger'} index={3} />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Growth</CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-brand-500 inline-block" /> Current Value</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success-500 inline-block border-dashed border-b" /> Invested</span>
            </div>
          </CardHeader>
          {loading ? <ChartSkeleton height={280} /> : <PortfolioChart data={chartData} height={280} />}
        </Card>

        <Card>
          <CardHeader><CardTitle>Asset Allocation</CardTitle></CardHeader>
          {loading ? <ChartSkeleton height={240} /> : (
            <>
              <SectorPieChart data={pieData} height={200} />
              <div className="mt-4 space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                      <span className="text-[var(--text-secondary)]">{d.name}</span>
                    </div>
                    <span className="font-semibold text-[var(--text-primary)]">{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Holdings ({holdings.length})</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Stock', 'Qty', 'Avg Buy', 'Current', 'Invested', 'Current Value', 'P&L', '%'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const invested = h.avgBuyPrice * h.quantity;
                const currentVal = h.currentPrice * h.quantity;
                const pnl = currentVal - invested;
                const pnlPct = (pnl / invested) * 100;
                return (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/stock/${h.symbol}`)}
                    className="border-b border-[var(--border)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <img src={h.logo} alt={h.symbol} className="w-7 h-7 rounded-full border border-[var(--border)] bg-white object-contain"
                          onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${h.symbol}`; }} />
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{h.symbol}</p>
                          <p className="text-xs text-[var(--text-muted)] hidden sm:block">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono font-semibold">{h.quantity}</td>
                    <td className="px-3 py-3 font-mono">{formatCurrency(h.avgBuyPrice)}</td>
                    <td className="px-3 py-3 font-mono">{formatCurrency(h.currentPrice)}</td>
                    <td className="px-3 py-3 font-mono">{formatCurrency(invested)}</td>
                    <td className="px-3 py-3 font-mono">{formatCurrency(currentVal)}</td>
                    <td className={cn('px-3 py-3 font-mono font-semibold', pnl >= 0 ? 'text-success-500' : 'text-danger-500')}>
                      {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={pnl >= 0 ? 'success' : 'danger'}>
                        {pnl >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {formatPercent(pnlPct)}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Type', 'Stock', 'Qty', 'Price', 'Total', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-3 py-3">
                    <Badge variant={t.type === 'BUY' ? 'success' : 'danger'}>{t.type}</Badge>
                  </td>
                  <td className="px-3 py-3 font-bold">{t.symbol}</td>
                  <td className="px-3 py-3 font-mono">{t.quantity}</td>
                  <td className="px-3 py-3 font-mono">{formatCurrency(t.price)}</td>
                  <td className="px-3 py-3 font-mono font-semibold">{formatCurrency(t.total)}</td>
                  <td className="px-3 py-3 text-[var(--text-muted)]">{timeAgo(t.date)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={t.status === 'COMPLETED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'danger'}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
