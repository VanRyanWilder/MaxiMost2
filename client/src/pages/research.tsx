import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { GeminiResearch } from "@/components/research/gemini-research";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Sparkles, Bot, Info } from "lucide-react";

export default function Research() {
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
                  <Brain className="h-8 w-8 text-primary" />
                  Research & Knowledge
                </h1>
                <p className="text-gray-600 mt-1">AI-powered research on health, fitness, and self-improvement</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Powered by Gemini</span>
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Advanced AI</span>
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Evidence-Based Insights
                    </CardTitle>
                    <CardDescription>
                      Access research from leading experts like Andrew Huberman and Dr. Brecka
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Dive into cutting-edge research on sleep optimization, hormone balance, nutrition, and mental performance.
                      Our AI-powered research assistant can generate detailed reports on topics from scientific literature
                      and expert sources including Huberman Lab, Peter Attia, and Dr. Brecka.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-medium text-blue-700 mb-2 text-sm">Scientific Research</h3>
                        <p className="text-sm text-gray-600">
                          Access evidence-based information from peer-reviewed journals and studies.
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-medium text-purple-700 mb-2 text-sm">Expert Knowledge</h3>
                        <p className="text-sm text-gray-600">
                          Insights from leading figures in health, fitness, and performance.
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-medium text-green-700 mb-2 text-sm">Practical Application</h3>
                        <p className="text-sm text-gray-600">
                          Turn research into actionable steps for your fitness and health journey.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      About Our AI Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">
                      Our AI research assistant uses Google's Gemini technology to provide you with the most relevant and 
                      accurate information on health, fitness, and personal development topics.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Synthesizes information from scientific studies</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Provides insights from top researchers like Andrew Huberman</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Offers practical applications of complex concepts</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Generates custom visualizations related to your topics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Tabs defaultValue="experts" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="experts">Health Experts</TabsTrigger>
                <TabsTrigger value="ai-research">AI Research Assistant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="experts" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Leading Health Optimization Experts</h2>
                <p className="text-gray-700 mb-6">
                  Our supplement recommendations are based on research and protocols from these trusted experts in health optimization,
                  longevity, and performance. Each brings a unique scientific perspective based on their expertise.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Andrew Huberman */}
                  <Card className="overflow-hidden border-l-4 border-l-blue-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Andrew Huberman</CardTitle>
                        <Badge className="mb-3">Neuroscientist</Badge>
                        <CardDescription className="mb-3">
                          Professor of Neurobiology at Stanford School of Medicine and host of the Huberman Lab podcast
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>Magnesium (glycinate/threonate)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>Creatine Monohydrate</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>EPA/DHA (Omega-3)</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Neurocircuitry of vision, stress, focus, and neuroplasticity. Applies neuroscience 
                            research to improve sleep, manage stress and optimize performance.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://hubermanlab.com", "_blank")}>
                          Visit Huberman Lab
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Peter Attia */}
                  <Card className="overflow-hidden border-l-4 border-l-purple-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Peter Attia</CardTitle>
                        <Badge className="mb-3">Longevity Physician</Badge>
                        <CardDescription className="mb-3">
                          Physician focusing on the science of longevity and host of The Drive podcast
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Vitamin D3 with K2</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Athletic Greens (multivitamin)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Magnesium</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Specializes in nutritional biochemistry, exercise physiology, lipidology, and 
                            pharmacology with a focus on extending lifespan and improving healthspan.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://peterattiamd.com", "_blank")}>
                          Visit Peter Attia MD
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gary Brecka */}
                  <Card className="overflow-hidden border-l-4 border-l-green-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Gary Brecka</CardTitle>
                        <Badge className="mb-3">Human Biologist</Badge>
                        <CardDescription className="mb-3">
                          Biologist and health optimization specialist focusing on hormone optimization and longevity
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Vitamin D3</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Zinc with Copper</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Protein supplements</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Specializes in analyzing bloodwork and biomarkers to optimize health, hormones, and performance.
                            Focuses on practical interventions for improved energy and longevity.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://www.10xhealth.com", "_blank")}>
                          Visit 10X Health System
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Dr. Rhonda Patrick */}
                  <Card className="overflow-hidden border-l-4 border-l-amber-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Rhonda Patrick</CardTitle>
                        <Badge className="mb-3">Biomedical Scientist</Badge>
                        <CardDescription className="mb-3">
                          Researcher specializing in nutrigenomics, aging, and cancer prevention
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Omega-3 fatty acids</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Vitamin D3</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Sulforaphane (broccoli sprout extract)</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Studies how nutrition, micronutrients, and lifestyle factors influence gene expression, 
                            aging, and disease. Special focus on micronutrient deficiencies and their impacts.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://www.foundmyfitness.com", "_blank")}>
                          Visit Found My Fitness
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-3">How We Use Expert Research</h3>
                  <p className="text-gray-700 mb-4">
                    Our supplement recommendations synthesize research and protocols from these experts, prioritizing:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Scientific consensus</span> - We prioritize supplements recommended by multiple experts
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Research quality</span> - We favor supplements with strong clinical evidence
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Cost-effectiveness</span> - We highlight supplements offering the best value for health impact
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Safety profile</span> - We carefully consider potential side effects and interactions
                      </p>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-research" className="mt-6">
                <GeminiResearch />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}