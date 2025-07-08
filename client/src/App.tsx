import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";

// Import the intended homepage
import Home from "@/pages/home"; // Changed from NewHomePage
import TestPage from "@/pages/TestPage"; // Added for J-18
import Canary2 from "@/pages/Canary2"; // Added for Canary 2 Test

// Other page imports
import DashboardPage from "@/pages/DashboardPage"; // Updated import for renamed dashboard
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
import Principles from "@/pages/principles";
import Sugar from "@/pages/sugar";
import BodyStats from "@/pages/body-stats";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import Progress from "@/pages/progress"; // Restored import
import ProgressDashboard from "@/pages/progress-dashboard";
import Gamification from "@/pages/gamification";
import Motivation from "@/pages/motivation";
import HabitLibraryPage from "@/pages/library/HabitLibraryPage"; // Import new HabitLibraryPage
import Experts from "@/pages/experts-unified";
import HabitBuilding from "@/pages/habit-building";
import Branding from "@/pages/branding";
import Contact from "@/pages/contact";
import AIFeatures from "@/pages/ai-features";
import FirebaseConfig from "@/pages/firebase-config";
import { AppLayout } from "@/components/layout/AppLayout"; // Import AppLayout


// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, pageTitle, ...rest }: any) { // Added pageTitle prop
  // --- FIX: Changed 'userLoading' to 'loading' to match the context provider ---
  const { user, loading } = useUser();
  const [location] = useLocation();
  
  // This will now correctly show the loading state while Firebase initializes.
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }
  
  // After loading is false, this check will correctly redirect if there's no user.
  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }
  
  // If there is a user, the component will be rendered within AppLayout.
  // Note: pageTitle is passed here. Specific titles per route will be set below.
  return (
    <AppLayout pageTitle={pageTitle || "MaxiMost"}>
      <Component {...rest} />
    </AppLayout>
  );
}

function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {() => {
          const { user, loading } = useUser();
          
          // Wait for auth check to complete before deciding on redirect
          if (loading) {
            return <div className="min-h-screen flex items-center justify-center bg-gray-900"></div>; // Or a splash screen
          }
          
          if (user) {
            // If user is logged in, redirect to dashboard
            return <Redirect to="/dashboard" />;
          }
          // If user is not logged in, show the intended homepage
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
        <PrivateRoute component={DashboardPage} pageTitle="Dashboard" />
      </Route>
      <Route path="/explore">
        <PrivateRoute component={ExplorePage} pageTitle="Explore" />
      </Route>
      <Route path="/profile">
        <PrivateRoute component={Profile} pageTitle="Profile" />
      </Route>
      <Route path="/workouts">
        <PrivateRoute component={Workouts} pageTitle="Workouts" />
      </Route>
      <Route path="/mind-spirit">
        <PrivateRoute component={MindSpirit} pageTitle="Mind & Spirit" />
      </Route>
      <Route path="/nutrition">
        <PrivateRoute component={Nutrition} pageTitle="Nutrition" />
      </Route>
      <Route path="/resources">
        <PrivateRoute component={Resources} pageTitle="Resources" />
      </Route>
      <Route path="/programs">
        <PrivateRoute component={Programs} pageTitle="Programs" />
      </Route>
      <Route path="/tasks">
        <PrivateRoute component={Tasks} pageTitle="Tasks" />
      </Route>
      {/* Updated /habits to /habit-library as per sidebar links */}
      <Route path="/habit-library">
         <PrivateRoute component={HabitLibraryPage} pageTitle="Habit Library" />
      </Route>
      <Route path="/habit-tracker">
        {/* This might be part of dashboard or a separate page for detailed tracking */}
        <PrivateRoute component={HabitTracker} pageTitle="Habit Tracker" />
      </Route>
      <Route path="/habit-stacks">
        <PrivateRoute component={HabitStacks} pageTitle="Habit Stacks" />
      </Route>
      <Route path="/ai-features">
        <PrivateRoute component={AIFeatures} pageTitle="AI Features" />
      </Route>
      <Route path="/supplements">
        <PrivateRoute component={Supplements} pageTitle="Supplements" />
      </Route>
      <Route path="/supplement-detail/:id">
        <PrivateRoute component={SupplementDetail} pageTitle="Supplement Detail" />
      </Route>
      <Route path="/research">
        <PrivateRoute component={Research} pageTitle="Research" />
      </Route>
      <Route path="/principles">
        <PrivateRoute component={Principles} pageTitle="Principles" />
      </Route>
      <Route path="/sugar">
        <PrivateRoute component={Sugar} pageTitle="Sugar Info" />
      </Route>
      <Route path="/body-stats">
        <PrivateRoute component={BodyStats} pageTitle="Body Stats" />
      </Route>
      <Route path="/community">
        <PrivateRoute component={Community} pageTitle="Community" />
      </Route>
      <Route path="/progress">
        <PrivateRoute component={Progress} pageTitle="Progress Overview" />
      </Route>
      {/* This is the "Track Progress" link from sidebar */}
      <Route path="/progress-dashboard">
        <PrivateRoute component={ProgressDashboard} pageTitle="Track Progress" />
      </Route>
      <Route path="/motivation">
        <PrivateRoute component={Motivation} pageTitle="Motivation" />
      </Route>
      <Route path="/experts">
        <PrivateRoute component={Experts} pageTitle="Experts" />
      </Route>
      <Route path="/experts-unified">
        <PrivateRoute component={Experts} pageTitle="Experts" />
      </Route>
      <Route path="/habit-building">
        <PrivateRoute component={HabitBuilding} pageTitle="Habit Building" />
      </Route>
      <Route path="/learn/atomic-habits">
        <PrivateRoute component={AtomicHabitsGuidePage} pageTitle="Atomic Habits Guide" />
      </Route>
      <Route path="/branding">
        <PrivateRoute component={Branding} pageTitle="Branding" />
      </Route>
      {/* New routes from sidebar that need pages to be created later */}
      <Route path="/integrations">
        {/* TODO: Create IntegrationsPage component */}
        <PrivateRoute component={() => <div>Integrations Page (TODO)</div>} pageTitle="Integrations" />
      </Route>
      <Route path="/journal">
        {/* TODO: Create JournalPage component */}
        <PrivateRoute component={() => <div>Journal Page (TODO)</div>} pageTitle="Journal" />
      </Route>

      {/* Public routes that should not have AppLayout */}
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/firebase-config" component={FirebaseConfig} />
      <Route path="/fitness-tracker-connect">
         {/* Assuming this might be a modal or a specific flow, might not need full AppLayout if it's a focused connection step.
             For now, applying AppLayout. Revisit if UX dictates otherwise. */}
        <PrivateRoute component={FitnessTrackerConnect} pageTitle="Connect Fitness Tracker" />
      </Route>

      {/* 404 Not Found route - this should ideally also use AppLayout if user is logged in and hits a bad private URL */}
      {/* For now, keeping it simple. A more robust solution would check auth status here too. */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
