type Status = 'draft' | 'published' | 'archived' | 'paused';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const statusConfig: Record<Status, { bg: string; text: string; border: string; dot: string }> = {
    published: {
      bg: 'bg-emerald-600/20',
      text: 'text-emerald-300',
      border: 'border-emerald-700/40',
      dot: 'bg-emerald-500',
    },
    draft: {
      bg: 'bg-slate-800',
      text: 'text-slate-300',
      border: 'border-slate-700',
      dot: 'bg-slate-500',
    },
    archived: {
      bg: 'bg-amber-600/20',
      text: 'text-amber-300',
      border: 'border-amber-700/40',
      dot: 'bg-amber-500',
    },
    paused: {
      bg: 'bg-orange-600/20',
      text: 'text-orange-300',
      border: 'border-orange-700/40',
      dot: 'bg-orange-500',
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
