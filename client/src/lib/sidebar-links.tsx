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
  Zap
} from "lucide-react";

export interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: SidebarLink[];
  section?: string;
}

export const sidebarLinks: SidebarLink[] = [
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
    title: "Gamification",
    href: "/gamification",
    icon: <Sparkles className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Supplements",
    href: "/supplements",
    icon: <Pill className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Research",
    href: "/research",
    icon: <FlaskConical className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Principles",
    href: "/principles",
    icon: <Scroll className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Sugar Dangers",
    href: "/sugar",
    icon: <CandyCane className="h-5 w-5" />,
    section: "main"
  },
  {
    title: "Workouts",
    href: "/workouts",
    icon: <Dumbbell className="h-5 w-5" />,
    section: "health"
  },
  {
    title: "Mind & Spirit",
    href: "/mind-spirit",
    icon: <Brain className="h-5 w-5" />,
    section: "health"
  },
  {
    title: "Nutrition",
    href: "/nutrition",
    icon: <Apple className="h-5 w-5" />,
    section: "health"
  },
  {
    title: "Body Stats",
    href: "/body-stats",
    icon: <Heart className="h-5 w-5" />,
    section: "health"
  },
  {
    title: "Experts",
    href: "/experts",
    icon: <ThumbsUp className="h-5 w-5" />,
    section: "resources"
  },
  {
    title: "Community",
    href: "/community",
    icon: <Users className="h-5 w-5" />,
    section: "resources"
  },
  {
    title: "Resources",
    href: "/resources",
    icon: <FileText className="h-5 w-5" />,
    section: "resources"
  }
];