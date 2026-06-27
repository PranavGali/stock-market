import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, Users, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

const adminStats = [
  { label: 'Total Users', value: '5,284', icon: <Users size={16} /> },
  { label: 'Active Trades', value: '1,832', icon: <Activity size={16} /> },
  { label: 'Monthly Revenue', value: '₹40.2L', icon: <TrendingUp size={16} /> },
];

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAsAdmin, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setAuthError('');
    try {
      await loginAsAdmin(data.email, data.password);
      navigate('/admin');
    } catch {
      setAuthError('Invalid admin email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Left Panel – dark crimson admin branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #1a0008 0%, #3d0020 40%, #5c0a35 70%, #2d0015 100%)',
        }}
      >
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,60,100,0.3) 39px, rgba(255,60,100,0.3) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,60,100,0.3) 39px, rgba(255,60,100,0.3) 40px)`,
          }}
        />
        {/* Glowing orb */}
        <div
          className="absolute top-1/3 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ff3c64, transparent)' }}
        />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white/90 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,60,100,0.25)', border: '1px solid rgba(255,60,100,0.4)' }}
            >
              <Shield size={20} className="text-red-300" />
            </div>
            <span>StockIQ <span style={{ color: '#ff3c64' }}>Admin</span></span>
          </Link>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: 'rgba(255,60,100,0.15)',
              border: '1px solid rgba(255,60,100,0.35)',
              color: '#ff6b8a',
            }}
          >
            <AlertTriangle size={12} />
            Restricted Access — Authorized Personnel Only
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Platform<br />
            <span style={{ color: '#ff6b8a' }}>Control Center</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Full administrative control over users, trades, analytics, and platform configuration. This portal is monitored and audited.
          </p>
        </div>

        <div className="relative space-y-3">
          {adminStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,60,100,0.2)',
              }}
            >
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <span style={{ color: '#ff6b8a' }}>{s.icon}</span>
                {s.label}
              </div>
              <span className="font-bold text-white text-sm">{s.value}</span>
            </motion.div>
          ))}
          <p className="text-white/25 text-xs text-center pt-2">
            All administrative actions are logged and audited.
          </p>
        </div>
      </div>

      {/* Right Panel – login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--bg-primary)] relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a00035, #ff3c64)' }}
            >
              <Shield size={18} className="text-white" />
            </div>
            <span>
              StockIQ <span style={{ color: '#dc2626' }}>Admin</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.25)',
                color: '#dc2626',
              }}
            >
              <Shield size={11} />
              Admin Portal
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
              Administrator Login
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Enter your admin credentials to access the control panel.
            </p>
          </div>

          {/* Hint box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-3.5 mb-6 flex items-start gap-3"
            style={{
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.2)',
            }}
          >
            <AlertTriangle size={15} style={{ color: '#dc2626', marginTop: '1px', flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>Demo credentials</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Email: <span className="font-mono font-medium text-[var(--text-secondary)]">admin@stockiq.com</span>
                &nbsp;·&nbsp;
                Password: <span className="font-mono font-medium text-[var(--text-secondary)]">admin123</span>
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="admin-email"
              label="Admin Email"
              type="email"
              placeholder="admin@stockiq.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                id="admin-password"
                label="Admin Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626' }}
              >
                <AlertTriangle size={14} />
                {authError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 group disabled:opacity-60"
              style={{
                background: isLoading
                  ? 'rgba(153,27,27,0.7)'
                  : 'linear-gradient(135deg, #991b1b, #dc2626, #ef4444)',
                boxShadow: isLoading ? 'none' : '0 4px 20px rgba(220,38,38,0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating…
                </>
              ) : (
                <>
                  Access Admin Panel
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <ChevronRight size={14} className="rotate-180" />
                Back to User Login
              </Link>
              <Link
                to="/"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
