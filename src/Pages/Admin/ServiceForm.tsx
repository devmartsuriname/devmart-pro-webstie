import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Pause, ExternalLink, Save } from 'lucide-react';
import SlugInput from '@/Components/Admin/SlugInput';
import GalleryInput from '@/Components/Admin/GalleryInput';
import SaveIndicator from '@/Components/Admin/SaveIndicator';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import FormSection from '@/Components/Admin/FormSection';
import FormInput from '@/Components/Admin/FormInput';
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
  status: z.enum(['draft', 'published', 'archived', 'paused']),
  seo_title: z.string().optional(),
  seo_description: z.string().max(160).optional(),
  order: z.number().default(0),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      status: 'draft',
      gallery_urls: [],
      features: [],
      order: 0,
      price_from: null,
    },
  });

  const titleValue = watch('title');
  const slugValue = watch('slug');
  const galleryValue = watch('gallery_urls');
  const featuresValue = watch('features') || [];
  const currentStatus = watch('status');
  const contentValue = watch('content_richtext');

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    if (!id) return;
    
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
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
        order: data.order || 0,
      });
    } catch (error: any) {
      toast.error(error.message);
      navigate('/admin/services');
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

    if (id) {
      query = query.neq('id', id);
    }

    const { data } = await query;
    return !data || data.length === 0;
  };

  const autoSave = useCallback(
    async (data: ServiceFormData) => {
      if (!id) return;
      
      setSaveStatus('saving');
      
      try {
        const payload = {
          ...data,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
          updated_by: user?.id,
        };

        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
        
        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch (error: any) {
        setSaveStatus('error');
        console.error('Autosave failed:', error);
      }
    },
    [id, user?.id]
  );

  useEffect(() => {
    if (!isDirty || !id) return;
    
    const timeout = setTimeout(() => {
      const currentData = watch();
      autoSave(currentData as ServiceFormData);
    }, 800);

    return () => clearTimeout(timeout);
  }, [watch(), isDirty, id, autoSave]);

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    
    try {
      const payload = {
        ...data,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
        updated_by: user?.id,
        ...(id ? {} : { created_by: user?.id }),
      };

      if (id) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([payload]);

        if (error) throw error;
        toast.success('Service created successfully');
      }

      navigate('/admin/services');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ServiceFormData['status']) => {
    setValue('status', newStatus, { shouldDirty: true });
    if (id) {
      const currentData = watch();
      await autoSave({ ...currentData, status: newStatus } as ServiceFormData);
      toast.success(`Service ${newStatus}`);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 w-48 admin-skeleton rounded-lg" />
        <div className="admin-card p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 admin-skeleton rounded mb-2" />
                <div className="h-10 admin-skeleton rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "admin-input";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[hsl(var(--admin-bg-card))] border-b border-[hsl(var(--admin-border-subtle))] -mx-6 px-6 py-6 mb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => navigate('/admin/services')}
              className="mt-1 p-2 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-bg-elevated))] rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-bold text-[hsl(var(--admin-text-primary))]">
                  {id ? 'Edit Service' : 'Create New Service'}
                </h1>
                {id && <SaveIndicator status={saveStatus} lastSaved={lastSaved} />}
              </div>
              <p className="text-sm text-[hsl(var(--admin-text-muted))]">
                {id ? 'Update your service information and settings' : 'Fill in the details to create a new service'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="admin-btn-ghost text-sm px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="service-form"
              disabled={loading}
              className="admin-btn-primary text-sm"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : id ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {id && (
        <div className="flex items-center gap-3 p-4 admin-card backdrop-blur-sm">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">Status</span>
            <div className="h-4 w-px bg-[hsl(var(--admin-border))]"></div>
            {currentStatus === 'published' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange('draft')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[hsl(var(--admin-text-secondary))] bg-[hsl(var(--admin-bg-elevated))] hover:bg-[hsl(var(--admin-bg-hover))] border border-[hsl(var(--admin-border))] rounded-lg transition-all duration-200"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  Unpublish
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('paused')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-amber-400 bg-[hsl(var(--admin-warning-soft))] hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all duration-200"
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </button>
              </>
            ) : currentStatus === 'paused' ? (
              <button
                type="button"
                onClick={() => handleStatusChange('published')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-400 bg-[hsl(var(--admin-success-soft))] hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all duration-200"
              >
                <Eye className="h-3.5 w-3.5" />
                Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStatusChange('published')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-400 bg-[hsl(var(--admin-success-soft))] hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all duration-200"
              >
                <Eye className="h-3.5 w-3.5" />
                Publish Now
              </button>
            )}
          </div>
          
          {slugValue && (
            <a
              href={`/services/${slugValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[hsl(var(--admin-primary))] bg-[hsl(var(--admin-primary-soft))] hover:bg-blue-500/15 border border-blue-500/30 rounded-lg transition-all duration-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview
            </a>
          )}
        </div>
      )}

      {/* Form */}
      <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FormSection title="Basic Information" color="blue">
          <div className="space-y-5">
            <FormInput label="Service Title" required error={errors.title?.message}>
              <input {...register('title')} type="text" className={inputClass} placeholder="e.g. Digital Marketing Services" />
            </FormInput>

            <FormInput label="URL Slug" required error={errors.slug?.message} helperText="This will be used in the service page URL">
              <SlugInput
                titleField={titleValue}
                value={slugValue}
                onChange={(value) => setValue('slug', value)}
                checkUnique={checkSlugUnique}
                currentId={id}
              />
            </FormInput>

            <FormInput label="Category" helperText="Helps organize services (e.g., Marketing, Development, Consulting)">
              <input {...register('category')} type="text" className={inputClass} placeholder="Service category" />
            </FormInput>
          </div>
        </FormSection>

        {/* Content & Description */}
        <FormSection title="Content & Description" color="purple">
          <div className="space-y-5">
            <FormInput label="Short Description" helperText="Brief overview shown in cards and listings (max 280 characters)" error={errors.short_desc?.message}>
              <textarea {...register('short_desc')} rows={3} maxLength={280} className={inputClass} placeholder="Brief description of what this service offers..." />
            </FormInput>

            <FormInput label="Detailed Content" helperText="Full service description with features and benefits">
              <RichTextEditor
                content={contentValue || ''}
                onChange={(value) => setValue('content_richtext', value, { shouldDirty: true })}
              />
            </FormInput>
          </div>
        </FormSection>

        {/* Media Assets */}
        <FormSection title="Media & Images" color="emerald">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput label="Service Icon" helperText="Icon or logo for this service" error={errors.icon_url?.message}>
                <input {...register('icon_url')} type="url" className={inputClass} placeholder="https://example.com/icon.svg" />
              </FormInput>

              <FormInput label="Hero Image" helperText="Main banner/featured image" error={errors.hero_image?.message}>
                <input {...register('hero_image')} type="url" className={inputClass} placeholder="https://example.com/hero.jpg" />
              </FormInput>
            </div>

            <FormInput label="Gallery" helperText="Additional images for the service showcase">
              <GalleryInput value={galleryValue || []} onChange={(urls) => setValue('gallery_urls', urls)} />
            </FormInput>
          </div>
        </FormSection>

        {/* Pricing & Features */}
        <FormSection title="Pricing & Features" color="amber">
          <div className="space-y-5">
            <FormInput label="Starting Price" helperText="Optional starting price (leave blank if pricing varies)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--admin-text-muted))]">₹</span>
                <input
                  {...register('price_from', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`${inputClass} pl-8`}
                  placeholder="999.00"
                />
              </div>
            </FormInput>

            <FormInput label="Key Features" helperText="List the main features and benefits">
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr,1fr,auto] gap-2">
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={newFeature.title}
                    onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeature.title.trim()) {
                        setValue('features', [...featuresValue, newFeature], { shouldDirty: true });
                        setNewFeature({ title: '', description: '' });
                      }
                    }}
                    className="admin-btn-primary px-4"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {featuresValue.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {featuresValue.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-lg group hover:border-[hsl(var(--admin-border))] transition-all duration-200">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[hsl(var(--admin-text-primary))] text-sm">{feature.title}</div>
                          {feature.description && (
                            <div className="text-xs text-[hsl(var(--admin-text-muted))] mt-0.5">{feature.description}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setValue('features', featuresValue.filter((_, i) => i !== index), { shouldDirty: true })}
                          className="flex-shrink-0 p-1.5 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error-soft))] rounded transition-all duration-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormInput>
          </div>
        </FormSection>

        {/* SEO & Metadata */}
        <FormSection title="SEO & Metadata" color="rose">
          <div className="space-y-5">
            <FormInput label="SEO Title" helperText="Custom title for search engines (leave blank to use service title)">
              <input {...register('seo_title')} type="text" maxLength={60} className={inputClass} placeholder="SEO-optimized title" />
            </FormInput>

            <FormInput label="Meta Description" error={errors.seo_description?.message} helperText="Brief description for search results (max 160 characters)">
              <textarea {...register('seo_description')} rows={2} maxLength={160} className={inputClass} placeholder="Concise description for search engines..." />
            </FormInput>
          </div>
        </FormSection>

        {/* Publishing Settings */}
        <FormSection title="Publishing Options" color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="Publication Status" helperText="Control service visibility">
              <select {...register('status')} className={inputClass}>
                <option value="draft">Draft - Not visible</option>
                <option value="published">Published - Live</option>
                <option value="paused">Paused - Temporarily hidden</option>
                <option value="archived">Archived</option>
              </select>
            </FormInput>

            <FormInput label="Display Order" helperText="Controls position in lists (0 = first)">
              <input {...register('order', { valueAsNumber: true })} type="number" min="0" className={inputClass} placeholder="0" />
            </FormInput>
          </div>
        </FormSection>
      </form>
    </div>
  );
};

export default ServiceFormPage;
