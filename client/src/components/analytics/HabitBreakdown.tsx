import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart } from 'lucide-react'; // Or BarChart icon if preferred

const HabitBreakdown: React.FC = () => {
  // Placeholder data for categories and their completion counts/percentages
  const mockBreakdownData = [
    { name: 'Physical', value: 40, color: 'bg-blue-500' },
    { name: 'Mental', value: 30, color: 'bg-green-500' },
    { name: 'Nutrition', value: 20, color: 'bg-yellow-500' },
    { name: 'Sleep', value: 10, color: 'bg-purple-500' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
          Habit Focus by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This chart will show a breakdown of your completed habits by category. (Placeholder data)
        </p>
        <div className="h-60 bg-muted rounded flex items-center justify-center p-4">
          {/* Placeholder for Recharts PieChart or BarChart */}
          <div className="w-full max-w-xs text-center">
            <p className="text-sm text-muted-foreground mb-3">Donut/Bar Chart Placeholder</p>
            {/* Simple visual placeholder for a donut chart */}
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" strokeWidth="3" className="text-gray-200 dark:text-gray-700"></circle>
                {mockBreakdownData.reduce((acc, entry, index, arr) => {
                  const totalValue = arr.reduce((sum, item) => sum + item.value, 0);
                  const percentage = (entry.value / totalValue) * 100;
                  const offset = acc;
                  const dashArray = `${percentage} ${100 - percentage}`;

                  // Tailwind doesn't support dynamic stroke colors easily in JSX like this.
                  // For a real chart, the charting library handles colors.
                  // Here, we'll use a generic color for the segments.
                  return (
                    <circle
                      key={entry.name}
                      cx="18"
                      cy="18"
                      r="15.91549430918954"
                      fill="transparent"
                      strokeWidth="3.5"
                      strokeDasharray={dashArray}
                      strokeDashoffset={-offset} // Apply previous segments' percentages as offset
                      className={`text-${entry.color.replace('bg-', '')}-500`} // Attempt to use color, might not work perfectly
                    ></circle>
                  );
                }, 0)}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Categories</span>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              {mockBreakdownData.map(entry => (
                <div key={entry.name} className="flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${entry.color}`}></span>
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitBreakdown;
