import React, { useState } from "react"; // Added useState
import { coachPersonaData, CoachPersona } from "@/data/coachPersonaData";
import { CoachPersonaCard } from "./CoachPersonaCard";

interface MeetTheCoachesSectionProps {
  title: string;
  className?: string;
  onPersonaHover?: (glowColorRgb: string | undefined) => void;
  onPersonaLeave?: () => void;
}

export const MeetTheCoachesSection: React.FC<MeetTheCoachesSectionProps> = ({
  title,
  className,
  onPersonaHover,
  onPersonaLeave,
}) => {
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const handleCoachSelect = (coachId: string) => {
    setSelectedCoachId(prevId => prevId === coachId ? null : coachId); // Toggle selection
  };

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
                isSelected={selectedCoachId === coach.id}
                onSelect={() => handleCoachSelect(coach.id)}
                onHoverStart={() => onPersonaHover && onPersonaHover(coach.glowColorRgb)}
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
