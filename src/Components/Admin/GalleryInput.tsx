import { useState } from 'react';
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
            className="flex-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => removeUrl(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addUrl}
        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg"
      >
        <Plus className="h-4 w-4" />
        Add Image URL
      </button>
    </div>
  );
};

export default GalleryInput;
