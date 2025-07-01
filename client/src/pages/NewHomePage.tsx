import React, { useState, useEffect, useRef } from "react";

// Import reusable components
import { CTASection } from "@/components/landing/CTASection";
import { MeetTheCoachesSection } from "@/components/landing/MeetTheCoachesSection";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { FAQItem } from "@/components/landing/FAQItem";
import { Accordion } from "@/components/ui/accordion";
// Corrected import: Reverted to path alias
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

// Import Lucide icons
import {
  Users, Brain, Zap, TrendingUp, FlaskConical, ShieldCheck,
  Dumbbell, Apple as NutritionIcon, Bed, Lightbulb, Users2, Landmark,
  Smartphone
} from "lucide-react";

// Data structures (remain the same)
const keyFeaturesData = [
  { id: "feat-multi-view", icon: <Users size={32} />, title: "Multi-view Tracking", description: "Daily, weekly, and monthly views for both absolute (did/didn't do) and frequency-based (2x, 3x per week) habits." },
  { id: "feat-ai-coach", icon: <Brain size={32} />, title: "AI Habit Coach", description: "Get personalized guidance and recommendations from your automated AI coach to optimize your habit formation and consistency." },
  { id: "feat-break-bad", icon: <Zap size={32} />, title: "Break Bad Habits & Addictions", description: "Specialized tools to identify, track, and overcome negative patterns, including addiction recovery support." },
  { id: "feat-one-percent", icon: <TrendingUp size={32} />, title: "1% Better Every Day", description: "Make consistent improvements following the \"compound effect\" principle. 1% better each day leads to 37x improvement in a year." },
  { id: "feat-science", icon: <FlaskConical size={32} />, title: "Scientific Approach", description: "Based on evidence-backed protocols from leading experts like Dr. Peter Attia and Gary Brecka for optimal health outcomes." },
  { id: "feat-resilience", icon: <ShieldCheck size={32} />, title: "Mental Resilience", description: "Build unwavering discipline inspired by methods from David Goggins and Jocko Willink to stay consistent through challenges." },
];
const performanceAreasData = [
  { id: "area-physical", icon: <Dumbbell size={32} />, title: "Physical Training", description: "Strength, cardio, mobility, and recovery" },
  { id: "area-nutrition", icon: <NutritionIcon size={32} />, title: "Nutrition & Fueling", description: "Diet, hydration, and supplements" },
  { id: "area-sleep", icon: <Bed size={32} />, title: "Sleep & Hygiene", description: "Quality rest and recovery cycles" },
  { id: "area-mental", icon: <Lightbulb size={32} />, title: "Mental Acuity & Growth", description: "Focus, learning, and mindfulness" },
  { id: "area-relationships", icon: <Users2 size={32} />, title: "Relationships", description: "Social connections and communication" },
  { id: "area-financial", icon: <Landmark size={32} />, title: "Financial Habits", description: "Saving, investing, and wealth building" },
];
const testimonialsData = [
    { id: "t-hormozi", imageSrc: "/placeholder-avatar.png", altText: "Alex Hormozi", name: "Alex Hormozi", title: "Founder, Acquisition.com", quote: "MaxiMost perfectly embodies the 'small hinges swing big doors' philosophy. The ability to track consistent 1% improvements across multiple life domains is a game-changer. This is the operating system for high performers." },
    { id: "t-urban", imageSrc: "/placeholder-avatar.png", altText: "Melissa Urban", name: "Melissa Urban", title: "Co-Founder & CEO, Whole30", quote: "I've tried dozens of habit trackers, but none integrate across all aspects of wellness like MaxiMost. The fitness tracker integration is brilliant—tracking my habits without requiring manual input makes consistency so much easier." },
    { id: "t-huberman", imageSrc: "/placeholder-avatar.png", altText: "Andrew Huberman", name: "Andrew Huberman", title: "Neuroscientist & Professor", quote: "The science behind MaxiMost is solid. By focusing on small, consistent behavior changes across multiple domains, they've created a system that works with our brain's neuroplasticity rather than against it. This is how lasting habits are formed." },
    { id: "t-patrick", imageSrc: "/placeholder-avatar.png", altText: "Rhonda Patrick", name: "Rhonda Patrick", title: "Biochemist & Health Expert", quote: "The holistic approach to health in MaxiMost is what sets it apart. It understands that physical training, nutrition, sleep, mental acuity, social relationships, and finances are all interconnected systems. Finally, a habit tracker that sees the complete picture!" },
];
const faqData = [
    { id: "faq-1", question: "What makes Maximost different from other habit trackers?", answer: "Maximost isn't just a habit tracker—it's an AI-powered life operating system that applies both ancient Stoic wisdom and modern performance science. We integrate with 5 fitness trackers, provide automatic habit completion, offer streak milestones, and focus on the \"maximum bang for your buck\" principle to truly transform your life one habit at a time." },
    { id: "faq-2", question: "How does the fitness tracker integration work?", answer: "Maximost connects seamlessly with Fitbit, Samsung Health, Apple Health, Google Fit, and Garmin. Once connected, relevant activities like steps, workouts, sleep data, and more will automatically mark corresponding habits as complete without manual input, making consistent tracking effortless." },
    { id: "faq-3", question: "What are the six key performance areas?", answer: "Maximost tracks habits across six critical life domains: Physical Training (red), Nutrition & Fueling (orange), Sleep & Hygiene (indigo), Mental Acuity & Growth (yellow), Relationships & Community (blue), and Financial Habits (green). This holistic approach ensures you're developing in all areas that truly matter for a fulfilling life." },
    { id: "faq-4", question: "How does the streak system motivate long-term habit formation?", answer: "Our streak system counts consecutive days of habit completion while providing milestone celebrations (3, 7, 14, 30, 60, 90, 180, 365 days). The system is designed with flexibility—continuing if you complete habits today or yesterday—while also encouraging consistent daily action for maximum habit formation." },
];

const NewHomePage: React.FC = () => {
  const [activeGlowColor, setActiveGlowColor] = useState<string | null>(null);

  const handlePersonaHover = (glowColor: string | undefined) => {
    setActiveGlowColor(glowColor || null);
  };

  const handleWaitlistSubmit = (formData: { email: string; rewardsOptIn: boolean }) => {
    console.log("Waitlist form submitted:", formData);
    alert(`Thank you, ${formData.email}! You've been added to the waitlist.`);
  };

  const fitnessTrackers = [
    { name: "Fitbit", icon: <Smartphone className="inline-block h-6 w-6 mr-1" /> },
    { name: "Samsung Health", icon: <Smartphone className="inline-block h-6 w-6 mr-1" /> },
    { name: "Apple Health", icon: <Smartphone className="inline-block h-6 w-6 mr-1" /> },
    { name: "Google Fit", icon: <Smartphone className="inline-block h-6 w-6 mr-1" /> },
    { name: "Garmin", icon: <Smartphone className="inline-block h-6 w-6 mr-1" /> },
  ];

  // Refs for sections to be animated
  const keyFeaturesRef = useRef<HTMLDivElement>(null);
  const performanceAreasRef = useRef<HTMLDivElement>(null);
  const fitnessTrackersRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const coachesRef = useRef<HTMLDivElement>(null);

  // Intersection observer hooks
  const isKeyFeaturesVisible = useIntersectionObserver(keyFeaturesRef, { threshold: 0.1, triggerOnce: true });
  const isPerformanceAreasVisible = useIntersectionObserver(performanceAreasRef, { threshold: 0.1, triggerOnce: true });
  const isFitnessTrackersVisible = useIntersectionObserver(fitnessTrackersRef, { threshold: 0.1, triggerOnce: true });
  const isTestimonialsVisible = useIntersectionObserver(testimonialsRef, { threshold: 0.1, triggerOnce: true });
  const isFaqVisible = useIntersectionObserver(faqRef, { threshold: 0.1, triggerOnce: true });
  const isFinalCtaVisible = useIntersectionObserver(finalCtaRef, { threshold: 0.1, triggerOnce: true });
  const isCoachesVisible = useIntersectionObserver(coachesRef, { threshold: 0.1, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-neutral-900">
      <main className="flex-grow">
        {/* Section 1: UVP / Hero Section */}
        <section id="uvp" className="relative py-20 md:py-28 lg:py-32 text-white overflow-hidden">
          {/* Animated Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              animation: 'heroGradientAnimation 15s ease infinite alternate',
              backgroundSize: '200% 200%',
              backgroundImage: activeGlowColor
                ? `linear-gradient(-45deg, #0A192F, ${activeGlowColor}, #0A192F)`
                : 'linear-gradient(-45deg, #0A192F, #1E3A8A, #3B82F6, #0A192F)',
              transition: 'background-image 0.5s ease-in-out',
            }}
          />
          <div className="relative z-10 container mx-auto max-w-4xl text-center">
            <CTASection
              headline="Forge Your Elite Habits. Master Your Mind."
              description="Harness the power of AI to build extraordinary discipline. Our system integrates performance science with flexible coaching philosophies to match your drive."
              buttonText="Get Started Free"
              emailPlaceholder="Enter your email to begin"
              rewardsText="Join now for early access and exclusive benefits."
              showRewardsOptIn={false}
              onSubmit={handleWaitlistSubmit}
            />
          </div>
        </section>

        {/* Section 2: Meet The Coaches */}
        <div ref={coachesRef} className={`transition-all duration-700 ease-out ${isCoachesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <MeetTheCoachesSection
            title="Find the Coach That Drives You"
            className="py-16 md:py-20 bg-background dark:bg-neutral-900"
            onPersonaHover={handlePersonaHover}
          />
        </div>

        {/* Section 3: Key Features */}
        <section ref={keyFeaturesRef} id="key-features" className={`py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30 transition-all duration-700 ease-out ${isKeyFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">Key Features of MaxiMost</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {keyFeaturesData.map((feature) => ( <FeatureCard key={feature.id} icon={feature.icon} title={feature.title} description={feature.description} /> ))}
            </div>
          </div>
        </section>

        {/* Section 4: Six Key Performance Areas */}
        <section ref={performanceAreasRef} id="performance-areas" className={`py-16 md:py-20 bg-background dark:bg-neutral-900 transition-all duration-700 ease-out ${isPerformanceAreasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">Holistic Growth Across Six Key Performance Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {performanceAreasData.map((area) => ( <FeatureCard key={area.id} icon={area.icon} title={area.title} description={area.description} /> ))}
            </div>
          </div>
        </section>

        {/* Section 5: Fitness Tracker Integration */}
        <section ref={fitnessTrackersRef} id="fitness-trackers" className={`py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30 transition-all duration-700 ease-out ${isFitnessTrackersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* ... content for fitness trackers ... */}
        </section>

        {/* Section 6: Social Proof (Testimonials) */}
        <section ref={testimonialsRef} id="testimonials" className={`py-16 md:py-20 bg-background dark:bg-neutral-900 transition-all duration-700 ease-out ${isTestimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* ... content for testimonials ... */}
        </section>

        {/* Section 7: FAQ */}
        <section ref={faqRef} id="faq" className={`py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30 transition-all duration-700 ease-out ${isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* ... content for FAQ ... */}
        </section>

        {/* Section 8: Final CTA Section */}
        <section ref={finalCtaRef} id="final-cta" className={`py-16 md:py-24 bg-gradient-to-t from-background to-muted/20 dark:from-neutral-900 dark:to-neutral-800/30 transition-all duration-700 ease-out ${isFinalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* ... content for final CTA ... */}
        </section>

        <footer className="py-8 border-t border-border">
            {/* ... footer content ... */}
        </footer>
      </main>
    </div>
  );
};

export default NewHomePage;
