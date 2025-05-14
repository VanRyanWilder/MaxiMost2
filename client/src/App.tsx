import { Switch, Route, Redirect, useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Workouts from "@/pages/workouts";
import MindSpirit from "@/pages/mind-spirit";
import Nutrition from "@/pages/nutrition";
import Resources from "@/pages/resources";
import Programs from "@/pages/programs";
import Tasks from "@/pages/tasks";
import Supplements from "@/pages/supplements";
import SupplementsNew from "@/pages/supplements-new";
import BodyStats from "@/pages/body-stats";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import Principles from "@/pages/principles";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import Progress from "@/pages/progress";
import Motivation from "@/pages/motivation";
import Research from "@/pages/research";
import Sugar from "@/pages/sugar";
import Experts from "@/pages/experts";

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
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected routes */}
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
      <Route path="/supplements">
        <PrivateRoute component={Supplements} />
      </Route>
        
      <Route path="/supplements-top10">
        <PrivateRoute component={SupplementsNew} />
      </Route>
      <Route path="/body-stats">
        <PrivateRoute component={BodyStats} />
      </Route>
      
      <Route path="/principles">
        <PrivateRoute component={Principles} />
      </Route>
      
      <Route path="/community">
        <PrivateRoute component={Community} />
      </Route>
      
      <Route path="/progress">
        <PrivateRoute component={Progress} />
      </Route>
      
      <Route path="/motivation">
        <PrivateRoute component={Motivation} />
      </Route>
      
      <Route path="/research">
        <PrivateRoute component={Research} />
      </Route>
      
      <Route path="/sugar">
        <PrivateRoute component={Sugar} />
      </Route>
      
      <Route path="/experts">
        <PrivateRoute component={Experts} />
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
