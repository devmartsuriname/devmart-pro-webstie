import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import FormInput from '@/Components/Admin/FormInput';
import SlugInput from '@/Components/Admin/SlugInput';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const currentStatus = watch('status');
  const contentValue = watch('content_richtext');
  const shortDescValue = watch('short_desc');

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


  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--admin-bg-base))] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-[hsl(var(--admin-brand-1))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[hsl(var(--admin-text-muted))]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#1f2937] bg-[#111827]/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/services"
              className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Services</span>
            </Link>
            <div className="w-px h-6 bg-[#374151]" />
            <h1 className="text-xl font-semibold text-white">
              {id ? 'Edit Service' : 'Create Service'}
            </h1>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details Card */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#1f2937]">
                <h2 className="text-lg font-semibold text-white">Service Details</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Configure the service information and content.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#d1d5db]">
                      Service Title <span className="text-red-400">*</span>
                    </label>
                    <input 
                      {...register('title')} 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                      placeholder="Enter service title" 
                    />
                    {errors.title && (
                      <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#d1d5db]">
                      URL Slug <span className="text-red-400">*</span>
                    </label>
                    <SlugInput
                      titleField={titleValue}
                      value={slugValue}
                      onChange={(value) => setValue('slug', value)}
                      checkUnique={checkSlugUnique}
                      currentId={id}
                      placeholder="url-friendly-slug"
                    />
                    {errors.slug && (
                      <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>
                    )}
                    <p className="text-xs text-[#6b7280]">Will be used in URLs: /services/your-slug</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Status</label>
                  <Select value={currentStatus} onValueChange={(value) => setValue('status', value as ServiceFormData['status'], { shouldDirty: true })}>
                    <SelectTrigger className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white focus:ring-2 focus:ring-[#3b82f6]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Service Excerpt</label>
                  <textarea 
                    {...register('short_desc')} 
                    rows={4} 
                    maxLength={280} 
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all resize-none"
                    placeholder="Brief description of the service for listings and previews" 
                  />
                  <div className="flex justify-between text-xs">
                    <p className="text-[#6b7280]">This short description will appear in service listings and search results.</p>
                    <p className="text-[#6b7280]">{shortDescValue?.length || 0}/280</p>
                  </div>
                  {errors.short_desc && (
                    <p className="text-xs text-red-400">{errors.short_desc.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Service Content</label>
                  <div className="rounded-lg overflow-hidden border border-[#374151]">
                    <RichTextEditor
                      content={contentValue || ''}
                      onChange={(value) => setValue('content_richtext', value, { shouldDirty: true })}
                    />
                  </div>
                  <p className="text-xs text-[#6b7280]">Detailed service description with rich formatting</p>
                </div>
              </div>
            </div>

            {/* SEO Settings Card */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#1f2937]">
                <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Optimize for search engines.</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">SEO Title</label>
                  <input 
                    {...register('seo_title')} 
                    type="text" 
                    maxLength={60} 
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="SEO-optimized title" 
                  />
                  <p className="text-xs text-[#6b7280]">Custom title for search engines (leave blank to use service title)</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Meta Description</label>
                  <textarea 
                    {...register('seo_description')} 
                    rows={3} 
                    maxLength={160} 
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all resize-none"
                    placeholder="Brief description for search results..." 
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-red-400">{errors.seo_description?.message}</p>
                    <p className="text-xs text-[#6b7280]">{watch('seo_description')?.length || 0}/160</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Additional Options Card */}
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#1f2937]">
                <h2 className="text-lg font-semibold text-white">Additional Options</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Category, pricing, and display.</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Category</label>
                  <input
                    {...register('category')}
                    type="text"
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="e.g. Marketing, Development"
                  />
                  <p className="text-xs text-[#6b7280]">Helps organize services</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Starting Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af] font-medium">₹</span>
                    <input
                      {...register('price_from', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-9 pr-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                      placeholder="999.00"
                    />
                  </div>
                  <p className="text-xs text-[#6b7280]">Optional starting price</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#d1d5db]">Display Order</label>
                  <input 
                    {...register('order', { valueAsNumber: true })} 
                    type="number" 
                    min="0" 
                    className="w-full px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    placeholder="0" 
                  />
                  <p className="text-xs text-[#6b7280]">Lower numbers appear first</p>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            {id && (
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-[#d1d5db] mb-3">Quick Info</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-2 border-b border-[#1f2937]">
                      <span className="text-[#9ca3af]">Status</span>
                      <span className={`font-medium px-2 py-0.5 rounded ${
                        currentStatus === 'published' ? 'bg-green-500/10 text-green-400' :
                        currentStatus === 'draft' ? 'bg-gray-500/10 text-gray-400' :
                        currentStatus === 'paused' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {currentStatus}
                      </span>
                    </div>
                    {slugValue && (
                      <div className="pt-2">
                        <span className="text-[#9ca3af] block mb-1">Public URL</span>
                        <code className="text-[#3b82f6] text-xs break-all">/services/{slugValue}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormPage;
