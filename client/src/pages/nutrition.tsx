// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
// import { useState } from "react"; // Removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SupplementPlan {
  name: string;
  timing: string;
  dosage: string;
  benefits: string[];
}

interface MealPlan {
  time: string;
  meal: string;
  description: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
}

export default function Nutrition() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed
  
  const mealPlans: MealPlan[] = [
    {
      time: "6:00 AM",
      meal: "Pre-Workout Fuel",
      description: "Light protein with easily digestible carbs",
      macros: {
        protein: "15g",
        carbs: "30g",
        fats: "5g"
      }
    },
    {
      time: "8:00 AM",
      meal: "Post-Workout Breakfast",
      description: "High protein meal with complex carbs and healthy fats",
      macros: {
        protein: "40g",
        carbs: "45g",
        fats: "15g"
      }
    },
    {
      time: "12:00 PM",
      meal: "Lunch",
      description: "Balanced meal with lean protein, vegetables, and whole grains",
      macros: {
        protein: "35g",
        carbs: "50g",
        fats: "15g"
      }
    },
    {
      time: "3:30 PM",
      meal: "Afternoon Snack",
      description: "Protein-rich snack with some fruit for energy",
      macros: {
        protein: "20g",
        carbs: "25g",
        fats: "10g"
      }
    },
    {
      time: "6:30 PM",
      meal: "Dinner",
      description: "Lean protein with plenty of vegetables and healthy fats",
      macros: {
        protein: "40g",
        carbs: "30g",
        fats: "15g"
      }
    }
  ];
  
  const supplementPlans: SupplementPlan[] = [
    {
      name: "Vitamin D3 with K2",
      timing: "Morning with breakfast",
      dosage: "5,000-10,000 IU daily",
      benefits: [
        "Immune support",
        "Bone health",
        "Hormone regulation",
        "Cardiovascular health"
      ]
    },
    {
      name: "Magnesium Glycinate",
      timing: "Evening before bed",
      dosage: "400-600mg daily",
      benefits: [
        "Sleep quality improvement",
        "Muscle recovery",
        "Stress reduction",
        "Energy production"
      ]
    },
    {
      name: "Omega-3 Fish Oil",
      timing: "With meals (split dosage)",
      dosage: "2-3g daily",
      benefits: [
        "Brain health",
        "Reduces inflammation",
        "Joint health",
        "Heart health"
      ]
    },
    {
      name: "Athletic Multivitamin",
      timing: "Morning with breakfast",
      dosage: "As directed on label",
      benefits: [
        "Fills nutrient gaps",
        "Supports energy metabolism",
        "Immune function",
        "Recovery support"
      ]
    },
    {
      name: "Creatine Monohydrate",
      timing: "Any time (consistent daily)",
      dosage: "5g daily",
      benefits: [
        "Increased strength",
        "Improved power output",
        "Enhanced recovery",
        "Cognitive benefits"
      ]
    },
    {
      name: "Berberine",
      timing: "Before meals",
      dosage: "500mg, 3x daily",
      benefits: [
        "Blood glucose regulation",
        "Supports gut health",
        "Cardiovascular benefits",
        "Longevity support"
      ]
    }
  ];
  
  const nutritionGuidelines = [
    {
      title: "Protein Prioritization",
      description: "Consume 1g of protein per pound of body weight daily to support muscle maintenance and growth. Choose high-quality sources like grass-fed meat, wild-caught fish, and cage-free eggs."
    },
    {
      title: "Time-Restricted Feeding",
      description: "Implement a 16:8 intermittent fasting protocol (16 hours fasting, 8 hours eating) to optimize metabolic health, cellular autophagy, and fat utilization."
    },
    {
      title: "Strategic Carbohydrates",
      description: "Consume most carbohydrates around workout times to support performance and recovery. Focus on complex sources like sweet potatoes, rice, and oats."
    },
    {
      title: "Hydration Protocol",
      description: "Drink 0.5-1 ounce of water per pound of body weight daily with added electrolytes, especially sodium and potassium during periods of training."
    },
    {
      title: "Micronutrient Emphasis",
      description: "Include dark leafy greens, colorful vegetables, organ meats, and berries regularly to ensure optimal micronutrient intake for cellular function."
    },
    {
      title: "Food Quality Standards",
      description: "Choose organic produce when possible, grass-fed and pasture-raised animal products, and minimize processed foods, vegetable oils, and added sugars."
    }
  ];

  return (
    // Outer divs and Sidebar/MobileHeader removed
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Nutrition & Supplements</h1>
            
            <div className="bg-gradient-to-r from-warning to-secondary rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Nutrition Focus</h2>
              <p className="text-white text-opacity-90 max-w-3xl">"Food is not just fuel, it's information. What you eat sends instructions to your genes, influences your hormones, and determines your metabolic function." — Dr. Andrew Huberman</p>
            </div>
            
            <Tabs defaultValue="meal-plan" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="meal-plan">Daily Meal Plan</TabsTrigger>
                <TabsTrigger value="supplements">Supplement Protocol</TabsTrigger>
                <TabsTrigger value="guidelines">Nutrition Guidelines</TabsTrigger>
              </TabsList>
              
              <TabsContent value="meal-plan">
                <div className="space-y-4">
                  {mealPlans.map((meal, index) => (
                    <Card key={index}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="bg-warning bg-opacity-10 text-warning text-center p-3 rounded-lg md:w-32">
                            <p className="text-sm font-semibold">TIME</p>
                            <p className="text-xl font-bold">{meal.time}</p>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{meal.meal}</h3>
                            <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                            
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div className="bg-gray-100 p-2 rounded">
                                <p className="text-xs text-gray-500">PROTEIN</p>
                                <p className="font-semibold">{meal.macros.protein}</p>
                              </div>
                              <div className="bg-gray-100 p-2 rounded">
                                <p className="text-xs text-gray-500">CARBS</p>
                                <p className="font-semibold">{meal.macros.carbs}</p>
                              </div>
                              <div className="bg-gray-100 p-2 rounded">
                                <p className="text-xs text-gray-500">FATS</p>
                                <p className="font-semibold">{meal.macros.fats}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="supplements">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supplementPlans.map((supplement, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle>{supplement.name}</CardTitle>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{supplement.timing}</span>
                          <span className="font-medium">{supplement.dosage}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium mb-2">Benefits:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {supplement.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="guidelines">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nutritionGuidelines.map((guideline, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle>{guideline.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{guideline.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
  );
}
