import { Program, ProgramDifficulty } from "../types/program";

export const programs: Program[] = [
  {
    id: "program-1",
    title: "Morning Momentum Master",
    description: "Transform your mornings into a powerhouse of productivity and wellness with this comprehensive morning routine program. Build the habits that the most successful performers use to start their day right.",
    durationWeeks: 4,
    category: "productivity",
    difficulty: "beginner",
    goals: [
      "Establish a consistent morning routine",
      "Boost energy levels and productivity",
      "Reduce morning stress and anxiety",
      "Set a positive tone for the entire day"
    ],
    benefits: [
      "More consistent energy throughout the day",
      "Higher productivity and focus",
      "Improved mood and mental clarity",
      "Better sleep quality from consistent wake times",
      "Increased sense of control and accomplishment"
    ],
    color: "primary",
    habits: [
      "early-wakeup",
      "meditation",
      "hydration",
      "morning-movement",
      "journaling",
      "planning"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Morning routine assessment",
        description: "Analyze your current morning habits and identify areas for improvement",
        duration: 15,
        frequency: "once",
        category: "planning"
      },
      {
        id: "task-2",
        title: "Set up a morning environment",
        description: "Prepare your space for morning success (alarm placement, outfit selection, etc.)",
        duration: 20,
        frequency: "daily",
        category: "environment"
      },
      {
        id: "task-3",
        title: "Evening routine planning",
        description: "Create an evening routine that supports your morning success",
        duration: 15,
        frequency: "daily",
        category: "planning"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "The Miracle Morning by Hal Elrod",
        type: "book",
        url: "https://www.miraclemorning.com/"
      },
      {
        id: "resource-2",
        title: "The Science of a Perfect Morning Routine",
        type: "article",
        url: "https://www.maximost.com/blog/morning-science"
      },
      {
        id: "resource-3",
        title: "5-Minute Morning Yoga Flow",
        type: "video",
        url: "https://www.maximost.com/resources/morning-yoga"
      }
    ]
  },
  {
    id: "program-2",
    title: "Sugar Liberation Protocol",
    description: "Break free from sugar addiction with this science-backed program that helps you reset your palate and eliminate cravings while maximizing energy and health outcomes.",
    durationWeeks: 6,
    category: "nutrition",
    difficulty: "intermediate",
    goals: [
      "Eliminate sugar cravings and addiction",
      "Reset taste buds to appreciate natural sweetness",
      "Stabilize energy levels throughout the day",
      "Improve overall health markers"
    ],
    benefits: [
      "Reduced inflammation throughout the body",
      "More stable energy without crashes",
      "Improved mental clarity and focus",
      "Better sleep quality",
      "Weight management",
      "Improved skin health"
    ],
    color: "warning",
    habits: [
      "no-added-sugar",
      "protein-breakfast",
      "read-labels",
      "hydration",
      "healthy-snacking",
      "meal-prep"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Kitchen clean-out",
        description: "Remove all high-sugar products from your home",
        duration: 45,
        frequency: "once",
        category: "environment"
      },
      {
        id: "task-2",
        title: "Sugar tracker setup",
        description: "Set up a system to track your daily sugar intake",
        duration: 15,
        frequency: "once",
        category: "tracking"
      },
      {
        id: "task-3",
        title: "Meal planning session",
        description: "Plan low-sugar meals for the week ahead",
        duration: 30,
        frequency: "weekly",
        category: "planning"
      },
      {
        id: "task-4",
        title: "Grocery shopping",
        description: "Shop for low-sugar foods using your prepared list",
        duration: 60,
        frequency: "weekly",
        category: "action"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "The Truth About Sugar",
        type: "article",
        url: "https://www.maximost.com/sugar-truth"
      },
      {
        id: "resource-2",
        title: "Sugar-Free Recipes E-Book",
        type: "book",
        url: "https://www.maximost.com/resources/sugar-free-recipes"
      },
      {
        id: "resource-3",
        title: "Hidden Sugar Documentary",
        type: "video",
        url: "https://www.maximost.com/resources/hidden-sugar"
      },
      {
        id: "resource-4",
        title: "Sugar Tracker App",
        type: "app",
        url: "https://www.maximost.com/resources/sugar-tracker"
      }
    ]
  },
  {
    id: "program-3",
    title: "Strength Foundation System",
    description: "Build a foundation of functional strength that will serve you for life. This program focuses on the core compound movements that deliver maximum results with minimum time investment.",
    durationWeeks: 8,
    category: "fitness",
    difficulty: "beginner",
    goals: [
      "Develop functional strength for everyday activities",
      "Learn proper form for key compound exercises",
      "Build lean muscle mass",
      "Increase metabolism and energy levels"
    ],
    benefits: [
      "Improved body composition",
      "Increased daily energy and vitality",
      "Better posture and reduced pain",
      "Enhanced confidence and body awareness",
      "Reduced risk of injury in daily life"
    ],
    color: "secondary",
    habits: [
      "strength-training",
      "protein-intake",
      "mobility-work",
      "recovery-practices",
      "sleep-optimization",
      "tracking-progress"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Fitness assessment",
        description: "Establish baseline measurements for strength and mobility",
        duration: 30,
        frequency: "bi-weekly",
        category: "assessment"
      },
      {
        id: "task-2",
        title: "Learn the squat",
        description: "Master proper form for the fundamental squat pattern",
        duration: 20,
        frequency: "weekly",
        category: "skill"
      },
      {
        id: "task-3", 
        title: "Learn the hinge",
        description: "Master proper form for the hip hinge pattern",
        duration: 20,
        frequency: "weekly",
        category: "skill"
      },
      {
        id: "task-4",
        title: "Learn the push",
        description: "Master proper form for horizontal and vertical pushing",
        duration: 20,
        frequency: "weekly",
        category: "skill"
      },
      {
        id: "task-5",
        title: "Learn the pull",
        description: "Master proper form for horizontal and vertical pulling",
        duration: 20,
        frequency: "weekly",
        category: "skill"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "The Fundamentals of Strength Training",
        type: "article",
        url: "https://www.maximost.com/strength-fundamentals"
      },
      {
        id: "resource-2",
        title: "Proper Form Video Series",
        type: "video",
        url: "https://www.maximost.com/resources/form-videos"
      },
      {
        id: "resource-3",
        title: "Mobility Routine for Strength Training",
        type: "workout",
        url: "https://www.maximost.com/resources/mobility-routine"
      },
      {
        id: "resource-4",
        title: "Starting Strength by Mark Rippetoe",
        type: "book"
      }
    ]
  },
  {
    id: "program-4",
    title: "Mental Clarity Protocol",
    description: "Sharpen your mind and develop a clear, focused thinking process through a combination of meditation, journaling, and cognitive practices that build mental resilience.",
    durationWeeks: 6,
    category: "mind",
    difficulty: "beginner",
    goals: [
      "Establish a consistent meditation practice",
      "Reduce mental clutter and overthinking",
      "Improve focus and attention span",
      "Develop better thought awareness and mental discipline"
    ],
    benefits: [
      "Reduced stress and anxiety",
      "Improved decision-making abilities",
      "Enhanced creativity and problem-solving",
      "Better emotional regulation",
      "Increased productivity through focused attention"
    ],
    color: "progress",
    habits: [
      "meditation",
      "journaling",
      "digital-detox",
      "reading",
      "focused-work",
      "nature-exposure"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Meditation space setup",
        description: "Create a dedicated space for your daily meditation practice",
        duration: 30,
        frequency: "once",
        category: "environment"
      },
      {
        id: "task-2",
        title: "Digital detox planning",
        description: "Identify and schedule regular periods without digital distractions",
        duration: 20,
        frequency: "weekly",
        category: "planning"
      },
      {
        id: "task-3",
        title: "Journal prompt selection",
        description: "Choose daily journaling prompts for the week ahead",
        duration: 15,
        frequency: "weekly",
        category: "planning"
      },
      {
        id: "task-4",
        title: "Reading selection",
        description: "Choose books or articles that nourish your mind",
        duration: 20,
        frequency: "weekly",
        category: "planning"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "The Science of Meditation",
        type: "article",
        url: "https://www.maximost.com/meditation-science"
      },
      {
        id: "resource-2",
        title: "Guided Meditation Library",
        type: "app",
        url: "https://www.maximost.com/resources/guided-meditations"
      },
      {
        id: "resource-3",
        title: "Journaling for Mental Clarity",
        type: "article",
        url: "https://www.maximost.com/journaling-guide"
      },
      {
        id: "resource-4",
        title: "The Power of Full Engagement by Jim Loehr",
        type: "book"
      }
    ]
  },
  {
    id: "program-5",
    title: "Sleep Optimization System",
    description: "Transform your sleep quality through evidence-based practices that ensure deep, restorative rest. This program rebuilds your sleep foundation from the ground up.",
    durationWeeks: 4,
    category: "sleep",
    difficulty: "beginner",
    goals: [
      "Establish consistent sleep and wake times",
      "Create an optimal sleep environment",
      "Develop a relaxing pre-sleep routine",
      "Eliminate factors that disturb quality sleep"
    ],
    benefits: [
      "Improved energy and mental clarity",
      "Enhanced mood and emotional resilience",
      "Better recovery from physical training",
      "Strengthened immune function",
      "Improved cognitive performance and memory"
    ],
    color: "primary",
    habits: [
      "consistent-sleep-schedule",
      "evening-routine",
      "no-screens-before-bed",
      "bedroom-optimization",
      "morning-sunlight",
      "sleep-tracking"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Sleep environment assessment",
        description: "Evaluate and optimize your bedroom for quality sleep",
        duration: 45,
        frequency: "once",
        category: "environment"
      },
      {
        id: "task-2",
        title: "Sleep tracker setup",
        description: "Set up a system to track your sleep quality and patterns",
        duration: 20,
        frequency: "once",
        category: "tracking"
      },
      {
        id: "task-3",
        title: "Evening routine design",
        description: "Create a calming pre-sleep routine",
        duration: 30,
        frequency: "once",
        category: "planning"
      },
      {
        id: "task-4",
        title: "Sleep journal",
        description: "Record factors affecting your sleep quality",
        duration: 5,
        frequency: "daily",
        category: "tracking"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "Why We Sleep by Matthew Walker",
        type: "book"
      },
      {
        id: "resource-2",
        title: "The Science of Perfect Sleep",
        type: "article",
        url: "https://www.maximost.com/sleep-science"
      },
      {
        id: "resource-3",
        title: "Evening Relaxation Audio",
        type: "app",
        url: "https://www.maximost.com/resources/sleep-audio"
      },
      {
        id: "resource-4",
        title: "Sleep Environment Checklist",
        type: "article",
        url: "https://www.maximost.com/resources/sleep-environment"
      }
    ]
  },
  {
    id: "program-6",
    title: "Performance Nutrition Blueprint",
    description: "Fuel your body for optimal performance and recovery with this science-backed approach to nutrition that focuses on quality, timing, and personalization.",
    durationWeeks: 6,
    category: "nutrition",
    difficulty: "intermediate",
    goals: [
      "Develop a sustainable, performance-oriented eating pattern",
      "Optimize meal timing for energy and recovery",
      "Understand your individual nutritional needs",
      "Build a practical meal prep system"
    ],
    benefits: [
      "Consistent energy throughout the day",
      "Enhanced workout performance",
      "Improved recovery between sessions",
      "Better body composition",
      "Reduced food-related stress"
    ],
    color: "warning",
    habits: [
      "protein-priority",
      "vegetable-intake",
      "meal-preparation",
      "strategic-carbohydrates",
      "hydration-protocol",
      "nutrition-tracking"
    ],
    tasks: [
      {
        id: "task-1",
        title: "Nutrition assessment",
        description: "Analyze your current eating patterns and identify improvement areas",
        duration: 30,
        frequency: "once",
        category: "assessment"
      },
      {
        id: "task-2",
        title: "Kitchen restocking",
        description: "Replace low-quality foods with performance-oriented options",
        duration: 90,
        frequency: "once",
        category: "environment"
      },
      {
        id: "task-3",
        title: "Meal prep session",
        description: "Prepare key components for the week's meals",
        duration: 60,
        frequency: "weekly",
        category: "action"
      },
      {
        id: "task-4",
        title: "Nutrition log review",
        description: "Analyze patterns and make adjustments to your nutrition plan",
        duration: 20,
        frequency: "weekly",
        category: "assessment"
      }
    ],
    resources: [
      {
        id: "resource-1",
        title: "Performance Nutrition Fundamentals",
        type: "article",
        url: "https://www.maximost.com/nutrition-fundamentals"
      },
      {
        id: "resource-2",
        title: "Meal Prep Mastery Guide",
        type: "article",
        url: "https://www.maximost.com/meal-prep-guide"
      },
      {
        id: "resource-3",
        title: "Performance Recipe Collection",
        type: "recipe",
        url: "https://www.maximost.com/resources/performance-recipes"
      },
      {
        id: "resource-4",
        title: "Nutrition Tracker App",
        type: "app",
        url: "https://www.maximost.com/resources/nutrition-tracker"
      }
    ]
  }
];

// Function to match programs based on recommendation criteria
export function matchProgramsToGoal(criteria: any): Program[] {
  const { goalType, secondaryGoals, timeCommitment, difficulty, preferences } = criteria;
  
  // First filter by primary goal and difficulty
  let matches = programs.filter(program => {
    const matchesDifficulty = program.difficulty === difficulty;
    const matchesGoal = program.goals.some(
      goal => goal.toLowerCase().includes(goalType.toLowerCase())
    );
    
    return matchesDifficulty && matchesGoal;
  });
  
  // If we have very few matches, try with just the goal
  if (matches.length < 2) {
    matches = programs.filter(program => 
      program.goals.some(goal => goal.toLowerCase().includes(goalType.toLowerCase()))
    );
  }
  
  // If still no matches, return first three programs as fallback
  if (matches.length === 0) {
    return programs.slice(0, 3);
  }
  
  // Score the matches by secondary criteria
  const scoredMatches = matches.map(program => {
    let score = 0;
    
    // Add points for matching secondary goals
    secondaryGoals.forEach(secondaryGoal => {
      if (program.goals.some(goal => goal.toLowerCase().includes(secondaryGoal.toLowerCase()))) {
        score += 2;
      }
    });
    
    // Add points for matching preferences
    preferences.forEach(preference => {
      if (program.description.toLowerCase().includes(preference.toLowerCase())) {
        score += 1;
      }
    });
    
    return {
      program,
      score
    };
  });
  
  // Sort by score (descending) and return the programs
  return scoredMatches
    .sort((a, b) => b.score - a.score)
    .map(item => item.program);
}