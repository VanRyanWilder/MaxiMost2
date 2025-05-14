import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
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
  Quote
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
    { 
      path: "/dashboard", 
      name: "Dashboard", 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      path: "/tasks", 
      name: "BeastMode Toolbox", 
      icon: <CheckSquare className="w-5 h-5" /> 
    },
    { 
      path: "/progress", 
      name: "Progress Analytics", 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      path: "/motivation", 
      name: "Motivation Center", 
      icon: <Quote className="w-5 h-5" /> 
    },
    { 
      path: "/research", 
      name: "AI Research", 
      icon: <Bot className="w-5 h-5" /> 
    },
    { 
      path: "/community", 
      name: "Community Forum", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
      </svg>
    },
    { 
      path: "/principles", 
      name: "Core Principles", 
      icon: <BookOpen className="w-5 h-5" /> 
    },
    { 
      path: "/workouts", 
      name: "Workouts", 
      icon: <Dumbbell className="w-5 h-5" /> 
    },
    { 
      path: "/mind-spirit", 
      name: "Mind & Spirit", 
      icon: <Brain className="w-5 h-5" /> 
    },
    { 
      path: "/nutrition", 
      name: "Nutrition", 
      icon: <Apple className="w-5 h-5" /> 
    },
    { 
      path: "/supplements", 
      name: "Supplements", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8a2 2 0 0 0 2-2v-6.5l-4-4V3.5a1.5 1.5 0 0 0-3 0V9l-4 3.5V19a2 2 0 0 0 2 2z" />
      </svg> 
    },
    { 
      path: "/body-stats", 
      name: "Body Stats", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-8a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v7H6a2 2 0 0 0-2 2v8" />
        <path d="M8 15h8" />
      </svg> 
    },
    { 
      path: "/resources", 
      name: "Resources", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg> 
    },
    { 
      path: "/programs", 
      name: "Programs", 
      icon: <Calendar className="w-5 h-5" /> 
    }
  ];

  return (
    <aside 
      className={cn(
        "w-64 bg-dark text-white fixed h-full overflow-y-auto transition-transform duration-300 ease-in-out z-30",
        isOpen ? "transform-none" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-accent">BeastMode</h1>
          <button className="lg:hidden focus:outline-none" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!userLoading && user && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-xs text-gray-400">12-Week Program</p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-gray-400">Program Progress</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
          </div>
        )}

        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg", 
                      location === item.path 
                        ? "bg-primary bg-opacity-20 text-primary" 
                        : "hover:bg-gray-800 text-white"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-6 border-t border-gray-700">
        <Link href="/settings">
          <a className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </Link>
        <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 text-red-400 w-full text-left">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
