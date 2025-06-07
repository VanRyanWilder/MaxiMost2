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
    <Card className={`flex flex-col items-center text-center p-6 shadow-lg rounded-lg ${className}`}>
      <Avatar className="w-20 h-20 mb-4">
        <AvatarImage src={imageSrc} alt={altText} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{title}</p>
      <CardContent className="text-base text-foreground p-0">
        <p className="italic">"{quote}"</p>
      </CardContent>
    </Card>
  );
};
