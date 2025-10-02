import { ReactNode } from 'react';

interface SidebarCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const SidebarCard = ({ title, icon, children }: SidebarCardProps) => {
  return (
    <div className="bg-[hsl(var(--admin-bg-card))] border border-[hsl(var(--admin-border-subtle))] rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[hsl(var(--admin-border-subtle))]">
        {icon}
        <h3 className="text-sm font-semibold text-[hsl(var(--admin-text-primary))] uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SidebarCard;
