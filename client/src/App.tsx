import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
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
import BodyStats from "@/pages/body-stats";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/mind-spirit" component={MindSpirit} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/resources" component={Resources} />
      <Route path="/programs" component={Programs} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/supplements" component={Supplements} />
      <Route path="/body-stats" component={BodyStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="beastmode-theme">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
