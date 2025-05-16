import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function ProgressCard({ 
  title, 
  value, 
  trend, 
  description,
  className,
  icon
}: ProgressCardProps) {
  // Determine if trend is positive or negative
  const isTrendPositive = trend?.startsWith("+");
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
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
