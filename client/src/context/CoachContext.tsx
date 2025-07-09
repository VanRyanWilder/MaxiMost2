import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CoachPersonaId = 'stoic' | 'operator' | 'nurturer' | string; // string for future extensibility

interface CoachContextType {
  selectedCoachId: CoachPersonaId;
  setSelectedCoachId: (id: CoachPersonaId) => void;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCoachId, setSelectedCoachId] = useState<CoachPersonaId>('stoic'); // Default to 'stoic'

  return (
    <CoachContext.Provider value={{ selectedCoachId, setSelectedCoachId }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};
