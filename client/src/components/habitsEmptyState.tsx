import React from 'react';

interface HabitsEmptyStateProps {
  filterCategory: string;
}

export const HabitsEmptyState: React.FC<HabitsEmptyStateProps> = ({ filterCategory }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {filterCategory !== 'all'
        ? "No habits found for this category" 
        : "No habits added yet. Click 'Add Habit' to get started."}
    </div>
  );
};