import React, { useState, useRef, useEffect } from "react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver"; // Import the hook
import { cn } from "@/lib/utils"; // Import cn utility

// import { PageContainer } from "@/components/layout/page-container";

// Import reusable components
import { CTASection } from "@/components/landing/CTASection";
import { MeetTheCoachesSection } from "@/components/landing/MeetTheCoachesSection";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { FAQItem } from "@/components/landing/FAQItem";
import { Accordion } from "@/components/ui/accordion";

// Import Lucide icons (already defined in previous step)
import {
  Users, Brain, Zap, TrendingUp, FlaskConical, ShieldCheck,
  Dumbbell, Apple as NutritionIcon, Bed, Lightbulb, Users2, Landmark,
  Smartphone,
} from "lucide-react";

// Data structures (full data from previous steps should be here)
const keyFeaturesData = [
  { id: "feat-multi-view", icon: <Users size={32} />, title: "Multi-view Tracking", description: "Daily, weekly, and monthly views for both absolute (did/didn\'t do) and frequency-based (2x, 3x per week) habits." },
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
  { id: "t-hormozi", imageSrc: "/placeholder-avatar.png", altText: "Alex Hormozi", name: "Alex Hormozi", title: "Founder, Acquisition.com", quote: "MaxiMost perfectly embodies the \'small hinges swing big doors\' philosophy. The ability to track consistent 1% improvements across multiple life domains is a game-changer. This is the operating system for high performers." },
  { id: "t-urban", imageSrc: "/placeholder-avatar.png", altText: "Melissa Urban", name: "Melissa Urban", title: "Co-Founder & CEO, Whole30", quote: "I\'ve tried dozens of habit trackers, but none integrate across all aspects of wellness like MaxiMost. The fitness tracker integration is brilliant—tracking my habits without requiring manual input makes consistency so much easier." },
  { id: "t-huberman", imageSrc: "/placeholder-avatar.png", altText: "Andrew Huberman", name: "Andrew Huberman", title: "Neuroscientist & Professor", quote: "The science behind MaxiMost is solid. By focusing on small, consistent behavior changes across multiple domains, they\'ve created a system that works with our brain\'s neuroplasticity rather than against it. This is how lasting habits are formed." },
  { id: "t-patrick", imageSrc: "/placeholder-avatar.png", altText: "Rhonda Patrick", name: "Rhonda Patrick", title: "Biochemist & Health Expert", quote: "The holistic approach to health in MaxiMost is what sets it apart. It understands that physical training, nutrition, sleep, mental acuity, social relationships, and finances are all interconnected systems. Finally, a habit tracker that sees the complete picture!" },
];
const faqData = [
  { id: "faq-1", question: "What makes Maximost different from other habit trackers?", answer: "Maximost isn\'t just a habit tracker—it\'s an AI-powered life operating system that applies both ancient Stoic wisdom and modern performance science. We integrate with 5 fitness trackers, provide automatic habit completion, offer streak milestones, and focus on the \"maximum bang for your buck\" principle to truly transform your life one habit at a time." },
  { id: "faq-2", question: "How does the fitness tracker integration work?", answer: "Maximost connects seamlessly with Fitbit, Samsung Health, Apple Health, Google Fit, and Garmin. Once connected, relevant activities like steps, workouts, sleep data, and more will automatically mark corresponding habits as complete without manual input, making consistent tracking effortless." },
  { id: "faq-3", question: "What are the six key performance areas?", answer: "Maximost tracks habits across six critical life domains: Physical Training (red), Nutrition & Fueling (orange), Sleep & Hygiene (indigo), Mental Acuity & Growth (yellow), Relationships & Community (blue), and Financial Habits (green). This holistic approach ensures you\'re developing in all areas that truly matter for a fulfilling life." },
  { id: "faq-4", question: "How does the streak system motivate long-term habit formation?", answer: "Our streak system counts consecutive days of habit completion while providing milestone celebrations (3, 7, 14, 30, 60, 90, 180, 365 days). The system is designed with flexibility—continuing if you complete habits today or yesterday—while also encouraging consistent daily action for maximum habit formation." },
];


const NewHomePage: React.FC = () => {
  const [activeGlowColorRgb, setActiveGlowColorRgb] = useState<string | null>(null);

  const handlePersonaHover = (glowColorRgb: string | undefined) => {
    setActiveGlowColorRgb(glowColorRgb || null);
  };

  const handleWaitlistSubmit = (formData: { email: string; rewardsOptIn: boolean }) => {
    console.log("Waitlist form submitted:", formData);
    alert(`Thank you, ${formData.email}! You\'ve been added to the waitlist.`);
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

  // Intersection observer hooks
  const isKeyFeaturesVisible = useIntersectionObserver(keyFeaturesRef, { threshold: 0.1, triggerOnce: true });
  const isPerformanceAreasVisible = useIntersectionObserver(performanceAreasRef, { threshold: 0.1, triggerOnce: true });
  const isFitnessTrackersVisible = useIntersectionObserver(fitnessTrackersRef, { threshold: 0.1, triggerOnce: true });
  const isTestimonialsVisible = useIntersectionObserver(testimonialsRef, { threshold: 0.1, triggerOnce: true });
  const isFaqVisible = useIntersectionObserver(faqRef, { threshold: 0.1, triggerOnce: true });
  const isFinalCtaVisible = useIntersectionObserver(finalCtaRef, { threshold: 0.1, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-neutral-900">
      <main className="flex-grow">
        {/* Section 1: UVP / Hero Section */}
        <section
          id="uvp"
          className="relative py-20 md:py-28 lg:py-32 text-white overflow-hidden" // text-white for contrast on animated bg
        >
          {/* Animated Background Placeholder - Simple Gradient Animation */}
          <div
            className="absolute inset-0 z-0 hero-background-animation" // Added class for new animation
            style={{
              // Base background color, will be layered with animated elements via CSS
              backgroundColor: '#0A192F',
              // CSS variable for dynamic glow color from persona hover
              '--hero-glow-color-rgb': activeGlowColorRgb || '0, 128, 255' // Default: some blue
            } as React.CSSProperties}
          />
          {/* New animation will be handled by .hero-background-animation class */}

          <div className="relative z-10 container mx-auto max-w-4xl text-center"> {/* Increased max-w for new text */}
            <CTASection
              headline="Forge Your Elite Habits. Master Your Mind."
              description="Harness the power of AI to build extraordinary discipline. Our system integrates performance science with flexible coaching philosophies to match your drive."
              buttonText="Get Started Free" // Updated CTA text as per Ticket #A
              emailPlaceholder="Enter your email to begin" // Slightly updated placeholder
              rewardsText="Join now for early access and exclusive benefits." // Simplified rewards text
              showRewardsOptIn={false} // Simplified for initial hero focus, can be re-evaluated
              onSubmit={handleWaitlistSubmit}
              // Removed className specific to max-w-3xl to allow container to control width
            />
          </div>
        </section>

        {/* Section 2: Meet The Coaches */}
        <MeetTheCoachesSection
          title="Find the Coach That Drives You"
          className="py-16 md:py-20 bg-background dark:bg-neutral-900" // This section can also be animated if desired
          onPersonaHover={handlePersonaHover}
          onPersonaLeave={() => handlePersonaHover(undefined)}
        />

        {/* Section 3: Key Features */}
        <section
          id="key-features"
          ref={keyFeaturesRef}
          className={cn(
            "py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isKeyFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">Key Features of MaxiMost</h2>
            {keyFeaturesData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {keyFeaturesData.map((feature) => ( <FeatureCard key={feature.id} icon={feature.icon} title={feature.title} description={feature.description} /> ))}
              </div>
            ) : ( <p className="text-center text-muted-foreground">Feature details coming soon.</p> )}
          </div>
        </section>

        {/* Section 4: Six Key Performance Areas */}
        <section
          id="performance-areas"
          ref={performanceAreasRef}
          className={cn(
            "py-16 md:py-20 bg-background dark:bg-neutral-900", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isPerformanceAreasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">Holistic Growth Across Six Key Performance Areas</h2>
            {performanceAreasData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {performanceAreasData.map((area) => ( <FeatureCard key={area.id} icon={area.icon} title={area.title} description={area.description} /> ))}
              </div>
            ) : ( <p className="text-center text-muted-foreground">Performance area details coming soon.</p> )}
          </div>
        </section>

        {/* Section 5: Fitness Tracker Integration */}
        <section
          id="fitness-trackers"
          ref={fitnessTrackersRef}
          className={cn(
            "py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isFitnessTrackersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitness Tracker Integration
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect All Your Health Data
            </p>
            <p className="text-md text-muted-foreground mb-8 max-w-3xl mx-auto">
              Integration with your favorite fitness platforms automatically
              completes your habits based on your activity.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
              {fitnessTrackers.map(tracker => (
                <div key={tracker.name} className="flex items-center p-2 bg-background dark:bg-neutral-700/50 rounded-md shadow">
                  {tracker.icon}
                  <span className="ml-2 text-sm font-medium text-foreground">{tracker.name}</span>
                </div>
              ))}
            </div>
            <div className="max-w-2xl mx-auto text-left space-y-2 text-muted-foreground mb-10">
              <p>✓ Auto-complete workout habits when your fitness tracker records activity.</p>
              <p>✓ Sleep habits marked complete when your tracker records sufficient sleep.</p>
              <p>✓ Heart rate and recovery metrics for holistic health tracking.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-background dark:bg-neutral-800 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-foreground mb-3">Fitbit Activity (Example)</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><strong className="text-foreground">Steps:</strong> 9,857</p>
                  <p><strong className="text-foreground">Miles:</strong> 4.3</p>
                  <p><strong className="text-foreground">Calories:</strong> 2,478</p>
                  <p><strong className="text-foreground">Active Min:</strong> 45</p>
                  <p><strong className="text-foreground">Sleep:</strong> 7:15</p>
                  <p><strong className="text-foreground">Resting BPM:</strong> 68</p>
                </div>
              </div>
              <div className="p-6 bg-background dark:bg-neutral-800 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-foreground mb-3">Samsung Health (Example)</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><strong className="text-foreground">Steps:</strong> 11,235</p>
                  <p><strong className="text-foreground">Miles:</strong> 5.2</p>
                  <p><strong className="text-foreground">Calories:</strong> 2,912</p>
                  <p><strong className="text-foreground">Active Min:</strong> 65</p>
                  <p><strong className="text-foreground">Sleep:</strong> 8:10</p>
                  <p><strong className="text-foreground">Resting BPM:</strong> 71</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Social Proof (Testimonials) */}
        <section
          id="testimonials"
          ref={testimonialsRef}
          className={cn(
            "py-16 md:py-20 bg-background dark:bg-neutral-900", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isTestimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">
              What People Are Saying
            </h2>
            {testimonialsData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
                {testimonialsData.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    imageSrc={testimonial.imageSrc}
                    altText={testimonial.altText}
                    name={testimonial.name}
                    title={testimonial.title}
                    quote={testimonial.quote}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Testimonials coming soon.</p>
            )}
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section
          id="faq"
          ref={faqRef}
          className={cn(
            "py-16 md:py-20 bg-muted/20 dark:bg-neutral-800/30", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">
              Frequently Asked Questions
            </h2>
            {faqData.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faqItem) => (
                  <FAQItem
                    key={faqItem.id}
                    value={faqItem.id}
                    question={faqItem.question}
                    answer={faqItem.answer}
                  />
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground">FAQs coming soon.</p>
            )}
          </div>
        </section>

        {/* Section 8: Final CTA Section */}
        <section
          id="final-cta"
          ref={finalCtaRef}
          className={cn(
            "py-16 md:py-24 bg-gradient-to-t from-background to-muted/20 dark:from-neutral-900 dark:to-neutral-800/30", // Base layout/styling
            "transition-all duration-500 ease-out", // Transition behavior
            isFinalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5' // State-dependent classes
          )}
        >
          <CTASection
            headline="Get Notified at Launch & Receive an Exclusive Early Adopter Bonus!"
            description="Sign up for early access and unlock special benefits reserved for our first members."
            buttonText="Get Early Access"
            emailPlaceholder="Enter your email address"
            rewardsText="Join our rewards program & refer friends for premium rewards & features"
            showRewardsOptIn={true}
            onSubmit={handleWaitlistSubmit}
            className="container mx-auto max-w-3xl"
          />
        </section>

        {/* Simple Footer */}
        <footer className="py-8 border-t border-border">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p className="mb-2">MaxiMost Logo (Placeholder)</p>
                <div className="space-x-4 mb-2">
                    <a href="#" className="hover:text-foreground">Privacy Policy</a>
                    <a href="#" className="hover:text-foreground">Terms of Service</a>
                    <a href="#" className="hover:text-foreground">Contact Us</a>
                </div>
                <p>© {new Date().getFullYear()} Maximost. All rights reserved.</p>
            </div>
        </footer>

      </main>
    </div>
  );
};

export default NewHomePage;
