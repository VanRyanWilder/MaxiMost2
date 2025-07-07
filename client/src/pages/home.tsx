import React, { useState, useEffect, useRef, useCallback } from "react";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadStarsPreset } from "tsparticles-preset-stars";

// Import reusable components
import { CTASection } from "../components/landing/CTASection";
import { MeetTheCoachesSection } from "../components/landing/MeetTheCoachesSection";
import { FeatureCard } from "../components/landing/FeatureCard";
import { TestimonialCard } from "../components/landing/TestimonialCard";
import { FAQItem } from "../components/landing/FAQItem";
import { Accordion } from "../components/ui/accordion";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

// Import Lucide icons
import {
  Users, Brain, Zap, TrendingUp, FlaskConical, ShieldCheck,
  Dumbbell, Apple as NutritionIcon, Bed, Lightbulb, Landmark, // Users2 was here
  Smartphone, Activity // Make sure Activity is here
} from "lucide-react";

// Helper function to convert hex color to RGB string "r,g,b"
const hexToRgbString = (hex: string): string | null => {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : null;
};

// Data structures
const keyFeaturesData = [
  { id: "feat-multi-view", icon: <Users size={32} className="text-sky-400" />, title: "Multi-view Tracking", description: "Daily, weekly, and monthly views for both absolute (did/didn't do) and frequency-based (2x, 3x per week) habits." },
  { id: "feat-ai-coach", icon: <Brain size={32} className="text-emerald-400" />, title: "AI Habit Coach", description: "Get personalized guidance and recommendations from your automated AI coach to optimize your habit formation and consistency." },
  { id: "feat-break-bad", icon: <Zap size={32} className="text-amber-400" />, title: "Break Bad Habits & Addictions", description: "Specialized tools to identify, track, and overcome negative patterns, including addiction recovery support." },
  { id: "feat-one-percent", icon: <TrendingUp size={32} className="text-sky-400" />, title: "1% Better Every Day", description: "Make consistent improvements following the \"compound effect\" principle. 1% better each day leads to 37x improvement in a year." },
  { id: "feat-science", icon: <FlaskConical size={32} className="text-emerald-400" />, title: "Scientific Approach", description: "Based on evidence-backed protocols from leading experts like Dr. Peter Attia and Gary Brecka for optimal health outcomes." },
  { id: "feat-resilience", icon: <ShieldCheck size={32} className="text-amber-400" />, title: "Mental Resilience", description: "Build unwavering discipline inspired by methods from David Goggins and Jocko Willink to stay consistent through challenges." },
];
const performanceAreasData = [
  { id: "area-physical", icon: <Dumbbell size={32} />, title: "Physical Training", description: "Strength, cardio, mobility, and recovery" },
  { id: "area-nutrition", icon: <NutritionIcon size={32} />, title: "Nutrition & Fueling", description: "Diet, hydration, and supplements" },
  { id: "area-sleep", icon: <Bed size={32} />, title: "Sleep & Hygiene", description: "Quality rest and recovery cycles" },
  { id: "area-mental", icon: <Lightbulb size={32} />, title: "Mental Acuity & Growth", description: "Focus, learning, and mindfulness" },
  { id: "area-relationships", icon: <Users size={32} />, title: "Relationships", description: "Social connections and communication" }, // Changed Users2 to Users
  { id: "area-financial", icon: <Landmark size={32} />, title: "Financial Habits", description: "Saving, investing, and wealth building" },
];
const testimonialsData = [
    { id: "t-hormozi", imageSrc: "https://placehold.co/100x100/1E293B/FFFFFF?text=AH", altText: "Alex Hormozi", name: "Alex Hormozi", title: "Founder, Acquisition.com", quote: "MaxiMost perfectly embodies the 'small hinges swing big doors' philosophy. The ability to track consistent 1% improvements across multiple life domains is a game-changer. This is the operating system for high performers." },
    { id: "t-urban", imageSrc: "https://placehold.co/100x100/1E293B/FFFFFF?text=MU", altText: "Melissa Urban", name: "Melissa Urban", title: "Co-Founder & CEO, Whole30", quote: "I've tried dozens of habit trackers, but none integrate across all aspects of wellness like MaxiMost. The fitness tracker integration is brilliant—tracking my habits without requiring manual input makes consistency so much easier." },
    { id: "t-huberman", imageSrc: "https://placehold.co/100x100/1E293B/FFFFFF?text=AH", altText: "Andrew Huberman", name: "Andrew Huberman", title: "Neuroscientist & Professor", quote: "The science behind MaxiMost is solid. By focusing on small, consistent behavior changes across multiple domains, they've created a system that works with our brain's neuroplasticity rather than against it. This is how lasting habits are formed." },
    { id: "t-patrick", imageSrc: "https://placehold.co/100x100/1E293B/FFFFFF?text=RP", altText: "Rhonda Patrick", name: "Rhonda Patrick", title: "Biochemist & Health Expert", quote: "The holistic approach to health in MaxiMost is what sets it apart. It understands that physical training, nutrition, sleep, mental acuity, social relationships, and finances are all interconnected systems. Finally, a habit tracker that sees the complete picture!" },
];
const faqData = [
    { id: "faq-1", question: "What makes Maximost different from other habit trackers?", answer: "Maximost isn't just a habit tracker—it's an AI-powered life operating system that applies both ancient Stoic wisdom and modern performance science. We integrate with 5 fitness trackers, provide automatic habit completion, offer streak milestones, and focus on the \"maximum bang for your buck\" principle to truly transform your life one habit at a time." },
    { id: "faq-2", question: "How does the fitness tracker integration work?", answer: "Maximost connects seamlessly with Fitbit, Samsung Health, Apple Health, Google Fit, and Garmin. Once connected, relevant activities like steps, workouts, sleep data, and more will automatically mark corresponding habits as complete without manual input, making consistent tracking effortless." },
    { id: "faq-3", question: "What are the six key performance areas?", answer: "Maximost tracks habits across six critical life domains: Physical Training (red), Nutrition & Fueling (orange), Sleep & Hygiene (indigo), Mental Acuity & Growth (yellow), Relationships & Community (blue), and Financial Habits (green). This holistic approach ensures you're developing in all areas that truly matter for a fulfilling life." },
    { id: "faq-4", question: "How does the streak system motivate long-term habit formation?", answer: "Our streak system counts consecutive days of habit completion while providing milestone celebrations (3, 7, 14, 30, 60, 90, 180, 365 days). The system is designed with flexibility—continuing if you complete habits today or yesterday—while also encouraging consistent daily action for maximum habit formation." },
];

const Home: React.FC = () => {
  const [activeGlowColor, setActiveGlowColor] = useState<string | null>(null); // For hero gradient on hover - might be deprecated by particle effect
  const [particleThemeColor, setParticleThemeColor] = useState<string | undefined>(undefined); // For particle theming on click

  const handlePersonaHover = (glowColor: string | undefined) => {
    // This function was for the CSS gradient hero background, which is commented out.
    // setActiveGlowColor(glowColor || null);
  };

  const handlePersonaSelectGlow = (glowColorRgb: string | undefined) => {
    setParticleThemeColor(glowColorRgb);
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
    { name: "Strava", icon: <Activity className="inline-block h-6 w-6 mr-1" /> }, // Added Strava with placeholder Activity icon
  ];

  // Refs for sections to be animated
  const keyFeaturesRef = useRef<HTMLDivElement>(null);
  const performanceAreasRef = useRef<HTMLDivElement>(null);
  const fitnessTrackersRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
  const coachesRef = useRef<HTMLDivElement>(null);

  // tsParticles setup
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadStarsPreset(engine);
  }, []);

  const getParticlesOptions = useCallback((themeColorRgb: string | undefined) => {
    const baseOptions = {
      preset: "stars",
      background: {
        color: {
          value: "#0A192F", // Base background color
        },
      },
      particles: {
        number: {
          value: 80, // Default from preset, can adjust
        },
        color: {
          value: "#FFFFFF", // Default particle color (white)
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: {min: 0.1, max: 0.8}, // Make stars slightly more visible
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false
          }
        },
        size: {
          value: {min: 0.5, max: 1.5}, // Slightly varied star sizes
        },
        move: {
          enable: true,
          speed: 0.3, // Slower speed for a more subtle effect
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
        links: { // Disable links for a cleaner star field
            enable: false,
        }
      },
      interactivity: { // Disable interactivity for performance and subtlety
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
          },
          onclick: {
            enable: false,
          },
          resize: true
        }
      },
      detectRetina: true,
    };

    if (themeColorRgb) {
      // If a theme color is selected, tint the stars
      // Using HSL to maintain brightness but apply hue might be too complex here.
      // Let's try making some stars take on the theme color directly.
      // This might be too strong. A more subtle approach would be to blend.
      // For simplicity, let's just change the general particle color.
      // The RGB string needs to be formatted as "rgb(r,g,b)" for tsparticles color value.
      baseOptions.particles.color.value = `rgb(${themeColorRgb})`;
      // Could also make a small portion of particles this color, e.g.
      // baseOptions.particles.color.value = ["#FFFFFF", `rgb(${themeColorRgb})`];
      // baseOptions.particles.number.value = 100; // increase if some are themed
    }
    return baseOptions;
  }, []);

const SectionDivider = () => (
  <div className="py-12 md:py-16">
    <div className="h-px w-full bg-white/10 shadow-[0_0_15px_0px_rgba(255,255,255,0.2)]"></div>
  </div>
);

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
      <header className="absolute top-0 left-0 w-full z-50 p-4 md:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <img
            src="/images/maximost-logo-0.png"
            alt="MaxiMost Logo Left"
            className="h-24 w-24 md:h-28 md:w-28" /* Increased size, filter was already removed */
          />
          <img
            src="/images/maximost-logo-0.png"
            alt="MaxiMost Logo Right"
            className="h-24 w-24 md:h-28 md:w-28" /* Increased size, filter was already removed */
          />
          {/* Navigation links can be added here later if needed */}
        </div>
      </header>
      <main className="flex-grow">
        {/* Section 1: UVP / Hero Section */}
        <section
          id="uvp"
          className="relative py-20 md:py-28 lg:py-32 text-white overflow-hidden"
        >
          <Particles
            id="tsparticles-hero"
            init={particlesInit}
            options={getParticlesOptions(particleThemeColor) as any} // Use dynamic options
            className="absolute inset-0 z-0"
          />
          {/* The existing gradient div can be removed or kept as a fallback/overlay if desired
          <div
            className="absolute inset-0 z-0 hero-background-animation"
            style={{
              backgroundSize: '200% 200%',
              backgroundImage: activeGlowColor
                ? `linear-gradient(-45deg, #0A192F, ${activeGlowColor}, #0A192F)`
                : 'linear-gradient(-45deg, #0A192F, #1E3A8A, #3B82F6, #0A192F)',
              transition: 'background-image 0.5s ease-in-out, --hero-glow-color-rgb 0.5s ease-in-out',
              ['--hero-glow-color-rgb' as string]: activeGlowColor ? hexToRgbString(activeGlowColor) : '0,128,255',
            } as React.CSSProperties}
          /> */}

          <div className="relative z-10 container mx-auto max-w-4xl text-center">
            <CTASection
              headline="Forge Your Elite Habits. Master Your Mind."
              description="Harness the power of AI to build extraordinary discipline. Our system integrates performance science with flexible coaching philosophies to match your drive."
              buttonText="Get Started Free"
              showEmailInput={false} // Remove email input
              buttonLink="/login"   // Corrected link to /login
              // onSubmit, emailPlaceholder, rewardsText, showRewardsOptIn are no longer needed here
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20" // Glassmorphism for Hero CTA
            />
            {/* <h1>CTASection in Hero is commented out</h1> */}
          </div>
        </section>

        <SectionDivider />

        <div ref={coachesRef} className={`transition-all duration-1000 ease-out ${isCoachesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <MeetTheCoachesSection
            title="Find the Coach That Drives You"
            className="py-16 md:py-20 bg-background dark:bg-neutral-900" // This bg might be overridden by HP-03 if not careful
            onPersonaHover={handlePersonaHover} // Keep for potential future use or remove if CSS hero glow is fully deprecated
            onPersonaSelectGlow={handlePersonaSelectGlow} // Pass the new handler for click-based theming
          />
        </div>

        <SectionDivider />

        {/* Section 3: Key Features */}
        <section ref={keyFeaturesRef} id="key-features" className={`py-16 md:py-20 transition-all duration-1000 ease-out ${isKeyFeaturesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-12 lg:mb-16">Key Features of MaxiMost</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {keyFeaturesData.map((feature, index) => ( <FeatureCard key={feature.id} icon={feature.icon} title={feature.title} description={feature.description} animationDelayIndex={index} isVisible={isKeyFeaturesVisible} /> ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 5: Fitness Tracker Integration (Moved Up) */}
        <section ref={fitnessTrackersRef} id="fitness-trackers" className={`py-16 md:py-20 transition-all duration-1000 ease-out ${isFitnessTrackersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitness Tracker Integration
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto"> {/* Adjusted color for better contrast */}
              Connect All Your Health Data
            </p>
            <p className="text-md text-neutral-300 mb-8 max-w-3xl mx-auto"> {/* Adjusted color for better contrast */}
              Integration with your favorite fitness platforms automatically
              completes your habits based on your activity.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
              {fitnessTrackers.map((tracker, index) => {
                const iconColorClasses = [
                  "text-sky-400", "text-emerald-400", "text-amber-400",
                  "text-rose-400", "text-violet-400", "text-teal-400"
                ];
                const iconColorClass = iconColorClasses[index % iconColorClasses.length];
                return (
                  <div key={tracker.name} className="flex items-center p-3 bg-neutral-800/50 dark:bg-neutral-800/60 rounded-lg shadow-md hover:scale-105 hover:bg-neutral-700/70 transition-all cursor-default"> {/* Consistent dark bg, increased padding */}
                    <span className={`${iconColorClass} mr-2`}>{tracker.icon}</span>
                    <span className="ml-1 text-sm font-medium text-neutral-100">{tracker.name}</span> {/* Slightly brighter text */}
                  </div>
                );
              })}
            </div>
            <div className="max-w-2xl mx-auto text-left space-y-2 text-neutral-200 mb-10"> {/* Changed text color */}
              <p>✓ Auto-complete workout habits when your fitness tracker records activity.</p>
              <p>✓ Sleep habits marked complete when your tracker records sufficient sleep.</p>
              <p>✓ Heart rate and recovery metrics for holistic health tracking.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div
                className={`p-6 bg-black/30 border border-white/10 shadow-lg rounded-xl text-neutral-300 hover:bg-black/40 hover:border-white/20 transition-all ease-out duration-700 delay-[0ms] ${isFitnessTrackersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              >
                <h4 className="text-lg font-semibold text-white mb-3">Fitbit Activity (Example)</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><strong className="text-white">Steps:</strong> 9,857</p>
                  <p><strong className="text-white">Miles:</strong> 4.3</p>
                  <p><strong className="text-white">Calories:</strong> 2,478</p>
                  <p><strong className="text-white">Active Min:</strong> 45</p>
                  <p><strong className="text-white">Sleep:</strong> 7:15</p>
                  <p><strong className="text-white">Resting BPM:</strong> 68</p>
                </div>
              </div>
              <div
                className={`p-6 bg-black/30 border border-white/10 shadow-lg rounded-xl text-neutral-300 hover:bg-black/40 hover:border-white/20 transition-all ease-out duration-700 delay-[100ms] ${isFitnessTrackersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              >
                <h4 className="text-lg font-semibold text-white mb-3">Samsung Health (Example)</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p><strong className="text-white">Steps:</strong> 11,235</p>
                  <p><strong className="text-white">Miles:</strong> 5.2</p>
                  <p><strong className="text-white">Calories:</strong> 2,912</p>
                  <p><strong className="text-white">Active Min:</strong> 65</p>
                  <p><strong className="text-white">Sleep:</strong> 8:10</p>
                  <p><strong className="text-white">Resting BPM:</strong> 71</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 4: Six Key Performance Areas (Moved Down) */}
        <section ref={performanceAreasRef} id="performance-areas" className={`py-16 md:py-20 transition-all duration-1000 ease-out ${isPerformanceAreasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-12 lg:mb-16">Holistic Growth Across Six Key Performance Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {performanceAreasData.map((area, index) => ( <FeatureCard key={area.id} icon={area.icon} title={area.title} description={area.description} animationDelayIndex={index} isVisible={isPerformanceAreasVisible} /> ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 6: Social Proof (Testimonials) */}
        <section ref={testimonialsRef} id="testimonials" className={`py-16 md:py-20 transition-all duration-1000 ease-out ${isTestimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-12 lg:mb-16">
              What People Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
              {testimonialsData.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  imageSrc={testimonial.imageSrc}
                  altText={testimonial.altText}
                  name={testimonial.name}
                  title={testimonial.title}
                  quote={testimonial.quote}
                  animationDelayIndex={index}
                  isVisible={isTestimonialsVisible}
                />
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 7: FAQ */}
        <section ref={faqRef} id="faq" className={`py-16 md:py-20 transition-all duration-1000 ease-out ${isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-12 lg:mb-16">
              Frequently Asked Questions
            </h2>
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
          </div>
        </section>

        <SectionDivider />

        {/* Section 8: Final CTA Section */}
        <section ref={finalCtaRef} id="final-cta" className={`py-16 md:py-24 bg-gradient-to-t from-background to-muted/20 dark:from-neutral-900 dark:to-neutral-800/30 transition-all duration-1000 ease-out ${isFinalCtaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <CTASection
            headline="Start Forging Your Elite Habits Today."
            description="Take control of your life, build unbreakable habits, and master your mind with MaxiMost."
            buttonText="Sign Up & Get Started"
            buttonLink="/login" // Corrected link to /login
            showEmailInput={false} // Hide email input
            showRewardsOptIn={false} // Hide rewards text
            // onSubmit prop is not needed when showEmailInput is false and buttonLink is used
            className="container mx-auto max-w-3xl"
          />
        </section>

        <footer className="py-8 border-t border-border">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p className="mb-2">MaxiMost Logo (Placeholder)</p>
                <div className="space-x-4 mb-2">
                    <a href="#" className="hover:text-sky-300 transition-colors duration-300">Privacy Policy</a>
                    <a href="#" className="hover:text-sky-300 transition-colors duration-300">Terms of Service</a>
                    <a href="#" className="hover:text-sky-300 transition-colors duration-300">Contact Us</a>
                </div>
                <p>© {new Date().getFullYear()} Maximost. All rights reserved.</p>
            </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;