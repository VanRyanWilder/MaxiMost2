import React from "react";
import { coachPersonaData, CoachPersona } from "@/data/coachPersonaData"; // Import the data and type
import { CoachPersonaCard } from "./CoachPersonaCard"; // Import the card component

interface MeetTheCoachesSectionProps {
  title: string;
  className?: string;
  onPersonaHover?: (glowColor: string | undefined) => void;
  onPersonaLeave?: () => void;
}

export const MeetTheCoachesSection: React.FC<MeetTheCoachesSectionProps> = ({
  title,
  className,
  onPersonaHover,
  onPersonaLeave,
}) => {
  return (
    <section className={`py-12 md:py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10 md:mb-12 lg:mb-16">
          {title}
        </h2>
        {coachPersonaData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coachPersonaData.map((coach) => (
              <CoachPersonaCard
                key={coach.id}
                coach={coach}
                onHoverStart={() => onPersonaHover && onPersonaHover(coach.glowColor)}
                onHoverEnd={() => onPersonaLeave && onPersonaLeave()}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Coach information coming soon.
          </p>
        )}
      </div>
    </section>
  );
};
