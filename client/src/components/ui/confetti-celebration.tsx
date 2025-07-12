import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
// Using TypeScript declaration file in types/canvas-confetti.d.ts

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
  type?: 'default' | 'perfectWeek' | 'perfectDay' | 'habitCompleted'; // Added 'habitCompleted' type
}

export const ConfettiCelebration = ({ 
  trigger, 
  onComplete,
  type = 'default' 
}: ConfettiCelebrationProps) => {
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (trigger && !hasPlayedRef.current && confettiRef.current) {
      // Position the canvas in the center of the viewport
      if (confettiRef.current) {
        confettiRef.current.style.position = 'fixed';
        confettiRef.current.style.top = '50%';
        confettiRef.current.style.left = '50%';
        confettiRef.current.style.transform = 'translate(-50%, -50%)';
        confettiRef.current.style.zIndex = '1000';
      }
      
      const myConfetti = confetti.create(confettiRef.current as HTMLCanvasElement, {
        resize: true,
        useWorker: true
      });

      hasPlayedRef.current = true;

      // Different celebration effects based on achievement type
      if (type === 'perfectWeek') {
        // Gold confetti for perfect week
        shootPerfectWeekConfetti(myConfetti).then(() => {
          hasPlayedRef.current = false;
          if (onComplete) onComplete();
        });
      } else if (type === 'perfectDay') {
        // Blue confetti for perfect day
        shootPerfectDayConfetti(myConfetti).then(() => {
          hasPlayedRef.current = false;
          if (onComplete) onComplete();
        });
      } else if (type === 'habitCompleted') { // Handle new type
        shootHabitCompletedConfetti(myConfetti).then(() => {
          hasPlayedRef.current = false;
          if (onComplete) onComplete();
        });
      } else {
        // Default celebration
        shootDefaultConfetti(myConfetti).then(() => {
          hasPlayedRef.current = false;
          if (onComplete) onComplete();
        });
      }
    }
  }, [trigger, onComplete, type]);

  return (
    <canvas
      ref={confettiRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ display: trigger ? 'block' : 'none' }}
    />
  );
};

// Function for default confetti
async function shootDefaultConfetti(myConfetti: any) {
  return new Promise<void>(resolve => {
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(resolve, 1000);
  });
}

// Function for single habit completion confetti
async function shootHabitCompletedConfetti(myConfetti: any) {
  return new Promise<void>(resolve => {
    // A smaller, quicker burst for single habit completion
    myConfetti({
      particleCount: 50, // Fewer particles
      spread: 60,
      origin: { y: 0.7 }, // Slightly lower origin
      colors: ['#3b82f6', '#60a5fa', '#fbbf24', '#f59e0b'], // Mix of blue and gold, or theme colors
      ticks: 150, // Shorter duration
      gravity: 0.9,
      scalar: 0.8, // Smaller particles
    });

    setTimeout(resolve, 800); // Shorter overall animation time before onComplete
  });
}

// Impressive celebration for completing all habits for the day
async function shootPerfectDayConfetti(myConfetti: any) {
  return new Promise<void>(resolve => {
    // Blue theme
    const colors = ['#3b82f6', '#93c5fd', '#60a5fa', '#2563eb'];
    
    // First burst
    myConfetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: colors,
      ticks: 200
    });

    // Second burst after a delay
    setTimeout(() => {
      myConfetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });

      myConfetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 250);

    setTimeout(resolve, 2500);
  });
}

// Epic celebration for achieving a perfect week
async function shootPerfectWeekConfetti(myConfetti: any) {
  return new Promise<void>(resolve => {
    let count = 0;
    const goldColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'];
    
    // Initial big burst in the center
    myConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: goldColors,
      shapes: ['circle', 'square'],
      gravity: 0.8,
      scalar: 1.2,
      ticks: 300
    });
    
    // Firing confetti from both sides
    const fireFromSides = () => {
      myConfetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: goldColors
      });

      myConfetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: goldColors
      });
    };
    
    // Multiple bursts
    const interval = setInterval(() => {
      fireFromSides();
      count++;
      
      if (count >= 3) {
        clearInterval(interval);
        
        // Grand finale
        setTimeout(() => {
          myConfetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: goldColors,
            shapes: ['circle', 'square', 'star'],
            ticks: 300,
            disableForReducedMotion: true
          });
          
          // We're done with the animation
          setTimeout(resolve, 2000);
        }, 600);
      }
    }, 400);
  });
}