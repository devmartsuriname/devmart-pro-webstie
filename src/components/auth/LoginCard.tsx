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
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glassmorphism gradient overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent, rgba(59, 130, 246, 0.05))',
            pointerEvents: 'none',
            borderRadius: '24px',
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
            <BrandLogo size="lg" />
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              color: '#f1f5f9',
              marginTop: '24px',
              letterSpacing: '-0.02em',
            }}>
              Devmart Admin CMS
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '14px', 
              marginTop: '10px',
              fontWeight: '500',
            }}>
              Sign in to manage your content
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div style={{
              marginBottom: '24px',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <span style={{ color: '#f87171', fontSize: '18px' }}>⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#f1f5f9',
                  marginBottom: '10px',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '20px', 
                  height: '20px', 
                  color: '#64748b',
                  transition: 'color 0.2s',
                }} />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  placeholder="admin@devmart.com"
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#334155';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#f87171', fontWeight: '500' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#f1f5f9',
                  marginBottom: '10px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '20px', 
                  height: '20px', 
                  color: '#64748b',
                  transition: 'color 0.2s',
                }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '56px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  placeholder="••••••••"
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#334155';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: '#f87171', fontWeight: '500' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1px solid #475569',
                    background: 'rgba(15, 23, 42, 0.6)',
                    cursor: 'pointer',
                    accentColor: '#6366f1',
                  }}
                  disabled={isLoading}
                />
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500', transition: 'color 0.2s' }}>
                  Remember me
                </span>
              </label>
              <Link
                to="/admin/forgot-password"
                style={{
                  fontSize: '14px',
                  color: '#6366f1',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '8px',
                background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '15px',
                borderRadius: '12px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                outline: 'none',
                boxShadow: isLoading ? 'none' : '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                transition: 'all 0.3s',
                transform: isLoading ? 'none' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(99, 102, 241, 0.39)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px', 
            borderTop: '1px solid #334155',
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: '#64748b', 
              textAlign: 'center',
              fontWeight: '500',
            }}>
              🔒 Protected access for authorized users only
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};
