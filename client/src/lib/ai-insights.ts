import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Habit, HabitCompletion } from "@/types/habit";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface HabitInsight {
  type: 'success' | 'warning' | 'tip' | 'suggestion';
  title: string;
  message: string;
  habitIds?: string[]; // Related habits
}

export interface HabitAnalysis {
  insights: HabitInsight[];
  overallScore: number; // 0-100
  strengthAreas: string[];
  improvementAreas: string[];
  recommendation: string;
}

/**
 * Analyze habits and generate insights based on completion patterns
 */
export async function generateHabitInsights(
  habits: Habit[],
  completions: HabitCompletion[],
  timeframe: 'week' | 'month' = 'week'
): Promise<HabitAnalysis> {
  try {
    // Prepare data for analysis
    const completionData = habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitId === habit.id);
      const completionRate = calculateCompletionRate(habit, habitCompletions, timeframe);
      
      return {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        category: habit.category,
        frequency: habit.frequency,
        impact: habit.impact,
        effort: habit.effort,
        isAbsolute: habit.isAbsolute,
        streak: habit.streak,
        completionRate: completionRate,
      };
    });

    // Structure data for the AI
    const analysisData = {
      habits: completionData,
      timeframe,
    };

    // Create prompt for the AI
    const prompt = `
    As a habit and personal development expert, analyze this habit data and provide insights:
    ${JSON.stringify(analysisData, null, 2)}
    
    Based on this data, please provide:
    1. 3-5 specific insights about habit patterns (identify successful habits, struggling habits, and strategic opportunities)
    2. An overall score (0-100) based on habit completion rates, weighted by impact scores
    3. Key areas of strength (categories or specific habits doing well)
    4. Areas for improvement
    5. One specific, actionable recommendation to improve results
    
    Format your response as a JSON object with the following structure:
    {
      "insights": [
        {
          "type": "success | warning | tip | suggestion",
          "title": "Brief insight title",
          "message": "Detailed explanation with specific advice",
          "habitIds": ["related-habit-ids"] (optional)
        }
      ],
      "overallScore": number,
      "strengthAreas": ["area1", "area2"],
      "improvementAreas": ["area1", "area2"],
      "recommendation": "Strategic recommendation"
    }
    
    Focus on principles like habit stacking, friction reduction, identity-based habits, and the compound effect of small changes.
    `;
    
    // Get response from AI
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonResponseMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonResponseMatch) {
      throw new Error("Could not parse AI response as JSON");
    }
    
    const jsonResponse = JSON.parse(jsonResponseMatch[0]);
    
    return {
      insights: jsonResponse.insights || [],
      overallScore: jsonResponse.overallScore || 0,
      strengthAreas: jsonResponse.strengthAreas || [],
      improvementAreas: jsonResponse.improvementAreas || [],
      recommendation: jsonResponse.recommendation || ""
    };
  } catch (error) {
    console.error("Error generating habits insights:", error);
    return {
      insights: [
        {
          type: 'warning',
          title: 'Analysis unavailable',
          message: 'We encountered an issue analyzing your habits. Please try again later.'
        }
      ],
      overallScore: 0,
      strengthAreas: [],
      improvementAreas: [],
      recommendation: "Try again later when more habit data is available."
    };
  }
}

/**
 * Calculate the completion rate for a habit based on frequency
 */
function calculateCompletionRate(
  habit: Habit,
  completions: HabitCompletion[],
  timeframe: 'week' | 'month'
): number {
  // Determine the time period to analyze
  const now = new Date();
  const startDate = new Date();
  if (timeframe === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setDate(now.getDate() - 30);
  }
  
  // Filter completions within the time period
  const recentCompletions = completions.filter(c => {
    const completionDate = new Date(c.date);
    return completionDate >= startDate && completionDate <= now;
  });
  
  // Determine expected completions based on frequency
  let expectedCount = 0;
  const dayDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (habit.frequency) {
    case 'daily':
      expectedCount = dayDiff;
      break;
    case 'weekly':
      expectedCount = Math.ceil(dayDiff / 7);
      break;
    case '2x-week':
      expectedCount = Math.ceil(dayDiff / 3.5);
      break;
    case '3x-week':
      expectedCount = Math.ceil(dayDiff / 2.33);
      break;
    case '4x-week':
      expectedCount = Math.ceil(dayDiff / 1.75);
      break;
    default:
      expectedCount = dayDiff;
  }
  
  // Calculate completion rate
  const actualCompletions = recentCompletions.filter(c => c.completed).length;
  return expectedCount > 0 ? Math.min(100, (actualCompletions / expectedCount) * 100) : 0;
}

/**
 * Get habit recommendations based on current habits
 */
export async function getHabitRecommendations(
  habits: Habit[]
): Promise<{ title: string; description: string; category: string; impact: number }[]> {
  try {
    const habitCategories = habits.map(h => h.category);
    const uniqueCategories = Array.from(new Set(habitCategories));
    
    // Create prompt for the AI
    const prompt = `
    Based on these existing habit categories: ${JSON.stringify(uniqueCategories)},
    suggest 3 new, high-impact habits that would complement the user's existing habits.
    
    For each habit suggestion, provide:
    1. A clear, actionable title
    2. A brief description explaining the benefits
    3. The appropriate category
    4. An impact score from 1-10
    
    Format your response as a JSON array of habit objects:
    [
      {
        "title": "Habit title",
        "description": "Brief description of benefits",
        "category": "health|fitness|mind|social",
        "impact": number
      }
    ]
    
    Focus on habits that provide maximum value while requiring minimal effort.
    `;
    
    // Get response from AI
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonResponseMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonResponseMatch) {
      throw new Error("Could not parse AI response as JSON");
    }
    
    return JSON.parse(jsonResponseMatch[0]);
  } catch (error) {
    console.error("Error generating habit recommendations:", error);
    return [];
  }
}