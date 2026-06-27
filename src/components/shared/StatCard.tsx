import { motion } from 'framer-motion';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  prefix?: string;
  isCurrency?: boolean;
  isPercent?: boolean;
  accent?: 'brand' | 'success' | 'danger' | 'warning';
  index?: number;
}

export function StatCard({
  label, value, change, changeLabel, icon, prefix, isCurrency, isPercent, accent = 'brand', index = 0,
}: StatCardProps) {
  const positive = change !== undefined && change >= 0;

  const accentMap = {
    brand: 'from-brand-500/20 to-brand-600/10 text-brand-400',
    success: 'from-success-500/20 to-success-600/10 text-success-500',
    danger: 'from-danger-500/20 to-danger-600/10 text-danger-500',
    warning: 'from-warning-500/20 to-warning-400/10 text-warning-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">
          {prefix}
          {isCurrency ? formatCurrency(Number(value)) : isPercent ? formatPercent(Number(value)) : value}
        </p>

        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            {positive ? (
              <TrendingUp size={14} className="text-success-500" />
            ) : (
              <TrendingDown size={14} className="text-danger-500" />
            )}
            <span className={cn('text-xs font-semibold', positive ? 'text-success-500' : 'text-danger-500')}>
              {positive ? '+' : ''}{formatPercent(change)}
            </span>
            {changeLabel && (
              <span className="text-xs text-[var(--text-muted)]">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
