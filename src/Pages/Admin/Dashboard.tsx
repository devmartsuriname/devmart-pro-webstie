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
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--admin-text-primary))]">Dashboard</h1>
        <p className="text-[hsl(var(--admin-text-secondary))] mt-1">Welcome to your CMS admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="admin-card p-6">
            <div className={`bg-gradient-to-br ${card.gradient} h-12 w-12 rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-[hsl(var(--admin-text-secondary))] font-medium">{card.title}</p>
            <p className="text-3xl font-bold text-[hsl(var(--admin-text-primary))] mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-card p-6">
        <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a href="/admin/services" className="block px-4 py-3 rounded-lg hover:bg-[hsl(var(--admin-bg-hover))] transition-colors">
            <p className="font-medium text-[hsl(var(--admin-text-primary))]">Manage Services</p>
            <p className="text-sm text-[hsl(var(--admin-text-secondary))]">Create, edit, and organize services</p>
          </a>
          <a href="/admin/projects" className="block px-4 py-3 rounded-lg hover:bg-[hsl(var(--admin-bg-hover))] transition-colors">
            <p className="font-medium text-[hsl(var(--admin-text-primary))]">Manage Projects</p>
            <p className="text-sm text-[hsl(var(--admin-text-secondary))]">Showcase your portfolio work</p>
          </a>
          <a href="/admin/blog" className="block px-4 py-3 rounded-lg hover:bg-[hsl(var(--admin-bg-hover))] transition-colors">
            <p className="font-medium text-[hsl(var(--admin-text-primary))]">Write Blog Posts</p>
            <p className="text-sm text-[hsl(var(--admin-text-secondary))]">Share insights and updates</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
