import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string;
  trend?: string;
  description?: string;
  className?: string;
}

export function ProgressCard({ 
  title, 
  value, 
  trend, 
  description,
  className 
}: ProgressCardProps) {
  // Determine if trend is positive or negative
  const isTrendPositive = trend?.startsWith("+");
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h2 className="text-2xl sm:text-3xl font-bold">{value}</h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {trend && (
            <div className={`flex items-center ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isTrendPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
