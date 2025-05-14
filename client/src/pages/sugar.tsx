import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb,
  AlertTriangle,
  Heart,
  Brain,
  BarChart2,
  Zap,
  MoveDown,
  Pill,
  Scale,
  Flame,
  FileText,
  ExternalLink,
  BookOpen,
  Info,
  Leaf
} from "lucide-react";

export default function SugarPage() {
  return (
    <PageContainer title="Sugar: The Hidden Poison">
      {/* Introduction */}
      <div className="mb-8 bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-900/50">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-red-800 dark:text-red-400">
              Understanding the True Impact of Sugar
            </h2>
            <p className="text-muted-foreground mb-4">
              Sugar is arguably the most destructive substance in the modern diet, yet it's hidden in nearly 80% of processed foods. 
              This page compiles research showing how excess sugar consumption drives inflammation, obesity, diabetes, heart disease, 
              and even cancer. The good news? Cutting sugar produces rapid health improvements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white dark:bg-background p-4 rounded-lg border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full mb-2">
                  <Brain className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-medium mb-1">Brain Function</h3>
                <p className="text-xs text-muted-foreground">
                  Sugar impairs cognitive function and contributes to depression and anxiety.
                </p>
              </div>
              <div className="bg-white dark:bg-background p-4 rounded-lg border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full mb-2">
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-medium mb-1">Heart Disease</h3>
                <p className="text-xs text-muted-foreground">
                  Sugar triggers inflammation and raises triglycerides, increasing heart attack risk.
                </p>
              </div>
              <div className="bg-white dark:bg-background p-4 rounded-lg border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full mb-2">
                  <Scale className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-medium mb-1">Weight Gain</h3>
                <p className="text-xs text-muted-foreground">
                  Sugar hijacks hunger hormones and drives overeating through dopamine signaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Tabs */}
      <Tabs defaultValue="science" className="mb-10">
        <TabsList className="mb-6 w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="science" className="py-3 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20">
            <div className="flex flex-col items-center">
              <Lightbulb className="h-4 w-4 mb-1" />
              <span className="text-xs">The Science</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="hidden" className="py-3 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20">
            <div className="flex flex-col items-center">
              <Info className="h-4 w-4 mb-1" />
              <span className="text-xs">Hidden Sugar</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="addiction" className="py-3 data-[state=active]:bg-amber-50 dark:data-[state=active]:bg-amber-900/20">
            <div className="flex flex-col items-center">
              <Zap className="h-4 w-4 mb-1" />
              <span className="text-xs">Addiction</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="py-3 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20">
            <div className="flex flex-col items-center">
              <Flame className="h-4 w-4 mb-1" />
              <span className="text-xs">Alternatives</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="science">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            The Hard Science on Sugar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Metabolic Dysfunction</CardTitle>
                <CardDescription>From Robert Lustig, MD - UCSF</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  "Fructose, which makes up half of table sugar and nearly all of high-fructose corn syrup, is 
                  metabolized primarily by the liver. Unlike glucose, which is processed by all cells in the body, 
                  fructose metabolism places a huge burden on the liver, promoting non-alcoholic fatty liver disease, 
                  insulin resistance, and metabolic syndrome."
                </p>
                <p className="text-sm mb-3">
                  Research has shown that consuming 150 calories of fructose daily significantly increases visceral 
                  fat, raises LDL cholesterol, and leads to insulin resistance in just 10 days in healthy subjects.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Read Research Paper
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Inflammation & Immune Function</CardTitle>
                <CardDescription>From Journal of Clinical Investigation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  "High sugar consumption activates inflammatory pathways through advanced glycation end products (AGEs)
                  which damage cellular proteins and DNA. Additionally, excess sugar intake has been shown to impair 
                  white blood cell function, reducing immune response by up to 50% for several hours after consumption."
                </p>
                <p className="text-sm mb-3">
                  Research from 2018 found that maintaining blood glucose levels above 140 mg/dL 
                  impairs neutrophil function and dramatically increases infection risk.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Read Research Paper
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Brain Function & Mental Health</CardTitle>
                <CardDescription>From Journal of Neuroscience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  "High sugar diets reduce production of brain-derived neurotrophic factor (BDNF), a crucial molecule 
                  for neuronal health and learning. Low BDNF levels are associated with depression, dementia, and 
                  Alzheimer's disease."
                </p>
                <p className="text-sm mb-3">
                  A 2017 longitudinal study found men consuming 67g or more of sugar daily had a 23% higher risk of 
                  depression over 5 years compared to men consuming less than 40g daily. Sugar-induced inflammation 
                  appears to be the primary mechanism.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Read Research Paper
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cancer Risk</CardTitle>
                <CardDescription>From Cancer Research Journal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  "Cancer cells preferentially metabolize glucose through aerobic glycolysis (the Warburg effect), 
                  consuming up to 200 times more glucose than normal cells. High sugar consumption, particularly in the 
                  context of obesity and insulin resistance, creates an environment that promotes cancer growth and 
                  reduces apoptosis."
                </p>
                <p className="text-sm mb-3">
                  A 9-year study involving 47,000 participants found that those who consumed high-sugar diets had a 
                  significantly elevated risk of several cancers, particularly colorectal, breast, and pancreatic.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Read Research Paper
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">The Evidence is Clear</h4>
            <p className="text-sm text-muted-foreground">
              Over 25,000 published scientific papers now link sugar consumption to serious health conditions. 
              The World Health Organization, American Heart Association, and other major medical organizations recommend 
              limiting added sugar to less than 25g daily (6 teaspoons) for optimal health.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="hidden">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-600" />
            Hidden Sugar in "Healthy" Foods
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Yogurt</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to 30g (7.5 tsp) per cup
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Many flavored yogurts contain more sugar than a candy bar. Plain Greek yogurt with fresh 
                  fruit is a much better alternative.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Granola/Protein Bars</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to 25g (6 tsp) per bar
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Marketing terms like "natural," "energy," or "protein" often mask high sugar content. 
                  Many bars are essentially cookies with added protein.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Smoothies & Juices</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to 50g (12.5 tsp) per bottle
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Store-bought smoothies often contain added sugars, fruit concentrates, or excessive fruit. 
                  One bottle can exceed your daily sugar limit.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Salad Dressings</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to 12g (3 tsp) per serving
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Low-fat dressings often replace fat with sugar and thickeners. Oil and vinegar or 
                  lemon with herbs is a simple alternative.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pasta Sauce</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to 15g (3.75 tsp) per half cup
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Commercial pasta sauces can contain as much sugar as two cookies. Look for versions with 
                  less than 5g per serving.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dried Fruit</CardTitle>
                <Badge variant="outline" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  Up to x3 sugar of fresh fruit
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">
                  Dehydration concentrates the sugars. Many dried fruits also have added sugar, sometimes 
                  disguised as apple or grape juice concentrate.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Sugar's Many Disguises (Names to Look For)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Badge variant="outline" className="justify-start">High-fructose corn syrup</Badge>
              <Badge variant="outline" className="justify-start">Agave nectar</Badge>
              <Badge variant="outline" className="justify-start">Rice syrup</Badge>
              <Badge variant="outline" className="justify-start">Cane juice</Badge>
              <Badge variant="outline" className="justify-start">Maltose/dextrose</Badge>
              <Badge variant="outline" className="justify-start">Fruit juice concentrate</Badge>
              <Badge variant="outline" className="justify-start">Maple syrup</Badge>
              <Badge variant="outline" className="justify-start">Honey</Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addiction">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-600" />
            Sugar Addiction: It's Real
          </h3>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>The Science of Sugar Addiction</CardTitle>
              <CardDescription>From Dr. Nicole Avena, Mount Sinai School of Medicine</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Sugar triggers the release of dopamine in the brain's reward center, similar to addictive drugs. 
                Over time, more sugar is needed for the same reward, creating a dangerous cycle of dependence.
              </p>
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-medium mb-1 flex items-center">
                    <Brain className="h-4 w-4 text-amber-600 mr-2" />
                    Brain Scans Show Similar Patterns
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Functional MRI studies show sugar activates the same brain regions as cocaine. Those who regularly 
                    consume high quantities of sugar show downregulation of dopamine receptors.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-medium mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    Withdrawal Symptoms Are Real
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Abruptly quitting sugar can cause withdrawal symptoms including headaches, mood swings, cravings, 
                    and fatigue. This typically peaks 2-5 days after quitting and resolves within 7-14 days.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100">
                  <h4 className="text-sm font-medium mb-1 flex items-center">
                    <Zap className="h-4 w-4 text-amber-600 mr-2" />
                    Breaking the Cycle
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    After 2 weeks of reduced sugar intake, taste buds reset and cravings significantly diminish. 
                    Foods that once tasted normal now taste excessively sweet. This is evidence of your brain 
                    chemistry returning to balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-base font-medium mb-3">The Addiction Cycle</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-medium text-amber-800 dark:text-amber-400">1</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Sugar Consumption</h5>
                    <p className="text-sm text-muted-foreground">
                      Sugar causes rapid blood glucose spikes followed by insulin release
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-medium text-amber-800 dark:text-amber-400">2</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Dopamine Release</h5>
                    <p className="text-sm text-muted-foreground">
                      Brain's reward system activates, creating a pleasurable sensation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-medium text-amber-800 dark:text-amber-400">3</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Blood Sugar Crash</h5>
                    <p className="text-sm text-muted-foreground">
                      Insulin overcompensation leads to low blood sugar
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-medium text-amber-800 dark:text-amber-400">4</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Cravings Begin</h5>
                    <p className="text-sm text-muted-foreground">
                      Body demands more sugar to restore blood glucose and dopamine
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-medium text-amber-800 dark:text-amber-400">5</span>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Tolerance Develops</h5>
                    <p className="text-sm text-muted-foreground">
                      Brain requires more sugar for the same dopamine response
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-base font-medium mb-3">7-Day Sugar Detox Plan</h4>
              <Card>
                <CardContent className="pt-6">
                  <ol className="space-y-2 text-sm">
                    <li className="pb-2 border-b">
                      <span className="font-medium">Days 1-2: </span>
                      Eliminate obvious sources (sweets, soda, juices). Add protein to each meal to stabilize blood sugar.
                    </li>
                    <li className="pb-2 border-b">
                      <span className="font-medium">Days 3-4: </span>
                      Cut hidden sources (sauces, bread, flavored yogurt). Increase healthy fats to reduce cravings.
                    </li>
                    <li className="pb-2 border-b">
                      <span className="font-medium">Days 5-6: </span>
                      Stay hydrated. Exercise to boost dopamine naturally. Supplement with magnesium if experiencing headaches.
                    </li>
                    <li>
                      <span className="font-medium">Day 7: </span>
                      Reassess. Cravings should be significantly reduced. Gradually reintroduce small amounts of whole fruits.
                    </li>
                  </ol>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Complete Sugar Detox Guide
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alternatives">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-green-600" />
            Better Alternatives
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Natural Sweetener Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Stevia</h4>
                      <p className="text-xs text-muted-foreground">
                        Plant-based, zero-calorie sweetener with no glycemic impact. Good for beverages and baking.
                      </p>
                      <Badge variant="outline" className="mt-1 bg-green-50 text-green-600 border-green-200">Recommended</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Monk Fruit Extract</h4>
                      <p className="text-xs text-muted-foreground">
                        Zero-calorie, natural sweetener with antioxidant properties. No bitter aftertaste.
                      </p>
                      <Badge variant="outline" className="mt-1 bg-green-50 text-green-600 border-green-200">Recommended</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Erythritol</h4>
                      <p className="text-xs text-muted-foreground">
                        Sugar alcohol with 6% the calories of sugar. Minimal digestive issues compared to other sugar alcohols.
                      </p>
                      <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-600 border-amber-200">Use Moderately</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-md bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Coconut Sugar / Honey / Maple Syrup</h4>
                      <p className="text-xs text-muted-foreground">
                        Still primarily sugar, though with minor nutritional benefits. Use very sparingly.
                      </p>
                      <Badge variant="outline" className="mt-1 bg-red-50 text-red-600 border-red-200">Limited Use</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sweet Craving Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-800">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Focus on Fat</h4>
                      <p className="text-xs text-muted-foreground">
                        When sweet cravings hit, try consuming healthy fats like avocado, nuts, or full-fat yogurt. 
                        Fats provide satiety and help stabilize blood sugar.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-800">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Spice Instead of Sweet</h4>
                      <p className="text-xs text-muted-foreground">
                        Cinnamon, vanilla, cardamom, and nutmeg can trick the brain into perceiving sweetness 
                        without actual sugar. Add to coffee, yogurt, or oatmeal.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-800">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Berries & Dark Chocolate</h4>
                      <p className="text-xs text-muted-foreground">
                        When you must have something sweet, opt for berries (lowest sugar fruits) or 85%+ dark chocolate 
                        (contains minimal sugar and beneficial antioxidants).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-800">4</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Hydrate First</h4>
                      <p className="text-xs text-muted-foreground">
                        Many sugar cravings are actually dehydration in disguise. Drink a full glass of water when 
                        cravings hit and wait 15 minutes to see if they subside.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Surprising Sweet-Tasting Snacks with No Added Sugar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Frozen Banana "Ice Cream"</h4>
                  <p className="text-xs text-muted-foreground">
                    Blend frozen banana chunks until creamy. Add unsweetened cocoa powder or cinnamon.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Greek Yogurt with Berries</h4>
                  <p className="text-xs text-muted-foreground">
                    Full-fat Greek yogurt with fresh berries and a sprinkle of cinnamon.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Coconut Chia Pudding</h4>
                  <p className="text-xs text-muted-foreground">
                    Unsweetened coconut milk with chia seeds, vanilla extract, and a few berries.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Nut Butter-Stuffed Dates</h4>
                  <p className="text-xs text-muted-foreground">
                    Whole date with almond butter. Natural sweetness plus healthy fat and protein.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Sweet Potato Rounds</h4>
                  <p className="text-xs text-muted-foreground">
                    Baked sweet potato slices with cinnamon and a tiny drizzle of coconut oil.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium mb-1">Apple with Nut Butter</h4>
                  <p className="text-xs text-muted-foreground">
                    Sliced apple with almond butter and a sprinkle of cinnamon.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download Full Sugar-Free Recipe Book
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Books Section */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4">Essential Reading on Sugar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="flex flex-col h-full">
            <CardContent className="pt-6 flex-grow">
              <h4 className="font-bold mb-1">Pure, White, and Deadly</h4>
              <p className="text-sm text-muted-foreground mb-2">John Yudkin</p>
              <p className="text-xs mb-3">
                The groundbreaking 1972 book that first exposed sugar's dangers, years before mainstream science 
                caught up. Yudkin was vilified by the sugar industry but ultimately proven right.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View Book
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col h-full">
            <CardContent className="pt-6 flex-grow">
              <h4 className="font-bold mb-1">The Case Against Sugar</h4>
              <p className="text-sm text-muted-foreground mb-2">Gary Taubes</p>
              <p className="text-xs mb-3">
                A detailed investigation into sugar's role in obesity, diabetes, and heart disease. Exposes 
                how the sugar industry influenced nutritional research for decades.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View Book
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col h-full">
            <CardContent className="pt-6 flex-grow">
              <h4 className="font-bold mb-1">Fat Chance</h4>
              <p className="text-sm text-muted-foreground mb-2">Dr. Robert Lustig</p>
              <p className="text-xs mb-3">
                Written by the leading researcher on sugar metabolism, this book explains how fructose is 
                processed by the liver and drives metabolic syndrome.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View Book
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col h-full">
            <CardContent className="pt-6 flex-grow">
              <h4 className="font-bold mb-1">Year of No Sugar</h4>
              <p className="text-sm text-muted-foreground mb-2">Eve Schaub</p>
              <p className="text-xs mb-3">
                A family's real-life experiment with eliminating added sugar for an entire year, revealing 
                both challenges and transformative health benefits.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View Book
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="border-2 border-red-200 dark:border-red-900/50 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">
                Take the 21-Day Sugar Detox Challenge
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join thousands of others breaking free from sugar addiction. Our structured 21-day program 
                will guide you through eliminating sugar while providing daily support, recipes, and 
                motivation. Most participants report improved energy, reduced inflammation, and weight loss.
              </p>
              <div className="flex gap-3">
                <Button>
                  Join Challenge
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block border-l border-red-200 dark:border-red-900/50 h-40"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-800 dark:text-red-400">76%</div>
              <p className="text-sm text-muted-foreground">Report reduced cravings</p>
              <div className="text-2xl font-bold text-red-800 dark:text-red-400 mt-2">68%</div>
              <p className="text-sm text-muted-foreground">Report improved sleep</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}