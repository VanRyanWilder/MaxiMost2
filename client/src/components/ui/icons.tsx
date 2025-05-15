import React from 'react';
import {
  Heart,
  HeartPulse,
  Droplet as DropletIcon,
  Pill,
  Weight,
  Leaf,
  Dumbbell,
  Footprints,
  BarChart,
  Brain,
  BookText,
  PenTool,
  Pencil,
  Mic,
  Music,
  Moon,
  Bed,
  AlarmClock,
  Utensils,
  Coffee,
  Users,
  MessageCircle,
  Check,
  Timer,
  Zap,
  Sun,
  Award,
  BadgeCheck,
  ThumbsUp,
  SmilePlus,
  CircleDollarSign,
  CheckSquare,
  Activity,
  BookOpen,
  Apple,
  Star,
  Smartphone,
  ScrollText,
  Smile,
  Droplets
} from 'lucide-react';

export interface IconMapItem {
  component: React.ElementType;
  label: string;
  category: string;
}

// Map of icon keys to their components and metadata
export const iconMap: Record<string, IconMapItem> = {
  // Health
  "heart": { component: Heart, label: "Heart", category: "health" },
  "heartPulse": { component: HeartPulse, label: "Heart Rate", category: "health" },
  "droplets": { component: DropletIcon, label: "Droplets", category: "health" },
  "pill": { component: Pill, label: "Medication", category: "health" },
  "weight": { component: Weight, label: "Weight", category: "health" },
  "leaf": { component: Leaf, label: "Nature", category: "health" },
  
  // Fitness
  "dumbbell": { component: Dumbbell, label: "Weights", category: "fitness" },
  "footprints": { component: Footprints, label: "Steps", category: "fitness" },
  "barChart": { component: BarChart, label: "Progress", category: "fitness" },
  
  // Mind
  "brain": { component: Brain, label: "Mind", category: "mind" },
  "book": { component: BookText, label: "Reading", category: "mind" },
  "penTool": { component: PenTool, label: "Writing", category: "mind" },
  "pencil": { component: Pencil, label: "Notes", category: "mind" },
  "mic": { component: Mic, label: "Speaking", category: "mind" },
  "music": { component: Music, label: "Music", category: "mind" },
  
  // Sleep
  "moon": { component: Moon, label: "Sleep", category: "sleep" },
  "bed": { component: Bed, label: "Bed", category: "sleep" },
  "alarm": { component: AlarmClock, label: "Alarm", category: "sleep" },
  
  // Food
  "utensils": { component: Utensils, label: "Eat", category: "food" },
  "coffee": { component: Coffee, label: "Drink", category: "food" },
  
  // Social
  "users": { component: Users, label: "Social", category: "social" },
  "messageCircle": { component: MessageCircle, label: "Communication", category: "social" },
  
  // Productivity
  "check": { component: Check, label: "Complete", category: "productivity" },
  "timer": { component: Timer, label: "Timer", category: "productivity" },
  "zap": { component: Zap, label: "Energy", category: "productivity" },
  "sun": { component: Sun, label: "Day", category: "productivity" },
  
  // Achievements
  "award": { component: Award, label: "Award", category: "achievements" },
  "badgeCheck": { component: BadgeCheck, label: "Badge", category: "achievements" },
  "thumbsUp": { component: ThumbsUp, label: "Like", category: "achievements" },
  "smilePlus": { component: SmilePlus, label: "Positive", category: "achievements" },
  
  // Financial
  "circleDollarSign": { component: CircleDollarSign, label: "Money", category: "finance" },

  // Fallbacks and additional icons
  "activity": { component: Activity, label: "Activity", category: "productivity" },
  "book-open": { component: BookOpen, label: "Book", category: "mind" },
  "apple": { component: Apple, label: "Food", category: "food" },
  "star": { component: Star, label: "Star", category: "achievements" },
  "check-square": { component: CheckSquare, label: "Task", category: "productivity" },
  "smartphone": { component: Smartphone, label: "Technology", category: "productivity" },
  "scroll-text": { component: ScrollText, label: "Journal", category: "mind" },
  "smile": { component: Smile, label: "Happy", category: "social" }
};

// Helper function to get the icon component by name
export function getHabitIcon(iconName: string, className: string = "h-4 w-4"): React.ReactNode {
  if (iconMap[iconName]) {
    const IconComponent = iconMap[iconName].component;
    return <IconComponent className={className} />;
  }
  
  // Fallback for any missing icons with hyphens
  const hyphenVersion = iconName.replace(/-/g, '');
  if (iconMap[hyphenVersion]) {
    const IconComponent = iconMap[hyphenVersion].component;
    return <IconComponent className={className} />;
  }
  
  // Final fallback
  return <Activity className={className} />;
}

// Export a namespace for convenience
export const Icons = {
  ...iconMap,
  getHabitIcon
};