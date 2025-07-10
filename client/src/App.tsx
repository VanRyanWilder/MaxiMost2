import { useState, useEffect } from "react"; // Added useState, useEffect
import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context"; // Will need to coordinate with UserProvider changes
import { auth, listenToAuthChanges } from "@/lib/firebase";
import { getRedirectResult } from "firebase/auth"; // Import getRedirectResult directly
import NotFound from "@/pages/not-found";
// import { Spinner } from "@/components/ui/spinner"; // Assuming a spinner component exists

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
  const [locationValue, setWouterLocation] = useLocation(); // Renamed setLocation to avoid conflict
  const componentName = Component.displayName || Component.name || "UnknownComponent";
  console.log(`DEBUG: PrivateRoute activated for component: ${componentName}, current location: ${locationValue}`);

  const { user, loading, error } = useUser();
  console.log(`DEBUG: PrivateRoute (for ${componentName}): useUser() state: user: ${user ? user.uid : null}, loading: ${loading}, error: ${error}`);

  // The 'loading' here is now effectively App's 'isAuthLoading' via context.
  if (loading) {
    console.log(`DEBUG: PrivateRoute (for ${componentName}): Context loading is true. Rendering loading screen.`);
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Protected Route... (PrivateRoute)</div>;
  }

  if (error) {
    console.log(`DEBUG: PrivateRoute (for ${componentName}): Context error detected. Rendering error UI. Error:`, error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
        <h1 className="text-xl font-bold mb-2">Authentication Error (PrivateRoute)</h1>
        <p className="mb-1">We encountered an error trying to sign you in.</p>
        <p className="text-sm bg-red-200 p-2 rounded mb-4">Details: {error.message}</p>
        <Button onClick={() => setWouterLocation('/login')} variant="destructive">Go to Login</Button>
      </div>
    );
  }

  if (!user) {
    const redirectTo = `/login?redirect=${encodeURIComponent(locationValue)}`;
    console.log(`DEBUG: PrivateRoute (for ${componentName}): No user. Redirecting to ${redirectTo}`);
    return <Redirect to={redirectTo} />;
  }

  console.log(`DEBUG: PrivateRoute (for ${componentName}): User authenticated. Rendering component inside AppLayout.`);
  return <AppLayout><Component {...rest} /></AppLayout>;
}

function App() {
  const [appUser, setAppUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [, navigate] = useLocation(); // For redirecting after logout - UNCOMMENTING

  useEffect(() => {
    // Process redirect first, as it might set the user for onAuthStateChanged
    getRedirectResult(auth) // Corrected: call imported getRedirectResult with auth instance
      .then((result) => {
        if (result && result.user) {
          // User signed in via redirect.
          // onAuthStateChanged will handle setting appUser and isAuthLoading.
          console.log("DEBUG: App.tsx: Redirect sign-in successful for user:", result.user.uid, result.user);
        } else {
          console.log("DEBUG: App.tsx: No redirect result or no user in redirect result.");
        }
      })
      .catch(err => {
        console.error("DEBUG: App.tsx: Error processing redirect result:", err);
        setAuthError(err);
        // If redirect fails, onAuthStateChanged will likely report no user or existing user.
        // isAuthLoading will be set to false by onAuthStateChanged regardless.
      })
      .finally(() => {
        // Setup the main listener after redirect attempt (success or fail)
        console.log("DEBUG: App.tsx: Setting up onAuthStateChanged listener.");
        const unsubscribe = listenToAuthChanges((firebaseUser) => { // Use renamed function
          console.log("DEBUG: App.tsx: onAuthStateChanged event. Firebase user:", firebaseUser ? firebaseUser.uid : null, firebaseUser);
          setAppUser(firebaseUser);
          console.log("DEBUG: App.tsx: appUser state set to:", firebaseUser ? firebaseUser.uid : null);

          if (firebaseUser || !authError?.message.includes("redirect")) {
             console.log("DEBUG: App.tsx: Clearing authError (if any not related to critical redirect error). Current authError:", authError);
             setAuthError(null);
          }
          setIsAuthLoading(false);
          console.log("DEBUG: App.tsx: isAuthLoading state set to false.");
        });
        return () => {
          console.log("DEBUG: App.tsx: Unsubscribing from onAuthStateChanged.");
          unsubscribe();
        };
      });
  }, [authError?.message]); // Re-run if authError message changes, to re-evaluate clearing it.

  console.log("DEBUG: App.tsx: Rendering. isAuthLoading:", isAuthLoading, "appUser:", appUser ? appUser.uid : null);
  if (isAuthLoading) {
    console.log("DEBUG: App.tsx: Rendering loading screen.");
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-white">
        {/* <Spinner size="lg" /> */}
        <p>Initializing...</p>
      </div>
    );
  }

  console.log("DEBUG: App.tsx: Proceeding to render UserContext.Provider and Switch.");
  return (
    <UserContext.Provider value={{ user: appUser, loading: isAuthLoading, error: authError }}>
      <Switch>
        {/* Public routes */}
        <Route path="/">
          {() => {
            console.log("DEBUG: App.tsx: Processing / route.");
            const { user: contextUser, error: contextError, loading: contextLoading } = useUser();
            console.log(`DEBUG: App.tsx / route: useUser() state - user: ${contextUser ? contextUser.uid : null}, loading: ${contextLoading}, error: ${contextError}`);

            if (contextError) {
              console.log("DEBUG: App.tsx / route: Context error detected, rendering error UI.");
              return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
                  <h1 className="text-xl font-bold mb-2">Application Error</h1>
                  <p className="mb-1">An error occurred while loading user data.</p>
                  <p className="text-sm bg-red-200 p-2 rounded">Details: {contextError.message}</p>
                  <a href="/login" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Logging In Again</a>
                </div>
              );
            }

            if (contextUser) {
              console.log("DEBUG: App.tsx / route: User authenticated, redirecting to /dashboard.");
              return <Redirect to="/dashboard" />;
            }
            console.log("DEBUG: App.tsx / route: No user, rendering Home component.");
            return <Home />;
          }}
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/test-page" component={TestPage} /> {/* J-18: Canary Route */}
        <Route path="/canary2-test" component={Canary2} /> {/* Canary 2 Test */}

        <Route path="/login">
          {() => {
            console.log("DEBUG: App.tsx: Processing /login route.");
            const { user: contextUser, loading: contextLoading, error: contextError } = useUser();
            const [currentWouterLocation] = useLocation(); // Changed from useWouterLocation
            console.log(`DEBUG: App.tsx /login route: Current wouter location: ${currentWouterLocation}. useUser() state - user: ${contextUser ? contextUser.uid : null}, loading: ${contextLoading}, error: ${contextError}`);

            if (contextError) { // Check for error first
              console.log("DEBUG: App.tsx /login route: Context error detected, rendering error UI for login path.");
              // Potentially render a simplified error or redirect, or let Login page handle if it also checks context error
              return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
                  <h1 className="text-xl font-bold mb-2">Login Page Context Error</h1>
                  <p className="mb-1">An error occurred with user authentication context.</p>
                  <p className="text-sm bg-red-200 p-2 rounded">Details: {contextError.message}</p>
                  <a href="/login" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Again</a>
                </div>
              );
            }

            if (contextUser) {
              const queryParams = new URLSearchParams(currentWouterLocation.split('?')[1]);
              const redirectTarget = queryParams.get('redirect');
              console.log(`DEBUG: App.tsx /login route: User authenticated. Redirect query: '${redirectTarget}'. Redirecting to ${redirectTarget || "/dashboard"}.`);
              return <Redirect to={redirectTarget || "/dashboard"} />;
            }
            console.log("DEBUG: App.tsx /login route: No user, rendering Login component.");
            return <Login />;
          }}
        </Route>
        <Route path="/signup">
          {() => {
            console.log("DEBUG: App.tsx: Processing /signup route.");
            const { user: contextUser, loading: contextLoading, error: contextError } = useUser();
            console.log(`DEBUG: App.tsx /signup route: useUser() state - user: ${contextUser ? contextUser.uid : null}, loading: ${contextLoading}, error: ${contextError}`);
            if (contextError) {
                 console.log("DEBUG: App.tsx /signup route: Context error detected, rendering error UI for signup path.");
                 return (
                    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
                      <h1 className="text-xl font-bold mb-2">Signup Page Context Error</h1>
                      <p className="mb-1">An error occurred with user authentication context.</p>
                      <p className="text-sm bg-red-200 p-2 rounded">Details: {contextError.message}</p>
                      <a href="/signup" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Again</a>
                    </div>
                 );
            }
            if (contextUser) {
              console.log("DEBUG: App.tsx /signup route: User authenticated, redirecting to /dashboard.");
              return <Redirect to="/dashboard" />;
            }
            console.log("DEBUG: App.tsx /signup route: No user, rendering Signup component.");
            return <Signup />;
          }}
        </Route>

      {/* Protected routes */}
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
      </Route>
      <Route path="/explore"> {/* Add route for ExplorePage */}
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
      {/* <Route path="/principles">
        <PrivateRoute component={Principles} />
      </Route> */} {/* Route removed */}
      {/* <Route path="/sugar">
        <PrivateRoute component={Sugar} />
      </Route> */} {/* Route removed */}
      <Route path="/body-stats">
        <PrivateRoute component={BodyStats} />
      </Route>
      <Route path="/community">
        <PrivateRoute component={Community} />
      </Route>
      <Route path="/progress">
        <PrivateRoute component={ProgressPage} /> {/* Updated to new ProgressPage */}
      </Route>
      <Route path="/progress-dashboard">
        <PrivateRoute component={ProgressDashboard} />
      </Route>
      {/* <Route path="/motivation"> <PrivateRoute component={Motivation} /> </Route> // Removed route for deleted motivation.tsx */}
      <Route path="/experts">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/experts-unified">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/learn/habit-building-basics"> {/* Updated route and component */}
        <PrivateRoute component={HabitBuildingBasicsPage} />
      </Route>
      <Route path="/learn/atomic-habits"> {/* Updated route for Atomic Habits Guide */}
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
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/firebase-config" component={FirebaseConfig} />
      <Route path="/fitness-tracker-connect">
        <PrivateRoute component={FitnessTrackerConnect} />
      </Route>

      {/* New IA Routes */}
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

      {/* 404 Not Found route */}
      <Route component={NotFound} />
    </Switch>
    </UserContext.Provider>
  );
}

export default App;
