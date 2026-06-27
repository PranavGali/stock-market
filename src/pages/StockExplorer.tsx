import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Flame } from 'lucide-react';
import { StockCard } from '@/components/shared/StockCard';
import { StockCardSkeleton } from '@/components/ui/Skeletons';
import { getAllStocks, getTrendingStocks, searchStocks } from '@/services/stockService';
import type { Stock } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

const SECTORS = ['All', 'Technology', 'Financial', 'Healthcare', 'Consumer Cyclical', 'Consumer Defensive', 'Communication', 'Energy'];

export function StockExplorer() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [trending, setTrending] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    Promise.all([getAllStocks(), getTrendingStocks()]).then(([all, trend]) => {
      setStocks(all);
      setTrending(trend);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchStocks(debouncedQuery).then(setStocks);
    } else {
      getAllStocks().then(setStocks);
    }
  }, [debouncedQuery]);

  const filtered = sector === 'All' ? stocks : stocks.filter(s => s.sector === sector);

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Stock Explorer</h1>
        <p className="text-[var(--text-secondary)] mt-1">Discover and analyze thousands of stocks</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or symbol..."
            className="input-field pl-11 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Sector Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {SECTORS.map(s => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              sector === s
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500/50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      {!debouncedQuery && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-danger-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Trending Now</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.map((s, i) => (
              <div key={s.symbol} className="flex-shrink-0 w-48">
                <StockCard stock={s} index={i} showSector={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Stocks Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-brand-400" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {debouncedQuery ? `Results for "${debouncedQuery}"` : sector === 'All' ? 'All Stocks' : sector}
          </h2>
          <span className="text-sm text-[var(--text-muted)]">({filtered.length})</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <StockCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-lg font-semibold text-[var(--text-primary)]">No stocks found</p>
            <p className="text-sm text-[var(--text-secondary)]">Try a different name or symbol</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((s, i) => (
              <StockCard key={s.symbol} stock={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
