"use client";
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export default function Select({
  label,
  options,
  error = false,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-600' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          ${widthClass}
          px-3 py-2 rounded-lg border-2 transition-all duration-200
          focus:outline-none focus:ring-2
          ${error
            ? 'border-red-500 focus:ring-red-500 text-red-900'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900'
          }
          bg-white cursor-pointer
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
