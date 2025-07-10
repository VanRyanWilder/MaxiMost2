// Temporary App.tsx for diagnostic purposes (FIX-21 Step 4)
import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { AppLayout } from '@/components/layout/AppLayout'; // Ensure correct import
import { UserContext } from '@/context/user-context';
import { auth, listenToAuthChanges } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

function App() {
  const [appUser, setAppUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [, navigate] = useLocation();
  const handleLogout = async () => {
    console.log("FIX-21 Step 4: Mock logout called");
    setAppUser(null); // Simulate logout for context testing
    navigate('/');
  };

  useEffect(() => {
    console.log("FIX-21 Step 4: Auth useEffect running");
    const unsubscribe = listenToAuthChanges((user) => {
      console.log("FIX-21 Step 4: Auth state changed, Firebase user:", user ? user.uid : null, user);
      setAppUser(user);
      setIsAuthLoading(false);
      console.log("FIX-21 Step 4: appUser set to:", user ? user.uid : null, "isAuthLoading set to false");
    });
    return () => {
      console.log("FIX-21 Step 4: Unsubscribing auth listener");
      unsubscribe();
    };
  }, []);

  console.log("FIX-21 Step 4: App rendering. isAuthLoading:", isAuthLoading, "appUser:", appUser ? appUser.uid : null);
  if (isAuthLoading) {
    return <div style={{ padding: '2rem', color: 'black', backgroundColor: 'orange' }}>App Loading Auth... (FIX-21 Step 4)</div>;
  }

  return (
    <UserContext.Provider value={{ user: appUser, loading: isAuthLoading, error: authError, logout: handleLogout }}>
      <Switch>
        <Route path="/">
          <AppLayout>
            <div style={{ padding: '2rem', color: 'black', backgroundColor: 'lightgreen' }}>
              <h1>Testing App Layout (FIX-21 Step 4)</h1>
              <p>User ID: {appUser ? appUser.uid : "Guest"}</p>
              {appUser && <button onClick={handleLogout} style={{padding: '10px', margin: '10px', backgroundColor: 'lightblue'}}>Mock Logout</button>}
            </div>
          </AppLayout>
        </Route>
        <Route>
          <div style={{ padding: '2rem', color: 'white', backgroundColor: 'darkred' }}>404 Not Found (FIX-21 Step 4)</div>
        </Route>
      </Switch>
    </UserContext.Provider>
  );
}
export default App;
