import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, FolderKanban, FileText, Tag, TrendingUp, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    posts: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, projectsRes, postsRes, categoriesRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('blog_categories').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        services: servicesRes.count || 0,
        projects: projectsRes.count || 0,
        posts: postsRes.count || 0,
        categories: categoriesRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { 
      title: 'Services', 
      value: stats.services, 
      icon: Briefcase, 
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      change: '+12%',
      changePositive: true
    },
    { 
      title: 'Projects', 
      value: stats.projects, 
      icon: FolderKanban, 
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      change: '+8%',
      changePositive: true
    },
    { 
      title: 'Blog Posts', 
      value: stats.posts, 
      icon: FileText, 
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      change: '+15%',
      changePositive: true
    },
    { 
      title: 'Categories', 
      value: stats.categories, 
      icon: Tag, 
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
      change: '+3%',
      changePositive: true
    },
  ];

  const recentActivity = [
    { 
      type: 'Service', 
      title: 'Industrial Automation', 
      action: 'updated', 
      time: '2 hours ago', 
      icon: Briefcase,
      color: 'blue'
    },
    { 
      type: 'Project', 
      title: 'Steel Plant Retrofit', 
      action: 'published', 
      time: '5 hours ago', 
      icon: FolderKanban,
      color: 'green'
    },
    { 
      type: 'Post', 
      title: 'Top 7 Industries Using Automation', 
      action: 'created', 
      time: '1 day ago', 
      icon: FileText,
      color: 'purple'
    },
  ];

  const quickStats = [
    { label: 'Total Views', value: '12.5K', icon: Users, trend: '+5.2%' },
    { label: 'Avg. Time', value: '3m 24s', icon: Clock, trend: '+0.8%' },
    { label: 'Engagement', value: '68%', icon: TrendingUp, trend: '+12%' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="h-12 w-12 rounded-xl bg-slate-800 animate-pulse mb-4" />
              <div className="h-4 w-20 bg-slate-800 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors">
            <Clock className="h-4 w-4" />
            Last 30 days
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm hover:border-slate-700 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.bgGradient} flex items-center justify-center border border-slate-800`}>
                <card.icon className={`h-6 w-6 text-transparent bg-clip-text bg-gradient-to-br ${card.gradient}`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${card.changePositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp className="h-3 w-3" />
                {card.change}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-400 mb-1">{card.title}</div>
            <div className="text-3xl font-bold text-slate-100 mb-3">{card.value}</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-1000`} 
                style={{ width: `${Math.min((card.value / 30) * 100, 100)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-slate-400" />
                </div>
                <span className="text-xs font-semibold text-emerald-400">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="border-b border-slate-800 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
          <p className="text-sm text-slate-400 mt-1">Latest updates across your content</p>
        </div>
        <div className="p-5 space-y-4">
          {recentActivity.map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0 group hover:bg-slate-800/30 -mx-5 px-5 rounded-lg transition-colors"
            >
              <div className={`h-10 w-10 rounded-xl bg-${item.color}-600/20 flex items-center justify-center flex-shrink-0 border border-${item.color}-700/40`}>
                <item.icon className={`h-5 w-5 text-${item.color}-400`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-medium truncate">
                  <span className="text-slate-400">{item.type}:</span> {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  <span className="text-slate-400">{item.action}</span> · {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
