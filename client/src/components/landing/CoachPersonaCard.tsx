import React from "react";
import * as LucideIcons from "lucide-react"; // Import all lucide-react icons
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CoachPersona } from "@/data/coachPersonaData"; // Import the data structure type

interface CoachPersonaCardProps {
  coach: CoachPersona;
  isSelected: boolean; // New prop
  onSelect: () => void; // New prop
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

// Helper to get Lucide icon component by name string
const DynamicLucideIcon = ({ name, color, size = 48 }: { name: string; color?: string; size?: number }) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    // Fallback icon if name is invalid
    return <LucideIcons.HelpCircle color={color} size={size} />;
  }

  return <IconComponent color={color} size={size} />;
};

import { useState } from "react"; // Import useState for hover state

export const CoachPersonaCard: React.FC<CoachPersonaCardProps> = ({
  coach,
  isSelected,
  onSelect,
  className,
  onHoverStart,
  onHoverEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) {
      onHoverStart();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) {
      onHoverEnd();
    }
  };

  const baseBoxShadow = "var(--tw-shadow, 0 0 #0000)"; // Default, no shadow
  const hoverGlossEffect = `inset 0 2px 4px rgba(255,255,255,0.1), 0 0 15px 3px ${coach.iconColor || "#FFFFFF20"}`; // Subtle gloss and softer glow
  const selectedGlowEffect = `0 0 35px 10px ${coach.glowColor || coach.iconColor || "#FFFFFF70"}`; // More prominent glow for selected

  const cardStyle: React.CSSProperties = {
    transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)", // Smoother transition
    boxShadow: isSelected ? selectedGlowEffect : (isHovered ? hoverGlossEffect : baseBoxShadow),
    transform: isSelected
      ? "translateY(-10px) scale(1.05)" // Slightly more pronounced for selected
      : (isHovered
          ? "translateY(-6px) scale(1.02) perspective(1000px) rotateX(2deg) rotateY(1deg)" // 3D effect for hover
          : "translateY(0px) scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)"), // Reset perspective/rotation
    // border: isSelected ? `2px solid ${coach.glowColor || 'hsl(var(--primary))'}` : `1px solid hsl(var(--border))` // Using ring for selected border
  };

  // Determine ring color based on coach.glowColor or fallback to primary
  const ringColorClass = coach.glowColor ? `ring-[${coach.glowColor}]` : 'ring-primary';
  const selectedStateClasses = isSelected ? `ring-2 ring-offset-2 ${ringColorClass} ring-offset-background` : '';

  // Ensure Tailwind classes for border and bg are applied
  const combinedClassName = `flex flex-col h-full overflow-hidden rounded-xl cursor-pointer group
    border border-border
    ${coach.cardBgColor || "bg-card"}
    ${selectedStateClasses}
    ${className}`;
    // Added rounded-xl for a more "collectible" feel, group for potential future inner element styling on hover

  return (
    <Card
      className={combinedClassName}
      style={cardStyle} // borderStyleOverride removed as ring handles selected state border better
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect} // Call onSelect when card is clicked
    >
      {/* coach.imageUrl rendering removed to use only Lucide icons */}
      <CardHeader className="items-center text-center p-6 pt-8"> {/* Added pt-8 for more space at the top after image removal */}
        <div className={`mb-4 p-3 rounded-full inline-block ${coach.iconColor ? "" : "text-primary"}`}>
          <div className={coach.iconColor || "text-primary"}>
            <DynamicLucideIcon name={coach.iconName} size={40} />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">{coach.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4 text-center">
        <p className="text-muted-foreground text-sm mb-4">{coach.description}</p>
      </CardContent>
      <CardFooter className="p-6 bg-muted/50 dark:bg-card/50 text-center border-t">
        <blockquote className="italic text-sm text-foreground/80">
          "{coach.sampleQuote}"
        </blockquote>
      </CardFooter>
    </Card>
  );
};
