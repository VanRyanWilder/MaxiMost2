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
  LucideIcon,
  Sunrise,
  Sunset,
  Bed,
  Apple,
  Salad,
  Banana,
  Fish,
  Egg,
  Beef,
  Milk,
  Soup,
  Candy,
  CheckCircle,
  CheckSquare,
  Medal,
  Trophy,
  Target,
  MoveUpRight,
  BarChart,
  LineChart,
  PiggyBank,
  Wallet,
  HandCoins,
  Receipt,
  Building,
  Landmark,
  Presentation,
  BookText,
  Scroll,
  BookMarked,
  GraduationCap,
  UserPlus,
  UsersRound,
  HeartHandshake,
  MessageCircle,
  MessageSquare,
  Footprints,
  Baby,
  Bus,
  Car,
  Bike,
  Cog,
  Sun,
  CloudSun,
  CloudRain,
  Umbrella,
  HelpingHand,
  Hammer,
  Ruler,
  Wrench,
  Laptop,
  Smartphone,
  PhoneCall,
  Mail,
  PenTool,
  Pencil,
  Brush,
  Palette,
  Music,
  Mic,
  Radio,
  Tv,
  Play,
  Pause,
  Forward,
  Rewind,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Euro,
  Bitcoin,
  BadgePercent,
  Tag,
  Ticket,
  Gift,
  Stars,
  Star,
  Sparkles,
  Flower,
  Leaf,
  Trees,
  Sprout,
  Globe,
  Map,
  Navigation,
  Compass,
  Plane,
  Ship,
  Truck,
  Briefcase,
  Luggage,
  FolderArchive,
  FileText,
  Clipboard,
  Wine,
  Beer,
  GlassWater,
  Pizza,
  Dessert,
  Cherry,
  Lemon,
  Calculator,
  Clock,
  AlarmClock
} from 'lucide-react';

// Map of icon names to Lucide components
export const iconMap: Record<string, LucideIcon> = {
  // Physical category
  activity: Activity,
  dumbbell: Dumbbell,
  heartpulse: HeartPulse,
  flame: Flame,
  medal: Medal,
  trophy: Trophy,
  target: Target,
  footprints: Footprints,
  
  // Health/medical category
  heart: Heart,
  brain: Brain,
  pill: Pill,
  droplets: Droplets,
  
  // Nutrition category
  utensils: Utensils,
  coffee: Coffee,
  apple: Apple,
  banana: Banana,
  salad: Salad,
  fish: Fish,
  egg: Egg,
  beef: Beef,
  milk: Milk,
  soup: Soup,
  candy: Candy,
  pizza: Pizza,
  wine: Wine,
  beer: Beer,
  cocktail: Cocktail,
  cherry: Cherry,
  lemon: Lemon,
  
  // Sleep category
  moon: Moon,
  bed: Bed,
  sunset: Sunset,
  sunrise: Sunrise,
  
  // Mental category
  book: BookOpen,
  booktext: BookText,
  bookmarked: BookMarked,
  lightbulb: Lightbulb,
  graduationcap: GraduationCap,
  presentation: Presentation,
  scroll: Scroll,
  
  // Relationship category
  users: Users,
  usersround: UsersRound,
  userplus: UserPlus,
  hearthandshake: HeartHandshake,
  messagecircle: MessageCircle,
  messagesquare: MessageSquare,
  baby: Baby,
  
  // Financial category
  dollar: CircleDollarSign,
  dollarsign: DollarSign,
  piggybank: PiggyBank,
  wallet: Wallet,
  handcoins: HandCoins,
  receipt: Receipt,
  building: Building,
  landmark: Landmark,
  shoppingbag: ShoppingBag,
  shoppingcart: ShoppingCart,
  euro: Euro,
  bitcoin: Bitcoin,
  badgepercent: BadgePercent,
  tag: Tag,
  
  // Time management
  timer: Timer,
  clock: Clock,
  alarmclock: AlarmClock,
  
  // Weather/nature
  sun: Sun,
  cloudsun: CloudSun,
  cloudrain: CloudRain,
  umbrella: Umbrella,
  flower: Flower,
  leaf: Leaf,
  tree: Tree,
  sprout: Sprout,
  globe: Globe,
  
  // Travel/transport
  map: Map,
  navigation: Navigation,
  compass: Compass,
  plane: Plane,
  ship: Ship,
  truck: Truck,
  car: Car,
  bus: Bus,
  
  // Work/office
  briefcase: Briefcase,
  suitcase: Suitcase,
  folderarchive: FolderArchive,
  filetext: FileText,
  clipboard: Clipboard,
  calculator: Calculator,
  
  // Tech/devices
  laptop: Laptop,
  smartphone: Smartphone,
  phonecall: PhoneCall,
  mail: Mail,
  
  // Creative/arts
  pentool: PenTool,
  pencil: Pencil,
  brush: Brush,
  palette: Palette,
  music: Music,
  mic: Mic,
  radio: Radio,
  tv: Tv,
  
  // Media controls
  play: Play,
  pause: Pause,
  forward: Forward,
  rewind: Rewind,
  
  // Miscellaneous
  checkcircle: CheckCircle,
  checksquare: CheckSquare,
  gift: Gift,
  stars: Stars,
  star: Star,
  sparkles: Sparkles,
  cog: Cog,
  helpinghand: HelpingHand,
  hammer: Hammer,
  ruler: Ruler,
  wrench: Wrench,
  moveupright: MoveUpRight,
  barchart: BarChart,
  linechart: LineChart,
  ticket: Ticket
};

// Color schemes for different categories
export const colorSchemes = {
  physical: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    ring: 'ring-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  nutrition: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    ring: 'ring-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  sleep: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    ring: 'ring-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  mental: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    ring: 'ring-amber-500',
    gradient: 'from-amber-400 to-amber-600',
  },
  relationships: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    ring: 'ring-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  financial: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    ring: 'ring-green-500',
    gradient: 'from-green-400 to-green-600',
  },
  // Legacy category names
  health: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    ring: 'ring-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  fitness: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    ring: 'ring-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  mind: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    ring: 'ring-amber-500',
    gradient: 'from-amber-400 to-amber-600',
  },
  social: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    ring: 'ring-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  // Color name as category
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    ring: 'ring-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    ring: 'ring-green-500',
    gradient: 'from-green-400 to-green-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    ring: 'ring-red-500',
    gradient: 'from-red-400 to-red-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    ring: 'ring-amber-500',
    gradient: 'from-amber-400 to-amber-600',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    ring: 'ring-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    ring: 'ring-purple-500',
    gradient: 'from-purple-400 to-purple-600',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    ring: 'ring-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    ring: 'ring-pink-500',
    gradient: 'from-pink-400 to-pink-600',
  },
  cyan: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
    ring: 'ring-cyan-500',
    gradient: 'from-cyan-400 to-cyan-600',
  }
};

interface IconSelectorProps {
  selectedIcon: string;
  category: string;
  onSelectIcon: (icon: string) => void;
  className?: string;
}

export function IconSelector({ selectedIcon, category, onSelectIcon, className = '' }: IconSelectorProps) {
  // Get color scheme based on category
  const colorScheme = colorSchemes[category] || colorSchemes.blue;
  
  // Available icons to select from
  const availableIcons = [
    'dumbbell', 'heart', 'activity', 'brain', 'droplets', 
    'moon', 'pill', 'utensils', 'book', 'users', 
    'dollar', 'flame', 'coffee', 'timer', 'lightbulb'
  ];
  
  return (
    <div className={`grid grid-cols-5 gap-2 ${className}`}>
      {availableIcons.map((iconName) => {
        const IconComponent = iconMap[iconName] || Activity;
        
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onSelectIcon(iconName)}
            className={`p-2 rounded-full ${colorScheme.bg} flex items-center justify-center 
              transition-all hover:opacity-80
              ${selectedIcon === iconName ? `ring-2 ring-offset-2 ring-offset-background ${colorScheme.ring}` : ''}
            `}
          >
            <IconComponent className={`h-4 w-4 ${colorScheme.text}`} />
          </button>
        );
      })}
    </div>
  );
}