import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Trash2, Bell, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Skeletons';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatPercent, cn, isMarketOpen, timeAgo } from '@/lib/utils';

export function Watchlist() {
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const marketOpen = isMarketOpen();

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Watchlist</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {watchlist.length} stock{watchlist.length !== 1 ? 's' : ''} · Market is{' '}
            <Badge variant={marketOpen ? 'open' : 'closed'}>{marketOpen ? 'Open' : 'Closed'}</Badge>
          </p>
        </div>
        <Button onClick={() => navigate('/explore')} size="sm">
          <Plus size={16} /> Add Stocks
        </Button>
      </div>

      {watchlist.length === 0 ? (
        <EmptyState
          icon={<Star size={28} />}
          title="Your watchlist is empty"
          description="Add stocks you want to follow. You'll see price movements and alerts here."
          action={
            <Button onClick={() => navigate('/explore')}>
              <Plus size={16} /> Browse Stocks
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {watchlist.map((item, i) => {
            const positive = item.changePercent >= 0;
            const nearAlert = item.alertPrice && Math.abs(item.price - item.alertPrice) / item.price < 0.05;

            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="relative overflow-hidden">
                  {nearAlert && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-warning-400" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => navigate(`/stock/${item.symbol}`)}
                    >
                      <img
                        src={item.logo} alt={item.symbol}
                        className="w-10 h-10 rounded-full border border-[var(--border)] bg-white object-contain"
                        onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${item.symbol}`; }}
                      />
                      <div>
                        <p className="font-bold text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                          {item.symbol}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] truncate max-w-[140px]">{item.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.alertPrice && (
                        <button className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          nearAlert ? 'text-warning-400 bg-warning-400/10' : 'text-[var(--text-muted)] hover:text-warning-400'
                        )}>
                          <Bell size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => removeFromWatchlist(item.symbol)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-danger-500 hover:bg-danger-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                        {formatCurrency(item.price)}
                      </p>
                      <div className={cn('flex items-center gap-1.5 mt-1', positive ? 'text-success-500' : 'text-danger-500')}>
                        {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        <span className="text-sm font-semibold">{formatPercent(item.changePercent)}</span>
                        <span className="text-xs">({positive ? '+' : ''}{formatCurrency(item.change)})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={positive ? 'success' : 'danger'} className="mb-1">
                        {positive ? '↑ Gaining' : '↓ Losing'}
                      </Badge>
                      {item.alertPrice && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Alert: {formatCurrency(item.alertPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="badge-brand">{item.sector}</span>
                    <span className="text-xs text-[var(--text-muted)]">Added {timeAgo(item.addedAt)}</span>
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
