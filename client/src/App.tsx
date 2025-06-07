import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";

// Import the new homepage
import NewHomePage from "@/pages/NewHomePage"; // Added this import

// Other page imports (ensure these are maintained)
import Dashboard from "@/pages/sortable-dashboard-new"; // Was sortable-dashboard-new
import Profile from "@/pages/profile";
import Workouts from "@/pages/workouts";
import MindSpirit from "@/pages/mind-spirit";
import Nutrition from "@/pages/nutrition";
import Resources from "@/pages/resources";
import Programs from "@/pages/programs";
import Tasks from "@/pages/tasks";
// import Habits from "@/pages/habits"; // Original, replaced by IntegratedHabits
import UnifiedHabits from "@/pages/unified-habits"; // Still here, check usage
import IntegratedHabits from "@/pages/integrated-habits"; // Current for /habits
import HabitTracker from "@/pages/habit-tracker";
import HabitStacks from "@/pages/habit-stacks";
import Supplements from "@/pages/supplements-unified"; // Was supplements-unified
import FitnessTrackerConnect from "@/pages/fitness-tracker-connect";
import SupplementDetail from "@/pages/supplement-detail";
import Research from "@/pages/research";
import Principles from "@/pages/principles";
import Sugar from "@/pages/sugar";
import BodyStats from "@/pages/body-stats";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
// import Home from "@/pages/home"; // Old Home component, will be replaced by NewHomePage for / and /home routes
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import Progress from "@/pages/progress";
import ProgressDashboard from "@/pages/progress-dashboard";
import Gamification from "@/pages/gamification";
import Motivation from "@/pages/motivation";
import Experts from "@/pages/experts-unified"; // Was experts-unified
import HabitBuilding from "@/pages/habit-building";
import Branding from "@/pages/branding";
import Contact from "@/pages/contact";
import AIFeatures from "@/pages/ai-features";
import FirebaseConfig from "@/pages/firebase-config";


// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, userLoading } = useUser();
  const [location] = useLocation();
  
  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }
  
  return <Component {...rest} />;
}

function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {() => {
          const { user } = useUser(); // No userLoading check needed here as PrivateRoute handles it
          if (user) {
            // If user is logged in and tries to go to "/", redirect to dashboard
            return <Redirect to="/dashboard" />;
          }
          // If user is not logged in, show the new homepage
          return <NewHomePage />;
        }}
      </Route>
      <Route path="/home" component={NewHomePage} /> {/* /home now also shows NewHomePage */}

      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected routes - Ensure all existing private routes are maintained */}
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
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
      <Route path="/experts-unified"> {/* This might be redundant if /experts is the canonical one */}
        <PrivateRoute component={Experts} />
      </Route>
      <Route path="/habit-building">
        <PrivateRoute component={HabitBuilding} />
      </Route>
      <Route path="/branding">
        <PrivateRoute component={Branding} />
      </Route>
      <Route path="/contact" component={Contact} /> {/* Assuming Contact can be public or handles its own auth */}
      <Route path="/pricing" component={Pricing} /> {/* Assuming Pricing can be public */}
      <Route path="/firebase-config" component={FirebaseConfig} /> {/* Assuming this is a dev/test page */}
      <Route path="/fitness-tracker-connect">
        <PrivateRoute component={FitnessTrackerConnect} />
      </Route>
      
      {/* Test pages that were removed in earlier cleanup are confirmed not present here */}
      {/* <Route path="/habit-view-test"><PrivateRoute component={HabitViewTest} /></Route> */}
      {/* <Route path="/sortable-view-test"><PrivateRoute component={SortableViewTest} /></Route> */}

      {/* 404 Not Found route - Must be last */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
