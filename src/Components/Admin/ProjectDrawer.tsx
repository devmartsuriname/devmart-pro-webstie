import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import SlugInput from './SlugInput';
import GalleryInput from './GalleryInput';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().optional(),
  client: z.string().optional(),
  location: z.string().optional(),
  short_desc: z.string().optional(),
  body_richtext: z.string().optional(),
  cover_image: z.string().url().optional().or(z.literal('')),
  gallery_urls: z.array(z.string().url()).optional(),
  started_on: z.string().optional(),
  completed_on: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
  seo_og_image: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

const ProjectDrawer = ({ isOpen, onClose, projectId }: ProjectDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'draft',
      gallery_urls: [],
      seo_keywords: [],
    },
  });

  const titleField = watch('title');
  const slugField = watch('slug');

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProject();
    } else if (isOpen) {
      reset({
        status: 'draft',
        gallery_urls: [],
        seo_keywords: [],
      });
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const fetchProject = async () => {
    if (!projectId) return;

    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      reset({
        title: data.title,
        slug: data.slug,
        category: data.category || '',
        client: data.client || '',
        location: data.location || '',
        short_desc: data.short_desc || '',
        body_richtext: data.body_richtext || '',
        cover_image: data.cover_image || '',
        gallery_urls: data.gallery_urls || [],
        started_on: data.started_on || '',
        completed_on: data.completed_on || '',
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

  const checkSlugUnique = async (slug: string, currentId?: string): Promise<boolean> => {
    const query = supabase
      .from('projects')
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

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const isUnique = await checkSlugUnique(data.slug, projectId || undefined);
      if (!isUnique) {
        toast.error('A project with this slug already exists');
        setLoading(false);
        return;
      }

      const payload: any = {
        ...data,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      };

      if (!projectId) {
        payload.created_by = user.id;
        payload.created_at = new Date().toISOString();
      }

      if (data.status === 'published' && !projectId) {
        payload.published_at = new Date().toISOString();
      }

      const { error } = projectId
        ? await supabase.from('projects').update(payload).eq('id', projectId)
        : await supabase.from('projects').insert(payload);

      if (error) throw error;

      toast.success(projectId ? 'Project updated successfully' : 'Project created successfully');
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
                  {projectId ? 'Edit Project' : 'New Project'}
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
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Project Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="Project title"
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
                  currentId={projectId || undefined}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                    <input
                      {...register('category')}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      placeholder="Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Client</label>
                    <input
                      {...register('client')}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                      placeholder="Client name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Location</label>
                  <input
                    {...register('location')}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Started On</label>
                    <input
                      type="date"
                      {...register('started_on')}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Completed On</label>
                    <input
                      type="date"
                      {...register('completed_on')}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Content</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Short Description</label>
                  <textarea
                    {...register('short_desc')}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    placeholder="Brief project overview..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Full Description</label>
                  <textarea
                    {...register('body_richtext')}
                    rows={8}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                    placeholder="Detailed project information..."
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

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Gallery Images</label>
                  <GalleryInput
                    value={watch('gallery_urls') || []}
                    onChange={(urls) => setValue('gallery_urls', urls, { shouldDirty: true })}
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
                  {projectId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProjectDrawer;
