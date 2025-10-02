import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { TableCard } from '@/Components/Admin/TableCard';
import FAQDrawer from '@/Components/Admin/FAQDrawer';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';

interface FAQ {
  id: string;
  question: string;
  category: string | null;
  is_active: boolean;
  order: number;
  updated_at: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('FAQ deleted successfully');
      fetchFaqs();
    } catch (error: any) {
      toast.error('Failed to delete FAQ');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (value: string) => (
        <div style={{ fontWeight: '600', color: '#f1f5f9', maxWidth: '400px' }}>{value}</div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string | null) => value || 'General',
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value: boolean) => (
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          background: value ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
          color: value ? '#4ade80' : '#94a3b8',
        }}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'order',
      label: 'Order',
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '8px',
          }}>
            FAQ
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={() => { setEditingFaq(null); setDrawerOpen(true); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.2s',
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          New FAQ
        </button>
      </div>

      <TableCard
        columns={columns}
        data={faqs}
        actions={(row) => (
          <>
            <button
              onClick={() => { setEditingFaq(row.id); setDrawerOpen(true); }}
              style={{
                padding: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Pencil style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={() => setDeleteDialog({ open: true, id: row.id })}
              style={{
                padding: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Trash2 style={{ width: '16px', height: '16px' }} />
            </button>
          </>
        )}
      />

      <FAQDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); fetchFaqs(); }}
        faqId={editingFaq}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default FAQ;
