import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const CompletionChart: React.FC = () => {
  // Placeholder data for the chart
  // In a real implementation, this would be actual data points for the last 30 days
  const mockDataPoints = Array(30).fill(0).map((_, i) => ({
    day: `Day ${i + 1}`,
    completion: Math.floor(Math.random() * 60) + 40, // Random completion % between 40 and 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Overall Completion Trend (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This chart will show your overall habit completion percentage over the past 30 days. (Placeholder data)
        </p>
        <div className="h-60 bg-muted rounded flex items-center justify-center p-4">
          {/* Placeholder for Recharts LineChart */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Line Chart Placeholder</p>
            <svg viewBox="0 0 100 50" className="w-full h-auto max-w-xs mx-auto" aria-hidden="true">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points="
                  0,45
                  10,30
                  20,35
                  30,20
                  40,25
                  50,10
                  60,15
                  70,5
                  80,10
                  90,20
                  100,25
                "
                className="text-primary"
              />
              {/* X and Y Axis lines for context */}
              <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            </svg>
             <p className="text-xs text-muted-foreground mt-2">Mock data trend shown above.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionChart;
