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
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="lg" />
          <h1 className="text-2xl font-bold text-ink mt-4">Devmart Admin CMS</h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage your content</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                placeholder="admin@devmart.com"
                disabled={isLoading}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isLoading}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-brand focus:ring-2 focus:ring-brand focus:ring-offset-0 cursor-pointer"
                disabled={isLoading}
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>
            <Link
              to="/admin/forgot-password"
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand hover:bg-brand-600 disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Protected access for authorized users only.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
