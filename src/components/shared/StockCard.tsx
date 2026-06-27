import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import type { Stock } from '@/types';

interface StockCardProps {
  stock: Stock;
  index?: number;
  showSector?: boolean;
}

export function StockCard({ stock, index = 0, showSector = true }: StockCardProps) {
  const navigate = useNavigate();
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const positive = stock.changePercent >= 0;
  const watched = isWatched(stock.symbol);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (watched) {
      removeFromWatchlist(stock.symbol);
    } else {
      addToWatchlist({
        symbol: stock.symbol,
        name: stock.name,
        logo: stock.logo,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        sector: stock.sector,
        addedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className="card p-4 cursor-pointer group hover:-translate-y-1 hover:shadow-glow-brand transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={stock.logo}
            alt={stock.name}
            className="w-10 h-10 rounded-full border border-[var(--border)] object-contain bg-white"
            onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${stock.symbol}`; }}
          />
          <div className="min-w-0">
            <p className="font-bold text-[var(--text-primary)] text-sm">{stock.symbol}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{stock.name}</p>
          </div>
        </div>
        <button
          onClick={handleWatchlist}
          className={cn(
            'p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all',
            watched ? 'opacity-100 text-warning-400' : 'text-[var(--text-muted)] hover:text-warning-400'
          )}
        >
          <Star size={14} fill={watched ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {formatCurrency(stock.price)}
          </p>
          <div className={cn('flex items-center gap-1 mt-0.5', positive ? 'text-success-500' : 'text-danger-500')}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="text-xs font-semibold">{formatPercent(stock.changePercent)}</span>
          </div>
        </div>

        <div className="text-right">
          {showSector && (
            <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-brand-500/10 text-brand-400 mb-1">
              {stock.sector}
            </span>
          )}
          <p className="text-xs text-[var(--text-muted)]">
            Vol: {(stock.volume / 1_000_000).toFixed(1)}M
          </p>
        </div>
      </div>
    </motion.div>
  );
}
