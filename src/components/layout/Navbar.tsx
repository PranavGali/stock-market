import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import {
  Sun, Moon, Bell, Search, TrendingUp, User, LogOut, Settings,
  BarChart2, ChevronDown, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockMarketIndices } from '@/data/mock';
import { formatPercent } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/explore', label: 'Explore' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/news', label: 'News' },
    { href: '/predictions', label: 'AI Picks' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
      {/* Market Ticker */}
      <div className="bg-dark-900 dark:bg-dark-950 border-b border-[var(--border)] py-1 hidden md:block overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...mockMarketIndices, ...mockMarketIndices].map((idx, i) => (
              <span key={i} className="inline-flex items-center gap-2 mr-10 text-xs">
                <span className="text-[var(--text-muted)] font-medium">{idx.name}</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {idx.value.toLocaleString()}
                </span>
                <span className={cn('font-semibold', idx.changePercent >= 0 ? 'text-success-500' : 'text-danger-500')}>
                  {formatPercent(idx.changePercent)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="page-container flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <TrendingUp className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <span className="text-gradient hidden sm:block">StockIQ</span>
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate('/explore')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--text-muted)] border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-brand-500/50 transition-colors"
            >
              <Search size={14} />
              <span className="hidden md:block">Search stocks...</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <button className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border border-[var(--border)]"
                  />
                  <ChevronDown size={14} className="hidden md:block text-[var(--text-muted)]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 card p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-[var(--border)] mb-2">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
                    </div>
                    {[
                      { icon: <User size={14} />, label: 'Profile', href: '/profile' },
                      { icon: <BarChart2 size={14} />, label: 'Admin', href: '/admin' },
                      { icon: <Settings size={14} />, label: 'Settings', href: '/profile' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-[var(--border)] mt-2 pt-2">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-danger-500/10 transition-colors w-full"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Get Started</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Nav */}
      {isAuthenticated && menuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium',
                location.pathname === link.href
                  ? 'bg-brand-500/10 text-brand-500'
                  : 'text-[var(--text-secondary)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
