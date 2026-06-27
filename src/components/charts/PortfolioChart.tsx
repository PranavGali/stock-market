import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { formatCurrency } from '@/lib/utils';

interface PortfolioChartProps {
  data: Array<{ date: string; value: number; invested: number }>;
  height?: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 shadow-xl text-xs space-y-1">
      <p className="text-[var(--text-muted)] mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)] capitalize">{p.name}:</span>
          <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function PortfolioChart({ data, height = 280 }: PortfolioChartProps) {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const displayData = data.slice(-90);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(226,76%,50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(226,76%,50%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(142,72%,45%)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="hsl(142,72%,45%)" stopOpacity={0} />
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
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="invested"
          name="invested"
          stroke="hsl(142,72%,45%)"
          strokeWidth={1.5}
          fill="url(#investedGrad)"
          strokeDasharray="5 3"
        />
        <Area
          type="monotone"
          dataKey="value"
          name="value"
          stroke="hsl(226,76%,50%)"
          strokeWidth={2.5}
          fill="url(#valueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
