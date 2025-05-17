/**
 * Utility function to clean habit titles by removing any trailing "O" character
 * that sometimes appears due to a serialization issue
 */
export function cleanHabitTitle(title: string | undefined | null): string {
  if (!title) return "";
  
  // Check if title ends with capital "O" (Unicode 0x004F or character code 79)
  if (title.length > 0 && title.charCodeAt(title.length - 1) === 79) {
    console.log(`Removing trailing O from "${title}"`);
    return title.substring(0, title.length - 1);
  }
  
  return title;
}