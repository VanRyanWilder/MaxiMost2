import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";

// Import the intended homepage
import Home from "@/pages/home"; // Changed from NewHomePage

// Other page imports
import Dashboard from "@/pages/sortable-dashboard-new";
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
import Progress from "@/pages/progress";
import ProgressDashboard from "@/pages/progress-dashboard";
import Gamification from "@/pages/gamification";
import Motivation from "@/pages/motivation";
import Experts from "@/pages/experts-unified";
import HabitBuilding from "@/pages/habit-building";
import Branding from "@/pages/branding";
import Contact from "@/pages/contact";
import AIFeatures from "@/pages/ai-features";
import FirebaseConfig from "@/pages/firebase-config";


// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, ...rest }: any) {
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
  
  // If there is a user, the component will be rendered.
  return <Component {...rest} />;
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
      <Route path="/principles">
        <PrivateRoute component={Principles} />
      </Route>
      <Route path="/sugar">
        <PrivateRoute component={Sugar} />
      </Route>
      <Route path="/body-stats">
        <PrivateRoute component={BodyStats} />
      </Route>
      <Route path="/community">
        <PrivateRoute component={Community} />
      </Route>
      <Route path="/progress">
        <PrivateRoute component={Progress} />
      </Route>
      <Route path="/progress-dashboard">
        <PrivateRoute component={ProgressDashboard} />
      </Route>
      <Route path="/motivation">
        <PrivateRoute component={Motivation} />
      </Route>
      <Route path="/experts">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/experts-unified">
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/habit-building">
        <PrivateRoute component={HabitBuilding} />
      </Route>
      <Route path="/atomic-habits-guide"> {/* Add route for Atomic Habits Guide */}
        <PrivateRoute component={AtomicHabitsGuidePage} />
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

      {/* 404 Not Found route */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
