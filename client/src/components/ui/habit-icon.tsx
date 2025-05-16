import React from 'react';
import {
  Activity,
  Dumbbell,
  Brain,
  Droplets,
  BookOpen,
  Pill,
  Utensils,
  Moon as MoonIcon,
  Users,
  CircleDollarSign,
  LucideIcon,
  Bed
} from 'lucide-react';

interface HabitIconProps {
  icon: string;
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Category color mapping
const CATEGORY_COLORS = {
  physical: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  nutrition: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  sleep: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  mental: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  relationships: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  financial: {
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  health: { // Legacy mappings
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  fitness: { // Legacy mappings
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  mind: { // Legacy mappings
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  social: { // Legacy mappings
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  }
};

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  brain: Brain,
  droplets: Droplets,
  book: BookOpen,
  pill: Pill,
  utensils: Utensils,
  moon: MoonIcon,
  bed: Bed,
  users: Users,
  dollar: CircleDollarSign,
  activity: Activity,
  // Add more icon mappings as needed
};

export function HabitIcon({ icon, category, size = 'md', className = '' }: HabitIconProps) {
  // Get the correct color scheme based on category
  const colorScheme = CATEGORY_COLORS[category] || CATEGORY_COLORS.physical;
  
  // Get the correct icon component
  const IconComponent = ICON_MAP[icon] || Activity; // Default to Activity if icon not found
  
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'p-1.5 rounded-full',
      icon: 'h-3 w-3'
    },
    md: {
      container: 'p-2 rounded-full',
      icon: 'h-4 w-4'
    },
    lg: {
      container: 'p-3 rounded-full',
      icon: 'h-5 w-5'
    }
  };
  
  return (
    <div className={`${sizeClasses[size].container} ${colorScheme.bg} ${colorScheme.border} border shadow-sm ${className}`}>
      <IconComponent className={`${sizeClasses[size].icon} ${colorScheme.text}`} />
    </div>
  );
}

// Enhanced version with custom styling and effects
export function EnhancedHabitIcon({ icon, category, size = 'md', className = '' }: HabitIconProps) {
  // Get the correct color scheme based on category
  const colorScheme = CATEGORY_COLORS[category] || CATEGORY_COLORS.physical;
  
  // Get the correct icon component
  const IconComponent = ICON_MAP[icon] || Activity; // Default to Activity if icon not found
  
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'p-1.5 rounded-full',
      icon: 'h-3 w-3'
    },
    md: {
      container: 'p-2 rounded-full',
      icon: 'h-4 w-4'
    },
    lg: {
      container: 'p-3 rounded-full',
      icon: 'h-5 w-5'
    }
  };
  
  return (
    <div 
      className={`${sizeClasses[size].container} relative overflow-hidden 
                  bg-gradient-to-br ${colorScheme.gradient} 
                  border ${colorScheme.border} shadow-sm ${className}`}
    >
      {/* Add a subtle shine effect */}
      <div className="absolute inset-0 bg-white opacity-20 rounded-full transform -translate-x-4 -translate-y-4 w-8 h-8"></div>
      
      <IconComponent className={`${sizeClasses[size].icon} text-white relative z-10`} />
    </div>
  );
}