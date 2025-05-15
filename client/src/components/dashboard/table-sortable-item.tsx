import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Habit } from '@/types/habit';
import { GripVertical } from 'lucide-react';

interface SortableHabitProps {
  habit: Habit;
  children: React.ReactNode;
}

export const SortableHabit: React.FC<SortableHabitProps> = ({ habit, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 5px 15px rgba(0, 0, 0, 0.1)' : 'none',
  };
  
  // Add classes for hover states to indicate draggable
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group relative"
      {...attributes}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full flex items-center px-1 opacity-0 group-hover:opacity-70 transition-opacity cursor-grab" {...listeners}>
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>
      <div className="transition-all group-hover:pl-6">
        {children}
      </div>
    </div>
  );
};