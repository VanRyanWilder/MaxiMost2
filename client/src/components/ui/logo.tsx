import React from 'react';
import { useLocation } from 'wouter';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  textVisible?: boolean;
}

export function Logo({ 
  className = '', 
  size = 'medium', 
  textVisible = true 
}: LogoProps) {
  const [_, navigate] = useLocation();
  
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-12'
  };

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div 
      className={`flex items-center ${className} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <img 
          src="/maximost-logo-1.png" 
          alt="MaxiMost Logo" 
          className={`${sizeClasses[size]} object-contain mr-1`}
          onError={(e) => {
            // Log the error for debugging
            console.log("Logo load error, trying fallback path");
            
            // If the image fails to load, try multiple fallback paths
            const target = e.target as HTMLImageElement;
            
            if (target.src.includes('maximost-logo-1.png')) {
              // Try the other logo variant that we know exists
              target.src = `${window.location.origin}/maximost-logo-0.png`;
              console.log("Trying alternate logo:", target.src);
            }
          }}
        />
        {textVisible && (
          <span className="ml-1 font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MaxiMost
          </span>
        )}
      </div>
    </div>
  );
}