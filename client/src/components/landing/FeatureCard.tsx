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
  // Create a set of predefined delay classes to cycle through or use arbitrary values
  // Using a base delay and incrementing: e.g., 0ms, 100ms, 200ms for first 3 items, then repeat or cap
  const delayValue = Math.min(animationDelayIndex * 100, 500); // Cap delay at 500ms for example
  const delayClass = `delay-[${delayValue}ms]`; // Uses Tailwind's arbitrary value support

  return (
    <Card
      className={`flex flex-col items-center text-center p-6 md:items-start md:text-left
                  bg-black/30 border border-white/10 shadow-lg rounded-xl
                  transition-all ease-out duration-700 ${delayClass}
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                  ${className}`} // Animation classes now depend on isVisible
                  // The actual trigger will be when the PARENT section becomes visible.
                  // This card itself doesn't use IntersectionObserver directly, its parent section does.
                  // So, these classes define its start state and how it transitions.
                  // The parent section's visibility will switch a class that makes this visible.
                  // This approach is problematic if the card itself is meant to animate individually based on its own visibility.
                  // For now, assuming the whole section fades in, and cards stagger *within* that.
                  // The parent section in home.tsx controls the "group" animation.
                  // This card needs to be part of that group animation.
                  // Let's assume the parent section already handles the main fade-in.
                  // The delay here is for staggered effect *after* parent is visible.
    >
      {icon && (
        <div className="mb-4 text-white"> {/* Icon color changed to white for better contrast */}
          {React.cloneElement(icon as React.ReactElement<LucideProps>, { size: 40, className: "opacity-90" })}
        </div>
      )}
      <CardTitle className="mb-2 text-xl font-semibold text-white">{title}</CardTitle> {/* Title color to white */}
      <CardContent className="text-neutral-300 p-0"> {/* Description color to a lighter gray */}
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
