import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Loader2, Plus } from 'lucide-react';
import { slugify } from '@/lib/utils';
import SlugInput from './SlugInput';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content_richtext: z.string().optional(),
  cover_image: z.string().url().optional().or(z.literal('')),
  category_id: z.string().uuid().optional().or(z.literal('')),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
  seo_og_image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
});

type BlogForm = z.infer<typeof blogSchema>;

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
}

const BlogDrawer = ({ isOpen, onClose, postId }: BlogDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'draft',
      seo_keywords: [],
    },
  });

  const titleField = watch('title');
  const slugField = watch('slug');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (postId) {
        fetchPost();
      } else {
        reset({
          status: 'draft',
          seo_keywords: [],
        });
      }
    }
  }, [isOpen, postId]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Failed to load categories');
    }
  };

  const fetchPost = async () => {
    if (!postId) return;

    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      reset({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content_richtext: data.content_richtext || '',
        cover_image: data.cover_image || '',
        category_id: data.category_id || '',
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
        seo_og_image: data.seo_og_image || '',
        status: data.status,
      });
    } catch (error: any) {
      toast.error(error.message);
      onClose();
    } finally {
      setFetching(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    setCreatingCategory(true);
    try {
      const slug = slugify(newCategory);
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({ name: newCategory, slug })
        .select()
        .single();

      if (error) throw error;

      toast.success('Category created');
      setCategories([...categories, data]);
      setValue('category_id', data.id, { shouldDirty: true });
      setNewCategory('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const checkSlugUnique = async (slug: string, currentId?: string): Promise<boolean> => {
    const query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (currentId) {
      query.neq('id', currentId);
    }

    const { data, error } = await query;
    return !error && (!data || data.length === 0);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const onSubmit = async (data: BlogForm) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const isUnique = await checkSlugUnique(data.slug, postId || undefined);
      if (!isUnique) {
        toast.error('A post with this slug already exists');
        setLoading(false);
        return;
      }

      const payload: any = {
        ...data,
        category_id: data.category_id || null,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      };

      if (!postId) {
        payload.author_id = user.id;
        payload.created_by = user.id;
        payload.created_at = new Date().toISOString();
      }

      if (data.status === 'published' && !postId) {
        payload.published_at = new Date().toISOString();
      }

      const { error } = postId
        ? await supabase.from('blog_posts').update(payload).eq('id', postId)
        : await supabase.from('blog_posts').insert(payload);

      if (error) throw error;

      toast.success(postId ? 'Post updated successfully' : 'Post created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[640px] bg-slate-900 shadow-2xl z-50 overflow-y-auto">
        {fetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">
                  {postId ? 'Edit Post' : 'New Post'}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-6 space-y-6">
              {/* Basics */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Post Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="Post title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-rose-500">{errors.title.message}</p>
                  )}
                </div>

                <SlugInput
                  titleField={titleField}
                  value={slugField}
                  onChange={(slug) => setValue('slug', slug, { shouldDirty: true })}
                  checkUnique={checkSlugUnique}
                  currentId={postId || undefined}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                  <div className="space-y-2">
                    <select
                      {...register('category_id')}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    
                    {/* Quick add category */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Create new category..."
                        className="flex-1 px-3 py-2 text-sm bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={!newCategory.trim() || creatingCategory}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        {creatingCategory ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Content</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Excerpt</label>
                  <textarea
                    {...register('excerpt')}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    placeholder="Short summary..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Full Content</label>
                  <textarea
                    {...register('content_richtext')}
                    rows={12}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    placeholder="Write your post content..."
                  />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Media</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    {...register('cover_image')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">SEO</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Meta Title</label>
                  <input
                    {...register('seo_title')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Meta Description</label>
                  <textarea
                    {...register('seo_description')}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    placeholder="SEO description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">OG Image URL</label>
                  <input
                    type="url"
                    {...register('seo_og_image')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Publishing</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {postId ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default BlogDrawer;
