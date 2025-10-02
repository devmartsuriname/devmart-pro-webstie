import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date | null;
}

const SaveIndicator = ({ status, lastSaved }: SaveIndicatorProps) => {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      
      if (seconds < 5) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        setTimeAgo(`${mins}m ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      {status === 'saving' && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          <span className="text-slate-400">Saving...</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">
            Saved {timeAgo && `• ${timeAgo}`}
          </span>
        </>
      )}
      
      {status === 'error' && (
        <span className="text-rose-400">Save failed</span>
      )}
    </div>
  );
};

export default SaveIndicator;
