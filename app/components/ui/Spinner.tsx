"use client";
import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function Spinner({ size = 'medium', color = 'primary', className = '' }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
