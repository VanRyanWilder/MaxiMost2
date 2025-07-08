import React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import StreakCalendar from '@/components/analytics/StreakCalendar';
import CompletionChart from '@/components/analytics/CompletionChart';
import HabitBreakdown from '@/components/analytics/HabitBreakdown';

const ProgressPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Your Progress Analytics</h1>

        <p className="text-muted-foreground mb-8">
          This is your central hub for tracking and visualizing your habit progress over time.
          More widgets and detailed analytics are coming soon!
        </p>

        {/* Grid-based layout for analytics widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streak Calendar - Takes full width on smaller screens, half on lg+ */}
          <div className="lg:col-span-2">
            <StreakCalendar />
          </div>

          {/* Completion Chart */}
          <div>
            <CompletionChart />
          </div>

          {/* Habit Breakdown */}
          <div>
            <HabitBreakdown />
          </div>

          {/* Add more placeholders or widgets as needed */}
          {/* Example of a full-width widget at the bottom */}
          {/* <div className="lg:col-span-2 mt-6">
            <Card>
              <CardHeader><CardTitle>Future Full-Width Widget</CardTitle></CardHeader>
              <CardContent><p>Content for another widget...</p></CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProgressPage;
