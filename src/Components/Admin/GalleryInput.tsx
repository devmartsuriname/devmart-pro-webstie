import { Plus, Trash2 } from 'lucide-react';

interface GalleryInputProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

const GalleryInput = ({ value = [], onChange }: GalleryInputProps) => {
  const addUrl = () => {
    onChange([...value, '']);
  };

  const removeUrl = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, url: string) => {
    const newUrls = [...value];
    newUrls[index] = url;
    onChange(newUrls);
  };

  return (
    <div className="space-y-2">
      {value.map((url, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => updateUrl(index, e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="admin-input flex-1"
          />
          <button
            type="button"
            onClick={() => removeUrl(index)}
            className="p-2 text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error))]/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addUrl}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--admin-brand-1))] hover:bg-[hsl(var(--admin-brand-1))]/10 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Image URL
      </button>
    </div>
  );
};

export default GalleryInput;
