import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import {
  TrendingUp, BarChart2, Shield, Zap, ArrowRight, Star,
  ChevronRight, TrendingDown, Moon, Sun, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { mockMarketIndices, mockStocks } from '@/data/mock';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';

const features = [
  {
    icon: <BarChart2 size={24} />,
    title: 'Real-Time Analytics',
    description: 'Live market data with advanced charting tools and technical indicators for smarter trading decisions.',
    color: 'from-brand-500/20 to-brand-600/10 text-brand-400',
  },
  {
    icon: <Zap size={24} />,
    title: 'AI-Powered Predictions',
    description: 'Machine learning models analyze patterns and sentiment to forecast price movements with high confidence.',
    color: 'from-warning-500/20 to-warning-400/10 text-warning-400',
  },
  {
    icon: <Shield size={24} />,
    title: 'Portfolio Protection',
    description: 'Risk scoring, diversification analysis, and smart alerts help you protect your investments.',
    color: 'from-success-500/20 to-success-600/10 text-success-500',
  },
  {
    icon: <Activity size={24} />,
    title: 'Market Sentiment',
    description: 'Gauge market mood through news analysis, social signals, and institutional flow data.',
    color: 'from-danger-500/20 to-danger-600/10 text-danger-400',
  },
];

const testimonials = [
  {
    name: 'Rahul Mehta',
    role: 'Retail Investor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    text: 'StockIQ transformed how I invest. The AI predictions are surprisingly accurate and the portfolio tracker saves me hours every week.',
    rating: 5,
  },
  {
    name: 'Priya Kapoor',
    role: 'Day Trader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    text: 'The real-time analytics and clean UI make this the best platform I\'ve used. The market heatmap alone is worth it.',
    rating: 5,
  },
  {
    name: 'Amit Shah',
    role: 'Portfolio Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    text: 'Finally a platform that feels like it was built by traders, for traders. The sector analysis is incredibly detailed.',
    rating: 4,
  },
];

export function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const topGainers = [...mockStocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="bottom-right" />
      {/* Standalone Nav */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="page-container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-gradient">StockIQ</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/signup')}>Get Started Free</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/5 blur-3xl" />
        </div>

        <div className="page-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
              <Zap size={14} />
              AI-Powered Market Intelligence
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Invest Smarter with{' '}
              <span className="text-gradient">Real-Time</span>
              <br />
              Market Intelligence
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Analyze stocks, track your portfolio, and get AI-powered predictions — all in one beautifully designed platform built for modern investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/signup')} className="group">
                Start Investing Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                View Live Demo
              </Button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">No credit card required · Free forever plan available</p>
          </motion.div>

          {/* Hero Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {mockMarketIndices.slice(0, 4).map((idx, i) => (
              <div key={i} className="card p-4 text-left hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-[var(--text-muted)] mb-1">{idx.name}</p>
                <p className="text-lg font-bold font-mono text-[var(--text-primary)]">
                  {idx.value.toLocaleString()}
                </p>
                <div className={cn('flex items-center gap-1 text-xs font-semibold mt-1', idx.changePercent >= 0 ? 'text-success-500' : 'text-danger-500')}>
                  {idx.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {formatPercent(idx.changePercent)}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Market Highlights */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Market Highlights</h2>
              <p className="text-[var(--text-secondary)] mt-1">Today's top-performing stocks</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} className="group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topGainers.map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="card p-4 cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={stock.logo} alt={stock.name}
                    className="w-10 h-10 rounded-full border border-[var(--border)] bg-white object-contain"
                    onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${stock.symbol}`; }}
                  />
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{stock.symbol}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[100px]">{stock.name}</p>
                  </div>
                </div>
                <p className="text-xl font-bold font-mono">{formatCurrency(stock.price)}</p>
                <span className="badge-success mt-1 inline-flex">
                  <TrendingUp size={11} />
                  {formatPercent(stock.changePercent)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 page-container">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-[var(--text-primary)] mb-4"
          >
            Everything you need to{' '}
            <span className="text-gradient">trade confidently</span>
          </motion.h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Professional-grade tools, beautifully simplified for every level of investor.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card p-8 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5', f.color)}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{f.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Trusted by <span className="text-gradient">smart investors</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="hsl(38,92%,56%)" className="text-warning-400" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-[var(--border)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-brand p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
          <h2 className="text-4xl font-extrabold mb-4 relative">Start Your Investment Journey Today</h2>
          <p className="text-xl opacity-90 mb-8 relative max-w-xl mx-auto">
            Join thousands of investors using StockIQ to make smarter, data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Button variant="glass" size="xl" onClick={() => navigate('/signup')}>
              Create Free Account
            </Button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white/80 hover:text-white border border-white/30 hover:border-white/60 transition-all text-base"
            >
              Login to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
