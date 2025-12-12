import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Schedule from "@/pages/Schedule";
import Teams from "@/pages/Teams";
import Results from "@/pages/Results";
import Blocked from "@/pages/Blocked";
import VIP from "@/pages/VIP";
import Help from "@/pages/Help";
import Rules from "@/pages/Rules";
import Contact from "@/pages/Contact";
import Profile from "@/pages/Profile";
import RegisterTeam from "@/pages/RegisterTeam";
import Admin from "@/pages/Admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/teams" component={Teams} />
          <Route path="/results" component={Results} />
          <Route path="/blocked" component={Blocked} />
          <Route path="/vip" component={VIP} />
          <Route path="/help" component={Help} />
          <Route path="/rules" component={Rules} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/teams" component={Teams} />
          <Route path="/results" component={Results} />
          <Route path="/blocked" component={Blocked} />
          <Route path="/vip" component={VIP} />
          <Route path="/help" component={Help} />
          <Route path="/rules" component={Rules} />
          <Route path="/contact" component={Contact} />
          <Route path="/profile" component={Profile} />
          <Route path="/register-team" component={RegisterTeam} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
