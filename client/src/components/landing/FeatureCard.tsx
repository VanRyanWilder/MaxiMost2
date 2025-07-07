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
  animationDelayIndex?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  animationDelayIndex = 0,
  isVisible = false, // Added isVisible prop
}) => {
  const delayValue = Math.min(animationDelayIndex * 100, 500);
  const delayClass = `delay-[${delayValue}ms]`;

  // Removed iconColorClasses and iconColorClass logic from here. Color is now set on the icon prop in home.tsx

  return (
    <Card
      className={`flex flex-col items-center text-center p-6 md:items-start md:text-left
                  bg-black/30 border border-white/10 shadow-lg rounded-xl
                  transition-all ease-out duration-700 ${delayClass}
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                  hover:scale-105 hover:-rotate-1
                  ${className}`}
    >
      {icon && (
        <div className="mb-4"> {/* Removed iconColorClass from wrapper, color comes from icon prop's className */}
          {React.cloneElement(icon as React.ReactElement<LucideProps>, { size: 40, className: `${(icon as React.ReactElement<LucideProps>).props.className || ''} opacity-90` })}
        </div>
      )}
      <CardTitle className="mb-2 text-xl font-semibold text-white">{title}</CardTitle>
      <CardContent className="text-neutral-300 p-0">
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
