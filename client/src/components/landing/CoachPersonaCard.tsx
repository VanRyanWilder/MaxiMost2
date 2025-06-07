import React from "react";
import * as LucideIcons from "lucide-react"; // Import all lucide-react icons
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CoachPersona } from "@/data/coachPersonaData"; // Import the data structure type

interface CoachPersonaCardProps {
  coach: CoachPersona;
  className?: string;
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

export const CoachPersonaCard: React.FC<CoachPersonaCardProps> = ({
  coach,
  className,
}) => {
  return (
    <Card
      className={`flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl ${coach.borderColor || "border-border"} ${coach.cardBgColor || "bg-card"} ${className}`}
    >
      <CardHeader className="items-center text-center p-6">
        <div className={`mb-4 p-3 rounded-full inline-block ${coach.iconColor ? "" : "text-primary"}`}>
          {/* The iconColor from data is a Tailwind class like "text-blue-600".
              DynamicLucideIcon color prop expects a direct color string or uses currentColor.
              If iconColor is a Tailwind class, we apply it to a parent or handle it differently.
              For simplicity, let DynamicLucideIcon use its default/currentColor and style parent.
          */}
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
