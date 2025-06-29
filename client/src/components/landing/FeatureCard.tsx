import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assuming Card is from shadcn/ui
import { LucideProps, CheckSquare } from "lucide-react"; // Default icon

// Dynamically load Lucide icons
// This is a common pattern. Ensure your project supports dynamic imports or
// pre-import all necessary icons if this causes issues.
// For simplicity, we might just take a ReactNode as icon prop directly.
// Let's define an interface for icon props for clarity if we go with names.
interface FeatureCardProps {
  icon?: React.ReactNode; // Allow passing a fully formed icon component
  title: string;
  description: string;
  className?: string; // Allow additional styling
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <Card className={`flex flex-col items-center text-center p-6 md:items-start md:text-left transition-all duration-300 ease-in-out hover:shadow-xl hover:transform hover:-translate-y-1 ${className}`}>
      {icon && (
        <div className="mb-4 text-primary"> {/* Default color, can be overridden by icon prop itself */}
          {React.cloneElement(icon as React.ReactElement<LucideProps>, { size: 40 })}
        </div>
      )}
      <CardTitle className="mb-2 text-xl font-semibold">{title}</CardTitle>
      <CardContent className="text-muted-foreground p-0"> {/* Remove CardContent default padding */}
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

// Example of how to get a Lucide icon component dynamically (if needed, but ReactNode prop is simpler)
// const getIcon = (name: string, color: string = "currentColor", size: number = 24): React.ReactNode => {
//   const IconComponent = require("lucide-react")[name] || CheckSquare; // Fallback icon
//   return <IconComponent color={color} size={size} />;
// };
