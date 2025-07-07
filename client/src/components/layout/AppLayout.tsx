import React, { useState } from 'react';
import { ModernSidebar } from './modern-sidebar'; // Assuming this is the chosen sidebar

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

  return (
    <div className="flex h-screen bg-background text-foreground">
      <ModernSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* You might want a MobileHeader here or integrate toggle into a main Header */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 m-2 bg-muted rounded-md fixed top-2 left-2 z-50" // Simple toggle for mobile
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
