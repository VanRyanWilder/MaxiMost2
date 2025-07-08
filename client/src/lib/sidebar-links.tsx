import {
  LayoutDashboard,
  Layers, // For Habit Stacks
  BookText, // For Journal
  Search, // For Explore Content
  BookOpen, // For Atomic Habits Guide
  Share2, // For Integrations
  // Keeping Zap as an alternative for Explore if Search is too generic
  Zap,
} from "lucide-react";

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
    title: "Habit Stacks",
    href: "/stacks", // New page
    icon: <Layers className="h-5 w-5" />,
    sectionKey: "tools",
    sectionTitle: "TOOLS"
  },
  {
    title: "Journal",
    href: "/journal", // New page
    icon: <BookText className="h-5 w-5" />,
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