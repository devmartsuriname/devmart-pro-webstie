import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Plus, Trash2 } from 'lucide-react';
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
  hero_image: z.string().url().optional().or(z.literal('')),
  price_from: z.number().nullable().optional(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
  })).optional().default([]),
  gallery_urls: z.array(z.string().url()).optional(),
  status: z.enum(['draft', 'published', 'archived']),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160).optional(),
  is_active: z.boolean().default(true),
  order: z.number().default(0),
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
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      status: 'draft',
      gallery_urls: [],
      features: [],
      is_active: true,
      order: 0,
      price_from: null,
    },
  });

  const titleValue = watch('title');
  const slugValue = watch('slug');
  const galleryValue = watch('gallery_urls');
  const featuresValue = watch('features') || [];

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
        features: [],
        is_active: true,
        order: 0,
        price_from: null,
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
        hero_image: data.hero_image || '',
        price_from: data.price_from,
        features: data.features || [],
        gallery_urls: data.gallery_urls || [],
        status: data.status,
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        is_active: data.is_active ?? true,
        order: data.order || 0,
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
                      placeholder="https://example.com/icon.svg"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Hero Image
                    </label>
                    <input
                      {...register('hero_image')}
                      type="url"
                      className="admin-input w-full"
                      placeholder="https://example.com/hero.jpg"
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

                {/* Pricing & Features */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Pricing & Features
                  </h3>
                  
                  <div>
                    <label className="admin-label">
                      Price From (₹)
                    </label>
                    <input
                      {...register('price_from', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                      type="number"
                      step="0.01"
                      className="admin-input w-full"
                      placeholder="999.00"
                    />
                  </div>

                  <div>
                    <label className="admin-label">
                      Features
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Feature title"
                          value={newFeature.title}
                          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                          className="admin-input flex-1"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newFeature.description}
                          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                          className="admin-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newFeature.title.trim()) {
                              setValue('features', [...featuresValue, newFeature], { shouldDirty: true });
                              setNewFeature({ title: '', description: '' });
                            }
                          }}
                          className="px-3 py-2 bg-[hsl(var(--admin-primary))] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {featuresValue.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {featuresValue.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-[hsl(var(--admin-bg-surface-elevated))] rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-[hsl(var(--admin-text-primary))] text-sm">
                                  {feature.title}
                                </div>
                                {feature.description && (
                                  <div className="text-xs text-[hsl(var(--admin-text-secondary))] mt-1">
                                    {feature.description}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setValue('features', featuresValue.filter((_, i) => i !== index), { shouldDirty: true });
                                }}
                                className="p-1 text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-bg-surface))] rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

                {/* Publishing */}
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
                    Publishing
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

                  <div>
                    <label className="admin-label">
                      Display Order
                    </label>
                    <input
                      {...register('order', { valueAsNumber: true })}
                      type="number"
                      className="admin-input w-full"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      {...register('is_active')}
                      type="checkbox"
                      id="is_active"
                      className="w-4 h-4 rounded border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-surface-elevated))] text-[hsl(var(--admin-primary))] focus:ring-2 focus:ring-[hsl(var(--admin-primary))] focus:ring-offset-0"
                    />
                    <label htmlFor="is_active" className="text-sm text-[hsl(var(--admin-text-primary))] cursor-pointer">
                      Active (visible on frontend)
                    </label>
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
