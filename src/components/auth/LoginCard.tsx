import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';
import { toast } from 'sonner';

interface LoginCardProps {
  onSubmit: (data: LoginInput) => Promise<void>;
}

export const LoginCard = ({ onSubmit }: LoginCardProps) => {
  // Professional admin login card with dark theme
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [serverError, setServerError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Validate
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(result.data);
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error?.message || 'Invalid email or password';
      setServerError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="bg-bg-dark-elevated/40 backdrop-blur-2xl border border-border-dark/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden">
        {/* Glassmorphism gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-secondary/5 pointer-events-none rounded-3xl"></div>
        <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <BrandLogo size="lg" />
          <h1 className="text-3xl font-bold text-ink mt-6 tracking-tight">Devmart Admin CMS</h1>
          <p className="text-slate-400 text-sm mt-2.5 font-medium">Sign in to manage your content</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-300 text-sm font-medium flex items-start gap-3">
            <span className="text-red-400 text-lg">⚠</span>
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink mb-2.5">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-bg-dark-base/60 border border-border-dark hover:border-border-dark-strong focus:border-brand/50 rounded-xl text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all duration-200 font-medium"
                placeholder="admin@devmart.com"
                disabled={isLoading}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-red-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-ink mb-2.5">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-14 py-3.5 bg-bg-dark-base/60 border border-border-dark hover:border-border-dark-strong focus:border-brand/50 rounded-xl text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all duration-200 font-medium"
                placeholder="••••••••"
                disabled={isLoading}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-ink transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-xs text-red-400 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="w-4 h-4 rounded border-border-dark-strong bg-bg-dark-base/60 text-brand focus:ring-2 focus:ring-brand/30 focus:ring-offset-0 cursor-pointer transition-all"
                disabled={isLoading}
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">Remember me</span>
            </label>
            <Link
              to="/admin/forgot-password"
              className="text-sm text-brand hover:text-brand-600 transition-colors font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-brand to-brand-600 hover:from-brand-600 hover:to-brand disabled:from-brand/50 disabled:to-brand/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-bg-dark-elevated shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/40 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border-dark">
          <p className="text-xs text-slate-500 text-center font-medium">
            🔒 Protected access for authorized users only
          </p>
        </div>
        </div>
      </div>
    </motion.div>
  );
};
