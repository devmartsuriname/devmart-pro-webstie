import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validation/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordInput, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ResetPasswordInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: result.data.password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Password reset successfully!');
      
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 2000);
    } catch (err: any) {
      const message = err?.message || 'Failed to reset password';
      toast.error(message);
      setErrors({ password: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <BrandLogo size="lg" />
            <h1 className="text-2xl font-bold text-ink mt-4">Set New Password</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Choose a strong password for your account
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Password Updated!</h3>
                <p className="text-slate-400 text-sm">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                  New Password
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
                  <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand hover:bg-brand-600 disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-slate-400 hover:text-ink transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
