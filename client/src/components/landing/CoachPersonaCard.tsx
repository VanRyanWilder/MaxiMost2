import React from "react";
import * as LucideIcons from "lucide-react"; // Import all lucide-react icons
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CoachPersona } from "@/data/coachPersonaData"; // Import the data structure type

interface CoachPersonaCardProps {
  coach: CoachPersona;
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

  const cardStyle: React.CSSProperties = {
    transition: "all 0.3s ease-in-out",
    boxShadow: isHovered ? `0 0 25px 5px ${coach.glowColor || coach.iconColor || "#FFFFFF30"}` : "var(--tw-shadow, 0 0 #0000)",
    transform: isHovered ? "translateY(-8px) scale(1.03)" : "translateY(0px) scale(1)",
  };

  // Ensure Tailwind classes for border and bg are applied, but allow hover style to dominate
  const combinedClassName = `flex flex-col h-full overflow-hidden rounded-lg cursor-pointer
    ${coach.borderColor || "border-border"}
    ${coach.cardBgColor || "bg-card"}
    ${className}`;

  return (
    <Card
      className={combinedClassName}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {coach.imageUrl && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={coach.imageUrl}
            alt={coach.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="items-center text-center p-6">
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
