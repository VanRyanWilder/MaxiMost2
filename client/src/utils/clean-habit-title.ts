/**
 * Utility function to clean habit titles by removing any trailing "O" character
 * that sometimes appears due to a serialization issue
 */
export function cleanHabitTitle(title: string | undefined | null): string {
  if (!title) return "";
  
  // Remove trailing "O" (Unicode 0x004F) character
  return title.replace(/\u004F$/, "");
}