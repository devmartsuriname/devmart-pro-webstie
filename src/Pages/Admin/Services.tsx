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
      {/* Page Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="text-xs text-slate-400">
          <span className="hover:text-slate-200">Home</span>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-300">Services</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Import</button>
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700">Export</button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        {/* Header with Filters */}
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Services</h2>
              <p className="text-sm text-slate-400">Manage your service offerings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {services.length === 0 ? (
            <div className="p-8">
              <EmptyState
                emoji="📋"
                title="No services found"
                description="Get started by creating your first service"
                action={{
                  label: 'Create Service',
                  onClick: handleCreate,
                }}
              />
            </div>
          ) : (
            <table className="w-full table-fixed border-collapse text-sm">
              <thead className="sticky top-16 z-10 bg-slate-800 text-slate-200">
                <tr>
                  <th className="w-2/5 border-b border-slate-700 px-3 py-2.5 text-left font-medium">Title</th>
                  <th className="w-1/5 border-b border-slate-700 px-3 py-2.5 text-left font-medium">Category</th>
                  <th className="w-1/5 border-b border-slate-700 px-3 py-2.5 text-left font-medium">Status</th>
                  <th className="w-1/5 border-b border-slate-700 px-3 py-2.5 text-left font-medium">Updated</th>
                  <th className="w-28 border-b border-slate-700 px-3 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="text-sm font-medium text-slate-100">{service.title}</div>
                      <div className="text-xs text-slate-500">/{service.slug}</div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 truncate">
                      {service.category || '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">
                      {formatDate(service.updated_at)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, id: service.id })}
                          className="inline-flex items-center gap-1 rounded-md bg-rose-600/80 px-2 py-1 text-xs text-white hover:bg-rose-600"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {services.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 p-3 text-xs text-slate-400">
            <div>Showing {services.length} services</div>
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <button className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 hover:bg-slate-700">25</button>
            </div>
          </div>
        )}
      </div>

      <ServiceDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        serviceId={editingService}
      />

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
