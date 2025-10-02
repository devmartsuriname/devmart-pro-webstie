import { cn } from '@/lib/utils';

type Status = 'draft' | 'published' | 'archived';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-amber-100 text-amber-700',
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
