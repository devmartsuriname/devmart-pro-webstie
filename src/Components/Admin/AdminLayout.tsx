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
    <div className="min-h-screen bg-[hsl(var(--admin-bg-base))] flex w-full">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[hsl(var(--admin-bg-surface))] border-r border-[hsl(var(--admin-border-elevated))] transition-all duration-300 ease-in-out fixed h-full z-30 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(var(--admin-border-elevated))]">
            {sidebarOpen && (
              <span className="text-xl font-bold text-[hsl(var(--admin-brand-1))]">CMS Admin</span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-[hsl(var(--admin-bg-surface-elevated))] text-[hsl(var(--admin-text-secondary))]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`admin-sidebar-link ${
                  isActive(item.href) ? 'admin-sidebar-link-active' : ''
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-[hsl(var(--admin-border-elevated))] p-4 space-y-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[hsl(var(--admin-brand-1))]/20 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-[hsl(var(--admin-brand-1))]" />
              </div>
              {sidebarOpen && (
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-[hsl(var(--admin-text-primary))] truncate">
                    {user.email}
                  </p>
                  {role && (
                    <p className="text-xs text-[hsl(var(--admin-text-secondary))] capitalize">{role}</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error))]/10 rounded-lg transition-colors"
              title={!sidebarOpen ? 'Sign out' : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3">Sign out</span>}
            </button>
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
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} w-full`}>
        {/* Topbar */}
        <header className="h-16 bg-[hsl(var(--admin-bg-surface))] border-b border-[hsl(var(--admin-border-elevated))] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--admin-bg-surface-elevated))] text-[hsl(var(--admin-text-secondary))]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-[hsl(var(--admin-bg-surface-elevated))] border border-[hsl(var(--admin-border))] rounded-lg">
              <Search className="h-4 w-4 text-[hsl(var(--admin-text-muted))]" />
              <input
                type="text"
                placeholder="Search... (⌘K)"
                className="bg-transparent border-none focus:outline-none text-sm text-[hsl(var(--admin-text-primary))] placeholder:text-[hsl(var(--admin-text-muted))] w-48"
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
              className="p-2 rounded-lg hover:bg-[hsl(var(--admin-bg-surface-elevated))] text-[hsl(var(--admin-text-secondary))]"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              className="p-2 rounded-lg hover:bg-[hsl(var(--admin-bg-surface-elevated))] text-[hsl(var(--admin-text-secondary))]"
              title="Quick actions"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
