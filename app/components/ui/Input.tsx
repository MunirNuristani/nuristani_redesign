"use client";
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export default function Input({
  label,
  error = false,
  helperText,
  fullWidth = false,
  variant = 'outlined',
  startAdornment,
  endAdornment,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseInputClasses = 'px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';

  const variantClasses = {
    outlined: `border-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`,
    filled: `bg-gray-100 ${error ? 'border-b-2 border-red-500' : 'border-b-2 border-gray-400 focus:border-blue-500'}`,
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-600' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {startAdornment}
          </div>
        )}
        <input
          id={inputId}
          className={`
            ${baseInputClasses}
            ${variantClasses[variant]}
            ${widthClass}
            ${startAdornment ? 'pl-10' : ''}
            ${endAdornment ? 'pr-10' : ''}
            ${error ? 'text-red-900' : 'text-gray-900'}
          `}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
