import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Package, FolderOpen, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';

interface Stats {
  services: number;
  projects: number;
  blogPosts: number;
}

const Dashboard = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, blogPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, projectsRes, postsRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        services: servicesRes.count || 0,
        projects: projectsRes.count || 0,
        blogPosts: postsRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Services',
      value: stats.services,
      icon: Package,
      gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.05))',
      iconBg: 'rgba(99, 102, 241, 0.2)',
      iconColor: '#818cf8',
      progress: 75,
      change: '+12%',
    },
    {
      label: 'Total Projects',
      value: stats.projects,
      icon: FolderOpen,
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
      bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05))',
      iconBg: 'rgba(168, 85, 247, 0.2)',
      iconColor: '#c084fc',
      progress: 60,
      change: '+8%',
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
      iconBg: 'rgba(34, 197, 94, 0.2)',
      iconColor: '#4ade80',
      progress: 45,
      change: '+5%',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Section */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent, rgba(168, 85, 247, 0.05))',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px', margin: 0 }}>
            Welcome back, {user?.email?.split('@')[0] || 'Admin'}! 👋
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>
            You're logged in as <span style={{ color: '#818cf8', textTransform: 'capitalize', fontWeight: '600' }}>{role}</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <div
              key={card.label}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                borderRadius: '20px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: card.bgGradient,
                pointerEvents: 'none',
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500', margin: 0 }}>{card.label}</p>
                    <p style={{ fontSize: '36px', fontWeight: '700', color: '#f1f5f9', margin: 0, lineHeight: 1 }}>
                      {loading ? '...' : card.value}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#4ade80',
                      fontWeight: '600',
                    }}>
                      <ArrowUpRight style={{ height: '14px', width: '14px' }} />
                      <span>{card.change} from last month</span>
                    </div>
                  </div>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: card.iconBg,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${card.iconColor}40`,
                  }}>
                    <Icon style={{ height: '28px', width: '28px', color: card.iconColor }} />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#64748b', fontWeight: '500' }}>Progress</span>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{card.progress}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{
                        height: '100%',
                        background: card.gradient,
                        width: `${card.progress}%`,
                        transition: 'width 0.5s',
                        borderRadius: '9999px',
                        boxShadow: `0 0 10px ${card.iconColor}60`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '20px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), transparent)',
          pointerEvents: 'none',
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>Recent Activity</h2>
            <TrendingUp style={{ height: '20px', width: '20px', color: '#94a3b8' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.3)';
            }}>
              <div style={{
                height: '48px',
                width: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Package style={{ height: '24px', width: '24px', color: '#818cf8' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0', margin: 0, marginBottom: '4px' }}>Services updated</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Content management in progress</p>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Today</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.3)';
            }}>
              <div style={{
                height: '48px',
                width: '48px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FolderOpen style={{ height: '24px', width: '24px', color: '#c084fc' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0', margin: 0, marginBottom: '4px' }}>Projects reviewed</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Portfolio section managed</p>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Today</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.3)';
            }}>
              <div style={{
                height: '48px',
                width: '48px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText style={{ height: '24px', width: '24px', color: '#4ade80' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#e2e8f0', margin: 0, marginBottom: '4px' }}>Blog posts published</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>New content added</p>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
