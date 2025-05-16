import React, { useState } from 'react';
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

  // Try to use the actual logo image with multiple fallback options
  const [logoError, setLogoError] = useState(false);
  
  return (
    <div 
      className={`flex items-center ${className} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {!logoError ? (
          <img 
            src="/images/maximost-alt-logo.png" 
            alt="MaxiMost Logo" 
            className={`${sizeClasses[size]} object-contain mr-2`}
            onError={(e) => {
              console.log("Primary logo failed to load, trying fallbacks");
              // Try fallback logos in sequence
              const target = e.target as HTMLImageElement;
              target.src = "/images/maximost-alt-logo2.png";
              
              // If this also fails, try another fallback
              target.onerror = () => {
                console.log("First fallback failed, trying second fallback");
                target.src = "/images/maximost-logo-0.png";
                
                // If all image fallbacks fail, use the text logo
                target.onerror = () => {
                  console.log("All logo images failed, using text fallback");
                  setLogoError(true);
                };
              };
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 font-bold text-white mr-2">
            M
          </div>
        )}
        
        {textVisible && (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MaxiMost
          </span>
        )}
      </div>
    </div>
  );
}