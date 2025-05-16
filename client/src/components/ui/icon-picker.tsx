import { 
  Activity, 
  Dumbbell, 
  Brain,
  Droplets,
  BookOpen, 
  Pill,
  Utensils, 
  Moon, 
  Users, 
  CircleDollarSign,
  Heart,
  HeartPulse,
  Flame,
  Coffee,
  Timer,
  Lightbulb,
  Star,
  Sun,
  AlarmClock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  selectedIcon: string;
  category: string;
  onChange: (icon: string) => void;
  className?: string;
}

// Category types for better type safety
type CategoryType = 'physical' | 'nutrition' | 'sleep' | 'mental' | 'relationships' | 'financial' | 'health' | 'fitness' | 'mind' | 'social' | string;

// Map of custom icons by category for better organization
const CATEGORY_ICONS: Record<CategoryType, string[]> = {
  physical: ['dumbbell', 'activity', 'heartpulse', 'flame'],
  nutrition: ['utensils', 'apple', 'coffee'],
  sleep: ['moon', 'bed', 'clock', 'sun'],
  mental: ['brain', 'book', 'lightbulb'],
  relationships: ['users', 'heart'],
  financial: ['dollar', 'wallet'],
  // Legacy mappings
  health: ['droplets', 'pill', 'heart', 'activity'],
  fitness: ['dumbbell', 'activity', 'flame'],
  mind: ['brain', 'book', 'lightbulb'],
  social: ['users', 'heart'],
  // Default for any other string
  default: ['activity', 'droplets', 'book', 'heart', 'flame']
};

// All available icons - used when no category filtering is applied
const ALL_ICONS = [
  'activity', 'dumbbell', 'brain', 'droplets', 'book', 'pill', 
  'utensils', 'moon', 'users', 'dollar', 'heart', 'heartpulse',
  'flame', 'coffee', 'timer', 'lightbulb', 'star', 'sun', 'clock'
];

export function IconPicker({ selectedIcon, category, onChange, className }: IconPickerProps) {
  // Function to render the correct icon
  const renderIcon = (iconName: string): JSX.Element => {
    switch(iconName) {
      case 'activity': return <Activity />;
      case 'dumbbell': return <Dumbbell />;
      case 'brain': return <Brain />;
      case 'droplets': return <Droplets />;
      case 'book': return <BookOpen />;
      case 'pill': return <Pill />;
      case 'utensils': return <Utensils />;
      case 'moon': return <Moon />;
      case 'users': return <Users />;
      case 'dollar': return <CircleDollarSign />;
      case 'heart': return <Heart />;
      case 'heartpulse': return <HeartPulse />;
      case 'flame': return <Flame />;
      case 'coffee': return <Coffee />;
      case 'timer': return <Timer />;
      case 'lightbulb': return <Lightbulb />;
      case 'star': return <Star />;
      case 'sun': return <Sun />;
      case 'clock': return <AlarmClock />;
      default: return <Activity />;
    }
  };

  // Get color scheme based on category
  const getColorClass = (iconName: string, isSelected: boolean) => {
    const baseClasses = 'p-2 rounded-full flex items-center justify-center transition-all';
    const selectedClasses = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';
    
    let colorClasses = '';
    switch(category) {
      case 'physical':
        colorClasses = 'bg-red-100 text-red-600 hover:bg-red-200';
        break;
      case 'nutrition':
        colorClasses = 'bg-orange-100 text-orange-600 hover:bg-orange-200';
        break;
      case 'sleep':
        colorClasses = 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200';
        break;
      case 'mental':
        colorClasses = 'bg-amber-100 text-amber-600 hover:bg-amber-200';
        break;
      case 'relationships':
        colorClasses = 'bg-blue-100 text-blue-600 hover:bg-blue-200';
        break;
      case 'financial':
        colorClasses = 'bg-green-100 text-green-600 hover:bg-green-200';
        break;
      default:
        colorClasses = 'bg-blue-100 text-blue-600 hover:bg-blue-200';
        break;
    }
    
    return cn(baseClasses, colorClasses, selectedClasses);
  };

  // Filter icons based on category or use all
  const iconsToShow = category && CATEGORY_ICONS[category as CategoryType] 
    ? CATEGORY_ICONS[category as CategoryType] 
    : CATEGORY_ICONS.default || ALL_ICONS;
  
  return (
    <div className={cn('grid grid-cols-5 gap-2', className)}>
      {iconsToShow.map((iconName) => (
        <button
          key={iconName}
          type="button"
          onClick={() => onChange(iconName)}
          className={getColorClass(iconName, selectedIcon === iconName)}
        >
          <div className="h-4 w-4">
            {renderIcon(iconName)}
          </div>
        </button>
      ))}
    </div>
  );
}