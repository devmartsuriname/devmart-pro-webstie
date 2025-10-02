import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Upload, Plus } from 'lucide-react';
import { useState } from 'react';

interface DragDropGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const SortableImage = ({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-video bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border))] rounded-lg overflow-hidden"
    >
      <img src={url} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-white" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 bg-rose-500/80 hover:bg-rose-500 rounded-lg backdrop-blur-sm"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const DragDropGallery = ({ images, onChange }: DragDropGalleryProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.toString().split('-')[1]);
    const newIndex = parseInt(over.id.toString().split('-')[1]);

    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const handleAdd = () => {
    if (newImageUrl.trim()) {
      onChange([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Add New Image */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Enter image URL..."
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="admin-input flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--admin-brand-1))] to-[hsl(var(--admin-brand-2))] hover:opacity-90 rounded-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((_, i) => `image-${i}`)} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
                <SortableImage key={index} url={url} index={index} onRemove={() => handleRemove(index)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="border-2 border-dashed border-[hsl(var(--admin-border))] rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 mx-auto mb-3 text-[hsl(var(--admin-text-muted))]" />
          <p className="text-sm text-[hsl(var(--admin-text-muted))]">
            No images yet. Add image URLs above.
          </p>
        </div>
      )}
    </div>
  );
};

export default DragDropGallery;
