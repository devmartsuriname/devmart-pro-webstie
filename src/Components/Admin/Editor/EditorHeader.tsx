import { ArrowLeft, Eye, Save, MoreVertical, Loader2, Check, Pause, Copy, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onPause?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  status: 'draft' | 'published' | 'paused' | 'archived';
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date | null;
  loading?: boolean;
}

const EditorHeader = ({
  breadcrumbs,
  title,
  onSaveDraft,
  onPublish,
  onPreview,
  onPause,
  onDuplicate,
  onDelete,
  status,
  saveStatus,
  lastSaved,
  loading
}: EditorHeaderProps) => {
  const getTimeAgo = () => {
    if (!lastSaved) return '';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="sticky top-0 z-50 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg-base))]/95 backdrop-blur-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Title */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to={breadcrumbs[breadcrumbs.length - 2]?.href || '/admin'}
              className="p-2 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-bg-elevated))] rounded-lg transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div className="min-w-0">
              <nav className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-muted))] mb-1">
                {breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span>/</span>}
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-[hsl(var(--admin-text-primary))]">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[hsl(var(--admin-text-secondary))]">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
              <h1 className="text-xl font-bold text-[hsl(var(--admin-text-primary))] truncate">
                {title}
              </h1>
            </div>
          </div>

          {/* Right: Actions & Status */}
          <div className="flex items-center gap-3">
            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <div className="flex items-center gap-2 text-xs text-[hsl(var(--admin-text-muted))] px-3 py-1.5 rounded-lg bg-[hsl(var(--admin-bg-elevated))]">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Saved {getTimeAgo()}</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <span className="text-rose-400">Save failed</span>
                )}
              </div>
            )}

            {/* Preview Button */}
            {onPreview && (
              <button
                onClick={onPreview}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--admin-text-secondary))] bg-[hsl(var(--admin-bg-elevated))] hover:bg-[hsl(var(--admin-bg-hover))] border border-[hsl(var(--admin-border))] rounded-lg transition-all"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            )}

            {/* Save Draft Button */}
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--admin-text-primary))] bg-[hsl(var(--admin-bg-elevated))] hover:bg-[hsl(var(--admin-bg-hover))] border border-[hsl(var(--admin-border))] rounded-lg transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
            )}

            {/* Publish/Unpublish Button */}
            {onPublish && (
              <button
                onClick={onPublish}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--admin-brand-1))] to-[hsl(var(--admin-brand-2))] hover:opacity-90 rounded-lg transition-all disabled:opacity-50"
              >
                {status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
            )}

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-bg-elevated))] rounded-lg transition-all">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
                {onPause && status === 'published' && (
                  <>
                    <DropdownMenuItem onClick={onPause} className="text-amber-400">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-rose-400">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
