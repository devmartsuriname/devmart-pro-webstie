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
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-400"></span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;
