import React from 'react';
// Replaced ui/card with glass/GlassCard
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle
} from "@/components/glass/GlassCard"; // Corrected path
import { BookOpen, Zap } from 'lucide-react';

interface DailyMotivationProps {
  quote?: string;
  author?: string;
}

export function DailyMotivation({ 
  quote = "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.",
  author = "Mark Twain"
}: DailyMotivationProps) {
  return (
    // Using GlassCard. Added specific text color for quote and author for clarity.
    // GlassCard handles base shadow and glass effect. Additional shadow-xl can be kept if desired.
    <GlassCard className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <GlassCardHeader className="pb-3 border-b border-white/20"> {/* Ensure border contrast */}
        {/* GlassCardTitle handles its own text color (default white) */}
        <GlassCardTitle className="text-xl flex items-center tracking-tight">
          <Zap className="h-5 w-5 mr-2 text-yellow-300" />
          Daily Spark of Wisdom
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="pt-5 pb-6">
        <blockquote className="text-lg md:text-xl italic leading-relaxed text-gray-100"> {/* Lighter text for quote */}
          "{quote}"
        </blockquote>
        <p className="text-sm mt-4 text-right font-semibold text-gray-300 opacity-90">- {author}</p> {/* Lighter text for author */}
      </GlassCardContent>
    </GlassCard>
  );
}