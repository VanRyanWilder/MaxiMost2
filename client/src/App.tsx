// Temporary App.tsx for diagnostic purposes (FIX-21 Step 2)
import React from 'react';
import Login from '@/pages/login'; // Changed from LoginPage to Login to match actual component export

function App() {
  console.log("FIX-21 Step 2: Testing Login component in isolation");
  return <Login />;
}
export default App;
