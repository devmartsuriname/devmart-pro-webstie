import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LogIn, UserPlus } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthForm = z.infer<typeof authSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: AuthForm) => {
    setIsSubmitting(true);
    
    if (mode === 'login') {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in');
        setIsSubmitting(false);
      } else {
        toast.success('Signed in successfully');
      }
    } else {
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign up');
        setIsSubmitting(false);
      } else {
        toast.success('Account created! Please sign in.');
        setMode('login');
        reset();
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-bg-base))]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--admin-brand-1))]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-blue-600/20 animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1a1d29] rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-700/50">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-2">
            {mode === 'login' ? (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Register your admin account'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#0f1117] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#0f1117] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-[#0f1117] text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-300">
                  Remember me
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            {/* Toggle Mode */}
            <div className="text-center pt-2">
              <span className="text-sm text-slate-400">
                {mode === 'login' 
                  ? "Don't have an account? " 
                  : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  reset();
                }}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
