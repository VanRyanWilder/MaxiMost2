import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-6', // Base styles, added padding
        className // Allow overriding or adding more styles
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlassCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
);

export const GlassCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-xl font-semibold leading-none tracking-tight text-white', className)} {...props} />
);

export const GlassCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-gray-300', className)} {...props} />
);

export const GlassCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  // GlassCard itself provides the main padding. Content might not need its own default padding.
  <div className={cn('', className)} {...props} />
);

export const GlassCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center pt-4', className)} {...props} />
);
