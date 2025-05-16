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

  // Use stylized logo with fallback to text logo
  return (
    <div 
      className={`flex items-center ${className} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md font-bold text-white mr-2">
          <span className="drop-shadow-sm">M</span>
        </div>
        
        {textVisible && (
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MaxiMost
          </span>
        )}
      </div>
    </div>
  );
}