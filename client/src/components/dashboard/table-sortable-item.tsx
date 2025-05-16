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
      className="relative group cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <div className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}