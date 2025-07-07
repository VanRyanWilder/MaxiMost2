import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, Zap } from 'lucide-react'; // Zap for generic logo

interface TrackerCardProps {
  serviceName: string;
  logo?: React.ReactNode; // Can be an img tag or an icon component
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void; // Added for future use
  description?: string; // Optional short description
}

export const TrackerCard: React.FC<TrackerCardProps> = ({
  serviceName,
  logo,
  isConnected,
  onConnect,
  onDisconnect,
  description = "Connect this service to automate your habit tracking.",
}) => {
  return (
    <Card className="flex flex-col justify-between text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center">
        {logo ? <div className="h-16 w-16 mb-3 flex items-center justify-center">{logo}</div> : <Zap className="h-12 w-12 mb-3 text-gray-400" />}
        <CardTitle className="text-xl">{serviceName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-center"> {/* Changed to flex-col for status + button */}
        {isConnected ? (
          <>
            <div className="flex items-center text-green-600 mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Connected</span>
            </div>
            <Button variant="outline" onClick={onDisconnect} className="w-full">
              Disconnect
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center text-gray-500 mb-2">
              <XCircle className="h-5 w-5 mr-2" />
              <span>Not Connected</span>
            </div>
            <Button variant="default" onClick={onConnect} className="w-full bg-primary hover:bg-primary/90">
              Connect
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
