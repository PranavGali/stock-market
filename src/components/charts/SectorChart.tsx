import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import type { SectorPerformance } from '@/types';

const SECTOR_COLORS = [
  'hsl(226,76%,55%)', 'hsl(262,72%,58%)', 'hsl(142,72%,45%)',
  'hsl(38,88%,48%)', 'hsl(0,76%,55%)', 'hsl(195,76%,48%)',
  'hsl(310,72%,55%)', 'hsl(165,72%,42%)', 'hsl(52,88%,48%)', 'hsl(20,80%,52%)',
];

// ─── Sector Pie Chart ─────────────────────────────────────────────────────────
interface SectorPieProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

export function SectorPieChart({ data, height = 260 }: SectorPieProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="card p-2 text-xs shadow-xl">
                <p className="font-semibold">{payload[0].name}</p>
                <p className="text-[var(--text-muted)]">{Number(payload[0].value).toFixed(1)}%</p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Sector Bar Chart ─────────────────────────────────────────────────────────
interface SectorBarProps {
  data: SectorPerformance[];
  height?: number;
}

export function SectorBarChart({ data, height = 300 }: SectorBarProps) {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="sector"
          tick={{ fontSize: 10, fill: axisColor }}
          angle={-45}
          textAnchor="end"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: axisColor }}
          tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const v = Number(payload[0].value);
            return (
              <div className="card p-2 text-xs shadow-xl">
                <p className="font-semibold">{payload[0].payload.sector}</p>
                <p className={v >= 0 ? 'text-success-500' : 'text-danger-500'}>
                  {v >= 0 ? '+' : ''}{v.toFixed(2)}%
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="change" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.change >= 0 ? 'hsl(142,72%,45%)' : 'hsl(0,80%,54%)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export { SECTOR_COLORS };
