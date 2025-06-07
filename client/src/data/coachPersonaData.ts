import { LucideIcon } from "lucide-react"; // Optional: for typing icon components if passed directly

// Define an interface for the Coach Persona data structure
export interface CoachPersona {
  id: string;
  name: string; // e.g., "Stoic", "Operator", "Nurturer"
  title: string; // e.g., "The Stoic Coach"
  description: string;
  iconName: string; // Key for a Lucide icon e.g., "Scale", "Shield", "Sprout"
  iconColor: string; // Tailwind CSS class for icon color e.g., "text-blue-600"
  cardBgColor?: string; // Optional Tailwind CSS class for card background
  borderColor?: string; // Optional Tailwind CSS class for card border
  sampleQuote: string;
}

export const coachPersonaData: CoachPersona[] = [
  {
    id: "stoic",
    name: "The Stoic",
    title: "The Stoic Coach",
    description: "Calm, reflective, and logical. This coach focuses on building inner resilience by emphasizing the \"dichotomy of control\" (what you can vs. cannot control) and reframing obstacles as opportunities for growth. The core principle is that true victory lies in virtuous, disciplined action, regardless of external outcomes.",
    iconName: "Scale", // Lucide icon suggestion: Scale, Library, Brain, Anchor
    iconColor: "text-blue-600", // Deep, wise blues
    cardBgColor: "bg-blue-50 dark:bg-blue-900/10",
    borderColor: "border-blue-200 dark:border-blue-700",
    sampleQuote: "Focus on your actions, not the fruits of your actions. Therein lies tranquility.",
  },
  {
    id: "operator",
    name: "The Operator",
    title: "The Operator Coach",
    description: "Direct, intense, and action-oriented. Inspired by disciplined leaders like Jocko Willink and the mental toughness of David Goggins, this coach emphasizes extreme ownership, discipline over motivation, and embracing discomfort to \"callous the mind\". The focus is on executing the mission, no excuses.",
    iconName: "Shield", // Lucide icon suggestion: Shield, Zap, TrendingUp, Target, Compass
    iconColor: "text-green-600", // Military greens (olive drab) - using a slightly more vibrant green for UI
    cardBgColor: "bg-green-50 dark:bg-green-900/10",
    borderColor: "border-green-200 dark:border-green-700",
    sampleQuote: "Discipline equals freedom. Execute the plan. No excuses.",
  },
  {
    id: "nurturer",
    name: "The Nurturer",
    title: "The Nurturer Coach",
    description: "Encouraging, empathetic, and supportive. This coach uses principles from positive psychology and compassion-based coaching to foster a growth mindset. It celebrates effort over perfection, validates feelings, and builds confidence through positive reinforcement. The focus is on sustainable progress through self-kindness.",
    iconName: "Sprout", // Lucide icon suggestion: Sprout, Heart, Smile, Users, Award
    iconColor: "text-yellow-500", // Warm, earthy greens; soft teals; sunlit yellows or oranges
    cardBgColor: "bg-yellow-50 dark:bg-yellow-800/10", // Using a light yellow
    borderColor: "border-yellow-200 dark:border-yellow-600",
    sampleQuote: "Every small step is progress. Be kind to yourself on this journey.",
  },
];
