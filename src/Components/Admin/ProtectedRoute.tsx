import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole | AppRole[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && role) {
    const hasAccess = Array.isArray(requiredRole)
      ? requiredRole.includes(role)
      : role === requiredRole;

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Access Denied</h2>
              <p className="text-slate-400 mb-6">
                You don't have permission to access this page.
              </p>
              <a
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
