import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WatchlistItem } from '@/types';
import { mockWatchlist } from '@/data/mock';
import { toast } from 'sonner';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(mockWatchlist);

  const addToWatchlist = useCallback((item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.find(w => w.symbol === item.symbol)) return prev;
      toast.success(`${item.symbol} added to watchlist`);
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      toast.success(`${symbol} removed from watchlist`);
      return prev.filter(w => w.symbol !== symbol);
    });
  }, []);

  const isWatched = useCallback(
    (symbol: string) => watchlist.some(w => w.symbol === symbol),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
