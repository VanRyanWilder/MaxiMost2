import React from 'react';
import { PageContainer } from "@/components/layout/page-container";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { TopRatedSupplements } from "@/components/dashboard/top-rated-supplements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExplorePage() {
  return (
    <PageContainer>
      <div className="space-y-6 py-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Explore</h1>
          <p className="text-muted-foreground">
            Discover new insights, motivation, and resources.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyMotivation />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Rated Supplements</CardTitle>
          </CardHeader>
          <CardContent>
            <TopRatedSupplements />
          </CardContent>
        </Card>

        {/* Add more sections to Explore page as needed */}
      </div>
    </PageContainer>
  );
}
