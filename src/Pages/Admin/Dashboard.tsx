import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Package, FolderOpen, FileText, TrendingUp } from 'lucide-react';

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
      color: 'bg-blue-600',
      progress: 75,
    },
    {
      label: 'Total Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'bg-purple-600',
      progress: 60,
    },
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'bg-green-600',
      progress: 45,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-100 mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
        </h1>
        <p className="text-slate-400">
          You're logged in as <span className="text-blue-400 capitalize font-medium">{role}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <div
              key={card.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-100">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-400">{card.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${card.color} transition-all duration-500`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Services updated</p>
              <p className="text-xs text-slate-400">Content management in progress</p>
            </div>
            <span className="text-xs text-slate-500">Today</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Projects reviewed</p>
              <p className="text-xs text-slate-400">Portfolio section managed</p>
            </div>
            <span className="text-xs text-slate-500">Today</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-green-600/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">Blog posts published</p>
              <p className="text-xs text-slate-400">New content added</p>
            </div>
            <span className="text-xs text-slate-500">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
