// This is a temporary file to add custom empty state message logic
// It's used when filterCategory is 'all' instead of null
// so the empty message works correctly

export function getEmptyStateMessage(filterCategory: string) {
  return filterCategory !== 'all'
    ? "No habits found for this category" 
    : "No habits added yet. Click 'Add Habit' to get started.";
}