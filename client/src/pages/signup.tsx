import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "wouter";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { SiSamsung } from "react-icons/si";
import { signInWithGoogle, signInWithFacebook, signInWithApple, signInWithSamsung } from "@/lib/firebase";

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSocialSignup = async (provider: 'google' | 'facebook' | 'apple' | 'samsung') => {
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
        // In a real application, you would register the user in your backend
        // For now, just navigate to onboarding
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic form validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // In a real application, you would register the user with email/password
    // For now, just navigate to onboarding
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create a{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              BeastMode
            </span>{" "}
            Account
          </CardTitle>
          <CardDescription>
            Begin your self-improvement journey today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <FaGoogle className="h-4 w-4" />
              <span>Google</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleSocialSignup('facebook')}
              disabled={isLoading}
            >
              <FaFacebookF className="h-4 w-4" />
              <span>Facebook</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleSocialSignup('apple')}
              disabled={isLoading}
            >
              <FaApple className="h-4 w-4" />
              <span>Apple</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleSocialSignup('samsung')}
              disabled={isLoading}
            >
              <SiSamsung className="h-4 w-4" />
              <span>Samsung</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span>Already have an account? </span>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
              Log in
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}