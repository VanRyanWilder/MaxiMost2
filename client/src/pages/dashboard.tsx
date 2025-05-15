import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Redirecting dashboard to the main habits page
export default function Dashboard() {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to the integrated habits page
    setLocation('/habits');
  }, [setLocation]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Redirecting to Habits Dashboard..."/>
    </div>
  );
}