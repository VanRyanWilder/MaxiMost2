import React from 'react';
import { PageContainer } from '@/components/layout/page-container';

const ProgressPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Your Progress Analytics</h1>

        <p className="text-muted-foreground mb-8">
          This is your central hub for tracking and visualizing your habit progress over time.
          More widgets and detailed analytics are coming soon!
        </p>

        {/* Placeholder for grid-based layout for analytics widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Widget Placeholder 1 */}
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Streak Calendar (Coming Soon)</h2>
            <p className="text-sm text-muted-foreground">A GitHub-style contribution graph showing your daily completion streaks.</p>
            <div className="mt-4 h-48 bg-muted rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder</p>
            </div>
          </div>

          {/* Example Widget Placeholder 2 */}
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Completion Chart (Coming Soon)</h2>
            <p className="text-sm text-muted-foreground">A line chart showing overall habit completion percentage over the last 30 days.</p>
            <div className="mt-4 h-48 bg-muted rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder</p>
            </div>
          </div>

          {/* Example Widget Placeholder 3 */}
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Habit Breakdown (Coming Soon)</h2>
            <p className="text-sm text-muted-foreground">A donut or bar chart showing completed habits by category.</p>
            <div className="mt-4 h-48 bg-muted rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart Placeholder</p>
            </div>
          </div>

          {/* Add more placeholders as needed */}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProgressPage;
