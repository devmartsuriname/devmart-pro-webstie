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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {mode === 'login' ? (
            <LogIn className="mx-auto h-12 w-12 text-primary" />
          ) : (
            <UserPlus className="mx-auto h-12 w-12 text-primary" />
          )}
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Admin Login' : 'Create Admin Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? 'Sign in to access the CMS' 
              : 'Register your first admin account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-sm text-primary hover:text-primary/80"
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
