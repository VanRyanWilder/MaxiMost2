import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Habit } from '@/types/habit';

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
};