import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { Habit } from '@/types/habit';

interface TableSortableItemProps {
  habit?: Habit;
  id: string;
  children: ReactNode;
  className?: string;
}

export function TableSortableItem({ 
  habit, 
  id,
  children,
  className
}: TableSortableItemProps) {
  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id || (habit?.id ?? '') });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}