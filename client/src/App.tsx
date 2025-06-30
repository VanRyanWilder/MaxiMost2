import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";
import NewHomePage from "@/pages/NewHomePage";
import Dashboard from "@/pages/sortable-dashboard-new";
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
      {/* --- THIS IS THE CORRECTED LOGIC FOR THE HOMEPAGE --- */}
      <Route path="/">
        {() => {
          const { user, userLoading } = useUser();
          
          // Wait for the authentication check to complete
          if (userLoading) {
            return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
          }
          
          // If the check is done and a user exists, redirect to the dashboard
          if (user) {
            return <Redirect to="/dashboard" />;
          }
          
          // If the check is done and there is no user, show the new homepage
          return <NewHomePage />;
        }}
      </Route>
      <Route path="/home" component={NewHomePage} />

      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      
      {/* Protected routes */}
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/workouts" component={Workouts} />
      <PrivateRoute path="/mind-spirit" component={MindSpirit} />
      <PrivateRoute path="/nutrition" component={Nutrition} />
      <PrivateRoute path="/resources" component={Resources} />
      <PrivateRoute path="/programs" component={Programs} />
      <PrivateRoute path="/tasks" component={Tasks} />
      <PrivateRoute path="/habits" component={IntegratedHabits} />
      <PrivateRoute path="/habit-tracker" component={HabitTracker} />
      <PrivateRoute path="/habit-stacks" component={HabitStacks} />
      <PrivateRoute path="/ai-features" component={AIFeatures} />
      <PrivateRoute path="/supplements" component={Supplements} />
      <PrivateRoute path="/supplement-detail/:id" component={SupplementDetail} />
      <PrivateRoute path="/research" component={Research} />
      <PrivateRoute path="/principles" component={Principles} />
      <PrivateRoute path="/sugar" component={Sugar} />
      <PrivateRoute path="/body-stats" component={BodyStats} />
      <PrivateRoute path="/community" component={Community} />
      <PrivateRoute path="/progress" component={Progress} />
      <PrivateRoute path="/progress-dashboard" component={ProgressDashboard} />
      <PrivateRoute path="/motivation" component={Motivation} />
      <PrivateRoute path="/experts" component={Experts} />
      <PrivateRoute path="/habit-building" component={HabitBuilding} />
      <PrivateRoute path="/branding" component={Branding} />
      <PrivateRoute path="/firebase-config" component={FirebaseConfig} />
      <PrivateRoute path="/fitness-tracker-connect" component={FitnessTrackerConnect} />
      
      {/* 404 Not Found route - Must be last */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
