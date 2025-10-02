import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginCard } from '@/components/auth/LoginCard';
import { type LoginInput } from '@/lib/validation/auth';
import { Loader2, Shield, Users, Zap } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/admin', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (data: LoginInput) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      throw new Error(error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 style={{ height: '32px', width: '32px', color: '#6366f1', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\')',
        opacity: 0.4,
      }} />
      
      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '-192px',
        width: '384px',
        height: '384px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '50%',
        filter: 'blur(96px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '-192px',
        width: '384px',
        height: '384px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '50%',
        filter: 'blur(96px)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh' }}>
        {/* Left Side - Login Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <LoginCard onSubmit={handleLogin} />
        </div>

        {/* Right Side - Feature Panel (Desktop Only) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }} className="hidden lg:flex">
          <div style={{ maxWidth: '512px' }}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                color: '#f1f5f9',
                marginBottom: '20px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}>
                Powerful Content Management
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#94a3b8',
                lineHeight: '1.6',
                fontWeight: '500',
              }}>
                Manage your digital presence with enterprise-grade tools built for modern teams.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <Shield style={{ width: '28px', height: '28px', color: '#6366f1' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                    Advanced CMS
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', fontWeight: '500' }}>
                    Intuitive content management with rich text editing, media library, and SEO optimization.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <Users style={{ width: '28px', height: '28px', color: '#3b82f6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                    Role-Based Access
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', fontWeight: '500' }}>
                    Granular permissions system with super admin, admin, editor, author, and viewer roles.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.05))',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}>
                  <Zap style={{ width: '28px', height: '28px', color: '#a855f7' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                    SEO Optimized
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', fontWeight: '500' }}>
                    Built-in SEO tools with meta tags, structured data, and performance optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract Pattern */}
            <div style={{
              marginTop: '56px',
              position: 'relative',
              height: '224px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==\')',
                opacity: 0.6,
              }} />
              <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(96px)' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>System Status: All services operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 1023px) {
          .hidden.lg\\:flex {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
