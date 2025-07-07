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
    transition: "all 0.3s ease-out", // Slightly faster transition for responsiveness
    boxShadow: isSelected ? selectedGlowEffect : (isHovered ? hoverGlossEffect : baseBoxShadow),
    transform: isSelected
      ? "translateY(-12px) scale(1.06)" // More pronounced for selected
      : (isHovered
          ? "translateY(-8px) scale(1.03) perspective(1200px) rotateX(6deg) rotateY(4deg)" // Enhanced 3D tilt effect
          : "translateY(0px) scale(1) perspective(1200px) rotateX(0deg) rotateY(0deg)"),
    // border: isSelected ? `2px solid ${coach.glowColor || 'hsl(var(--primary))'}` : `1px solid hsl(var(--border))`
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
        className="py-2 px-3 text-center border-b border-white/20 transition-all duration-300"
        style={{
          backgroundColor: isSelected || isHovered
            ? (coach.glowColor ? `${coach.glowColor}A0` : 'rgba(0,0,0,0.6)') // Slightly more opaque title bg on hover
            : 'rgba(0,0,0,0.3)', // Slightly more opaque title bg default
        }}
      >
        <CardTitle
            className="text-2xl font-extrabold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]" // Title: text-2xl
        >
          {coach.title}
        </CardTitle>
      </div>

      {/* Image Container (Square Aspect Ratio) and Text Overlay */}
      <div className="relative flex-grow overflow-hidden aspect-square"> {/* Changed to square aspect ratio */}
        {/* Background Image */}
        {coach.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={coach.imageUrl}
              alt={`${coach.title} background`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay from bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div> {/* Adjusted gradient for new text sizes */}
          </div>
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${coach.cardBgColor || "bg-neutral-700/50"}`}>
              <DynamicLucideIcon name={coach.iconName} size={40} color={coach.iconColor || "rgba(255,255,255,0.6)"} /> {/* Smaller fallback icon */}
          </div>
        )}

        {/* Content Overlay for description and quote, pushed to bottom */}
        <div className="relative z-10 flex flex-col h-full p-3 justify-end">
          <div className="mt-auto">
            <CardContent className="p-0 mb-2"> {/* Increased margin for larger text */}
              <p className="text-sm opacity-85 [text-shadow:0_1px_1px_rgba(0,0,0,0.7)] leading-relaxed">{coach.description}</p> {/* Further increased to text-sm, relaxed leading, slightly more opacity */}
            </CardContent>
            <CardFooter className="p-0 text-left border-t border-white/20 pt-2"> {/* Increased padding top */}
              <blockquote className="text-xs opacity-75 [text-shadow:0_1px_1px_rgba(0,0,0,0.7)] leading-relaxed"> {/* Further increased to text-xs, relaxed leading, slightly more opacity */}
                "{coach.sampleQuote}"
              </blockquote>
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
};
