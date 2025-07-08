import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string; // Allow additional classes for flexibility
}

export function PageContainer({ children, className }: PageContainerProps) {
  // This component now primarily provides a max-width centered container.
  // Padding should be handled by AppLayout or the page itself if specific padding is needed.
  return (
    <div className={`container mx-auto ${className || ''}`}>
      {children}
    </div>
  );
}