import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'url';
  value: any;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  disabled?: boolean;
  helperText?: string;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  options,
  rows = 4,
  disabled,
  helperText,
}: FormFieldProps) => {
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: `1px solid ${error ? '#ef4444' : 'rgba(51, 65, 85, 0.5)'}`,
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '8px',
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={name} style={labelStyle}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : 'rgba(51, 65, 85, 0.5)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={inputStyle}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : 'rgba(51, 65, 85, 0.5)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#6366f1',
            }}
          />
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>{placeholder || label}</span>
        </label>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? e.target.valueAsNumber || null : e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : 'rgba(51, 65, 85, 0.5)';
            e.target.style.boxShadow = 'none';
          }}
        />
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <AlertCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '500' }}>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', margin: 0 }}>{helperText}</p>
      )}
    </div>
  );
};
