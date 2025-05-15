import { Program, ProgramGoalCategory, FitnessLevel, TimeCommitment, RecommendationCriteria } from "../types/program";
import { Dumbbell, Heart, Brain, Utensils, Flame, Timer, Scale, Hourglass } from "lucide-react";

// Sample program data
export const programs: Program[] = [
  {
    id: "program-1",
    name: "Weight Loss Essentials",
    description: "A balanced program focused on sustainable weight loss through nutrition and moderate exercise.",
    primaryGoal: "weight-loss",
    supportedGoals: ["weight-loss", "health-optimization"],
    fitnessLevel: ["beginner", "intermediate"],
    timeCommitment: "moderate",
    durationWeeks: 8,
    habitIds: [
      "daily-water-intake", 
      "calorie-tracking", 
      "daily-walk", 
      "sugar-reduction", 
      "portion-control"
    ],
    imageUrl: "/assets/weight-loss-program.jpg"
  },
  {
    id: "program-2",
    name: "Muscle Building Fundamentals",
    description: "Build lean muscle mass through progressive strength training and proper nutrition.",
    primaryGoal: "muscle-gain",
    supportedGoals: ["muscle-gain", "performance"],
    fitnessLevel: ["beginner", "intermediate"],
    timeCommitment: "high",
    durationWeeks: 12,
    habitIds: [
      "strength-training", 
      "protein-intake", 
      "sleep-optimization", 
      "progressive-overload", 
      "post-workout-nutrition"
    ],
    imageUrl: "/assets/muscle-building-program.jpg"
  },
  {
    id: "program-3",
    name: "Vitality & Longevity",
    description: "Optimize your health through targeted habits that promote longevity and disease prevention.",
    primaryGoal: "health-optimization",
    supportedGoals: ["health-optimization", "stress-reduction"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "moderate",
    durationWeeks: 12,
    habitIds: [
      "mediterranean-diet", 
      "daily-movement", 
      "stress-management", 
      "sleep-hygiene", 
      "intermittent-fasting"
    ],
    imageUrl: "/assets/health-optimization-program.jpg"
  },
  {
    id: "program-4",
    name: "Peak Performance",
    description: "Enhance your athletic performance through advanced training techniques and recovery strategies.",
    primaryGoal: "performance",
    supportedGoals: ["performance", "muscle-gain"],
    fitnessLevel: ["intermediate", "advanced"],
    timeCommitment: "high",
    durationWeeks: 16,
    habitIds: [
      "interval-training", 
      "mobility-work", 
      "recovery-protocols", 
      "performance-nutrition", 
      "mental-conditioning"
    ],
    imageUrl: "/assets/peak-performance-program.jpg"
  },
  {
    id: "program-5",
    name: "Deep Focus & Productivity",
    description: "Optimize your mental clarity and work productivity through strategic habits and routines.",
    primaryGoal: "focus-productivity",
    supportedGoals: ["focus-productivity", "stress-reduction"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "minimal",
    durationWeeks: 6,
    habitIds: [
      "morning-routine", 
      "pomodoro-technique", 
      "digital-detox", 
      "mindfulness-practice", 
      "evening-planning"
    ],
    imageUrl: "/assets/focus-productivity-program.jpg"
  },
  {
    id: "program-6",
    name: "Stress Management & Resilience",
    description: "Build resilience and effectively manage stress through evidence-based techniques and practices.",
    primaryGoal: "stress-reduction",
    supportedGoals: ["stress-reduction", "sleep-improvement"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "minimal",
    durationWeeks: 8,
    habitIds: [
      "meditation-practice", 
      "nature-exposure", 
      "journaling", 
      "breathing-techniques", 
      "boundary-setting"
    ],
    imageUrl: "/assets/stress-management-program.jpg"
  },
  {
    id: "program-7",
    name: "Deep Sleep Optimization",
    description: "Transform your sleep quality and wake up refreshed through science-backed sleep enhancement strategies.",
    primaryGoal: "sleep-improvement",
    supportedGoals: ["sleep-improvement", "health-optimization"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "minimal",
    durationWeeks: 4,
    habitIds: [
      "sleep-schedule", 
      "evening-routine", 
      "blue-light-management", 
      "bedroom-optimization", 
      "caffeine-management"
    ],
    imageUrl: "/assets/sleep-program.jpg"
  },
  {
    id: "program-8",
    name: "Anti-Sugar Protocol",
    description: "Break free from sugar addiction and regain control over cravings with this structured approach.",
    primaryGoal: "health-optimization",
    supportedGoals: ["health-optimization", "weight-loss"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "moderate",
    durationWeeks: 6,
    habitIds: [
      "sugar-elimination", 
      "whole-foods-focus", 
      "hunger-awareness", 
      "healthy-snack-preparation", 
      "label-reading"
    ],
    imageUrl: "/assets/anti-sugar-program.jpg"
  },
  {
    id: "program-9",
    name: "Beginner Fitness Kickstart",
    description: "The perfect starting point for fitness newcomers focusing on building sustainable exercise habits.",
    primaryGoal: "performance",
    supportedGoals: ["health-optimization", "weight-loss"],
    fitnessLevel: ["beginner"],
    timeCommitment: "minimal",
    durationWeeks: 4,
    habitIds: [
      "daily-walking", 
      "basic-stretching", 
      "hydration", 
      "standing-breaks", 
      "bodyweight-exercises"
    ],
    imageUrl: "/assets/beginner-fitness-program.jpg"
  },
  {
    id: "program-10",
    name: "Mind-Body Balance",
    description: "Integrate mental and physical wellness practices for a holistic approach to health and wellbeing.",
    primaryGoal: "stress-reduction",
    supportedGoals: ["stress-reduction", "focus-productivity", "health-optimization"],
    fitnessLevel: ["beginner", "intermediate", "advanced"],
    timeCommitment: "moderate",
    durationWeeks: 8,
    habitIds: [
      "yoga-practice", 
      "mindful-eating", 
      "gratitude-practice", 
      "nature-connection", 
      "tech-free-time"
    ],
    imageUrl: "/assets/mind-body-program.jpg"
  }
];

// Icons for program goals
export const goalIcons = {
  "weight-loss": Flame,
  "muscle-gain": Dumbbell,
  "health-optimization": Heart,
  "performance": Dumbbell,
  "focus-productivity": Brain,
  "stress-reduction": Heart,
  "sleep-improvement": Heart
};

// Labels for program goals
export const goalLabels = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  "health-optimization": "Health Optimization",
  "performance": "Athletic Performance",
  "focus-productivity": "Focus & Productivity",
  "stress-reduction": "Stress Management",
  "sleep-improvement": "Sleep Improvement"
};

// Labels for fitness levels
export const fitnessLevelLabels = {
  "beginner": "Beginner",
  "intermediate": "Intermediate",
  "advanced": "Advanced"
};

// Labels for time commitments
export const timeCommitmentLabels = {
  "minimal": "Minimal (15-30 min/day)",
  "moderate": "Moderate (30-60 min/day)",
  "high": "High (60+ min/day)"
};

// Icons for time commitments
export const timeCommitmentIcons = {
  "minimal": Timer,
  "moderate": Hourglass,
  "high": Scale
};

/**
 * Calculate recommendation score for a program based on user criteria
 * Higher score means better match
 */
export function calculateRecommendationScore(program: Program, criteria: RecommendationCriteria): number {
  let score = 0;
  
  // Primary goal match is most important
  if (program.primaryGoal === criteria.primaryGoal) {
    score += 50;
  } else if (program.supportedGoals.includes(criteria.primaryGoal)) {
    score += 30;
  }
  
  // Secondary goal match
  if (criteria.secondaryGoal && program.supportedGoals.includes(criteria.secondaryGoal)) {
    score += 20;
  }
  
  // Fitness level match
  if (program.fitnessLevel.includes(criteria.fitnessLevel)) {
    score += 15;
  } else {
    // Penalize if fitness level is too advanced
    if (criteria.fitnessLevel === 'beginner' && 
        !program.fitnessLevel.includes('beginner') && 
        program.fitnessLevel.includes('advanced')) {
      score -= 20;
    }
  }
  
  // Time commitment match
  if (program.timeCommitment === criteria.timeCommitment) {
    score += 15;
  } else {
    // Penalize mismatch based on difference
    const commitmentLevels = ['minimal', 'moderate', 'high'];
    const programIndex = commitmentLevels.indexOf(program.timeCommitment);
    const criteriaIndex = commitmentLevels.indexOf(criteria.timeCommitment);
    const diff = Math.abs(programIndex - criteriaIndex);
    score -= diff * 5;
  }
  
  return score;
}

/**
 * Get personalized program recommendations based on user criteria
 */
export function getRecommendedPrograms(criteria: RecommendationCriteria): Program[] {
  return programs
    .map(program => ({
      ...program,
      recommendationScore: calculateRecommendationScore(program, criteria)
    }))
    .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));
}