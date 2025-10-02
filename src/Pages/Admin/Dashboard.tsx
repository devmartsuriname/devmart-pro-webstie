import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, FolderKanban, FileText, Tag } from 'lucide-react';

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
    { title: 'Services', value: stats.services, icon: Briefcase, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Projects', value: stats.projects, icon: FolderKanban, gradient: 'from-green-500 to-green-600' },
    { title: 'Blog Posts', value: stats.posts, icon: FileText, gradient: 'from-purple-500 to-purple-600' },
    { title: 'Categories', value: stats.categories, icon: Tag, gradient: 'from-orange-500 to-orange-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[hsl(var(--admin-text-primary))]">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="admin-card p-6">
              <div className="admin-skeleton h-12 w-12 rounded-lg mb-4"></div>
              <div className="admin-skeleton h-4 rounded w-20 mb-2"></div>
              <div className="admin-skeleton h-8 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="text-xs text-slate-400">
          <span className="hover:text-slate-200">Home</span>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-300">Dashboard</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Import</button>
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Export</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:border-slate-700 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-emerald-400">+12%</div>
            </div>
            <div className="text-sm font-medium text-slate-400 mb-1">{card.title}</div>
            <div className="text-3xl font-bold text-slate-100 mb-3">{card.value}</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500`} style={{ width: `${(card.value / 30) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="border-b border-slate-800 p-4">
          <h2 className="text-base font-semibold text-slate-100">Recent Activity</h2>
          <p className="text-sm text-slate-400">Latest updates across your content</p>
        </div>
        <div className="p-4 space-y-4">
          {[
            { type: 'Service', title: 'Industrial Automation', action: 'updated', time: '2 hours ago', icon: Briefcase },
            { type: 'Project', title: 'Steel Plant Retrofit', action: 'published', time: '5 hours ago', icon: FolderKanban },
            { type: 'Post', title: 'Top 7 Industries', action: 'created', time: '1 day ago', icon: FileText },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">
                  <span className="font-medium">{item.type}:</span> {item.title} <span className="text-slate-400">{item.action}</span>
                </p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>© {new Date().getFullYear()} Admin CMS</div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">v1.0 • Professional Dark</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" title="All systems operational" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
