import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative bg-[hsl(var(--admin-bg-surface))] border border-[hsl(var(--admin-border))] rounded-2xl shadow-[var(--admin-shadow-lg)] max-w-md w-full p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-text-primary))] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={`mb-4 ${variant === 'danger' ? 'text-[hsl(var(--admin-error))]' : 'text-[hsl(var(--admin-warning))]'}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-[hsl(var(--admin-text-primary))] mb-2">{title}</h3>
        <p className="text-[hsl(var(--admin-text-secondary))] text-sm mb-6">{description}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="admin-btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={variant === 'danger' ? 'admin-btn-destructive' : 'admin-btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
