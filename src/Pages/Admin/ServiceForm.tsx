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
    <div className="min-h-screen bg-[hsl(var(--admin-bg-base))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--admin-border-subtle))] bg-[hsl(var(--admin-bg-elevated))]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/services"
              className="flex items-center gap-2 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Services</span>
            </Link>
            <div className="w-px h-6 bg-[hsl(var(--admin-border-subtle))]" />
            <h1 className="text-xl font-semibold text-[hsl(var(--admin-text-primary))]">
              {id ? 'Edit Service' : 'Create Service'}
            </h1>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#7CFF6B] hover:bg-[#6be85a] text-[#0a0a0a] font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Service Details Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-1">Service Details</h2>
              <p className="text-sm text-[hsl(var(--admin-text-muted))]">Configure the service information and content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Service Title" required error={errors.title?.message}>
                <input 
                  {...register('title')} 
                  type="text" 
                  className="admin-input" 
                  placeholder="Enter service title" 
                />
              </FormInput>

              <FormInput 
                label="URL Slug" 
                required 
                error={errors.slug?.message}
                helperText="Will be used in URLs: /services/your-slug"
              >
                <SlugInput
                  titleField={titleValue}
                  value={slugValue}
                  onChange={(value) => setValue('slug', value)}
                  checkUnique={checkSlugUnique}
                  currentId={id}
                  placeholder="url-friendly-slug"
                />
              </FormInput>
            </div>

            <FormInput label="Status">
              <Select value={currentStatus} onValueChange={(value) => setValue('status', value as ServiceFormData['status'], { shouldDirty: true })}>
                <SelectTrigger className="admin-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </FormInput>

            <FormInput 
              label="Service Excerpt" 
              error={errors.short_desc?.message}
              helperText="This short description will appear in service listings and search results."
            >
              <textarea 
                {...register('short_desc')} 
                rows={4} 
                maxLength={280} 
                className="admin-input resize-none" 
                placeholder="Brief description of the service for listings and previews" 
              />
            </FormInput>

            <FormInput label="Service Content" helperText="Detailed service description with rich formatting">
              <RichTextEditor
                content={contentValue || ''}
                onChange={(value) => setValue('content_richtext', value, { shouldDirty: true })}
              />
            </FormInput>
          </div>

          {/* Additional Options Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-1">Additional Options</h2>
              <p className="text-sm text-[hsl(var(--admin-text-muted))]">Category, pricing, and display settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Service Category" helperText="Helps organize services">
                <input
                  {...register('category')}
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Marketing, Development"
                />
              </FormInput>

              <FormInput label="Starting Price" helperText="Optional starting price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--admin-text-muted))]">₹</span>
                  <input
                    {...register('price_from', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="admin-input pl-8"
                    placeholder="999.00"
                  />
                </div>
              </FormInput>
            </div>

            <FormInput label="Display Order" helperText="Lower numbers appear first">
              <input 
                {...register('order', { valueAsNumber: true })} 
                type="number" 
                min="0" 
                className="admin-input w-32" 
                placeholder="0" 
              />
            </FormInput>
          </div>

          {/* SEO Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-1">SEO Settings</h2>
              <p className="text-sm text-[hsl(var(--admin-text-muted))]">Optimize for search engines.</p>
            </div>

            <FormInput label="SEO Title" helperText="Custom title for search engines (leave blank to use service title)">
              <input 
                {...register('seo_title')} 
                type="text" 
                maxLength={60} 
                className="admin-input" 
                placeholder="SEO-optimized title" 
              />
            </FormInput>

            <FormInput 
              label="Meta Description" 
              error={errors.seo_description?.message} 
              helperText={`${watch('seo_description')?.length || 0}/160 characters`}
            >
              <textarea 
                {...register('seo_description')} 
                rows={3} 
                maxLength={160} 
                className="admin-input resize-none" 
                placeholder="Brief description for search results..." 
              />
            </FormInput>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormPage;
