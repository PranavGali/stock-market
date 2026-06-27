import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-success-500/15 text-success-500',
        danger: 'bg-danger-500/15 text-danger-500',
        warning: 'bg-warning-500/15 text-warning-400',
        brand: 'bg-brand-500/15 text-brand-400',
        neutral: 'bg-dark-400/20 text-[var(--text-secondary)]',
        bullish: 'bg-success-500/15 text-success-500',
        bearish: 'bg-danger-500/15 text-danger-500',
        open: 'bg-success-500/15 text-success-500',
        closed: 'bg-dark-400/20 text-[var(--text-muted)]',
        'strong-buy': 'bg-success-600/20 text-success-400',
        buy: 'bg-success-500/15 text-success-500',
        hold: 'bg-warning-500/15 text-warning-400',
        sell: 'bg-danger-500/15 text-danger-500',
        low: 'bg-success-500/15 text-success-500',
        medium: 'bg-warning-500/15 text-warning-400',
        high: 'bg-danger-500/15 text-danger-500',
      },
    },
    defaultVariants: { variant: 'neutral' },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
}
