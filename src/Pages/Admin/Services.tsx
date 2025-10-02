import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff, Pause, Play, ExternalLink } from 'lucide-react';
import StatusBadge from '@/Components/Admin/StatusBadge';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import SearchFilter from '@/Components/Admin/SearchFilter';
import BulkActions from '@/Components/Admin/BulkActions';

type Service = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: 'draft' | 'published' | 'archived' | 'paused';
  updated_at: string;
  deleted_at: string | null;
};

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: '',
    category: '',
  });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [services, searchQuery, filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, category, status, updated_at, deleted_at')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...services];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.slug.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((s) => s.category === filters.category);
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (id: string, newStatus: Service['status']) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Service ${newStatus}`);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkStatusChange = async (newStatus: Service['status']) => {
    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null })
        .in('id', ids);

      if (error) throw error;
      
      toast.success(`${ids.length} service(s) ${newStatus}`);
      setSelectedIds(new Set());
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Service deleted successfully');
      setDeleteDialog({ isOpen: false, id: null });
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedIds);
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .in('id', ids);

      if (error) throw error;
      
      toast.success(`${ids.length} service(s) deleted`);
      setSelectedIds(new Set());
      setBulkDeleteDialog(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredServices.map((s) => ({
      Title: s.title,
      Slug: s.slug,
      Category: s.category || '',
      Status: s.status,
      'Updated At': new Date(s.updated_at).toLocaleString(),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(','),
      ...csvData.map((row) =>
        headers.map((h) => `"${row[h as keyof typeof row]}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `services-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedServices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedServices.map((s) => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleEdit = (service: Service) => {
    navigate(`/admin/services/${service.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/services/new');
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 admin-skeleton rounded-lg" />
        <div className="admin-card p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 admin-skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--admin-text-primary))] tracking-tight">Services</h1>
          <p className="text-sm text-[hsl(var(--admin-text-muted))] mt-1.5">Manage your service offerings and solutions</p>
        </div>
        <button
          onClick={handleCreate}
          className="admin-btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Service
        </button>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchPlaceholder="Search services..."
        onSearchChange={setSearchQuery}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'paused', label: 'Paused' },
              { value: 'archived', label: 'Archived' },
            ],
          },
          {
            key: 'category',
            label: 'Category',
            options: categories.map((cat) => ({ value: cat!, label: cat! })),
          },
        ]}
        activeFilters={filters}
        onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
        onClearFilters={() => setFilters({ status: '', category: '' })}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.size}
        onPublish={() => handleBulkStatusChange('published')}
        onUnpublish={() => handleBulkStatusChange('draft')}
        onPause={() => handleBulkStatusChange('paused')}
        onResume={() => handleBulkStatusChange('published')}
        onDelete={() => setBulkDeleteDialog(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-elevated))]">
                <th className="px-5 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedServices.length && paginatedServices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-input))] text-[hsl(var(--admin-primary))] focus:ring-2 focus:ring-[hsl(var(--admin-primary))]/40 focus:ring-offset-0 transition-all"
                  />
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">
                  Title
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-[hsl(var(--admin-text-muted))] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--admin-border-subtle))]">
              {paginatedServices.map((service) => (
                <tr key={service.id} className="hover:bg-[hsl(var(--admin-bg-elevated))] transition-all duration-200 group">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(service.id)}
                      onChange={() => toggleSelect(service.id)}
                      className="rounded border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-input))] text-[hsl(var(--admin-primary))] focus:ring-2 focus:ring-[hsl(var(--admin-primary))]/40 focus:ring-offset-0 transition-all"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <div className="font-medium text-[hsl(var(--admin-text-primary))]">{service.title}</div>
                      <div className="text-xs text-[hsl(var(--admin-text-muted))] mt-0.5">/{service.slug}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[hsl(var(--admin-text-secondary))]">{service.category || '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[hsl(var(--admin-text-muted))]">
                      {new Date(service.updated_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <a
                        href={`/services/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-elevated))] px-2.5 py-1.5 text-xs font-medium text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-bg-hover))] hover:text-[hsl(var(--admin-text-primary))] transition-all duration-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Preview
                      </a>
                      
                      {service.status === 'published' ? (
                        <button
                          onClick={() => handleStatusChange(service.id, 'draft')}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-elevated))] px-2.5 py-1.5 text-xs font-medium text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-bg-hover))] transition-all duration-200"
                          title="Unpublish"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                        </button>
                      ) : service.status === 'paused' ? (
                        <button
                          onClick={() => handleStatusChange(service.id, 'published')}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-[hsl(var(--admin-primary-soft))] px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                          title="Resume"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusChange(service.id, 'published')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-[hsl(var(--admin-success-soft))] px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                            title="Publish"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(service.id, 'paused')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-[hsl(var(--admin-warning-soft))] px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all duration-200"
                            title="Pause"
                          >
                            <Pause className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleEdit(service)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-elevated))] px-2.5 py-1.5 text-xs font-medium text-[hsl(var(--admin-text-secondary))] hover:bg-[hsl(var(--admin-bg-hover))] hover:text-[hsl(var(--admin-text-primary))] transition-all duration-200"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: service.id })}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--admin-error))] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[hsl(var(--admin-error))]/90 transition-all duration-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[hsl(var(--admin-border-subtle))] bg-[hsl(var(--admin-bg-elevated))]">
            <div className="text-sm text-[hsl(var(--admin-text-muted))]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{' '}
              {filteredServices.length} services
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="admin-btn-secondary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-[hsl(var(--admin-text-secondary))] px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="admin-btn-secondary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {paginatedServices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[hsl(var(--admin-text-muted))] text-sm">No services found</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={bulkDeleteDialog}
        onClose={() => setBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Services"
        description={`Are you sure you want to delete ${selectedIds.size} service(s)? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
      />
    </div>
  );
};

export default Services;
