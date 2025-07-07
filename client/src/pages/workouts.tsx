// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
// import { useState } from "react"; // Removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutPlan {
  day: string;
  title: string;
  type: string;
  description: string;
  exercises: WorkoutExercise[];
}

export default function Workouts() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed
  
  const workoutPlans: WorkoutPlan[] = [
    {
      day: "Monday",
      title: "Upper Body Push",
      type: "Strength",
      description: "Focus on chest, shoulders, and triceps",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" }
      ]
    },
    {
      day: "Tuesday",
      title: "Lower Body",
      type: "Strength",
      description: "Focus on quads, hamstrings, and glutes",
      exercises: [
        { name: "Squats", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Romanian Deadlifts", sets: 3, reps: "8-10", rest: "2 min" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "90 sec" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Calf Raises", sets: 4, reps: "15-20", rest: "60 sec" }
      ]
    },
    {
      day: "Wednesday",
      title: "Active Recovery",
      type: "Cardio",
      description: "Zone 2 cardio for recovery and fat burning",
      exercises: [
        { name: "Slow Jogging or Brisk Walking", sets: 1, reps: "30-45 min", rest: "N/A" },
        { name: "Light Mobility Work", sets: 1, reps: "10-15 min", rest: "N/A" },
        { name: "Stretching", sets: 1, reps: "10-15 min", rest: "N/A" }
      ]
    },
    {
      day: "Thursday",
      title: "Upper Body Pull",
      type: "Strength",
      description: "Focus on back and biceps",
      exercises: [
        { name: "Pull-Ups", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Barbell Rows", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Lat Pulldowns", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Bicep Curls", sets: 3, reps: "10-12", rest: "60 sec" }
      ]
    },
    {
      day: "Friday",
      title: "Full Body",
      type: "Strength",
      description: "Compound movements for total body strength",
      exercises: [
        { name: "Deadlifts", sets: 4, reps: "5-6", rest: "2-3 min" },
        { name: "Push Press", sets: 3, reps: "6-8", rest: "2 min" },
        { name: "Chin-Ups", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Dumbbell Lunges", sets: 3, reps: "8 each leg", rest: "90 sec" },
        { name: "Plank", sets: 3, reps: "45-60 sec", rest: "60 sec" }
      ]
    },
    {
      day: "Saturday",
      title: "HIIT Training",
      type: "Cardio",
      description: "High intensity intervals for cardiovascular health and fat loss",
      exercises: [
        { name: "Sprints (30 sec on, 90 sec off)", sets: 8, reps: "30 sec", rest: "90 sec" },
        { name: "Burpees", sets: 4, reps: "10", rest: "60 sec" },
        { name: "Mountain Climbers", sets: 4, reps: "30 sec", rest: "30 sec" },
        { name: "Jump Rope", sets: 4, reps: "60 sec", rest: "60 sec" }
      ]
    },
    {
      day: "Sunday",
      title: "Rest Day",
      type: "Recovery",
      description: "Complete rest or light walking",
      exercises: [
        { name: "Light Walking (optional)", sets: 1, reps: "20-30 min", rest: "N/A" },
        { name: "Stretching (optional)", sets: 1, reps: "15-20 min", rest: "N/A" }
      ]
    }
  ];

  return (
    // Outer divs and Sidebar/MobileHeader removed
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Workout Plans</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutPlans.map((workout, index) => (
                <Card key={index} className={workout.type === "Rest" ? "bg-gray-50" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{workout.day}: {workout.title}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        workout.type === "Strength" ? "bg-secondary bg-opacity-10 text-secondary" :
                        workout.type === "Cardio" ? "bg-primary bg-opacity-10 text-primary" :
                        "bg-gray-200 text-gray-700"
                      }`}>
                        {workout.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{workout.description}</p>
                  </CardHeader>
                  <CardContent>
                    {workout.exercises.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Exercise</th>
                            <th className="text-center py-2">Sets</th>
                            <th className="text-center py-2">Reps</th>
                            <th className="text-center py-2">Rest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workout.exercises.map((exercise, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="py-2">{exercise.name}</td>
                              <td className="text-center py-2">{exercise.sets}</td>
                              <td className="text-center py-2">{exercise.reps}</td>
                              <td className="text-center py-2">{exercise.rest}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500 italic">Rest day - no exercises scheduled</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
  );
}
