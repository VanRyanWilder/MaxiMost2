import React from 'react';
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Eye, Heart, Gift, Zap, TrendingUp, Target, Puzzle, Lightbulb, ShieldAlert, Users, Brain, Timer, CheckSquare, Calendar } from 'lucide-react';

const FourLawsSection: React.FC<{
  lawNumber: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColorClass: string;
  textColorClass: string;
  points: { point: string; detail: string; icon?: React.ReactNode }[];
}> = ({ lawNumber, title, subtitle, icon, bgColorClass, textColorClass, points }) => (
  <Card className={`shadow-lg border-0 ${bgColorClass} ${textColorClass}`}>
    <CardHeader className="pb-4">
      <div className="flex items-center mb-3">
        <span className={`text-5xl font-bold mr-4 ${textColorClass} opacity-70`}>{lawNumber}</span>
        {React.cloneElement(icon as React.ReactElement, { className: `w-10 h-10 ${textColorClass} opacity-90` })}
      </div>
      <CardTitle className={`text-3xl font-bold ${textColorClass}`}>{title}</CardTitle>
      <CardDescription className={`${textColorClass} opacity-80 text-md`}>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        {points.map((p, index) => (
          <li key={index} className="flex items-start">
            <div className={`mr-3 mt-1 flex-shrink-0 ${textColorClass} opacity-80`}>
              {p.icon || <CheckCircle size={20} />}
            </div>
            <div>
              <h4 className={`font-semibold text-lg ${textColorClass}`}>{p.point}</h4>
              <p className={`${textColorClass} opacity-80 text-sm`}>{p.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function AtomicHabitsGuidePage() {
  return (
    <PageContainer>
      <div className="py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-orange-500 mb-3">
            The Four Laws of Behavior Change
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An actionable framework for building good habits and breaking bad ones, inspired by James Clear's "Atomic Habits".
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <FourLawsSection
            lawNumber="1st"
            title="Make It Obvious"
            subtitle="How to Create a Good Habit: The Cue"
            icon={<Eye />}
            bgColorClass="bg-blue-50 dark:bg-blue-900/30"
            textColorClass="text-blue-700 dark:text-blue-300"
            points={[
              { point: "Implementation Intentions", detail: "State your intention: \"I will [BEHAVIOR] at [TIME] in [LOCATION].\"", icon: <Target size={20}/> },
              { point: "Habit Stacking", detail: "Link new habits to existing ones: \"After [CURRENT HABIT], I will [NEW HABIT].\"", icon: <Puzzle size={20}/> },
              { point: "Design Your Environment", detail: "Make cues for good habits visible and cues for bad habits invisible.", icon: <Lightbulb size={20}/> },
            ]}
          />

          <FourLawsSection
            lawNumber="2nd"
            title="Make It Attractive"
            subtitle="How to Create a Good Habit: The Craving"
            icon={<Heart />}
            bgColorClass="bg-pink-50 dark:bg-pink-900/30"
            textColorClass="text-pink-700 dark:text-pink-300"
            points={[
              { point: "Temptation Bundling", detail: "Pair an action you want to do with an action you need to do.", icon: <Gift size={20}/> },
              { point: "Join a Culture", detail: "Surround yourself with people for whom your desired behavior is the norm.", icon: <Users size={20}/> },
              { point: "Reframe Your Mindset", detail: "Highlight the benefits of good habits over the drawbacks.", icon: <Brain size={20}/> },
            ]}
          />

          <FourLawsSection
            lawNumber="3rd"
            title="Make It Easy"
            subtitle="How to Create a Good Habit: The Response"
            icon={<Zap />}
            bgColorClass="bg-yellow-50 dark:bg-yellow-900/30"
            textColorClass="text-yellow-700 dark:text-yellow-300"
            points={[
              { point: "Reduce Friction", detail: "Decrease the number of steps between you and your good habits.", icon: <TrendingUp size={20}/> },
              { point: "The Two-Minute Rule", detail: "Downscale your habits until they can be done in two minutes or less.", icon: <Timer size={20}/> },
              { point: "Automate Your Habits", detail: "Use technology and one-time decisions to lock in future behavior.", icon: <CheckSquare size={20}/> },
            ]}
          />

          <FourLawsSection
            lawNumber="4th"
            title="Make It Satisfying"
            subtitle="How to Create a Good Habit: The Reward"
            icon={<Gift />}
            bgColorClass="bg-green-50 dark:bg-green-900/30"
            textColorClass="text-green-700 dark:text-green-300"
            points={[
              { point: "Immediate Reward", detail: "Give yourself an immediate reward when you complete your habit.", icon: <CheckCircle size={20}/> },
              { point: "Habit Tracking", detail: "Visually measure your progress and don't break the chain.", icon: <Calendar size={20}/> },
              { point: "Accountability Partner", detail: "Have someone who expects you to perform the habit.", icon: <ShieldAlert size={20}/> },
            ]}
          />
        </div>

        <section className="mt-16 text-center">
          <Card className="inline-block shadow-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-700 p-8 rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Ready to Build Better Habits?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Apply these laws today using MaxiMost. Start small, be consistent, and watch the compound effect transform your life.
              </p>
              <a href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                Go to My Dashboard
              </a>
            </CardContent>
          </Card>
        </section>

      </div>
    </PageContainer>
  );
}
