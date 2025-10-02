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
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';
import Breadcrumbs from './Breadcrumbs';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-bg-base))]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--admin-brand-1))]"></div>
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
          sidebarOpen ? 'w-[280px]' : 'w-[76px]'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out fixed h-full z-30 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 border-b border-slate-800 px-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 flex-shrink-0">
              <LayoutDashboard className="h-5 w-5 text-blue-400" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">CMS Admin</div>
                <div className="truncate text-xs text-slate-400">Professional · Dark</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block ml-auto p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-xs uppercase tracking-wide text-slate-500">Manage</div>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-slate-800 text-blue-400 border border-slate-700 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Storage Card */}
          <div className="border-t border-slate-800 p-3">
            <div className={`rounded-xl border border-slate-800 bg-slate-900 p-3 ${!sidebarOpen && 'px-2'}`}>
              {sidebarOpen ? (
                <>
                  <div className="text-xs text-slate-400">Storage</div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/5 bg-blue-600" />
                  </div>
                  <div className="mt-1 text-right text-[11px] text-slate-500">40% used</div>
                </>
              ) : (
                <div className="h-8 w-8 mx-auto rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <span className="text-xs text-blue-400">40%</span>
                </div>
              )}
            </div>
          </div>

          {/* User section */}
          <div className="border-t border-slate-800 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="ml-1 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {user.email}
                  </p>
                  {role && (
                    <p className="text-xs text-slate-400 capitalize">{role}</p>
                  )}
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-600/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[76px]'} w-full`}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden lg:block">
              <div className="text-xs text-slate-400">Admin</div>
              <Breadcrumbs />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300 focus-within:ring-2 focus-within:ring-blue-500/40">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search ( / )"
                className="bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-500 w-40"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    toast.info('Command palette coming soon!');
                  }
                }}
              />
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 text-slate-200 hover:bg-slate-700"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="hidden md:inline text-sm">Theme</span>
            </button>

            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600" title="User" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
