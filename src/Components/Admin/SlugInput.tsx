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
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="auto-generated-slug"
        />
        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset to auto-generated"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {isChecking && (
        <p className="text-xs text-slate-500">Checking availability...</p>
      )}
      
      {isUnique === false && (
        <p className="text-xs text-rose-400">This slug is already in use</p>
      )}
      
      {isUnique === true && (
        <p className="text-xs text-emerald-400">Slug is available</p>
      )}
    </div>
  );
};

export default SlugInput;
