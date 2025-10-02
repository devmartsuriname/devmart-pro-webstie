import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  children: ReactNode;
}

const colorMap = {
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20',
  rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20',
};

const accentMap = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

const FormSection = ({ title, color = 'blue', children }: FormSectionProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className={`h-1.5 w-1.5 ${accentMap[color]} rounded-full animate-pulse`}></div>
          <h3 className="text-base font-semibold text-[hsl(var(--admin-text-primary))] tracking-tight">
            {title}
          </h3>
        </div>
        <div className="space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormSection;
