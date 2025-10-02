import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import StatusBadge from '@/Components/Admin/StatusBadge';
import EmptyState from '@/Components/Admin/EmptyState';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import ServiceDrawer from '@/Components/Admin/ServiceDrawer';
import { formatDate } from '@/lib/utils';

type Service = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: 'draft' | 'published' | 'archived';
  updated_at: string;
  deleted_at: string | null;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchServices();
  }, [search, statusFilter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('services')
        .select('id, title, slug, category, status, updated_at, deleted_at')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Service deleted');
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: archived ? 'archived' : 'draft' })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(archived ? 'Service archived' : 'Service restored');
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (id: string) => {
    setEditingService(id);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingService(null);
    fetchServices();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[hsl(var(--admin-text-primary))]">Services</h1>
        </div>
        <div className="admin-card p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="admin-skeleton h-4 rounded w-1/4"></div>
                  <div className="admin-skeleton h-3 rounded w-1/2"></div>
                </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--admin-text-primary))]">Services</h1>
        <button
          onClick={handleCreate}
          className="admin-btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Service
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-text-muted))]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="admin-input w-full pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        {services.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="No services found"
            description="Get started by creating your first service"
            action={{
              label: 'Create Service',
              onClick: handleCreate,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="admin-table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="admin-table-row">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[hsl(var(--admin-text-primary))]">{service.title}</div>
                      <div className="text-xs text-[hsl(var(--admin-text-secondary))]">/{service.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[hsl(var(--admin-text-primary))]">{service.category || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-[hsl(var(--admin-text-secondary))]">
                      {formatDate(service.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service.id)}
                          className="p-2 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-brand-1))] hover:bg-[hsl(var(--admin-bg-surface-elevated))] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(service.id, service.status !== 'archived')}
                          className="p-2 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-warning))] hover:bg-[hsl(var(--admin-warning))]/10 rounded-lg transition-colors"
                          title={service.status === 'archived' ? 'Restore' : 'Archive'}
                        >
                          {service.status === 'archived' ? (
                            <ArchiveRestore className="h-4 w-4" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: service.id })}
                          className="p-2 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error))]/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      <ServiceDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        serviceId={editingService}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Services;
