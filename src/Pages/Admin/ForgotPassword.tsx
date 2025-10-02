import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetError) throw resetError;

      setIsSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err: any) {
      const message = err?.message || 'Failed to send reset email';
      setError(message);
      toast.error(message);
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
          {/* Back Button */}
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to login</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <BrandLogo size="lg" />
            <h1 className="text-2xl font-bold text-ink mt-4">Reset Password</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Check your email</h3>
                <p className="text-slate-400 text-sm">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              <Link
                to="/admin/login"
                className="inline-block mt-4 px-6 py-3 bg-brand hover:bg-brand-600 text-white font-semibold rounded-lg transition-all"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    placeholder="admin@devmart.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand hover:bg-brand-600 disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
