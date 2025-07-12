// This is a temporary file to add the function.
// It will be merged into confetti-celebration.tsx

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
