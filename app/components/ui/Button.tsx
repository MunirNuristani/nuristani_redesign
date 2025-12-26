"use client";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    contained: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      error: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    },
    outlined: {
      primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      error: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    },
    text: {
      primary: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      secondary: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      error: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
    },
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant][color]}
        ${disabled ? disabledClasses : ''}
        ${widthClass}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {startIcon && <span className="mr-2 flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
    </button>
  );
}
