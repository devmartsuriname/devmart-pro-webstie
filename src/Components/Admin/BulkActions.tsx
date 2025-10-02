import { Trash2, Eye, EyeOff, Pause, Play, FileDown } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onDelete?: () => void;
  onExportCSV?: () => void;
}

const BulkActions = ({
  selectedCount,
  onPublish,
  onUnpublish,
  onPause,
  onResume,
  onDelete,
  onExportCSV,
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
      <span className="text-sm text-slate-300 font-medium">
        {selectedCount} selected
      </span>
      
      <div className="h-4 w-px bg-slate-700 mx-2" />
      
      {onPublish && (
        <button
          onClick={onPublish}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-600/20 border border-emerald-700/40 rounded-lg hover:bg-emerald-600/30 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Publish
        </button>
      )}
      
      {onUnpublish && (
        <button
          onClick={onUnpublish}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <EyeOff className="h-3.5 w-3.5" />
          Unpublish
        </button>
      )}
      
      {onPause && (
        <button
          onClick={onPause}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-600/20 border border-amber-700/40 rounded-lg hover:bg-amber-600/30 transition-colors"
        >
          <Pause className="h-3.5 w-3.5" />
          Pause
        </button>
      )}
      
      {onResume && (
        <button
          onClick={onResume}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-600/20 border border-blue-700/40 rounded-lg hover:bg-blue-600/30 transition-colors"
        >
          <Play className="h-3.5 w-3.5" />
          Resume
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-rose-600/90 rounded-lg hover:bg-rose-600 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      )}
      
      {onExportCSV && (
        <button
          onClick={onExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors ml-auto"
        >
          <FileDown className="h-3.5 w-3.5" />
          Export CSV
        </button>
      )}
    </div>
  );
};

export default BulkActions;
