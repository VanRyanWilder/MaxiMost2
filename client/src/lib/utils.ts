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
