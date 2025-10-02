import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, ExternalLink, Settings, Tag, Link as LinkIcon, Copy, Check } from 'lucide-react';
import EditorHeader from '@/Components/Admin/Editor/EditorHeader';
import EditorLayout from '@/Components/Admin/Editor/EditorLayout';
import SidebarCard from '@/Components/Admin/Editor/SidebarCard';
import FormInput from '@/Components/Admin/FormInput';
import SlugInput from '@/Components/Admin/SlugInput';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import DragDropFeatures from '@/Components/Admin/Editor/DragDropFeatures';
import DragDropGallery from '@/Components/Admin/Editor/DragDropGallery';
import ImageUpload from '@/Components/Admin/Editor/ImageUpload';
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [urlCopied, setUrlCopied] = useState(false);

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
  const galleryValue = watch('gallery_urls') || [];
  const featuresValue = watch('features') || [];
  const currentStatus = watch('status');
  const contentValue = watch('content_richtext');
  const heroImageValue = watch('hero_image');
  const iconValue = watch('icon_url');

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handlePreview = () => {
    if (slugValue) {
      window.open(`/services/${slugValue}`, '_blank');
    }
  };

  const copyUrl = async () => {
    if (slugValue) {
      await navigator.clipboard.writeText(`${window.location.origin}/services/${slugValue}`);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
      toast.success('URL copied to clipboard');
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

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Services', href: '/admin/services' },
    { label: id ? 'Edit' : 'New' },
  ];

  const basicsTab = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput label="Service Title" required error={errors.title?.message}>
        <input {...register('title')} type="text" className="admin-input" placeholder="e.g. Digital Marketing Services" />
      </FormInput>

      <FormInput label="Short Description" helperText={`${watch('short_desc')?.length || 0}/280 characters`} error={errors.short_desc?.message}>
        <textarea {...register('short_desc')} rows={3} maxLength={280} className="admin-input" placeholder="Brief overview for cards and listings..." />
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

      <FormInput label="Key Features" helperText="Drag to reorder features">
        <DragDropFeatures
          features={featuresValue}
          onChange={(features) => setValue('features', features, { shouldDirty: true })}
        />
      </FormInput>
    </form>
  );

  const contentTab = (
    <div className="space-y-6">
      <FormInput label="Full Description" helperText="Rich content with formatting, images, and links">
        <RichTextEditor
          content={contentValue || ''}
          onChange={(value) => setValue('content_richtext', value, { shouldDirty: true })}
        />
      </FormInput>
    </div>
  );

  const mediaTab = (
    <div className="space-y-6">
      <FormInput label="Hero Image" helperText="Main featured image for the service">
        <ImageUpload
          value={heroImageValue}
          onChange={(url) => setValue('hero_image', url, { shouldDirty: true })}
        />
      </FormInput>

      <FormInput label="Service Icon" helperText="Icon or logo for the service">
        <ImageUpload
          value={iconValue}
          onChange={(url) => setValue('icon_url', url, { shouldDirty: true })}
        />
      </FormInput>

      <FormInput label="Gallery" helperText="Additional showcase images (drag to reorder)">
        <DragDropGallery
          images={galleryValue}
          onChange={(urls) => setValue('gallery_urls', urls, { shouldDirty: true })}
        />
      </FormInput>
    </div>
  );

  const seoTab = (
    <div className="space-y-6">
      <FormInput label="SEO Title" helperText="Custom title for search engines (leave blank to use service title)">
        <input {...register('seo_title')} type="text" maxLength={60} className="admin-input" placeholder="SEO-optimized title" />
      </FormInput>

      <FormInput label="Meta Description" error={errors.seo_description?.message} helperText={`${watch('seo_description')?.length || 0}/160 characters`}>
        <textarea {...register('seo_description')} rows={3} maxLength={160} className="admin-input" placeholder="Brief description for search results..." />
      </FormInput>

      {(watch('seo_title') || titleValue) && (
        <div className="p-4 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-lg">
          <p className="text-xs text-[hsl(var(--admin-text-muted))] mb-2">Google Preview</p>
          <div className="space-y-1">
            <p className="text-blue-500 text-lg">{watch('seo_title') || titleValue}</p>
            <p className="text-emerald-600 text-xs">{window.location.origin}/services/{slugValue}</p>
            <p className="text-sm text-[hsl(var(--admin-text-muted))]">
              {watch('seo_description') || watch('short_desc') || 'No description provided'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const sidebar = (
    <>
      <SidebarCard title="Status & Visibility" icon={<Settings className="h-4 w-4 text-[hsl(var(--admin-brand-1))]" />}>
        <FormInput label="Publication Status">
          <Select value={currentStatus} onValueChange={(value) => handleStatusChange(value as ServiceFormData['status'])}>
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
      </SidebarCard>

      <SidebarCard title="Category" icon={<Tag className="h-4 w-4 text-[hsl(var(--admin-brand-1))]" />}>
        <FormInput label="Service Category" helperText="Helps organize services">
          <input
            {...register('category')}
            type="text"
            className="admin-input"
            placeholder="e.g. Marketing, Development"
          />
        </FormInput>
      </SidebarCard>

      <SidebarCard title="Slug & URL" icon={<LinkIcon className="h-4 w-4 text-[hsl(var(--admin-brand-1))]" />}>
        <FormInput label="URL Slug" required error={errors.slug?.message}>
          <SlugInput
            titleField={titleValue}
            value={slugValue}
            onChange={(value) => setValue('slug', value)}
            checkUnique={checkSlugUnique}
            currentId={id}
          />
        </FormInput>
        
        {slugValue && (
          <div className="flex items-center gap-2 p-3 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-lg">
            <ExternalLink className="h-3.5 w-3.5 text-[hsl(var(--admin-text-muted))] flex-shrink-0" />
            <span className="text-xs text-[hsl(var(--admin-text-muted))] truncate flex-1">
              /services/{slugValue}
            </span>
            <button
              type="button"
              onClick={copyUrl}
              className="p-1 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] transition-colors"
            >
              {urlCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </SidebarCard>

      <SidebarCard title="Display Options" icon={<Eye className="h-4 w-4 text-[hsl(var(--admin-brand-1))]" />}>
        <FormInput label="Display Order" helperText="Lower numbers appear first">
          <input {...register('order', { valueAsNumber: true })} type="number" min="0" className="admin-input" placeholder="0" />
        </FormInput>
      </SidebarCard>
    </>
  );

  return (
    <>
      <EditorHeader
        breadcrumbs={breadcrumbs}
        title={id ? 'Edit Service' : 'Create New Service'}
        onSaveDraft={handleSubmit(onSubmit)}
        onPublish={() => handleStatusChange(currentStatus === 'published' ? 'draft' : 'published')}
        onPreview={slugValue ? handlePreview : undefined}
        onPause={() => handleStatusChange('paused')}
        status={currentStatus}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        loading={loading}
      />
      
      <EditorLayout
        tabs={[
          { id: 'basics', label: 'Basics', content: basicsTab },
          { id: 'content', label: 'Content', content: contentTab },
          { id: 'media', label: 'Media', content: mediaTab },
          { id: 'seo', label: 'SEO', content: seoTab },
        ]}
        sidebar={sidebar}
        defaultTab="basics"
      />
    </>
  );
};

export default ServiceFormPage;
