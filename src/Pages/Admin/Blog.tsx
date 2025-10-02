import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { TableCard } from '@/Components/Admin/TableCard';
import StatusBadge from '@/Components/Admin/StatusBadge';

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      className: 'w-2/5',
      render: (value: string) => (
        <div className="font-medium text-slate-100">{value}</div>
      )
    },
    { 
      key: 'blog_categories', 
      label: 'Category', 
      className: 'w-1/6',
      render: (value: any) => (
        <span className="text-slate-300">{value?.name || '-'}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'w-1/6',
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'published_at', 
      label: 'Published', 
      className: 'w-1/6',
      render: (value: string) => (
        <span className="text-slate-400">
          {value ? new Date(value).toLocaleDateString() : 'Not published'}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Blog Posts</h1>
          <p className="text-sm text-slate-400 mt-1">Write and publish articles for your audience</p>
        </div>
        <button
          onClick={() => toast.info('Create post coming soon')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Table */}
      <TableCard
        title="All Posts"
        description={`${posts.length} total post${posts.length !== 1 ? 's' : ''}`}
        columns={columns}
        data={posts}
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => toast.info('View post coming soon')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              onClick={() => toast.info('Edit post coming soon')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600/90 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default Blog;
