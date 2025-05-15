import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  withLogo?: boolean;
}

export function Loading({ 
  size = 'medium',
  text = 'Loading...',
  withLogo = true
}: LoadingProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {withLogo && (
        <img 
          src="/maximost-logo-0.png"
          alt="MaxiMost Loading"
          className={`${sizeClasses[size]} mb-4 object-contain animate-pulse`}
        />
      )}
      
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-t-blue-600 border-b-blue-600 border-r-blue-300 border-l-blue-300 animate-spin`} />
      </div>
      
      {text && (
        <p className={`${textSizes[size]} mt-4 text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}