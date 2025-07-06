import {
  LayoutDashboard,
  Calendar,
  Dumbbell,
  Brain,
  Apple,
  Heart,
  Users,
  FileText,
  Pill,
  FlaskConical,
  Scroll,
  CandyCane,
  ThumbsUp,
  Layers,
  LineChart,
  Sparkles,
  Zap, // Keep Zap for Explore
  BedDouble,
  Utensils,
  Coins,
  Lightbulb,
  UserCircle2,
  BookOpen, // For Atomic Habits Guide
  Activity // For Body Stats
} from "lucide-react";

export interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: SidebarLink[];
  section?: string; // 'main', 'learn', 'pillars', 'tools', 'community'
}

export const sidebarLinks: SidebarLink[] = [
  // Section: Main
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Habits",
    href: "/habits",
    icon: <Calendar className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Habit Stacks",
    href: "/habit-stacks",
    icon: <Layers className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Progress",
    href: "/progress-dashboard",
    icon: <LineChart className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Explore", // New Explore link
    href: "/explore",
    icon: <Zap className="h-5 w-5" />,
    section: "main"
  },

  // Section: Learn & Grow
  {
    title: "Principles",
    href: "/principles",
    icon: <Scroll className="h-5 w-5" />,
    section: "learn"
  },
  {
    title: "Research",
    href: "/research",
    icon: <FlaskConical className="h-5 w-5" />,
    section: "learn"
  },
  {
    title: "Atomic Habits Guide",
    href: "/atomic-habits-guide",
    icon: <BookOpen className="h-5 w-5" />,
    section: "learn"
  },
  {
    title: "Sugar Dangers", // Moved
    href: "/sugar",
    icon: <CandyCane className="h-5 w-5" />,
    section: "learn"
  },

  // Section: Health Pillars (was Habit Categories)
  {
    title: "Physical Training",
    href: "/physical", // Assuming this route exists or will be created
    icon: <Dumbbell className="h-5 w-5" />,
    section: "pillars"
  },
  {
    title: "Nutrition & Fueling",
    href: "/nutrition",
    icon: <Utensils className="h-5 w-5" />,
    section: "pillars"
  },
  {
    title: "Sleep & Hygiene",
    href: "/sleep", // Assuming this route exists or will be created
    icon: <BedDouble className="h-5 w-5" />,
    section: "pillars"
  },
  {
    title: "Mental Acuity & Growth",
    href: "/mental", // Assuming this route exists or will be created
    icon: <Lightbulb className="h-5 w-5" />,
    section: "pillars"
  },
  // Note: Relationships & Financial Habits could also be pillars or moved to a "Life Admin" section if desired.
  // For now, I'll keep them out of this re-org to limit scope, they can be re-added.

  // Section: Tools & Extras
  {
    title: "Supplements",
    href: "/supplements",
    icon: <Pill className="h-5 w-5" />,
    section: "tools"
  },
  {
    title: "Gamification",
    href: "/gamification",
    icon: <Sparkles className="h-5 w-5" />,
    section: "tools"
  },
  {
    title: "Body Stats",
    href: "/body-stats", // This page/route exists
    icon: <Activity className="h-5 w-5" />,
    section: "tools"
  },

  // Section: Community & Resources
  {
    title: "Experts",
    href: "/experts",
    icon: <ThumbsUp className="h-5 w-5" />,
    section: "community"
  },
  {
    title: "Community",
    href: "/community",
    icon: <Users className="h-5 w-5" />,
    section: "community"
  },
  {
    title: "Resources",
    href: "/resources",
    icon: <FileText className="h-5 w-5" />,
    section: "community"
  }
  // Removed for brevity in this reorg, can be added back if needed:
  // { title: "Relationships & Community", href: "/relationships", icon: <UserCircle2 className="h-5 w-5" />, section: "pillars" },
  // { title: "Financial Habits", href: "/financial", icon: <Coins className="h-5 w-5" />, section: "pillars" },
];