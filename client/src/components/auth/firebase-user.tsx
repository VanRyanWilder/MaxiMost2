import { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { LogIn, LogOut } from "lucide-react"; // Commented for testing FIX-15
import { 
  listenToAuthChanges, // Updated import
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signOut 
} from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
// Temporary type fix to handle TypeScript errors
import { useLocation } from "wouter";

// Placeholders for icons
const LogIn = (props: any) => <div {...props}>LogInIcon</div>;
const LogOut = (props: any) => <div {...props}>LogOutIcon</div>;

export function FirebaseUserComponent() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [, setLocation] = useLocation();
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = listenToAuthChanges((firebaseUser) => { // Updated usage
      setUser(firebaseUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setIsLoggingIn(true);
      
      switch(provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'facebook':
          await signInWithFacebook();
          break;
        case 'apple':
          await signInWithApple();
          break;
      }
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = () => {
    setLocation('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // You might want to redirect to home or login page
      setLocation('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate max-w-[100px]">
              {user.displayName || user.email || 'User'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleSocialLogin('google')} 
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <span>Google</span>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleEmailLogin}
      >
        <LogIn className="h-4 w-4 mr-2" />
        <span>Login</span>
      </Button>
    </div>
  );
}