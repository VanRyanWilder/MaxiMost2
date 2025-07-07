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
  isVisible?: boolean; // Made isVisible optional as it's passed from home.tsx
  cardStyleType?: 'premium' | 'simple'; // New prop for style variation
  slideFromDirection?: 'left' | 'right' | 'bottom'; // New prop for animation direction
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  animationDelayIndex = 0,
  isVisible = false,
  cardStyleType = 'premium', // Default to premium style
  slideFromDirection = 'bottom', // Default to slide from bottom
}) => {
  const delayValue = Math.min(animationDelayIndex * 150, 750); // Changed multiplier to 150, max delay 750ms
  const delayClass = `delay-[${delayValue}ms]`;

  let initialTransformClass = 'opacity-0 translate-y-16'; // Default: slide from bottom
  if (slideFromDirection === 'left') {
    initialTransformClass = 'opacity-0 -translate-x-16';
  } else if (slideFromDirection === 'right') {
    initialTransformClass = 'opacity-0 translate-x-16';
  }

  const finalTransformClass = 'opacity-100 translate-x-0 translate-y-0';

  const baseClasses = `flex flex-col items-center text-center transition-all ease-out duration-700 ${delayClass} ${isVisible ? finalTransformClass : initialTransformClass}`;

  // Unified card styling for background, border, shadow.
  const cardLookClasses = `bg-black/30 border border-white/10 shadow-lg rounded-xl hover:scale-105`;

  // Premium style specific padding, text alignment, and hover rotation.
  const premiumStyleSpecifics = `p-6 md:items-start md:text-left hover:-rotate-1`;
  // Simple style specific padding and text alignment. No description.
  const simpleStyleSpecifics = `p-4 items-center text-center`; // Increased padding for simple style to look better with a border

  const currentStyleSpecifics = cardStyleType === 'simple' ? simpleStyleSpecifics : premiumStyleSpecifics;

  return (
    <div
      className={`${baseClasses} ${cardLookClasses} ${currentStyleSpecifics} ${className}`}
    >
      {icon && (
        <div className={cardStyleType === 'simple' ? "mb-3" : "mb-4"}> {/* Adjusted mb for simple */}
          {React.cloneElement(icon as React.ReactElement<LucideProps>, {
            size: cardStyleType === 'simple' ? 36 : 40, // Slightly adjusted simple icon size
            // For simple style, use the icon's own class for color. For premium, add opacity.
            className: `${(icon as React.ReactElement<LucideProps>).props.className || ''} ${cardStyleType === 'premium' ? 'opacity-90' : ''}`.trim()
          })}
        </div>
      )}
      <CardTitle className={`text-white ${cardStyleType === 'simple' ? 'text-xl font-semibold' : 'mb-2 text-xl font-semibold'}`}> {/* Simple title matches premium */}
        {title}
      </CardTitle>
      {cardStyleType === 'premium' && ( // Description only for premium
        <CardContent className="text-neutral-300 p-0">
          <p>{description}</p>
        </CardContent>
      )}
    </div>
  );
};

// Example of how to get a Lucide icon component dynamically (if needed, but ReactNode prop is simpler)
// const getIcon = (name: string, color: string = "currentColor", size: number = 24): React.ReactNode => {
//   const IconComponent = require("lucide-react")[name] || CheckSquare; // Fallback icon
//   return <IconComponent color={color} size={size} />;
// };
