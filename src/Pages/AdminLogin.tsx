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
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-bg-base))] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {mode === 'login' ? (
            <div className="mx-auto h-12 w-12 rounded-lg bg-[hsl(var(--admin-brand-1))]/20 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-[hsl(var(--admin-brand-1))]" />
            </div>
          ) : (
            <div className="mx-auto h-12 w-12 rounded-lg bg-[hsl(var(--admin-brand-2))]/20 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-[hsl(var(--admin-brand-2))]" />
            </div>
          )}
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[hsl(var(--admin-text-primary))]">
            {mode === 'login' ? 'Admin Login' : 'Create Admin Account'}
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--admin-text-secondary))]">
            {mode === 'login' 
              ? 'Sign in to access the CMS' 
              : 'Register your first admin account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="admin-card p-8 space-y-4">
            <div>
              <label htmlFor="email" className="admin-label">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="admin-input w-full"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[hsl(var(--admin-error))]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="admin-label">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className="admin-input w-full"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-[hsl(var(--admin-error))]">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'login' ? 'Sign in' : 'Create Account')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                reset();
              }}
              className="text-sm text-[hsl(var(--admin-brand-1))] hover:text-[hsl(var(--admin-brand-1))]/80 transition-colors"
            >
              {mode === 'login' 
                ? 'Need an account? Sign up' 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
