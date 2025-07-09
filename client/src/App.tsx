import { useState, useEffect } from "react"; // Added useState, useEffect
import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context"; // Will need to coordinate with UserProvider changes
import { auth, listenToAuthChanges } from "@/lib/firebase";
import { getRedirectResult, signOut } from "firebase/auth"; // Import getRedirectResult and signOut
import NotFound from "@/pages/not-found";
// import { Spinner } from "@/components/ui/spinner"; // Assuming a spinner component exists
import { useLocation as useWouterLocation } from "wouter"; // Aliasing to avoid conflict if any other useLocation is imported

// Import the intended homepage
import Home from "@/pages/home"; // Changed from NewHomePage
import TestPage from "@/pages/TestPage"; // Added for J-18
import Canary2 from "@/pages/Canary2"; // Added for Canary 2 Test

// Other page imports
import Dashboard from "@/pages/dashboard-new";
import ExplorePage from "@/pages/explore"; // Import the new Explore page
import AtomicHabitsGuidePage from "@/pages/atomic-habits-guide"; // Import Atomic Habits Guide page
import Profile from "@/pages/profile";
import Workouts from "@/pages/workouts";
import MindSpirit from "@/pages/mind-spirit";
import Nutrition from "@/pages/nutrition";
import Resources from "@/pages/resources";
import Programs from "@/pages/programs";
import Tasks from "@/pages/tasks";
import IntegratedHabits from "@/pages/integrated-habits";
import HabitTracker from "@/pages/habit-tracker";
import HabitStacks from "@/pages/habit-stacks";
import Supplements from "@/pages/supplements-unified";
import FitnessTrackerConnect from "@/pages/fitness-tracker-connect";
import SupplementDetail from "@/pages/supplement-detail";
import Research from "@/pages/research";
// import Principles from "@/pages/principles"; // To be removed
// import Sugar from "@/pages/sugar"; // To be removed
import BodyStats from "@/pages/body-stats";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import Progress from "@/pages/progress";
import ProgressDashboard from "@/pages/progress-dashboard";
import Gamification from "@/pages/gamification";
// import Motivation from "@/pages/motivation"; // Removed import for deleted motivation.tsx
import Experts from "@/pages/experts-unified";
import HabitBuildingBasicsPage from "@/pages/learn/habit-building-basics"; // Updated import
import Branding from "@/pages/branding";
import Contact from "@/pages/contact";
import AIFeatures from "@/pages/ai-features";
import FirebaseConfig from "@/pages/firebase-config";

// New Page Imports
import StacksPage from "@/pages/StacksPage";
import JournalPage from "@/pages/JournalPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import OutliveSummaryPage from "@/pages/learn/outlive-summary";
import DangersOfSugarPage from "@/pages/learn/dangers-of-sugar";
import StoicPrinciplesPage from "@/pages/learn/stoic-principles";
import ProgressPage from "@/pages/ProgressPage";
import AICoachPage from "@/pages/AICoachPage"; // Import the new AICoachPage

// Import AppLayout
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { User as FirebaseUser } from "firebase/auth";
import { UserContext, useUser } from "@/context/user-context"; // Import UserContext and useUser
// Assuming Spinner component exists or a placeholder will be used.
// import { Spinner } from "@/components/ui/spinner";


// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, loading, error } = useUser();
  const [locationValue, setLocation] = useLocation();
  
  // The 'loading' here is now effectively App's 'isAuthLoading' via context.
  // If App's main gate is active, this loading check might be redundant or act as a secondary check.
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Protected Route...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
        <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
        <p className="mb-1">We encountered an error trying to sign you in.</p>
        <p className="text-sm bg-red-200 p-2 rounded mb-4">Details: {error.message}</p>
        <Button onClick={() => setLocation('/login')} variant="destructive">Go to Login</Button>
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(locationValue)}`} />;
  }
  
  // if (Component.name === "Dashboard") {
  //   console.log("FIX-15 DEBUG: Rendering Dashboard directly without AppLayout - REVERTED");
  //   return <Component {...rest} />;
  // }
  return <AppLayout><Component {...rest} /></AppLayout>;
}

function App() {
  const [appUser, setAppUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [, navigate] = useLocation(); // For redirecting after logout

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAppUser(null); // Clear user state immediately
      // Optionally, clear other app-specific states related to the user
      console.log("User logged out successfully.");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a toast message)
      setAuthError(error as Error);
    }
  };

  useEffect(() => {
    // Process redirect first, as it might set the user for onAuthStateChanged
    getRedirectResult(auth) // Corrected: call imported getRedirectResult with auth instance
      .then((result) => {
        if (result && result.user) {
          // User signed in via redirect.
          // onAuthStateChanged will handle setting appUser and isAuthLoading.
          console.log("App.tsx: Redirect sign-in successful for user:", result.user.uid);
        }
      })
      .catch(err => {
        console.error("App.tsx: Error processing redirect result:", err);
        setAuthError(err);
        // If redirect fails, onAuthStateChanged will likely report no user or existing user.
        // isAuthLoading will be set to false by onAuthStateChanged regardless.
      })
      .finally(() => {
        // Setup the main listener after redirect attempt (success or fail)
        const unsubscribe = listenToAuthChanges((user) => { // Use renamed function
          console.log("App.tsx: onAuthStateChanged triggered. User:", user ? user.uid : null);
          setAppUser(user);
          // If a user is found (or definitively not found), clear any previous redirect processing error
          // unless the error is critical and should persist. For now, clear it.
          if (user || !authError?.message.includes("redirect")) { // Basic check to not clear critical redirect errors too soon.
             setAuthError(null);
          }
          setIsAuthLoading(false);
        });
        return () => {
          console.log("App.tsx: Unsubscribing from onAuthStateChanged");
          unsubscribe();
        };
      });
  }, [authError?.message]); // Re-run if authError message changes, to re-evaluate clearing it.

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-white">
        {/* <Spinner size="lg" /> */}
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user: appUser, loading: isAuthLoading, error: authError, logout: handleLogout }}>
      <Switch>
        {/* Public routes */}
        <Route path="/">
          {() => {
            const { user: contextUser, error: contextError } = useUser();
            if (contextError) {
              return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
                  <h1 className="text-xl font-bold mb-2">Application Error</h1>
                  <p className="mb-1">An error occurred while loading user data.</p>
                  <p className="text-sm bg-red-200 p-2 rounded">Details: {contextError.message}</p>
                  <a href="/login" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Logging In Again</a>
                </div>
              );
            }
            if (contextUser) return <Redirect to="/dashboard" />;
            return <Home />;
          }}
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/test-page" component={TestPage} /> {/* J-18: Canary Route */}
        <Route path="/canary2-test" component={Canary2} /> {/* Canary 2 Test */}

        <Route path="/login">
          {() => {
            const { user: contextUser } = useUser();
            const [location] = useWouterLocation(); // Using aliased import
            if (contextUser) {
              const queryParams = new URLSearchParams(location.split('?')[1]);
              const redirectTarget = queryParams.get('redirect');
              return <Redirect to={redirectTarget || "/dashboard"} />;
            }
            return <Login />;
          }}
        </Route>
        <Route path="/signup">
          {() => {
            const { user: contextUser } = useUser();
            if (contextUser) {
              return <Redirect to="/dashboard" />;
            }
            return <Signup />;
          }}
        </Route>

      {/* Protected routes - Temporarily commented out for debugging FIX-15 */}
      
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
      </Route>
      {/*
      <Route path="/explore">
        <PrivateRoute component={ExplorePage} />
      </Route>
      <Route path="/profile">
        <PrivateRoute component={Profile} />
      </Route>
      <Route path="/workouts">
        <PrivateRoute component={Workouts} />
      </Route>
      <Route path="/mind-spirit">
        <PrivateRoute component={MindSpirit} />
      </Route>
      <Route path="/nutrition">
        <PrivateRoute component={Nutrition} />
      </Route>
      <Route path="/resources">
        <PrivateRoute component={Resources} />
      </Route>
      <Route path="/programs">
        <PrivateRoute component={Programs} />
      </Route>
      <Route path="/tasks">
        <PrivateRoute component={Tasks} />
      </Route>
      <Route path="/habits">
        <PrivateRoute component={IntegratedHabits} />
      </Route>
      <Route path="/habit-tracker">
        <PrivateRoute component={HabitTracker} />
      </Route>
      <Route path="/habit-stacks">
        <PrivateRoute component={HabitStacks} />
      </Route>
      <Route path="/ai-features">
        <PrivateRoute component={AIFeatures} />
      </Route>
      <Route path="/supplements">
        <PrivateRoute component={Supplements} />
      </Route>
      <Route path="/supplement-detail/:id">
        <PrivateRoute component={SupplementDetail} />
      </Route>
      <Route path="/research">
        <PrivateRoute component={Research} />
      </Route>
      <Route path="/body-stats">
        <PrivateRoute component={BodyStats} />
      </Route>
      <Route path="/community">
        <PrivateRoute component={Community} />
      </Route>
      <Route path="/progress">
        <PrivateRoute component={ProgressPage} />
      </Route>
      <Route path="/progress-dashboard">
        <PrivateRoute component={ProgressDashboard} />
      </Route>
      <Route path="/experts">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/experts-unified">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/learn/habit-building-basics">
        <PrivateRoute component={HabitBuildingBasicsPage} />
      </Route>
      <Route path="/learn/atomic-habits">
        <PrivateRoute component={AtomicHabitsGuidePage} />
      </Route>
      <Route path="/learn/outlive-summary">
        <PrivateRoute component={OutliveSummaryPage} />
      </Route>
      <Route path="/learn/dangers-of-sugar">
        <PrivateRoute component={DangersOfSugarPage} />
      </Route>
      <Route path="/learn/stoic-principles">
        <PrivateRoute component={StoicPrinciplesPage} />
      </Route>
      <Route path="/branding">
        <PrivateRoute component={Branding} />
      </Route>
      <Route path="/fitness-tracker-connect">
        <PrivateRoute component={FitnessTrackerConnect} />
      </Route>
      <Route path="/stacks">
        <PrivateRoute component={StacksPage} />
      </Route>
      <Route path="/journal">
        <PrivateRoute component={JournalPage} />
      </Route>
      <Route path="/integrations">
        <PrivateRoute component={IntegrationsPage} />
      </Route>
      <Route path="/coach">
        <PrivateRoute component={AICoachPage} />
      </Route>
      */}

      {/* Public routes that are not PrivateRoute but might be complex */}
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/firebase-config" component={FirebaseConfig} />


      {/* 404 Not Found route */}
      <Route component={NotFound} />
    </Switch>
    </UserContext.Provider>
  );
}

export default App;
