import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await signup(data.name, data.email, data.password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, hsl(262,76%,45%) 0%, hsl(226,76%,50%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            StockIQ
          </Link>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Start your investment<br />journey today
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Free forever plan. AI predictions, real-time data, and portfolio tracking — everything you need to invest confidently.
          </p>
        </div>
        <div className="relative space-y-4">
          {[
            '✓ Real-time stock prices & charts',
            '✓ AI-powered stock predictions',
            '✓ Portfolio P&L tracker',
            '✓ Custom watchlists & alerts',
            '✓ Financial news & insights',
          ].map(item => (
            <p key={item} className="text-white/80 text-sm font-medium">{item}</p>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--bg-primary)] overflow-y-auto">
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

          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Create your account</h1>
          <p className="text-[var(--text-secondary)] mb-8">Start investing smarter — it's free</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="signup-name"
              label="Full name"
              placeholder="Pranav Reddy"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="signup-password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              rightIcon={
                <button type="button" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              {...register('password')}
            />
            <Input
              id="signup-confirm"
              label="Confirm password"
              type={showPass ? 'text' : 'password'}
              placeholder="Repeat password"
              icon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <p className="text-xs text-[var(--text-muted)]">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-brand-500 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-brand-500 hover:underline">Privacy Policy</a>.
            </p>

            <Button type="submit" size="lg" className="w-full group" loading={isLoading}>
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-400 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
