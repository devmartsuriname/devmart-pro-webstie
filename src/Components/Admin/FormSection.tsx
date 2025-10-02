import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  children: ReactNode;
}

const FormSection = ({ title, color = 'blue', children }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[hsl(var(--admin-border-subtle))]">
        <h2 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))]">
          {title}
        </h2>
      </div>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
