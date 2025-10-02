import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  children: ReactNode;
}

const colorMap = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

const FormSection = ({ title, color = 'blue', children }: FormSectionProps) => {
  return (
    <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
        <div className={`h-8 w-1 ${colorMap[color]} rounded-full`}></div>
        <h3 className="text-base font-semibold text-slate-100">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

export default FormSection;
