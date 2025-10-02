import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import SlugInput from './SlugInput';
import GalleryInput from './GalleryInput';
import { useAuth } from '@/hooks/useAuth';

const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().optional(),
  short_desc: z.string().max(280).optional(),
  content_richtext: z.string().optional(),
  icon_url: z.string().url().optional().or(z.literal('')),
  gallery_urls: z.array(z.string().url()).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160).optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

interface ServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

const ServiceDrawer = ({ isOpen, onClose, serviceId }: ServiceDrawerProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      status: 'draft',
      gallery_urls: [],
    },
  });

  const titleValue = watch('title');
  const slugValue = watch('slug');
  const galleryValue = watch('gallery_urls');

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchService();
    } else if (isOpen) {
      reset({
        status: 'draft',
        gallery_urls: [],
      });
      setHasUnsavedChanges(false);
    }
  }, [isOpen, serviceId]);

  const fetchService = async () => {
    if (!serviceId) return;
    
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;

      reset({
        title: data.title,
        slug: data.slug,
        category: data.category || '',
        short_desc: data.short_desc || '',
        content_richtext: data.content_richtext || '',
        icon_url: data.icon_url || '',
        gallery_urls: data.gallery_urls || [],
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
      });
      setHasUnsavedChanges(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    if (!slug) return false;
    
    let query = supabase
      .from('services')
      .select('id')
      .eq('slug', slug);

    if (serviceId) {
      query = query.neq('id', serviceId);
    }

    const { data } = await query;
    return !data || data.length === 0;
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

  const onSubmit = async (data: ServiceForm) => {
    setLoading(true);
    
    try {
      const payload = {
        ...data,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        updated_by: user?.id,
        ...(serviceId ? {} : { created_by: user?.id }),
      };

      if (serviceId) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', serviceId);

        if (error) throw error;
        toast.success('Service updated');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);

        if (error) throw error;
        toast.success('Service created');
      }

      setHasUnsavedChanges(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[hsl(var(--admin-bg-surface))] border-l border-[hsl(var(--admin-border))] shadow-[var(--admin-shadow-lg)] animate-slide-in-right">
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--admin-border-elevated))]">
            <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))]">
              {serviceId ? 'Edit Service' : 'New Service'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-bg-surface-elevated))] rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {initialLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="admin-skeleton h-4 rounded w-24 mb-2"></div>
                    <div className="admin-skeleton h-10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Basics */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Basics
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      className="admin-input w-full"
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-[hsl(var(--admin-error))]">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">
                      Slug *
                    </label>
                    <SlugInput
                      titleField={titleValue}
                      value={slugValue}
                      onChange={(value) => setValue('slug', value)}
                      checkUnique={checkSlugUnique}
                      currentId={serviceId || undefined}
                    />
                    {errors.slug && (
                      <p className="mt-1 text-xs text-[hsl(var(--admin-error))]">{errors.slug.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">
                      Category
                    </label>
                    <input
                      {...register('category')}
                      type="text"
                      className="admin-input w-full"
                    />
                  </div>
                </section>

                {/* Content */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Content
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      Short Description
                    </label>
                    <textarea
                      {...register('short_desc')}
                      rows={3}
                      className="admin-input w-full"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Content
                    </label>
                    <textarea
                      {...register('content_richtext')}
                      rows={8}
                      className="admin-input w-full"
                    />
                  </div>
                </section>

                {/* Media */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Media
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      Icon URL
                    </label>
                    <input
                      {...register('icon_url')}
                      type="url"
                      className="admin-input w-full"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Gallery URLs
                    </label>
                    <GalleryInput
                      value={galleryValue || []}
                      onChange={(urls) => setValue('gallery_urls', urls)}
                    />
                  </div>
                </section>

                {/* SEO */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    SEO
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      SEO Title
                    </label>
                    <input
                      {...register('seo_title')}
                      type="text"
                      className="admin-input w-full"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Meta Description
                    </label>
                    <textarea
                      {...register('seo_description')}
                      rows={2}
                      maxLength={160}
                      className="admin-input w-full"
                    />
                    {errors.seo_description && (
                      <p className="mt-1 text-xs text-[hsl(var(--admin-error))]">{errors.seo_description.message}</p>
                    )}
                  </div>
                </section>

                {/* Publish */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Publish
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="admin-input w-full"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[hsl(var(--admin-border-elevated))] bg-[hsl(var(--admin-bg-surface-elevated))] sticky bottom-0">
            <button
              type="button"
              onClick={handleClose}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceDrawer;
