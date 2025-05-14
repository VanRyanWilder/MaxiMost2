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
  MessageSquare
} from "lucide-react";
import { useUser } from "@/context/user-context";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, userLoading } = useUser();

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/tasks", name: "BeastMode Toolbox", icon: <CheckSquare className="w-5 h-5" /> },
    { path: "/progress", name: "Progress Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { path: "/motivation", name: "Motivation Center", icon: <Quote className="w-5 h-5" /> },
    { path: "/research", name: "AI Research", icon: <Bot className="w-5 h-5" /> },
    { path: "/community", name: "Community Forum", icon: <MessageSquare className="w-5 h-5" /> },
    { path: "/principles", name: "Core Principles", icon: <BookOpen className="w-5 h-5" /> },
    { path: "/workouts", name: "Workouts", icon: <Dumbbell className="w-5 h-5" /> },
    { path: "/mind-spirit", name: "Mind & Spirit", icon: <Brain className="w-5 h-5" /> },
    { path: "/nutrition", name: "Nutrition", icon: <Apple className="w-5 h-5" /> },
    { path: "/sugar", name: "Sugar: The Hidden Poison", icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
    { path: "/supplements", name: "Supplements", icon: <Pill className="w-5 h-5" /> },
    { path: "/body-stats", name: "Body Stats", icon: <LineChart className="w-5 h-5" /> },
    { path: "/resources", name: "Resources", icon: <BookOpenText className="w-5 h-5" /> },
    { path: "/programs", name: "Programs", icon: <Calendar className="w-5 h-5" /> }
  ];

  // Handle navigation
  const navigateTo = (path: string) => {
    window.location.href = path;
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BeastMode
            </h1>
            <button 
              className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden" 
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!userLoading && user && (
            <div className="mt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">12-Week Program</p>
                </div>
              </div>
              <div className="rounded-md bg-secondary/30 p-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">Program Progress</span>
                  <span className="text-xs font-medium">32%</span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 py-2">
          <nav className="px-2">
            {navItems.map((item) => (
              <div
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  location === item.path 
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
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
