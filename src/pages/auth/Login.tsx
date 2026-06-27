import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await login(data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-brand overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            StockIQ
          </Link>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Make smarter<br />investment decisions
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Join thousands of investors who rely on StockIQ for real-time data, AI insights, and portfolio analytics.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Stocks Tracked', value: '5,000+' },
            { label: 'Daily Signals', value: '200+' },
            { label: 'Accuracy Rate', value: '87%' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/60 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--bg-primary)]">
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-gradient">StockIQ</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Welcome back</h1>
          <p className="text-[var(--text-secondary)] mb-8">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.password?.message}
                rightIcon={
                  <button type="button" onClick={() => setShowPass(s => !s)} className="hover:text-[var(--text-primary)] transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-brand-500 hover:text-brand-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full group" loading={isLoading}>
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--bg-primary)] px-3 text-[var(--text-muted)]">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
              <img src="https://github.com/favicon.ico" alt="GitHub" className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors">
              Create one free
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center">
            <Link
              to="/admin-login"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Administrator? Sign in here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
