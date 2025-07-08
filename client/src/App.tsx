import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";

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
import { Button } from "@/components/ui/button"; // Added Button import


// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, loading, error } = useUser(); // Destructure error
  const [locationValue, setLocation] = useLocation(); // wouter's useLocation
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Authentication...</div>;
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
  
  // If there is a user, the component will be rendered within AppLayout.
  return <AppLayout><Component {...rest} /></AppLayout>;
}

function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {() => {
          const { user, loading, error } = useUser(); // Destructure error
          
          if (loading) {
            return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Application...</div>;
          }

          if (error) {
            return (
              <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-700 p-4">
                <h1 className="text-xl font-bold mb-2">Application Error</h1>
                <p className="mb-1">An error occurred while loading user data.</p>
                <p className="text-sm bg-red-200 p-2 rounded">Details: {error.message}</p>
                {/* User might not be able to navigate if AppLayout isn't there, but login is public */}
                 <a href="/login" className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try Logging In Again</a>
              </div>
            );
          }
          
          if (user) {
            return <Redirect to="/dashboard" />;
          }
          return <Home />;
        }}
      </Route>
      <Route path="/home" component={Home} />
      <Route path="/test-page" component={TestPage} /> {/* J-18: Canary Route */}
      <Route path="/canary2-test" component={Canary2} /> {/* Canary 2 Test */}

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
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
  );
}

export default App;
