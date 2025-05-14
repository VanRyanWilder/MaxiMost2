import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bot, Image as ImageIcon, Sparkles, Loader2, BookOpen, Brain, RefreshCw } from "lucide-react";
import { initGemini } from "@/lib/gemini";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface GeminiResearchProps {
  className?: string;
}

export function GeminiResearch({ className }: GeminiResearchProps) {
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<{research: boolean, image: boolean}>({
    research: false,
    image: false
  });
  const [error, setError] = useState<{research: string | null, image: string | null}>({
    research: null,
    image: null
  });

  // Example pre-defined research topics
  const researchTopics = [
    "Andrew Huberman sleep optimization techniques",
    "Peter Attia's longevity protocols",
    "Dr. Brecka's approach to hormone optimization",
    "David Goggins mental toughness strategies",
    "Stoic philosophy application in daily life",
    "Circadian rhythm optimization for performance"
  ];

  // Example pre-defined image generation prompts
  const imagePrompts = [
    "A minimalist visualization of the mind-body connection",
    "A motivational image showing transformation and growth",
    "A stylized illustration of mental and physical strength",
    "A symbolic representation of stoic resilience",
    "A modern interpretation of discipline and perseverance",
    "A digital artwork showing the journey of self-improvement"
  ];

  const performResearch = async (query: string = researchQuery) => {
    if (!query.trim()) {
      setError({...error, research: "Please enter a research query"});
      return;
    }

    setLoading({...loading, research: true});
    setError({...error, research: null});
    setResearchResult(null);

    try {
      const genAI = initGemini();
      if (!genAI) {
        setError({...error, research: "Gemini API not available"});
        setLoading({...loading, research: false});
        return;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
        Please provide detailed, evidence-based research on the following topic:
        
        ${query}
        
        Format your response in a structured way, with:
        - A brief introduction
        - Key findings and data
        - Practical applications
        - Science-backed recommendations
        
        Focus on accurate information based on scientific studies. 
        If specific experts like Huberman or Brecka have relevant insights on this topic, please include those.
        Use markdown formatting for improved readability.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setResearchResult(text);
    } catch (err) {
      console.error("Research error:", err);
      setError({...error, research: "Failed to get research results. Please try again."});
    } finally {
      setLoading({...loading, research: false});
    }
  };

  const generateImage = async (prompt: string = imagePrompt) => {
    if (!prompt.trim()) {
      setError({...error, image: "Please enter an image description"});
      return;
    }

    setLoading({...loading, image: true});
    setError({...error, image: null});
    setImageResult(null);

    try {
      const genAI = initGemini();
      if (!genAI) {
        setError({...error, image: "Gemini API not available"});
        setLoading({...loading, image: false});
        return;
      }

      // Note: This is a simulation as Gemini Pro Vision doesn't directly generate images
      // In a production app, you'd use DALL-E, Midjourney API, or similar
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const enhancedPrompt = `
        Please describe in great detail what a high-quality AI image would look like based on this prompt:
        
        "${prompt}"
        
        Describe the image in vivid detail, focusing on composition, colors, style, mood, lighting, and key elements.
        This description will be used to understand what the generated image would look like.
        
        Include details about:
        - Overall style (photorealistic, digital art, minimalist, etc.)
        - Main elements and their arrangement
        - Color palette and lighting
        - Mood and atmosphere
        - Unique aspects that make this image special
      `;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      
      // In real implementation, we'd pass this to an image generation API
      // For now, we'll just display a placeholder with the description
      setImageResult(text);
      
      toast({
        title: "Image Description Generated",
        description: "In a production environment, this would be used to generate an actual image using an image generation AI.",
        duration: 5000
      });
    } catch (err) {
      console.error("Image generation error:", err);
      setError({...error, image: "Failed to generate image description. Please try again."});
    } finally {
      setLoading({...loading, image: false});
    }
  };

  const setTopicAndResearch = (topic: string) => {
    setResearchQuery(topic);
    performResearch(topic);
  };

  const setPromptAndGenerate = (prompt: string) => {
    setImagePrompt(prompt);
    generateImage(prompt);
  };

  return (
    <div className={className}>
      <Tabs defaultValue="research">
        <TabsList className="mb-6 grid grid-cols-2">
          <TabsTrigger value="research" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>AI Research</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>AI Images</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Gemini-Powered Research</span>
              </CardTitle>
              <CardDescription>
                Get evidence-based research on fitness, nutrition, mental performance, and more
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="research-query">Research Topic</Label>
                  <div className="flex mt-1.5 gap-2">
                    <Input 
                      id="research-query"
                      placeholder="Enter your research topic..."
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                    />
                    <Button 
                      onClick={() => performResearch()}
                      disabled={loading.research}
                      className="flex-shrink-0"
                    >
                      {loading.research ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Researching...
                        </>
                      ) : (
                        <>Research</>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Suggested Topics</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {researchTopics.map((topic, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setTopicAndResearch(topic)}
                        disabled={loading.research}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {error.research && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>{error.research}</p>
                  </div>
                )}
                
                {loading.research && (
                  <div className="space-y-4 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}
                
                {researchResult && (
                  <div className="mt-4 border rounded-md p-4 bg-gray-50">
                    <div className="prose prose-sm max-w-none">
                      {/* We'd use a markdown renderer here in a real implementation */}
                      <div dangerouslySetInnerHTML={{ __html: researchResult.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Bot className="h-3 w-3" />
                <span>Powered by Google Gemini</span>
              </div>
              
              {researchResult && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => performResearch()}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Update Research
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>AI Image Generation</span>
              </CardTitle>
              <CardDescription>
                Generate custom motivational and fitness imagery for your journey
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-prompt">Image Description</Label>
                  <Textarea 
                    id="image-prompt"
                    placeholder="Describe the image you want to generate..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={() => generateImage()}
                      disabled={loading.image}
                    >
                      {loading.image ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>Generate Image</>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Inspiration</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {imagePrompts.map((prompt, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        className="h-auto py-2 justify-start text-left"
                        onClick={() => setPromptAndGenerate(prompt)}
                        disabled={loading.image}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {error.image && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>{error.image}</p>
                  </div>
                )}
                
                {loading.image && (
                  <div className="mt-4 flex flex-col items-center justify-center py-8 border rounded-md bg-gray-50">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-sm text-gray-500">Creating your custom image...</p>
                  </div>
                )}
                
                {imageResult && (
                  <div className="mt-4">
                    <div className="border rounded-md bg-gray-50 p-4">
                      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-md mb-4">
                        <div className="flex flex-col items-center text-center">
                          <ImageIcon className="h-16 w-16 text-primary/40 mb-4" stroke="currentColor" strokeWidth={1} />
                          <p className="text-sm text-gray-600">
                            Image description generated. In a production environment, this would generate an actual image.
                          </p>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <h4 className="text-sm font-medium mb-2">Image Description:</h4>
                        <p className="text-sm text-gray-700">{imageResult}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Bot className="h-3 w-3" />
                <span>Powered by Google Gemini</span>
              </div>
              
              {imageResult && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateImage()}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Regenerate
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}