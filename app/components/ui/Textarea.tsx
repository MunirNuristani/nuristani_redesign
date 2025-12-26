"use client";
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth, className, ...props }, ref) => {
    const baseClasses =
      'px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';

    const widthClass = fullWidth ? 'w-full' : '';

    const stateClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    const disabledClasses = props.disabled
      ? 'bg-gray-100 cursor-not-allowed opacity-60'
      : 'bg-white';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseClasses} ${widthClass} ${stateClasses} ${disabledClasses} ${className || ''}`}
          {...props}
        />
        {helperText && (
          <p className={`text-sm mt-1.5 ${error ? 'text-red-500' : 'text-gray-600'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
