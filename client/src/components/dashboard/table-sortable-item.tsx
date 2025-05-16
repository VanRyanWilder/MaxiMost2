import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { Habit } from '@/types/habit';

interface TableSortableItemProps {
  habit: Habit;
  children: ReactNode;
}

export function TableSortableItem({ 
  habit, 
  children 
}: TableSortableItemProps) {
  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: habit.id });
  
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