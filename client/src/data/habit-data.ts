import { Habit } from "../types/habit";

export interface HabitStack {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  habits: Habit[];
}

// Health habits
const healthHabits: Habit[] = [
  {
    id: "h1",
    title: "Drink 8 glasses of water",
    description: "Stay hydrated throughout the day",
    icon: "Droplet",
    iconColor: "blue",
    impact: 8,
    effort: 3,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: true,
    category: "health",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "h2",
    title: "Take vitamins",
    description: "Take your daily supplements",
    icon: "Pill",
    iconColor: "yellow",
    impact: 7,
    effort: 2,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: false,
    category: "health",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "h3",
    title: "Eat vegetables",
    description: "Include vegetables in at least two meals",
    icon: "Salad",
    iconColor: "green",
    impact: 9,
    effort: 4,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: true,
    category: "health",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "h4",
    title: "No sugar",
    description: "Avoid added sugars and sweetened drinks",
    icon: "XCircle",
    iconColor: "red",
    impact: 9,
    effort: 7,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: true,
    category: "health",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "h5",
    title: "Intermittent fasting",
    description: "16:8 fasting window",
    icon: "Clock",
    iconColor: "purple",
    impact: 8,
    effort: 6,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: false,
    category: "health",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "h6",
    title: "Track nutrition",
    description: "Log all meals and snacks",
    icon: "ClipboardList",
    iconColor: "orange",
    impact: 7,
    effort: 5,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: false,
    category: "health",
    streak: 0,
    createdAt: new Date()
  }
];

// Fitness habits
const fitnessHabits: Habit[] = [
  {
    id: "f1",
    title: "Workout",
    description: "Complete a planned workout",
    icon: "Dumbbell",
    iconColor: "red",
    impact: 9,
    effort: 8,
    timeCommitment: "high",
    frequency: "3x-week",
    isAbsolute: false,
    category: "fitness",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "f2",
    title: "10,000 steps",
    description: "Walk at least 10,000 steps",
    icon: "Footprints",
    iconColor: "green",
    impact: 7,
    effort: 5,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: false,
    category: "fitness",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "f3",
    title: "Stretching",
    description: "5-10 minutes of stretching",
    icon: "Armchair",
    iconColor: "blue",
    impact: 6,
    effort: 3,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: false,
    category: "fitness",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "f4",
    title: "Strength training",
    description: "Focus on resistance exercises",
    icon: "Hammer",
    iconColor: "orange",
    impact: 9,
    effort: 7,
    timeCommitment: "high",
    frequency: "3x-week",
    isAbsolute: false,
    category: "fitness",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "f5",
    title: "Cardio session",
    description: "20+ minutes of elevated heart rate",
    icon: "Heart",
    iconColor: "red",
    impact: 8,
    effort: 7,
    timeCommitment: "moderate",
    frequency: "3x-week",
    isAbsolute: false,
    category: "fitness",
    streak: 0,
    createdAt: new Date()
  }
];

// Mind habits
const mindHabits: Habit[] = [
  {
    id: "m1",
    title: "Meditation",
    description: "10 minutes of mindful meditation",
    icon: "Brain",
    iconColor: "purple",
    impact: 8,
    effort: 4,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: true,
    category: "mind",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "m2",
    title: "Journaling",
    description: "Write daily thoughts and reflections",
    icon: "BookOpen",
    iconColor: "blue",
    impact: 7,
    effort: 4,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "m3",
    title: "Reading",
    description: "Read for at least 20 minutes",
    icon: "Book",
    iconColor: "yellow",
    impact: 6,
    effort: 3,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "m4",
    title: "Digital detox",
    description: "No screens 1 hour before bed",
    icon: "PhoneOff",
    iconColor: "gray",
    impact: 8,
    effort: 6,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "m5",
    title: "Gratitude practice",
    description: "List 3 things you're grateful for",
    icon: "Heart",
    iconColor: "pink",
    impact: 7,
    effort: 2,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date()
  }
];

// Routine habits
const routineHabits: Habit[] = [
  {
    id: "r1",
    title: "Early wake-up",
    description: "Wake up by 6:00 AM",
    icon: "Sun",
    iconColor: "yellow",
    impact: 8,
    effort: 7,
    timeCommitment: "minimal",
    frequency: "daily",
    isAbsolute: true,
    category: "routine",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "r2",
    title: "Sleep 7-8 hours",
    description: "Get adequate sleep each night",
    icon: "Moon",
    iconColor: "purple",
    impact: 9,
    effort: 6,
    timeCommitment: "high",
    frequency: "daily",
    isAbsolute: true,
    category: "routine",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "r3",
    title: "Morning routine",
    description: "Complete your morning routine",
    icon: "Sunrise",
    iconColor: "orange",
    impact: 8,
    effort: 5,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: true,
    category: "routine",
    streak: 0,
    createdAt: new Date()
  },
  {
    id: "r4",
    title: "Evening routine",
    description: "Complete your evening routine",
    icon: "Sunset",
    iconColor: "red",
    impact: 7,
    effort: 4,
    timeCommitment: "moderate",
    frequency: "daily",
    isAbsolute: false,
    category: "routine",
    streak: 0,
    createdAt: new Date()
  }
];

// Habit Stacks
const habitStacks: HabitStack[] = [
  {
    id: "stack-1",
    title: "Morning Power Stack",
    description: "Start your day with high-impact habits",
    icon: "Sunrise",
    iconColor: "yellow",
    habits: [
      {
        id: "ms-1",
        title: "Early wake-up",
        description: "Wake up by 6:00 AM",
        icon: "Sun",
        iconColor: "yellow",
        impact: 8,
        effort: 7,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: true,
        category: "routine",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ms-2",
        title: "Meditation",
        description: "10 minutes of mindful meditation",
        icon: "Brain",
        iconColor: "purple",
        impact: 8,
        effort: 4,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: true,
        category: "mind",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ms-3",
        title: "Drink water",
        description: "16oz of water first thing in the morning",
        icon: "Droplet",
        iconColor: "blue",
        impact: 7,
        effort: 2,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: true,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ms-4",
        title: "Movement",
        description: "5-10 minutes of light exercise or stretching",
        icon: "Activity",
        iconColor: "green",
        impact: 7,
        effort: 4,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "fitness",
        streak: 0,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "stack-2",
    title: "Evening Wind-Down Stack",
    description: "Optimize your evening for better sleep and recovery",
    icon: "Moon",
    iconColor: "purple",
    habits: [
      {
        id: "es-1",
        title: "Digital detox",
        description: "No screens 1 hour before bed",
        icon: "PhoneOff",
        iconColor: "gray",
        impact: 8,
        effort: 6,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "mind",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "es-2",
        title: "Reading",
        description: "Read a physical book for 20 minutes",
        icon: "Book",
        iconColor: "blue",
        impact: 6,
        effort: 3,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "mind",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "es-3",
        title: "Gratitude practice",
        description: "List 3 things you're grateful for",
        icon: "Heart",
        iconColor: "pink",
        impact: 7,
        effort: 2,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "mind",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "es-4",
        title: "Prepare for tomorrow",
        description: "Set out clothes and plan for the next day",
        icon: "Check",
        iconColor: "green",
        impact: 7,
        effort: 3,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "routine",
        streak: 0,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "stack-3",
    title: "Mind-Body Performance Stack",
    description: "Enhance physical and mental performance",
    icon: "Zap",
    iconColor: "orange",
    habits: [
      {
        id: "ps-1",
        title: "Strength training",
        description: "Focus on resistance exercises",
        icon: "Dumbbell",
        iconColor: "red",
        impact: 9,
        effort: 7,
        timeCommitment: "high",
        frequency: "3x-week",
        isAbsolute: false,
        category: "fitness",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ps-2",
        title: "Protein-rich meal",
        description: "Consume adequate protein with each meal",
        icon: "Egg",
        iconColor: "yellow",
        impact: 8,
        effort: 5,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ps-3",
        title: "Cold exposure",
        description: "Cold shower or ice bath",
        icon: "Snowflake",
        iconColor: "blue",
        impact: 7,
        effort: 8,
        timeCommitment: "minimal",
        frequency: "3x-week",
        isAbsolute: false,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "ps-4",
        title: "Focus block",
        description: "25-min focused work session (Pomodoro)",
        icon: "Timer",
        iconColor: "purple",
        impact: 8,
        effort: 6,
        timeCommitment: "moderate",
        frequency: "daily",
        isAbsolute: false,
        category: "mind",
        streak: 0,
        createdAt: new Date()
      }
    ]
  },
  {
    id: "stack-4",
    title: "Anti-Sugar Stack",
    description: "Break free from sugar addiction and cravings",
    icon: "XCircle",
    iconColor: "red",
    habits: [
      {
        id: "as-1",
        title: "No added sugar",
        description: "Avoid all foods with added sugar",
        icon: "XCircle",
        iconColor: "red",
        impact: 9,
        effort: 8,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: true,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "as-2",
        title: "Protein breakfast",
        description: "High-protein breakfast within 30 min of waking",
        icon: "Egg",
        iconColor: "yellow",
        impact: 8,
        effort: 5,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "as-3",
        title: "Drink water",
        description: "Drink at least 8 glasses of water daily",
        icon: "Droplet",
        iconColor: "blue",
        impact: 7,
        effort: 3,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: true,
        category: "health",
        streak: 0,
        createdAt: new Date()
      },
      {
        id: "as-4",
        title: "Read food labels",
        description: "Check sugar content in all packaged foods",
        icon: "Search",
        iconColor: "purple",
        impact: 7,
        effort: 4,
        timeCommitment: "minimal",
        frequency: "daily",
        isAbsolute: false,
        category: "health",
        streak: 0,
        createdAt: new Date()
      }
    ]
  }
];

// Export all habit suggestions
export const habitSuggestions = {
  health: healthHabits,
  fitness: fitnessHabits,
  mind: mindHabits,
  habits: routineHabits,
  stacks: habitStacks
};