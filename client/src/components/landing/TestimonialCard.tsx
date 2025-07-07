import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // Using Card for consistency
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For the image

interface TestimonialCardProps {
  imageSrc: string;
  altText?: string; // Alt text for the image
  name: string;
  title: string; // e.g., "Founder, Acquisition.com"
  quote: string;
  className?: string;
  animationDelayIndex?: number;
  isVisible?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  imageSrc,
  altText = "Testimonial author", // Default alt text
  name,
  title,
  quote,
  className,
  animationDelayIndex = 0,
  isVisible = false,
}) => {
  // Extract initials for AvatarFallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const delayValue = Math.min(animationDelayIndex * 100, 500); // e.g., 0, 100, 200, 300, 400, 500
  const delayClass = `delay-[${delayValue}ms]`;

  return (
    <Card
      className={`flex flex-col p-6 bg-black/30 border border-white/10 shadow-lg rounded-xl text-white
                  transition-all ease-out duration-700 ${delayClass}
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
                  ${className}`}
    >
      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={imageSrc} alt={altText} />
          <AvatarFallback className="text-black">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-xs text-neutral-300">{title}</p>
        </div>
      </div>
      <CardContent className="text-sm text-neutral-200 p-0">
        <p className="italic leading-relaxed">"{quote}"</p>
      </CardContent>
    </Card>
  );
};
