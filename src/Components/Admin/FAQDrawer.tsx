import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';

const faqSchema = z.object({
  category: z.string().optional(),
  question: z.string().min(1, 'Question is required'),
  answer_rich: z.string().min(1, 'Answer is required'),
  order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type FAQForm = z.infer<typeof faqSchema>;

interface FAQDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  faqId: string | null;
}

const FAQDrawer = ({ isOpen, onClose, faqId }: FAQDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FAQForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen && faqId) {
      fetchFaq();
    } else if (isOpen) {
      reset({ order: 0, is_active: true });
    }
  }, [isOpen, faqId]);

  const fetchFaq = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('id', faqId)
        .single();

      if (error) throw error;
      reset(data);
    } catch (error: any) {
      toast.error('Failed to fetch FAQ');
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: FAQForm) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        ...data,
        updated_by: user?.id,
        ...(faqId ? {} : { created_by: user?.id }),
      };

      if (faqId) {
        const { error } = await supabase
          .from('faq')
          .update(payload)
          .eq('id', faqId);

        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        const { error } = await supabase
          .from('faq')
          .insert([payload]);

        if (error) throw error;
        toast.success('FAQ created successfully');
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
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
      }} onClick={onClose} />

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
                {faqId ? 'Edit FAQ' : 'New FAQ'}
              </h2>
              <button type="button" onClick={onClose} style={{
                padding: '8px',
                background: 'rgba(51, 65, 85, 0.5)',
                border: 'none',
                borderRadius: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
              }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Category
                </label>
                <input
                  {...register('category')}
                  placeholder="e.g., General, Pricing, Technical"
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
                  Question *
                </label>
                <input
                  {...register('question')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${errors.question ? '#ef4444' : 'rgba(51, 65, 85, 0.5)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {errors.question && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.question.message}</p>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>
                  Answer *
                </label>
                <textarea
                  {...register('answer_rich')}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${errors.answer_rich ? '#ef4444' : 'rgba(51, 65, 85, 0.5)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '120px',
                  }}
                />
                {errors.answer_rich && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.answer_rich.message}</p>
                )}
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

              <div style={{ marginBottom: '24px' }}>
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
                onClick={onClose}
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
                {faqId ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default FAQDrawer;
