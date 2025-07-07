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
  // Updated hoverGlossEffect to use coach.glowColor for a themed "light up" effect on hover
  const hoverGlossEffect = `0 0 25px 5px ${coach.glowColor || coach.iconColor || "#FFFFFF40"}`; // Use glowColor, slightly less intense than selected
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
      className={`${combinedClassName} relative group text-white`} // Main card: relative for children, group for hover states
      style={cardStyle} // This applies the main card's glow and transform
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      {/* Title Box - Above Image */}
      <div
        className="py-3 px-4 text-center border-b border-white/20 transition-all duration-300" // Reduced vertical padding
        style={{
          backgroundColor: isSelected || isHovered
            ? (coach.glowColor ? `${coach.glowColor}90` : 'rgba(0,0,0,0.5)')
            : 'rgba(0,0,0,0.2)',
        }}
      >
        <CardTitle
            className="text-2xl font-extrabold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]" // Reduced size, kept weight & shadow
        >
          {coach.title}
        </CardTitle>
      </div>

      {/* Image Container (Adjusted Portrait Aspect Ratio) and Text Overlay */}
      <div className="relative flex-grow overflow-hidden aspect-[4/5]"> {/* Adjusted aspect ratio to make it less tall */}
        {/* Background Image */}
        {coach.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={coach.imageUrl}
              alt={`${coach.title} background`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay from bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
          </div>
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${coach.cardBgColor || "bg-neutral-700/50"}`}>
              <DynamicLucideIcon name={coach.iconName} size={56} color={coach.iconColor || "rgba(255,255,255,0.7)"} />
          </div>
        )}

        {/* Content Overlay for description and quote, pushed to bottom */}
        <div className="relative z-10 flex flex-col h-full p-3 justify-end"> {/* Reduced padding */}
          <div className="mt-auto">
            <CardContent className="p-0 mb-1.5"> {/* Reduced margin-bottom */}
              <p className="text-xs opacity-90 [text-shadow:0_1px_1px_rgba(0,0,0,0.7)] leading-snug">{coach.description}</p> {/* Smaller desc, tighter leading */}
            </CardContent>
            <CardFooter className="p-0 text-left border-t border-white/20 pt-1.5 pb-1"> {/* Reduced padding */}
              <blockquote className="text-[11px] opacity-80 leading-snug [text-shadow:0_1px_1px_rgba(0,0,0,0.7)]"> {/* Slightly smaller quote, tighter leading */}
                "{coach.sampleQuote}"
              </blockquote>
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
};
