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
  Sparkles,
  BadgeCheck,
  Mail,
  Skull
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { Logo } from "@/components/ui/logo";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { useState, useEffect } from "react";
import { onAuthStateChange } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { StreakDisplay } from "@/components/streak/streak-display";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { user, userLoading, logout } = useUser();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setFirebaseUser(currentUser);
      setFirebaseLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const navItems = [
    // Core Navigation
    {
      path: "/home",
      name: "Home",
      icon: <Home className="w-5 h-5" />,
      description: "App overview and quick actions"
    },
    { 
      path: "/dashboard", 
      name: "Habit Dashboard", 
      icon: <CheckSquare className="w-5 h-5 text-green-500" />,
      description: "Track and manage your habits"
    },
    {
      path: "/progress",
      name: "Track Progress",
      icon: <LineChart className="w-5 h-5 text-blue-500" />, // Changed icon
      description: "Visualize your habit trends & stats"
    },
    { 
      path: "/ai-features",
      name: "AI Coach", // Renamed for clarity
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      description: "Personalized insights & suggestions"
    },
    {
      path: "/explore",
      name: "Explore Content", // Renamed for clarity
      icon: <Zap className="w-5 h-5 text-purple-500" />,
      description: "Discover resources & motivation"
    },
    // Learning & Knowledge Section (could be grouped visually or implicitly)
    { 
      path: "/habit-building", 
      name: "Habit Science", // Renamed
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      description: "Learn methods to build lasting habits"
    },
    {
      path: "/atomic-habits-guide",
      name: "Atomic Habits Guide",
      icon: <BadgeCheck className="w-5 h-5 text-blue-500" />,
      description: "Visual guide to the Four Laws"
    },
    { 
      path: "/principles", 
      name: "Stoic Principles", 
      icon: <TrendingUp className="w-5 h-5 text-teal-500" />, // Changed icon color
      description: "Wisdom for resilience & focus"
    },
    { 
      path: "/supplements",
      name: "Supplement Guides", // Renamed
      icon: <Pill className="w-5 h-5 text-orange-500" />, // Changed icon
      description: "Evidence-based supplement info"
    },
    { 
      path: "/sugar", 
      name: "Sugar Impact", // Renamed
      icon: <Skull className="w-5 h-5 text-red-500" />,
      description: "Understand sugar's effects"
    },
    // Removed some of the more generic/redundant items like "Scientific Research", "Health Experts"
    // as they can be sub-sections within Explore or specific guides.
    // Community & Support
    { 
      path: "/community", 
      name: "Community", 
      icon: <Users className="w-5 h-5 text-pink-500" />, // Changed icon
      description: "Connect with others (future)" // Assuming community is future
    },
    { 
      path: "/contact", 
      name: "Support", // Renamed
      icon: <Mail className="w-5 h-5 text-gray-500" />,
      description: "Get help or provide feedback"
    }
    // Motivation page is removed, as DailyMotivation card will be enhanced on dashboard or moved to Explore.
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

          {!firebaseLoading && (
            <div className="mt-4">
              <div className="flex items-center space-x-3 mb-3">
                {firebaseUser?.photoURL ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={firebaseUser.photoURL} 
                      alt={firebaseUser.displayName || "User"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-sm">
                    {firebaseUser ? 
                      (firebaseUser.displayName || firebaseUser.email || "MaxiMost User") : 
                      (user?.name || "MaxiMost User")}
                  </h3>
                  <p className="text-xs text-muted-foreground">High-ROI Achiever</p>
                </div>
              </div>
              {/* Dynamic streak display based on user's habit completion */}
              {firebaseUser ? (
                <StreakDisplay userId={firebaseUser.uid} />
              ) : (
                <StreakDisplay userId={user?.id} />
              )}
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
          <button 
            onClick={() => {
              logout();
              navigateTo("/");
            }}
            className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
