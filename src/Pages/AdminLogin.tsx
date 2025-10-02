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
      <div className="min-h-screen bg-gradient-to-br from-bg-dark-base via-slate-900 to-bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark-base via-slate-900 to-bg-dark-base relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <LoginCard onSubmit={handleLogin} />
        </div>

        {/* Right Side - Feature Panel (Desktop Only) */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="max-w-lg">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-ink mb-5 leading-tight tracking-tight">
                Powerful Content Management
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed font-medium">
                Manage your digital presence with enterprise-grade tools built for modern teams.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand/25 transition-all duration-300">
                  <Shield className="w-7 h-7 text-brand" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink mb-2">Advanced CMS</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Intuitive content management with rich text editing, media library, and SEO optimization.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary/25 transition-all duration-300">
                  <Users className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink mb-2">Role-Based Access</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Granular permissions system with super admin, admin, editor, author, and viewer roles.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                  <Zap className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink mb-2">SEO Optimized</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Built-in SEO tools with meta tags, structured data, and performance optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract Pattern */}
            <div className="mt-14 relative h-56 rounded-3xl bg-gradient-to-br from-brand/10 via-secondary/5 to-accent/10 border border-border-dark overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-60"></div>
              <div className="absolute inset-0 backdrop-blur-3xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-sm font-semibold">System Status: All services operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
