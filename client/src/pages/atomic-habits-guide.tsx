import React from 'react';
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Uncommented Card imports
// import { CheckCircle, Eye, Heart, Gift, Zap, TrendingUp, Target, Puzzle, Lightbulb, ShieldAlert } from 'lucide-react'; // Lucide icons for FourLawsSection still commented

// Commenting out FourLawsSection for now
/*
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
*/

const AtomicHabitsGuidePage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-orange-500 mb-3">
            Atomic Habits Guide Test
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            If you see this, the basic page structure and PageContainer are working.
          </p>
        </header>

        {/* Sections previously here are commented out for debugging */}

        <section className="mt-16 text-center">
          <Card className="inline-block shadow-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-700 p-8 rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Test CTA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Test content for CTA.
              </p>
              <a href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
                Test Link
              </a>
            </CardContent>
          </Card>
        </section>

      </div>
    </PageContainer>
  );
};

export default AtomicHabitsGuidePage;
