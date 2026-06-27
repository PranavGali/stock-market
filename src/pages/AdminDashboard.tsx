import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Activity, Search, MoreVertical, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { formatNumber } from '@/lib/utils';

// Mock admin data
const userGrowthData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  users: Math.floor(1000 + i * 420 + Math.random() * 300),
  revenue: Math.floor(5000 + i * 1200 + Math.random() * 800),
}));

const mockUsers = [
  { id: 'u1', name: 'Pranav Reddy', email: 'pranav@example.com', plan: 'Pro', status: 'Active', joined: '2024-01-15', trades: 24 },
  { id: 'u2', name: 'Priya Kapoor', email: 'priya@example.com', plan: 'Free', status: 'Active', joined: '2024-02-03', trades: 8 },
  { id: 'u3', name: 'Rahul Mehta', email: 'rahul@example.com', plan: 'Enterprise', status: 'Active', joined: '2024-01-28', trades: 142 },
  { id: 'u4', name: 'Amit Shah', email: 'amit@example.com', plan: 'Pro', status: 'Inactive', joined: '2024-03-10', trades: 5 },
  { id: 'u5', name: 'Neha Gupta', email: 'neha@example.com', plan: 'Free', status: 'Active', joined: '2024-03-14', trades: 2 },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram@example.com', plan: 'Pro', status: 'Active', joined: '2024-02-20', trades: 67 },
];

const activityLog = [
  { id: 1, action: 'New user registered', user: 'Neha Gupta', time: '2 min ago', type: 'info' },
  { id: 2, action: 'Pro plan upgraded', user: 'Pranav Reddy', time: '15 min ago', type: 'success' },
  { id: 3, action: 'Failed login attempt', user: 'unknown@domain.com', time: '32 min ago', type: 'danger' },
  { id: 4, action: 'Large trade executed', user: 'Rahul Mehta', time: '1 hr ago', type: 'warning' },
  { id: 5, action: 'Password reset', user: 'Amit Shah', time: '2 hr ago', type: 'info' },
];

export function AdminDashboard() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-danger-500/10 flex items-center justify-center">
          <Shield size={20} className="text-danger-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-0.5">Platform management and analytics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value="5,284" change={12.4} changeLabel="this month" icon={<Users size={18} />} accent="brand" index={0} />
        <StatCard label="Monthly Revenue" value="₹40,16,000" change={8.7} changeLabel="vs last month" icon={<DollarSign size={18} />} accent="success" index={1} />
        <StatCard label="Active Trades" value="1,832" change={3.2} icon={<Activity size={18} />} accent="warning" index={2} />
        <StatCard label="Pro Subscribers" value="1,240" change={22.1} changeLabel="this month" icon={<TrendingUp size={18} />} accent="brand" index={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>User Growth</CardTitle><Badge variant="brand">2024</Badge></CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} tickFormatter={v => formatNumber(v, true)} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="card p-2 text-xs shadow-xl">
                      <p className="font-bold">{payload[0].payload.month}</p>
                      <p>{formatNumber(payload[0].value as number)} users</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="users" fill="hsl(226,76%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue Trend</CardTitle><Badge variant="success">MRR</Badge></CardHeader>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="card p-2 text-xs shadow-xl">
                      <p className="font-bold">{payload[0].payload.month}</p>
                      <p>₹{formatNumber(payload[0].value as number)}</p>
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(142,72%,45%)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Users ({mockUsers.length})</CardTitle>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-8 pr-4 py-1.5 rounded-lg text-xs border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-brand-500/40"
              />
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['User', 'Plan', 'Status', 'Trades', ''].map(h => (
                    <th key={h} className="text-left px-2 py-2.5 text-xs font-semibold text-[var(--text-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-7 h-7 rounded-full border border-[var(--border)]" />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{u.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Badge variant={u.plan === 'Pro' ? 'brand' : u.plan === 'Enterprise' ? 'success' : 'neutral'}>
                        {u.plan}
                      </Badge>
                    </td>
                    <td className="px-2 py-3">
                      <Badge variant={u.status === 'Active' ? 'success' : 'neutral'}>{u.status}</Badge>
                    </td>
                    <td className="px-2 py-3 font-mono font-semibold text-[var(--text-primary)]">{u.trades}</td>
                    <td className="px-2 py-3">
                      <button className="p-1 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
          <div className="space-y-4">
            {activityLog.map(log => (
              <div key={log.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  log.type === 'success' ? 'bg-success-500' :
                  log.type === 'danger' ? 'bg-danger-500' :
                  log.type === 'warning' ? 'bg-warning-400' : 'bg-brand-400'
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{log.action}</p>
                  <p className="text-xs text-[var(--text-muted)]">{log.user}</p>
                  <p className="text-xs text-[var(--text-muted)]">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
