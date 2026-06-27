import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectorBarChart } from '@/components/charts/SectorChart';
import { getTopGainers, getTopLosers, getMostActive, getSectorPerformance } from '@/services/stockService';
import { formatCurrency, formatPercent, formatNumber, cn } from '@/lib/utils';
import type { Stock, SectorPerformance } from '@/types';

export function MarketAnalytics() {
  const navigate = useNavigate();
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);
  const [active, setActive] = useState<Stock[]>([]);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTopGainers(), getTopLosers(), getMostActive(), getSectorPerformance()]).then(
      ([g, l, a, s]) => { setGainers(g); setLosers(l); setActive(a); setSectors(s); setLoading(false); }
    );
  }, []);

  const StockTable = ({ stocks, label }: { stocks: Stock[]; label: string }) => (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <Badge variant={label.includes('Gain') ? 'success' : label.includes('Los') ? 'danger' : 'brand'}>
          Top 5
        </Badge>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-2 py-2 text-xs text-[var(--text-muted)]">Stock</th>
              <th className="text-right px-2 py-2 text-xs text-[var(--text-muted)]">Price</th>
              <th className="text-right px-2 py-2 text-xs text-[var(--text-muted)]">Change</th>
              <th className="text-right px-2 py-2 text-xs text-[var(--text-muted)] hidden sm:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <motion.tr
                key={s.symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/stock/${s.symbol}`)}
                className="border-b border-[var(--border)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)] w-4">{i + 1}</span>
                    <img src={s.logo} alt={s.symbol} className="w-6 h-6 rounded-full border border-[var(--border)] bg-white object-contain"
                      onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${s.symbol}`; }} />
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{s.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-right font-mono font-semibold">{formatCurrency(s.price)}</td>
                <td className={cn('px-2 py-2.5 text-right font-semibold text-xs', s.changePercent >= 0 ? 'text-success-500' : 'text-danger-500')}>
                  <div className="flex items-center justify-end gap-1">
                    {s.changePercent >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {formatPercent(s.changePercent)}
                  </div>
                </td>
                <td className="px-2 py-2.5 text-right text-xs text-[var(--text-muted)] hidden sm:table-cell">
                  {formatNumber(s.volume, true)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Heatmap visualization
  const HeatmapSection = () => (
    <Card>
      <CardHeader><CardTitle>Market Heatmap</CardTitle><Badge variant="brand">Sector View</Badge></CardHeader>
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
        {[...gainers, ...losers].map((s) => {
          const intensity = Math.min(Math.abs(s.changePercent) / 5, 1);
          const bg = s.changePercent >= 0
            ? `rgba(34, 197, 94, ${0.15 + intensity * 0.5})`
            : `rgba(239, 68, 68, ${0.15 + intensity * 0.5})`;
          return (
            <div
              key={s.symbol}
              onClick={() => navigate(`/stock/${s.symbol}`)}
              className="rounded-xl p-3 cursor-pointer hover:scale-105 transition-transform text-center"
              style={{ background: bg }}
            >
              <p className="text-xs font-bold text-[var(--text-primary)]">{s.symbol}</p>
              <p className={cn('text-xs font-semibold mt-0.5', s.changePercent >= 0 ? 'text-success-500' : 'text-danger-500')}>
                {formatPercent(s.changePercent)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Market Analytics</h1>
        <p className="text-[var(--text-secondary)] mt-1">Real-time market overview and sector performance</p>
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <HeatmapSection />
      </div>

      {/* Sector Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sector Performance</CardTitle>
          <Badge variant="brand">Today</Badge>
        </CardHeader>
        <SectorBarChart data={sectors} height={300} />
      </Card>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-5 w-32 bg-[var(--border)] rounded" />
              {Array.from({ length: 5 }).map((__, j) => (
                <div key={j} className="h-8 bg-[var(--border)] rounded" />
              ))}
            </div>
          ))
        ) : (
          <>
            <StockTable stocks={gainers} label="Top Gainers" />
            <StockTable stocks={losers} label="Top Losers" />
            <StockTable stocks={active} label="Most Active" />
          </>
        )}
      </div>
    </div>
  );
}
