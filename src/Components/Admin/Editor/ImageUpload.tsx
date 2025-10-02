import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

const ImageUpload = ({ value, onChange, label, helperText }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(!value);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput);
      onChange(urlInput);
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setUrlInput('');
    onChange('');
    setShowUrlInput(true);
  };

  const handleReplace = () => {
    setShowUrlInput(true);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[hsl(var(--admin-text-secondary))]">
          {label}
        </label>
      )}

      {previewUrl && !showUrlInput ? (
        <div className="relative group aspect-video bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border))] rounded-lg overflow-hidden">
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleReplace}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-sm"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-rose-500/80 hover:bg-rose-500 text-white text-sm font-medium rounded-lg backdrop-blur-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-[hsl(var(--admin-border))] rounded-lg p-8 text-center hover:border-[hsl(var(--admin-brand-1))] transition-colors">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--admin-text-muted))]" />
            <p className="text-sm text-[hsl(var(--admin-text-muted))] mb-3">
              Enter image URL below
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              className="admin-input flex-1"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--admin-brand-1))] to-[hsl(var(--admin-brand-2))] hover:opacity-90 rounded-lg transition-all disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-[hsl(var(--admin-text-muted))]">{helperText}</p>
      )}
    </div>
  );
};

export default ImageUpload;
