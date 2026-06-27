import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { NewsCardSkeleton, EmptyState } from '@/components/ui/Skeletons';
import { getAllNews } from '@/services/newsService';
import { timeAgo, cn } from '@/lib/utils';
import type { NewsArticle } from '@/types';

const CATEGORIES = ['All', 'Markets', 'Economy', 'Tech', 'Earnings', 'IPO', 'Crypto', 'Global'];

const sentimentIcon = (s: NewsArticle['sentiment']) =>
  s === 'Bullish' ? <TrendingUp size={12} /> : s === 'Bearish' ? <TrendingDown size={12} /> : <Minus size={12} />;

export function NewsInsights() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    getAllNews().then(n => { setNews(n); setLoading(false); });
  }, []);

  const filtered = category === 'All' ? news : news.filter(n => n.category === category);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">News & Insights</h1>
        <p className="text-[var(--text-secondary)] mt-1">Stay informed with the latest financial news</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              category === c
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Newspaper size={28} />} title="No news found" description="Try another category." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Card hover className="overflow-hidden p-0">
                <div className="relative">
                  <img src={featured.imageUrl} alt={featured.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={featured.sentiment === 'Bullish' ? 'bullish' : featured.sentiment === 'Bearish' ? 'bearish' : 'neutral'}>
                        {sentimentIcon(featured.sentiment)} {featured.sentiment}
                      </Badge>
                      <Badge variant="brand">{featured.category}</Badge>
                    </div>
                    <h2 className="text-xl font-bold leading-snug mb-2">{featured.title}</h2>
                    <p className="text-sm text-white/70 line-clamp-2">{featured.summary}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-white/60">
                      <span>{featured.source}</span>
                      <span>·</span>
                      <span>{timeAgo(featured.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Trending Sidebar */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Trending</h3>
            {rest.slice(0, 4).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card hover className="p-4">
                  <div className="flex gap-3">
                    <img src={article.imageUrl} alt="" className="w-16 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={article.sentiment === 'Bullish' ? 'bullish' : article.sentiment === 'Bearish' ? 'bearish' : 'neutral'}>
                          {sentimentIcon(article.sentiment)} {article.sentiment}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{article.source} · {timeAgo(article.publishedAt)}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* All Articles Grid */}
          {rest.slice(4).map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card hover className="overflow-hidden p-0">
                <img src={article.imageUrl} alt={article.title} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={article.sentiment === 'Bullish' ? 'bullish' : article.sentiment === 'Bearish' ? 'bearish' : 'neutral'}>
                      {sentimentIcon(article.sentiment)} {article.sentiment}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">{article.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 mb-2">{article.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{article.source}</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
