import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
}

export function Card({ className, hover, glass, gradient, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6',
        'bg-[var(--bg-card)] border-[var(--border)]',
        'shadow-card dark:shadow-card-dark',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-brand cursor-pointer',
        glass && 'glass border-white/10',
        gradient && 'bg-gradient-brand border-transparent text-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-[var(--text-primary)]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
