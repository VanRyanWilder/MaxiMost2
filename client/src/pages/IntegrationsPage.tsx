import React from 'react';

import React, { useState } from 'react';
import { TrackerCard } from '@/components/integrations/TrackerCard';
import { ConnectionModal } from '@/components/integrations/ConnectionModal'; // Import the modal
import { Smartphone, Watch, Activity } from 'lucide-react'; // Example icons

interface TrackerConfig {
  id: string;
  serviceName: string;
  logoPlaceholder: React.ReactNode; // Using ReactNode for more flexibility (e.g. icons or styled text)
  description: string;
}

const initialTrackers: TrackerConfig[] = [
  { id: 'samsung', serviceName: 'Samsung Health', logoPlaceholder: <Watch className="h-10 w-10 text-blue-600" />, description: "Sync steps, workouts, and sleep from Samsung Health." },
  { id: 'fitbit', serviceName: 'Fitbit', logoPlaceholder: <Activity className="h-10 w-10 text-teal-500" />, description: "Automatically track your Fitbit activity and sleep." },
  { id: 'apple', serviceName: 'Apple Health', logoPlaceholder: <Smartphone className="h-10 w-10 text-gray-700" />, description: "Connect with Apple Health for seamless data sync." },
  { id: 'google', serviceName: 'Google Fit', logoPlaceholder: <Activity className="h-10 w-10 text-red-500" />, description: "Integrate Google Fit to update your progress." },
  { id: 'garmin', serviceName: 'Garmin', logoPlaceholder: <Watch className="h-10 w-10 text-black" />, description: "Sync your Garmin device activities and health stats." },
  { id: 'strava', serviceName: 'Strava', logoPlaceholder: <Activity className="h-10 w-10 text-orange-500" />, description: "Log your runs and rides automatically from Strava." },
];

const IntegrationsPage: React.FC = () => {
  // State to manage connection status for each tracker
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>(
    initialTrackers.reduce((acc, tracker) => ({ ...acc, [tracker.id]: false }), {})
  );

  // State for Samsung Health Modal
  const [isSamsungModalOpen, setIsSamsungModalOpen] = useState(false);

  const handleConnect = (trackerId: string) => {
    console.log(`Connect action for ${trackerId}`);
    if (trackerId === 'samsung') {
      setIsSamsungModalOpen(true);
    } else {
      alert(`Connect functionality for ${initialTrackers.find(t => t.id === trackerId)?.serviceName} not yet implemented.`);
    }
  };

  const handleDisconnect = (trackerId: string) => {
    console.log(`Disconnect action for ${trackerId}`);
    setConnectionStatus(prev => ({ ...prev, [trackerId]: false }));
    // Potentially add an alert or confirmation here too
  };

  const authorizeSamsungHealth = () => {
    console.log("Authorizing Samsung Health... (Placeholder)");
    setConnectionStatus(prev => ({ ...prev, samsung: true }));
    setIsSamsungModalOpen(false);
    // Here you would typically initiate the OAuth flow
  };

  const samsungTrackerConfig = initialTrackers.find(t => t.id === 'samsung');

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Fitness Tracker Integrations</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect your favorite fitness apps and services to automate your habits and gain deeper insights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {initialTrackers.map((tracker) => (
          <TrackerCard
            key={tracker.id}
            serviceName={tracker.serviceName}
            logo={tracker.logoPlaceholder}
            isConnected={connectionStatus[tracker.id] || false}
            onConnect={() => handleConnect(tracker.id)}
            onDisconnect={() => handleDisconnect(tracker.id)}
            description={tracker.description}
          />
        ))}
      </div>

      {samsungTrackerConfig && (
        <ConnectionModal
          isOpen={isSamsungModalOpen}
          onClose={() => setIsSamsungModalOpen(false)}
          serviceName={samsungTrackerConfig.serviceName}
          logo={samsungTrackerConfig.logoPlaceholder}
          benefits={[
            "Automatically complete your 'steps' and 'workout' habits.",
            "Gain a holistic view of your daily activity.",
            "Save time by eliminating manual entry."
          ]}
          permissions={[
            "Read-only access to your daily step count.",
            "Read-only access to your exercise and workout data.",
            "Read-only access to your sleep data (optional).",
          ]}
          onAuthorize={authorizeSamsungHealth}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;
