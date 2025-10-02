import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TableCard } from '@/Components/Admin/TableCard';
import StatusBadge from '@/Components/Admin/StatusBadge';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import ProjectDrawer from '@/Components/Admin/ProjectDrawer';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success('Project deleted successfully');
      setDeleteDialog({ isOpen: false, id: null });
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project.id);
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      className: 'w-1/3',
      render: (value: string) => (
        <div className="font-medium text-slate-100">{value}</div>
      )
    },
    { key: 'category', label: 'Category', className: 'w-1/6' },
    { key: 'client', label: 'Client', className: 'w-1/6' },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'w-1/6',
      render: (value: string) => <StatusBadge status={value} />
    },
    { 
      key: 'updated_at', 
      label: 'Updated', 
      className: 'w-1/6',
      render: (value: string) => (
        <span className="text-slate-400">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your portfolio projects and case studies</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Table */}
      <TableCard
        title="All Projects"
        description={`${projects.length} total project${projects.length !== 1 ? 's' : ''}`}
        columns={columns}
        data={projects}
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => setDeleteDialog({ isOpen: true, id: row.id })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600/90 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      />

      <ProjectDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        projectId={editingProject}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={() => deleteDialog.id && handleDelete(deleteDialog.id)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Projects;
