import React from 'react';
import { MobileHeader } from './mobile-header';
import { Sidebar } from './sidebar';
import { useState } from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64 w-full">
          <div className="px-4 py-6 pb-24">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold mb-6">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}