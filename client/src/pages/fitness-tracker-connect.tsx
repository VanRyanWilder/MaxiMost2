import { useState, useEffect } from "react";
import { fitnessTrackerService, TrackerStatus } from "@/lib/fitness-trackers";
import { ModernLayout } from "@/components/layout/modern-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FitnessTrackerConnect() {
  const [status, setStatus] = useState<TrackerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get tracker status when component mounts
  useEffect(() => {
    setStatus(fitnessTrackerService.getStatus());
    setLoading(false);
  }, []);
  
  // Generate OAuth URLs
  const authUrls = status ? fitnessTrackerService.getAuthUrls() : { fitbit: null, samsungHealth: null, myFitnessPal: null };
  
  const handleConnect = (tracker: 'fitbit' | 'samsungHealth' | 'myFitnessPal') => {
    const url = authUrls[tracker];
    if (url) {
      // Open OAuth flow in a popup window
      const width = 600;
      const height = 700;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        url,
        `Connect to ${tracker}`,
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } else {
      toast({
        title: "Connection Error",
        description: `${tracker} is not properly configured. Please check your API credentials.`,
        variant: "destructive"
      });
    }
  };
  
  const handleDisconnect = (tracker: 'fitbit' | 'samsungHealth' | 'myFitnessPal') => {
    fitnessTrackerService.logout(tracker === 'samsungHealth' ? 'samsung_health' : 
                               tracker === 'myFitnessPal' ? 'myfitnesspal' : 'fitbit');
    // Update status
    setStatus(fitnessTrackerService.getStatus());
    
    toast({
      title: "Disconnected",
      description: `Successfully disconnected from ${tracker}.`,
    });
  };

  // Mapping for display names
  const displayNames = {
    fitbit: "Fitbit",
    samsungHealth: "Samsung Health",
    myFitnessPal: "MyFitnessPal"
  };
  
  if (loading) {
    return (
      <ModernLayout pageTitle="Connect Fitness Trackers">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout pageTitle="Connect Fitness Trackers">
      <div className="container mx-auto py-6 space-y-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Connect Your Fitness Trackers</h1>
          
          <p className="text-muted-foreground mb-6">
            Connect your fitness trackers to automatically import your activity, sleep, nutrition, and other health data.
            This helps MaxiMost provide more personalized recommendations and track your progress more accurately.
          </p>
          
          {(!status?.fitbit.configured && !status?.samsungHealth.configured && !status?.myFitnessPal.configured) && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Missing</AlertTitle>
              <AlertDescription>
                No fitness tracker API credentials have been configured. Please ask the administrator to set up the necessary API keys.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Fitbit */}
            <Card className={!status?.fitbit.configured ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://cdn.iconscout.com/icon/free/png-256/free-fitbit-1-283126.png" 
                      alt="Fitbit" className="w-6 h-6" />
                  Fitbit
                </CardTitle>
                <CardDescription>
                  Connect to sync steps, activity, sleep, and heart rate data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.fitbit.authenticated ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <Check className="mr-1 h-4 w-4" />
                      <span>Connected to Fitbit</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sync your Fitbit data like steps, sleep quality, and heart rate to get more accurate habit tracking and recommendations.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.fitbit.authenticated ? (
                  <Button variant="outline" onClick={() => handleDisconnect('fitbit')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect('fitbit')}
                    disabled={!status?.fitbit.configured}
                  >
                    Connect <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Samsung Health */}
            <Card className={!status?.samsungHealth.configured ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/305_Samsung_logo-512.png" 
                      alt="Samsung Health" className="w-6 h-6" />
                  Samsung Health
                </CardTitle>
                <CardDescription>
                  Connect to sync activity, sleep, and vital stats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.samsungHealth.authenticated ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <Check className="mr-1 h-4 w-4" />
                      <span>Connected to Samsung Health</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Import data directly from Samsung Health including activity tracking, sleep patterns, and health metrics.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.samsungHealth.authenticated ? (
                  <Button variant="outline" onClick={() => handleDisconnect('samsungHealth')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect('samsungHealth')}
                    disabled={!status?.samsungHealth.configured}
                  >
                    Connect <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Google Fit */}
            <Card className={!status?.googleFit.configured ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Google_Fit_icon_%282018%29.svg" 
                      alt="Google Fit" className="w-6 h-6" />
                  Google Fit
                </CardTitle>
                <CardDescription>
                  Connect to sync workout, steps, and heart rate data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.googleFit.authenticated ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <Check className="mr-1 h-4 w-4" />
                      <span>Connected to Google Fit</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sync your Google Fit activity data, workout sessions, and health metrics with MaxiMost for comprehensive habit tracking.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.googleFit.authenticated ? (
                  <Button variant="outline" onClick={() => handleDisconnect('googleFit')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect('googleFit')}
                    disabled={!status?.googleFit.configured}
                  >
                    Connect <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Apple Health */}
            <Card className={!status?.appleHealth.supported ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://developer.apple.com/assets/elements/icons/healthkit/healthkit-128x128.png" 
                      alt="Apple Health" className="w-6 h-6" />
                  Apple Health
                </CardTitle>
                <CardDescription>
                  Sync your Apple Health data from your iOS device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.appleHealth.lastSynced ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                        <Check className="mr-1 h-4 w-4" />
                        <span>Data synced from Apple Health</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last synced: {status.appleHealth.lastSynced.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {status?.appleHealth.supported 
                        ? "Sync data from your iPhone's Apple Health app, including workouts, steps, and health metrics."
                        : "Apple Health sync is only available on iOS devices."}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.appleHealth.lastSynced ? (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const today = new Date();
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(today.getDate() - 30);
                        fitnessTrackerService.syncAppleHealthData(
                          thirtyDaysAgo.toISOString().split('T')[0],
                          today.toISOString().split('T')[0]
                        );
                        // Update status after sync
                        setStatus(fitnessTrackerService.getStatus());
                      }}
                    >
                      Sync Again
                    </Button>
                    <Button variant="outline" onClick={() => handleDisconnect('appleHealth')}>
                      Clear Data
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      // For Apple Health we do a direct sync rather than an OAuth flow
                      if (status?.appleHealth.supported) {
                        const today = new Date();
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(today.getDate() - 30);
                        fitnessTrackerService.syncAppleHealthData(
                          thirtyDaysAgo.toISOString().split('T')[0],
                          today.toISOString().split('T')[0]
                        );
                        // Update status after sync
                        setStatus(fitnessTrackerService.getStatus());
                      }
                    }}
                    disabled={!status?.appleHealth.supported}
                  >
                    Sync Data
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Garmin */}
            <Card className={!status?.garmin.configured ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Garmin_logo.svg" 
                      alt="Garmin" className="w-6 h-6" />
                  Garmin Connect
                </CardTitle>
                <CardDescription>
                  Connect to sync your Garmin watch and device data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.garmin.authenticated ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <Check className="mr-1 h-4 w-4" />
                      <span>Connected to Garmin Connect</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Import your training data, workouts, and activity metrics from Garmin watches and other Garmin devices.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.garmin.authenticated ? (
                  <Button variant="outline" onClick={() => handleDisconnect('garmin')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect('garmin')}
                    disabled={!status?.garmin.configured}
                  >
                    Connect <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* MyFitnessPal */}
            <Card className={!status?.myFitnessPal.configured ? "opacity-60" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img src="https://play-lh.googleusercontent.com/QhGXNxfKZ_Y8FpHGQmOiSL8SmfE5wEPa3vd6f0fVYh-KkHkQ7rwsmEQYSfJ6u7lQs_s" 
                      alt="MyFitnessPal" className="w-6 h-6 rounded" />
                  MyFitnessPal
                </CardTitle>
                <CardDescription>
                  Connect to sync nutrition, calories, and weight data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 flex flex-col justify-center">
                  {status?.myFitnessPal.authenticated ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <Check className="mr-1 h-4 w-4" />
                      <span>Connected to MyFitnessPal</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Import your nutrition data, meal logs, and calorie information to better track your diet habits and fitness goals.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {status?.myFitnessPal.authenticated ? (
                  <Button variant="outline" onClick={() => handleDisconnect('myFitnessPal')}>
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleConnect('myFitnessPal')}
                    disabled={!status?.myFitnessPal.configured}
                  >
                    Connect <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-10 bg-muted/50 rounded-lg p-6 max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">What data is imported?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-medium mb-2">From Fitbit</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Daily step count</li>
                  <li>• Sleep duration & quality</li>
                  <li>• Heart rate data</li>
                  <li>• Active minutes</li>
                  <li>• Calorie expenditure</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">From Samsung Health</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Activity tracking</li>
                  <li>• Sleep patterns</li>
                  <li>• Heart rate data</li>
                  <li>• Blood pressure (if available)</li>
                  <li>• Stress levels</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">From MyFitnessPal</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Calorie consumption</li>
                  <li>• Nutrition breakdown</li>
                  <li>• Water intake</li>
                  <li>• Weight tracking</li>
                  <li>• Food diary entries</li>
                </ul>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              We only access the data you authorize, and you can disconnect any service at any time.
              Your data is used only to provide personalized tracking and recommendations within the MaxiMost platform.
            </p>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}