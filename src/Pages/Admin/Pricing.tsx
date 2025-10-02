import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { TableCard } from '@/Components/Admin/TableCard';
import PricingDrawer from '@/Components/Admin/PricingDrawer';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';

interface PricingPlan {
  id: string;
  title: string;
  slug: string;
  price: string;
  is_featured: boolean;
  is_active: boolean;
  order: number;
  updated_at: string;
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Pricing plan deleted successfully');
      fetchPlans();
    } catch (error: any) {
      toast.error('Failed to delete pricing plan');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleEdit = (id: string) => {
    setEditingPlan(id);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingPlan(null);
    fetchPlans();
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: string, row: PricingPlan) => (
        <div>
          <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{value}</div>
          {row.is_featured && (
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              padding: '2px 8px',
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              borderRadius: '4px',
              marginTop: '4px',
            }}>
              Featured
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
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
            Pricing Plans
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Manage your pricing tiers and features
          </p>
        </div>
        <button
          onClick={handleCreate}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          New Plan
        </button>
      </div>

      <TableCard
        columns={columns}
        data={plans}
        actions={(row) => (
          <>
            <button
              onClick={() => handleEdit(row.id)}
              style={{
                padding: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              <Trash2 style={{ width: '16px', height: '16px' }} />
            </button>
          </>
        )}
      />

      <PricingDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        planId={editingPlan}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Delete Pricing Plan"
        message="Are you sure you want to delete this pricing plan? This action cannot be undone."
      />
    </div>
  );
};

export default Pricing;
