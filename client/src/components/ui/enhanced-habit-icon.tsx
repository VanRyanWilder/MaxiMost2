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
  Bed,
  HeartPulse,
  Scale,
  Apple,
  Coffee,
  Rocket,
  Lightbulb,
  BookText,
  Timer,
  Flame,
  Laugh,
  Laptop,
  PenTool,
  Smartphone,
  ArrowUpRight,
  HandCoins,
  Receipt,
  Wallet,
  Landmark,
  LineChart,
  Heart,
  CheckCircle,
  Medal,
  ShowerHead
} from 'lucide-react';

interface EnhancedIconProps {
  icon: string;
  category: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

// Enhanced color schemes with richer visual styling
const CATEGORY_STYLES = {
  physical: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-200',
    glow: 'after:bg-red-500'
  },
  nutrition: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-600',
    gradient: 'from-orange-400 to-orange-600',
    shadow: 'shadow-orange-200',
    glow: 'after:bg-orange-500'
  },
  sleep: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
    gradient: 'from-indigo-400 to-indigo-600',
    shadow: 'shadow-indigo-200',
    glow: 'after:bg-indigo-500'
  },
  mental: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-200',
    glow: 'after:bg-amber-500'
  },
  relationships: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
    glow: 'after:bg-blue-500'
  },
  financial: {
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    gradient: 'from-green-400 to-green-600',
    shadow: 'shadow-green-200',
    glow: 'after:bg-green-500'
  },
  // Legacy mappings
  health: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-200',
    glow: 'after:bg-red-500'
  },
  fitness: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-200',
    glow: 'after:bg-red-500'
  },
  mind: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-200',
    glow: 'after:bg-amber-500'
  },
  social: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
    glow: 'after:bg-blue-500'
  },
  // Color-based styling for individual habits
  blue: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    gradient: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-200',
    glow: 'after:bg-blue-500'
  },
  green: {
    bg: 'bg-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    gradient: 'from-green-400 to-green-600',
    shadow: 'shadow-green-200',
    glow: 'after:bg-green-500'
  },
  red: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-600',
    gradient: 'from-red-400 to-red-600',
    shadow: 'shadow-red-200',
    glow: 'after:bg-red-500'
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-600',
    gradient: 'from-purple-400 to-purple-600',
    shadow: 'shadow-purple-200',
    glow: 'after:bg-purple-500'
  },
  amber: {
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-200',
    glow: 'after:bg-amber-500'
  },
  indigo: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-600',
    gradient: 'from-indigo-400 to-indigo-600',
    shadow: 'shadow-indigo-200',
    glow: 'after:bg-indigo-500'
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-600',
    gradient: 'from-pink-400 to-pink-600',
    shadow: 'shadow-pink-200',
    glow: 'after:bg-pink-500'
  },
  cyan: {
    bg: 'bg-cyan-100',
    border: 'border-cyan-200',
    text: 'text-cyan-600',
    gradient: 'from-cyan-400 to-cyan-600',
    shadow: 'shadow-cyan-200',
    glow: 'after:bg-cyan-500'
  }
};

// Enhanced icon mapping with categorized icons
const ICON_MAPPING: Record<string, LucideIcon> = {
  // Physical category icons
  dumbbell: Dumbbell,
  activity: Activity,
  heart: Heart,
  heartpulse: HeartPulse,
  flame: Flame,
  
  // Nutrition category icons
  utensils: Utensils,
  apple: Apple,
  coffee: Coffee,
  
  // Mind/mental category icons
  brain: Brain,
  book: BookOpen,
  booktext: BookText,
  lightbulb: Lightbulb,
  rocket: Rocket,
  
  // Sleep category icons
  moon: MoonIcon,
  bed: Bed,
  showerhead: ShowerHead,
  
  // Relationship category icons
  users: Users,
  laugh: Laugh,
  
  // Financial category icons
  dollar: CircleDollarSign,
  wallet: Wallet,
  receipt: Receipt,
  handcoins: HandCoins,
  landmark: Landmark,
  linechart: LineChart,
  
  // General purpose icons
  droplets: Droplets,
  pill: Pill,
  timer: Timer,
  scale: Scale,
  laptop: Laptop,
  smartphone: Smartphone,
  pentool: PenTool,
  arrowupright: ArrowUpRight,
  checkcircle: CheckCircle,
  medal: Medal
};

// Advanced HabitIcon component with enhanced visual styling
export function EnhancedHabitIcon({ icon, category, size = 'md', className = '' }: EnhancedIconProps) {
  // Get style scheme based on either category or iconColor (supporting both approaches)
  const styleScheme = CATEGORY_STYLES[category] || 
                    (icon && CATEGORY_STYLES[icon.toLowerCase()]) || 
                    CATEGORY_STYLES.blue;
  
  // Get the correct icon component or fallback to Activity
  const IconComponent = ICON_MAPPING[icon?.toLowerCase()] || Activity;
  
  // Size variants with appropriate styling
  const sizeClasses = {
    xs: {
      container: 'p-1 rounded-full',
      icon: 'h-2.5 w-2.5'
    },
    sm: {
      container: 'p-1.5 rounded-full',
      icon: 'h-3.5 w-3.5'
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
      className={`
        relative overflow-hidden bg-gradient-to-br ${styleScheme.gradient}
        border ${styleScheme.border} ${styleScheme.shadow}
        ${sizeClasses[size].container} transition-all duration-300
        hover:scale-105 hover:shadow-lg
        after:content-[''] after:absolute after:top-0 after:left-0 
        after:w-full after:h-full after:opacity-20 
        after:rounded-full after:scale-150 after:blur-md
        after:transform after:-translate-x-1/2 after:-translate-y-3/4
        ${className}
      `}
    >
      {/* Create shine/glow effect */}
      <div className="absolute inset-0 bg-white opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"></div>
      
      {/* Icon */}
      <IconComponent className={`${sizeClasses[size].icon} text-white relative z-10`} />
    </div>
  );
}