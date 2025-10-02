import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon: Icon, emoji, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && <Icon className="h-12 w-12 text-[hsl(var(--admin-text-muted))] mb-4" />}
      {emoji && <span className="text-5xl mb-4 opacity-50">{emoji}</span>}
      
      <h3 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--admin-text-secondary))] text-center max-w-sm mb-6">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="admin-btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
