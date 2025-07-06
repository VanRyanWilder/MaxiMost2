import React from 'react';
import { PageContainer } from "@/components/layout/page-container";
// Assuming these components exist based on comments in sortable-dashboard-new.tsx
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
// Assuming TopRatedSupplements is actually TopSupplementsSection based on file listing
import { TopSupplementsSection } from "@/components/dashboard/top-supplements-section";


const ExplorePage: React.FC = () => {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground">Discover new insights, tools, and resources to enhance your journey.</p>
        </div>

        <DailyMotivation />
        <TopSupplementsSection />

        {/* Other potential sections for Explore page could be:
          - Community Highlights
          - Featured Articles or Research
          - New Program Announcements
          - Challenges or Events
        */}
      </div>
    </PageContainer>
  );
};

export default ExplorePage;
