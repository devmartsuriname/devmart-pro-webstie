import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { SlugInput } from './SlugInput';

const pricingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  features_included: z.array(z.string()).default([]),
  features_excluded: z.array(z.string()).default([]),
  cta_label: z.string().default('Get Started'),
  cta_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  order: z.number().default(0),
});

type PricingForm = z.infer<typeof pricingSchema>;

interface PricingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
}

const PricingDrawer = ({ isOpen, onClose, planId }: PricingDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [includedFeature, setIncludedFeature] = useState('');
  const [excludedFeature, setExcludedFeature] = useState('');

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, watch } = useForm<PricingForm>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      features_included: [],
      features_excluded: [],
      cta_label: 'Get Started',
      is_featured: false,
      is_active: true,
      order: 0,
    },
  });

  const featuresIncluded = watch('features_included') || [];
  const featuresExcluded = watch('features_excluded') || [];

  useEffect(() => {
    if (isOpen && planId) {
      fetchPlan();
    } else if (isOpen) {
      reset({
        features_included: [],
        features_excluded: [],
        cta_label: 'Get Started',
        is_featured: false,
        is_active: true,
        order: 0,
      });
    }
  }, [isOpen, planId]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const fetchPlan = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      reset(data);
    } catch (error: any) {
      toast.error('Failed to fetch plan');
    } finally {
      setFetching(false);
    }
  };

  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('id')
      .eq('slug', slug)
      .neq('id', planId || '');

    return !data || data.length === 0;
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    onClose();
  };

  const onSubmit = async (data: PricingForm) => {
    setLoading(true);
    try {
      const isUnique = await checkSlugUnique(data.slug);
      if (!isUnique) {
        toast.error('Slug already exists');
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        ...data,
        updated_by: user?.id,
        ...(planId ? {} : { created_by: user?.id }),
      };

      if (planId) {
        const { error } = await supabase
          .from('pricing_plans')
          .update(payload)
          .eq('id', planId);

        if (error) throw error;
        toast.success('Plan updated successfully');
      } else {
        const { error } = await supabase
          .from('pricing_plans')
          .insert([payload]);

        if (error) throw error;
        toast.success('Plan created successfully');
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const addIncludedFeature = () => {
    if (includedFeature.trim()) {
      setValue('features_included', [...featuresIncluded, includedFeature.trim()], { shouldDirty: true });
      setIncludedFeature('');
    }
  };

  const removeIncludedFeature = (index: number) => {
    setValue('features_included', featuresIncluded.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const addExcludedFeature = () => {
    if (excludedFeature.trim()) {
      setValue('features_excluded', [...featuresExcluded, excludedFeature.trim()], { shouldDirty: true });
      setExcludedFeature('');
    }
  };

  const removeExcludedFeature = (index: number) => {
    setValue('features_excluded', featuresExcluded.filter((_, i) => i !== index), { shouldDirty: true });
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
      }} onClick={handleClose} />

      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '600px',
        maxWidth: '100vw',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5)',
        zIndex: 51,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out',
      }}>
        {fetching ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 style={{ width: '32px', height: '32px', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
                {planId ? 'Edit Plan' : 'New Plan'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '8px',
                  background: 'rgba(51, 65, 85, 0.5)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Title *
                </label>
                <input
                  {...register('title')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${errors.title ? '#ef4444' : 'rgba(51, 65, 85, 0.5)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {errors.title && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.title.message}</p>
                )}
              </div>

              <SlugInput
                value={watch('slug') || ''}
                onChange={(value) => setValue('slug', value, { shouldDirty: true })}
                onGenerate={(title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                sourceValue={watch('title')}
                error={errors.slug?.message}
                checkUnique={checkSlugUnique}
              />

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Subtitle
                </label>
                <input
                  {...register('subtitle')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Price * <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>(e.g., ₹999/mo)</span>
                </label>
                <input
                  {...register('price')}
                  placeholder="₹999/mo"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${errors.price ? '#ef4444' : 'rgba(51, 65, 85, 0.5)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {errors.price && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.price.message}</p>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Included Features
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    value={includedFeature}
                    onChange={(e) => setIncludedFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludedFeature())}
                    placeholder="Add a feature"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '10px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={addIncludedFeature}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {featuresIncluded.map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '8px',
                    }}>
                      <span style={{ color: '#4ade80', fontSize: '14px' }}>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeIncludedFeature(index)}
                        style={{
                          padding: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Excluded Features
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    value={excludedFeature}
                    onChange={(e) => setExcludedFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcludedFeature())}
                    placeholder="Add a feature"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '10px',
                      color: '#f1f5f9',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={addExcludedFeature}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {featuresExcluded.map((feature, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(100, 116, 139, 0.1)',
                      borderRadius: '8px',
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeExcludedFeature(index)}
                        style={{
                          padding: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  CTA Label
                </label>
                <input
                  {...register('cta_label')}
                  placeholder="Get Started"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  CTA URL
                </label>
                <input
                  {...register('cta_url')}
                  placeholder="/contact"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>Featured Plan</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>Active</span>
                </label>
              </div>
            </div>

            <div style={{
              padding: '24px',
              borderTop: '1px solid rgba(51, 65, 85, 0.5)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(51, 65, 85, 0.5)',
                  color: '#f1f5f9',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loading && <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
                {planId ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default PricingDrawer;
