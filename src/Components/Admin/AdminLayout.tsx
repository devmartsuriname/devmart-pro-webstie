import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  FileText,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Search,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/services', label: 'Services', icon: Package },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { path: '/admin/blog', label: 'Blog', icon: FileText },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, role } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/admin/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/admin' }];
    
    if (paths.length > 1) {
      const section = paths[1];
      breadcrumbs.push({
        label: section.charAt(0).toUpperCase() + section.slice(1),
        path: `/admin/${section}`,
      });
    }
    
    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen ? (
            <>
              <h1 className="text-xl font-bold text-slate-100">Admin CMS</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-300 mx-auto"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {user?.email}
                  </p>
                  {role && (
                    <p className="text-xs text-slate-400 capitalize">{role}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-300 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-300 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 mx-auto" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 lg:hidden flex flex-col">
            {/* Same content as desktop sidebar */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <h1 className="text-xl font-bold text-slate-100">Admin CMS</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {user?.email}
                    </p>
                    {role && (
                      <p className="text-xs text-slate-400 capitalize">{role}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-300 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="h-4 w-4 text-slate-600" />}
                <Link
                  to={crumb.path}
                  className={`${
                    index === getBreadcrumbs().length - 1
                      ? 'text-slate-100 font-medium'
                      : 'text-slate-400 hover:text-slate-300'
                  } transition-colors`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 w-64 bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-slate-500"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>© {new Date().getFullYear()} Admin CMS. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
