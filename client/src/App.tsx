import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";

// Using our fixed sortable dashboard with drag-and-drop and all features
import Dashboard from "@/pages/sortable-dashboard-new";
import Profile from "@/pages/profile";
import Workouts from "@/pages/workouts";
import MindSpirit from "@/pages/mind-spirit";
import Nutrition from "@/pages/nutrition";
import Resources from "@/pages/resources";
import Programs from "@/pages/programs";
import Tasks from "@/pages/tasks";
import Habits from "@/pages/habits";
import UnifiedHabits from "@/pages/unified-habits";
import IntegratedHabits from "@/pages/integrated-habits";
import HabitTracker from "@/pages/habit-tracker"; // New weekly calendar habit tracker
import HabitStacks from "@/pages/habit-stacks";
// Individual pages for performance cornerstones (previously four pillars)
import Supplements from "@/pages/supplements-unified";
import SupplementDetail from "@/pages/supplement-detail";
import Research from "@/pages/research";
import Principles from "@/pages/principles";
import Sugar from "@/pages/sugar";
import BodyStats from "@/pages/body-stats";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
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
import HabitViewTest from "@/pages/habit-view-test";
import SortableViewTest from "@/pages/sortable-view-test";
import AIFeatures from "@/pages/ai-features";

// Route guard to protect pages that require authentication
function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, userLoading } = useUser();
  const [location] = useLocation();
  
  // Still loading - show nothing or a loading spinner
  if (userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not logged in, redirect to login
  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }
  
  // User is authenticated, render the component
  return <Component {...rest} />;
}

function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/">
        {() => {
          const { user } = useUser();
          if (user) {
            return <Redirect to="/dashboard" />;
          }
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
      <Route path="/habit-view-test">
        <PrivateRoute component={HabitViewTest} />
      </Route>
      <Route path="/sortable-view-test">
        <PrivateRoute component={SortableViewTest} />
      </Route>
      {/* Integrated sortable dashboard into main dashboard */}
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
      
      <Route path="/branding">
        <PrivateRoute component={Branding} />
      </Route>
      
      <Route path="/contact">
        <Route component={Contact} />
      </Route>
      
      <Route path="/pricing">
        <Route component={Pricing} />
      </Route>
      
      {/* 404 Not Found route */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
