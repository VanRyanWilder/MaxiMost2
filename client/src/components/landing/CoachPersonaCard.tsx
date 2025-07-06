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

  const baseBoxShadow = "var(--tw-shadow, 0 0 #0000)";
  const hoverBoxShadow = `0 0 25px 5px ${coach.glowColor || coach.iconColor || "#FFFFFF30"}`;
  // Use a slightly more intense shadow for selected state, or a distinct border
  const selectedBoxShadow = `0 0 30px 8px ${coach.glowColor || coach.iconColor || "#FFFFFF50"}`;

  const cardStyle: React.CSSProperties = {
    transition: "all 0.3s ease-in-out",
    boxShadow: isSelected ? selectedBoxShadow : (isHovered ? hoverBoxShadow : baseBoxShadow),
    transform: (isHovered || isSelected) ? "translateY(-8px) scale(1.03)" : "translateY(0px) scale(1)",
    // Example of a distinct border for selected state:
    // border: isSelected ? `2px solid ${coach.glowColor || 'hsl(var(--primary))'}` : `1px solid ${coach.borderColor ? 'var(--tw-shadow)' : 'hsl(var(--border))'}`
  };

  // Dynamically adjust border based on selection
  const selectedBorderClass = isSelected ? `ring-2 ring-offset-2 ${coach.glowColor ? '' : 'ring-primary'}` : '';
  const borderStyleOverride = isSelected ? { borderColor: coach.glowColor || 'hsl(var(--primary))' } : {};


  // Ensure Tailwind classes for border and bg are applied, but allow hover style to dominate
  const combinedClassName = `flex flex-col h-full overflow-hidden rounded-lg cursor-pointer
    ${isSelected ? '' : (coach.borderColor || "border-border")} // Default border only if not selected with ring
    ${coach.cardBgColor || "bg-card"}
    ${selectedBorderClass}
    ${className}`;

  return (
    <Card
      className={combinedClassName}
      style={{...cardStyle, ...borderStyleOverride}}
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
