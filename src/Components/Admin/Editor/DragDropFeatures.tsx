import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface Feature {
  title: string;
  description?: string;
}

interface DragDropFeaturesProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}

const SortableFeature = ({ feature, index, onRemove }: { feature: Feature; index: number; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `feature-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-4 bg-[hsl(var(--admin-bg-elevated))] border border-[hsl(var(--admin-border-subtle))] rounded-lg group hover:border-[hsl(var(--admin-border))] transition-all"
    >
      <button
        type="button"
        className="mt-1 p-1 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-text-primary))] cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[hsl(var(--admin-text-primary))] text-sm">{feature.title}</div>
        {feature.description && (
          <div className="text-xs text-[hsl(var(--admin-text-muted))] mt-1">{feature.description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-[hsl(var(--admin-text-muted))] hover:text-[hsl(var(--admin-error))] hover:bg-[hsl(var(--admin-error-soft))] rounded transition-all"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

const DragDropFeatures = ({ features, onChange }: DragDropFeaturesProps) => {
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });

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

    onChange(arrayMove(features, oldIndex, newIndex));
  };

  const handleAdd = () => {
    if (newFeature.title.trim()) {
      onChange([...features, newFeature]);
      setNewFeature({ title: '', description: '' });
    }
  };

  const handleRemove = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Add New Feature */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Feature title"
          value={newFeature.title}
          onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="admin-input"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newFeature.description}
          onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="admin-input"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[hsl(var(--admin-brand-1))] bg-[hsl(var(--admin-brand-1))]/10 hover:bg-[hsl(var(--admin-brand-1))]/20 border border-[hsl(var(--admin-brand-1))]/30 rounded-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>

      {/* Feature List */}
      {features.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={features.map((_, i) => `feature-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <SortableFeature key={index} feature={feature} index={index} onRemove={() => handleRemove(index)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default DragDropFeatures;
