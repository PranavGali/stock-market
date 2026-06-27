import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Minus, Cpu, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockAIPredictions } from '@/data/mock';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import { simulateDelay } from '@/services/api';
import type { AIPrediction } from '@/types';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

export function AIPredictions() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateDelay(500).then(() => { setPredictions(mockAIPredictions); setLoading(false); });
  }, []);

  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';

  const trendIcon = (t: AIPrediction['trend']) =>
    t === 'Bullish' ? <TrendingUp size={14} /> : t === 'Bearish' ? <TrendingDown size={14} /> : <Minus size={14} />;

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">AI Predictions</h1>
        </div>
        <p className="text-[var(--text-secondary)]">Machine learning-powered stock forecasts for the next 3 months</p>
        <div className="flex items-center gap-2 mt-2">
          <Cpu size={14} className="text-brand-400" />
          <span className="text-xs text-[var(--text-muted)]">Powered by ensemble ML models · Updated daily at market close</span>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Bullish Picks', count: predictions.filter(p => p.trend === 'Bullish').length, color: 'text-success-500', bg: 'bg-success-500/10', icon: <TrendingUp size={16} /> },
          { label: 'Neutral Picks', count: predictions.filter(p => p.trend === 'Neutral').length, color: 'text-warning-400', bg: 'bg-warning-400/10', icon: <Minus size={16} /> },
          { label: 'Bearish Picks', count: predictions.filter(p => p.trend === 'Bearish').length, color: 'text-danger-500', bg: 'bg-danger-500/10', icon: <TrendingDown size={16} /> },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={cn('w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2', s.bg, s.color)}>{s.icon}</div>
            <p className={cn('text-2xl font-extrabold', s.color)}>{s.count}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Prediction Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--border)]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-16 bg-[var(--border)] rounded" />
                  <div className="h-3 w-28 bg-[var(--border)] rounded" />
                </div>
              </div>
              <div className="h-24 bg-[var(--border)] rounded-xl" />
              <div className="h-3 w-full bg-[var(--border)] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {predictions.map((pred, i) => {
            const upside = ((pred.predictedPrice - pred.currentPrice) / pred.currentPrice) * 100;
            return (
              <motion.div
                key={pred.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => navigate(`/stock/${pred.symbol}`)}
                    >
                      <img src={pred.logo} alt={pred.symbol}
                        className="w-10 h-10 rounded-full border border-[var(--border)] bg-white object-contain"
                        onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${pred.symbol}`; }} />
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{pred.symbol}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate max-w-[100px]">{pred.name}</p>
                      </div>
                    </div>
                    <Badge variant={pred.trend === 'Bullish' ? 'bullish' : pred.trend === 'Bearish' ? 'bearish' : 'neutral'}>
                      {trendIcon(pred.trend)} {pred.trend}
                    </Badge>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-20 mb-4 -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pred.chartData}>
                        <XAxis dataKey="date" hide />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            return (
                              <div className="card p-1.5 text-xs shadow-xl">
                                <p className="font-mono">{formatCurrency(payload[0].value as number)}</p>
                              </div>
                            );
                          }}
                        />
                        {pred.chartData[0]?.actual !== undefined && (
                          <Line type="monotone" dataKey="actual" stroke="hsl(226,76%,50%)" strokeWidth={2} dot={false} />
                        )}
                        <Line type="monotone" dataKey="predicted"
                          stroke={pred.trend === 'Bullish' ? 'hsl(142,72%,45%)' : pred.trend === 'Bearish' ? 'hsl(0,80%,54%)' : 'hsl(38,88%,48%)'}
                          strokeWidth={2} strokeDasharray="5 3" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Price Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-2.5">
                      <p className="text-xs text-[var(--text-muted)]">Current</p>
                      <p className="font-bold font-mono text-[var(--text-primary)]">{formatCurrency(pred.currentPrice)}</p>
                    </div>
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-2.5">
                      <p className="text-xs text-[var(--text-muted)]">Target ({pred.timeframe})</p>
                      <p className={cn('font-bold font-mono', upside >= 0 ? 'text-success-500' : 'text-danger-500')}>
                        {formatCurrency(pred.predictedPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Upside */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={14} className={upside >= 0 ? 'text-success-500' : 'text-danger-500'} />
                      <span className="text-sm font-semibold text-[var(--text-secondary)]">Upside Potential</span>
                    </div>
                    <span className={cn('font-bold text-sm', upside >= 0 ? 'text-success-500' : 'text-danger-500')}>
                      {upside >= 0 ? '+' : ''}{formatPercent(upside)}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-muted)]">AI Confidence</span>
                      <span className="font-semibold text-[var(--text-primary)]">{pred.confidence}%</span>
                    </div>
                    <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-brand"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <Badge variant={pred.riskLevel === 'Low' ? 'low' : pred.riskLevel === 'Medium' ? 'medium' : 'high'}>
                      {pred.riskLevel} Risk
                    </Badge>
                    <button
                      onClick={() => navigate(`/stock/${pred.symbol}`)}
                      className="text-xs text-brand-500 hover:text-brand-400 transition-colors font-medium"
                    >
                      View Analysis →
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
