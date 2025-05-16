import React from 'react';
import { cn } from "@/lib/utils";
import * as LucideIcons from 'lucide-react';

export interface HabitIconProps {
  icon: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  category?: string;
  color?: string;
  className?: string;
}

type ColorScheme = {
  bg: string;
  border: string;
  text: string;
  gradient: string;
};

const colorSchemes: Record<string, ColorScheme> = {
  physical: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  nutrition: {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  sleep: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  mental: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  relationships: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  financial: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  health: {
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    text: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600'
  },
  social: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  // Color-based schemes for direct color selection
  red: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  orange: {
    bg: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  amber: {
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-amber-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  green: {
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  emerald: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  teal: {
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    text: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600'
  },
  cyan: {
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
    text: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  blue: {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  indigo: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  violet: {
    bg: 'bg-violet-100',
    border: 'border-violet-300',
    text: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600'
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    text: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600'
  },
  rose: {
    bg: 'bg-rose-100',
    border: 'border-rose-300',
    text: 'text-rose-600',
    gradient: 'from-rose-500 to-rose-600'
  },
  gray: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-600',
    gradient: 'from-gray-500 to-gray-600'
  }
};

export function EnhancedHabitIcon({ 
  icon, 
  size = 'md', 
  category = 'health', 
  color,
  className 
}: HabitIconProps) {
  // Get icon component from Lucide icons
  const getIconComponent = () => {
    // Convert kebab-case to PascalCase
    const pascalCaseName = icon
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // Get the icon from Lucide icons
    const Icon = (LucideIcons as any)[pascalCaseName];
    
    // Fallback if icon doesn't exist
    if (!Icon) {
      console.warn(`Icon "${pascalCaseName}" not found, using fallback`);
      return LucideIcons.Activity;
    }
    
    return Icon;
  };
  
  const IconComponent = getIconComponent();
  
  // Determine size class
  const sizeClass = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }[size];
  
  // Get color scheme - prioritize direct color if provided, otherwise use category
  const colorKey = color || category;
  const colorScheme = colorSchemes[colorKey] || colorSchemes.gray;
  
  return (
    <div className={cn(
      "relative rounded-md flex items-center justify-center shadow-sm",
      colorScheme.bg,
      "border",
      colorScheme.border,
      {
        'p-1.5': size === 'xs',
        'p-2': size === 'sm',
        'p-2.5': size === 'md',
        'p-3': size === 'lg'
      },
      className
    )}>
      <div className="absolute inset-0 rounded-md bg-gradient-to-br opacity-30" style={{
        background: `linear-gradient(135deg, transparent 0%, ${colorKey === 'gray' ? '#64748b' : 'currentColor'} 300%)`
      }}></div>
      
      <div className={cn(
        "relative z-10",
        colorScheme.text
      )}>
        <IconComponent className={sizeClass} />
      </div>
      
      {/* Add a subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-md pointer-events-none"></div>
    </div>
  );
}