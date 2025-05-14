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
            
            <GeminiResearch />
          </div>
        </main>
      </div>
    </div>
  );
}