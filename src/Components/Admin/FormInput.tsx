import { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

const FormInput = ({ label, required, error, helperText, children }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[hsl(var(--admin-text-secondary))]">
        {label} {required && <span className="text-[hsl(var(--admin-error))] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[hsl(var(--admin-error))] flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-[hsl(var(--admin-text-muted))]">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;
