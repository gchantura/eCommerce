/**
 * Button Component
 * 
 * A reusable button component that provides consistent styling
 * and behavior across the application.
 * 
 * Features:
 * - Extends HTML button attributes
 * - Optional full width styling
 * - Consistent hover and disabled states
 * - Accessible focus states
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;      // Whether button should take full width
}

export default function Button({ 
  children, 
  fullWidth, 
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button
      // Combine default styles with optional fullWidth and custom classes
      className={`
        px-4 py-2 
        bg-blue-600 
        text-white 
        rounded 
        hover:bg-blue-700 
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
} 