// Temporary App.tsx for diagnostic purposes (FIX-21 Step 3)
import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter"; // Keep wouter for minimal routing
import Login from '@/pages/login'; // Corrected import name
import { UserContext } from '@/context/user-context';
import { auth, listenToAuthChanges } from "@/lib/firebase"; // Minimal Firebase imports
import { User as FirebaseUser } from "firebase/auth";

function App() {
  const [appUser, setAppUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [, navigate] = useLocation();
  const handleLogout = async () => {
    console.log("FIX-21 Step 3: Mock logout called");
    // In a real scenario, you'd call Firebase signOut here
    setAppUser(null); // Simulate logout
    navigate('/');
  };

  useEffect(() => {
    console.log("FIX-21 Step 3: Auth useEffect running");
    // Not including getRedirectResult for this specific test to keep it minimal
    const unsubscribe = listenToAuthChanges((user) => {
      console.log("FIX-21 Step 3: Auth state changed, Firebase user:", user ? user.uid : null, user);
      setAppUser(user);
      setIsAuthLoading(false);
      console.log("FIX-21 Step 3: appUser set to:", user ? user.uid : null, "isAuthLoading set to false");
    });
    return () => {
      console.log("FIX-21 Step 3: Unsubscribing auth listener");
      unsubscribe();
    };
  }, []); // Empty dependency array, runs once

  console.log("FIX-21 Step 3: App rendering. isAuthLoading:", isAuthLoading, "appUser:", appUser ? appUser.uid : null);
  if (isAuthLoading) {
    return <div style={{ padding: '2rem', color: 'black', backgroundColor: 'orange' }}>App Loading Auth... (FIX-21 Step 3)</div>;
  }

  return (
    <UserContext.Provider value={{ user: appUser, loading: isAuthLoading, error: authError, logout: handleLogout }}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Login} /> {/* Default to login for this test */}
        <Route>
          <div style={{ padding: '2rem', color: 'white', backgroundColor: 'darkred' }}>404 Not Found (FIX-21 Step 3)</div>
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}
export default App;
