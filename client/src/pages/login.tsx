import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // Separator import was already here from previous step, ensuring it's active
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
// // useUser no longer provides 'login'. Auth state is managed by firebaseUser.
// // import { useUser } from "@/context/user-context";
// import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa"; // Commenting out react-icons import for test
import { signInWithGoogle, signInWithFacebook, signInWithApple, signInWithEmail, signInAnonymously } from "@/lib/firebase";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // // const { login } = useUser(); // 'login' is no longer in useUser context
  const [, setLocation] = useLocation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await signInWithEmail(email, password);
      if (user) {
        // Firebase auth state is handled by onAuthStateChanged in UserProvider.
        // UserProvider and App.tsx routing will handle navigation to /dashboard.
        // setLocation("/dashboard"); // REMOVED
      }
    } catch (error: any) {
      console.error("Email login error:", error);
      // Provide a more specific error message based on Firebase error codes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setError(null);

    try {
      let user;

      switch(provider) {
        case 'google':
          user = await signInWithGoogle();
          break;
        case 'facebook':
          // user = await signInWithFacebook(); // Facebook login commented out
          break;
        case 'apple':
          // user = await signInWithApple(); // Apple login commented out
          break;
      }

      if (user) {
        // Firebase auth state is handled by onAuthStateChanged in UserProvider.
        // UserProvider and App.tsx routing will handle navigation to /dashboard.
        // setLocation("/dashboard"); // REMOVED
      }
    } catch (error) {
      console.error("Social login error:", error);
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
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              MaxiMost
            </span>
          </CardTitle>
          <CardDescription>
            Sign in to continue your self improvement journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 overflow-auto max-h-[60vh]">
          {/* <h1>LOGIN PAGE TEST - Step 2 Restore (Card Structure)</h1>
          <p>Basic Card structure restored. Form elements still commented.</p> */}
          {error && (
            <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded">
              Error: {error}
            </div>
          )}
          {isLoading && <p>Loading...</p>}
          
          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button type="button" variant="link" size="sm" className="px-0 h-auto">
                  Forgot password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign in with Email</span>
              )}
            </Button>
          </form>
          
          {/* Guest Login button still commented */}
          {/*
          <Button 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={async () => {
              // ... guest login logic ...
            }}
            disabled={isLoading}
          >
            <span>Continue as Guest</span>
          </Button>
          */}
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or Sign In With
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            {/* <FaGoogle className="h-4 w-4" /> */} {/* Icon commented out for test */}
            <span>Continue with Google (No Icon Test)</span>
          </Button>

          {/* The other social login buttons remain commented as they were in original */}
          {/*
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
          */}

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