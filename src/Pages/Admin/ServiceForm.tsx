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

type ServiceForm = z.infer<typeof serviceSchema>;

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch, setValue } = useForm<ServiceForm>({
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

  // Autosave function
  const autoSave = useCallback(
    async (data: ServiceForm) => {
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

  // Debounced autosave
  useEffect(() => {
    if (!isDirty || !id) return;
    
    const timeout = setTimeout(() => {
      const currentData = watch();
      autoSave(currentData as ServiceForm);
    }, 800);

    return () => clearTimeout(timeout);
  }, [watch(), isDirty, id, autoSave]);

  const onSubmit = async (data: ServiceForm) => {
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

  const handleStatusChange = async (newStatus: ServiceForm['status']) => {
    setValue('status', newStatus, { shouldDirty: true });
    if (id) {
      const currentData = watch();
      await autoSave({ ...currentData, status: newStatus } as ServiceForm);
      toast.success(`Service ${newStatus}`);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-slate-800 rounded animate-pulse mb-2" />
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {id ? 'Edit Service' : 'New Service'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {id ? 'Update service details and content' : 'Create a new service offering'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
        </div>
      </div>

      {/* Status Actions */}
      {id && (
        <div className="flex items-center gap-2 p-4 bg-slate-900 rounded-lg border border-slate-800">
          {currentStatus === 'published' ? (
            <>
              <button
                type="button"
                onClick={() => handleStatusChange('draft')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <EyeOff className="h-3.5 w-3.5" />
                Unpublish
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('paused')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-600/20 border border-amber-700/40 rounded-lg hover:bg-amber-600/30 transition-colors"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
            </>
          ) : currentStatus === 'paused' ? (
            <button
              type="button"
              onClick={() => handleStatusChange('published')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-600/20 border border-emerald-700/40 rounded-lg hover:bg-emerald-600/30 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Resume
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStatusChange('published')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-600/20 border border-emerald-700/40 rounded-lg hover:bg-emerald-600/30 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Publish
            </button>
          )}
          
          {slugValue && (
            <a
              href={`/services/${slugValue}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-600/20 border border-blue-700/40 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview
            </a>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Basics
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service title"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Slug *
            </label>
            <SlugInput
              titleField={titleValue}
              value={slugValue}
              onChange={(value) => setValue('slug', value)}
              checkUnique={checkSlugUnique}
              currentId={id}
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-rose-400">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <input
              {...register('category')}
              type="text"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Marketing, SEO, Analytics"
            />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Content
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Short Description
            </label>
            <textarea
              {...register('short_desc')}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description for cards and previews"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Description
            </label>
            <RichTextEditor
              content={contentValue || ''}
              onChange={(value) => setValue('content_richtext', value, { shouldDirty: true })}
            />
          </div>
        </div>

        {/* Media */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Media
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Icon URL
            </label>
            <input
              {...register('icon_url')}
              type="url"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/icon.svg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Hero Image
            </label>
            <input
              {...register('hero_image')}
              type="url"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/hero.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Gallery URLs
            </label>
            <GalleryInput
              value={galleryValue || []}
              onChange={(urls) => setValue('gallery_urls', urls)}
            />
          </div>
        </div>

        {/* Pricing & Features */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Pricing & Features
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price From (₹)
            </label>
            <input
              {...register('price_from', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="999.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Features
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Feature title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFeature.title.trim()) {
                      setValue('features', [...featuresValue, newFeature], { shouldDirty: true });
                      setNewFeature({ title: '', description: '' });
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              {featuresValue.length > 0 && (
                <div className="space-y-2 mt-3">
                  {featuresValue.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-slate-100 text-sm">
                          {feature.title}
                        </div>
                        {feature.description && (
                          <div className="text-xs text-slate-400 mt-1">
                            {feature.description}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('features', featuresValue.filter((_, i) => i !== index), { shouldDirty: true });
                        }}
                        className="p-1 text-rose-400 hover:bg-slate-700 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            SEO
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              SEO Title
            </label>
            <input
              {...register('seo_title')}
              type="text"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optimized title for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meta Description
            </label>
            <textarea
              {...register('seo_description')}
              rows={2}
              maxLength={160}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description for search results (max 160 characters)"
            />
            {errors.seo_description && (
              <p className="mt-1 text-xs text-rose-400">{errors.seo_description.message}</p>
            )}
          </div>
        </div>

        {/* Publishing */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
            Publishing
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Order
            </label>
            <input
              {...register('order', { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-900 rounded-lg border border-slate-800 sticky bottom-6">
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : id ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormPage;
