import { useEffect, useState } from 'react';
import { slugify } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

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
          className="flex-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="auto-generated-slug"
        />
        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Reset to auto-generated"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {isChecking && (
        <p className="text-xs text-gray-500">Checking availability...</p>
      )}
      
      {isUnique === false && (
        <p className="text-xs text-red-600">This slug is already in use</p>
      )}
      
      {isUnique === true && (
        <p className="text-xs text-green-600">Slug is available</p>
      )}
    </div>
  );
};

export default SlugInput;
