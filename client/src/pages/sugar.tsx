import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Brain, ChevronRight, Droplets, HeartPulse, Scale, Skull, Zap } from "lucide-react";

export default function Sugar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  Sugar: The Hidden Poison
                </h1>
                <p className="text-gray-600 mt-1">Understanding sugar addiction and how to break free</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="px-3 py-1 flex items-center gap-1">
                  <Skull className="h-3.5 w-3.5" />
                  <span>Health Hazard</span>
                </Badge>
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <Brain className="h-3.5 w-3.5" />
                  <span>Neuroscience</span>
                </Badge>
              </div>
            </div>
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-xl p-6 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Sugar Is More Addictive Than Cocaine</h2>
                <p className="text-lg mb-6">
                  Studies show that sugar triggers the same reward pathways in the brain as many drugs, 
                  making it one of the most addictive substances we regularly consume.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-red-500 hover:bg-red-600" onClick={() => document.getElementById('dangers')?.scrollIntoView({ behavior: 'smooth' })}>
                    Discover the Dangers
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('detox')?.scrollIntoView({ behavior: 'smooth' })}>
                    Sugar Detox Plan
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content Tabs */}
            <Tabs defaultValue="dangers" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dangers" id="dangers">The Dangers</TabsTrigger>
                <TabsTrigger value="science">The Science</TabsTrigger>
                <TabsTrigger value="detox" id="detox">Breaking Free</TabsTrigger>
              </TabsList>
              
              {/* The Dangers Tab */}
              <TabsContent value="dangers" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-red-500" />
                        Chronic Disease Risk
                      </CardTitle>
                      <CardDescription>Sugar significantly increases your risk of serious health conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <span className="text-red-500 font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Type 2 Diabetes</h4>
                            <p className="text-gray-600">
                              Regular consumption of added sugars leads to insulin resistance and can eventually 
                              cause type 2 diabetes, affecting over 400 million people worldwide.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <span className="text-red-500 font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Heart Disease</h4>
                            <p className="text-gray-600">
                              High sugar intake raises triglycerides, blood pressure, and contributes to arterial 
                              inflammation, significantly increasing heart attack and stroke risk.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <span className="text-red-500 font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Non-Alcoholic Fatty Liver</h4>
                            <p className="text-gray-600">
                              Excess fructose (in table sugar and high-fructose corn syrup) gets converted to fat 
                              in the liver, leading to non-alcoholic fatty liver disease.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <span className="text-red-500 font-semibold">4</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Cancer Risk</h4>
                            <p className="text-gray-600">
                              Research links high sugar consumption to increased risk of several cancers, including 
                              breast, colon, and pancreatic cancer, due to chronic inflammation and insulin resistance.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-orange-500" />
                        Cognitive & Mental Effects
                      </CardTitle>
                      <CardDescription>Sugar devastates your brain function and mental health</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                            <span className="text-orange-500 font-semibold">1</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Addiction & Dependence</h4>
                            <p className="text-gray-600">
                              Sugar triggers dopamine release in the brain's reward centers similar to drugs like cocaine, 
                              creating powerful addiction cycles and withdrawal symptoms.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                            <span className="text-orange-500 font-semibold">2</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Depression & Anxiety</h4>
                            <p className="text-gray-600">
                              High sugar consumption is linked to higher rates of depression and anxiety, as blood sugar 
                              spikes and crashes disrupt brain chemistry and hormone function.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                            <span className="text-orange-500 font-semibold">3</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Cognitive Decline</h4>
                            <p className="text-gray-600">
                              Chronic high blood sugar damages brain cells and blood vessels, accelerating cognitive decline 
                              and increasing risk of dementia and Alzheimer's disease.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                            <span className="text-orange-500 font-semibold">4</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Brain Fog & Memory Issues</h4>
                            <p className="text-gray-600">
                              Sugar impairs memory formation and causes inflammation in the hippocampus, leading to "brain fog" 
                              and reduced cognitive performance.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-red-700">Hidden Sugars: Where They're Hiding</h3>
                  <p className="mb-4 text-gray-700">
                    Sugar hides under at least 60 different names on food labels. Manufacturers deliberately use 
                    multiple types of sugar so they don't have to list "sugar" as the first ingredient.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded p-3 shadow-sm">
                      <h4 className="font-medium text-red-600 mb-2">Beverages</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Fruit juices</li>
                        <li>• Sports drinks</li>
                        <li>• Flavored coffees</li>
                        <li>• Vitamin waters</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded p-3 shadow-sm">
                      <h4 className="font-medium text-red-600 mb-2">Sauces & Dressings</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Ketchup</li>
                        <li>• BBQ sauce</li>
                        <li>• Salad dressings</li>
                        <li>• Pasta sauces</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded p-3 shadow-sm">
                      <h4 className="font-medium text-red-600 mb-2">"Health" Foods</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Granola bars</li>
                        <li>• Protein bars</li>
                        <li>• Yogurts</li>
                        <li>• Breakfast cereals</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded p-3 shadow-sm">
                      <h4 className="font-medium text-red-600 mb-2">Common Names</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• High-fructose corn syrup</li>
                        <li>• Dextrose, maltose</li>
                        <li>• Cane juice/crystals</li>
                        <li>• Anything ending in "-ose"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* The Science Tab */}
              <TabsContent value="science" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>The Neuroscience of Sugar Addiction</CardTitle>
                      <CardDescription>How sugar hijacks your brain's reward system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p>
                          Sugar triggers an intense response in the brain's reward system by stimulating the release of dopamine, 
                          the same neurotransmitter activated by drugs like cocaine and heroin. This creates a powerful feedback 
                          loop that drives cravings and addiction.
                        </p>
                        
                        <h4>The Dopamine Surge</h4>
                        <p>
                          When you consume sugar, your brain releases dopamine in the nucleus accumbens—the same "pleasure center" 
                          targeted by drugs of abuse. Research shows that sugar can cause even more intense dopamine release than 
                          some addictive drugs, especially when combined with fat.
                        </p>
                        
                        <h4>Tolerance Development</h4>
                        <p>
                          With repeated sugar consumption, the brain adapts by reducing dopamine receptors—a process called 
                          downregulation. This means you need more and more sugar to get the same pleasure response, creating a 
                          cycle of increasing consumption and diminishing satisfaction.
                        </p>
                        
                        <h4>Withdrawal Effects</h4>
                        <p>
                          Sudden sugar reduction triggers genuine withdrawal symptoms including headaches, irritability, anxiety, 
                          fatigue, and intense cravings. These symptoms reflect actual neurochemical changes and can be as 
                          uncomfortable as withdrawal from certain drugs.
                        </p>
                        
                        <blockquote>
                          "In certain circumstances, intermittent access to sugar can lead to behavior and neurochemical changes 
                          that resemble the effects of a substance of abuse." 
                          <cite>— Princeton University researchers, Neuroscience & Biobehavioral Reviews</cite>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-b from-orange-50 to-red-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-red-500" />
                        Sugar vs. Drugs: The Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Laboratory Studies</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            When given the choice between sugar water and cocaine, lab rats consistently choose sugar, even when 
                            they're already addicted to cocaine.
                          </p>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div className="h-2 rounded-full bg-red-500" style={{ width: '85%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Sugar Preference</span>
                            <span>85%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Withdrawal Severity</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            Sugar withdrawal produces anxiety, depression, and cravings comparable to withdrawal from other 
                            addictive substances.
                          </p>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div className="h-2 rounded-full bg-orange-500" style={{ width: '75%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Symptom Similarity</span>
                            <span>75%</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Neurochemical Impact</h4>
                          <p className="text-sm text-gray-700 mb-2">
                            Sugar consumption affects the same brain regions and neurotransmitter systems as drugs of abuse.
                          </p>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div className="h-2 rounded-full bg-red-500" style={{ width: '90%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>Brain Pathway Overlap</span>
                            <span>90%</span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-red-100">
                          <h4 className="font-semibold mb-2 text-red-600">Expert Opinion</h4>
                          <p className="text-sm">
                            "The data is so overwhelming the field has to accept it. We are finding tremendous overlaps between drugs 
                            of abuse and sugar, from the standpoint of brain neurochemistry as well as behavior."
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            — Dr. Nora Volkow, Director of the National Institute on Drug Abuse
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8 bg-gray-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Metabolic Effects of Sugar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-semibold">Insulin Response</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Sugar causes rapid insulin spikes followed by crashes, leading to hunger, cravings, and energy fluctuations. 
                        Over time, this causes insulin resistance where cells no longer respond properly to insulin.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold">Liver Metabolism</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Unlike glucose, which can be used by every cell in the body, fructose (half of table sugar) must be processed 
                        by the liver. High fructose intake overloads the liver and gets converted directly to fat.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <HeartPulse className="h-5 w-5 text-red-500" />
                        <h4 className="font-semibold">Inflammation</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Sugar triggers the release of inflammatory cytokines throughout the body, contributing to chronic inflammation
                        —a root cause of heart disease, cancer, and accelerated aging processes.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Breaking Free Tab */}
              <TabsContent value="detox" className="mt-6">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold mb-3">The 30-Day Sugar Detox Challenge</h3>
                    <p className="mb-4">
                      Breaking sugar addiction requires a systematic approach. This 30-day plan gradually eliminates 
                      sugar while supporting your body through withdrawal symptoms.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-green-700 mb-2">Days 1-10: Preparation</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-green-600 mt-0.5">•</span>
                            <span>Eliminate obvious sugars (soda, candy, desserts)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-green-600 mt-0.5">•</span>
                            <span>Start reading food labels for hidden sugars</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-green-600 mt-0.5">•</span>
                            <span>Increase protein and healthy fat intake</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-green-600 mt-0.5">•</span>
                            <span>Begin taking magnesium supplements</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-blue-700 mb-2">Days 11-20: Elimination</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-blue-600 mt-0.5">•</span>
                            <span>Remove all added sugars from diet</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-blue-600 mt-0.5">•</span>
                            <span>Eliminate processed carbs (white bread, pasta)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-blue-600 mt-0.5">•</span>
                            <span>Stay hydrated (withdrawal symptom relief)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-blue-600 mt-0.5">•</span>
                            <span>Use cinnamon to help stabilize blood sugar</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-purple-700 mb-2">Days 21-30: Rewiring</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-purple-600 mt-0.5">•</span>
                            <span>Monitor changes in taste preferences</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-purple-600 mt-0.5">•</span>
                            <span>Introduce small amounts of natural sweeteners (berries)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-purple-600 mt-0.5">•</span>
                            <span>Continue high protein, moderate fat, low carb diet</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-purple-600 mt-0.5">•</span>
                            <span>Establish long-term sustainable habits</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Managing Withdrawal Symptoms</CardTitle>
                        <CardDescription>How to handle the challenging first 5-7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <span className="text-blue-500 font-semibold">1</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Headaches & Brain Fog</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Caused by changing glucose levels and neurotransmitter adjustments.
                              </p>
                              <div className="text-sm">
                                <span className="font-medium">Remedies:</span> Stay hydrated, take magnesium supplements, 
                                get adequate sleep, and consider OTC pain relievers if needed.
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <span className="text-blue-500 font-semibold">2</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Intense Cravings</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Your brain demanding the dopamine hit it's accustomed to receiving.
                              </p>
                              <div className="text-sm">
                                <span className="font-medium">Remedies:</span> Eat protein-rich snacks, take L-glutamine 
                                supplements, exercise, or distract yourself with activities.
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <span className="text-blue-500 font-semibold">3</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Irritability & Mood Swings</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Result from changing brain chemistry and blood sugar fluctuations.
                              </p>
                              <div className="text-sm">
                                <span className="font-medium">Remedies:</span> Regular small meals with protein and fat, 
                                meditation, deep breathing, and light exercise.
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <span className="text-blue-500 font-semibold">4</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Fatigue & Low Energy</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Your body adjusting to using fat instead of sugar as primary fuel.
                              </p>
                              <div className="text-sm">
                                <span className="font-medium">Remedies:</span> Increase healthy fats, ensure adequate salt 
                                intake, try adaptogenic herbs like ashwagandha, and rest as needed.
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Sugar Substitutes: The Good and Bad</CardTitle>
                        <CardDescription>Not all alternatives are created equal</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-5">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Natural Options (Use Moderately)</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-green-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Stevia</h5>
                                <p className="text-xs text-gray-600">
                                  Plant-based, zero-calorie, minimal impact on blood sugar. Use in small amounts.
                                </p>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Monk Fruit</h5>
                                <p className="text-xs text-gray-600">
                                  Zero-calorie, antioxidant properties, no impact on blood sugar or insulin.
                                </p>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Allulose</h5>
                                <p className="text-xs text-gray-600">
                                  Rare sugar with 90% fewer calories than sucrose and minimal glycemic impact.
                                </p>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Raw Honey (Limited)</h5>
                                <p className="text-xs text-gray-600">
                                  Contains nutrients but still impacts blood sugar. Use sparingly and only after detox.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Artificial Sweeteners (Avoid)</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-red-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Aspartame</h5>
                                <p className="text-xs text-gray-600">
                                  Linked to neurological issues, weight gain, and gut microbiome disruption.
                                </p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Sucralose</h5>
                                <p className="text-xs text-gray-600">
                                  Alters gut bacteria, may increase insulin resistance despite zero calories.
                                </p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Saccharin</h5>
                                <p className="text-xs text-gray-600">
                                  Can trigger insulin response and increase sugar cravings over time.
                                </p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg">
                                <h5 className="font-medium text-sm mb-1">Sugar Alcohols</h5>
                                <p className="text-xs text-gray-600">
                                  Xylitol, erythritol can cause digestive issues and maintain sweet cravings.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-700 mb-2">The Reset Effect</h4>
                            <p className="text-sm text-gray-700">
                              After 30 days without added sugar, your taste perception fundamentally changes. Foods you 
                              never found sweet before (like berries or carrots) will taste naturally sweet, and 
                              conventional sweets will taste overwhelmingly intense.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden bg-gradient-to-r from-green-100 to-green-50 shadow-sm">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-green-800 mb-3">What to Expect After Quitting Sugar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-green-700 mb-2">7 Days</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Reduced hunger & cravings</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Improved energy stability</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Better digestive function</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Initial weight loss (water)</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-green-700 mb-2">30 Days</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Improved skin clarity</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Enhanced mental clarity</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Continued weight loss</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Stabilized mood</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-green-700 mb-2">3 Months</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Normalized blood pressure</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Lower inflammation markers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Improved lipid profiles</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Reduced joint pain</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-green-700 mb-2">1 Year+</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Normalized insulin sensitivity</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Reduced risk of chronic disease</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Improved dental health</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-green-600 mt-0.5">✓</span>
                              <span>Long-term weight maintenance</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-6 bg-gray-100 rounded-lg mt-6">
              <h3 className="text-xl font-bold mb-4">Further Reading & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>"The Case Against Sugar" by Gary Taubes</li>
                      <li>"Sugar Blues" by William Dufty</li>
                      <li>"Sweet Poison" by David Gillespie</li>
                      <li>"Brain Wash" by David Perlmutter</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Documentaries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>"That Sugar Film" (2014)</li>
                      <li>"Fed Up" (2014)</li>
                      <li>"Sugar Coated" (2015)</li>
                      <li>"The Magic Pill" (2017)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Scientific Studies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>Johnson et al. (2017). "Sugar addiction: Is it real?"</li>
                      <li>DiNicolantonio et al. (2018). "Sugar addiction: a possible model"</li>
                      <li>Avena et al. (2008). "Evidence for sugar addiction"</li>
                      <li>Lustig et al. (2012). "The toxic truth about sugar"</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}