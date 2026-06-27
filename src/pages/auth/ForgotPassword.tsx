import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPassword } from '@/services/authService';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await resetPassword(data.email);
    setLoading(false);
    setSent(true);
    toast.success('Password reset email sent!');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-gradient">StockIQ</span>
        </Link>

        <div className="card p-8">
          {!sent ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 mx-auto">
                <Mail size={24} className="text-brand-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2 text-center">Reset your password</h1>
              <p className="text-[var(--text-secondary)] text-sm text-center mb-8">
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  id="forgot-email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-success-500/10 flex items-center justify-center mb-6 mx-auto">
                <CheckCircle size={28} className="text-success-500" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Check your email</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                We've sent a reset link to <span className="font-semibold text-[var(--text-primary)]">{getValues('email')}</span>.
                It may take a few minutes to arrive.
              </p>
              <Button variant="outline" size="md" onClick={() => setSent(false)}>
                Send another email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-brand-500 transition-colors">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
