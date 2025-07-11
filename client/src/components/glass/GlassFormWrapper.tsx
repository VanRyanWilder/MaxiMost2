import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassFormWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  title?: string; // Optional title for the form
}

export const GlassFormWrapper: React.FC<GlassFormWrapperProps> = ({ children, className, title, ...props }) => {
  return (
    <div
      className={cn(
        'bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-6 md:p-8', // Base styles, added padding
        className // Allow overriding or adding more styles
      )}
      {...props}
    >
      {title && (
        <h2 className="text-xl font-semibold text-white mb-6">{title}</h2> // Title style
      )}
      {children}
    </div>
  );
};
