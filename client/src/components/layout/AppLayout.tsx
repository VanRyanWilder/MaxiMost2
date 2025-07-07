import React, { useState } from 'react';
import { Sidebar } from './Sidebar'; // Updated import from ModernSidebar to Sidebar
import { TopHeader } from './TopHeader';     // Import the new TopHeader

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopHeader onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden"> {/* This div will contain sidebar and main content */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* The old mobile toggle button is now part of TopHeader */}
          <div className="flex-1 p-4 md:p-6 lg:p-8"> {/* Ensure content area is scrollable */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
