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
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  imageSrc,
  altText = "Testimonial author", // Default alt text
  name,
  title,
  quote,
  className,
}) => {
  // Extract initials for AvatarFallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      className={`flex flex-col p-6 bg-black/30 border border-white/10 shadow-lg rounded-xl text-white ${className}`}
    >
      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 mr-4"> {/* Slightly smaller avatar for a more compact header */}
          <AvatarImage src={imageSrc} alt={altText} />
          <AvatarFallback className="text-black">{initials}</AvatarFallback> {/* Fallback text color for visibility if image fails */}
        </Avatar>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-xs text-neutral-300">{title}</p>
        </div>
      </div>
      <CardContent className="text-sm text-neutral-200 p-0"> {/* Adjusted quote text color and size */}
        <p className="italic leading-relaxed">"{quote}"</p>
      </CardContent>
    </Card>
  );
};
