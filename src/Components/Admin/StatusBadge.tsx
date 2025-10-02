import { cn } from '@/lib/utils';

type Status = 'draft' | 'published' | 'archived';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    draft: 'bg-[hsl(var(--admin-text-muted))]/20 text-[hsl(var(--admin-text-secondary))]',
    published: 'bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))]',
    archived: 'bg-[hsl(var(--admin-warning))]/20 text-[hsl(var(--admin-warning))]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variants[status],
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
