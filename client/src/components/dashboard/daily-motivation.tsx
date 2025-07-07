import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap } from 'lucide-react'; // Added Zap to imports

interface DailyMotivationProps {
  quote?: string;
  author?: string;
}

export function DailyMotivation({ 
  quote = "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.",
  author = "Mark Twain"
}: DailyMotivationProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="pb-3 border-b border-white/20">
        <CardTitle className="text-xl font-bold flex items-center tracking-tight">
          <Zap className="h-5 w-5 mr-2 text-yellow-300" /> {/* Changed icon */}
          Daily Spark of Wisdom
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 pb-6">
        <blockquote className="text-lg md:text-xl italic leading-relaxed">
          "{quote}"
        </blockquote>
        <p className="text-sm mt-4 text-right font-semibold opacity-90">- {author}</p>
      </CardContent>
    </Card>
  );
}