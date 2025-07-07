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
      className={`${combinedClassName} relative overflow-hidden group`} // Added relative and group for overlay styling
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      {/* Background Image */}
      {coach.imageUrl ? (
        <div className="absolute inset-0 z-0">
          <img
            src={coach.imageUrl}
            alt={`${coach.title} background`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" // Image zoom on card hover
          />
          {/* Gradient overlay from bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
      ) : (
        // Fallback for icon if no image, though cards should ideally always have images now
        <div className={`absolute inset-0 flex items-center justify-center ${coach.cardBgColor || "bg-card"}`}>
            <DynamicLucideIcon name={coach.iconName} size={64} color={coach.iconColor || "hsl(var(--primary))"} />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full p-6 text-white"> {/* Ensure text is white or very light for dark overlay */}
        {/* Top section for icon if no image, or can be used for small badge/logo later */}
        {!coach.imageUrl && (
            <div className="flex-shrink-0 mb-auto text-center opacity-50"> {/* Pushes content to bottom if icon is shown as main element*/}
                 {/* Icon was here, but design implies image is primary. Fallback above handles no-image. */}
            </div>
        )}

        {/* Spacer to push content to the bottom if there's an image */}
        {coach.imageUrl && <div className="flex-grow min-h-[40%]"></div>}


        <div className="mt-auto"> {/* This div will be pushed to the bottom */}
          <CardTitle className="text-3xl font-extrabold mb-2 tracking-tight leading-tight"> {/* Bolder, larger title */}
            {coach.title}
          </CardTitle>
          <CardContent className="p-0 mb-3">
            <p className="text-sm opacity-90">{coach.description}</p> {/* Removed line-clamp-3 */}
          </CardContent>
          <CardFooter className="p-0 text-left border-t border-white/20 pt-3">
            <blockquote className="italic text-xs opacity-80">
              "{coach.sampleQuote}"
            </blockquote>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
