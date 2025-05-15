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
          className={`${sizeClasses[size]} object-contain`}
          onError={(e) => {
            // If the image fails to load, retry with an absolute path
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('https://')) {
              // Try a different approach with the public path
              target.src = `${window.location.origin}/maximost-logo-1.png`;
            }
          }}
        />
        {textVisible && (
          <span className="ml-2 font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            MaxiMost
          </span>
        )}
      </div>
    </div>
  );
}