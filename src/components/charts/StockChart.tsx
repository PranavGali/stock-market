import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { formatCurrency } from '@/lib/utils';
import type { ChartDataPoint } from '@/types';

interface StockChartProps {
  data: ChartDataPoint[];
  positive?: boolean;
  height?: number;
  mini?: boolean;
}

export function StockChart({ data, positive = true, height = 300, mini = false }: StockChartProps) {
  const { theme } = useTheme();
  const color = positive ? 'hsl(142,72%,45%)' : 'hsl(0,80%,54%)';
  const gradId = positive ? 'stockGradPos' : 'stockGradNeg';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  if (mini) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="close" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: axisColor }}
          tickFormatter={d => {
            const date = new Date(d);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: axisColor }}
          tickFormatter={v => `$${v.toFixed(0)}`}
          tickLine={false}
          axisLine={false}
          width={55}
          domain={['auto', 'auto']}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as ChartDataPoint;
            return (
              <div className="card p-3 text-xs shadow-xl space-y-1.5">
                <p className="text-[var(--text-muted)]">{label}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-[var(--text-muted)]">Open</span><span className="font-semibold">{formatCurrency(d.open)}</span>
                  <span className="text-[var(--text-muted)]">High</span><span className="font-semibold text-success-500">{formatCurrency(d.high)}</span>
                  <span className="text-[var(--text-muted)]">Low</span><span className="font-semibold text-danger-500">{formatCurrency(d.low)}</span>
                  <span className="text-[var(--text-muted)]">Close</span><span className="font-semibold">{formatCurrency(d.close)}</span>
                </div>
              </div>
            );
          }}
        />
        <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
