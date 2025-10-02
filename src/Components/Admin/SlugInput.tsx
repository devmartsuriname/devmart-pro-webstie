import { useEffect, useState } from 'react';
import { slugify } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface SlugInputProps {
  titleField: string;
  value: string;
  onChange: (value: string) => void;
  checkUnique?: (slug: string) => Promise<boolean>;
  currentId?: string;
}

const SlugInput = ({ titleField, value, onChange, checkUnique, currentId }: SlugInputProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [manuallyEdited, setManuallyEdited] = useState(false);

  useEffect(() => {
    if (!manuallyEdited && titleField) {
      onChange(slugify(titleField));
    }
  }, [titleField, manuallyEdited]);

  useEffect(() => {
    if (!value || !checkUnique) {
      setIsUnique(null);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsChecking(true);
      const unique = await checkUnique(value);
      setIsUnique(unique);
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(debounce);
  }, [value, checkUnique]);

  const handleReset = () => {
    setManuallyEdited(false);
    onChange(slugify(titleField));
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setManuallyEdited(true);
            onChange(slugify(e.target.value));
          }}
          className="admin-input flex-1"
          placeholder="auto-generated-slug"
        />
        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-[hsl(var(--admin-text-secondary))] hover:text-[hsl(var(--admin-text-primary))] hover:bg-[hsl(var(--admin-bg-surface-elevated))] rounded-lg transition-colors"
          title="Reset to auto-generated"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {isChecking && (
        <p className="text-xs text-[hsl(var(--admin-text-muted))]">Checking availability...</p>
      )}
      
      {isUnique === false && (
        <p className="text-xs text-[hsl(var(--admin-error))]">This slug is already in use</p>
      )}
      
      {isUnique === true && (
        <p className="text-xs text-[hsl(var(--admin-success))]">Slug is available</p>
      )}
    </div>
  );
};

export default SlugInput;
