import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { 
  Home, 
  CheckSquare, 
  Dumbbell, 
  Brain, 
  Apple, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  TrendingUp,
  Bot,
  BarChart3,
  Quote,
  AlertTriangle,
  Pill,
  LineChart,
  BookOpenText,
  MessageSquare,
  Users,
  Trophy,
  Heart,
  Moon,
  Utensils,
  Lightbulb,
  UserPlus,
  DollarSign,
  Zap,
  BadgeCheck,
  Mail,
  Skull
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { user, userLoading } = useUser();

  const navItems = [
    {
      path: "/home",
      name: "Home",
      icon: <Home className="w-5 h-5" />,
      description: "Welcome to MaxiMost"
    },
    { 
      path: "/dashboard", 
      name: "Habit Dashboard", 
      icon: <CheckSquare className="w-5 h-5 text-green-500" />,
      description: "Your all-in-one habit tracking center"
    },
    { 
      path: "/supplements", 
      name: "Top Supplements", 
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      description: "Expert-recommended supplements with highest ROI"
    },
    { 
      path: "/habit-building", 
      name: "Habit Building", 
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      description: "Learn proven methods to build lasting habits"
    },

    
    // Categories section
    { 
      path: "/principles", 
      name: "Stoic Principles", 
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      description: "High ROI principles from top performers"
    },
    { 
      path: "/experts-unified", 
      name: "Health Experts", 
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      description: "Follow the top evidence-based health experts"
    },
    { 
      path: "/research", 
      name: "Scientific Research", 
      icon: <BookOpenText className="w-5 h-5 text-indigo-500" />,
      description: "Evidence-based health & fitness research"
    },
    { 
      path: "/sugar-danger", 
      name: "Sugar Danger", 
      icon: <Skull className="w-5 h-5 text-red-500" />,
      description: "The harmful effects of sugar on health"
    },
    
    // Additional resources
    { 
      path: "/progress", 
      name: "Track Progress", 
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
      description: "Monitor your body stats and health metrics"
    },
    { 
      path: "/motivation", 
      name: "Motivation", 
      icon: <Heart className="w-5 h-5 text-red-500" />,
      description: "Daily motivation and inspiration"
    },
    { 
      path: "/community", 
      name: "Community", 
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      description: "Connect with like-minded individuals"
    },
    { 
      path: "/contact", 
      name: "Contact Us", 
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      description: "Get in touch with MaxiMost team"
    }
  ];

  // Handle navigation using wouter (location/setLocation already defined above)
  const navigateTo = (path: string) => {
    setLocation(path);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Logo size="medium" />
            <button 
              className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden" 
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!userLoading && (
            <div className="mt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm">MaxiMost User</h3>
                  <p className="text-xs text-muted-foreground">High-ROI Achiever</p>
                </div>
              </div>
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-2.5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Current Streak
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    7 days
                  </span>
                </div>
                <div className="w-full bg-blue-100 dark:bg-blue-900/40 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" 
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 py-2">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={cn(
                  "flex flex-col px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === item.path 
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.description && (
                  <p className="ml-7 mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-2 border-t border-border mt-auto">
          <div 
            onClick={() => navigateTo("/settings")}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <button className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 text-left">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
