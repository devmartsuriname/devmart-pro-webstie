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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex' }}>
      {/* Sidebar - Desktop */}
      <aside
        style={{
          display: 'none',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(51, 65, 85, 0.5)',
          width: sidebarOpen ? '288px' : '80px',
          transition: 'width 0.3s',
        }}
        className="lg-flex"
      >
        {/* Sidebar Header */}
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
          {sidebarOpen ? (
            <>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>Admin CMS</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#94a3b8',
                margin: '0 auto',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <Menu style={{ height: '20px', width: '20px' }} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: active ? '#ffffff' : '#94a3b8',
                  boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon style={{ height: '20px', width: '20px', flexShrink: 0 }} />
                {sidebarOpen && <span style={{ fontWeight: '500' }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                <div style={{
                  height: '32px',
                  width: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {user?.email}
                  </p>
                  {role && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'capitalize', margin: 0 }}>{role}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  color: '#94a3b8',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <LogOut style={{ height: '20px', width: '20px' }} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '8px',
                color: '#94a3b8',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
              title="Sign Out"
            >
              <LogOut style={{ height: '20px', width: '20px', margin: '0 auto', display: 'block' }} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
            }}
            className="lg-hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside style={{
            position: 'fixed',
            insetY: 0,
            left: 0,
            width: '288px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(51, 65, 85, 0.5)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
          }} className="lg-hidden">
            {/* Mobile sidebar content - same structure as desktop */}
            <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>Admin CMS</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </button>
            </div>

            <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                      color: active ? '#ffffff' : '#94a3b8',
                      fontWeight: '500',
                    }}
                  >
                    <Icon style={{ height: '20px', width: '20px' }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: '64px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
            className="lg-hidden"
          >
            <Menu style={{ height: '20px', width: '20px' }} />
          </button>

          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {index > 0 && <ChevronRight style={{ height: '16px', width: '16px', color: '#475569' }} />}
                <Link
                  to={crumb.path}
                  style={{
                    color: index === getBreadcrumbs().length - 1 ? '#f1f5f9' : '#94a3b8',
                    fontWeight: index === getBreadcrumbs().length - 1 ? '500' : 'normal',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (index < getBreadcrumbs().length - 1) {
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index < getBreadcrumbs().length - 1) {
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Search */}
          <div style={{ position: 'relative' }} className="hidden-mobile">
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', height: '16px', width: '16px', color: '#94a3b8' }} />
            <input
              type="search"
              placeholder="Search..."
              style={{
                paddingLeft: '36px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                width: '256px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#f1f5f9',
                fontSize: '14px',
                borderRadius: '10px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderTop: '1px solid rgba(51, 65, 85, 0.5)',
          padding: '16px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8' }}>
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} Admin CMS. All rights reserved.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
              <span>System Online</span>
            </div>
          </div>
        </footer>
      </div>
      
      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
          .lg-hidden { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
