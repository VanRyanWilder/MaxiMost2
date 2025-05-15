import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format a date to YYYY-MM-DD string for comparison
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date to MM/DD format
 */
export function formatDateShort(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

/**
 * Get the day name for a date
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get an array of dates for a week starting from the given date
 */
export function getWeekDates(startDate: Date, days = 7): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * Get the start date of the current week (Sunday)
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const diff = now.getDate() - day;
  const sunday = new Date(now);
  sunday.setDate(diff);
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

/**
 * Calculate streak for a habit based on completions
 */
export function calculateStreak(habitId: string, completions: any[]): number {
  if (!completions.length) return 0;
  
  // Sort completions by date (most recent first)
  const sortedCompletions = [...completions]
    .filter(c => c.habitId === habitId && c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (!sortedCompletions.length) return 0;
  
  // Get the most recent completion date
  const mostRecentDate = new Date(sortedCompletions[0].date);
  mostRecentDate.setHours(0, 0, 0, 0);
  
  // Check if the most recent completion is from today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isRecentCompletion = 
    formatDateISO(mostRecentDate) === formatDateISO(today) || 
    formatDateISO(mostRecentDate) === formatDateISO(yesterday);
  
  if (!isRecentCompletion) return 0;
  
  // Start counting streak days
  let streak = 1;
  let currentDate = new Date(mostRecentDate);
  
  // Go back one day at a time to find the streak
  while (streak < sortedCompletions.length) {
    currentDate.setDate(currentDate.getDate() - 1);
    
    // Look for completion on this date
    const hasCompletion = sortedCompletions.some(
      c => formatDateISO(new Date(c.date)) === formatDateISO(currentDate)
    );
    
    if (hasCompletion) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export const categoryColors: Record<string, { bg: string, text: string }> = {
  Mind: { bg: "bg-progress bg-opacity-10", text: "text-progress" },
  Body: { bg: "bg-secondary bg-opacity-10", text: "text-secondary" },
  Brain: { bg: "bg-primary bg-opacity-10", text: "text-primary" },
  Spirit: { bg: "bg-primary bg-opacity-10", text: "text-primary" },
  Health: { bg: "bg-warning bg-opacity-10", text: "text-warning" },
  Philosophy: { bg: "bg-dark", text: "text-white" },
  Nutrition: { bg: "bg-warning", text: "text-white" },
  Fitness: { bg: "bg-secondary", text: "text-white" },
  Mindfulness: { bg: "bg-progress", text: "text-white" },
  Supplements: { bg: "bg-accent", text: "text-white" },
  Sleep: { bg: "bg-primary", text: "text-white" }
};

export const frequencyColors: Record<string, { bg: string, text: string }> = {
  "Must-Do": { bg: "bg-dark", text: "text-white" },
  "3x Weekly": { bg: "bg-gray-200", text: "text-gray-700" },
  "5x Weekly": { bg: "bg-gray-200", text: "text-gray-700" }
};

export function calculateProgramProgress(startDate: Date, durationWeeks: number): number {
  const now = new Date();
  const totalDays = durationWeeks * 7;
  const elapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (elapsed <= 0) return 0;
  if (elapsed >= totalDays) return 100;
  
  return Math.floor((elapsed / totalDays) * 100);
}

export function getProgramColorClasses(color: string): { bg: string, gradientFrom: string, gradientTo: string } {
  switch(color) {
    case 'primary':
      return { bg: 'bg-primary', gradientFrom: 'from-primary', gradientTo: 'to-primary' };
    case 'secondary':
      return { bg: 'bg-secondary', gradientFrom: 'from-secondary', gradientTo: 'to-secondary' };
    case 'warning':
      return { bg: 'bg-warning', gradientFrom: 'from-warning', gradientTo: 'to-warning' };
    case 'progress':
      return { bg: 'bg-progress', gradientFrom: 'from-progress', gradientTo: 'to-progress' };
    case 'accent':
      return { bg: 'bg-accent', gradientFrom: 'from-accent', gradientTo: 'to-accent' };
    default:
      return { bg: 'bg-primary', gradientFrom: 'from-primary', gradientTo: 'to-primary' };
  }
}

// Get the icon component for habit icons with color support
export function getIconComponent(iconName: string, iconColor?: string, className: string = "h-4 w-4") {
  // This function will be implemented in a React component instead
  // since JSX cannot be used directly in utility functions
  return null;
}
