import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { initializeApp } from "firebase/app";

export default function FirebaseConfig() {
  const [apiKey, setApiKey] = useState("");
  const [projectId, setProjectId] = useState("");
  const [appId, setAppId] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const testConfiguration = () => {
    try {
      // Clear previous status
      setStatus("idle");
      setErrorMessage("");
      
      // Validate inputs
      if (!apiKey || !projectId || !appId) {
        setStatus("error");
        setErrorMessage("All fields are required");
        return;
      }
      
      // Build the Firebase config
      const firebaseConfig = {
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: `${projectId}.appspot.com`,
        messagingSenderId: appId.split(":")[1] || "",
        appId
      };
      
      // Instead of initializing Firebase, just validate the config format
      if (!apiKey.startsWith("AIza")) {
        setStatus("error");
        setErrorMessage("API Key format is invalid. It should start with 'AIza'");
        return;
      }

      if (!appId.includes(":")) {
        setStatus("error");
        setErrorMessage("App ID format is invalid. It should include colons (e.g., 1:123456789:web:abcdef)");
        return;
      }
      
      // Configuration looks valid
      setStatus("success");
      console.log("Valid Firebase configuration:", firebaseConfig);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error?.message || "Failed to validate Firebase configuration");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Firebase Configuration</CardTitle>
          <CardDescription>
            Update your Firebase configuration to connect to your Firebase project.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Firebase configuration is valid. To make these changes permanent, add the following environment variables to your application:
                <div className="mt-2 p-2 bg-black/5 rounded text-sm font-mono">
                  VITE_FIREBASE_API_KEY={apiKey}<br />
                  VITE_FIREBASE_PROJECT_ID={projectId}<br />
                  VITE_FIREBASE_APP_ID={appId}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Firebase API Key</Label>
              <Input 
                id="apiKey" 
                placeholder="AIzaSyB..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Find this in your Firebase project settings under "Web API Key"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectId">Firebase Project ID</Label>
              <Input 
                id="projectId" 
                placeholder="my-project-123" 
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Find this in your Firebase project settings under "Project ID"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appId">Firebase App ID</Label>
              <Input 
                id="appId" 
                placeholder="1:123456789012:web:abcdef123456" 
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Find this in your Firebase project settings under "App ID"
              </p>
            </div>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Make sure to add your application domain to the authorized domains list in Firebase Authentication settings.
              The current domain is: <span className="font-mono text-sm">{window.location.hostname}</span>
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter>
          <Button onClick={testConfiguration}>
            Test Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}