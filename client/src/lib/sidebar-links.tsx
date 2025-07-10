import { // Removed the initial commented out block and the duplicated "LayoutDashboard, Layers, BookText"
  LayoutDashboard,
  Layers, // For Habit Stacks
  BookText, // For Journal
  Search, // For Explore Content
  BookOpen, // For Atomic Habits Guide
  Share2, // For Integrations
  TrendingUp, // For Progress Analytics
  MessageCircle, // For AI Coach
  Zap, // Alternative for Explore
  Settings, // For Settings if needed directly, though brief says via profile
  Users, // For Community if that section returns
  ShieldCheck, // For Principles or other Learn items
  Heart, // For Mind & Spirit or similar
  Brain as BrainIcon, // For Mind & Spirit or AI
  Dumbbell as DumbbellIcon, // For Workouts
  Apple as AppleIcon, // For Nutrition
  Moon as MoonIcon, // For Sleep
  DollarSign, // For Financial
  Briefcase, // For Career/Productivity
  GraduationCap // For Learn section
} from "lucide-react"; // Restored and added more icons

// Placeholder components for icons are removed as actual icons are imported above.

export interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: SidebarLink[];
  sectionKey: string; // Renamed from 'section' for clarity with section titles
  sectionTitle: string; // To group links under titles like "MAIN", "TOOLS"
}

export const sidebarLinks: SidebarLink[] = [
  // Section: MAIN
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    sectionKey: "main",
    sectionTitle: "MAIN"
  },
  // Section: TOOLS
  {
    title: "Progress Analytics",
    href: "/progress",
    icon: <TrendingUp className="h-5 w-5" />,
    sectionKey: "tools",
    sectionTitle: "TOOLS"
  },
  {
    title: "Habit Stacks",
    href: "/stacks",
    icon: <Layers className="h-5 w-5" />,
    sectionKey: "tools",
    sectionTitle: "TOOLS"
  },
  {
    title: "Journal",
    href: "/journal",
    icon: <BookText className="h-5 w-5" />,
    sectionKey: "tools",
    sectionTitle: "TOOLS"
  },
  {
    title: "AI Coach",
    href: "/coach",
    icon: <MessageCircle className="h-5 w-5" />,
    sectionKey: "tools",
    sectionTitle: "TOOLS"
  },
  // Section: LEARN
  {
    title: "Explore Content",
    href: "/explore",
    icon: <Search className="h-5 w-5" />, // Or Zap
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  {
    title: "Atomic Habits Guide",
    href: "/learn/atomic-habits", // New path
    icon: <BookOpen className="h-5 w-5" />,
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  {
    title: "Outlive Summary",
    href: "/learn/outlive-summary",
    icon: <BookOpen className="h-5 w-5" />, // Using BookOpen as a generic learn icon
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  {
    title: "Dangers of Sugar",
    href: "/learn/dangers-of-sugar",
    icon: <BookOpen className="h-5 w-5" />,
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  {
    title: "Stoic Principles",
    href: "/learn/stoic-principles",
    icon: <BookOpen className="h-5 w-5" />,
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  {
    title: "Habit Building Basics",
    href: "/learn/habit-building-basics",
    icon: <BookOpen className="h-5 w-5" />,
    sectionKey: "learn",
    sectionTitle: "LEARN"
  },
  // Section: CONNECT
  {
    title: "Integrations",
    href: "/integrations", // New page
    icon: <Share2 className="h-5 w-5" />,
    sectionKey: "connect",
    sectionTitle: "CONNECT"
  },
];

// Helper function to group links by section for the sidebar component
export const getGroupedSidebarLinks = () => {
  const groups: { key: string; title: string; links: SidebarLink[] }[] = [];
  const sectionMap = new Map<string, SidebarLink[]>();

  for (const link of sidebarLinks) {
    if (!sectionMap.has(link.sectionKey)) {
      sectionMap.set(link.sectionKey, []);
      groups.push({ key: link.sectionKey, title: link.sectionTitle, links: sectionMap.get(link.sectionKey)! });
    }
    sectionMap.get(link.sectionKey)!.push(link);
  }
  return groups;
};