import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { SiSamsung } from "react-icons/si";
import { signInWithGoogle, signInWithFacebook, signInWithApple, signInWithSamsung } from "@/lib/firebase";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useUser();
  const [, setLocation] = useLocation();

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple' | 'samsung') => {
    setIsLoading(true);
    setError(null);
    
    try {
      let user;
      
      switch(provider) {
        case 'google':
          user = await signInWithGoogle();
          break;
        case 'facebook':
          user = await signInWithFacebook();
          break;
        case 'apple':
          user = await signInWithApple();
          break;
        case 'samsung':
          user = await signInWithSamsung();
          break;
      }
      
      if (user) {
        // Use the existing login function from context to handle auth state
        await login(user.email || "user@example.com", "firebase-auth");
        setLocation("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              BeastMode
            </span>
          </CardTitle>
          <CardDescription>
            Sign in to continue your self improvement journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <FaGoogle className="h-4 w-4" />
            <span>Continue with Google</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <FaFacebookF className="h-4 w-4" />
            <span>Continue with Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
          >
            <FaApple className="h-4 w-4" />
            <span>Continue with Apple</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('samsung')}
            disabled={isLoading}
          >
            <SiSamsung className="h-4 w-4" />
            <span>Continue with Samsung</span>
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={() => {
              // For now, just use the mock user login
              login("demo@example.com", "password");
              setLocation("/dashboard");
            }}
          >
            Continue as Guest
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span>Need access? </span>
            <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/signup")}>
              Create an account
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}