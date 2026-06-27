import { Link } from 'react-router-dom';
import { TrendingUp, Globe, Code2, Rss, Mail } from 'lucide-react';

export function Footer() {
  const links = {
    Product: ['Dashboard', 'Explorer', 'Portfolio', 'Watchlist', 'Analytics'],
    Company: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'],
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="text-gradient">StockIQ</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mb-6">
              Your intelligent stock market analysis platform. Make smarter investment decisions with real-time data and AI-powered insights.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Code2, Rss, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand-400 hover:border-brand-500/50 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2024 StockIQ. All rights reserved. For educational purposes only.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Market data is simulated. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
