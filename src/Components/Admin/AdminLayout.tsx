import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/lib/theme-context';
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderKanban, 
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/admin/login');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (path === '/admin') return [{ label: 'Dashboard', href: '/admin' }];
    
    const breadcrumbs = [{ label: 'Home', href: '/admin' }];
    
    if (segments[1]) {
      const pageName = segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
      breadcrumbs.push({ label: pageName, href: `/admin/${segments[1]}` });
    }
    
    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex w-full">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-[280px]' : 'w-[72px]'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 fixed h-full z-40 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 border-b border-slate-800 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex-shrink-0 shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-slate-100">Admin CMS</div>
                <div className="text-xs text-slate-500 font-medium">Professional Dashboard</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {sidebarOpen && (
              <div className="px-2 pb-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Main Menu
              </div>
            )}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Storage Widget */}
          <div className="border-t border-slate-800 p-3">
            <div className={`rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-3 ${!sidebarOpen && 'px-2'}`}>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">Storage</span>
                    <span className="text-xs font-bold text-blue-400">40%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                    <div className="h-full w-2/5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all" />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">2.4GB of 6GB used</div>
                </>
              ) : (
                <div className="h-8 w-8 mx-auto rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-400">40</span>
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="border-t border-slate-800 p-3">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center flex-shrink-0 ring-2 ring-slate-800 shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {user.email?.split('@')[0] || 'Admin'}
                  </p>
                  {role && (
                    <p className="text-xs text-slate-500 capitalize font-medium">{role}</p>
                  )}
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleSignOut}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20 hover:border-rose-500/40"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[72px]'} w-full`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800/80 shadow-lg">
          <div className="h-full flex items-center justify-between px-4 lg:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-2 text-sm">
                {getBreadcrumbs().map((crumb, i, arr) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    <Link
                      to={crumb.href}
                      className={`font-medium transition-colors ${
                        i === arr.length - 1
                          ? 'text-slate-200'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                    {i < arr.length - 1 && (
                      <span className="text-slate-600">›</span>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-400 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/40 transition-all">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-500 text-slate-200 w-40"
                />
                <kbd className="hidden xl:inline-flex h-5 px-1.5 rounded bg-slate-700 text-[11px] text-slate-400 font-mono">
                  /
                </kbd>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 h-9 rounded-lg bg-slate-800 border border-slate-700 pl-2 pr-3 hover:bg-slate-700 transition-colors group"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-slate-600">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-2">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-semibold text-slate-200 truncate">
                          {user.email}
                        </p>
                        {role && (
                          <p className="text-xs text-slate-500 capitalize mt-0.5">{role}</p>
                        )}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 lg:p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 px-6 py-4">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-500">
              © {new Date().getFullYear()} Admin CMS. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-600">v1.0.0 · Dark Professional</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
